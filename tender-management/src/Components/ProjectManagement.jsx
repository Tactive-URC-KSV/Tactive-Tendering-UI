import { useEffect, useState, useRef } from "react";
import '../CSS/Styles.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { FaInfoCircle, FaCheckCircle, FaFileAlt } from "react-icons/fa";
import ProjectDetails from "../Utills/ProjectDetails";
import FeasibilityStudy from "../Utills/FeasibilityStudy";
import Documents from "../Utills/Documents";
function ProjectCreation() {
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
    const [activeTab, setActiveTab] = useState('');
    const [enabledTabs, setEnabledTabs] = useState([]);
    const fileInputRef = useRef(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleTabs = (tab) => {
        if (enabledTabs.includes(tab)) {
            setActiveTab(tab);
        }
    }


    useEffect(() => {
        if (projectId && project.projectStatus === 'Internal Estimation') {
            setEnabledTabs(['info', 'feasibility', 'document']);
        } else if (projectId) {
            setEnabledTabs(['info', 'feasibility']);
        } else {
            setEnabledTabs(['info']);
            setActiveTab('info');
        }
    }, [projectId, project.projectStatus]);


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
                        setActiveTab('feasibility');
                        
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch project:", err);
                });
        }
    }, [projectId]);


    const handleSubmit = async () => {
        try {
            setLoading(true);
            project.otherAmenities = Array.isArray(project.otherAmenities)
                ? project.otherAmenities
                : project.otherAmenities.split(',').map(a => a.trim());

            const projectJson = {
                project,
                regionId: region,
                sectorId: sector,
                uomId: uom,
                scopeOfPackageIds: scopePack,
            };
            console.log(projectJson);

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/createProject`, projectJson, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 201) {
                setProject(prev => ({ ...prev, projectId: res.data.id }));
                if (uploadedFiles.length > 0) {
                    const formData = new FormData();
                    uploadedFiles.forEach(file => formData.append('files', file));

                    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/saveProjectFiles/${res.data.id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then((res) => {
                            if (res.status === 201) {
                                toast.success(`Project saved successfully!`, { duration: 3000 });
                                setTimeout(() => {
                                    window.location.href = `/Dashboard/project/${project.projectId}`;
                                }, 3000);
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            console.error("Failed to save project files");
                        })
                }

                else {
                    toast.success("Project created successfully!");
                    setTimeout(() => {
                        window.location.href = `/Dashboard/project/${project.projectId}`;
                    }, 3000);
                }


            }

        } catch (error) {
            console.error('Error creating project:', error);
            if (error.response?.status === 409) {
                toast.error(error.message);
            } else {
                toast.error(error.message);
            }
        } finally {
            setLoading(false);
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