import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';
import { ArrowLeft, Plus, Scale, Handshake, Gavel, CreditCard, Paperclip, FileText, Download, Eye } from "lucide-react";

function TenderOffers() {
    const navigate = useNavigate();
    // Fetch IDs from URL parameters
    const { projectId, tenderId } = useParams();

    const [projectData, setProjectData] = useState(null);
    const [tenders, setTenders] = useState([]);
    const [offersMap, setOffersMap] = useState({});
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [attachmentData, setAttachmentData] = useState(null);
    const [showNegotiateModal, setShowNegotiateModal] = useState(false);
    const [negotiateComments, setNegotiateComments] = useState("");
    const [negotiateLoading, setNegotiateLoading] = useState(false);
    const [awardLoading, setAwardLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const projectRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`,
                    { headers }
                );
                if (projectRes.status === 200) {
                    setProjectData(projectRes.data);
                }

                const tendersRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/tenders/${projectId}`,
                    { headers }
                );

                if (tendersRes.status === 200) {
                    const fetchedTenders = Array.isArray(tendersRes.data) ? tendersRes.data : [];
                    setTenders(fetchedTenders);

                    const offersData = {};
                    let firstOfferFound = null;

                    await Promise.all(
                        fetchedTenders.map(async (tender) => {
                            try {
                                const offersRes = await axios.get(
                                    `${import.meta.env.VITE_API_BASE_URL}/tender-offers/${tender.id}`,
                                    { headers }
                                );
                                if (offersRes.status === 200) {
                                    offersData[tender.id] = offersRes.data;
                                    if (!firstOfferFound && offersRes.data.length > 0) {
                                        firstOfferFound = offersRes.data[0];
                                    }
                                } else {
                                    offersData[tender.id] = [];
                                }
                            } catch (err) {
                                console.error(`Error fetching offers for tender ${tender.id}:`, err);
                                offersData[tender.id] = [];
                            }
                        })
                    );

                    setOffersMap(offersData);
                    if (tenderId && offersData[tenderId] && offersData[tenderId].length > 0) {
                        setSelectedOffer(offersData[tenderId][0]);
                    } else if (firstOfferFound) {
                        setSelectedOffer(firstOfferFound);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchData();
        }
    }, [projectId, tenderId]);

    const fetchAttachments = async (tenderId) => {
        try {
            const token = sessionStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderAttachments/${tenderId}`,
                { headers }
            );
            if (res.status === 200) {
                setAttachmentData(res.data);
            } else {
                setAttachmentData(null);
            }
        } catch (err) {
            console.error("Error fetching attachments:", err);
            setAttachmentData(null);
        }
    };

    useEffect(() => {
        if (selectedOffer?.tender?.id) {
            fetchAttachments(selectedOffer.tender.id);
        } else {
            setAttachmentData(null);
        }
    }, [selectedOffer]);

    const handleNegotiateSubmit = async () => {
        if (!selectedOffer || !negotiateComments.trim()) {
            toast.error("Please enter comments before negotiating.");
            return;
        }

        setNegotiateLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const payload = {
                offerId: selectedOffer.id,
                contractorId: selectedOffer.contractor?.id,
                tenderId: selectedOffer.tender?.id,
                offerVersion: selectedOffer.offerQuotations?.[0]?.offerVersion || 0,
                comments: negotiateComments
            };

            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/offer/negotiate`,
                payload,
                { headers }
            );

            if (response.status === 200) {
                toast.success("Negotiation submitted successfully!");
                setShowNegotiateModal(false);
                setNegotiateComments("");
                // Reload or refresh data
                window.location.reload();
            }
        } catch (error) {
            console.error("Error submitting negotiation:", error);
            toast.error("Failed to submit negotiation. Please try again.");
        } finally {
            setNegotiateLoading(false);
        }
    };

    const handleAward = async () => {
        if (!selectedOffer) return;
        const tenderId = selectedOffer.tender?.id;
        const tenderOfferId = selectedOffer.id;
        const offerQuotationId = selectedOffer.offerQuotations?.[0]?.id;

        if (!tenderId || !tenderOfferId || !offerQuotationId) {
            toast.error("Missing necessary information to award tender (Quotations or IDs missing).");
            return;
        }
        setAwardLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            const response = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/tender/award`,
                null,
                {
                    headers,
                    params: {
                        tenderId,
                        tenderOfferId,
                        offerQuotationId
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Tender awarded successfully!");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error awarding tender:", error);
            toast.error("Failed to award tender. Please try again.");
        } finally {
            setAwardLoading(false);
        }
    };

    const calculateTotalAmount = (quotations) => {
        if (!quotations) return 0;
        return quotations.reduce((acc, item) => acc + (item.amount || 0), 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getFileNameFromUrl = (url) => {
        if (!url) return "Unknown File";
        try {
            return url.substring(url.lastIndexOf('/') + 1);
        } catch (e) {
            return url;
        }
    };

    const transformFiles = (urls) => {
        if (!urls || !Array.isArray(urls)) return [];
        return urls.map(url => ({
            name: getFileNameFromUrl(url),
            size: "-",
            url: url,
            type: url.split('.').pop()
        }));
    };

    const attachmentCategories = [
        {
            name: "Technical Specifications",
            files: transformFiles(attachmentData?.technicalTermsUrl)
        },
        {
            name: "Drawings",
            files: transformFiles(attachmentData?.drawingUrl)
        },
        {
            name: "Commercial Conditions",
            files: transformFiles(attachmentData?.commercialTermsUrl)
        },
        {
            name: "Others",
            files: transformFiles(attachmentData?.otherUrl)
        }
    ];

    const getStatusBadgeStyle = (status) => {
        switch (status) {
            case "ACCEPTED":
            case "RECEIVED":
                return { backgroundColor: "#DCFCE7", color: "#166534" };
            case "PENDING":
                return { backgroundColor: "#FFFBEB", color: "#F59E0B" };
            case "REJECTED":
                return { backgroundColor: "#FEE2E2", color: "#991B1B" };
            default:
                return { backgroundColor: "#F3F4F6", color: "#374151" };
        }
    };

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const totalOfferAmount = selectedOffer ? calculateTotalAmount(selectedOffer.offerQuotations) : 0;

    return (
        <div className="container-fluid p-4">
            <div className="col-12 mx-auto">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
                    <div className="d-flex align-items-start gap-3">
                        <ArrowLeft
                            size={22}
                            className="mt-1"
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(-1)}
                        />
                        <div className="text-start">
                            <h5 className="fw-bold mb-1">Received Offers</h5>
                            <div className="text-muted fw-semibold" style={{ fontSize: "14px" }}>
                                Project : {projectData ? `${projectData.projectName} (${projectData.projectCode})` : "Loading..."}
                            </div>
                        </div>
                    </div>

                    <button
                        className="btn text-white fw-semibold d-flex align-items-center gap-2 px-3 py-2 "
                        style={{ backgroundColor: "#005197CC", borderRadius: "8px" }}
                        onClick={() => navigate(`/tenderfloating/${projectId}`)}
                    >
                        <Plus size={18} /> Float New Tender
                    </button>
                </div>

                <div className="bg-transparent rounded-3 d-flex flex-column w-100"
                    style={{ border: "1px solid #0051973D", height: "calc(130vh - 165px)", overflow: "hidden" }}>
                    <div className="row g-0 h-100 flex-nowrap">

                        <div className="col-4 bg-white p-4 rounded-start-3 overflow-auto"
                            style={{ height: "110vh", scrollbarWidth: "none", msOverflowStyle: "none", borderRight: "1px solid #0051973D" }}>

                            {tenders.length === 0 ? (
                                <div className="text-center text-muted mt-5">No Tenders Found</div>
                            ) : (
                                tenders.map((tender) => {
                                    const tenderOffers = Array.isArray(offersMap[tender.id]) ? offersMap[tender.id] : [];
                                    const offerCount = tenderOffers.length;

                                    return (
                                        <div key={tender.id} className="position-relative mb-4">
                                            <div className="position-absolute top-0 end-0 px-3 py-1 text-white fw-bold"
                                                style={{
                                                    backgroundColor: "#005197",
                                                    borderBottomLeftRadius: "20px",
                                                    borderTopRightRadius: "8px",
                                                    fontSize: "12px",
                                                    zIndex: 2
                                                }}>
                                                {offerCount} Offer{offerCount !== 1 ? 's' : ''}
                                            </div>

                                            <div className="p-3 rounded-3"
                                                style={{ backgroundColor: "#F3F8FF", border: "1px solid #00519780" }}>
                                                <div className="text-start mb-3 ms-1">
                                                    <h5 className="fw-bold mb-1" style={{ color: "#005197", fontSize: "1.25rem" }}>
                                                        {tender.tenderNumber}
                                                    </h5>
                                                    <p
                                                        className="fw-bold text-dark mb-0"
                                                        style={{ fontSize: "15px", opacity: 0.8 }}
                                                        title={tender.tenderName?.length > 10 ? tender.tenderName : ''}
                                                    >
                                                        {tender.tenderName?.length > 10 ? `${tender.tenderName.substring(0, 10)}...` : tender.tenderName}
                                                    </p>
                                                </div>
                                                {tenderOffers.length > 0 ? (
                                                    Object.values(
                                                        tenderOffers.reduce((acc, offer) => {
                                                            const contractorId = offer.contractor?.id || "unknown";
                                                            if (!acc[contractorId]) {
                                                                acc[contractorId] = {
                                                                    contractor: offer.contractor,
                                                                    offers: []
                                                                };
                                                            }
                                                            acc[contractorId].offers.push(offer);
                                                            return acc;
                                                        }, {})
                                                    ).map((group, groupIndex) => (
                                                        <div key={groupIndex} className="mb-3 border p-2 rounded bg-light">
                                                            <div className="fw-bold text-dark mb-2" style={{ fontSize: "14px" }}>
                                                                {group.contractor?.entityName || "Unknown Contractor"}
                                                            </div>
                                                            {group.offers.map((offer) => {
                                                                const isSelected = selectedOffer?.id === offer.id;
                                                                const amount = calculateTotalAmount(offer.offerQuotations);
                                                                const badgeStyle = getStatusBadgeStyle(offer.offerStatus);
                                                                const version = offer.offerQuotations?.[0]?.offerVersion;

                                                                return (
                                                                    <div key={offer.id}
                                                                        className="bg-white rounded-2 p-2 d-flex justify-content-between align-items-center mb-2"
                                                                        onClick={() => setSelectedOffer(offer)}
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            border: isSelected ? "none" : "1px solid #2563EB3D",
                                                                            borderLeft: isSelected ? "5px solid #005197" : "1px solid #E5E7EB"
                                                                        }} >
                                                                        <div className="text-start">
                                                                            <div className="fw-bold text-dark mb-1" style={{ fontSize: "13px" }}>
                                                                                Version {version || "-"}
                                                                            </div>
                                                                            <div className="text-muted" style={{ fontSize: "11px" }}>
                                                                                {formatDate(offer.submittedOn)}
                                                                            </div>
                                                                        </div>

                                                                        <div className="d-flex align-items-center gap-1">
                                                                            {offer.offerStatus === "PENDING" ? (
                                                                                <span className="badge rounded-pill px-3 py-1"
                                                                                    style={{ ...badgeStyle, fontWeight: "600", fontSize: "11px" }}>
                                                                                    Pending
                                                                                </span>
                                                                            ) : (
                                                                                <>
                                                                                    <div className="fw-bold" style={{ fontSize: "13px", color: isSelected ? "#2563EB" : "#6c757d" }}>
                                                                                        ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                                    </div>
                                                                                    {isSelected && (
                                                                                        <span className="fw-bold" style={{ color: "#2563EB", fontSize: "14px", marginLeft: "4px" }}>
                                                                                            ›
                                                                                        </span>
                                                                                    )}
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-muted small fst-italic p-2">No offers received yet.</div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="col-8 d-flex flex-column bg-light rounded-end-3 overflow-hidden">
                            {selectedOffer ? (
                                <>
                                    <div className="bg-white px-4 py-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3"
                                        style={{ minHeight: "95px", borderTopRightRadius: "8px" }}>
                                        <div className="text-start">
                                            <h5 className="mb-1 fw-bold text-dark" style={{ fontSize: "1.2rem", letterSpacing: "-0.3px" }}>
                                                Offer from {selectedOffer.contractor?.entityName}
                                            </h5>
                                            <div className="text-muted fw-medium" style={{ fontSize: "14px" }}
                                                title={selectedOffer.tender?.tenderName?.length > 10 ? selectedOffer.tender?.tenderName : ''}>
                                                For Tender : {selectedOffer.tender?.tenderNumber} - {selectedOffer.tender?.tenderName?.length > 10 ? `${selectedOffer.tender.tenderName.substring(0, 10)}...` : selectedOffer.tender?.tenderName}
                                            </div>
                                        </div>

                                        <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                                            <button
                                                className="btn d-flex align-items-center gap-2 fw-bold px-3 py-2 border-0 text-nowrap"
                                                style={{ backgroundColor: "#F3F4F6", color: "#374151", borderRadius: "8px", fontSize: "14px" }}
                                                onClick={() => {
                                                    if (selectedOffer?.tender?.id) {
                                                        navigate(`/receivingoffers/${projectId}/compare/${selectedOffer.tender.id}/${selectedOffer.id}`);
                                                    }
                                                }}
                                            >
                                                <Scale size={18} /> Compare
                                            </button>

                                            <button className="btn d-flex align-items-center gap-2 fw-bold px-3 py-2 border-0 text-nowrap"
                                                style={{ backgroundColor: "#EFF6FF", color: "#2563EB", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}
                                                onClick={() => setShowNegotiateModal(true)}>
                                                <Handshake size={18} /> Negotiate
                                            </button>

                                            <button
                                                className="btn text-white d-flex align-items-center gap-2 fw-bold px-4 py-2 border-0 text-nowrap"
                                                style={{
                                                    backgroundColor: selectedOffer.tender?.tenderStatus === "AWARD" ? "#9CA3AF" : "#10B981",
                                                    borderRadius: "8px",
                                                    fontSize: "14px",
                                                    cursor: (awardLoading || selectedOffer.tender?.tenderStatus === "AWARD") ? "not-allowed" : "pointer"
                                                }}
                                                onClick={handleAward}
                                                disabled={awardLoading || selectedOffer.tender?.tenderStatus === "AWARD"}
                                            >
                                                <Gavel size={18} />
                                                {selectedOffer.tender?.tenderStatus === "AWARD" ? "Awarded" : (awardLoading ? "Awarding..." : "Award")}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-grow-1 p-4 overflow-auto scroll-container"
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                                        <style>
                                            {`
                                                .scroll-container::-webkit-scrollbar {
                                                display: none;
                                                }
                                            `}
                                        </style>

                                        <div className="bg-white p-4 rounded-3" style={{ border: "1px solid #0051973D" }}>
                                            <div className="d-flex align-items-center gap-2 mb-4">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: "20px", height: "20px", backgroundColor: "#2563EB" }}>
                                                    <span className="text-white fw-bold" style={{ fontSize: "11px" }}>i</span>
                                                </div>
                                                <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "16px" }}>Tender & Offer Information</h6>
                                            </div>

                                            <div className="row g-4 text-start">
                                                <div className="col-md-3">
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Tender Number</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.tender?.tenderNumber || "—"}</div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Submission Mode</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.tender?.submissionMode || "—"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted small mb-1">Contact Person</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.tender?.contactName || "—"}</div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Tender Name</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.tender?.tenderName || "—"}</div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Contractor</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.contractor?.entityName || "—"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted small mb-1">Contact Number</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.tender?.contactNumber || "—"}</div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Submission Last Date</div>
                                                        <div className="fw-bold text-dark">{formatDate(selectedOffer.tender?.lastDate)}</div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Offer Version</div>
                                                        <div className="fw-bold text-dark text-break">{selectedOffer.offerQuotations?.[0]?.offerVersion || "—"}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-muted small mb-1">Contact Email ID</div>
                                                        <div className="fw-bold text-dark text-break">{selectedOffer.tender?.contactEmail || "—"}</div>
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Offer Received Date</div>
                                                        <div className="fw-bold text-dark">{formatDate(selectedOffer.submittedOn)}</div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <div className="text-muted small mb-1">Offer Status</div>
                                                        <div className="fw-bold text-dark">{selectedOffer.offerStatus || "—"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="container-fluid mt-4 p-1">
                                            <div className="rounded-3 p-4 text-white"
                                                style={{ background: "linear-gradient(135deg, #0052A0, #007BFF)", border: "1px solid #2563EB" }}>
                                                <div className="d-flex justify-content-between align-items-start mb-4">
                                                    <h5 className="mb-0 fw-semibold"> Offer Details (BOQ)</h5>
                                                    <div className="text-end">
                                                        <div className="small opacity-75">
                                                            Total Offer Amount
                                                        </div>
                                                        <div className="fs-4 fw-bold">
                                                            ₹{totalOfferAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-white rounded-4 overflow-hidden">
                                                    <div className="table-responsive">
                                                        <table className="table align-middle mb-0 border-0">
                                                            <thead className="text-white"
                                                                style={{ background: "linear-gradient(to right, #047BE2, #2990FF)", border: "none", }}>
                                                                <tr className="text-center">
                                                                    <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>BOQ Code</th>
                                                                    <th className="py-3 fw-bold text-start border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>BOQ Name</th>
                                                                    <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Unit</th>
                                                                    <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Quantity</th>
                                                                    <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Rate</th>
                                                                    <th className="py-3 fw-bold border-0 text-white" style={{ background: "transparent", color: "#ffffff", fontSize: "14px" }}>Amount</th>
                                                                </tr>
                                                            </thead>

                                                            <tbody className="text-center">
                                                                {selectedOffer.offerQuotations && selectedOffer.offerQuotations.length > 0 ? (
                                                                    selectedOffer.offerQuotations.map((item, index) => (
                                                                        <tr key={index}>
                                                                            <td className="py-3 text-muted border-0">{item.boq?.boqCode || "-"}</td>
                                                                            <td className="py-3 text-start text-dark fw-medium border-0">{item.boq?.boqName || "-"}</td>
                                                                            <td className="py-3 text-muted border-0">{item.boq?.uom?.uomCode || "-"}</td>
                                                                            <td className="py-3 text-muted border-0">{item.quantity}</td>
                                                                            <td className="py-3 text-muted border-0">
                                                                                {(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                            </td>
                                                                            <td className="py-3 text-dark fw-bold border-0">
                                                                                {(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr>
                                                                        <td colSpan="6" className="py-4 text-center text-muted">No BOQ items found in this offer.</td>
                                                                    </tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-3 mt-4 text-start" style={{ border: "1px solid #0051973D" }}>
                                            <div className="d-flex align-items-center gap-2 mb-4">
                                                <div className="bg-primary rounded-1 d-flex align-items-center justify-content-center"
                                                    style={{ width: "24px", height: "24px", backgroundColor: "#2563EB" }}>
                                                    <CreditCard size={14} className="text-white" />
                                                </div>
                                                <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "18px" }}>Payment Terms</h6>
                                            </div>

                                            <div className="ps-1">
                                                {selectedOffer.paymentTerms && selectedOffer.paymentTerms.length > 0 ? (
                                                    <ul className="list-unstyled">
                                                        {selectedOffer.paymentTerms.map((term, index) => (
                                                            <li key={index} className="mb-3 d-flex align-items-start gap-2">
                                                                <span className="fw-bold text-dark" style={{ fontSize: "14px" }}>•</span>
                                                                <div style={{ fontSize: "14px" }}>
                                                                    <span className="text-dark">{term}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-muted small mb-4">No specific payment terms listed.</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-3 mt-4 text-start" style={{ border: "1px solid #0051973D" }}>
                                            <div className="d-flex align-items-center gap-2 mb-4">
                                                <Paperclip size={20} className="text-primary" style={{ transform: 'rotate(45deg)' }} />
                                                <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "18px" }}>Attachments</h6>
                                            </div>
                                            <div className="row g-3">
                                                {attachmentCategories.some(cat => cat.files.length > 0) ? (
                                                    <div className="col-12">
                                                        <div className="d-flex flex-column gap-4">
                                                            {attachmentCategories.map((category, index) => (
                                                                <div key={index}>
                                                                    {category.files.length > 0 && (
                                                                        <>
                                                                            <h6 className="fw-bold mb-3 text-start" style={{ fontSize: '15px' }}>{category.name}</h6>
                                                                            <div className="d-flex flex-column gap-2">
                                                                                {category.files.map((file, fIdx) => (
                                                                                    <div key={fIdx} className="p-3 bg-white border rounded d-flex align-items-center justify-content-between">
                                                                                        <div className="d-flex align-items-center">
                                                                                            <FileText size={24} className="text-danger me-3" />
                                                                                            <div className="text-start">
                                                                                                <p className="mb-0 fw-medium text-dark" style={{ fontSize: '14px' }}>{file.name}</p>
                                                                                                <small className="text-muted">{file.size}</small>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex gap-2">
                                                                                            <button
                                                                                                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                                                                                                style={{ color: '#005197', width: '32px', height: '32px' }}
                                                                                                title="View"
                                                                                                onClick={() => window.open(file.url, '_blank')}
                                                                                            >
                                                                                                <Eye size={16} />
                                                                                            </button>
                                                                                            <button
                                                                                                className="btn btn-light btn-sm d-flex align-items-center justify-content-center"
                                                                                                style={{ color: '#005197', width: '32px', height: '32px' }}
                                                                                                title="Download"
                                                                                                onClick={() => window.open(file.url, '_blank')}
                                                                                            >
                                                                                                <Download size={16} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="col-12 text-center text-muted small fst-italic">
                                                        No attachments available for this offer.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                    Select an offer to view details
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Negotiation Modal */}
            {showNegotiateModal && (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Negotiate Offer</h5>
                                <button type="button" className="btn-close" onClick={() => setShowNegotiateModal(false)}></button>
                            </div>
                            <div className="modal-body text-start">
                                <label className="form-label fw-bold">Comments <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter your negotiation comments here..."
                                    value={negotiateComments}
                                    onChange={(e) => setNegotiateComments(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowNegotiateModal(false)}>Close</button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleNegotiateSubmit}
                                    disabled={negotiateLoading}
                                >
                                    {negotiateLoading ? "Submitting..." : "Submit Negotiation"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TenderOffers;