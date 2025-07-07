import { useEffect, useState } from "react";
import '../CSS/Styles.css';
import axios from "axios";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { FaInfoCircle, FaCheckCircle, FaFileAlt, FaPlus } from "react-icons/fa";
import { useRegions } from "../Context/RegionsContext";
import { useSectors } from "../Context/SectorsContext";
import { useScope } from "../Context/ScopeContext";
import { useUom } from "../Context/UomContext";
import ProjectInfo from "../Utills/ProjectInfo";
import FeasibilityStudy from "../Utills/FeasibilityStudy";
function ProjectCreation() {
    const [loading, setLoading] = useState(false);
    const { projectId } = useParams();
    const [project, setProject] = useState({
        projectCode: "",
        projectName: "",
        shortName: "",
        agreementNumber: "",
        agreementDate: "",
        startDate: "",
        endDate: "",
        buildingArea: "",
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
    const [viewMode, setViewMode] = useState(false);

    useEffect(() => {
        if (projectId && project.projectStatus === 'PLANNING') {
            setEnabledTabs(['info', 'feasibility', 'document']);
            setViewMode(true);
        } else if (projectId) {
            setEnabledTabs(['info', 'feasibility']);
            setViewMode(true);
        } else {
            setEnabledTabs(['info']);
            setActiveTab('info');
        }
    }, [projectId, project.projectStatus]);

    const regionOptions = useRegions().map(region => ({
        value: region.id,
        label: region.country
    }));
    const uomOptions = useUom().map(uom => ({
        value: uom.id,
        label: uom.uomName
    }));
    const sectorOptions = useSectors().map(sector => ({
        value: sector.id,
        label: sector.sectorName,
    }));
    const scopeOptions = useScope().map(scopes => ({
        value: scopes.id,
        label: scopes.scope,
    }));


    const handleTabs = (tab) => {
        if (enabledTabs.includes(tab)) {
            setActiveTab(tab);
        }
    }


    useEffect(() => {
        if (projectId) {
            axios
                .get(`http://localhost:8080/tactive/project/viewProjectInfo/${projectId}`)
                .then((res) => {
                    if (res.status === 200) {
                        setProject(res.data);
                        setScopePack(res.data.scopeOfPackages.map(pkg => pkg.id));
                        setRegion(res.data.region.id);
                        setSector(res.data.sector.id);
                        setUom(res.data.uom.id);
                        setActiveTab('info');
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch project:", err);
                });
        }
    }, [projectId]);


    function handleSubmit() {
        try {
            setLoading(true);
            if (!region) throw new Error('Region is required');
            if (!sector) throw new Error('Sector is required');
            if (!uom) throw new Error('UOM is required');

            project.otherAmenities = Array.isArray(project.otherAmenities)
                ? project.otherAmenities
                : project.otherAmenities.split(',').map(a => a.trim());
            project.projectStatus = 'UNDER_REVISION';

            const projectJson = project;
            const params = new URLSearchParams();
            params.append('regionId', region);
            params.append('sectorId', sector);
            params.append('uomId', uom);
            scopePack.forEach(id => params.append('scopePackagesIds', id));


            axios.post(`http://localhost:8080/tactive/project/createProject?${params.toString()}`, projectJson)
                .then(res => {
                    if (res.status === 201) {
                        toast.success("Project saved successfully!", { duration: 3000 });
                        setTimeout(() => {
                            window.location.href = `/ProjectManagement/project/${res.data.id}`;
                        }, 3000);
                    }
                })
                .catch(err => {
                    console.error('Error creating project:', err);
                    if (err.response?.status === 409) {
                        toast.error("Conflict: Project already exists or violates unique constraints.");
                    } else {
                        toast.error("Something went wrong while creating the project.");
                    }
                })
                .finally(() => {
                    setLoading(false);
                });

        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    }



    const renderDocuments = () => (
        <div>Documentation</div>
    )
    return (
        <div className="container-fluid">
            <div className="row align-items-center mb-4">
                <div className="col-auto">
                    {projectId ? (<h5 className="fw-bold mb-0 ms-2">{project.projectName}</h5>) : (<h5 className="fw-bold mb-0 ms-2">Project Creation</h5>)}

                </div>
                {projectId &&
                    <div className="col-auto ms-auto">
                        <button className="btn action-button me-1" onClick={() => window.location.href = '/ProjectManagement'}><FaPlus /><span className="ms-3">New Project</span></button>
                    </div>
                }

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
                <ProjectInfo
                    project={project}
                    uomOptions={uomOptions}
                    regionOptions={regionOptions}
                    scopeOptions={scopeOptions}
                    sectorOptions={sectorOptions}
                    region={region}
                    sector={sector}
                    scopePack={scopePack}
                    uom={uom}
                    viewMode={viewMode}
                    loading={loading}
                    setProject={setProject}
                    setRegion={setRegion}
                    setSector={setSector}
                    setScopePack={setScopePack}
                    setUom={setUom}
                    handleSubmit={handleSubmit}
                />}
                {activeTab === 'feasibility' &&
                    <FeasibilityStudy
                        project={project}
                        uomOptions={uomOptions}
                        viewMode={viewMode}
                        setActiveTab={setActiveTab}
                        handleSubmit={handleSubmit}
                    />}
                {activeTab === 'document' && renderDocuments()}
            </div>
        </div>
    )
}
export default ProjectCreation;