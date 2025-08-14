import SelectIcon  from '../assest/Select.?react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import '../CSS/Styles.css';
import axios from 'axios';
import { useProjectStatus } from '../Context/ProjectStatusContext';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function BOQProjectInfo() {
    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState('');
    const projectStatus = useProjectStatus();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/approved/projects`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status === 200) {
                    setProjects(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    function uploadFunction(){
        navigate(`/BOQdefinition/${projectId}`)
    }
    return (
        <>
        
        <div className="ms-2 mt-3 rounded-3 bg-white" style={{ border: '0.5px solid #0051973D' }}>
            <div className="tab-info col-12 h-100">
                <SelectIcon />
                <span className='ms-2'> Select Project</span>
            </div>
            <div className='mt-3 mb-3 row d-flex justify-content-between ms-2 me-2'>
                <div className='col-lg-8 col-md-8 col-sm-6'>
                    <label className="text-start d-block me-1 fs-6">Search</label>
                    <input type="text" className="form-input w-100" placeholder="Search by Project Name" />
                </div>
                <div className="col-lg-4 col-md-4 col-sm-6">
                    <label className="text-start d-block me-1 fs-7">Company</label>
                    <Select placeholder="Filter by Company Name" className="w-100" classNamePrefix="select" isClearable />
                </div>
            </div>

            <div className='row ms-2 me-2 mb-3'>
                {projects.map((prj, index) => (
                    <div className='col-lg-4 col-md-6 col-sm-12 p-2 mt-1' key={index}>
                        <div className={`${projectId === prj.projectId ? 'selected-card ' : ''}card h-100 shadow-sm`} style={{ border: '0.5px solid #0051973D' }} onClick={() => {setProjectId(prj.projectId)}} draggable = {true}>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between text-start'>
                                    <span className='mb-3 fw-bold' style={{color : '#005197'}}>{prj.projectName}</span>
                                    {projectStatus.map((state) =>
                                        state.status === prj.status && (
                                            <span key={state.status} className="badge rounded-pill mb-3"
                                                style={{
                                                    backgroundColor: state.bgColor,
                                                    color: state.textColor,
                                                    fontSize: '12px'
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
                <button className='btn action-button me-2 mt-2 fs-6' onClick={uploadFunction}><span className='me-2'>Continue to upload</span><ArrowRight size={18}/></button>
            </div>
        </>
    );
}

export default BOQProjectInfo;
