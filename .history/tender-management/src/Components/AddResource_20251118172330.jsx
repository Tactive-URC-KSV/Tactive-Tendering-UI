import React, { useState, useEffect, useCallback, useMemo } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
    const [uomOption, setUomOption] = useState([]);

    const fetchResourceTypes = useCallback(() => {
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            }
          })
          .then((res) => {
            if (res.status === 200) setResourceTypes(res.data);
          })
          .catch((err) => {
            if (err?.response?.status === 401) handleUnauthorized(); 
            else toast.error('Failed to fetch resource types.');
          });
    }, []);

    useEffect(() => { fetchResourceTypes(); }, [fetchResourceTypes]);

    const fetchResourceNature = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 200) setResourceNature(res.data);
        })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch resource natures.');
        });
    }, []);

    useEffect(() => { fetchResourceNature(); }, [fetchResourceNature]);

    const fetchResources = useCallback((resTypeId) => {
      if (!resTypeId) return;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          if (res.status === 200) setResources(res.data);
        })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch resources.');
        });
    }, []);

    const fetchQuantityType = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => { if (res.status === 200) setQuantityType(res.data); })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch quantity types.');
        });
    }, []);

    useEffect(() => { fetchQuantityType(); }, [fetchQuantityType]);

    const fetchCurrency = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => { if (res.status === 200) setCurrency(res.data); })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch currencies.');
        });
    }, []);

    useEffect(() => { fetchCurrency(); }, [fetchCurrency]);

    const resourceTypeOptions = useMemo(() => resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), [resourceTypes]);
    const resourceOption = useMemo(() => resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })), [resources]);
    const resourceNatureOption = useMemo(() => resourceNature.map(item => ({ value: item.id, label: item.nature })), [resourceNature]);
    const quantityTypeOption = useMemo(() => quantityType.map(item => ({ value: item.id, label: item.quantityType })), [quantityType]);
    const currencyOptions = useMemo(() => currency.map(item => ({ value: item.id, label: item.currencyName })), [currency]);

    const handleBack = () => navigate(-1);
    const emptyOption = [{ value: '', label: '' }];

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

            <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select 
                                options={resourceTypeOptions} 
                                styles={customStyles} 
                                placeholder="Select Resource Type"
                                value={selectedResourceType}
                                onChange={(selected) => {
                                    setSelectedResourceType(selected);
                                    fetchResources(selected?.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Nature <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select options={resourceNatureOption} styles={customStyles} placeholder="Select Nature"/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select 
                                options={resourceOption} 
                                styles={{
                                    ...customStyles,
                                    placeholder: (provided) => ({ ...provided, color: 'black', textAlign: 'left' }),
                                    singleValue: (provided) => ({ ...provided, color: 'black' }),
                                }}
                                placeholder="Select resource"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Rate <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="number" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" />
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* ---------------- Quantity & Measurements ---------------- */}
            <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            UOM <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select options={emptyOption} styles={customStyles} placeholder="Select UOM"/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Quantity Type <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select options={quantityTypeOption} styles={customStyles} placeholder="Select Quantity Type"/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Coefficient <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <input type="number" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Calculated Quantity <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="" readOnly />
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* ---------------- Wastage & Net Quantity ---------------- */}
            <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
                <p className="text-muted">Fields for Wastage and Net Quantity will go here...</p>
            </FormSectionContainer>

            {/* ---------------- Pricing & Currency ---------------- */}
            <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
                <div style={{ width: '80%' }}>
                    <label className="form-label text-start w-100">
                        Currency <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select options={currencyOptions} styles={customStyles} placeholder="Select Currency"/>
                </div>
            </FormSectionContainer>

            {/* ---------------- Cost Summary ---------------- */}
            <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <span className="me-2">Rate Lock</span>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
                    </div>
                </div>

                <div className="row g-3 text-center">
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F9FAFB' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">0.00</div>
                            <small className="text-muted">per CUM</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#EFF6FF' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">0.00</div>
                            <small className="text-muted">per CUM</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">0.00</div>
                            <small className="text-muted">per CUM</small>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* ---------------- Add Resource Button ---------------- */}
            <div className="d-flex justify-content-end pt-3 me-3"> 
                <button 
                    className="btn" 
                    style={{ backgroundColor: darkBlue, color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem' }}
                >
                    Add Resource
                </button>
            </div>

        </div>
    );
}

export default AddResource;
