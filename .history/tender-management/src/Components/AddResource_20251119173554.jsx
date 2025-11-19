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
    const [boqUOM, setBoqUOM] = useState("CUM");
    const [boqTotalQuantity, setBoqTotalQuantity] = useState(100.00);

    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [quantityType, setQuantityType] = useState([]);
    const [currency, setCurrency] = useState([]);
    
    // selectedUom holds the React-Select object for display
    const [selectedUom, setSelectedUom] = useState(null); 
    
    const [selectedNature, setSelectedNature] = useState(null);
    const [selectedQuantityType, setSelectedQuantityType] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    
    // State to hold the selected resource object (Used by Effect 1 as the primary trigger)
    const [selectedResource, setSelectedResource] = useState(null); 

    const [resourceData, setResourceData] = useState({
        coEfficient: 1,
        calculatedQuantity: 0,
        wastePercentage: 0,
        wasteQuantity: 0,
        netQuantity: 0,
        rate: 0, // This must update for the input field to change
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
        uomId: "", // This must update for Effect 2 to find the UOM display
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

    // This function handles state updates and recalculations
    const handleCalculations = useCallback((updatedData) => {
        setResourceData((prev) => {
            // Use current state merged with any explicit updates
            const data = { ...prev, ...updatedData };

            const coEfficient = parseFloat(data.coEfficient) || 1;
            const wastePercentage = parseFloat(data.wastePercentage) || 0;
            const rate = parseFloat(data.rate) || 0; 
            const additionalRate = parseFloat(data.additionalRate) || 0;
            const shippingPrice = parseFloat(data.shippingPrice) || 0;
            const exchangeRate = parseFloat(data.exchangeRate) || 1;

            const boqQuantity = parseFloat(boqTotalQuantity) || 0;

            // Calculations
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
    
    // *** NEW HELPER FUNCTION FOR DEFAULT VALUES ***
    // This function ensures the resourceId, rate, and uomId are set synchronously
    // before triggering the handleCalculations (which can be called separately)
    const setResourceDefaultValues = useCallback((resource) => {
        if (resource) {
            const newRate = resource.defaultRate || 0;
            const newUomId = resource.defaultUomId || '';

            setResourceData(prev => ({
                ...prev,
                resourceId: resource.value,
                rate: newRate,
                uomId: newUomId,
            }));
            
            console.log("--- setResourceDefaultValues: State Update ---");
            console.log("Rate set:", newRate);
            console.log("UOM ID set:", newUomId);

        } else {
             // Reset related fields
             setResourceData(prev => ({
                 ...prev,
                 resourceId: "",
                 rate: 0,
                 uomId: "",
             }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const newValue = type === 'number' || name === 'coEfficient' || name.includes('Rate') || name.includes('Price') || name.includes('Percentage')
            ? parseFloat(value) || 0
            : type === 'checkbox'
            ? checked
            : value;

        // Ensure rate field specifically accepts 0 when cleared
        const finalValue = name === 'rate' ? parseFloat(value) || 0 : newValue;

        handleCalculations({ [name]: finalValue });
    };


    const fetchResourceTypes = useCallback(() => {
        // ... (API calls unchanged)
    }, [handleUnauthorized]);

    useEffect(() => { fetchResourceTypes(); }, [fetchResourceTypes]);

    const fetchResourceNature = useCallback(() => {
        // ... (API calls unchanged)
    }, [handleUnauthorized]);

    useEffect(() => { fetchResourceNature(); }, [fetchResourceNature]);

    const fetchResources = useCallback((resTypeId) => {
        if (!resTypeId) {
            setResources([]);
            setSelectedResource(null);
            setResourceDefaultValues(null); // Use the new reset logic
            return;
        }
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
            })
            .then((res) => { 
                if (res.status === 200) {
                    setResources(res.data);
                    setSelectedResource(null); 
                }
            })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error('Failed to fetch resources.');
            });
    }, [handleUnauthorized, setResourceDefaultValues]); // dependency changed to new function


    // ... (fetchQuantityType and fetchCurrency remain unchanged)
    const fetchQuantityType = useCallback(() => {
        // ... (API calls unchanged)
    }, [handleUnauthorized]);

    useEffect(() => { fetchQuantityType(); }, [fetchQuantityType]);

    const fetchCurrency = useCallback(() => {
        // ... (API calls unchanged)
    }, [handleUnauthorized]);

    useEffect(() => { fetchCurrency(); }, [fetchCurrency]);
    // ...

    useEffect(() => {
        // Run initial calculations on load
        handleCalculations({});
    }, [handleCalculations]);


    const resourceTypeOptions = useMemo(() => resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), [resourceTypes]);
    
    // Ensure defaultRate and defaultUomId are correctly extracted and included
    const resourceOption = useMemo(() => resources.map(item => {
        return { 
            value: item.id, 
            label: `${item.resourceCode}-${item.resourceName}`,
            defaultRate: item.rate || 0, // Rate property
            defaultUomId: item.uomId // UOM ID property
        };
    }), [resources]);

    const resourceNatureOption = useMemo(() => resourceNature.map(item => ({ value: item.id, label: item.nature })), [resourceNature]);
    const quantityTypeOption = useMemo(() => quantityType.map(item => ({ value: item.id, label: item.quantityType })), [quantityType]);
    const currencyOptions = useMemo(() => currency.map(item => ({ value: item.id, label: item.currencyName })), [currency]);

    
    // ⭐ EFFECT 1: Set Rate and UOM ID in resourceData state (DATA POPULATION)
    // Triggers ONLY when selectedResource changes.
    useEffect(() => {
        setResourceDefaultValues(selectedResource);
        
        // After setting the defaults, trigger a calculation update in the next cycle
        // to ensure all cost fields (which depend on rate) are current.
        // This is a more explicit way to guarantee the calculation reflects the new rate.
        if(selectedResource) {
            // We use a timeout to ensure the state update from setResourceDefaultValues has settled
            // This is a common pattern for linking asynchronous updates, although not ideal.
            // A better way is using a third effect, see below.
            const timeoutId = setTimeout(() => {
                handleCalculations({});
            }, 50); // Small delay to allow state update to batch
            
            return () => clearTimeout(timeoutId);
        }
        
    }, [selectedResource, setResourceDefaultValues, handleCalculations]); 
    // ⭐ END EFFECT 1 ⭐

    
    // ⭐ EFFECT 2: Set the UOM Select component display (VISUAL SYNCHRONIZATION)
    // Triggers when the resourceData.uomId state value changes OR when uomOptions load.
    useEffect(() => {
        const currentUomId = resourceData.uomId;
        
        // Only run if UOM options are loaded AND we have a valid UOM ID to search for
        if (uomOptions.length > 0 && currentUomId) {
            // Find the full option object needed for the Select component display
            const defaultUomOption = uomOptions.find(uom => String(uom.value) === String(currentUomId));
            
            // Set the state that controls the UOM Select's visual value
            if (defaultUomOption) {
                setSelectedUom(defaultUomOption);
                console.log("--- EFFECT 2: UOM Display Updated ---");
                console.log("Found UOM Label:", defaultUomOption.label);
            } else {
                 // Important: If the ID exists but the option isn't found (e.g., UOM data lagging), do NOT clear it yet.
                 // But typically, this means the UOM data is stale or the ID is bad.
                 // For now, let's keep it simple: if the ID is present, we try to find the option.
                 setSelectedUom(null);
            }
        } else if (!currentUomId) {
            // Clear the visual UOM selection if the ID is empty (like on reset)
            setSelectedUom(null);
        }
    }, [uomOptions, resourceData.uomId]);
    // ⭐ END EFFECT 2 (THE FIX) ⭐


    const handleBack = () => navigate(-1);

    const handleAddResource = () => {
        // Ensure one final calculation before submission to reflect the new rate/UOM
        handleCalculations({}); 
        
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
        // ... (Styles unchanged)
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
        // ... (Container component unchanged)
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
                    <span style={{ fontSize: '0.9rem' }}>Total Quantity <strong>{boqTotalQuantity.toFixed(2)}</strong></span>
                </div>
            </div>

            <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select options={resourceTypeOptions} styles={customStyles} placeholder="Select Resource Type"className="w-100"classNamePrefix="select"
                                value={selectedResourceType}
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
                                placeholder="Select resource" className="w-100" classNamePrefix="select"
                                value={selectedResource}
                                onChange={(selected) => {
                                    // ONLY update the selectedResource state here
                                    setSelectedResource(selected); 
                                    // Default values and calculations are handled by useEffect
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
                                // This value is now controlled by the new setResourceDefaultValues function via resourceData.rate
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

            <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            UOM <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select
                                options={uomOptions}
                                value={selectedUom} // This value is controlled by Effect 2
                                styles={customStyles}
                                placeholder="Select UOM"
                                className="w-100"
                                classNamePrefix="select"
                                onChange={(selected) => {
                                    // When the user manually changes UOM, update both visual and data state
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

            <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
                <div className="row g-3">

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">
                            Wastage % <span style={{ color: "red" }}></span>
                        </label>
                        <input
                            type="number"
                            name="wastePercentage"
                            value={resourceData.wastePercentage}
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


            <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
                <div className="row g-4">
                    <div className="col-md-6">

                        <div className="mb-3">
                            <label className="form-label text-start w-100">Additional Rate</label>
                            <input
                                type="number"
                                name="additionalRate"
                                value={resourceData.additionalRate}
                                onChange={handleChange}
                                className="form-input w-100"
                                placeholder="0.00"
                                style={{ borderRadius: "0.5rem" }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Currency <span style={{ color: "red" }}></span></label>
                            <Select options={currencyOptions} styles={customStyles} placeholder="Select Currency" className="w-100" classNamePrefix="select"
                                value={selectedCurrency}
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
                                onChange={handleChange}
                                className="form-input w-100"
                                placeholder="1.00000"
                                style={{ borderRadius: "0.5rem"}}
                            />
                        </div>

                    </div>

                </div>
            </FormSectionContainer>


            <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
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