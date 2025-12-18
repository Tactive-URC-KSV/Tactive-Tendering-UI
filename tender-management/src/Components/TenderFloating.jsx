import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectSelection from './ProjectInfo';
import TFProcess from "./TFProcess.jsx";
import axios from "axios";

function TenderFloating(){
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
                }
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    return(
        <div className="container-fluid p-4 mt-3">
            {!projectId && (
                <>
                    <div className="text-start fw-bold ms-1 mt-1 mb-3">Tender Floating</div>
                    <ProjectSelection 
                        projects={projects} 
                        continueRoute="/tenderfloating" 
                    />
                </>
            )}
            {projectId && <TFProcess projectId={projectId}/>}
        </div>
    )
}
export default TenderFloating;