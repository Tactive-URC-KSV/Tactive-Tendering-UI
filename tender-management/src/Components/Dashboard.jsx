import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect, useState } from 'react';
import { FaList, FaThLarge } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import Action from '../assest/Action.svg?react';
import InProgress from '../assest/In_prog.svg?react';
import Total from '../assest/Tot.svg?react';
import ToatalValue from '../assest/Tot_val.svg?react';
import { useProjectStatus } from '../Context/ProjectStatusContext';
import { useRegions } from '../Context/RegionsContext';
import { useSectors } from '../Context/SectorsContext';
import '../CSS/Styles.css';
import { useNavigate } from 'react-router-dom';
import { IndianRupee } from 'lucide-react';

const handleUnauthorized = () =>{
   const navigate = useNavigate();
   navigate('/login');
}


function ProjectWorklist() {

    const [isListView, setIsListView] = useState(true);
    const [error, setError] = useState('');
    const [projectName, setProjectName] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [projects, setProjects] = useState([]);
    const regionList = useRegions();
    const companyList = useSectors();
    const projectStatus = useProjectStatus();
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    const statusOptions = projectStatus.map(status => ({
        value: status.id,
        label: status.status,
    }));

    const handleStatusChange = (selectedOption) => {
        setSelectedStatus(selectedOption);
        applyFilters(selectedRegion, selectedCompany, selectedOption);
    };

    const handleRegionChange = (selectedOption) => {
        setSelectedRegion(selectedOption);
        applyFilters(selectedOption, selectedCompany, selectedStatus);
    };

    const handleCompanyChange = (selectedOption) => {
        setSelectedCompany(selectedOption);
        applyFilters(selectedRegion, selectedOption, selectedStatus);
    };

    const regionOptions = regionList.map(region => ({
        value: region.id,
        label: region.regionName
    }));


    const companyOptions = companyList.map(company => ({
        value: company.id,
        label: company.companyName
    }));

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/allProjects`, {
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
                if (err?.response?.status === 401) {
                    handleUnauthorized();
                }
                console.error('Error fetching projects:', error);
            });
    }, []);

    const searchProjects = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setProjectName(searchTerm);

        const filtered = projects.filter(project => {
            const matchesSearch = project.projectName.toLowerCase().includes(searchTerm);
            const matchesRegion = !selectedRegion || project.regionName === selectedRegion.label;
            const matchesCompany = !selectedCompany || project.companyId === selectedCompany.value;
            const matchesStatus = !selectedStatus || project.status === selectedStatus.label;

            return matchesSearch && matchesRegion && matchesCompany && matchesStatus;
        });

        setFilteredProjects(filtered);
    }

    const projectCounts = projects.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
    }, {});


    const applyFilters = (region, company, status) => {
        const filtered = projects.filter(project => {
            const matchesRegion = !region || project.regionName === region.label;
            console.log(project.regionName);
            const matchesCompany = !company || project.companyId === company.value;
            const matchesStatus = !status || project.status === status.label;
            const matchesSearch = project.projectName.toLowerCase().includes(projectName.toLowerCase());

            return matchesRegion && matchesCompany && matchesStatus && matchesSearch;
        });

        setFilteredProjects(filtered);
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
        <div className="container-fluid mt-3 min-vh-100">
            <div className="row align-items-center mb-3 mt-3 ps-lg-2 ms-md-1">
                <div className='d-flex justify-content-between'>
                    <div className="col-lg-4 col-md-4 col-sm-12 ms-3">
                        <div className="project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3">
                            <div className="text-start">
                                <p className="report-feild fw-bold mb-2 mt-2">Total Projects</p>
                                <p className="value fw-bold fs-4">{projects.length}</p>
                            </div>
                            <div className="icon">
                                <Total />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-12 ">
                        <div className="project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3">
                            <div className="text-start">
                                <p className="report-feild fw-bold mb-2 mt-2">Total Value</p>
                                <p className="value fw-bold fs-4">
                                    <IndianRupee /> {projects.reduce((total, project) => total + parseInt(project.estimatedValue) / 1000000, 0).toFixed(2)} M
                                </p>
                            </div>
                            <div className="icon">
                                <ToatalValue />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-12 ">
                        <div className="project-counts d-flex justify-content-between align-items-center p-3 h-100 mb-3">
                            <div className="text-start">
                                <p className="report-feild fw-bold mb-2 mt-2">
                                    Active Projects
                                </p>
                                <p className="value fw-bold fs-4">
                                    {
                                        projects.filter(
                                            (project) =>
                                                project.projectStatus !== "Cancelled"
                                        ).length
                                    }
                                </p>
                            </div>
                            <div className="icon">
                                <InProgress />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row project-overview d-flex justify-content-center align-items-center py-3 h-100 mb-3 mt-3 mx-lg-4 mx-md-3 ms-md-4">
                <div className="text-start w-100">
                    <div className="row justify-content-center mb-3 mt-3">
                        <div className="col-12 text-start">
                            <h5 className="fw-bold mb-4">Project Status Overview</h5>
                        </div>

                        {projectStatus.map((config, index) => (
                            config.status !== 'Cancelled' && <div className="col-lg-2 col-md-4 col-sm-6 mb-3 d-flex justify-content-center" key={index}>
                                <div
                                    className="project-status-card p-3 text-center rounded"
                                    style={{
                                        backgroundColor: config.bgColor,
                                        color: config.textColor,
                                        width: '100%'
                                    }}
                                >
                                    <p className="status-count fw-bold fs-5 mb-1">{projectCounts[config.status] || 0}</p>
                                    <p className="status-label mb-0" style={{ color: "black" }}>{config.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row mt-3 align-items-center pt-4 rounded mx-4 px-3">
                <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <label className="text-start d-block me-1">
                        Status
                    </label>
                    <Select
                        options={statusOptions}
                        onChange={handleStatusChange}
                        placeholder="Filter by Status"
                        className="w-100 bg-transparent"
                        classNamePrefix="select"
                        isClearable
                        menuPlacement='auto'
                    />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <label className="text-start d-block me-1">
                        Region
                    </label>
                    <Select
                        options={regionOptions}
                        placeholder="Filter by Region"
                        onChange={handleRegionChange}
                        className="w-100 bg-transparent"
                        classNamePrefix="select"
                        isClearable
                        menuPlacement='auto'
                    />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <label className="text-start d-block me-1">
                        Company
                    </label>
                    <Select
                        placeholder="Filter by Company Name"
                        options={companyOptions}
                        onChange={handleCompanyChange}
                        className="w-100 bg-transparent"
                        classNamePrefix="select"
                        isClearable
                        menuPlacement='auto'
                        isDisabled={true}
                    />
                </div>
                <div className="col-lg-3 col-md-6 col-sm-12 mb-4">
                    <label className="text-start d-block me-1">
                        Search
                    </label>
                    <input type="text" value={projectName} className="form-input w-100 bg-transparent" onChange={searchProjects} placeholder="Search by Project Name" />
                </div>
            </div>

            <div className="row mt-2 mx-lg-3 pe-lg-2 mx-md-2 pe-md-1">
                <div className="col-12 d-flex flex-row justify-content-end me-1 mt-1 mb-1">
                    <button className={`change-view ${isListView ? "active" : ""}`} onClick={() => { setIsListView(true); }}>
                        <FaList />
                    </button>
                    <button className={`change-view ${!isListView ? "active" : ""}`} onClick={() => { setIsListView(false); }}>
                        <FaThLarge />
                    </button>
                </div>
            </div>

            <div className="row mt-2 mx-lg-3 mx-md-2">
                <div className="col-12">{error}</div>
                {filteredProjects.length !== 0 && isListView ? (
                    <div className="table-responsive">
                        <table className="table-container table rounded">
                            <thead>
                                <tr>
                                    <th>Project No</th>
                                    <th>Project Name</th>
                                    <th>Value of Project(<IndianRupee size={14}/>) </th>
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
                                        <td>{project.estimatedValue}</td>
                                        <td>{project.startDate &&
                                            new Date(project.startDate).toLocaleDateString(
                                                "en-US",
                                                { month: "short", day: "2-digit", year: "numeric" }
                                            )}</td>
                                        <td>{project.endDate &&
                                            new Date(project.endDate).toLocaleDateString(
                                                "en-US",
                                                { month: "short", day: "2-digit", year: "numeric" }
                                            )}</td>
                                        <td>{project.sectorName}</td>
                                        <td>{projectStatus.map((state) => (
                                            state.status === project.status && (
                                                <span key={state.status} className="badge rounded-pill"
                                                    style={{ backgroundColor: state.bgColor, color: state.textColor, fontSize: '12px' }}
                                                >
                                                    {state.status}
                                                </span>
                                            )
                                        ))}</td>
                                        <td>
                                            <Link
                                                to={`project/${project.projectId}`}
                                                className="text-decoration-none small"
                                            >
                                                <Action />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    filteredProjects.map((project, index) => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
                            <div className="card project-card h-100 shadow-sm border-0">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <span className="project-code fw-bold text-primary">
                                            {project.projectCode}
                                        </span>
                                        {projectStatus.map((state) => (
                                            state.status === project.status && (
                                                <span key={state.status} className="badge rounded-pill"
                                                    style={{ backgroundColor: state.bgColor, color: state.textColor, fontSize: '12px' }}
                                                >
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
                                            {project.startDate &&
                                                new Date(project.startDate).toLocaleDateString(
                                                    "en-US",
                                                    { month: "short", day: "2-digit", year: "numeric" }
                                                )}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-1 small">
                                        <span>End date:</span>
                                        <span>
                                            {project.endDate &&
                                                new Date(project.endDate).toLocaleDateString(
                                                    "en-US",
                                                    { month: "short", day: "2-digit", year: "numeric" }
                                                )}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-1 small">
                                        <span>Sector:</span>
                                        <span>{project.sectorName}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mt-1 small">
                                        <span>Value:</span>
                                        <span><IndianRupee size={14}/>{project.estimatedValue}</span>
                                    </div>

                                    <div className="progress mt-3" style={{ height: "10px" }}>
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${calculateProgress(
                                                    project.startDate,
                                                    project.endDate
                                                )}%`,
                                            }}
                                        ></div>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="small text-muted">
                                            {remainingDaysCalc(project.endDate)} days remaining
                                        </span>
                                        <Link to={`project/${project.projectId}`} className="text-decoration-none small">
                                            <Action /><span className='ms-1' style={{ color: '#005197' }}>View details</span>
                                        </Link>

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
