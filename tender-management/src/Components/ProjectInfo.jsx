import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import '../CSS/Styles.css';
import { useProjectStatus } from '../Context/ProjectStatusContext';
import SelectIcon from '../assest/Select.svg?react';

function BOQProjectInfo({ projects, continueRoute }) {
    const [projectId, setProjectId] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const projectStatus = useProjectStatus();
    const navigate = useNavigate();

    function handleContinue() {
        if (projectId) {
            navigate(`${continueRoute}/${projectId}`);
        }
    }

    const companyOptions = Array.from(
        new Set(projects.map(prj => prj.companyName))
    ).map(name => ({ label: name, value: name }));

    const filteredProjects = projects.filter(prj => {
        const matchesSearch = prj.projectName.toLowerCase().includes(search.toLowerCase());
        const matchesCompany = selectedCompany ? prj.companyName === selectedCompany.value : true;
        return matchesSearch && matchesCompany;
    });

    return (
        <div className='container-fluid min-vh-100'>
            <div className="mt-3 rounded-3 bg-white mx-4" style={{ border: '0.5px solid #0051973D' }}>
                <div className="tab-info col-12 h-100">
                    <SelectIcon />
                    <span className='ms-2'> Select Project</span>
                </div>
                <div className='mt-3 mb-3 row d-flex justify-content-between ms-2 me-2'>
                    <div className='col-lg-8 col-md-8 col-sm-6'>
                        <label className="text-start d-block me-1 fs-6">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Project Name"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-6">
                        <label className="text-start d-block me-1 fs-7">Company</label>
                        <Select
                            placeholder="Filter by Company Name"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            options={companyOptions}
                            value={selectedCompany}
                            onChange={setSelectedCompany}
                            isDisabled={true}
                        />
                    </div>
                </div>

                <div className='row ms-2 me-2 mb-3'>
                    {filteredProjects.map((prj, index) => (
                        <div className='col-lg-4 col-md-6 col-sm-12 p-2 mt-1' key={index}>
                            <div className={`${projectId === prj.projectId ? 'selected-card ' : ''}card project-card h-100 shadow-sm`}
                                style={{ border: '0.5px solid #0051973D',cursor: 'pointer' }}
                                onClick={() => { setProjectId(prj.projectId) }}
                                onDoubleClick={() => { setProjectId(prj.projectId); handleContinue() }}>
                                <div className='card-body'>
                                    <div className="d-flex justify-content-between align-items-start text-start">
                                        <span
                                            className="mb-3 fw-bold text-wrap flex-grow-1"
                                            style={{ color: "#005197", wordBreak: "break-word" }}
                                        >
                                            {prj.projectName}
                                        </span>

                                        {projectStatus.map(
                                            (state) =>
                                                state.status === prj.status && (
                                                    <span
                                                        key={state.status}
                                                        className="badge rounded-pill mb-3 ms-2 flex-shrink-0"
                                                        style={{
                                                            backgroundColor: state.bgColor,
                                                            color: state.textColor,
                                                            fontSize: "12px",
                                                            whiteSpace: "nowrap"
                                                        }}
                                                    >
                                                        {state.status}
                                                    </span>
                                                )
                                        )}
                                    </div>
                                    <div className='d-flex justify-content-start'>
                                        <div className='fw-bold text-start'>
                                            <p>Project Code</p>
                                            <span>Created At</span>
                                        </div>
                                        <div className='text-start ms-2'>
                                            <p>:<span className='ms-2'>{prj.projectCode}</span></p>
                                            <span>:<span className='ms-2'>{new Date(prj.createdAt).toLocaleDateString(
                                                "en-US",
                                                { month: "short", day: "2-digit", year: "numeric" }
                                            )}</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='d-flex justify-content-end mt-3'>
                <button className='btn action-button me-2 mt-2 fs-6' onClick={handleContinue}>
                    <span className='me-2'>Continue</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}

export default BOQProjectInfo;