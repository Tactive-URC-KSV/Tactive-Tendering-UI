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
        projectName: "",
        shortName: "",
        startDate: "",
        endDate: "",
        needFeasibility: false
    });
    const [region, setRegion] = useState("");
    const [sector, setSector] = useState("");
    const [uom, setUom] = useState("");
    const [scopePack, setScopePack] = useState([]);
    const [activeTab, setActiveTab] = useState("info");
    const [enabledTabs, setEnabledTabs] = useState([]);
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [company, setCompany] = useState(null);
    const emptyAddress = { country: null, state: null, city: null, address: '', phoneNo: '', email: '' };
    const [addresses, setAddresses] = useState([{ ...emptyAddress }]);
    const [techFieldValues, setTechFieldValues] = useState({});

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
                        setProject({
                            ...res.data,
                            startDate: res.data.startDate ? new Date(res.data.startDate) : null,
                            endDate: res.data.endDate ? new Date(res.data.endDate) : null
                        });
                        setScopePack(res.data.scopeOfPackageIds || res.data.scopeOfPackages?.map((pkg) => pkg) || res.data.scopeOfPackage?.map(pkg => pkg.id) || []);
                        setRegion(res.data.regionId || res.data.region?.id || "");
                        setSector(res.data.sectorId || res.data.sector?.id || "");
                        setUom(res.data.uomId || res.data.uom?.id || "");
                        setCompany(res.data.companyId || res.data.company?.id || null);

                        const rawAddrs = res.data.projectAddresses && res.data.projectAddresses.length > 0 ? res.data.projectAddresses : (res.data.addresses || []);

                        if (rawAddrs.length > 0) {
                            const baseUrl = import.meta.env.VITE_API_BASE_URL;
                            const authHeaders = { Authorization: `Bearer ${sessionStorage.getItem("token")}` };
                            
                            let _allCountries = null;
                            const resolveLocationIds = async (cVal, sVal, cityVal) => {
                                let resolvedCId = cVal, resolvedSId = sVal, resolvedCityId = cityVal;

                                if (cVal) {
                                    if (!_allCountries) {
                                        try {
                                            const cRes = await axios.get(`${baseUrl}/countries`, { headers: authHeaders });
                                            _allCountries = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || []);
                                        } catch(e) { _allCountries = []; }
                                    }
                                    const obj = _allCountries.find(c => String(c.country).toLowerCase() === String(cVal).toLowerCase() || c.id === cVal);
                                    if (obj) resolvedCId = obj.id;
                                }
                                
                                if (resolvedCId) {
                                    try {
                                        const sRes = await axios.get(`${baseUrl}/states/${resolvedCId}`, { headers: authHeaders });
                                        const states = Array.isArray(sRes.data) ? sRes.data : (sRes.data?.data || []);
                                        const obj = states.find(s => String(s.state).toLowerCase() === String(sVal).toLowerCase() || s.id === sVal);
                                        if (obj) resolvedSId = obj.id;
                                    } catch(e) {}
                                }
                                
                                if (resolvedSId) {
                                    try {
                                        const cityRes = await axios.get(`${baseUrl}/cities/byState/${resolvedSId}`, { headers: authHeaders });
                                        const cities = Array.isArray(cityRes.data) ? cityRes.data : (cityRes.data?.data || []);
                                        const obj = cities.find(c => String(c.city).toLowerCase() === String(cityVal).toLowerCase() || c.id === cityVal);
                                        if (obj) resolvedCityId = obj.id;
                                    } catch(e) {}
                                }
                                return { resolvedCId, resolvedSId, resolvedCityId };
                            };

                            const parseAddresses = async () => {
                                const parsedAddrs = await Promise.all(rawAddrs.map(async (addr) => {
                                    const phoneVal = addr.phone || addr.phoneNo || '';
                                    const loc = await resolveLocationIds(addr.country, addr.state, addr.city);
                                    return {
                                        ...addr,
                                        address: addr.address || '',
                                        city: loc.resolvedCityId,
                                        state: loc.resolvedSId,
                                        country: loc.resolvedCId,
                                        phoneNo: phoneVal,
                                        email: addr.email || ''
                                    };
                                }));
                                setAddresses(parsedAddrs);
                            };
                            parseAddresses();
                        } else {
                            setAddresses([]);
                        }

                        if (res.data.techFields && res.data.techFields.length > 0) {
                            const tfv = {};
                            res.data.techFields.forEach(tf => {
                                const fieldId = tf.techField?.id || tf.techFieldId;
                                if (fieldId) {
                                    tfv[fieldId] = { value: tf.value };
                                }
                            });
                            setTechFieldValues(tfv);
                        }
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

    const handleSubmit = async (needFeasibility = false) => {
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
            if (!company) {
                toast.error("Company selection is required");
                return;
            }

            const formatDate = (date) => {
                if (!date) return "";
                if (typeof date === 'string') return date.split('T')[0];
                if (date instanceof Date) {
                    const d = new Date(date);
                    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                }
                return date;
            };

            const projectJson = {
                projectName: project.projectName || "",
                shortName: project.shortName || "",
                startDate: formatDate(project.startDate),
                endDate: formatDate(project.endDate),
                needFeasibility: needFeasibility,
                companyId: company || "",
                sectorId: sector || "",
                regionId: region || "",
                uomId: uom || "",
                scopeOfPackageIds: scopePack || [],
                addresses: addresses.map(addr => ({
                    address: addr.address || "",
                    city: addr.city || "",
                    state: addr.state || "",
                    country: addr.country || "",
                    phone: addr.phoneNo || "",
                    email: addr.email || ""
                })),
                techFields: Object.keys(techFieldValues).map(key => ({
                    techFieldId: key,
                    value: techFieldValues[key].value || ""
                }))
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
                        feasbilityStudy={feasbilityStudy}
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
                        company={company}
                        setCompany={setCompany}
                        addresses={addresses}
                        setAddresses={setAddresses}
                        techFieldValues={techFieldValues}
                        setTechFieldValues={setTechFieldValues}
                    />
                )}
                {activeTab === "feasibility" && (
                    <FeasibilityStudy project={project} sectorId={sector} setActiveTab={setActiveTab} />
                )}
                {activeTab === "document" && <Documents project={project} setActiveTab={setActiveTab} />}
            </div>
        </div>
    );
}

export default ProjectCreation;