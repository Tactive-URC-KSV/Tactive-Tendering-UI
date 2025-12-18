import { useNavigate, useParams } from 'react-router-dom';
import '../CSS/Styles.css';
import ProjectSelection from './ProjectInfo';
import BOQOverview from './BOQOverview';
import { useEffect, useState } from 'react';
import axios from 'axios';

function BOQDefinition() {
    const projectId = useParams().projectId;
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();
    const handleUnauthorized = () =>{
        navigate('/login');
    }

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
                if(err?.response?.status === 401){
                    handleUnauthorized();
                }
            });
    }, []);

    return (
        <div className="container-fluid mt-3 p-4">
            {!projectId && (
                <>
                    <div className="text-start fw-bold ms-1 mt-1 mb-3">BOQ Definition</div>
                    <ProjectSelection 
                        projects={projects} 
                        continueRoute="/boqdefinition" 
                    />
                </>
            )}
            {projectId && <BOQOverview projectId={projectId} />}
        </div>
    );
}

export default BOQDefinition;