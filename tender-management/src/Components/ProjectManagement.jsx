import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle, FaFileAlt, FaInfoCircle } from "react-icons/fa";
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../CSS/Styles.css';
import Documents from "../Utills/Documents";
import FeasibilityStudy from "../Utills/FeasibilityStudy";
import ProjectDetails from "../Utills/ProjectDetails";
import { useNavigate } from "react-router-dom";

function ProjectCreation() {

    const navigate = useNavigate();
    const [feasbilityStudy, setFeasbilityStudy] = useState({});
    const [loading, setLoading] = useState(false);
    const { projectId } = useParams();
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
    const [region, setRegion] = useState('');
    const [sector, setSector] = useState('');
    const [uom, setUom] = useState('')
    const [scopePack, setScopePack] = useState([]);
    const [activeTab, setActiveTab] = useState('info');
    const [enabledTabs, setEnabledTabs] = useState([]);
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleTabs = (tab) => {
        if (enabledTabs.includes(tab)) {
            setActiveTab(tab);
        }
    }

    useEffect(() => {
        if (projectId && feasbilityStudy.feasibilityApproved) {
            setEnabledTabs(['info', 'feasibility', 'document']);
        } else if (projectId) {
            setEnabledTabs(['info', 'feasibility']);
        } else {
            setEnabledTabs(['info']);
        }
    }, [projectId, feasbilityStudy]);

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (hash) {
            setActiveTab(hash);
        }
    }, []);

    useEffect(() => {
        if (projectId) {
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                })
                .then((res) => {
                    if (res.status === 200) {
                        setProject(res.data);
                        setScopePack(res.data.scopeOfPackages.map(pkg => pkg.id));
                        setRegion(res.data.region.id);
                        setSector(res.data.sector.id);
                        setUom(res.data.uom.id);
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch project:", err);
                });

            axios.get(`${import.meta.env.VITE_API_BASE_URL}/feasibility/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    setFeasbilityStudy(res.data);
                }
            }).catch(err => {
                console.log(err);
            })
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
                : project.otherAmenities.split(',').map(a => a.trim());

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
                            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
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
                            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (response.status === 201) {
                    const newProjectId = response.data.id || response.data.projectId;
                    setProject(prev => ({ ...prev, id: newProjectId, projectId: newProjectId }));
                    currentProjectId = newProjectId;
                    toast.success("Project created successfully!");
                }
            }

            if (uploadedFiles.length > 0 && currentProjectId) {
                const formData = new FormData();
                uploadedFiles.forEach(file => formData.append('files', file));

                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/project/saveProjectFiles/${currentProjectId}`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );

                setUploadedFiles([]);
            }

        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
            setTimeout(() => {
                navigate(`/projectmanagement/project/${project.id}#feasibility`);
            }, 1000);
        }
    };

    return (
        <div className="container-fluid">
            <div className="row align-items-center mb-4">
                <div className="col-auto">
                    {projectId ? (<h5 className="fw-bold mb-0 ms-2">{project.projectName}</h5>) : (<h5 className="fw-bold mb-0 ms-2">Project Creation</h5>)}
                </div>
            </div>
            <div className="row d-flex justify-content-around mb-4 ms-2 me-2 bg-white rounded ">
                <div className="col-lg-4 col-md-4">
                    <button className={`tab ${activeTab === 'info' ? 'active' : ''} ${enabledTabs.includes('info') ? 'enabled' : ''}  w-75 h-100 p-2`} onClick={() => handleTabs('info')}>
                        <FaInfoCircle className="me-2" />Project Info
                    </button>
                </div>
                <div className="col-lg-4 col-md-4">
                    <button className={`tab ${activeTab === 'feasibility' ? 'active' : ''} ${enabledTabs.includes('feasibility') ? 'enabled' : ''} w-75 h-100 p-2`} onClick={() => handleTabs('feasibility')} disabled={!enabledTabs.includes('feasibility')}>
                        <FaCheckCircle className="me-2" />Feasibility Study
                    </button>
                </div>
                <div className="col-lg-4 col-md-4">
                    <button className={`tab ${activeTab === 'document' ? 'active' : ''} ${enabledTabs.includes('document') ? 'enabled' : ''} w-75 h-100 p-2`} onClick={() => handleTabs('document')} disabled={!enabledTabs.includes('document')}>
                        <FaFileAlt className="me-2" />Documentation
                    </button>
                </div>
            </div>
            <div className="tab-content  ms-2 me-2">
                {activeTab === 'info' &&
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
                    />}
                {activeTab === 'feasibility' &&
                    <FeasibilityStudy
                        project={project}
                        setActiveTab={setActiveTab}
                    />}
                {activeTab === 'document' &&
                    <Documents />
                }
            </div>
        </div>
    )
}
export default ProjectCreation;