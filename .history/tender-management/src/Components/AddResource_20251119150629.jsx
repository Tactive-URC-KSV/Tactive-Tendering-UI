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
    const boqTotalQuantity = ""; 

    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [quantityType, setQuantityType] = useState([]); 
    const [currency, setCurrency] = useState([]);
    const [selectedUom, setSelectedUom] = useState(null);

    // Resource data state
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

        const calculatedQuantity = (data.boqTotalQuantity || 0) * coEfficient;
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

    useEffect(() => { fetchResourceTypes(); fetchResourceNature(); fetchQuantityType(); fetchCurrency(); }, []);

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

            {/* === Basic Information Section === */}
            <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Resource Type <span style={{ color: "red" }}>*</span></label>
                        <Select options={resourceTypeOptions} styles={customStyles} value={resourceTypeOptions.find(o => o.value === resourceData.resourceTypeId)} onChange={selected => {
                            setResourceData(prev => ({ ...prev, resourceTypeId: selected.value }));
                            setSelectedResourceType(selected);
                            fetchResources(selected.value);
                        }} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Nature <span style={{ color: "red" }}>*</span></label>
                        <Select options={resourceNatureOption} styles={customStyles} value={resourceNatureOption.find(o => o.value === resourceData.resourceNatureId)} onChange={selected => setResourceData(prev => ({ ...prev, resourceNatureId: selected.value }))} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Resource Name <span style={{ color: "red" }}>*</span></label>
                        <Select options={resourceOption} styles={customStyles} value={resourceOption.find(o => o.value === resourceData.resourceId)} onChange={selected => setResourceData(prev => ({ ...prev, resourceId: selected.value }))} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Rate <span style={{ color: "red" }}>*</span></label>
                        <input type="number" className="form-input w-100" placeholder="0.00" value={resourceData.rate} onChange={e => handleCalculations({ rate: parseFloat(e.target.value) || 0 })} />
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Quantity & Measurements Section === */}
            <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">UOM <span style={{ color: "red" }}>*</span></label>
                        <Select options={uomOptions} styles={customStyles} value={uomOptions.find(o => o.value === resourceData.uomId)} onChange={selected => setResourceData(prev => ({ ...prev, uomId: selected.value }))} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Quantity Type <span style={{ color: "red" }}>*</span></label>
                        <Select options={quantityTypeOption} styles={customStyles} value={quantityTypeOption.find(o => o.value === resourceData.quantityTypeId)} onChange={selected => setResourceData(prev => ({ ...prev, quantityTypeId: selected.value }))} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Coefficient <span style={{ color: "red" }}>*</span></label>
                        <input type="number" className="form-input w-100" placeholder="0.00" value={resourceData.coEfficient} onChange={e => handleCalculations({ coEfficient: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Calculated Quantity</label>
                        <input type="number" className="form-input w-100" value={resourceData.calculatedQuantity} readOnly />
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Wastage & Net Quantity Section === */}
            <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
                <div className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label">Wastage %</label>
                        <input type="number" className="form-input w-100" value={resourceData.wastePercentage} onChange={e => handleCalculations({ wastePercentage: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Wastage Quantity</label>
                        <input type="number" className="form-input w-100" value={resourceData.wasteQuantity} readOnly />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Net Quantity</label>
                        <input type="number" className="form-input w-100" value={resourceData.netQuantity} readOnly />
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Pricing & Currency Section === */}
            <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
                <div className="row g-4">
                    <div className="col-md-6">
                        <label className="form-label">Additional Rate</label>
                        <input type="number" className="form-input w-100" value={resourceData.additionalRate} onChange={e => handleCalculations({ additionalRate: parseFloat(e.target.value) || 0 })} />
                        <label className="form-label mt-2">Currency</label>
                        <Select options={currencyOptions} styles={customStyles} value={currencyOptions.find(o => o.value === resourceData.currencyId)} onChange={selected => setResourceData(prev => ({ ...prev, currencyId: selected.value }))} />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Shipping / Freight Price (+ / -)</label>
                        <input type="number" className="form-input w-100" value={resourceData.shippingPrice} onChange={e => handleCalculations({ shippingPrice: parseFloat(e.target.value) || 0 })} />
                        <label className="form-label mt-2">Exchange Rate</label>
                        <input type="number" className="form-input w-100" value={resourceData.exchangeRate} onChange={e => handleCalculations({ exchangeRate: parseFloat(e.target.value) || 1 })} />
                    </div>
                </div>
            </FormSectionContainer>

            {/* === Cost Summary Section === */}
            <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <span className="me-2">Rate Lock</span>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" checked={resourceData.rateLock} onChange={e => setResourceData(prev => ({ ...prev, rateLock: e.target.checked }))} />
                    </div>
                </div>
                <div className="row g-3 text-center">
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#e9ecef', borderRadius: '0.5rem' }}>Cost / Unit: {resourceData.costUnitRate.toFixed(2)}</div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#e9ecef', borderRadius: '0.5rem' }}>Total Cost: {resourceData.resourceTotalCost.toFixed(2)}</div>
                    </div>
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#e9ecef', borderRadius: '0.5rem' }}>Total Cost (Company Currency): {resourceData.totalCostCompanyCurrency.toFixed(2)}</div>
                    </div>
                </div>
            </FormSectionContainer>

            <div className="d-flex justify-content-end mt-4 me-3">
                <button className="btn btn-primary" onClick={handleAddResource}>Add Resource</button>
            </div>
        </div>
    );
}

export default AddResource;
