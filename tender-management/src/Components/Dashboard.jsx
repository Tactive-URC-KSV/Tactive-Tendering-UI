import { useState, useEffect } from 'react';
import { useRegions } from '../Context/RegionsContext';
import axios from 'axios';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { FaEye, FaList, FaThLarge } from 'react-icons/fa';
import '../CSS/Styles.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { ReactComponent as Total } from '../assest/Tot.svg';
import { ReactComponent as ToatalValue } from '../assest/Tot_val.svg';
import { ReactComponent as InProgress } from '../assest/In_prog.svg';
import { ReactComponent as Completed } from '../assest/Tot_com.svg';
import { useSectors } from '../Context/SectorsContext';

function ProjectWorklist() {
    const [isListView, setIsListView] = useState(true);
    const [error, setError] = useState('');
    const [projectName, setProjectName] = useState('');
    const [sector, setSector] = useState('');
    const [projectStatus, setStatus] = useState('');
    const [statusList, setStatusList] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const [region, setRegion] = useState('');
    const regionList = useRegions();
    const sectorList = useSectors();

    const statusOptions = statusList.map(status => ({
        value: status.name,
        label: status.label,
    }));

    const handleStatusChange = (selectedOption) => {
        filterByStatus(selectedOption?.value || '');
    };

    const regionOptions = regionList.map(region => ({
        value: region.id,
        label: region.country
    }));

    const handleRegionChange = (selectedOption) => {
        filterByRegion(selectedOption?.value || '');
    };

    const sectorOptions = sectorList.map(sector => ({
        value: sector.id,
        label: sector.sectorName
    }));

    const handleSectorChange = (selectedOption) => {
        filterBySector(selectedOption?.value || '');
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/project-status`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(response => {
                setStatusList(response.data);
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            });
    }, []);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/project/allProjects`, {
            headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
        })
            .then(response => {
                if (response.status === 200) {
                    setProjects(response.data);
                    setFilteredProjects(response.data);
                }
                else {
                    setError(response.data)
                }
            })
            .catch(error => {
                console.error('Error fetching projects:', error);
            });
    }, []);
    const searchProjects = (e) => {
        e.preventDefault();
        setProjectName(e.target.value);
        const searchTerm = e.target.value.toLowerCase();
        setFilteredProjects(projects.filter((project) => {
            return project.projectName.toLowerCase().includes(searchTerm)
        }));
        if (searchTerm === '') {
            setFilteredProjects(projects);
        }
    }
    const filterBySector = (selectedSector) => {
        setSector(selectedSector);
        const selectedStatus = projectStatus;
        const selectedRegion = region;
        filterProject(selectedSector, selectedStatus, selectedRegion);
    }
    const filterProject = (selectedSector, selectedStatus, selectedRegion) => {
        setFilteredProjects(projects.filter((project) => {
            return (project.sector === selectedSector || selectedSector === "" || selectedSector === "All") &&
                (project.projectStatus === selectedStatus || selectedStatus === "All" || selectedStatus === "") &&
                (selectedRegion === "All" || selectedRegion === "" || project.country === selectedRegion);
        }));
    }
    const filterByStatus = (selectedStatus) => {
        setStatus(selectedStatus);
        const selectedSector = sector;
        const selectedRegion = region;
        filterProject(selectedSector, selectedStatus, selectedRegion);
    }

    const filterByRegion = (selectedRegion) => {
        setRegion(selectedRegion);
        const selectedSector = sector;
        const selectedStatus = projectStatus;
        filterProject(selectedSector, selectedStatus, selectedRegion);
    }
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
    return (
        <div className='container-fluid mt-3 min-vh-100'>
            <div className='row align-items-center'>
                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3'>
                        <div className='text-start'>
                            <p className='report-feild fw-bold mb-2 mt-2'>Total Projects</p>
                            <p className='value fw-bold fs-4'>{projects.length}</p>
                        </div>
                        <div className='icon'><Total /></div>
                    </div>
                </div>

                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3'>
                        <div className='text-start'>
                            <p className='report-feild fw-bold mb-2 mt-2'>Under Construction</p>
                            <p className='value fw-bold fs-4'>{projects.filter(project => project.projectStatus === 'UNDER_CONSTRUCTION').length}</p>
                        </div>
                        <div className='icon'><ToatalValue /></div>
                    </div>
                </div>

                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3'>
                        <div className='text-start'>
                            <p className='report-feild fw-bold mb-2 mt-2'>Pre Construction</p>
                            <p className='value fw-bold fs-4'>{projects.filter(project => project.projectStatus !== 'COMPLETED'
                                && project.projectStatus !== 'UNDER_CONSTRUCTION'
                            ).length}</p>
                        </div>
                        <div className='icon'><InProgress /></div>
                    </div>
                </div>

                <div className='col-lg-3 col-md-6 col-sm-12'>
                    <div className='project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3'>
                        <div className='text-start'>
                            <p className='report-feild fw-bold mb-2 mt-2'>Completed</p>
                            <p className='value fw-bold fs-4'>{projects.filter(project => project.projectStatus === 'COMPLETED').length}</p>
                        </div>
                        <div className='icon'><Completed /></div>
                    </div>
                </div>
            </div>

            <div className='row mt-5 align-items-center bg-white pt-4 rounded'>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-4'>
                    <label className='projectform-select  text-start d-block ms-3 me-1'>Search</label>
                    <input type="text" value={projectName} className='form-input w-100' onChange={searchProjects} placeholder='Search by Project Name' />
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-4'>
                    <label className='projectform-select text-start d-block ms-3 me-1'>Sector</label>
                    <Select options={sectorOptions} placeholder="Filter by Sector" onChange={handleSectorChange} className="w-100" classNamePrefix="select" isClearable />
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-4'>
                    <label className='projectform-select text-start d-block ms-3 me-1'>Status</label>
                    <Select options={statusOptions} onChange={handleStatusChange} placeholder="Filter by Status" className="w-100" classNamePrefix="select" isClearable />
                </div>
                <div className='col-lg-3 col-md-6 col-sm-12 mb-4'>
                    <label className='projectform-select text-start d-block ms-3 me-1'>Region</label>
                    <Select options={regionOptions} placeholder="Filter by Region" onChange={handleRegionChange} className="w-100" classNamePrefix="select" isClearable />
                </div>
            </div>

            <div className='row mt-2'>
                <div className='col-12 d-flex flex-row justify-content-end me-1 mt-1 mb-1'>
                    <button className={`change-view ${isListView ? 'active' : ''}`} onClick={() => { setIsListView(true) }}><FaList /></button>
                    <button className={`change-view ${!isListView ? 'active' : ''}`} onClick={() => { setIsListView(false) }}><FaThLarge /></button>
                </div>
            </div>

            <div className="row mt-2">
                <div className='col-12'>{error}</div>
                {filteredProjects.length !== 0 &&
                    isListView ? (
                    <div className="table-responsive">
                        <table className='table-container table rounded'>
                            <thead>
                                <tr>
                                    <th>Project No</th>
                                    <th>Project Name</th>
                                    <th>Value of Project</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Sector</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProjects.map((project, index) => (
                                    <tr key={index}>
                                        <td>{project.projectCode}</td>
                                        <td>{project.projectName}</td>
                                        <td>$ {project.estimatedValue}</td>
                                        <td>{project.startDate}</td>
                                        <td>{project.endDate}</td>
                                        <td>{project.sectorName}</td>
                                        <td>{statusList.find(status => status.name === project.status)?.label}</td>
                                        <td><Link to={`project/${project.projectId}`} className='text-decoration-none small'><FaEye /></Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    filteredProjects.map((project, index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body d-flex flex-column justify-content-between">

                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="project-code fw-bold text-primary">{project.projectCode}</span>
                                        <span className="project-status badge text-light" style={{ backgroundColor: '#005197CC' }}>
                                            {statusList.find(status => status.name === project.status)?.label}
                                        </span>
                                    </div>

                                    <div className="mb-2 text-start">
                                        <p className="project-name fw-bold">{project.projectName}</p>
                                    </div>

                                    <div className="d-flex justify-content-between mt-2 small">
                                        <span>Start date:</span>
                                        <span>{project.startDate && new Date(project.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-1 small">
                                        <span>End date:</span>
                                        <span>{project.endDate && new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-1 small">
                                        <span>Sector:</span>
                                        <span>{project.sectorName}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-1 small">
                                        <span>Value:</span>
                                        <span>${project.estimatedValue}</span>
                                    </div>

                                    <div className="progress mt-3" style={{ height: '10px' }}>
                                        <div className="progress-bar" style={{ width: `${calculateProgress(project.startDate, project.endDate)}%` }}></div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="small text-muted">{remainingDaysCalc(project.endDate)} days remaining</span>
                                        <Link to={`/ProjectManagement/project/${project.projectId}`} className='text-decoration-none small'><FaEye /> View details</Link>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
}
export default ProjectWorklist;