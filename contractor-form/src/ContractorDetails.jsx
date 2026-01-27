import { Container, Row, Col, Card, Badge, Table, Form, Button, Spinner } from "react-bootstrap";
import { Gavel, UserRound, Mail, Package, Paperclip, FileText, Download, FileImage, FileSpreadsheet, ClipboardCheck, Pencil, Send, ImportIcon, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

const LoadingOverlay = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(2px)'
  }}>
    <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
    <h5 className="mt-3 text-primary fw-bold">Processing...</h5>
  </div>
);

function ContractorDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const tenderId = params.get("tenderId");
  const negotiationId = params.get("negotiationId");

  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token"));
  const [tender, setTender] = useState(null);
  const [contractor, setContractor] = useState(null);
  const [attachmentData, setAttachmentData] = useState(null);
  const [boqItems, setBoqItems] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [version, setVersion] = useState(null);
  const [pageStatus, setPageStatus] = useState("LOADING");
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: "", message: "" });
  const [headerStatus, setHeaderStatus] = useState({ text: "Loading...", bg: "#F3F4F6", color: "#6B7280" });

  const fileInputRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const attachmentTypes = [
    { title: "Technical Specifications", urlKey: "technicalTermsUrl", textKey: "technicalTerms", icon: <FileText size={24} className="text-danger" /> },
    { title: "Drawings", urlKey: "drawingUrl", textKey: "drawings", icon: <FileImage size={24} className="text-primary" /> },
    { title: "Commercial Conditions", urlKey: "commercialTermsUrl", textKey: "commercialTerms", icon: <FileSpreadsheet size={24} className="text-success" /> },
    { title: "Others", urlKey: "otherUrl", textKey: "others", icon: <FileText size={24} style={{ color: '#64748B' }} /> }
  ];
  useEffect(() => {
    if (!id || !tenderId) {
      setPageStatus("INVALID");
      setErrorDetails({ title: "Invalid Link", message: "The link you followed is incomplete or incorrect." });
      return;
    }

    axios.get(`${baseUrl}/validateTenderInvite?id=${id}&tenderId=${tenderId}`)
      .then(response => {
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        setAuthToken(token);

        Promise.all([
          fetchTenderDetails(token),
          fetchAttachments(token),
          fetchContractorDetails(token),
          negotiationId ? fetchNegotiationDetails(token) : Promise.resolve()
        ]).then(([initialBoq, , , versionVal]) => {
          if (versionVal) {
            fetchOfferDetails(token, versionVal);
          }
        }).catch((error) => {
          console.error("Error loading initial data:", error);
          setPageStatus("INVALID");
          setErrorDetails({ title: "Error Loading Data", message: "Unable to fetch tender details." });
        });
      })
      .catch(error => {
        let status = "INVALID";
        let title = "Invalid Invitation";
        let msg = "We could not verify your invitation. Please contact the administrator.";

        if (error.response) {
          const errorMessage = typeof error.response.data === 'string'
            ? error.response.data.toLowerCase()
            : '';

          if (error.response.status === 409 || errorMessage.includes("submitted")) {
            status = "SUBMITTED";
            title = "Quote Already Submitted";
            msg = "You have already submitted your quote for this tender.";
          } else if (errorMessage.includes("expired")) {
            status = "EXPIRED";
            title = "Invitation Expired";
            msg = "This tender invitation link has expired.";
          }
        }
        setPageStatus(status);
        setErrorDetails({ title, message: msg });
      });
  }, [id, tenderId, baseUrl, negotiationId]);

  const fetchTenderDetails = async (token) => {
    return await axios.get(`${baseUrl}/tender/${tenderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.data) {
        setTender(res.data);
        if (res.data.boq) {
          const initialBoq = res.data.boq.map(item => ({
            ...item,
            rate: item.totalRate || 0,
            amount: item.totalAmount || 0
          }));
          setBoqItems(initialBoq);
          setPageStatus("CONTENT");
          return initialBoq;
        }
        setPageStatus("CONTENT");
        return [];
      }
    });
  };

  const fetchContractorDetails = async (token) => {
    if (!id) return;
    const res = await axios.get(`${baseUrl}/contractor/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data) {
      setContractor(res.data);
    }
  };

  const fetchAttachments = async (token) => {
    try {
      const res = await axios.get(`${baseUrl}/tenderAttachments/${tenderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.data) {
        setAttachmentData(res.data);
      } else {
        setAttachmentData(null);
      }
    } catch (err) {
      console.log(err);
      setAttachmentData(null);
    }
  };

  const fetchNegotiationDetails = async (token) => {
    if (!negotiationId) return;
    try {
      const res = await axios.get(`${baseUrl}/tender-offer?negotiationId=${negotiationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        setVersion(res.data);
        return res.data;
      }
    } catch (error) {
      console.error("Error fetching negotiation details:", error);
    }
  };

  const fetchOfferDetails = async (token, offerVersion) => {
    try {
      const res = await axios.get(`${baseUrl}/offer-details?tenderId=${tenderId}&contractorId=${id}&offerVersion=${offerVersion}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 200) {
        const data = res.data;
        if (data.paymentTerms) {
          setPaymentTerms(Array.isArray(data.paymentTerms) ? data.paymentTerms.join('\n') : data.paymentTerms);
        }
        if (data.boq) {
          const mappedBoq = data.boq.map((item) => ({
            ...item,
            rate: item.totalRate || item.rate || 0,
            amount: item.totalAmount || item.amount || 0
          }));
          setBoqItems(mappedBoq);
        }
      }
    } catch (error) {
      console.error("Error fetching offer details:", error);
    }
  };

  useEffect(() => {
    if (tender) {
      const updateTimer = () => {
        const now = new Date();
        const openDate = tender.bidOpeningdate ? new Date(tender.bidOpeningdate) : null;
        const endDate = tender.lastDate ? new Date(tender.lastDate) : null;

        if (openDate && now < openDate) {
          const diff = openDate - now;
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          let timeString = days > 0
            ? `${String(days).padStart(2, '0')} Day`
            : `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;

          setHeaderStatus({
            text: `Bid Opening in: ${timeString}`,
            bg: "#FEFCE8",
            color: "#CA8A04"
          });

        } else if (endDate) {
          const diff = endDate - now;
          if (diff <= 0) {
            setHeaderStatus({
              text: "Expired",
              bg: "#FFF1F2",
              color: "#DC2626"
            });
          } else {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            let timeString = days > 0
              ? `${String(days).padStart(2, '0')} Days`
              : `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;

            setHeaderStatus({
              text: `Time Remaining: ${timeString}`,
              bg: "#FFF1F2",
              color: "#DC2626"
            });
          }
        } else {
          setHeaderStatus({ text: "", bg: "transparent", color: "inherit" });
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [tender]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
  };

  const isBidOpeningPending = () => {
    if (!tender?.bidOpeningdate) return false;
    const now = new Date();
    const openDate = new Date(tender.bidOpeningdate);
    return now < openDate;
  };

  const getFileName = (path) => {
    if (!path) return "Unknown File";
    return path.split(/[/\\]/).pop();
  };

  const handleImportClick = () => {
    if (isBidOpeningPending()) {
      toast.error("Bid opening date has not been reached yet.");
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${baseUrl}/getExtractedContent`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        const extractedData = response.data;
        const updatedBoqItems = boqItems.map(item => {
          const match = extractedData.find(ex => ex.boqCode === item.boqCode);
          if (match) {
            const newRate = match.rate || 0;
            return {
              ...item,
              rate: newRate,
              amount: newRate * (item.quantity || 0)
            };
          }
          return item;
        });
        setBoqItems(updatedBoqItems);
        toast.success("Excel imported successfully");
      }
    } catch (error) {
      console.error("Error importing Excel:", error);
      toast.error("Failed to import Excel data. Please check the file format.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsLoading(false);
    }
  };

  const handleRateChange = (index, newRate) => {
    const rate = parseFloat(newRate) || 0;
    const updatedBoqItems = [...boqItems];
    updatedBoqItems[index].rate = rate;
    updatedBoqItems[index].amount = rate * (updatedBoqItems[index].quantity || 0);
    setBoqItems(updatedBoqItems);
  };

  const getTotalEstimatedOffer = () => {
    return boqItems.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2);
  };

  const handleSubmitOffer = async () => {
    if (isBidOpeningPending()) {
      toast.error("Bid opening date has not been reached yet. You cannot submit an offer.");
      return;
    }

    if (!boqItems || boqItems.length === 0) {
      toast.error("No BOQ items found to submit.");
      return;
    }

    setIsLoading(true);

    try {
      const boqRateList = boqItems.map(item => {
        return {
          [item.boqId]: parseFloat(item.rate) || 0.0
        };
      });

      const paymentTermsList = paymentTerms
        ? paymentTerms.split('\n').map(term => term.trim()).filter(term => term.length > 0)
        : [];

      const payload = {
        tenderId: tenderId,
        contractorId: id,
        boqRate: boqRateList,
        paymentTerms: paymentTermsList
      };

      const response = await axios.post(`${baseUrl}/submitOffer`, payload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Offer submitted successfully!");
        setPageStatus("SUBMITTED");
        setErrorDetails({
          title: "Offer Submitted Successfully",
          message: "Your quotation has been received. You can close this window."
        });
      }

    } catch (error) {
      console.error("Error submitting offer:", error);

      let errorMessage = "Failed to submit your offer. Please try again.";
      if (error.response && error.response.data) {
        errorMessage = typeof error.response.data === 'string'
          ? error.response.data
          : (error.response.data.message || errorMessage);
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (pageStatus === "LOADING") {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 text-muted fw-medium">Verifying Invitation...</p>
      </div>
    );
  }

  if (pageStatus === "INVALID" || pageStatus === "EXPIRED" || pageStatus === "SUBMITTED") {
    const getIcon = () => {
      if (pageStatus === "EXPIRED") return <Clock size={48} className="text-warning mb-3" />;
      if (pageStatus === "SUBMITTED") return <CheckCircle size={48} className="text-success mb-3" />;
      return <AlertCircle size={48} className="text-danger mb-3" />;
    };

    return (
      <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: '#F8F9FA' }}>
        <Card className="text-center shadow-sm border-0" style={{ maxWidth: '450px', width: '90%' }}>
          <Card.Body className="p-5">
            {getIcon()}
            <h4 className="fw-bold text-dark mb-2">{errorDetails.title}</h4>
            <p className="text-muted mb-4">{errorDetails.message}</p>
            <Button variant="primary" onClick={() => window.location.reload()} className="px-4">
              Refresh Page
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {isLoading && <LoadingOverlay />}

      <div className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white" style={{ height: "84px" }}>
        <div className="d-flex flex-column lh-sm">
          <div className="fw-bold fs-4 text-primary">TACTIVE</div>
          <div className="small text-muted">PRACTISING VALUES</div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{ backgroundColor: headerStatus.bg, color: headerStatus.color, fontSize: "0.85rem", fontWeight: 500 }} >
            <span className="d-inline-block rounded-circle" style={{ width: "8px", height: "8px", backgroundColor: headerStatus.color }}></span>
            {headerStatus.text}
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ width: "34px", height: "34px", backgroundColor: "#2563EB", fontSize: "0.85rem", fontWeight: "600" }} >
              {contractor?.entityName ? contractor.entityName.charAt(0) : 'C'}
            </div>
            <div className="text-end">
              <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                {contractor?.entityName || 'Contractor'}
              </div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                Contractor Code : {contractor?.entityCode || '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', width: '100%' }}>
        <Container fluid className="p-4" style={{ width: '95%', margin: '0 auto' }}>
          <Row className="g-4 align-items-stretch">
            <Col lg={9}>
              <Card className="border rounded-3 h-100" style={{ borderColor: "#0051973D" }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-primary"><Gavel size={28} /></div>
                      <h5 className="mb-0 fw-bold" style={{ fontSize: '1.25rem' }}>
                        Tender Floated Details – {tender?.tenderName}
                      </h5>
                    </div>
                    <div className="d-flex gap-5 text-end">
                      <div>
                        <div className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>Floating No</div>
                        <div className="fw-bold text-dark">{tender?.tenderNumber}</div>
                      </div>
                      <div>
                        <div className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>Floating Date</div>
                        <div className="text-muted fw-normal" style={{ fontSize: '0.95rem' }}>{formatDate(tender?.floatedOn)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Badge bg="none" className="rounded-pill px-3 py-2 fw-normal" style={{ backgroundColor: '#F3F8FF', color: '#2563EB', fontSize: '0.9rem' }}>
                      Tender Name : {tender?.tenderName}
                    </Badge>
                  </div>
                  <Row className="g-3">
                    <Col md={4}>
                      <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#F8FAFC' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Offer Submission Mode</div>
                        <div className="fw-bold text-dark fs-5">{tender?.offerSubmissionMode}</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#F8FAFC' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Bid Opening</div>
                        <div className="fw-bold text-dark fs-5">
                          {isBidOpeningPending() ? `${formatDate(tender?.bidOpeningdate)}` : formatDate(tender?.bidOpeningdate)}
                        </div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="p-4 rounded-4 h-100 position-relative" style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #DC2626" }}>
                        <div className="text-danger mb-3" style={{ fontSize: '0.85rem', fontWeight: '500' }}>Submission Last Date</div>
                        <div className="fw-bold fs-5" style={{ color: '#D90707' }}>{formatDate(tender?.lastDate)}</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={3}>
              <Card className="border rounded-3 h-100 text-white" style={{ background: "linear-gradient(135deg, #005197, #007BFF)", borderColor: "#0051973D" }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-2 mb-4">
                    <UserRound size={20} style={{ color: '#FFD700' }} />
                    <h5 className="mb-0 fw-normal">Contact Person</h5>
                  </div>
                  <div className="mb-3">
                    <div className="opacity-75" style={{ fontSize: '0.85rem' }}>Name</div>
                    <div className="fw-normal">{tender?.contactName}</div>
                  </div>
                  <div className="mb-3">
                    <div className="opacity-75" style={{ fontSize: '0.85rem' }}>Phone</div>
                    <div className="fw-normal">{tender?.contactNumber}</div>
                  </div>
                  <div>
                    <div className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Email</div>
                    <Badge bg="white" className="rounded-pill px-3 py-2 d-flex align-items-center border-0" style={{ width: 'fit-content' }}>
                      <Mail size={16} className="me-2" style={{ color: '#2563EB' }} />
                      <span className="fw-normal" style={{ color: '#2563EB', fontSize: '0.8rem' }}>{tender?.contactEmail}</span>
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="mt-4 border rounded-3 h-100" style={{ borderColor: "#0051973D" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Package size={20} className="text-primary" />
                <h5 className="mb-0 fw-bold text-dark">Scope of Work & Scope of Packages</h5>
              </div>
              <div className="d-flex flex-wrap gap-3">
                {tender?.scopeOfPackages?.map((pkg) => (
                  <Badge key={pkg.id} pill bg="none" className="px-3 py-2 fw-normal" style={{ backgroundColor: '#EBF2FF', color: '#3B82F6', fontSize: '0.85rem' }}>
                    {pkg.scope}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="border rounded-3 mt-4 h-100" style={{ borderColor: "#0051973D" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <Paperclip size={20} className="text-primary" style={{ transform: 'rotate(15deg)' }} />
                <h5 className="mb-0 fw-bold text-dark">Attachments</h5>
              </div>
              <div className="d-flex flex-column gap-3">
                {attachmentData ? (
                  attachmentTypes.map((type, index) => {
                    const urls = attachmentData[type.urlKey];
                    const comments = attachmentData[type.textKey];
                    if (urls && Array.isArray(urls) && urls.length > 0) {
                      return (
                        <div key={index} className="p-3 rounded-4" style={{ backgroundColor: '#F8FAFC' }}>
                          <div className="d-flex align-items-center gap-2 mb-3 border-bottom pb-2">
                            {type.icon}
                            <h6 className="mb-0 fw-bold text-dark">{type.title}</h6>
                          </div>
                          <div className="d-flex flex-column gap-2">
                            {urls.map((url, urlIndex) => (
                              <div key={`${index}-${urlIndex}`} className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 border">
                                <div>
                                  <div className="fw-medium text-dark">{getFileName(url)}</div>
                                </div>
                                <a href={url} download target="_blank" rel="noopener noreferrer">
                                  <Download size={20} className="text-primary" />
                                </a>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 text-muted small px-1">
                            <span className="fw-semibold">Description: </span> {comments || "No comments provided"}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })
                ) : (
                  <div className="text-center p-4 text-muted">No attachments available</div>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card className="border rounded-3 mt-4 overflow-hidden" style={{ borderColor: "#0051973D" }}>
            <Card.Body className="p-4 pb-0">
              <div className="d-flex align-items-center justify-content-between gap-2 mb-1">
                <div className="text-primary d-flex align-items-center">
                  <ClipboardCheck size={24} />
                  <div className="ms-2 mt-3 align-items-center">
                    <p className="mb-0 fw-bold text-dark text-start">Package Details</p>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                      Quote your rates for the items below, or use the Excel file shared via email.
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                />
                <button
                  className="btn bg-success text-white px-3"
                  onClick={handleImportClick}
                  disabled={isBidOpeningPending()}
                  style={{ opacity: isBidOpeningPending() ? 0.6 : 1 }}
                >
                  <ImportIcon /> Import Excel
                </button>
              </div>
              <Table responsive className="mb-0">
                <thead style={{ backgroundColor: '#F4F9FF' }}>
                  <tr>
                    {[
                      { label: 'BOQ Code', align: 'text-start' },
                      { label: 'BOQ Name', align: 'text-start' },
                      { label: 'Unit', align: 'text-center' },
                      { label: 'Quantity', align: 'text-center' },
                      { label: 'Rate', align: 'text-center' },
                      { label: 'Amount', align: 'text-end' }
                    ].map((head, i) => (
                      <th
                        key={i}
                        className={`py-3 px-4 text-muted fw-normal border-0 ${head.align}`}
                        style={{ fontSize: '0.9rem', backgroundColor: 'transparent', whiteSpace: 'nowrap' }} >
                        {head.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {boqItems.map((row, idx) => (
                    <tr key={idx} className="align-middle" style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td className="py-4 px-4 text-dark">{row.boqCode}</td>
                      <td className="py-4 px-4 text-dark">{row.boqName}</td>
                      <td className="py-4 px-4 text-dark text-center">{row.uom?.uomCode || row.uom || '-'}</td>
                      <td className="py-4 px-4 text-dark text-center">{row.quantity}</td>
                      <td className="py-4 px-4 text-center" style={{ width: '180px' }}>
                        <div className="position-relative"
                          style={{ cursor: isBidOpeningPending() ? 'not-allowed' : 'pointer' }}
                          onClick={(e) => {
                            if (isBidOpeningPending()) return;
                            const input = e.currentTarget.querySelector('input');
                            input.readOnly = false;
                            input.focus();
                          }}
                        >
                          <Form.Control
                            type="number"
                            value={row.rate}
                            onChange={(e) => handleRateChange(idx, e.target.value)}
                            readOnly
                            className="text-start ps-3 pe-4 shadow-none"
                            style={{
                              fontSize: '0.95rem',
                              borderColor: '#3B82F6',
                              borderRadius: '6px',
                              color: '#3B82F6',
                              height: '38px',
                              backgroundColor: isBidOpeningPending() ? '#F3F4F6' : '#FFF'
                            }}
                            onBlur={(e) => { e.target.readOnly = true; }}
                          />
                          {!isBidOpeningPending() && (
                            <Pencil
                              size={14}
                              className="position-absolute"
                              style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#3B82F6', pointerEvents: 'none' }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-end fw-bold text-dark">{row.amount ? row.amount.toFixed(2) : "0.00"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
            <div
              className="d-flex justify-content-end align-items-center gap-3 px-4 py-3 text-white"
              style={{ backgroundColor: "#005197" }}
            >
              <span className="fs-5 fw-normal">Total Estimated Offer</span>
              <span className="fs-4 fw-bold">{getTotalEstimatedOffer()}</span>
            </div>
          </Card>

          <Card className="border rounded-3 mt-4" style={{ borderColor: "#0051973D" }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Badge bg="primary" className="p-1 rounded d-flex align-items-center justify-content-center"
                  style={{ width: "24px", height: "24px" }}>
                  <span style={{ fontSize: "8px", fontWeight: "bold" }}>CARD</span>
                </Badge>
                <h5 className="mb-0 fw-bold text-dark">Payment Terms</h5>
              </div>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder={isBidOpeningPending() ? "Bidding not started yet..." : "Enter payment terms here (press Enter for new line)..."}
                className="shadow-none"
                style={{ border: "1px solid #337ab7", borderRadius: "8px", outline: "none", boxShadow: "none" }}
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                readOnly={isBidOpeningPending()}
              />
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end gap-3 mt-4 mb-5">
            <Button
              variant="primary"
              className="px-5 py-2 fw-bold d-flex align-items-center gap-2"
              style={{ backgroundColor: '#337ab7', border: 'none', borderRadius: '8px', opacity: isBidOpeningPending() ? 0.6 : 1 }}
              onClick={handleSubmitOffer}
              disabled={isBidOpeningPending()}
            >
              Submit Offer <Send size={18} />
            </Button>
          </div>
        </Container>
      </div>
    </>
  );
}

export default ContractorDetails;