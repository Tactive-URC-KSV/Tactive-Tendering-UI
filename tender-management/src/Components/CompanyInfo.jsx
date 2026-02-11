import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building, FileText, Briefcase, MapPin, Phone, Mail, Landmark, Users, Handshake, Info, Globe } from "lucide-react";
import axios from "axios";
import "../CSS/Styles.css";

const bluePrimary = "#005197";

function CompanyInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [companyData, setCompanyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetching all companies and finding by ID as per current pattern
                const response = await axios.get(`${baseUrl}/companyDetails`, { headers });
                let data = response.data;
                if (data && !Array.isArray(data) && data.data && Array.isArray(data.data)) {
                    data = data.data;
                }
                const list = Array.isArray(data) ? data : [];
                // Handle potentially string vs number ID comparison
                const company = list.find(c => c.companyId === parseInt(id) || c.id === parseInt(id) || c.companyId == id || c.id == id);
                setCompanyData(company);
            } catch (error) {
                console.error("Error fetching company details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchData();
    }, [id, baseUrl, token]);

    const tabs = [
        { id: "overview", label: "Overview", icon: <Building size={16} /> },
        { id: "financials", label: "Financials & Legal", icon: <Landmark size={16} /> },
        { id: "profile", label: "Profile", icon: <Info size={16} /> },
        { id: "projects", label: "Projects", icon: <Briefcase size={16} /> },
        { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    ];

    const getSafeValue = (val) => {
        if (val === null || val === undefined) return "-";
        if (typeof val === 'object') {
            return val.companyType || val.level || val.businessNature || val.nature || val.companyName || val.status || val.name || val.constitution || val.code || val.label || val.type || val.city || val.country || val.taxType || "-";
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
                    <h4 className="fw-bold mb-0">{companyData?.companyName || "Company Details"}</h4>
                    <span className="text-muted small">{companyData?.shortName}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : !companyData ? (
                <div className="text-center py-5">
                    <h5 className="text-muted">Company not found.</h5>
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
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Basic Information</h5>
                                <div className="row">
                                    <DetailRow label="Company Name" value={companyData.companyName} />
                                    <DetailRow label="Short Name" value={companyData.shortName} />
                                    <DetailRow label="Company Type" value={companyData.comType || companyData.comTypeId} />
                                    <DetailRow label="Company Level" value={companyData.companyLevel || companyData.comLevelId} />
                                    <DetailRow label="Parent Company" value={companyData.parentCompanyName || companyData.parentCompanyId} />
                                    <DetailRow label="Nature of Company" value={companyData.comNature || companyData.comNatureId} />
                                    <DetailRow label="Nature of Business" value={companyData.businessNature || companyData.businessNatureId} />
                                    <DetailRow label="Constitution" value={companyData.companyConstitution || companyData.companyConstitutionId} />
                                    <DetailRow label="Status" value={companyData.status || companyData.statusId} />
                                    <DetailRow label="Financial Start Month" value={companyData.finStartMonth} />
                                    <DetailRow label="Default Language" value={companyData.language || companyData.languageId} />
                                    <DetailRow label="Currency" value={companyData.currency || companyData.currencyId} />
                                    <DetailRow label="Bank" value={companyData.bank} />
                                </div>

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Address Details</h5>
                                {companyData.address ? (
                                    <div className="row">
                                        <DetailRow label="Address Type" value={companyData.address.addressType || companyData.address.addressTypeId} />
                                        <DetailRow label="Address 1" value={companyData.address.address1} />
                                        <DetailRow label="Address 2" value={companyData.address.address2} />
                                        <DetailRow label="City" value={companyData.address.city || companyData.address.cityName} />
                                        <DetailRow label="Country" value={companyData.address.country || companyData.address.countryName} />
                                        <DetailRow label="Zip Code" value={companyData.address.zipCode} />
                                        <DetailRow label="Phone No" value={companyData.address.phoneNo} />
                                        <DetailRow label="Fax No" value={companyData.address.faxNo} />
                                        <DetailRow label="Email" value={companyData.address.email} />
                                        <DetailRow label="Website" value={companyData.address.website} />
                                    </div>
                                ) : (
                                    <div className="text-muted">No address details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Contact Person</h5>
                                {companyData.contacts && companyData.contacts.length > 0 ? (
                                    companyData.contacts.map((contact, index) => (
                                        <div key={index} className="row mb-3">
                                            <DetailRow label="Name" value={contact.name} />
                                            <DetailRow label="Position" value={contact.position} />
                                            <DetailRow label="Phone" value={contact.phoneNo} />
                                            <DetailRow label="Email" value={contact.email} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">No contact details available.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "financials" && (
                            <div>
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Tax Details</h5>
                                {companyData.taxDetails && companyData.taxDetails.length > 0 ? (
                                    companyData.taxDetails.map((tax, index) => (
                                        <div key={index} className="card mb-3 border-light bg-light">
                                            <div className="card-body">
                                                <div className="row">
                                                    <DetailRow label="Tax Type" value={tax.taxType || tax.taxTypeId} />
                                                    <DetailRow label="Registration No" value={tax.taxRegNo} />
                                                    <DetailRow label="Registration Date" value={formatDate(tax.taxRegDate)} />
                                                    <DetailRow label="Territory Type" value={tax.territoryTypeId} />
                                                    <DetailRow label="Territory" value={tax.territory} />
                                                    <DetailRow label="Effective From" value={formatDate(tax.effectiveFrom)} />
                                                    <DetailRow label="Effective To" value={formatDate(tax.effectiveTo)} />
                                                    <DetailRow label="Is Primary" value={tax.isPrimary ? "Yes" : "No"} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted mb-4">No tax details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Directors</h5>
                                {companyData.directors && companyData.directors.length > 0 ? (
                                    <div className="row">
                                        {companyData.directors.map((director, index) => (
                                            <div key={index} className="col-md-6 mb-3">
                                                <div className="card h-100 border-light bg-light">
                                                    <div className="card-body">
                                                        <h6>{director.directorName}</h6>
                                                        <div className="small text-muted mb-1">{getSafeValue(director.directorType) || director.directorTypeId}</div>
                                                        <div className="d-flex justify-content-between mt-2">
                                                            <small>Shares: {director.noOfShares}</small>
                                                            <small>Share %: {director.sharePercentage}%</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted mb-4">No director details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Joint Ventures</h5>
                                {companyData.jointVentures && companyData.jointVentures.length > 0 ? (
                                    <div className="row">
                                        {companyData.jointVentures.map((jv, index) => (
                                            <div key={index} className="col-md-6 mb-3">
                                                <div className="card h-100 border-light bg-light">
                                                    <div className="card-body">
                                                        <DetailRow label="Partner" value={jv.partnerId} fullWidth />
                                                        <DetailRow label="Share Percentage" value={`${jv.sharePercentage}%`} fullWidth />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted mb-4">No joint venture details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Additional Info</h5>
                                {companyData.additionalInfos && companyData.additionalInfos.length > 0 ? (
                                    <div className="row">
                                        {companyData.additionalInfos.map((info, index) => (
                                            <div key={index} className="col-md-6 mb-3">
                                                <div className="card h-100 border-light bg-light">
                                                    <div className="card-body">
                                                        <DetailRow label="Type" value={info.idType || info.idTypeId} fullWidth />
                                                        <DetailRow label="Registration No" value={info.registrationNo} fullWidth />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted">No additional info available.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "profile" && (
                            <div>
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Company Profile</h5>
                                {companyData.profile ? (
                                    <div className="row">
                                        <DetailRow label="Order No" value={companyData.profile.orderNo} />
                                        <DetailRow label="Remarks" value={companyData.profile.remarks} />
                                        <div className="col-12 mt-3">
                                            <div className="text-muted small mb-1">Description</div>
                                            <p className="bg-light p-3 rounded">{companyData.profile.description || "No description provided."}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-muted mb-4">No profile details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Local Names</h5>
                                {companyData.localNames && companyData.localNames.length > 0 ? (
                                    <div className="row">
                                        {companyData.localNames.map((local, index) => (
                                            <div key={index} className="col-md-6 mb-3">
                                                <div className="card h-100 border-light bg-light">
                                                    <div className="card-body">
                                                        <DetailRow label="Language" value={local.language || local.languageId} fullWidth />
                                                        <DetailRow label="Name" value={local.name} fullWidth />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-muted">No local names available.</div>
                                )}
                            </div>
                        )}

                        {activeTab === "projects" && (
                            <div>
                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Associated Projects</h5>
                                <div className="text-muted p-5 text-center bg-light rounded">
                                    No projects found for this company.
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

export default CompanyInfo;
