import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, X, Info, BadgeDollarSign, IndianRupee, Copy, ClipboardPasteIcon, EditIcon, Trash2 } from "lucide-react";
import ActivityCode from '../assest/ActivityCode.svg?react';
import ActivityView from "../assest/Activity.svg?react";
import Area from '../assest/Area.svg?react';
import Cost from '../assest/Cost.svg?react';
import TotalCost from '../assest/TotalCost.svg?react';
import Select from 'react-select';
import { useUom } from "../Context/UomContext";
import { toast } from "react-toastify";

function TenderResource() {
    const { projectId, costCodeId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [costCode, setCostCode] = useState(null);
    const [showResourceAdding, setShowResourceAdding] = useState(false);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [resources, setResources] = useState([]);
    const [quantityType, setQuantityType] = useState([]);
    const [currency, setCurrency] = useState([]);
    const getInitialResourceData = () => ({
        docNumber: `DOC${Date.now()}`,
        coEfficient: 1,
        calculatedQuantity: 0,
        wastePercentage: 0,
        wasteQuantity: 0,
        netQuantity: 0,
        rate: 0,
        additionalRate: 0,
        shippingPrice: 0,
        costUnitRate: 0,
        resourceTotalCost: 0,
        rateLock: false,
        totalCostCompanyCurrency: 0,
        exchangeRate: "",
        resourceTypeId: "",
        quantityTypeId: "",
        resourceNatureId: "",
        uomId: "",
        currencyId: "",
        resourceId: "",
        costCodeActivityId: "",
        projectId: projectId
    });
    const [resourceData, setResourceData] = useState(getInitialResourceData());
    const [coEffdisabled, setCoEffdisabled] = useState(false);
    const [estimatedResources, setEstimatedResources] = useState([]);
    const [selectedResourceIds, setSelectedResourceIds] = useState([]);
    const uomOption = useUom().map(uom => ({
        value: uom.id,
        label: uom.uomName
    }));
    const resourceTypesOption = useMemo(() => resourceTypes?.map((item) => ({
        value: item.id,
        label: item.resourceTypeName
    })), [resourceTypes]);
    const resourceOption = useMemo(() => resources?.map((item) => ({
        value: item.id,
        label: item.resourceCode + "-" + item.resourceName
    })), [resources]);
    const currencyOption = useMemo(() => currency?.map((item) => ({
        value: item.id,
        label: item.currencyName + "(" + item.currencyCode + ")"
    })), [currency]);
    const quantityTypeOption = useMemo(() => quantityType?.map((item) => ({
        value: item.id,
        label: item.quantityType
    })), [quantityType]);
    const resourceNatureOption = useMemo(() => resourceNature?.map((item) => ({
        value: item.id,
        label: item.nature
    })), [resourceNature]);

    const handleUnauthorized = () => {
        navigate('/login');
    };

    const fetchCostCode = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/costCode/${costCodeId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setCostCode(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                toast.error(err?.response?.data?.message || 'Failed to fetch cost code.');
            }
        });
    }, [costCodeId]);

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
                fetchEstimatedResources();
            }
        }).catch(err => {
            if (err.response?.status === 401) {
                handleUnauthorized();
            } else {
                console.error(err);
                alert('Failed to fetch project information.');
            }
        });
    }, [projectId, fetchCostCode]);

    const addResources = () => {
        setResourceData(getInitialResourceData());
        fetchResourceTypes();
        fetchQuantityType();
        fetchCurrency();
        fetchResourceNature();
        setShowResourceAdding(true);
    };

    const fetchQuantityType = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setQuantityType(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                console.error(err);
                alert('Failed to fetch quantity types.');
            }
        });
    }, []);

    const fetchCurrency = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setCurrency(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                console.error(err);
                alert('Failed to fetch currencies.');
            }
        });
    }, []);

    const fetchResourceNature = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setResourceNature(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                console.error(err);
                alert('Failed to fetch resource natures.');
            }
        });
    }, []);

    const fetchResourceTypes = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setResourceTypes(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                console.error(err);
                alert('Failed to fetch resource types.');
            }
        });
    }, []);

    const handleResourceTypeChange = (resTypeId) => {
        setResourceData({ ...resourceData, resourceTypeId: resTypeId });
        if (resTypeId) {
            fetchResources(resTypeId);
        } else {
            setResources([]);
            setResourceData(prev => ({ ...prev, resourceId: '', rate: 0, uomId: '', quantityTypeId: '', exchangeRate: 1 }));
        }
    };

    const fetchResources = useCallback((resTypeId) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setResources(res.data);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                console.error(err);
                alert('Failed to fetch resources.');
            }
        });
    }, []);

    const fetchResource = (resourceId) => {
        const resource = resources.find(item => item.id === resourceId);
        if (!resource) {
            setResourceData(prev => ({ ...prev, resourceId: '', rate: 0, uomId: '', quantityTypeId: '' }));
            return;
        }
        const newResourceData = {
            ...resourceData,
            resourceId: resourceId,
            rate: resource.unitRate || 0,
            uomId: resource.uom?.id || '',
            quantityTypeId: resource.quantityType?.id || ''
        };
        setResourceData(newResourceData);
        handleCalculations(newResourceData);
    };

    const handleQuantityTypeChange = (quantityTypeId) => {
        const quantityTypeItem = quantityType.find(item => item.id === quantityTypeId);
        const isCoefficient = quantityTypeItem?.quantityType.toLowerCase() === 'coefficient';
        const newCoEfficient = isCoefficient ? resourceData.coEfficient : 1;
        setCoEffdisabled(!isCoefficient);
        const newResourceData = {
            ...resourceData,
            quantityTypeId: quantityTypeId,
            coEfficient: newCoEfficient
        };
        setResourceData(newResourceData);
        handleCalculations(newResourceData);
    };

    const handleCalculations = (updatedData) => {
        const data = { ...resourceData, ...updatedData };
        const coEfficient = parseFloat(data.coEfficient) || 1;
        const wastePercentage = parseFloat(data.wastePercentage) || 0;
        const rate = parseFloat(data.rate) || 0;
        const additionalRate = parseFloat(data.additionalRate) || 0;
        const shippingPrice = parseFloat(data.shippingPrice) || 0;
        const exchangeRate = parseFloat(data.exchangeRate) || 1;

        const calculatedQuantity = (costCode?.quantity || 0) * coEfficient;
        const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
        const netQuantity = calculatedQuantity + wasteQuantity;
        const unitRate = netQuantity > 0 ? rate + additionalRate + (shippingPrice / netQuantity) : 0;
        const totalCostCompanyCurrency = unitRate * netQuantity;
        const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;

        setResourceData(prev => ({
            ...prev,
            ...data,
            calculatedQuantity,
            wasteQuantity,
            netQuantity,
            costUnitRate: unitRate,
            resourceTotalCost: resourceTotalCost,
            totalCostCompanyCurrency: totalCostCompanyCurrency
        }));
    };

    const handleAddResource = () => {
        if (!resourceData.resourceId || !resourceData.uomId || !resourceData.quantityTypeId || !resourceData.currencyId) {
            alert('Please fill in all required fields.');
            return;
        }
        const dataToSend = {
            ...resourceData,
            costCodeActivityId: [costCode?.id]
        };
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`, dataToSend, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200 || res.status === 201) {
                toast.success(res?.data);
                setShowResourceAdding(false);
                setResourceData(getInitialResourceData());
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else {
                toast.error(err?.response?.data?.message || 'Failed to add resource.');
            }
        });
    };
    const fetchEstimatedResources = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResources/${costCodeId}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if (res.status === 200) {
                setEstimatedResources(res.data);
                setSelectedResourceIds([]);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
            else {
                toast.error(err?.response?.data?.message);
            }
        });

    }
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
            setSelectedResourceIds(estimatedResources.map(resource => resource.id)); 
        }
    };

    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">Activity Details</span>
                </div>
                <div className="me-3">
                    <button className="btn import-button" onClick={addResources}><Plus size={20} /><span className="ms-2">Add Resource</span></button>
                </div>
            </div>
            <div className="bg-white rounded-3 ms-3 me-3 p-4" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold ms-3 mb-2">{`${project?.projectName || 'Loading...'} - (${project?.projectCode || ''})`}</div>
                <div className="row g-2 mb-4 ms-3">
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Activity Code</span>
                                <ActivityCode />
                            </div>
                            <div className="fw-bold text-start mt-2">{costCode?.activityCode || 'N/A'}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Activity Name</span>
                                <ActivityView size={16} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />
                            </div>
                            <div className="fw-bold text-start mt-2">{costCode?.activityName || 'N/A'}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Unit of Measurement</span>
                                <Area />
                            </div>
                            <div className="fw-bold text-start mt-2">{costCode?.uom?.uomName || 'N/A'}</div>
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
                            <div className="fw-bold text-start mt-2">{costCode?.quantity?.toFixed(3) || '0.000'}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Rate</span>
                                <Cost />
                            </div>
                            <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {costCode?.rate?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-4">
                        <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                            <div className="d-flex justify-content-between">
                                <span className="text-muted">Amount</span>
                                <BadgeDollarSign color="#005197" />
                            </div>
                            <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {costCode?.amount?.toFixed(2) || '0.00'}</div>
                        </div>
                    </div>
                </div>
            </div>
            {estimatedResources?.length > 0 && (
                <div className="bg-white rounded-3 ms-3 me-3 p-4 mt-4" style={{ border: '1px solid #0051973D' }}>
                    <div className="text-start d-flex justify-content-between align-items-center pb-3" style={{borderBottom: '1px solid #0051973D'}}>
                        <h6>Resource Details</h6>
                        <div className="d-flex align-items-center">
                            <button className="btn action-button me-2"><Copy size={20} /><span className="ms-2">Copy</span></button>
                            <button className="btn action-button me-2"><ClipboardPasteIcon size={20} /><span className="ms-2">Paste</span></button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <table className="table activity-table">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            style={{ borderColor: '#005197' }}
                                            checked={selectedResourceIds.length === estimatedResources.length && estimatedResources.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th>Resource Type</th>
                                    <th>Resource Name</th>
                                    <th>UOM</th>
                                    <th>Quantity</th>
                                    <th>Rate</th>
                                    <th><IndianRupee size={16} /><span>Total Cost</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimatedResources?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                style={{ borderColor: '#005197' }}
                                                checked={selectedResourceIds.includes(item.id)}
                                                onChange={() => handleCheckboxChange(item.id)}
                                            />
                                        </td>
                                        <td>{item.resourceType.resourceTypeName}</td>
                                        <td>{item.resource.resourceName}</td>
                                        <td>{item.uom.uomCode}</td>
                                        <td>{item.netQuantity}</td>
                                        <td>{(item.costUnitRate).toFixed(2)}</td>
                                        <td>{(item.totalCostCompanyCurrency).toFixed(2)}</td>
                                        <td>
                                            <EditIcon size={20} color="#005197" className="me-2" style={{cursor: 'pointer'}}/>
                                            <Trash2 size={20} color="red" className="me-2" style={{cursor: 'pointer'}}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
            {showResourceAdding && (
                <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between text-white" style={{ background: 'linear-gradient(to right, #0056b3, #007bff)' }}>
                                <h6 className="modal-title"> <Plus /><span className="ms-2">Add Resource details - {resourceData.docNumber}</span></h6>
                                <button
                                    type="button"
                                    className="btn text-white"
                                    onClick={() => {
                                        setShowResourceAdding(false);
                                        setResourceData(getInitialResourceData());
                                    }}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="modal-body text-start">
                                <div className="modal-resource p-2 rounded-3 mb-3">
                                    <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                                        <Info size={20} />
                                        <span className="ms-2">Basic Information</span>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Resource type
                                            </label>
                                            <Select
                                                options={resourceTypesOption}
                                                placeholder="Select Resource Type"
                                                className="w-100"
                                                classNamePrefix="resource-select"
                                                isClearable
                                                value={resourceTypesOption.find((option) => option.value === resourceData.resourceTypeId)}
                                                onChange={(option) => handleResourceTypeChange(option ? option.value : '')}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Nature
                                            </label>
                                            <Select
                                                options={resourceNatureOption}
                                                placeholder="Select Nature"
                                                className="w-100"
                                                classNamePrefix="resource-select"
                                                isClearable
                                                value={resourceNatureOption.find((option) => option.value === resourceData.resourceNatureId)}
                                                onChange={(option) => setResourceData({ ...resourceData, resourceNatureId: option ? option.value : '' })}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Resource Name
                                            </label>
                                            <Select
                                                options={resourceOption}
                                                placeholder="Select Resource Name"
                                                className="w-100"
                                                classNamePrefix="resource-select"
                                                isClearable
                                                value={resourceOption.find((option) => option.value === resourceData.resourceId)}
                                                onChange={(option) => fetchResource(option ? option.value : '')}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-resource p-2 rounded-3 mb-3">
                                    <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                                        <Area size={20} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />
                                        <span className="ms-2">Quantity & Measurement</span>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                UOM
                                            </label>
                                            <Select
                                                options={uomOption}
                                                placeholder="Select UOM"
                                                className="w-100"
                                                classNamePrefix="resource-select"
                                                isClearable
                                                value={uomOption.find((option) => option.value === resourceData.uomId)}
                                                onChange={(option) => setResourceData({ ...resourceData, uomId: option ? option.value : '' })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Quantity Type
                                            </label>
                                            <Select
                                                options={quantityTypeOption}
                                                placeholder="Select Quantity Type"
                                                className="w-100"
                                                classNamePrefix="resource-select"
                                                isClearable
                                                value={quantityTypeOption.find((option) => option.value === resourceData.quantityTypeId)}
                                                onChange={(option) => handleQuantityTypeChange(option ? option.value : '')}
                                            />
                                        </div>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Co-Efficient
                                            </label>
                                            <input
                                                type="number"
                                                className="resource-input w-100"
                                                placeholder="Enter Co-Efficient"
                                                value={resourceData.coEfficient}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    const newResourceData = { ...resourceData, coEfficient: newValue };
                                                    setResourceData(newResourceData);
                                                    handleCalculations(newResourceData);
                                                }}
                                                disabled={coEffdisabled}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Calculated Quantity
                                            </label>
                                            <input
                                                type="text"
                                                className="resource-input w-100"
                                                placeholder="Calculated Quantity"
                                                value={resourceData.calculatedQuantity.toFixed(3)}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-resource p-2 rounded-3 mb-3">
                                    <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                                        <Info size={20} />
                                        <span className="ms-2">Wastage & Net Quantity</span>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Wastage %
                                            </label>
                                            <input
                                                type="number"
                                                className="resource-input w-100"
                                                placeholder="Enter Wastage %"
                                                value={resourceData.wastePercentage}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    const newResourceData = { ...resourceData, wastePercentage: newValue };
                                                    setResourceData(newResourceData);
                                                    handleCalculations(newResourceData);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Wastage Quantity
                                            </label>
                                            <input
                                                type="text"
                                                className="resource-input w-100"
                                                placeholder="Wastage Quantity"
                                                value={resourceData.wasteQuantity.toFixed(3)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Net Quantity
                                            </label>
                                            <input
                                                type="text"
                                                className="resource-input w-100"
                                                placeholder="Net Quantity"
                                                value={resourceData.netQuantity.toFixed(3)}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-resource p-2 rounded-3 mb-3">
                                    <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                                        <Info size={20} />
                                        <span className="ms-2">Pricing & Currency</span>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Rate
                                            </label>
                                            <input
                                                type="number"
                                                className="resource-input w-100"
                                                placeholder="Enter Rate"
                                                value={resourceData.rate}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    const newResourceData = { ...resourceData, rate: newValue };
                                                    setResourceData(newResourceData);
                                                    handleCalculations(newResourceData);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Additional Rate
                                            </label>
                                            <input
                                                type="number"
                                                className="resource-input w-100"
                                                placeholder="Enter Additional rate"
                                                value={resourceData.additionalRate}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    const newResourceData = { ...resourceData, additionalRate: newValue };
                                                    setResourceData(newResourceData);
                                                    handleCalculations(newResourceData);
                                                }}
                                            />
                                        </div>
                                        <div className="col-lg-4 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Shipping /Fright Price(+/-)
                                            </label>
                                            <input
                                                type="number"
                                                className="resource-input w-100"
                                                placeholder="Enter Shipping price"
                                                value={resourceData.shippingPrice}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    const newResourceData = { ...resourceData, shippingPrice: newValue };
                                                    setResourceData(newResourceData);
                                                    handleCalculations(newResourceData);
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Currency
                                            </label>
                                            <Select
                                                options={currencyOption}
                                                placeholder="Select Currency"
                                                className="w-100"
                                                classNamePrefix="resource-select"
                                                isClearable
                                                value={currencyOption.find((option) => option.value === resourceData.currencyId)}
                                                onChange={(option) => setResourceData({ ...resourceData, currencyId: option ? option.value : '' })}
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Exchange Rate
                                            </label>
                                            <input
                                                type="number"
                                                className="resource-input w-100"
                                                placeholder="Enter Exchange Rate"
                                                value={resourceData.exchangeRate}
                                                onChange={(e) => {
                                                    const newValue = parseFloat(e.target.value);
                                                    const newResourceData = { ...resourceData, exchangeRate: newValue };
                                                    setResourceData(newResourceData);
                                                    handleCalculations(newResourceData);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-resource p-2 rounded-3 mb-3">
                                    <div className="ms-2 fw-medium" style={{ color: '#005197' }}>
                                        <Info size={20} />
                                        <span className="ms-2">Cost Summary</span>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Cost Unit Rate
                                            </label>
                                            <input
                                                type="text"
                                                className="resource-input w-100"
                                                placeholder="Enter Cost unit rate"
                                                value={resourceData.costUnitRate.toFixed(2)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Resource Total Cost
                                            </label>
                                            <input
                                                type="text"
                                                className="resource-input w-100"
                                                placeholder="Resource Total cost"
                                                value={resourceData.resourceTotalCost.toFixed(2)}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="row align-items-center p-2 mb-2">
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <label className="resource-label text-start d-block">
                                                Resource Total Cost (Company Currency)
                                            </label>
                                            <input
                                                type="text"
                                                className="resource-input w-100"
                                                placeholder="Resource Total Cost (Company Currency)"
                                                value={resourceData.totalCostCompanyCurrency.toFixed(2)}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 mt-2">
                                            <div className="d-flex ms-3 align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    checked={resourceData.rateLock}
                                                    onChange={(e) => setResourceData({ ...resourceData, rateLock: e.target.checked })}
                                                />
                                                <label className="resource-label text-start d-block ms-2">
                                                    Rate Lock
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end mt-3">
                                    <button className="btn action-button" onClick={handleAddResource}>
                                        <Plus />
                                        <span className="ms-2">Add Resource</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default TenderResource;