import axios from "axios";
import { ArrowLeft, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Styles.css";
import { useProjectStatus } from "../Context/ProjectStatusContext";
import Archive from "../assest/Archive.svg?react";
import DocFail from "../assest/DocRej.svg?react";
import DocSuc from "../assest/DocSuc.svg?react";
import Edit from "../assest/Edit.svg?react";
import FinOverview from "../assest/Financial_Overview.svg?react";
import GeneralInfo from "../assest/GeneralInfo.svg?react";
import TechnicalInfo from "../assest/TechDetails.svg?react";
import Overview from "../assest/overview.svg?react";

function ProjectDetails() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [feasbilityStudy, setFeasbilityStudy] = useState();
    const [comments, setComments] = useState('');
    const projectStatus = useProjectStatus();
    const [user, setUser] = useState('');
    const [approvalDoc, setApprovalDoc] = useState();

    const editDetails = () => {
        navigate(`/ProjectManagement/project/${project.id}`);
    };

    const handleAddFeasibility = () => {
        navigate(`/ProjectManagement/project/${project.id}#feasibility`);
    };

    useEffect(() => {
        if (projectId) {
            axios
                .get(
                    `${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        setProject(res.data);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setError("Failed to fetch project details. Please try again later.");
                });

            axios.get(`${import.meta.env.VITE_API_BASE_URL}/feasibility/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
            ).then(res => {
                if (res.status === 200) {
                    setFeasbilityStudy(res.data);
                }
            }).catch(err => {
                console.log(err);
            })
        }
    }, [projectId]);

    useEffect(() => {
        if (feasbilityStudy) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/feasibility/approvalDoc/${feasbilityStudy.technFeasibility.id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            })
                .then(res => {
                    if (res.status === 200) {
                        setApprovalDoc(res.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [feasbilityStudy]);


    useEffect(() => {
        project && axios.get(`${import.meta.env.VITE_API_BASE_URL}/user/${project.createdBy}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if (res.status === 200) {
                setUser(res.data);
            }
        }).catch(err => {
            console.log(err)

        })
    }, [project])

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!project) return <div>No project data available</div>;

    const generalInfo = [
        { label: "Project Name", value: project.projectName },
        { label: "Project Code", value: project.projectCode },
        { label: "Short Name", value: project.shortName },
        { label: "Agreement Date", value: project.agreementDate },
        { label: "Agreement Number", value: project.agreementNumber },
        { label: "Start Date", value: project.startDate },
        { label: "End Date", value: project.endDate },
        { label: "Sector", value: project.sector?.sectorName || "N/A" },
        { label: "Address", value: project.address },
        { label: "City", value: project.city },
        { label: "Region", value: project.region?.regionName || "N/A" },
        {
            label: "Scope of Packages",
            value:
                project.scopeOfPackages?.map((pkg) => pkg.scope).join(", ") || "N/A",
        },
    ];

    const technicalInfo = [
        { label: "Number of Floors", value: project.numberOfFloors || "N/A" },
        { label: "Car Parking Floors", value: project.carParkingFloors || "N/A" },
        { label: "Above Ground", value: project.numberOfAboveGround || "N/A" },
        { label: "Below Ground", value: project.numberOfBelowGround || "N/A" },
        { label: "Unit of Measurement", value: project.uom?.uomName || "N/A" },
        { label: "Building Area", value: project.buildingArea || "N/A" },
        { label: "Other Amenities", value: project.otherAmenities?.join(", ") || "N/A" },
        { label: "Rate Per Unit", value: project.ratePerUnit || "N/A" },
        { label: "Estimated Value", value: `$ ${(project.estimatedValue / 1000000).toFixed(2)} M` || "N/A" },
    ];
    const projectEstimationOverview = [
        { label: 'No.Of.Floors', value: project.numberOfFloors || 'N/A', bgColor: '#EFF6FF', color: '#2563EB' },
        { label: 'Total Area', value: project.buildingArea || 'N/A', bgColor: '#F0FDF4', color: '#2BA95A' },
        { label: 'Rate per Units', value: `$ ${project.ratePerUnit} M` || 'N/A', bgColor: '#FAF5FF', color: '#9333EA' },
        { label: 'Estimated value', value: `$ ${(project.estimatedValue / 1000000).toFixed(2)} M` || 'N/A', bgColor: '#FFF7ED', color: '#EA580C' },
    ];
    const finFeasibility = [
        { label: 'Selling cost', value: `$ ${feasbilityStudy?.financialFeasibility?.sellingCost} M` || 'N/A' },
        { label: 'Rental cost', value: `$ ${(feasbilityStudy?.financialFeasibility?.rentalCost / 1000000).toFixed(2)} M` || 'N/A' },
        { label: 'ROI', value: feasbilityStudy?.financialFeasibility?.profitPercentage + ' % IRR in ' + feasbilityStudy?.financialFeasibility?.roiYear + ' years' || 'N/A' },
    ]

    function feasibilityApprove(status) {
        const encodedComments = encodeURIComponent(comments);
        console.log(JSON.stringify(comments));
        axios.put(`${import.meta.env.VITE_API_BASE_URL}/feasibility/${status}/${projectId}?comments=${encodedComments}`, null,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if (res.status === 200) {
                toast.success(res.data);
                setTimeout(() => {
                    window.location.reload();
                }, 2000)

            }
        }).catch(err => {
            toast.error(err.message);
        })
    }

    return (
        <div className="container-fluid" style={{ fontSize: '14px' }}>
            <div className="row align-items-center mb-4">
                <div className="col-auto fw-bold" style={{ fontSize: '18px' }}>
                    <span onClick={() => navigate(-1)} className="text-decoration-none small cursor-pointer me-2">
                        <ArrowLeft size={24} />
                    </span>
                    Project Details
                </div>
                <div className="col-auto ms-auto">
                    <button className="btn archive-button me-3" onClick={editDetails}> <Archive /> <span className="ms-2">Archive Project</span></button>
                    <button className="btn action-button me-1 ms-2" onClick={editDetails}> <Edit /> <span className="ms-2">Edit Project</span></button>

                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12 ms-auto me-3 rounded-3 project-title-header d-flex justify-content-between p-3">
                    <div className="text-start">
                        <h5>{project.projectName}</h5>
                        <p>Project Code - {project.projectCode}</p>
                    </div>
                    <div className="text-end me-2">
                        {projectStatus
                            .filter((state) => (state.id === project.projectStatus.id))
                            .map((state, index) => (
                                <span key={index} className="badge rounded-pill mb-1"
                                    style={{ backgroundColor: state.bgColor, color: state.textColor, fontSize: '14px' }}
                                >{state.status}</span>
                            ))}
                        <p className="me-1">created by - {user.name}</p>
                    </div>
                </div>
            </div>
            <div className="row mb-4 rounded-3" style={{ border: '0.5px solid #0051973D' }}>
                <div className="col-lg-12 col-md-12 me-2 bg-white rounded-3 p-3">
                    <div className="project-info-header d-flex justify-content-between align-items-center p-1 mb-1">
                        <span className="fw-bold ms-3 mb-2" style={{ fontSize: '17px' }}>Project Information</span>
                    </div>
                    <div className="text-start d-flex align-items-center p-2">
                        <div className="mt-1 ms-3">
                            <p className="fw-bold" style={{ fontSize: '16px' }}><GeneralInfo /> General Information</p>
                        </div>
                    </div>
                    <div className="mt-2 ms-4 mb-1 text-start">
                        <div className="row">
                            {generalInfo.map((item, index) => (
                                <div className="col-md-4 mb-3" key={index} style={{ fontSize: '14px' }}>
                                    <div className="text-muted">{item.label}</div>
                                    <div className="fw-bold mt-1">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-start d-flex align-items-center p-2 mt-3" style={{ borderTop: '1px solid #0051973D' }}>
                        <div className="mt-2 ms-3">
                            <p className="fw-bold" style={{ fontSize: '16px' }}><TechnicalInfo /> Technical Details</p>
                        </div>
                    </div>
                    <div className="mt-2 ms-4 text-start" >
                        <div className="row">
                            {technicalInfo.map((item, index) => (
                                <div className="col-md-4 mb-3" key={index} style={{ fontSize: '14px' }}>
                                    <div className="text-muted">{item.label}</div>
                                    <div className="fw-bold mt-1">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-4 mt-2 rounded-3 bg-white" style={{ border: '0.5px solid #0051973D' }}>
                {feasbilityStudy ? (<div className="col-md-12">
                    <div className="project-info-header d-flex justify-content-between align-items-center p-3">
                        <span className="fw-bold ms-2 " style={{ fontSize: '17px' }}>Feasibility Study</span>
                        {!feasbilityStudy.reviewedBy ? (<span className="badge rounded-pill" style={{ backgroundColor: '#FEF9C3', color: '#8D4D0E', fontSize: '14px' }}>Pending Review</span>)
                            : (feasbilityStudy.feasibilityApproved ? (<span className="badge rounded-pill bg-success" style={{ fontSize: '14px' }}>Approved</span>)
                                : (<span className="badge rounded-pill bg-danger" style={{ fontSize: '14px' }}>Rejected</span>))
                        }
                    </div>
                    <div className="fw-bold text-start mt-3 ms-3 p-2" style={{ fontSize: '16px' }}><Overview /><span className="ms-2">Project Estimation Overview</span></div>
                    <div className="row d-flex align-items-center justify-content-between g-2">
                        {projectEstimationOverview.map((item, index) => (
                            <div className="col-md-3 col-lg-3 mb-3 p-3" key={index} >
                                <div className="p-3 text-center rounded" style={{ backgroundColor: item.bgColor }}>
                                    <p className="fw-bold mb-1 text-start" style={{ color: item.color, fontSize: '14px' }}>{item.label}</p>
                                    <p className="mb-0 fw-bold text-start mt-1" >{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="ms-3 text-start p-1" style={{ borderBottom: '0.5px solid #0051973D' }}>
                        <p className="text-muted">Other Amenities</p>
                        <p className="fw-bold">{project.otherAmenities?.join(", ") || "N/A"}</p>
                    </div>
                    <div className="fw-bold text-start mt-3 ms-3 p-2" style={{ fontSize: '16px' }}><GeneralInfo /><span className="ms-2">Technical Feasibility</span></div>
                    <div className="d-flex text-start ms-3 justify-content-between p-2" style={{ borderBottom: '0.5px solid #0051973D' }}>
                        <div className="col-md-6 col-lg-6 mb-2">
                            <p className="text-muted">List of Approvals</p>
                            {approvalDoc?.map((doc, index) => (
                                <p className="fw-bold mt-1" key={index}>
                                    {doc.approved ? <DocSuc /> : <DocFail />}
                                    <span className="ms-2">{doc.documentName}</span></p>
                            ))}
                        </div>
                        <div className="col-md-6 col-lg-6 mb-2">
                            <p className="text-muted">Execution Capabilities</p>
                            <span className="fw-bold">{feasbilityStudy?.technFeasibility?.executionCapabilities?.join(", ") || "N/A"}</span>
                        </div>
                    </div>
                    <div className="fw-bold text-start mt-3 ms-3 p-2" style={{ fontSize: '16px' }}><FinOverview /><span className="ms-2">Financial Feasibility</span></div>
                    <div className=" ms-3 text-start mt-3 mb-2">
                        <span className="text-muted">Market Availability</span>
                        <p className="fw-bold mt-1">{feasbilityStudy?.financialFeasibility?.marketAvailability?.join(", ") || "N/A"}</p>
                    </div>
                    <div className="d-flex text-start justify-content-between p-1">
                        {finFeasibility.map((item, index) => (
                            <div className="col-lg-3 col-md-6 col-sm-12 " key={index} >
                                <div className="ms-3 text-start p-2" style={{ backgroundColor: '#F9FAFB' }}>
                                    <span className="text-black ms-3">{item.label}</span>
                                    <p className="fw-bold mt-2 text-success ms-3">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className=" ms-3 text-start mt-3 mb-2">
                        <span className="text-muted">Financial Backup</span>
                        <p className="fw-bold mt-1">{feasbilityStudy?.financialFeasibility?.financialBackup?.join(", ") || "N/A"}</p>
                    </div>
                    {feasbilityStudy?.reviewedBy === null && (
                        <div className=" ms-3 text-start mt-4 me-3">
                            <span className="text-muted">Feasibility analysis</span>
                            <p className="fw-bold mt-1">Review and approve or reject the feasibility study based on the analysis</p>
                            <div className="mt-4 mb-3">
                                <label className="projectform text-start d-block">Comments</label>
                                <input type="text" value={comments} onChange={(e) => setComments(e.target.value)} className="form-input w-100" placeholder="Enter Comments" />
                            </div>
                            <div className="d-flex justify-content-end mb-4">
                                <button className="btn btn-danger me-4 mt-2" onClick={() => feasibilityApprove('reject')}><X /><span className="ms-2">Reject</span></button>
                                <button className="btn btn-success mt-2" onClick={() => feasibilityApprove('approve')}><Check /><span className="ms-2">Approve</span></button>
                            </div>
                        </div>

                    )}

                </div>)
                    : (
                        <div className="d-flex justify-content-between align-items-center p-3">
                            <span className="fw-bold ms-2 " style={{ fontSize: '17px' }}>Feasibility Study</span>
                            <button
                                onClick={handleAddFeasibility}
                                className="btn action-button me-1"
                            >
                                Add Feasibility
                            </button>
                        </div>)}
            </div>
        </div>

    );
}

export default ProjectDetails;
