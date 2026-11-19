import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Building, FileText, Briefcase, MapPin, Phone, Mail, Landmark, Users, Handshake, Info, Globe, Edit, LayoutGrid, List, Calendar, Tag, IndianRupee } from "lucide-react";
import axios from "axios";
import "../CSS/Styles.css";
import { useProjectStatus } from '../Context/ProjectStatusContext';
import Action from '../assest/Action.svg?react';
import { FaList, FaThLarge } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const bluePrimary = "#005197";

function CompanyInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");
    const [companyData, setCompanyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [companyProjects, setCompanyProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [isListView, setIsListView] = useState(true);
    const projectStatus = useProjectStatus();

    const calculateProgress = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const today = new Date();
        const totalDuration = endDate - startDate;
        const elapsed = today - startDate;
        if (today < startDate) return 0;
        if (today > endDate) return 100;
        return Math.round((elapsed / totalDuration) * 100);
    };

    const remainingDaysCalc = (end) => {
        if (!end) return 0;
        const endDate = new Date(end);
        const today = new Date();
        return Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    };

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
                let company = list.find(c => c.companyId === parseInt(id) || c.id === parseInt(id) || c.companyId == id || c.id == id);
                
                if (company && company.companyLevel === 'SECOND_LEVEL' && company.parentCompany) {
                    const mergedCompany = { ...company.parentCompany };
                    for (const key in company) {
                        const val = company[key];
                        if (val !== null && val !== undefined) {
                            if (Array.isArray(val)) {
                                if (val.length > 0) mergedCompany[key] = val;
                            } else if (typeof val === 'string' && val.trim() !== '') {
                                mergedCompany[key] = val;
                            } else if (typeof val !== 'string') {
                                mergedCompany[key] = val;
                            }
                        }
                    }
                    // Retain explicit identity descriptors natively overriding parent definitions locally
                    mergedCompany.parentCompany = company.parentCompany;
                    mergedCompany.id = company.id;
                    mergedCompany.companyId = company.companyId || company.id;
                    company = mergedCompany;
                }

                setCompanyData(company);
            } catch (error) {
                console.error("Error fetching company details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) fetchData();
    }, [id, baseUrl, token]);

    useEffect(() => {
        if (!companyData || !companyData.id || activeTab !== "projects") return;
        
        const fetchProjects = async () => {
            setProjectsLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/projects/${companyData.companyId || companyData.id}`, { headers });
                setCompanyProjects(response.data || []);
            } catch (error) {
                console.error("Error fetching company projects:", error);
            } finally {
                setProjectsLoading(false);
            }
        };

        fetchProjects();
    }, [companyData, activeTab, baseUrl]);

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
            <div className="d-flex justify-content-between align-items-center mb-4 text-start">
                <div className="d-flex align-items-center">
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
                {companyData && (
                    <button
                        className="btn px-4 fw-bold text-white d-flex align-items-center gap-2"
                        style={{ backgroundColor: bluePrimary, borderRadius: '8px' }}
                        onClick={() => navigate('/company-form', { state: { editCompanyId: companyData.id || companyData.companyId } })}
                    >
                        <Edit size={18} />
                        Edit Company
                    </button>
                )}
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
                                    <DetailRow label="Parent Company" value={companyData.parentCompany?.companyName || companyData.parentCompany} />
                                    <DetailRow label="Nature of Company" value={companyData.companyNature || companyData.comNatureId} />
                                    <DetailRow label="Nature of Business" value={companyData.businessNature?.businessNature || companyData.businessNature || companyData.businessNatureId} />
                                    <DetailRow label="Constitution" value={companyData.companyConstitution?.comConstitution || companyData.companyConstitution || companyData.companyConstitutionId} />
                                    <DetailRow label="Status" value={companyData.companyStatus || companyData.statusId} />
                                    <DetailRow label="Financial Start Month" value={companyData.finStartMonth} />
                                    <DetailRow label="Default Language" value={companyData.language?.language || companyData.language || companyData.languageId} />
                                    <DetailRow label="Currency" value={companyData.currency?.currencyName || companyData.currency || companyData.currencyId} />
                                </div>

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Address Details</h5>
                                {companyData.addressDetails && companyData.addressDetails.length > 0 ? (
                                    companyData.addressDetails.map((addr, idx) => (
                                        <div key={idx} className="card mb-3 border-light bg-light">
                                            <div className="card-body row">
                                                <DetailRow label="Address Type" value={addr.addressType?.addressType || addr.addressType || addr.addressTypeId} />
                                                <DetailRow label="Address 1" value={addr.address1} />
                                                <DetailRow label="Address 2" value={addr.address2} />
                                                <DetailRow label="City" value={addr.city?.city || addr.city || addr.cityName} />
                                                <DetailRow label="State" value={addr.state?.state || addr.state || addr.stateName} />
                                                <DetailRow label="Country" value={addr.country?.country || addr.country || addr.countryName} />
                                                <DetailRow label="Zip Code" value={addr.zipCode} />
                                                <DetailRow label="Phone No" value={addr.phoneNo} />
                                                <DetailRow label="Fax No" value={addr.faxNo} />
                                                <DetailRow label="Email" value={addr.email} />
                                                <DetailRow label="Website" value={addr.website} />
                                                <DetailRow label="Is Primary" value={addr.isPrimary ? 'Yes' : 'No'} />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted">No address details available.</div>
                                )}

                                <hr className="my-4" />

                                <h5 className="mb-4 fw-bold text-start" style={{ color: bluePrimary }}>Contact Person</h5>
                                {companyData.contacts && companyData.contacts.length > 0 ? (
                                    companyData.contacts.map((contact, index) => (
                                        <div key={index} className="row mb-3">
                                            <DetailRow label="Name" value={contact.name} />
                                            <DetailRow label="Position" value={contact.designation?.designationName || contact.position} />
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
                                                    <DetailRow label="Tax Type" value={tax.taxType?.taxType || tax.taxType || tax.taxTypeId} />
                                                    <DetailRow label="Registration No" value={tax.taxRegNo} />
                                                    <DetailRow label="Registration Date" value={formatDate(tax.taxRegDate)} />
                                                    <DetailRow label="Territory Type" value={tax.territoryType?.territoryType || tax.territoryTypeId} />
                                                    <DetailRow label="Territory" value={tax.territory?.city || tax.territory?.state || tax.territory?.country || tax.territory} />
                                                    <DetailRow label="Effective From" value={formatDate(tax.effectiveFrom)} />
                                                    <DetailRow label="Effective To" value={formatDate(tax.effectiveTo)} />
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
                                                        <div className="small text-muted mb-1">{director.directorType?.directorType || getSafeValue(director.directorType) || director.directorTypeId}</div>
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
                                                        <DetailRow label="Partner" value={jv.partner?.companyName || jv.partner?.shortName || jv.partnerId} fullWidth />
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
                                                        <DetailRow label="Type" value={info.identityType?.idType || info.idType || info.idTypeId} fullWidth />
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
                                {companyData.profile && companyData.profile.length > 0 ? (
                                    companyData.profile.map((prof, idx) => (
                                        <div key={idx} className="card mb-3 border-light bg-light">
                                            <div className="card-body row">
                                                <DetailRow label="Order No" value={prof.orderNo} />
                                                <DetailRow label="Remarks" value={prof.remarks} />
                                                <div className="col-12 mt-3">
                                                    <div className="text-muted small mb-1">Description</div>
                                                    <p className="bg-white p-3 rounded border">{prof.description || "No description provided."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
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
                                                        <DetailRow label="Language" value={local.language?.language || local.language || local.languageId} fullWidth />
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
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold m-0 text-start" style={{ color: bluePrimary }}>Associated Projects</h5>
                                    <div className="col-auto d-flex flex-row justify-content-end me-1 mt-1 mb-1">
                                        <button className={`change-view ${isListView ? "active" : ""}`} onClick={() => { setIsListView(true); }}>
                                            <FaList />
                                        </button>
                                        <button className={`change-view ${!isListView ? "active" : ""}`} onClick={() => { setIsListView(false); }}>
                                            <FaThLarge />
                                        </button>
                                    </div>
                                </div>

                                {projectsLoading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading projects...</span>
                                        </div>
                                    </div>
                                ) : companyProjects.length === 0 ? (
                                    <div className="text-muted p-5 text-center bg-light rounded">
                                        No projects found for this company.
                                    </div>
                                ) : (
                                    isListView ? (
                                        <div className="table-responsive">
                                            <table className="table-container table rounded">
                                                <thead>
                                                    <tr>
                                                        <th>Project No</th>
                                                        <th>Project Name</th>
                                                        <th>Value of Project(<IndianRupee size={14} />) </th>
                                                        <th>Start Date</th>
                                                        <th>End Date</th>
                                                        <th>Sector</th>
                                                        <th>Status</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {companyProjects.map((project, index) => (
                                                        <tr key={index}>
                                                            <td>{project.projectCode}</td>
                                                            <td>{project.projectName}</td>
                                                            <td>{project.estimatedValue}</td>
                                                            <td>{project.startDate && new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</td>
                                                            <td>{project.endDate && new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</td>
                                                            <td>{project.sectorName}</td>
                                                            <td>{projectStatus.map((state) => (
                                                                state.status === project.status && (
                                                                    <span key={state.status} className="badge rounded-pill" style={{ backgroundColor: state.bgColor, color: state.textColor, fontSize: '12px' }}>
                                                                        {state.status}
                                                                    </span>
                                                                )
                                                            ))}</td>
                                                            <td>
                                                                <Link to={`/dashboard/project/${project.projectId}`} className="text-decoration-none small">
                                                                    <Action />
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="row g-3">
                                            {companyProjects.map((project, index) => (
                                                <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                                                    <div className="card project-card h-100 shadow-sm border-0">
                                                        <div className="card-body d-flex flex-column justify-content-between">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <span className="project-code fw-bold text-primary">
                                                                    {project.projectCode}
                                                                </span>
                                                                {projectStatus.map((state) => (
                                                                    state.status === project.status && (
                                                                        <span key={state.status} className="badge rounded-pill" style={{ backgroundColor: state.bgColor, color: state.textColor, fontSize: '12px' }}>
                                                                            {state.status}
                                                                        </span>
                                                                    )
                                                                ))}
                                                            </div>

                                                            <div className="mb-2 text-start">
                                                                <p className="project-name fw-bold">
                                                                    {project.projectName}
                                                                </p>
                                                            </div>

                                                            <div className="d-flex justify-content-between mt-2 small">
                                                                <span>Start date:</span>
                                                                <span>
                                                                    {project.startDate && new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                                                                </span>
                                                            </div>

                                                            <div className="d-flex justify-content-between mt-1 small">
                                                                <span>End date:</span>
                                                                <span>
                                                                    {project.endDate && new Date(project.endDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                                                                </span>
                                                            </div>

                                                            <div className="d-flex justify-content-between mt-1 small">
                                                                <span>Sector:</span>
                                                                <span>{project.sectorName}</span>
                                                            </div>

                                                            <div className="d-flex justify-content-between mt-1 small">
                                                                <span>Value:</span>
                                                                <span><IndianRupee size={14} />{project.estimatedValue}</span>
                                                            </div>

                                                            <div className="progress mt-3" style={{ height: "10px" }}>
                                                                <div className="progress-bar" style={{ width: `${calculateProgress(project.startDate, project.endDate)}%` }}></div>
                                                            </div>

                                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                                <span className="small text-muted">
                                                                    {remainingDaysCalc(project.endDate)} days remaining
                                                                </span>
                                                                <Link to={`/dashboard/project/${project.projectId}`} className="text-decoration-none small">
                                                                    <Action /><span className='ms-1' style={{ color: '#005197' }}>View details</span>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                )}
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
