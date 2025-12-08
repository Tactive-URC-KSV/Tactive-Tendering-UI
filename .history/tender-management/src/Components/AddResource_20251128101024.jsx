import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, Info } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUom } from "../Context/UomContext";
import Area from '../assest/Area.svg?react';

function AddResource() {
    const navigate = useNavigate();
    const { boqId, projectId, tenderEstimationId } = useParams();
    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    
    const [boq, setBoq] = useState(null);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [quantityType, setQuantityType] = useState([]);
    const [currency, setCurrency] = useState([]);
    
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedUom, setSelectedUom] = useState(null);
    const [selectedNature, setSelectedNature] = useState(null);
    const [selectedQuantityType, setSelectedQuantityType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    
    const [expandedSections, setExpandedSections] = useState({
        'Wastage & Net Quantity': false,
        'Pricing & Currency': false,
    });

    const [resourceData, setResourceData] = useState({
        id: '',
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
        exchangeRate: 1,
        totalCostCompanyCurrency: 0,
        resourceTypeId: "",
        quantityTypeId: "",
        resourceNatureId: "",
        uomId: "",
        currencyId: "",
        resourceId: "",
        boqId: boqId,
        projectId: projectId
    });

    // **FIXED: Fetch BOQ with proper dependency**
    const fetchBOQ = useCallback(() => {
        if (!boqId) return;
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/BOQ/${boqId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setBoq(res.data);
                // **FIX: Update calculatedQuantity when BOQ loads**
                handleCalculations({ calculatedQuantity: res.data.quantity || 0 });
            }
        }).catch(err => {
            if (err.response?.status === 401) {
                navigate('/login');
            } else {
                console.error(err);
                toast.error('Failed to fetch BOQ information.');
            }
        });
    }, [boqId, navigate]);

    // **FIXED: Fetch TenderEstimation with BOQ-specific cost details**
    const fetchTenderEstimationResource = useCallback(() => {
        if (!tenderEstimationId || !boqId) return;
        
        axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/tender/estimatedResource/${tenderEstimationId}?boqId=${boqId}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if (res.status === 200) {
                const tender = res.data.tenderEstimation;
                const cost = res.data.costDetails; // **FIX: Now BOQ-specific**
                
                const resource = tender.resource;

                setResourceData(prev => ({
                    ...prev,
                    id: tender.id,
                    coEfficient: tender.coEfficient ?? 1,
                    calculatedQuantity: cost?.calculatedQuantity ?? 0,
                    wastePercentage: tender.wastePercentage ?? 0,
                    wasteQuantity: cost?.wasteQuantity ?? 0,
                    netQuantity: cost?.netQuantity ?? 0,
                    rate: tender.rate ?? 0,
                    additionalRate: tender.additionalRate ?? 0,
                    shippingPrice: tender.shippingPrice ?? 0,
                    costUnitRate: cost?.costUnitRate ?? 0,
                    resourceTotalCost: cost?.resourceTotalCost ?? 0,
                    exchangeRate: tender.exchangeRate ?? 1,
                    totalCostCompanyCurrency: cost?.totalCostCompanyCurrency ?? 0,
                    rateLock: tender.rateLock ?? false,
                    resourceTypeId: tender.resourceType?.id || "",
                    quantityTypeId: tender.quantityType?.id || "",
                    resourceNatureId: tender.resourceNature?.id || "",
                    uomId: tender.uom?.id || "",
                    currencyId: tender.currency?.id || "",
                    resourceId: resource?.id || ""
                }));

                // Set select values
                setSelectedResourceType(tender.resourceType ? { value: tender.resourceType.id, label: tender.resourceType?.resourceTypeName } : null);
                setSelectedResource(resource ? { value: resource.id, label: `${resource.resourceCode}-${resource.resourceName}` } : null);
                setSelectedUom(tender.uom ? { value: tender.uom.id, label: tender.uom.uomName } : null);
                setSelectedNature(tender.resourceNature ? { value: tender.resourceNature.id, label: tender.resourceNature.nature } : null);
                setSelectedQuantityType(tender.quantityType ? { value: tender.quantityType.id, label: tender.quantityType.quantityType } : null);
                setSelectedCurrency(tender.currency ? { value: tender.currency.id, label: tender.currency.currencyName } : null);

                // **FIX: Fetch resources for this resource type**
                if (tender.resourceType?.id) {
                    fetchResources(tender.resourceType.id);
                }
            }
        }).catch(err => {
            console.error("Error fetching tender resource:", err);
            toast.error("Failed to load resource data");
        });
    }, [tenderEstimationId, boqId]);

    // **FIXED: Updated useEffect dependencies**
    useEffect(() => {
        fetchBOQ();
    }, [fetchBOQ]);

    useEffect(() => {
        if (tenderEstimationId && boqId) {
            fetchTenderEstimationResource();
        }
    }, [fetchTenderEstimationResource]);

    const handleUnauthorized = useCallback(() => {
        toast.error("Session expired or unauthorized. Please log in again.");
        navigate('/login');
    }, [navigate]);

    const uomData = useUom();
    const uomOptions = useMemo(() =>
        (Array.isArray(uomData) ? uomData : []).map(uom => ({ value: uom.id, label: uom.uomName })),
        [uomData]
    );

    // **FIXED: Calculation logic - use actual BOQ quantity**
    const handleCalculations = useCallback((updatedData) => {
        setResourceData((prev) => {
            const data = { ...prev, ...updatedData };
            const coEfficient = parseFloat(data.coEfficient) || 1;
            const wastePercentage = parseFloat(data.wastePercentage) || 0;
            const rate = parseFloat(data.rate) || 0;
            const additionalRate = parseFloat(data.additionalRate) || 0;
            const shippingPrice = parseFloat(data.shippingPrice) || 0;
            const exchangeRate = parseFloat(data.exchangeRate) || 1;
            const boqQuantity = parseFloat(boq?.quantity) || 0;
            
            const calculatedQuantity = boqQuantity * coEfficient;
            const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
            const netQuantity = calculatedQuantity + wasteQuantity;

            const unitRate = netQuantity > 0
                ? rate + additionalRate + (shippingPrice / netQuantity)
                : rate + additionalRate;

            const totalCostCompanyCurrency = unitRate * netQuantity;
            const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;

            return {
                ...data,
                calculatedQuantity,
                wasteQuantity,
                netQuantity,
                costUnitRate: unitRate,
                resourceTotalCost,
                totalCostCompanyCurrency
            };
        });
    }, [boq]);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'number' || name === 'coEfficient' || 
            name.includes('Rate') || name.includes('Price') || name.includes('Percentage')
            ? parseFloat(value) || 0
            : type === 'checkbox'
                ? checked
                : value;
        handleCalculations({ [name]: newValue });
    }, [handleCalculations]);

    // Fetch methods remain the same but with better error handling
    const fetchResourceTypes = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setResourceTypes(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resource types.');
            });
    }, [handleUnauthorized]);

    const fetchResourceNature = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setResourceNature(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resource natures.');
            });
    }, [handleUnauthorized]);

    const fetchResources = useCallback((resTypeId) => {
        if (!resTypeId) return;
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setResources(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resources.');
            });
    }, [handleUnauthorized]);

    const fetchQuantityType = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setQuantityType(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch quantity types.');
            });
    }, [handleUnauthorized]);

    const fetchCurrency = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            })
            .then((res) => { if (res.status === 200) setCurrency(res.data); })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch currencies.');
            });
    }, [handleUnauthorized]);

    // **FIXED: Proper useEffect dependencies**
    useEffect(() => { 
        fetchResourceTypes(); 
        fetchResourceNature(); 
        fetchQuantityType(); 
        fetchCurrency(); 
    }, [fetchResourceTypes, fetchResourceNature, fetchQuantityType, fetchCurrency]);

    useEffect(() => {
        if (boq) {
            handleCalculations({});
        }
    }, [boq, handleCalculations]);

    // Memoized options
    const resourceTypeOptions = useMemo(() => 
        resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), 
        [resourceTypes]
    );
    const resourceOption = useMemo(() => 
        resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })), 
        [resources]
    );
    const resourceNatureOption = useMemo(() => 
        resourceNature.map(item => ({ value: item.id, label: item.nature })), 
        [resourceNature]
    );
    const quantityTypeOption = useMemo(() => 
        quantityType.map(item => ({ value: item.id, label: item.quantityType })), 
        [quantityType]
    );
    const currencyOptions = useMemo(() => 
        currency.map(item => ({ value: item.id, label: item.currencyName })), 
        [currency]
    );

    const handleBack = () => navigate(-1);

    // **FIXED: Updated API endpoint and payload**
    const handleAddResource = useCallback(() => {
        const payload = {
            ...resourceData,
            // Ensure required fields are present
            resourceTypeId: selectedResourceType?.value || resourceData.resourceTypeId,
            resourceId: selectedResource?.value || resourceData.resourceId,
            uomId: selectedUom?.value || resourceData.uomId,
            resourceNatureId: selectedNature?.value || resourceData.resourceNatureId,
            quantityTypeId: selectedQuantityType?.value || resourceData.quantityTypeId,
            currencyId: selectedCurrency?.value || resourceData.currencyId
        };

        const endpoint = tenderEstimationId 
            ? `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources` 
            : `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`;

        axios.post(endpoint, payload, {
            headers: { 
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            toast.success(tenderEstimationId ? "Resource updated successfully" : "Resource added successfully");
            navigate(-1);
        }).catch((err) => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else if (err?.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error(tenderEstimationId ? "Failed to update resource" : "Failed to add resource");
            }
        });
    }, [resourceData, selectedResourceType, selectedResource, selectedUom, selectedNature, selectedQuantityType, selectedCurrency, tenderEstimationId, navigate, handleUnauthorized]);

    const toggleSelection = useCallback((sectionName) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionName]: !prev[sectionName]
        }));
    }, []);

    // **FIX: Resource Type change handler**
    const handleResourceTypeChange = useCallback((selected) => {
        setSelectedResourceType(selected);
        setSelectedResource(null); // Reset resource
        setResources([]); // Clear resources
        handleCalculations({ 
            resourceTypeId: selected?.value || "",
            resourceId: ""
        });
        if (selected?.value) {
            fetchResources(selected.value);
        }
    }, [handleCalculations]);

    // **FIX: Resource change handler**
    const handleResourceChange = useCallback((selectedOption) => {
        setSelectedResource(selectedOption);
        const selectedResObj = resources.find((r) => r.id === selectedOption?.value);
        if (selectedResObj) {
            const matchingUomOption = uomOptions.find((u) => u.value === selectedResObj.uom?.id);
            if (matchingUomOption) setSelectedUom(matchingUomOption);

            handleCalculations({
                resourceId: selectedResObj.id,
                rate: selectedResObj.unitRate || 0,
                uomId: selectedResObj.uom?.id || ""
            });
        } else {
            setSelectedUom(null);
            handleCalculations({ 
                resourceId: "", 
                rate: 0, 
                uomId: "" 
            });
        }
    }, [resources, uomOptions, handleCalculations]);

    // **FIX: Other select change handlers**
    const handleSelectChange = useCallback((field, selected) => {
        const fieldMap = {
            nature: { setter: setSelectedNature, idField: 'resourceNatureId' },
            quantityType: { setter: setSelectedQuantityType, idField: 'quantityTypeId' },
            currency: { setter: setSelectedCurrency, idField: 'currencyId' },
            uom: { setter: setSelectedUom, idField: 'uomId' }
        };
        
        const config = fieldMap[field];
        if (config) {
            config.setter(selected);
            handleCalculations({ [config.idField]: selected?.value || "" });
        }
    }, [handleCalculations]);

    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">
                        {tenderEstimationId ? 'Edit Resource' : 'Add New Resource'}
                    </span>
                </div>
            </div>

            <div
                className="text-white p-3 d-flex justify-content-between align-items-center mx-3 mb-4"
                style={{ background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, borderRadius: '0.5rem' }}
            >
                <div className="d-flex align-items-center">
                    <BookOpenText size={20} className="me-2" />
                    <span>BOQ Summary</span>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                    <span className="me-3" style={{ fontSize: '0.9rem' }}>
                        Unit of Measurement <strong>{boq?.uom?.uomCode || 'N/A'}</strong>
                    </span>
                    <span style={{ fontSize: '0.9rem' }}>
                        Total Quantity <strong>{(boq?.quantity || 0).toFixed(3)}</strong>
                    </span>
                </div>
            </div>

            {/* Rest of the JSX remains the same but with updated handlers */}
            <div className="ms-3 me-3 rounded-3 mb-3 bg-white pb-3">
                <div className="text-start fw-bold p-3 rounded-3" style={{ backgroundColor: '#EFF6FF', color: '#005197' }}>
                    <Info size={20} className="me-1" />
                    Basic Information
                </div>
                <div className="row g-3 ms-3 me-3 mt-2">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                            options={resourceTypeOptions}
                            placeholder="Select Resource Type"
                            className="w-100"
                            classNamePrefix="select"
                            value={selectedResourceType}
                            onChange={handleResourceTypeChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Nature <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                            options={resourceNatureOption}
                            placeholder="Select Nature"
                            className="w-100"
                            classNamePrefix="select"
                            value={selectedNature}
                            onChange={(selected) => handleSelectChange('nature', selected)}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                            options={resourceOption}
                            placeholder="Select resource"
                            className="w-100"
                            classNamePrefix="select"
                            value={selectedResource}
                            onChange={handleResourceChange}
                            isDisabled={!selectedResourceType}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Rate <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="rate"
                            value={resourceData.rate ?? 0}
                            onChange={handleChange}
                            style={{ borderRadius: '0.5rem' }}
                            placeholder="0.00"
                            className="form-input w-100"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>

            {/* Quantity & Measurements Section */}
            <div className="ms-3 me-3 rounded-3 mt-3 mb-3 bg-white pb-3">
                <div className="text-start fw-bold p-3 rounded-3" style={{ backgroundColor: '#EFF6FF', color: '#005197' }}>
                    <Area size={20} className="me-1" />
                    Quantity & Measurements
                </div>
                <div className="row g-3 ms-3 me-3 mt-2">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            UOM <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                            options={uomOptions}
                            value={selectedUom}
                            placeholder="Select UOM"
                            className="w-100"
                            classNamePrefix="select"
                            onChange={(selected) => handleSelectChange('uom', selected)}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Quantity Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <Select
                            options={quantityTypeOption}
                            placeholder="Select Quantity Type"
                            className="w-100"
                            classNamePrefix="select"
                            value={selectedQuantityType}
                            onChange={(selected) => handleSelectChange('quantityType', selected)}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Coefficient <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="number"
                            name="coEfficient"
                            value={resourceData.coEfficient ?? 1}
                            onChange={handleChange}
                            style={{ borderRadius: '0.5rem' }}
                            placeholder="1.00"
                            className="form-input w-100"
                            step="0.01"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Calculated Quantity <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={(resourceData.calculatedQuantity || 0).toFixed(3)}
                            style={{ borderRadius: '0.5rem' }}
                            placeholder="0.000"
                            readOnly
                            className="form-input w-100 bg-light"
                        />
                    </div>
                </div>
            </div>

            {/* Wastage Section - unchanged */}
            <div className="ms-3 me-3 rounded-3 mt-3 mb-3 bg-white pb-3">
                <div className="d-flex justify-content-between p-3 rounded-3" 
                     onClick={() => toggleSelection('Wastage & Net Quantity')} 
                     style={{ backgroundColor: '#EFF6FF', color: '#005197', cursor: 'pointer' }}>
                    <div className="text-start fw-bold">
                        <Area size={20} className="me-1" />
                        Wastage & Net Quantity
                    </div>
                    <ChevronDown className={expandedSections["Wastage & Net Quantity"] ? 'rotate-180' : ''} />
                </div>
                {expandedSections["Wastage & Net Quantity"] && (
                    <div className="row g-3 ms-3 me-3 mt-2">
                        <div className="col-md-4">
                            <label className="form-label text-start w-100">Wastage %</label>
                            <input
                                type="number"
                                name="wastePercentage"
                                value={resourceData.wastePercentage ?? 0}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="form-input w-100"
                                style={{ borderRadius: "0.5rem" }}
                                step="0.01"
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-start w-100">Wastage Quantity</label>
                            <input
                                type="text"
                                value={(resourceData.wasteQuantity || 0).toFixed(3)}
                                readOnly
                                className="form-input w-100 bg-light"
                                placeholder="0.000"
                                style={{ borderRadius: "0.5rem" }}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label text-start w-100">Net Quantity</label>
                            <input
                                type="text"
                                value={(resourceData.netQuantity || 0).toFixed(3)}
                                readOnly
                                className="form-input w-100 bg-light"
                                placeholder="0.000"
                                style={{ borderRadius: "0.5rem" }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Pricing Section - unchanged */}
            <div className="ms-3 me-3 rounded-3 mt-3 mb-3 bg-white pb-3">
                <div className="d-flex justify-content-between p-3 rounded-3" 
                     onClick={() => toggleSelection('Pricing & Currency')} 
                     style={{ backgroundColor: '#EFF6FF', color: '#005197', cursor: 'pointer' }}>
                    <div className="text-start fw-bold">
                        <Area size={20} className="me-1" />
                        Pricing & Currency
                    </div>
                    <ChevronDown className={expandedSections["Pricing & Currency"] ? 'rotate-180' : ''} />
                </div>
                {expandedSections["Pricing & Currency"] && (
                    <div className="row g-3 ms-3 me-3 mt-2">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label text-start w-100">Additional Rate</label>
                                <input
                                    type="number"
                                    name="additionalRate"
                                    value={resourceData.additionalRate ?? 0}
                                    onChange={handleChange}
                                    className="form-input w-100"
                                    placeholder="0.00"
                                    style={{ borderRadius: "0.5rem" }}
                                    step="0.01"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-start w-100">Currency</label>
                                <Select
                                    options={currencyOptions}
                                    placeholder="Select Currency"
                                    className="w-100"
                                    classNamePrefix="select"
                                    value={selectedCurrency}
                                    onChange={(selected) => handleSelectChange('currency', selected)}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="form-label text-start w-100">Shipping / Freight Price (+ / -)</label>
                                <input
                                    type="number"
                                    name="shippingPrice"
                                    value={resourceData.shippingPrice ?? 0}
                                    onChange={handleChange}
                                    className="form-input w-100"
                                    placeholder="0.00"
                                    style={{ borderRadius: "0.5rem" }}
                                    step="0.01"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-start w-100">Exchange Rate</label>
                                <input
                                    type="number"
                                    name="exchangeRate"
                                    value={resourceData.exchangeRate ?? 1}
                                    onChange={handleChange}
                                    className="form-input w-100"
                                    placeholder="1.00000"
                                    step="0.0001"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Cost Summary - unchanged */}
            <div className="ms-3 me-3 rounded-3 mt-3 mb-3 bg-white pb-3">
                <div className="text-start fw-bold p-3 rounded-3" style={{ backgroundColor: '#EFF6FF', color: '#005197' }}>
                    <Area size={20} className="me-1" />
                    Cost Summary
                </div>
                <div className="d-flex justify-content-end align-items-center mb-3 mt-3">
                    <span className="me-2">Rate Lock</span>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="rateLockSwitch"
                            name="rateLock"
                            checked={resourceData.rateLock ?? false}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row g-3 text-center ms-3 me-3">
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F9FAFB' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">{(resourceData.costUnitRate || 0).toFixed(4)}</div>
                            <small className="text-muted">per {boq?.uom?.uomCode || 'unit'}</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#EFF6FF' }}>
                            <div className="text-muted">Total Cost (Company Currency)</div>
                            <div className="fw-bold">{(resourceData.totalCostCompanyCurrency || 0).toFixed(2)}</div>
                            <small className="text-muted">per {boq?.uom?.uomCode || 'unit'}</small>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="text-muted">Total Cost (Resource Currency)</div>
                            <div className="fw-bold">{(resourceData.resourceTotalCost || 0).toFixed(2)}</div>
                            <small className="text-muted">per {boq?.uom?.uomCode || 'unit'}</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-end pt-3 me-3 mb-5">
                <button
                    className="btn action-button"
                    onClick={handleAddResource}
                    disabled={!selectedResourceType || !selectedResource || resourceData.rate === 0}
                >
                    {tenderEstimationId ? 'Update Resource' : 'Add Resource'}
                </button>
            </div>
        </div>
    );
}
export default AddResource;