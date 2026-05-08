import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText, Briefcase, MapPin, Phone, Mail, Award, Landmark, Building, Info, DollarSign } from "lucide-react";
import axios from "axios";
import "../CSS/Styles.css";

const bluePrimary = "#005197";

function ContractorInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [contractorData, setContractorData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/contractor`, { headers });
                let data = response.data;
                if (data && !Array.isArray(data) && data.data && Array.isArray(data.data)) {
                    data = data.data;
                }
                const list = Array.isArray(data) ? data : [];
                const contractor = list.find(c => {
                    const cId = c.contractor?.id || c.id;
                    return cId === parseInt(id) || cId === id; // Handle string/int types
                });
                setContractorData(contractor);
            } catch (error) {
                console.error("Error fetching contractor details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchData();
    }, [id, baseUrl, token]);

    const tabs = [
        { id: "overview", label: "Overview", icon: <User size={16} /> },
        { id: "financials", label: "Financials & Legal", icon: <Landmark size={16} /> },
        { id: "tenders", label: "Tenders", icon: <Briefcase size={16} /> },
        { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    ];

    const getSafeValue = (val) => {
        if (val === null || val === undefined) return "-";
        if (typeof val === 'object') {
            return val.type || val.grade || val.label || val.name || val.city || val.country || val.taxType || val.idType || "-";
        }
        return val;
    };

    const DetailRow = ({ label, value, fullWidth = false }) => (
        <div className={`${fullWidth ? "col-12" : "col-md-4"} mb-3 text-start`}>
            <div className="text-muted small">{label}</div>
            <div className="fw-medium text-break">{getSafeValue(value)}</div>
        </div>
    );

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    return (
        <div className="container-fluid mt-3 p-4 min-vh-100">
            {/* Header */}
            <div className="d-flex align-items-center mb-4 text-start">
                <button
                    className="btn btn-light me-3"
                    onClick={() => navigate(-1)}
                    style={{ borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <ArrowLeft size={20} color={bluePrimary} />
                </button>
                <div>
                    <h4 className="fw-bold mb-0">{contractorData?.contractor?.entityName || "Contractor Details"}</h4>
                    <span className="text-muted small">{contractorData?.contractor?.entityCode}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : !contractorData ? (
                <div className="text-center py-5">
                    <h5 className="text-muted">Contractor not found.</h5>
                </div>
            ) : (
                <>
                    {/* Tabs */}
                    <div className="bg-white rounded-3 shadow-sm mb-4">
                        <div className="d-flex justify-content-between border-bottom overflow-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`d-flex align-items-center px-4 py-3 text-nowrap ${activeTab === tab.id
                                        ? ""
                                        : "text-muted"
                                        }`}
                                    style={{
                                        border: "none",
                                        borderBottom: activeTab === tab.id ? `2px solid ${bluePrimary}` : "2px solid transparent",
                                        backgroundColor: "white",
                                        fontWeight: activeTab === tab.id ? 600 : 400,
                                        color: activeTab === tab.id ? bluePrimary : "#6c757d",
                                        borderRadius: 0,
                                    }}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <span className="me-2">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3 shadow-sm p-4">
                        {activeTab === "overview" && (
                            <div>
                                <div className="d-flex justify-content-between align-items-start mb-4">
                                    <h5 className="fw-bold mb-0 text-start" style={{ color: bluePrimary }}>Overview</h5>
                                    {contractorData.contractor?.status && (
                                        <span className="badge bg-light text-dark border p-2">
                                            Status: {contractorData.contractor.status}
                                        </span>
                                    )}
                                </div>

                                <div className="row">
                                    <DetailRow label="Entity Name" value={contractorData.contractor?.entityName} />
                                    <DetailRow label="Entity Code" value={contractorData.contractor?.entityCode} />
                                    <DetailRow label="Entity Type" value={contractorData.contractor?.contractorType?.type} />
                                    <DetailRow label="Grade" value={contractorData.contractor?.contractorGrade?.gradeName} />
                                    <DetailRow label="Nature of Business" value={contractorData.contractor?.contractorNature?.map(n => n.nature).join(', ') || "-"} />
                                    <DetailRow label="Effective Date" value={formatDate(contractorData.contractor?.effectiveDate)} />
                                    <DetailRow label="Submission Mode" value={contractorData.contractor?.submissionMode} />
                                </div>

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Contact Person</h5>
                                <div className="row">
                                    <DetailRow label="Name" value={contractorData.contact?.name} />
                                    <DetailRow label="Designation" value={contractorData.contact?.designation} />
                                    <DetailRow label="Email" value={contractorData.contact?.email} />
                                    <DetailRow label="Phone" value={contractorData.contact?.phoneNumber} />
                                </div>

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Addresses</h5>
                                {contractorData.contractor?.contractorAddresses?.length > 0 ? (
                                    contractorData.contractor.contractorAddresses.map((addr, index) => (
                                        <div key={index} className="card mb-3 border-light bg-light">
                                            <div className="card-body">
                                                <div className="row">
                                                    <DetailRow label="Address Type" value={addr.addressType?.addressType} />
                                                    <DetailRow label="Address 1" value={addr.address1} />
                                                    <DetailRow label="Address 2" value={addr.address2} />
                                                    <DetailRow label="City" value={addr.city} />
                                                    <DetailRow label="Country" value={addr.country} />
                                                    <DetailRow label="Zip Code" value={addr.zipCode} />
                                                    <DetailRow label="Phone" value={addr.phoneNumber} />
                                                    <DetailRow label="Email" value={addr.email} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">No address details available.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "financials" && (
                            <div>
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Tax Details</h5>
                                {contractorData.contractor?.contractorTaxDetails?.length > 0 ? (
                                    contractorData.contractor.contractorTaxDetails.map((tax, index) => (
                                        <div key={index} className="card mb-3 border-light bg-light">
                                            <div className="card-body">
                                                <div className="row">
                                                    <DetailRow label="Tax Type" value={tax.taxType} />
                                                    <DetailRow label="Registration No" value={tax.taxRegNumber} />
                                                    <DetailRow label="Registration Date" value={formatDate(tax.taxRegDate)} />
                                                    <DetailRow label="Territory Type" value={tax.territoryType} />
                                                    <DetailRow label="Territory" value={tax.territory} />
                                                    <DetailRow label="Address 1" value={tax.address1} />
                                                    <DetailRow label="Address 2" value={tax.address2} />
                                                    <DetailRow label="City" value={tax.city} />
                                                    <DetailRow label="Pin Code" value={tax.pinCode} />
                                                    <DetailRow label="Email" value={tax.email} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted mb-4">No tax details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Bank Accounts</h5>
                                {contractorData.contractor?.contractorBankDetails?.length > 0 ? (
                                    contractorData.contractor.contractorBankDetails.map((bank, index) => (
                                        <div key={index} className="card mb-3 border-light bg-light">
                                            <div className="card-body">
                                                <div className="row">
                                                    <DetailRow label="Account Holder" value={bank.accHolderName} />
                                                    <DetailRow label="Account No" value={bank.accNumber} />
                                                    <DetailRow label="Bank Name" value={bank.bankName} />
                                                    <DetailRow label="Branch" value={bank.branch} />
                                                    <DetailRow label="Address" value={bank.bankAddress} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted mb-4">No bank details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Additional Info</h5>
                                {contractorData.contractor?.contractorAddInfos?.length > 0 ? (
                                    contractorData.contractor.contractorAddInfos.map((info, index) => (
                                        <div key={index} className="card mb-3 border-light bg-light">
                                            <div className="card-body">
                                                <div className="row">
                                                    <DetailRow label="Type" value={info.identityType || info.type} />
                                                    <DetailRow label="Registration No" value={info.regNo || info.value} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">No additional info available.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "tenders" && (
                            <div>
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Tender History</h5>
                                <div className="text-muted p-5 text-center bg-light rounded">
                                    No tenders found for this contractor.
                                </div>
                            </div>
                        )}

                        {activeTab === "documents" && (
                            <div>
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Documents</h5>
                                <div className="text-muted p-5 text-center bg-light rounded">
                                    No documents uploaded.
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default ContractorInfo;
