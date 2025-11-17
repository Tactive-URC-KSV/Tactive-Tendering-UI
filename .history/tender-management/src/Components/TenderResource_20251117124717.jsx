import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Copy, EditIcon, Trash2, IndianRupee, BadgeDollarSign, ClipboardPaste, Table, Grid } from "lucide-react"; // ADDED Table and Grid
import ActivityCode from '../assest/ActivityCode.svg?react';
import ActivityView from "../assest/Activity.svg?react";
import Area from '../assest/Area.svg?react';
import Cost from '../assest/Cost.svg?react';
import TotalCost from '../assest/TotalCost.svg?react';
import { toast } from "react-toastify";


function TenderResource() {
    const { projectId, boqId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    // NOTE: estimatedResources array should match the structure used in the Table/Grid views
    const [estimatedResources, setEstimatedResources] = useState([]);
    const [selectedResourceIds, setSelectedResourceIds] = useState([]);
    const [boq, setBoq] = useState();
    const [boqName, setBoqName] = useState();
    
    // ADDED STATE FOR VIEW MANAGEMENT
    const [viewType, setViewType] = useState('table'); 

    useEffect(() => {
        if (projectId) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                if (res.status === 200) {
                    setProject(res.data);
                    fetchBoqDetails();
                    fetchEstimatedResources(); // Ensure resources are fetched here
                }
            }).catch(err => {
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    console.error(err);
                    toast.error('Failed to fetch project information.');
                }
            });
        }
    }, [projectId]);

    const fetchBoqDetails = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/BOQ/${boqId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setBoq(res.data);
                const boqName = res?.data?.boqName;
                setBoqName(boqName && boqName?.length > 20
                    ? boqName.substring(0, 20) + '...'
                    : boqName);
            }
        }).catch(err => {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                console.error(err);
                toast.error('Failed to fetch BOQ information.');
            }
        });
    }

    // ADDED Mock implementation for fetchEstimatedResources to match screenshot structure
    const fetchEstimatedResources = () => {
        // Replace this mock data with your actual API call to get resources for the BOQ ID
        const mockResources = [
            {
                tenderEstimation: { id: 1, resourceType: { resourceTypeName: "Material" }, resource: { resourceName: "Cement" }, uom: { uomCode: "CUM" }, coefficient: 0.4 },
                costDetails: { netQuantity: 1568.990, costUnitRate: 530.46, totalCostCompanyCurrency: 8329068.68 }
            },
            {
                tenderEstimation: { id: 2, resourceType: { resourceTypeName: "Material" }, resource: { resourceName: "Sand" }, uom: { uomCode: "CUM" }, coefficient: 0.8 },
                costDetails: { netQuantity: 3137.985, costUnitRate: 564.13, totalCostCompanyCurrency: 1770237126.32 }
            },
            {
                tenderEstimation: { id: 3, resourceType: { resourceTypeName: "Material" }, resource: { resourceName: "Steel Reinforcement" }, uom: { uomCode: "CUM" }, coefficient: 0.3 },
                costDetails: { netQuantity: 1176.748, costUnitRate: 3888.78, totalCostCompanyCurrency: 4576114.09 }
            },
            // Add more mock resources if needed
        ];
        setEstimatedResources(mockResources);

        // Actual implementation would look something like this:
        /*
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/resourcesByBoq/${boqId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.status === 200) {
                setEstimatedResources(res.data);
                setSelectedResourceIds([]);
            }
        }).catch(err => {
             // ... error handling
        });
        */
    };


    const handleCheckboxChange = (resourceId) => {
        setSelectedResourceIds(prev =>
            prev.includes(resourceId)
                ? prev.filter(id => id !== resourceId)
                : [...prev, resourceId]
        );
    };

    const handleSelectAll = () => {
        if (selectedResourceIds.length === estimatedResources.length) {
            setSelectedResourceIds([]);
        } else {
            setSelectedResourceIds(estimatedResources.map(resource => resource.tenderEstimation.id));
        }
    };
    const handleAddResource = () => {
        navigate(`/add-resource/${projectId}/${boqId}`);
    };


    const handleCopyResources = () => {
        const selectedResources = estimatedResources.filter(resource =>
            selectedResourceIds.includes(resource.tenderEstimation.id)
        );

        if (selectedResources.length === 0) {
            toast.warn('No resources selected to copy.');
            return;
        }

        try {
            const resourceIds = selectedResources.map(resource => resource.tenderEstimation.id);
            localStorage.setItem('resource', JSON.stringify(resourceIds));
            toast.success('Resource IDs copied successfully');
        } catch (err) {
            toast.error('Failed to copy resource IDs.');
        }
    };
    const handlePasteResources = () => {
        const resourceIds = JSON.parse(localStorage.getItem('resource'));
        if (!resourceIds || resourceIds.length === 0) {
            toast.warn('No resources found in clipboard to paste.');
            return;
        }
        
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/pasteResourceToCostCode`, resourceIds, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                toast.success(res.data);
                setSelectedResourceIds([]);
                fetchEstimatedResources();
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/login');
            } else {
                toast.error(err.response.data.message);
            }
        })
    }
    const handleDeleteResource = (resourceId) => {
        axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/delete/costCode/${resourceId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status === 200 || res.status === 201) {
                toast.success(res.data);
                fetchEstimatedResources();
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                navigate('/login');
            } else {
                toast.error(err.response.data.message);
            }
        })
    }
    
    // ADDED HELPER COMPONENTS FOR VIEWS
    const handleViewDetails = (resource) => {
        // Implement navigation or modal for viewing details
        toast.info(`Viewing details for ${resource.tenderEstimation.resource.resourceName}`);
    };

    const handleEditResourceModal = (resource) => {
        // Implement navigation or modal for editing details
        toast.info(`Editing details for ${resource.tenderEstimation.resource.resourceName}`);
    };


    const TableView = () => (
        <div className="mt-4">
            <table className="table activity-table">
                <thead>
                    <tr>
                        <th style={{ width: '3%' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                style={{ borderColor: '#005197' }}
                                checked={selectedResourceIds.length === estimatedResources.length && estimatedResources.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th style={{ width: '5%' }}>S.No</th>
                        <th style={{ width: '15%' }}>Resource Name</th>
                        <th style={{ width: '15%' }}>Resource Type</th>
                        <th style={{ width: '10%' }}>Coefficient</th>
                        <th style={{ width: '15%' }}>Quantity</th>
                        <th style={{ width: '10%' }}>Rate</th>
                        <th style={{ width: '15%' }}><IndianRupee size={16} /><span>Total Cost</span></th>
                        <th style={{ width: '12%' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {estimatedResources?.map((item, index) => (
                        <tr key={item.tenderEstimation.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    style={{ borderColor: '#005197' }}
                                    checked={selectedResourceIds.includes(item.tenderEstimation.id)}
                                    onChange={() => handleCheckboxChange(item.tenderEstimation.id)}
                                />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item.tenderEstimation.resource.resourceName}</td>
                            <td>{item.tenderEstimation.resourceType.resourceTypeName}</td>
                            <td>{(item.tenderEstimation.coefficient)?.toFixed(1)}</td>
                            <td>{(item.costDetails.netQuantity)?.toFixed(3)}</td>
                            <td>{(item.costDetails.costUnitRate)?.toFixed(2)}</td>
                            <td>{(item.costDetails.totalCostCompanyCurrency)?.toFixed(2)}</td>
                            <td>
                                <button
                                    className="btn btn-info btn-sm text-white me-2"
                                    onClick={() => handleViewDetails(item)}
                                >
                                    View Details
                                </button>
                                <EditIcon size={20} color="#005197" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleEditResourceModal(item)} />
                                <Trash2 size={20} color="red" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleDeleteResource(item.tenderEstimation.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const GridView = () => (
        <div className="row g-4 mt-4">
            {estimatedResources?.map((item, index) => (
                <div className="col-lg-4 col-md-6" key={item.tenderEstimation.id}>
                    <div className="card h-100 shadow-sm" style={{ borderLeft: '5px solid #005197' }}>
                        <div className="card-body">
                             <div className="d-flex justify-content-between align-items-start mb-2">
                                <h5 className="card-title fw-bold text-primary">{item.tenderEstimation.resource.resourceName}</h5>
                                <input
                                    type="checkbox"
                                    className="form-check-input mt-1"
                                    style={{ borderColor: '#005197' }}
                                    checked={selectedResourceIds.includes(item.tenderEstimation.id)}
                                    onChange={() => handleCheckboxChange(item.tenderEstimation.id)}
                                />
                            </div>
                            <h6 className="card-subtitle mb-2 text-muted">{item.tenderEstimation.resourceType.resourceTypeName}</h6>
                            <hr/>
                            <div className="row g-2">
                                <div className="col-6">
                                    <div className="text-muted small">Coefficient</div>
                                    <div className="fw-bold">{(item.tenderEstimation.coefficient)?.toFixed(1)}</div>
                                </div>
                                <div className="col-6">
                                    <div className="text-muted small">Quantity</div>
                                    <div className="fw-bold">{(item.costDetails.netQuantity)?.toFixed(3)} {item.tenderEstimation.uom.uomCode}</div>
                                </div>
                                <div className="col-6">
                                    <div className="text-muted small">Rate</div>
                                    <div className="fw-bold"><IndianRupee size={12} /> {(item.costDetails.costUnitRate)?.toFixed(2)}</div>
                                </div>
                                <div className="col-6">
                                    <div className="text-muted small">Total Cost</div>
                                    <div className="fw-bold"><IndianRupee size={12} /> {(item.costDetails.totalCostCompanyCurrency)?.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-light d-flex justify-content-between align-items-center">
                            <button 
                                className="btn btn-info btn-sm text-white" 
                                onClick={() => handleViewDetails(item)}
                            >
                                View Details
                            </button>
                            <div>
                                <EditIcon size={20} color="#005197" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleEditResourceModal(item)} />
                                <Trash2 size={20} color="red" style={{ cursor: 'pointer' }} onClick={() => handleDeleteResource(item.tenderEstimation.id)} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
    // END OF ADDED HELPER COMPONENTS FOR VIEWS
    
    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">BOQ Details</span>
                </div>
            </div>
            <div className="bg-white rounded-3 ms-3 me-3 p-4" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold ms-3 mb-2">
                    {project?.projectName}
                </div>
                <div className="row g-2 mb-4 ms-3">
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">BOQ Code</span>
                                <ActivityCode />
                            </div>
                            <div className="fw-bold text-start mt-2">{boq?.boqCode}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">BOQ Name</span>
                                <ActivityView size={16} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />
                            </div>
                            <div className="fw-bold text-start mt-2" title={boq?.boqName}>{boqName}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Unit of Measurement</span>
                                <Area />
                            </div>
                            <div className="fw-bold text-start mt-2">{boq?.uom?.uomCode}</div>
                        </div>
                    </div>
                </div>
                <div className="row g-2 ms-3">
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Quantity</span>
                                <TotalCost />
                            </div>
                            <div className="fw-bold text-start mt-2">{boq?.quantity?.toFixed(3) || '0.000'}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Rate</span>
                                <Cost />
                            </div>
                            <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {boq?.totalRate?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Amount</span>
                                <BadgeDollarSign color="#005197" />
                            </div>
                            <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {boq?.totalAmount?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODIFIED: Resource Details Header with View Switch Buttons */}
            <div className="text-start d-flex justify-content-between align-items-center pb-3 mt-5" style={{ borderBottom: '5px solid #0051973D' }}>
                <h6>Resource Working Details</h6> {/* Updated text to match screenshot */}
                <div className="d-flex align-items-center">
                    {/* ADDED View Switch Buttons */}
                    <button 
                        className={`btn action-button me-2 ${viewType === 'table' ? 'btn-outline-primary' : 'btn-light'}`}
                        onClick={() => setViewType('table')}
                        title="Table View"
                    >
                        <Table size={20} color={viewType === 'table' ? '#005197' : 'gray'} />
                    </button>
                    <button 
                        className={`btn action-button me-2 ${viewType === 'grid' ? 'btn-outline-primary' : 'btn-light'}`}
                        onClick={() => setViewType('grid')}
                        title="Grid View"
                    >
                        <Grid size={20} color={viewType === 'grid' ? '#005197' : 'gray'} />
                    </button>

                    <button className="btn btn-success d-flex align-items-center me-2 " onClick={handleAddResource}><Plus size={20} className="me-2" />Add Resource</button>
                    <button className="btn action-button me-2" onClick={handleCopyResources}><Copy size={20} /><span className="ms-2">Copy</span></button>
                    <button className="btn action-button me-2" onClick={handlePasteResources}><ClipboardPaste size={20} /><span className="ms-2">Paste</span></button>
                </div>
            </div>

            {/* MODIFIED: Conditional Content Rendering based on View Type */}
            {estimatedResources?.length > 0 ? (
                viewType === 'table' ? <TableView /> : <GridView />
            ) : (<div className='mt-4'>No Content Available</div>)}
            
            {/* REMOVED OLD TABLE LOGIC BLOCK HERE (replaced by conditional rendering above) */}
            
        </div>
    );
}

export default TenderResource;