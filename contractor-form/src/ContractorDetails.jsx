import { Container, Row, Col, Card, Badge, Table, Form, Button, Spinner } from "react-bootstrap";
import { Gavel, UserRound, Mail, Package, Paperclip, FileText, Download, FileImage, FileSpreadsheet, ClipboardCheck, Pencil, Send, ImportIcon, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios from "axios";

function ContractorDetails() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const tenderId = params.get("tenderId");
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token"));
  const [tender, setTender] = useState();
  const [pageStatus, setPageStatus] = useState("LOADING"); 
  const [errorDetails, setErrorDetails] = useState({ title: "", message: "" });
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const headers = { Authorization: `Bearer ${authToken}` };

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
        fetchTenderDetails(token); 
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
  }, [id, tenderId, baseUrl]);

  const fetchTenderDetails = (token) => {
    axios.get(`${baseUrl}/tender/${tenderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      if (res.status === 200) {
        setTender(res.data);
        setPageStatus("CONTENT");
      }
    }).catch((err) => {
      setPageStatus("INVALID");
      setErrorDetails({ title: "Error Loading Data", message: "Unable to fetch tender details." });
    });
  }

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
            <Button onClick={() => window.location.reload()} className="px-4" style={{backgroundColor: "#005197"}}>
              Refresh Page
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div
        className="d-flex align-items-center justify-content-between px-4 py-2 border-bottom bg-white"
        style={{ height: "84px" }}>
        <div className="d-flex flex-column lh-sm">
          <div className="fw-bold fs-4 text-primary">TACTIVE</div>
          <div className="small text-muted">PRACTISING VALUES</div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{ backgroundColor: "#FFF1F2", color: "#DC2626", fontSize: "0.85rem", fontWeight: 500 }} >
            <span
              className="d-inline-block rounded-circle"
              style={{ width: "8px", height: "8px", backgroundColor: "#DC2626" }}>
            </span>
            Time Remaining: 04d : 12h : 29m
          </div>

          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ width: "34px", height: "34px", backgroundColor: "#2563EB", fontSize: "0.85rem", fontWeight: "600" }} >
              B
            </div>
            <div className="text-end">
              <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
                Build Tech Solutions
              </div>
              <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                Contractor Code : C#001
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', width: '100%' }}>
        <Container
          fluid
          className="p-4"
          style={{ width: '95%', margin: '0 auto' }}>

          <Row className="g-4 align-items-stretch">
            <Col lg={9}>
              <Card className="border rounded-3 h-100" style={{ borderColor: "#0051973D" }}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-3">
                      <div className="text-primary">
                        <Gavel size={28} />
                      </div>
                      <h5 className="mb-0 fw-bold" style={{ fontSize: '1.25rem' }}>
                        Tender Floated Details – {tender?.title || 'Green Heights'}
                      </h5>
                    </div>
                    <div className="d-flex gap-5 text-end">
                      <div>
                        <div className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>Floating No</div>
                        <div className="fw-bold text-dark">{tender?.floatingNo || 'TF – 2025 – 001'}</div>
                      </div>
                      <div>
                        <div className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>Floating Date</div>
                        <div className="text-muted fw-normal" style={{ fontSize: '0.95rem' }}>November 20, 2025</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <Badge bg="none" className="rounded-pill px-3 py-2 fw-normal" style={{ backgroundColor: '#F3F8FF', color: '#2563EB', fontSize: '0.9rem' }}>
                      Tender Name : {tender?.tenderName || 'Urban Sky Residential Hub'}
                    </Badge>
                  </div>
                  <Row className="g-3">
                    <Col md={4}>
                      <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#F8FAFC' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Offer Submission Mode</div>
                        <div className="fw-bold text-dark fs-5">Online</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#F8FAFC' }}>
                        <div className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Bid Opening</div>
                        <div className="fw-bold text-dark fs-5">December 01, 2025</div>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="p-4 rounded-4 h-100 position-relative" style={{ backgroundColor: "#FEF2F2", borderLeft: "4px solid #DC2626" }}>
                        <div className="text-danger mb-3" style={{ fontSize: '0.85rem', fontWeight: '500' }}>Submission Last Date</div>
                        <div className="fw-bold fs-5" style={{ color: '#D90707' }}>November 30, 2025</div>
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
                    <div className="fw-normal">Sarah Mitchell</div>
                  </div>
                  <div className="mb-3">
                    <div className="opacity-75" style={{ fontSize: '0.85rem' }}>Phone</div>
                    <div className="fw-normal">+1 (555) 123-4567</div>
                  </div>
                  <div>
                    <div className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Email</div>
                    <Badge bg="white" className="rounded-pill px-3 py-2 d-flex align-items-center border-0" style={{ width: 'fit-content' }}>
                      <Mail size={16} className="me-2" style={{ color: '#2563EB' }} />
                      <span className="fw-normal" style={{ color: '#2563EB', fontSize: '0.8rem' }}>sarah.mitchell@greenheights.com</span>
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
              <p className="mb-4" style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Complete construction of 5-story commercial complex including foundation, structure, MEP systems, and finishing works...
              </p>
              <div className="d-flex flex-wrap gap-3">
                {['Civil Works', 'Electrical Systems', 'Safety Equipment', 'HVAC Installation'].map((text) => (
                  <Badge key={text} pill bg="none" className="px-3 py-2 fw-normal" style={{ backgroundColor: '#EBF2FF', color: '#3B82F6', fontSize: '0.85rem' }}>
                    {text}
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
                {[
                  { title: "Technical Specifications", info: "pdf • 4.2 MB", desc: "Detailed technical requirements for all construction phases including material specifications and quality standards.", icon: <FileText size={32} className="text-danger" /> },
                  { title: "Drawings", info: "png • 1.2 MB", desc: "Complete set of architectural and engineering drawings including structural, electrical, and HVAC layouts.", icon: <FileImage size={32} className="text-primary" /> },
                  { title: "Commercial Conditions", info: "Excel • 4.2 MB", desc: "Payment terms, penalties, insurance requirements, and other commercial conditions for the tender.", icon: <FileSpreadsheet size={32} className="text-success" /> },
                  { title: "Others", info: "Excel • 4.2 MB", desc: "Safety protocols and environmental compliance requirements", icon: <FileText size={32} style={{ color: '#64748B' }} /> }
                ].map((file, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-4 rounded-4" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="d-flex gap-3">
                      <div className="flex-shrink-0">{file.icon}</div>
                      <div>
                        <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{file.title}</div>
                        <div className="text-muted small mb-1">{file.info}</div>
                        <div className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{file.desc}</div>
                      </div>
                    </div>
                    <div className="ps-3">
                      <Download size={24} className="text-primary" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                ))}
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
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>Quote your rates for each item below</p>
                  </div>

                </div>
                <button className="btn bg-success text-white px-3"> <ImportIcon /> Import Excel</button>
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
                  {[
                    { code: 'a', name: 'Upto 1.5m depth', unit: 'Cum', qty: '3922.49364' },
                    { code: 'b', name: 'From 1.5m to 3m depth', unit: 'Cum', qty: '2941.87023' },
                    { code: 'c', name: 'From 3.1m to 4.5m depth', unit: 'Cum', qty: '588.443895' },
                    { code: 'd', name: 'From 4.6m to 6.0m depth', unit: 'Cum', qty: '1200' },
                  ].map((row, idx) => (
                    <tr key={idx} className="align-middle" style={{ borderBottom: '1px solid #EDF2F7' }}>
                      <td className="py-4 px-4 text-dark">{row.code}</td>
                      <td className="py-4 px-4 text-dark">{row.name}</td>
                      <td className="py-4 px-4 text-dark text-center">{row.unit}</td>
                      <td className="py-4 px-4 text-dark text-center">{row.qty}</td>
                      <td className="py-4 px-4 text-center" style={{ width: '180px' }}>

                        <div className="position-relative"
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            const input = e.currentTarget.querySelector('input');
                            input.readOnly = false;
                            input.focus();
                          }}
                        >
                          <Form.Control
                            type="text"
                            defaultValue="0.00"
                            readOnly
                            className="text-start ps-3 pe-4 shadow-none"
                            style={{ fontSize: '0.95rem', borderColor: '#3B82F6', borderRadius: '6px', color: '#3B82F6', height: '38px', backgroundColor: '#FFF' }}
                            onBlur={(e) => { e.target.readOnly = true; }}
                          />
                          <Pencil
                            size={14}
                            className="position-absolute"
                            style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#3B82F6', pointerEvents: 'none' }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-end fw-bold text-dark">0.00</td>
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
              <span className="fs-4 fw-bold">0.00</span>
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

              <Form.Control as="textarea" rows={3}
                placeholder="Enter payment terms here..."
                className="shadow-none"
                style={{ border: "1px solid #337ab7", borderRadius: "8px", outline: "none", boxShadow: "none" }}
              />

            </Card.Body>
          </Card>

          <div className="d-flex justify-content-end gap-3 mt-4 mb-5">
            <Button variant="primary" className="px-5 py-2 fw-bold d-flex align-items-center gap-2" style={{ backgroundColor: '#ffffff', color: "#337ab7", borderRadius: '8px', border: '1px solid #337ab7', }}>
              Save Draft
            </Button>
            <Button variant="primary" className="px-5 py-2 fw-bold d-flex align-items-center gap-2" style={{ backgroundColor: '#337ab7', border: 'none', borderRadius: '8px' }}>
              Submit Offer <Send size={18} />
            </Button>
          </div>

        </Container>
      </div>
    </>
  );
}

export default ContractorDetails;