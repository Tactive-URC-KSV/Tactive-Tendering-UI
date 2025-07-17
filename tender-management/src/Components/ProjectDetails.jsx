import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ReactComponent as ArrowLeft } from "../assest/ArrowLeft.svg";
import { ReactComponent as Edit } from "../assest/Edit.svg";
import { ReactComponent as EditBlue } from "../assest/Edit_Blue.svg";
import { ReactComponent as GeneralInfo } from "../assest/GeneralInfo.svg";
import { ReactComponent as TechnicalInfo } from "../assest/TechDetails.svg";
import { Link } from "react-router-dom";
import "../CSS/Styles.css";
function ProjectDetails() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const editDetails = () => {
        navigate(`/ProjectManagement/project/${project.id}`);
    };

    useEffect(() => {
        if (projectId) {
            axios
                .get(
                    `${process.env.REACT_APP_API_BASE_URL}/project/viewProjectInfo/${projectId}`,
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
        }
    }, [projectId]);

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
        { label: "Region", value: project.region?.country || "N/A" },
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
    ];

    return (
        <div className="container-fluid">
            <div className="row align-items-center mb-4">
                <div className="col-auto">
                    <span onClick={() => navigate(-1)} className="text-decoration-none small cursor-pointer me-2">
                        <ArrowLeft size={20} />
                    </span>
                    Project Details
                </div>
                <div className="col-auto ms-auto">
                    <button className="btn action-button btn-sm me-1" onClick={editDetails}> <Edit /> <span className="ms-2">Edit Project</span></button>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12 ms-auto me-3 rounded-3 project-title-header d-flex justify-content-between p-3">
                    <div className="text-start">
                        <h5>{project.projectName}</h5>
                        <p>Project Code - {project.projectCode}</p>
                    </div>
                    <div className="text-end">
                        {/* <span
              className="project-status badge text-light"
              style={{ backgroundColor: "#005197CC" }}
            >
              {
                statusList.find(
                  (status) => status.name === project.projectStatus
                )?.label
              }
            </span> */}
                        <p>Project Code - {project.projectCode}</p>
                    </div>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-lg-8 col-md-8  me-2 bg-white rounded-3 p-3">
                    <div className="project-info-header d-flex justify-content-between align-items-center p-2">
                        <p className="fs-5 fw-bold">Project Information</p>
                        <Link to={`/ProjectManagement/project/${project.id}`} className='text-decoration-none small'><EditBlue /></Link>
                    </div>
                    <div className="text-start d-flex align-items-center p-2">
                        <div className="mt-2">
                            <p className="fs-6 fw-bold"><GeneralInfo /> General Information</p>
                        </div>
                    </div>
                    <div className="mt-2 ms-2 text-start">
                        <div className="row">
                            {generalInfo.map((item, index) => (
                                <div className="col-md-6 mb-3" key={index} style={{ fontSize: '14px' }}>
                                    <div className="text-muted">{item.label}</div>
                                    <div className="fw-bold mt-1">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-start d-flex align-items-center p-2">
                        <div className="mt-2">
                            <p className="fs-6 fw-bold"><TechnicalInfo /> Technical Details</p>
                        </div>
                    </div>
                    <div className="mt-2 ms-2 text-start">
                        <div className="row">
                            {technicalInfo.map((item, index) => (
                                <div className="col-md-6 mb-3" key={index} style={{ fontSize: '14px' }}>
                                    <div className="text-muted">{item.label}</div>
                                    <div className="fw-bold mt-1">{item.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ProjectDetails;
