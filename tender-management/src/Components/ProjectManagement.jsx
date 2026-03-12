import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaFileAlt, FaInfoCircle } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../CSS/Styles.css";
import Documents from "../Utills/Documents";
import FeasibilityStudy from "../Utills/FeasibilityStudy";
import ProjectDetails from "../Utills/ProjectDetails";

function ProjectCreation() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [feasbilityStudy, setFeasbilityStudy] = useState({});
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({
        id: "",
        projectCode: "",
        projectName: "",
        shortName: "",
        agreementNumber: "",
        agreementDate: "",
        startDate: "",
        endDate: "",
        buildingArea: "",
        phoneNo: "",
        email: "",
        numberOfFloors: "",
        numberOfAboveGround: "",
        numberOfBelowGround: "",
        carParkingFloors: "",
        ratePerUnit: "",
        city: "",
        address: "",
        otherAmenities: "",
        estimatedValue: "",
    });
    const [region, setRegion] = useState("");
    const [sector, setSector] = useState("");
    const [uom, setUom] = useState("");
    const [scopePack, setScopePack] = useState([]);
    const [activeTab, setActiveTab] = useState("info");
    const [enabledTabs, setEnabledTabs] = useState([]);
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Handle unauthorized errors within component scope
    const handleUnauthorized = () => {
        navigate("/login");
    };

    const handleTabs = (tab) => {
        if (enabledTabs.includes(tab)) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        if (projectId && feasbilityStudy.feasibilityApproved) {
            setEnabledTabs(["info", "feasibility", "document"]);
        } else if (projectId) {
            setEnabledTabs(["info", "feasibility"]);
        } else {
            setEnabledTabs(["info"]);
        }
    }, [projectId, feasbilityStudy]);

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (hash && enabledTabs.includes(hash)) {
            setActiveTab(hash);
        }
    }, [enabledTabs]);

    useEffect(() => {
        if (projectId) {
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        setProject(res.data);
                        setScopePack(res.data.scopeOfPackages?.map((pkg) => pkg) || []);
                        setRegion(res.data.regionId || "");
                        setSector(res.data.sectorId || "");
                        setUom(res.data.uomId || "");
                    }
                })
                .catch((err) => {
                    if (err?.response?.status === 401) {
                        handleUnauthorized();
                    }
                    console.error("Failed to fetch project:", err);
                });

            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/feasibility/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        setFeasbilityStudy(res.data);
                    }
                })
                .catch((err) => {
                    if (err?.response?.status === 401) {
                        handleUnauthorized();
                    }
                    console.log(err);
                });
        }
    }, [projectId]);

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!project.projectName) {
                toast.error("Project name is required");
                return;
            }
            if (!project.shortName) {
                toast.error("Short name is required");
                return;
            }

            project.otherAmenities = Array.isArray(project.otherAmenities)
                ? project.otherAmenities
                : project.otherAmenities.split(",").map((a) => a.trim());

            project.estimatedValue = project.buildingArea * project.ratePerUnit;

            const projectJson = {
                project,
                regionId: region,
                sectorId: sector,
                uomId: uom,
                scopeOfPackageIds: scopePack,
            };

            let response;
            let currentProjectId = projectId || project.id;

            if (currentProjectId) {
                response = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/project/updateProject/${currentProjectId}`,
                    projectJson,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    toast.success("Project updated successfully!");
                }
            } else {
                response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/project/createProject`,
                    projectJson,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (response.status === 201) {
                    currentProjectId = response.data.id || response.data.projectId;
                    setProject((prev) => ({ ...prev, id: currentProjectId }));
                    setEnabledTabs((prev) => [...prev, "feasibility"]);
                    toast.success("Project created successfully!");
                }
            }

            if (uploadedFiles.length > 0 && currentProjectId) {
                const formData = new FormData();
                uploadedFiles.forEach((file) => formData.append("files", file));

                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/project/saveProjectFiles/${currentProjectId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                setUploadedFiles([]);
            }

            // Navigate using currentProjectId
            if (currentProjectId) {
                const timer = setTimeout(() => {
                    navigate(`/projectmanagement/project/${currentProjectId}#feasibility`);
                }, 1000);
                return () => clearTimeout(timer); // Cleanup timeout
            } else {
                console.error("No project ID available for navigation");
                toast.error("Failed to navigate: Project ID not found");
            }
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid mt-3 p-4">
            <div className="row align-items-center mb-4 ms-2">
                <div className="col-auto d-flex align-items-center gap-3">
                    <button className="btn cancel-button d-flex align-items-center" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} className="me-2" /> Previous
                    </button>
                    {projectId ? (
                        <div className="fw-bold mb-0 fs-5" style={{ color: "#005197" }}>{project.projectName}</div>
                    ) : (
                        <div className="fw-bold mb-0 fs-5" style={{ color: "#005197" }}>Project Creation</div>
                    )}
                </div>
            </div>
            <div className="row g-0 mb-4 ms-2 me-2 bg-white rounded shadow-sm overflow-hidden">
                <div className="col-lg-4 col-md-4 text-center px-0">
                    <button
                        className={`btn w-100 h-100 p-2 d-flex align-items-center justify-content-center fw-bold rounded-0`}
                        style={{
                            backgroundColor: activeTab === "info" ? "#005197" : "transparent",
                            color: activeTab === "info" ? "white" : "#6c757d",
                            border: "none",
                            margin: "0",
                        }}
                        onClick={() => handleTabs("info")}
                    >
                        <FaInfoCircle className="me-2" /> Project Info
                    </button>
                </div>
                <div className="col-lg-4 col-md-4 text-center px-0">
                    <button
                        className={`btn w-100 h-100 p-2 d-flex align-items-center justify-content-center fw-bold rounded-0`}
                        style={{
                            backgroundColor: activeTab === "feasibility" ? "#005197" : "transparent",
                            color: activeTab === "feasibility" ? "white" : "#6c757d",
                            border: "none",
                            margin: "0",
                        }}
                        onClick={() => handleTabs("feasibility")}
                        disabled={!enabledTabs.includes("feasibility")}
                    >
                        <FaCheckCircle className="me-2" /> Feasibility Study
                    </button>
                </div>
                <div className="col-lg-4 col-md-4 text-center px-0">
                    <button
                        className={`btn w-100 h-100 p-2 d-flex align-items-center justify-content-center fw-bold rounded-0`}
                        style={{
                            backgroundColor: activeTab === "document" ? "#005197" : "transparent",
                            color: activeTab === "document" ? "white" : "#6c757d",
                            border: "none",
                            margin: "0",
                        }}
                        onClick={() => handleTabs("document")}
                        disabled={!enabledTabs.includes("document")}
                    >
                        <FaFileAlt className="me-2" /> Documentation
                    </button>
                </div>
            </div>
            <div className="tab-content ms-2 me-2">
                {activeTab === "info" && (
                    <ProjectDetails
                        project={project}
                        region={region}
                        sector={sector}
                        scopePack={scopePack}
                        uom={uom}
                        loading={loading}
                        setProject={setProject}
                        setRegion={setRegion}
                        setSector={setSector}
                        setScopePack={setScopePack}
                        setUom={setUom}
                        handleSubmit={handleSubmit}
                        fileInputRef={fileInputRef}
                        uploadedFiles={uploadedFiles}
                        setUploadedFiles={setUploadedFiles}
                    />
                )}
                {activeTab === "feasibility" && (
                    <FeasibilityStudy project={project} setActiveTab={setActiveTab} />
                )}
                {activeTab === "document" && <Documents project={project} setActiveTab={setActiveTab} />}
            </div>
        </div>
    );
}

export default ProjectCreation;