import { useParams } from 'react-router-dom';
import '../CSS/Styles.css';
import ProjectSelection from './BOQProjectInfo';
import { useEffect, useState } from 'react';
import axios from 'axios';
import CCMOverview from './CCMOverview';

function CostCodeMapping() {
    const projectId = useParams().projectId;
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBoqUploadedProject`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        })
            .then(res => {
                if (res.status === 200) {
                    setProjects(res.data);
                    console.log(res.data);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return (
        <div className="container-fluid">
            {!projectId && (
                <>
                    <div className="text-start fw-bold ms-1 mt-1 mb-3">Cost Code Mapping</div>
                    <ProjectSelection 
                        projects={projects} 
                        continueRoute="/CostCodeMapping" 
                    />
                </>
            )}
            {projectId && <CCMOverview projectId={projectId} />}  
                      
    
        </div>
    );
}

export default CostCodeMapping;