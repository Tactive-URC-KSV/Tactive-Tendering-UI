import { useEffect, useState } from "react";
import '../CSS/Styles.css';
import axios from "axios";
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { FaInfoCircle, FaCheckCircle, FaFileAlt, FaPlus } from "react-icons/fa";
import { useRegions } from "../Context/RegionsContext";
import { useSectors } from "../Context/SectorsContext";
import { useScope } from "../Context/ScopeContext";
import { useUom } from "../Context/UomContext";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import '../CSS/custom-flatpickr.css';

function ProjectCreation() {
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
                        setActiveTab('feasibility');
                    }
                })
                .catch((err) => {
                    console.error("Failed to fetch project:", err);
                });
        }
    }, [projectId]);

    function handleSubmit() {
        project.otherAmenities = Array.isArray(project.otherAmenities) ? project.otherAmenities : project.otherAmenities.split(',').map(a => a.trim());
        project.projectStatus = 'UNDER_REVISION';
        const projectJson = project;
        const params = new URLSearchParams();
        if (region) params.append('regionId', region);
        if (sector) params.append('sectorId', sector);
        if (uom) params.append('uomId', uom);
        scopePack.forEach(id => params.append('scopePackagesIds', id));

        axios.post(`http://localhost:8080/tactive/project/createProject?${params.toString()}`, projectJson)
            .then(res => {
                if (res.status === 201) {
                    toast.success("Project saved successfully!");
                    window.location.href = `/ProjectManagement/project/${res.data.id}`
                }
            })
            .catch(err => {
                console.error('Error creating project:', err);
                if (err.response?.status === 409) {
                    toast.error("Conflict: Project already exists or violates unique constraints.");
                }
            });
    }

    const renderProjectInfo = () => (
        <div className="project-info-input">
            <div className="mt-3 mb-4 pb-5 bg-white">
                <div className="row px-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">General Information</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mb-4">
                        <label className=" projectform   text-start d-block">
                            Project Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Project Code"
                            value={project.projectName}
                            onChange={(e) => setProject({ ...project, projectName: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">
                            Project Code <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Project Code"
                            value={project.projectCode}
                            onChange={(e) => setProject({ ...project, projectCode: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">
                            Short Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Short Name"
                            value={project.shortName}
                            onChange={(e) => setProject({ ...project, shortName: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Agreement date</label>
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select agreement date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.agreementDate}
                            onChange={([date]) => setProject({ ...project, agreementDate: date })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Agreement number </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Agreemant number"
                            value={project.agreementNumber}
                            onChange={(e) => setProject({ ...project, agreementNumber: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block"> Start date </label>
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select Start date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.startDate}
                            onChange={([date]) => setProject({ ...project, startDate: date })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">End date</label>
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select End date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.endDate}
                            onChange={([date]) => setProject({ ...project, endDate: date })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block"> City </label>
                        <input type="text" className="form-input w-100" placeholder="Enter City"
                            value={project.city}
                            onChange={(e) => setProject({ ...project, city: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Address</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Address"
                            value={project.address}
                            onChange={(e) => setProject({ ...project, address: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 position-relative mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">Region</label>
                        <Select
                            options={regionOptions}
                            placeholder="Select Region"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            value={regionOptions.find((option) => option.value === region)}
                            onChange={(option) => setRegion(option ? option.value : null)}
                            isDisabled={viewMode}
                        />
                        </div>

                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">Sector</label>
                        <Select options={sectorOptions} placeholder="Select Sector" className="w-100" classNamePrefix="select"
                            value={sectorOptions.find((option) => option.value === sector)}
                            onChange={(option) => setSector(option ? option.value : null)}
                            isDisabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3">
                        <label className="projectform-select text-start d-block">Scope of Packages</label>
                        <Select options={scopeOptions} placeholder="Select Scope of Packages" isMulti className="w-100" classNamePrefix="select"
                            value={scopeOptions.filter(opt => scopePack.includes(opt.value))}
                            onChange={(option) =>
                                setScopePack(option ? option.map(o => o.value) : [])
                            }
                            isDisabled={viewMode}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Technical Information</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mb-4">
                        <label className="projectform text-start d-block">No. of. Floors</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Number of Floors"
                            value={project.numberOfFloors}
                            onChange={(e) => setProject({ ...project, numberOfFloors: parseInt(e.target.value) })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mb-4">
                        <label className="projectform   text-start d-block">Car Parking Floors</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Car Parking Floors"
                            value={project.carParkingFloors}
                            onChange={(e) => setProject({ ...project, carParkingFloors: parseInt(e.target.value) })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Above Ground</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Above Ground"
                            value={project.numberOfAboveGround}
                            onChange={(e) => setProject({ ...project, numberOfAboveGround: parseInt(e.target.value) })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Below Ground</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Below Ground"
                            value={project.numberOfBelowGround}
                            onChange={(e) => setProject({ ...project, numberOfBelowGround: parseInt(e.target.value) })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">UOM</label>
                        <Select options={uomOptions} placeholder="Select Unit of Measurements" className="w-100" classNamePrefix="select" isClearable
                            value={uomOptions.find((option) => option.value === uom)}
                            onChange={(option) => setUom(option ? option.value : null)}
                            menuPlacement="top"
                            isDisabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Total Area</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Total Area"
                            value={project.buildingArea}
                            onChange={(e) => setProject({ ...project, buildingArea: parseFloat(e.target.value) })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Other Amenities</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Other Amenities"
                            value={
                                Array.isArray(project.otherAmenities) ? project.otherAmenities.join(', ') : project.otherAmenities
                            }
                            onChange={(e) => setProject({ ...project, otherAmenities: e.target.value })}
                            disabled={viewMode}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Rate Per Units</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Rate Per Units"
                            value={project.ratePerUnit}
                            onChange={(e) => setProject({ ...project, ratePerUnit: parseFloat(e.target.value) })}
                            disabled={viewMode}
                        />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                {viewMode ? (<button className="btn action-button mt-2 me-4" onClick={() => setViewMode(false)}>Edit Details</button>) :
                    (<><button className="btn action-button mt-2 me-4 bg-secondary" onClick={() => { window.location.reload() }}>Cancel</button>
                        <button className="btn action-button mt-2 me-4" onClick={handleSubmit}>Submit</button></>)
                }
            </div>
        </div>
    );

    const renderFeasibility = () => (
        <div className="project-feasibility">
            <div className="mt-3 mb-4 bg-white pb-4 rounded">
                <div className="row">
                    <p className="mt-3 text-start ms-3 fs-6 fw-bold mb-3">
                        Project Estimation Overview
                    </p>
                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mt-3 mb-3">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2'>Number 0f Floors</p><br />
                            <p className='value fw-bold fs-5'>{project.numberOfFloors}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2'>Total Building Area</p><br />
                            <p className='value fw-bold fs-5'>{project.buildingArea}</p>
                        </div>
                    </div>

                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mb-3">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2'>Number 0f Floors</p><br />
                            <p className='value fw-bold fs-5'>{project.numberOfFloors}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2'>Total Building Area</p><br />
                            <p className='value fw-bold fs-5'>{project.buildingArea}</p>
                        </div>
                    </div>
                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mb-3">
                    <div className="col-12">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2'>Other Amenities</p><br />
                            <p className='value fw-bold fs-5'>{Array.isArray(project.otherAmenities) ? project.otherAmenities.join(', ') : project.otherAmenities}</p>
                        </div>
                    </div>
                </div>
            </div>



        </div>


    )
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
                {activeTab === 'info' && renderProjectInfo()}
                {activeTab === 'feasibility' && renderFeasibility()}
                {activeTab === 'document' && renderDocuments()}
            </div>
        </div>
    )
}
export default ProjectCreation;