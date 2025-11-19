import React, { useState, useEffect, useCallback, useMemo } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUom } from "../Context/UomContext";

// Define handleUnauthorized (Needed to prevent crashes from catch blocks)
// In a real app, this should clear the token and navigate to login.
const handleUnauthorized = () => {
    sessionStorage.removeItem('token');
    // window.location.href = '/login'; // Example: Forced redirect to login
    toast.error("Session expired or unauthorized. Please log in again.");
};


function AddResource() {
    const navigate = useNavigate();

    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 
    
    // --- MOCK DATA FOR BOQ AND COST CODE ---
    // These must be replaced with actual data fetched from a context or props in a real application.
    const boqUOM = "CUM"; 
    const boqTotalQuantity = 1000; 
    const costCode = useMemo(() => ({ 
        quantity: boqTotalQuantity, 
        uom: boqUOM, 
        // Assume all other BOQ/Project IDs are available here
        boqId: "MOCK_BOQ_ID_123",
        projectId: "MOCK_PROJECT_ID_456"
    }), []); 
    // --- END MOCK DATA ---

    // EXISTING STATES (Kept as is)
    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [quantityType, setQuantityType] = useState([]); 
    const [currency, setCurrency] = useState([]);
    const [selectedUom, setSelectedUom] = useState(null);

    // --- NEW STATE FOR FORM INPUTS AND PAYLOAD (based on your payload structure) ---
    const [resourceData, setResourceData] = useState({
        // Form Inputs (bound to UI elements)
        coEfficient: 1, 
        wastePercentage: 0,
        rate: 0,
        additionalRate: 0,
        shippingPrice: 0,
        exchangeRate: 1,
        rateLock: false,
        docNumber: "",

        // IDs (derived from dropdown selections)
        resourceTypeId: "",
        quantityTypeId: "",
        resourceNatureId: "",
        uomId: "",
        currencyId: "",
        resourceId: "",
        
        // Calculated/Fixed values (will be calculated in useMemo)
        calculatedQuantity: 0,
        wasteQuantity: 0,
        netQuantity: 0,
        costUnitRate: 0,
        resourceTotalCost: 0,
        totalCostCompanyCurrency: 0,
        
        // Fixed IDs (Mocked for now)
        boqId: costCode.boqId,
        projectId: costCode.projectId,
    });
    // --- END NEW STATE ---


    // Helper function to handle changes in text/number inputs
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' 
            ? checked 
            : parseFloat(value) || 0;
        
        setResourceData(prev => ({ 
            ...prev, 
            [name]: newValue 
        }));
    };

    // Helper function for Select inputs
    const handleSelectChange = (name, selectedOption) => {
        setResourceData(prev => ({
            ...prev,
            [name]: selectedOption ? selectedOption.value : "",
        }));

        // Special handling for resource type to fetch resources
        if (name === 'resourceTypeId') {
            setSelectedResourceType(selectedOption);
            fetchResources(selectedOption?.value);
        }
        
        // Special handling for UOM to update the local state for the dropdown value
        if (name === 'uomId') {
            setSelectedUom(selectedOption);
        }
    };

    // --- CALCULATION LOGIC (Equivalent to your handleCalculations) ---
    const calculations = useMemo(() => {
        const data = resourceData;
        const coEfficient = parseFloat(data.coEfficient) || 1;
        const wastePercentage = parseFloat(data.wastePercentage) || 0;
        const rate = parseFloat(data.rate) || 0;
        const additionalRate = parseFloat(data.additionalRate) || 0;
        const shippingPrice = parseFloat(data.shippingPrice) || 0;
        const exchangeRate = parseFloat(data.exchangeRate) || 1;

        const costCodeQuantity = costCode.quantity || 0;

        // Calculated Quantity
        const calculatedQuantity = costCodeQuantity * coEfficient;

        // Waste Quantity and Net Quantity
        const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
        const netQuantity = calculatedQuantity + wasteQuantity;

        // Unit Rate (Rate + Additional Rate + Shipping/Net Quantity)
        const unitRate = netQuantity > 0 ? rate + additionalRate + (shippingPrice / netQuantity) : (rate + additionalRate + shippingPrice);
        
        // Total Cost Company Currency
        const totalCostCompanyCurrency = unitRate * netQuantity;
        
        // Resource Total Cost (Final Cost in Selected Currency)
        const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;
        
        // Final Cost Unit Rate (Cost Unit Rate * Exchange Rate)
        const finalCostUnitRate = unitRate * exchangeRate;

        // Update resourceData with calculated values
        setResourceData(prev => ({
            ...prev,
            calculatedQuantity: calculatedQuantity,
            wasteQuantity: wasteQuantity,
            netQuantity: netQuantity,
            costUnitRate: unitRate, 
            totalCostCompanyCurrency: totalCostCompanyCurrency,
            resourceTotalCost: resourceTotalCost,
            // finalCostUnitRate is for display but derived from costUnitRate * exchangeRate
        }));

        return {
            calculatedQuantity,
            wasteQuantity,
            netQuantity,
            costUnitRate: unitRate, // Base Cost Unit Rate
            totalCostCompanyCurrency: totalCostCompanyCurrency,
            resourceTotalCost: resourceTotalCost,
            finalCostUnitRate: finalCostUnitRate
        };
    }, [resourceData, costCode.quantity]);
    
    // --- End of Calculation Logic ---


    // --- API CALL FOR ADDING RESOURCE ---
    const handleAddResource = async () => {
        // Validation check (basic)
        if (!resourceData.resourceTypeId || !resourceData.resourceId || !resourceData.uomId) {
            toast.error("Please select Resource Type, Resource Name, and UOM.");
            return;
        }

        try {
            // Prepare the final payload (resourceData already contains all fields including calculated ones)
            const payload = {
                ...resourceData,
                // Ensure number fields are numbers, even if they were 0 or empty string
                coEfficient: parseFloat(resourceData.coEfficient) || 0,
                wastePercentage: parseFloat(resourceData.wastePercentage) || 0,
                rate: parseFloat(resourceData.rate) || 0,
                additionalRate: parseFloat(resourceData.additionalRate) || 0,
                shippingPrice: parseFloat(resourceData.shippingPrice) || 0,
                exchangeRate: parseFloat(resourceData.exchangeRate) || 1,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`, 
                payload, 
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Resource added successfully!");
                // Optionally, navigate back or clear the form
                navigate(-1);
            }

        } catch (err) {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            } else if (err?.response?.data) {
                toast.error(err.response.data); // Display backend validation/conflict message
            } else {
                toast.error('Failed to add resource.');
            }
        }
    };
    // --- END API CALL ---


    // Existing code for fetching data and memoizing options remains the same...
    const uomOptions = useMemo(() => 
    useUom().map(uom => ({ value: uom.id, label: uom.uomName })),
    [useUom()]
    );


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

    // Finding selected options for display
    const selectedResourceNature = resourceNatureOption.find(opt => opt.value === resourceData.resourceNatureId);
    const selectedResourceName = resourceOption.find(opt => opt.value === resourceData.resourceId);
    const selectedQuantityType = quantityTypeOption.find(opt => opt.value === resourceData.quantityTypeId);
    const selectedCurrency = currencyOptions.find(opt => opt.value === resourceData.currencyId);


    const resourceTypeOptions = useMemo(() => resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), [resourceTypes]);
    const resourceOption = useMemo(() => resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })), [resources]);
    const resourceNatureOption = useMemo(() => resourceNature.map(item => ({ value: item.id, label: item.nature })), [resourceNature]);
    const quantityTypeOption = useMemo(() => quantityType.map(item => ({ value: item.id, label: item.quantityType })), [quantityType]);
    const currencyOptions = useMemo(() => currency.map(item => ({ value: item.id, label: item.currencyName })), [currency]);

    const handleBack = () => navigate(-1);
    
    // ... customStyles and FormSectionContainer remain the same ...
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
                                className="w-100"
                                classNamePrefix="select"
                                // Bind to local state for fetching resources, update resourceData ID
                                value={selectedResourceType} 
                                onChange={(selected) => handleSelectChange('resourceTypeId', selected)}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Nature <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select 
                                options={resourceNatureOption} 
                                styles={customStyles} 
                                placeholder="Select Nature" 
                                className="w-100" 
                                classNamePrefix="select"
                                value={selectedResourceNature}
                                onChange={(selected) => handleSelectChange('resourceNatureId', selected)}
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
                                placeholder="Select resource"
                                className="w-100"
                                classNamePrefix="select"
                                value={selectedResourceName}
                                onChange={(selected) => handleSelectChange('resourceId', selected)}
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
                                style={{ borderRadius: '0.5rem' }} 
                                placeholder="0.00" 
                                className="form-input w-100"
                                name="rate" // Must match key in resourceData
                                value={resourceData.rate}
                                onChange={handleInputChange}
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
                                value={selectedUom} // Bind to selectedUom state
                                styles={customStyles} 
                                placeholder="Select UOM" 
                                className="w-100" 
                                classNamePrefix="select" 
                                onChange={(selected) => handleSelectChange('uomId', selected)} // Update resourceData.uomId and selectedUom
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Quantity Type <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select 
                                options={quantityTypeOption} 
                                styles={customStyles} 
                                placeholder="Select Quantity Type" 
                                className="w-100"
                                classNamePrefix="select"
                                value={selectedQuantityType}
                                onChange={(selected) => handleSelectChange('quantityTypeId', selected)}
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
                                style={{ borderRadius: '0.5rem' }} 
                                placeholder="0.00" 
                                className="form-input w-100" 
                                name="coEfficient"
                                value={resourceData.coEfficient}
                                onChange={handleInputChange}
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
                                style={{ borderRadius: '0.5rem', backgroundColor: '#e9ecef' }} 
                                placeholder="0.00" 
                                readOnly 
                                className="form-input w-100"
                                // Display calculated value from useMemo
                                value={calculations.calculatedQuantity.toFixed(4)} 
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
                            placeholder="0.00"
                            className="form-input w-100"
                            style={{ borderRadius: "0.5rem" }}
                            name="wastePercentage"
                            value={resourceData.wastePercentage}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">
                            Wastage Quantity
                        </label>
                        <input 
                            type="text" 
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem", backgroundColor: '#e9ecef' }}
                            readOnly
                            // Display calculated value from useMemo
                            value={calculations.wasteQuantity.toFixed(4)} 
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label text-start w-100">
                            Net Quantity
                        </label>
                        <input 
                            type="text" 
                            className="form-input w-100"
                            placeholder="0.00"
                            style={{ borderRadius: "0.5rem", backgroundColor: '#e9ecef' }}
                            readOnly
                            // Display calculated value from useMemo
                            value={calculations.netQuantity.toFixed(4)} 
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
                                className="form-input w-100" 
                                placeholder="0.00"
                                style={{ borderRadius: "0.5rem" }}
                                name="additionalRate"
                                value={resourceData.additionalRate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Currency <span style={{ color: "red" }}>*</span></label>
                            <Select 
                                options={currencyOptions} 
                                styles={customStyles} 
                                placeholder="Select Currency" 
                                className="w-100" 
                                classNamePrefix="select"
                                value={selectedCurrency}
                                onChange={(selected) => handleSelectChange('currencyId', selected)}
                            /> 
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Shipping / Freight Price (+ / -) </label>
                            <input 
                                type="number" 
                                className="form-input w-100" 
                                placeholder="0.00" 
                                style={{ borderRadius: "0.5rem" }}
                                name="shippingPrice"
                                value={resourceData.shippingPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label text-start w-100"> Exchange Rate </label>
                            <input 
                                type="number" 
                                className="form-input w-100" 
                                placeholder="1.00000" 
                                style={{ borderRadius: "0.5rem"}}
                                name="exchangeRate"
                                value={resourceData.exchangeRate}
                                onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row g-3 text-center">
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F9FAFB' }}>
                            <div className="text-muted">Cost Unit Rate (Base)</div>
                            <div className="fw-bold">{calculations.costUnitRate.toFixed(4)}</div>
                            <small className="text-muted">per {selectedUom?.label || boqUOM}</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#EFF6FF' }}>
                            <div className="text-muted">Cost Unit Rate (Final)</div>
                            <div className="fw-bold">{calculations.finalCostUnitRate.toFixed(4)}</div>
                            <small className="text-muted">per {selectedUom?.label || boqUOM}</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="text-muted">Total Resource Cost</div>
                            <div className="fw-bold">{calculations.resourceTotalCost.toFixed(2)}</div>
                            <small className="text-muted">({selectedCurrency?.label || 'Currency'})</small>
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