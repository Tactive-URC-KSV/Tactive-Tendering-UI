import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUom } from "../Context/UomContext";

function AddResource() {
    const navigate = useNavigate();
    
    // --- Refs and Constants ---
    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF';
    const containerBorderColor = '#dee2e6';
    const [boqUOM, setBoqUOM] = useState("CUM");
    const [boqTotalQuantity, setBoqTotalQuantity] = useState(100.00); 
    
    // 1. SCROLL MANAGEMENT: REF FOR THE MAIN CONTAINER
    const formContainerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    // Use a single ref to track if a scroll should be restored
    const shouldRestoreScroll = useRef(false); 

    // HELPER FUNCTION: CAPTURE SCROLL
    const captureScroll = useCallback(() => {
        // Only capture scroll if we are actually scrolled down
        if (window.scrollY > 50) { 
            setScrollPosition(window.scrollY);
            shouldRestoreScroll.current = true;
        } else if (formContainerRef.current && formContainerRef.current.scrollTop > 0) {
            setScrollPosition(formContainerRef.current.scrollTop);
            shouldRestoreScroll.current = true;
        }
    }, []);
    
    // --- State Variables ---
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [quantityType, setQuantityType] = useState([]); 
    const [currency, setCurrency] = useState([]);
    const [selectedUom, setSelectedUom] = useState(null);
    const [selectedNature, setSelectedNature] = useState(null);
    const [selectedQuantityType, setSelectedQuantityType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null);
    const [expandedSections, setExpandedSections] = useState({
        'Wastage & Net Quantity': false,
        'Pricing & Currency': false,
    });
    
    const [resourceData, setResourceData] = useState({
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
        boqId: "mock_boq_id", 
        projectId: "mock_project_id" 
    });


    const handleUnauthorized = useCallback(() => {
        toast.error("Session expired or unauthorized. Please log in again.");
    }, []);

    const uomData = useUom(); 

    const uomOptions = useMemo(() =>
        (Array.isArray(uomData) ? uomData : []).map(uom => ({ value: uom.id, label: uom.uomName })),
        [uomData] 
    );

    
    const handleCalculations = useCallback((updatedData) => {
        // Use functional state update to ensure latest values are used
        setResourceData((prev) => {
            const data = { ...prev, ...updatedData };
            const coEfficient = parseFloat(data.coEfficient) || 0;
            const wastePercentage = parseFloat(data.wastePercentage) || 0;
            const rate = parseFloat(data.rate) || 0;
            const additionalRate = parseFloat(data.additionalRate) || 0;
            const shippingPrice = parseFloat(data.shippingPrice) || 0;
            const exchangeRate = parseFloat(data.exchangeRate) || 1;
            const boqQuantity = parseFloat(boqTotalQuantity) || 0; 
            
            // Core Calculations
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
                resourceTotalCost: resourceTotalCost,
                totalCostCompanyCurrency: totalCostCompanyCurrency,
            };
        });
    }, [boqTotalQuantity]); 

    
    // FIX APPLIED HERE: The core fix is ensuring this function doesn't include any extra logic 
    // that might trigger a re-render *before* the state update, which could confuse React.
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle value conversion based on input type
        const newValue = type === 'number' || name === 'coEfficient' || name.includes('Rate') || name.includes('Price') || name.includes('Percentage')
            ? parseFloat(value) || 0 // Treat empty number field as 0 for calculations
            : type === 'checkbox' 
            ? checked 
            : value;
        
        // Only call the calculation function which updates the state.
        handleCalculations({ [name]: newValue });
    };

    // --- Data Fetching Hooks (omitted for brevity) ---
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

    useEffect(() => { fetchResourceTypes(); }, [fetchResourceTypes]);

    const fetchResourceNature = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setResourceNature(res.data); })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch resource natures.');
        });
    }, [handleUnauthorized]);

    useEffect(() => { fetchResourceNature(); }, [fetchResourceNature]);

    const fetchResources = useCallback((resTypeId) => {
      if (!resTypeId) return;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
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
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setQuantityType(res.data); })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch quantity types.');
        });
    }, [handleUnauthorized]);

    useEffect(() => { fetchQuantityType(); }, [fetchQuantityType]);

    const fetchCurrency = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setCurrency(res.data); })
        .catch((err) => {
          if (err?.response?.status === 401) handleUnauthorized();
          else toast.error('Failed to fetch currencies.');
        });
    }, [handleUnauthorized]);

    useEffect(() => { fetchCurrency(); }, [fetchCurrency]);

    useEffect(() => {
        handleCalculations({}); 
    }, [handleCalculations]);
    
    // 3. SCROLL RESTORATION EFFECT
    useEffect(() => {
        if (shouldRestoreScroll.current && scrollPosition > 0) {
            // Use a slight delay to allow the DOM to settle after the re-render
            const timeoutId = setTimeout(() => {
                const container = formContainerRef.current;
                
                // Try to restore window scroll first
                window.scrollTo(0, scrollPosition);
                
                // Fallback for internal container scroll
                if (container && container.scrollHeight > container.clientHeight) {
                     container.scrollTop = scrollPosition;
                }
                
                shouldRestoreScroll.current = false; // Reset the flag
            }, 10); 

            return () => clearTimeout(timeoutId); 
        }
    }, [resourceData, expandedSections, scrollPosition]); 


    // --- Options Memoization ---
    const resourceTypeOptions = useMemo(() => resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), [resourceTypes]);
    const resourceOption = useMemo(() => resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })), [resources]);
    const resourceNatureOption = useMemo(() => resourceNature.map(item => ({ value: item.id, label: item.nature })), [resourceNature]);
    const quantityTypeOption = useMemo(() => quantityType.map(item => ({ value: item.id, label: item.quantityType })), [quantityType]);
    const currencyOptions = useMemo(() => currency.map(item => ({ value: item.id, label: item.currencyName })), [currency]);

    // --- Handlers ---
    const handleBack = () => navigate(-1);
    
    const handleAddResource = () => {
        const payload = {
            ...resourceData,
            boqQuantity: boqTotalQuantity,
            boqUOM: boqUOM,
        };

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`, payload, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
        }).then(() => {
            toast.success("Resource added successfully");
            navigate(-1);
        }).catch((err) => {
            if (err?.response?.status === 401) handleUnauthorized();
            else toast.error("Failed to add resource. Please check the form data.");
        });
    };

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

    // Toggle logic now explicitly calls captureScroll
    const toggleSection = (title) => {
        captureScroll(); 
        setExpandedSections(prev => ({
            ...prev,
            [title]: !prev[title]
        }));
    };

    // --- Form Section Container ---
    // NOTE: This component is rendered differently when expanded/collapsed, so the scroll restoration logic is essential here.
    const FormSectionContainer = ({ title, icon, children, isStaticSection = false, isOpen, onToggle }) => {
        
        const headerStyle = {
            cursor: isStaticSection ? 'default' : 'pointer',
            listStyle: 'none',
            backgroundColor: containerBgColor,
            border: `1px solid ${containerBorderColor}`,
            borderBottom: (isStaticSection || isOpen) ? 'none' : `1px solid ${containerBorderColor}`,
            borderRadius: (isStaticSection || isOpen) ? '0.5rem 0.5rem 0 0' : '0.5rem',
            marginBottom: '0',
            userSelect: 'none',
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

        const handleClick = () => {
            if (!isStaticSection) {
                onToggle(title);
            }
        }
        
        const HeaderContent = (
            <div className="py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">{icon}<span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span></div>
                {!isStaticSection && <ChevronDown size={20} style={{ color: vibrantBlue, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
            </div>
        );
        return (
            <div className="mx-3 mb-4">
                <div style={headerStyle} onClick={handleClick}>{HeaderContent}</div>
                {(isStaticSection || isOpen) && <div style={contentStyle}>{children}</div>}
            </div>
        );
    };


    return (
        // ATTACH THE REF TO THE MAIN CONTAINER DIV
        <div ref={formContainerRef} className="container-fluid min-vh-100">

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
                    <span style={{ fontSize: '0.9rem' }}>Total Quantity <strong>{boqTotalQuantity.toFixed(2)}</strong></span>
                </div>
            </div>

            {/* Basic Information Section */}
            <FormSectionContainer 
                title="Basic Information" 
                icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} 
                isStaticSection={true}
                isOpen={true} 
                onToggle={() => {}} 
            >
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select options={resourceTypeOptions} styles={customStyles} placeholder="Select Resource Type"className="w-100"classNamePrefix="select"
                                value={selectedResourceType}
                                onMenuOpen={captureScroll}
                                onChange={(selected) => {
                                    setSelectedResourceType(selected);
                                    handleCalculations({ resourceTypeId: selected?.value });
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
                            <Select options={resourceNatureOption} styles={customStyles} placeholder="Select Nature" className="w-100" classNamePrefix="select"
                                value={selectedNature}
                                onMenuOpen={captureScroll}
                                onChange={(selected) => {
                                    setSelectedNature(selected);
                                    handleCalculations({ resourceNatureId: selected?.value });
                                }}
                            />
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
                                placeholder="Select resource"className="w-100"classNamePrefix="select"
                                value={selectedResource}
                                onMenuOpen={captureScroll}
                                onChange={(selectedOption) => {
                                    setSelectedResource(selectedOption);
                                    const selectedResObj = resources.find((r) => r.id === selectedOption?.value);
                                    if (selectedResObj) {
                                        
                                        const matchingUomOption = uomOptions.find((u) => u.value === selectedResObj.uom?.id);
                                        if (matchingUomOption) setSelectedUom(matchingUomOption);

                                        handleCalculations({
                                            resourceId: selectedResObj.id,
                                            rate: selectedResObj.unitRate,
                                            uomId: selectedResObj.uom?.id
                                        });
                                    } else {
                                        setSelectedUom(null);
                                        handleCalculations({ rate: 0, uomId: "", resourceId: "" });
                                    }
                                }}

                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Rate <span style={{ color: "red" }}>*</span>
                            </label>
                            <input 
                                type="number" 
                                name="rate"
                                value={resourceData.rate}
                                onChange={handleChange}
                                style={{ borderRadius: '0.5rem' }} 
                                placeholder="0.00" 
                                className="form-input w-100"
                            />
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* Quantity & Measurements Section */}
            <FormSectionContainer 
                title="Quantity & Measurements" 
                icon={<AlignLeft size={20} className="text-primary" />}
                isStaticSection={true}
                isOpen={true} 
                onToggle={() => {}} 
            >
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            UOM <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select
                                options={uomOptions} 
                                value={selectedUom} 
                                styles={customStyles} 
                                placeholder="Select UOM" 
                                className="w-100" 
                                classNamePrefix="select" 
                                onMenuOpen={captureScroll}
                                onChange={(selected) => {
                                    setSelectedUom(selected);
                                    handleCalculations({ uomId: selected?.value });
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Quantity Type <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select options={quantityTypeOption} styles={customStyles} placeholder="Select Quantity Type" className="w-100"classNamePrefix="select"
                                value={selectedQuantityType}
                                onMenuOpen={captureScroll}
                                onChange={(selected) => {
                                    setSelectedQuantityType(selected);
                                    handleCalculations({ quantityTypeId: selected?.value });
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Coefficient <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <input 
                                type="number" 
                                name="coEfficient"
                                value={resourceData.coEfficient}
                                onChange={handleChange}
                                style={{ borderRadius: '0.5rem' }} 
                                placeholder="0.00" 
                                className="form-input w-100" 
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Calculated Quantity <span style={{ color: "red" }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                value={resourceData.calculatedQuantity.toFixed(2)}
                                style={{ borderRadius: '0.5rem' }} 
                                placeholder="" 
                                readOnly 
                                className="form-input w-100"
                            />
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* Wastage & Net Quantity Section */}
            <FormSectionContainer 
                title="Wastage & Net Quantity" 
                icon={<Settings size={20} className="text-primary" />}
                isStaticSection={false}
                isOpen={expandedSections['Wastage & Net Quantity']}
                onToggle={toggleSection}
            >
                <div className="row g-3">

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">
                            Wastage % 
                        </label>
                        <input
                            type="number"
                            name="wastePercentage"
                            value={resourceData.wastePercentage}
                            // REMOVED onFocus={captureScroll} - not needed as handleChange is clean
                            onChange={handleChange}
                            placeholder="0.00"
                            className="form-input w-100"
                            style={{ borderRadius: "0.5rem" }}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">
                            Wastage Quantity
                        </label>
                        <input
                            type="text"
                            value={resourceData.wasteQuantity.toFixed(2)}
                            readOnly
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">
                            Net Quantity
                        </label>
                        <input
                            type="text"
                            value={resourceData.netQuantity.toFixed(2)}
                            readOnly
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem" }}
                        />
                    </div>

                </div>
            </FormSectionContainer>


            {/* Pricing & Currency Section */}
            <FormSectionContainer 
                title="Pricing & Currency" 
                icon={<DollarSign size={20} className="text-primary" />}
                isStaticSection={false}
                isOpen={expandedSections['Pricing & Currency']}
                onToggle={toggleSection}
            >
                <div className="row g-4">
                    <div className="col-md-6">

                        <div className="mb-3">
                            <label className="form-label text-start w-100">Additional Rate</label>
                            <input 
                                type="number" 
                                name="additionalRate"
                                value={resourceData.additionalRate}
                                // REMOVED onFocus={captureScroll}
                                onChange={handleChange}
                                className="form-input w-100" 
                                placeholder="0.00"
                                style={{ borderRadius: "0.5rem" }} 
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Currency </label>
                            <Select options={currencyOptions} styles={customStyles} placeholder="Select Currency" className="w-100" classNamePrefix="select" 
                                value={selectedCurrency}
                                onMenuOpen={captureScroll}
                                onChange={(selected) => {
                                    setSelectedCurrency(selected);
                                    handleCalculations({ currencyId: selected?.value });
                                }}
                            /> 
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Shipping / Freight Price (+ / -) </label>
                            <input 
                                type="number" 
                                name="shippingPrice"
                                value={resourceData.shippingPrice}
                                // REMOVED onFocus={captureScroll}
                                onChange={handleChange}
                                className="form-input w-100" 
                                placeholder="0.00" 
                                style={{ borderRadius: "0.5rem" }} 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Exchange Rate </label>
                            <input 
                                type="number" 
                                name="exchangeRate"
                                value={resourceData.exchangeRate}
                                // REMOVED onFocus={captureScroll}
                                onChange={handleChange}
                                className="form-input w-100" 
                                placeholder="1.00000" 
                                style={{ borderRadius: "0.5rem"}} 
                            />
                        </div>

                    </div>

                </div>
            </FormSectionContainer>

            {/* Cost Summary Section */}
            <FormSectionContainer 
                title="Cost Summary" 
                icon={<Calculator size={20} className="text-primary" />}
                isStaticSection={true}
                isOpen={true} 
                onToggle={() => {}}
            >
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <span className="me-2">Rate Lock</span>
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            id="rateLockSwitch" 
                            name="rateLock"
                            checked={resourceData.rateLock}
                            // REMOVED onFocus={captureScroll}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row g-3 text-center">
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F9FAFB' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">{resourceData.costUnitRate.toFixed(4)}</div>
                            <small className="text-muted">per {boqUOM}</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#EFF6FF' }}>
                            <div className="text-muted">Total Cost (Company Currency)</div>
                            <div className="fw-bold">{resourceData.totalCostCompanyCurrency.toFixed(2)}</div>
                            <small className="text-muted">per {boqUOM}</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="text-muted">Total Cost (Resource Currency)</div>
                            <div className="fw-bold">{resourceData.resourceTotalCost.toFixed(2)}</div>
                            <small className="text-muted">per {boqUOM}</small>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            <div className="d-flex justify-content-end pt-3 me-3">
                <button
                    className="btn"
                    style={{ backgroundColor: darkBlue, color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem' }}
                    onClick={handleAddResource}
                >
                    Add Resource
                </button>
            </div>

        </div>
    );
}

export default AddResource;