import React, { useState, useEffect, useCallback, useMemo } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUom } from "../Context/UomContext";

function AddResource() {
    const navigate = useNavigate();

    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 
    const boqUOM = ""; 
    const boqTotalQuantity = 0; 

    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [quantityType, setQuantityType] = useState([]); 
    const [currency, setCurrency] = useState([]);

    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [selectedNature, setSelectedNature] = useState(null);
    const [selectedUom, setSelectedUom] = useState(null);
    const [selectedQuantityType, setSelectedQuantityType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);

    const [resourceData, setResourceData] = useState({
        docNumber: "",
        coEfficient: 0,
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
        exchangeRate: 0,
        totalCostCompanyCurrency: 0,
        resourceTypeId: "",
        quantityTypeId: "",
        resourceNatureId: "",
        uomId: "",
        currencyId: "",
        resourceId: "",
        boqId: "",
        projectId: ""
    });

    const handleCalculations = (updatedData) => {
        const data = { ...resourceData, ...updatedData };
        const coEfficient = parseFloat(data.coEfficient) || 1;
        const wastePercentage = parseFloat(data.wastePercentage) || 0;
        const rate = parseFloat(data.rate) || 0;
        const additionalRate = parseFloat(data.additionalRate) || 0;
        const shippingPrice = parseFloat(data.shippingPrice) || 0;
        const exchangeRate = parseFloat(data.exchangeRate) || 1;

        const calculatedQuantity = (boqTotalQuantity || 0) * coEfficient;
        const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
        const netQuantity = calculatedQuantity + wasteQuantity;
        const unitRate = netQuantity > 0 ? rate + additionalRate + (shippingPrice / netQuantity) : 0;
        const totalCostCompanyCurrency = unitRate * netQuantity;
        const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;

        setResourceData((prev) => ({
          ...prev,
          ...data,
          calculatedQuantity,
          wasteQuantity,
          netQuantity,
          costUnitRate: unitRate,
          resourceTotalCost: resourceTotalCost,
          totalCostCompanyCurrency: totalCostCompanyCurrency,
        }));
    };

    const uomOptions = useMemo(() => 
        useUom().map(uom => ({ value: uom.id, label: uom.uomName })),
        [useUom()]
    );

    const fetchResourceTypes = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        })
        .then((res) => { if (res.status === 200) setResourceTypes(res.data); })
        .catch(() => toast.error('Failed to fetch resource types.'));
    }, []);

    const fetchResourceNature = useCallback(() => {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
      .then((res) => { if (res.status === 200) setResourceNature(res.data); })
      .catch(() => toast.error('Failed to fetch resource natures.'));
    }, []);

    const fetchResources = useCallback((resTypeId) => {
      if (!resTypeId) return;
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
      .then((res) => { if (res.status === 200) setResources(res.data); })
      .catch(() => toast.error('Failed to fetch resources.'));
    }, []);

    const fetchQuantityType = useCallback(() => {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
      .then((res) => { if (res.status === 200) setQuantityType(res.data); })
      .catch(() => toast.error('Failed to fetch quantity types.'));
    }, []);

    const fetchCurrency = useCallback(() => {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      })
      .then((res) => { if (res.status === 200) setCurrency(res.data); })
      .catch(() => toast.error('Failed to fetch currencies.'));
    }, []);

    useEffect(() => { 
        fetchResourceTypes(); 
        fetchResourceNature(); 
        fetchQuantityType(); 
        fetchCurrency(); 
    }, []);

    const resourceTypeOptions = useMemo(() => resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), [resourceTypes]);
    const resourceOption = useMemo(() => resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })), [resources]);
    const resourceNatureOption = useMemo(() => resourceNature.map(item => ({ value: item.id, label: item.nature })), [resourceNature]);
    const quantityTypeOption = useMemo(() => quantityType.map(item => ({ value: item.id, label: item.quantityType })), [quantityType]);
    const currencyOptions = useMemo(() => currency.map(item => ({ value: item.id, label: item.currencyName })), [currency]);

    const handleBack = () => navigate(-1);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? darkBlue : provided.borderColor,
            boxShadow: state.isFocused ? `0 0 0 0.25rem rgba(0, 81, 151, 0.25)` : provided.boxShadow,
            minHeight: '38px',
            width: '100%',
        }),
        placeholder: (provided) => ({ ...provided, color: '#adb5bd' }),
        singleValue: (provided) => ({ ...provided, color: '#212529' }),
        dropdownIndicator: (provided) => ({ ...provided, color: '#000000' }),
        indicatorSeparator: () => ({ display: 'none' }),
    };

    const FormSectionContainer = ({ title, icon, defaultOpen = false, children }) => {
        const isStatic = ['Basic Information', 'Quantity & Measurements', 'Cost Summary'].includes(title);
        const [isOpen, setIsOpen] = useState(isStatic || defaultOpen);
        const headerStyle = {
            cursor: isStatic ? 'default' : 'pointer',
            listStyle: 'none',
            backgroundColor: containerBgColor,
            border: `1px solid ${containerBorderColor}`,
            borderBottom: (isStatic || isOpen) ? 'none' : `1px solid ${containerBorderColor}`,
            borderRadius: (isStatic || isOpen) ? '0.5rem 0.5rem 0 0' : '0.5rem',
            marginBottom: '0',
        };
        const contentStyle = {
            backgroundColor: 'white',
            padding: '1rem 1.5rem',
            borderLeft: `1px solid ${containerBorderColor}`,
            borderRight: `1px solid ${containerBorderColor}`,
            borderBottom: `1px solid ${containerBorderColor}`,
            borderRadius: '0 0 0.5rem 0.5rem',
            marginTop: '0'
        };
        const HeaderContent = (
            <div className="py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">{icon}<span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span></div>
                {!isStatic && <ChevronDown size={20} style={{ color: vibrantBlue, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
            </div>
        );
        return (
            <div className="mx-3 mb-4">
                <div style={headerStyle} onClick={() => { if (!isStatic) setIsOpen(!isOpen); }}>{HeaderContent}</div>
                {isOpen && <div style={contentStyle}>{children}</div>}
            </div>
        );
    };

    const handleAddResource = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`, resourceData, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }).then(() => {
            toast.success("Resource added successfully");
            navigate(-1);
        }).catch(() => toast.error("Failed to add resource"));
    };

    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">Add New Resource</span>
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
                <div className="d-flex">
                    <span className="me-3" style={{ fontSize: '0.9rem' }}>Unit of Measurement <strong>{boqUOM}</strong></span>
                    <span style={{ fontSize: '0.9rem' }}>Total Quantity <strong>{boqTotalQuantity}</strong></span>
                </div>
            </div>

            {/* === Basic Information === */}
            <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Resource Type <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }}>
                            <Select
                                options={resourceTypeOptions}
                                styles={customStyles}
                                placeholder="Select Resource Type"
                                className="w-100"
                                classNamePrefix="select"
                                value={selectedResourceType}
                                onChange={(selected) => {
                                    setSelectedResourceType(selected);
                                    setResourceData(prev => ({ ...prev, resourceTypeId: selected?.value }));
                                    fetchResources(selected?.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Nature <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }} className="ms-auto">
                            <Select
                                options={resourceNatureOption}
                                styles={customStyles}
                                placeholder="Select Nature"
                                className="w-100"
                                classNamePrefix="select"
                                value={selectedNature}
                                onChange={(selected) => {
                                    setSelectedNature(selected);
                                    setResourceData(prev => ({ ...prev, resourceNatureId: selected?.value }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Resource Name <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }}>
                            <Select
                                options={resourceOption}
                                styles={{
                                    ...customStyles,
                                    placeholder: (provided) => ({ ...provided, color: 'black', textAlign: 'left' }),
                                    singleValue: (provided) => ({ ...provided, color: 'black' }),
                                }}
                                placeholder="Select resource"
                                className="w-100"
                                classNamePrefix="select"
                                value={selectedResource}
                                onChange={(selected) => {
                                    setSelectedResource(selected);
                                    setResourceData(prev => ({ ...prev, resourceId: selected?.value }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Rate <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }} className="ms-auto">
                            <input
                                type="number"
                                style={{ borderRadius: '0.5rem' }}
                                placeholder="0.00"
                                className="form-input w-100"
                                value={resourceData.rate}
                                onChange={(e) => handleCalculations({ rate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Quantity & Measurements === */}
            <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">UOM <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }}>
                            <Select
                                options={uomOptions}
                                value={selectedUom}
                                onChange={(selected) => {
                                    setSelectedUom(selected);
                                    setResourceData(prev => ({ ...prev, uomId: selected?.value }));
                                }}
                                styles={customStyles}
                                placeholder="Select UOM"
                                className="w-100"
                                classNamePrefix="select"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Quantity Type <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }} className="ms-auto">
                            <Select
                                options={quantityTypeOption}
                                styles={customStyles}
                                placeholder="Select Quantity Type"
                                className="w-100"
                                classNamePrefix="select"
                                value={selectedQuantityType}
                                onChange={(selected) => {
                                    setSelectedQuantityType(selected);
                                    setResourceData(prev => ({ ...prev, quantityTypeId: selected?.value }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Coefficient <span style={{ color: "red" }}>*</span></label>
                        <div style={{ width: '80%' }}>
                            <input
                                type="number"
                                style={{ borderRadius: '0.5rem' }}
                                placeholder="0.00"
                                className="form-input w-100"
                                value={resourceData.coEfficient}
                                onChange={(e) => handleCalculations({ coEfficient: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">Calculated Quantity</label>
                        <div style={{ width: '80%' }} className="ms-auto">
                            <input
                                type="text"
                                style={{ borderRadius: '0.5rem' }}
                                placeholder=""
                                readOnly
                                className="form-input w-100"
                                value={resourceData.calculatedQuantity.toFixed(2)}
                            />
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Wastage & Net Quantity === */}
            <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label text-start w-100">Wastage %</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="form-input w-100"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.wastePercentage}
                            onChange={(e) => handleCalculations({ wastePercentage: e.target.value })}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">Wastage Quantity</label>
                        <input
                            type="number"
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.wasteQuantity.toFixed(2)}
                            readOnly
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">Net Quantity</label>
                        <input
                            type="number"
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.netQuantity.toFixed(2)}
                            readOnly
                        />
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Cost Summary === */}
            <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label text-start w-100">Additional Rate</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            className="form-input w-100"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.additionalRate}
                            onChange={(e) => handleCalculations({ additionalRate: e.target.value })}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">Shipping Price</label>
                        <input
                            type="number"
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.shippingPrice}
                            onChange={(e) => handleCalculations({ shippingPrice: e.target.value })}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">Cost per Unit</label>
                        <input
                            type="number"
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.costUnitRate.toFixed(2)}
                            readOnly
                        />
                    </div>

                    <div className="col-md-6 mt-3">
                        <label className="form-label text-start w-100">Total Cost (Company Currency)</label>
                        <input
                            type="number"
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.totalCostCompanyCurrency.toFixed(2)}
                            readOnly
                        />
                    </div>

                    <div className="col-md-6 mt-3">
                        <label className="form-label text-start w-100">Total Cost (Resource Currency)</label>
                        <input
                            type="number"
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                            value={resourceData.resourceTotalCost.toFixed(2)}
                            readOnly
                        />
                    </div>
                </div>
            </FormSectionContainer>

            <div className="text-end mx-3 mb-5">
                <button className="btn btn-primary" onClick={handleAddResource}>Add Resource</button>
            </div>
        </div>
    );
}

export default AddResource;
