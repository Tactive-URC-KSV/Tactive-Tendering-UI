import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus } from "lucide-react";
import ActivityCode from '../assest/ActivityCode.svg?react';
import ActivityView from "../assest/Activity.svg?react";
import Area from '../assest/Area.svg?react';
import Cost from '../assest/Cost.svg?react';
import TotalCost from '../assest/TotalCost.svg?react';

const handleUnauthorized = () => {
    const navigate = useNavigate();
    navigate('/login');
}
function TenderResource() {
    const { projectId, costCodeId } = useParams();
    const [project, setProject] = useState();
    const [costCode, setCostCode] = useState();
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setProject(res.data);
                fetchCostCode();
            }
        }).catch(err => {
            if (err.response.status === 401) {
                handleUnauthorized();
            }
        });
    }, [projectId]);
    const fetchCostCode = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/costCode/${costCodeId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status) {
                setCostCode(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
        })
    }
    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">Activity Details</span>
                </div>
                <div className="me-3">
                    <button className="btn import-button"><Plus size={20} /><span className="ms-2">Add Resource</span></button>
                </div>
            </div>
            <div className="bg-white rounded-3 ms-3 me-3 p-4" style={{border: '1px solid #0051973D'}}>
                <div className="text-start fw-bold ms-3 mb-2">{`${project?.projectName} - (${project?.projectCode})`}</div>
                <div className="row g-2 mb-4 ms-3">
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height:'100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Activity Code</span>
                                <ActivityCode />
                            </div>
                            <div className="fw-bold text-start mt-2">{costCode?.activityCode}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height:'100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Activity Name</span>
                                <ActivityView size={16} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }}/>
                            </div>
                            <div className="fw-bold text-start mt-2">{costCode?.activityName}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height:'100%' }}>
                           <div className="d-flex justify-content-between">
                                <span className="text-muted">Unit of Measurement</span>
                                <Area />
                            </div>
                            <div className="fw-bold text-start mt-2">{costCode?.uom?.uomName}</div>
                        </div>
                    </div>
                </div>
                <div className="row g-2 ms-3">
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height:'100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Quantity</span>
                                <TotalCost />
                            </div>
                             <div className="fw-bold text-start mt-2">{costCode?.quantity?.toFixed(3)}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height:'100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Rate</span>
                                <Cost />
                            </div>
                             <div className="fw-bold text-start mt-2">$ {costCode?.rate?.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height:'100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Amount</span>
                                <ActivityCode />
                            </div>
                            <div className="fw-bold text-start mt-2">$ {costCode?.amount?.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
export default TenderResource;