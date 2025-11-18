import React, { useState, useEffect } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
    // Hooks and Navigation
    const navigate = useNavigate();
    
    // Theme Colors
    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 
    const primaryTextColor = '#007bff';
    
    // BOQ Data from Screenshot (Mocked)
    const boqUOM = "CUM"; 
    const boqTotalQuantity = "3922.494"; 
    const boqTotalQuantityAsNumber = parseFloat(boqTotalQuantity.replace(',', '')) || 0;

    // State for Form Fields
    const [resourceType, setResourceType] = useState({ value: 'labor', label: 'Labor' });
    const [nature, setNature] = useState({ value: 'simple', label: 'Simple' });
    const [uom, setUom] = useState({ value: 'kg', label: 'kg' });
    const [quantityType, setQuantityType] = useState({ value: 'coefficient', label: 'Coefficient' });
    const [rate, setRate] = useState(0.00);
    const [coefficient, setCoefficient] = useState(0.00);
    const [calculatedQuantity, setCalculatedQuantity] = useState('0.000'); // Note: Using 3 decimal places to match the BOQ total

    // Calculation Logic
    useEffect(() => {
        // Calculate the quantity: Base Quantity * Coefficient
        const coefficientValue = parseFloat(coefficient) || 0;
        const newCalculatedQuantity = boqTotalQuantityAsNumber * coefficientValue;
        
        // Format to match the number of decimals in the BOQ total
        setCalculatedQuantity(newCalculatedQuantity.toFixed(3)); 
    }, [coefficient, boqTotalQuantityAsNumber]);

    // Handlers
    const handleBack = () => {
        navigate(-1); 
    };

    // Options (from screenshot/standard setup)
    const resourceTypeOptions = [
        { value: 'labor', label: 'Labor' },
        { value: 'material', label: 'Material' },
        { value: 'equipment', label: 'Equipment' },
    ];
    
    const natureOptions = [
        { value: 'simple', label: 'Simple' },
        { value: 'complex', label: 'Complex' },
    ];
    
    const uomOptions = [
        { value: 'kg', label: 'kg' },
        { value: 'cum', label: 'CUM' },
        { value: 'sqm', label: 'SQM' },
    ];

    const quantityTypeOptions = [
        { value: 'coefficient', label: 'Coefficient' },
        { value: 'manual', label: 'Manual' },
    ];
    
    const resourceNameOptions = [{ value: '', label: 'Select resource' }]; 

    // Custom Styles for react-select (ensuring full width within the container)
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? darkBlue : provided.borderColor, 
            boxBoxShadow: state.isFocused ? `0 0 0 0.25rem rgba(0, 81, 151, 0.25)` : provided.boxShadow, 
            minHeight: '38px', 
            width: '100%', // Crucial for exact alignment
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#adb5bd', 
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#212529', 
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#000000', 
        }),
    };
    
    // Form Section Container Component
    const FormSectionContainer = ({ title, icon, defaultOpen = true, children }) => {
        // Basic Information, Quantity & Measurements, and Cost Summary are static (open by default, no collapse icon) in the screenshot
        const isStatic = ['Basic Information', 'Quantity & Measurements', 'Cost Summary'].includes(title);
        const [isOpen, setIsOpen] = useState(isStatic ? true : defaultOpen); // Force static sections open

        const headerStyle = {
            cursor: isStatic ? 'default' : 'pointer',
            listStyle: 'none',
            backgroundColor: containerBgColor,
            border: `1px solid ${containerBorderColor}`,
            borderRadius: '0.5rem',
            marginBottom: '1rem',
        };

        const contentStyle = { 
            padding: '1rem 1.5rem', 
            borderLeft: `1px solid ${containerBorderColor}`, 
            borderRight: `1px solid ${containerBorderColor}`, 
            borderBottom: `1px solid ${containerBorderColor}`, 
            borderRadius: '0 0 0.5rem 0.5rem',
            marginTop: '-1rem' 
        };

        const HeaderContent = (
            <div className="py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    {icon}
                    <span className="ms-2 fw-bold" style={{ fontSize: '1rem', color: primaryTextColor }}>{title}</span>
                </div>
                {!isStatic && <ChevronDown size={20} style={{ color: vibrantBlue, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />} 
            </div>
        );

        if (isStatic) {
            return (
                <div className="mb-4">
                    <div style={{ ...headerStyle, cursor: 'default' }}>{HeaderContent}</div>
                    <div style={contentStyle}>{children}</div>
                </div>
            );   
        }

        // Using <details> for collapsible sections
        return (
            <div className="mb-4">
                {/* Control the state for the ChevronDown icon */}
                <details open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
                    {/* The summary tag acts as the click area for the header */}
                    <summary style={headerStyle}>{HeaderContent}</summary>
                    <div style={contentStyle}>{children}</div>
                </details>
            </div>
        );
    };

    return (
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: '#f4f4f4' }}> 
            
            {/* Header: Add New Resource */}
            <div className="bg-white p-3 border-bottom mb-3">
                <div className="d-flex align-items-center fw-bold">
                    <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
                    <span className="ms-3">Add New Resource</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mx-3 mb-5">
                {/* BOQ Summary Header */}
                <div 
                    className="text-white p-3 d-flex justify-content-between align-items-center" 
                    style={{ 
                        background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, 
                        borderRadius: '0.5rem 0.5rem 0 0', 
                    }} 
                >
                    <div className="d-flex align-items-center">
                        <BookOpenText size={20} className="me-2" /> 
                        <span className="fw-bold">BOQ Summary</span>
                    </div>
                    <div className="d-flex">
                        <span className="me-3" style={{ fontSize: '0.9rem' }}>
                            Unit of Measurement <strong className="ms-1">{boqUOM}</strong>
                        </span> 
                        <span style={{ fontSize: '0.9rem' }}>
                            Total Quantity <strong className="ms-1">{boqTotalQuantity}</strong>
                        </span>
                    </div>
                </div>

                {/* Form Sections Container */}
                <div 
                    className="bg-white p-4" 
                    style={{ 
                        borderRadius: '0 0 0.5rem 0.5rem',
                        border: `1px solid ${containerBorderColor}`, 
                        borderTop: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                >
                    {/* Basic Information Section */}
                    <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>}>
                        <div className="row g-3">
                            {/* Resource Type */}
                            <div className="col-md-6">
                                <label className="form-label">Resource Type <span className="text-danger">*</span></label>
                                <div>
                                    <Select 
                                        options={resourceTypeOptions} 
                                        styles={customStyles} 
                                        placeholder=""
                                        value={resourceType}
                                        onChange={setResourceType}
                                    />
                                </div>
                            </div>
                            {/* Nature */}
                            <div className="col-md-6">
                                <label className="form-label">Nature <span className="text-danger">*</span></label>
                                <div>
                                    <Select 
                                        options={natureOptions} 
                                        styles={customStyles} 
                                        placeholder=""
                                        value={nature}
                                        onChange={setNature}
                                    />
                                </div>
                            </div>
                            {/* Resource Name */}
                            <div className="col-md-6">
                                <label className="form-label">Resource Name <span className="text-danger">*</span></label>
                                <div>
                                    <Select 
                                        options={resourceNameOptions} 
                                        styles={customStyles} 
                                        placeholder="Select resource"
                                    />
                                </div>
                            </div>
                            {/* Rate */}
                            <div className="col-md-6">
                                <label className="form-label">Rate <span className="text-danger">*</span></label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    style={{ borderRadius: '0.5rem' }} 
                                    placeholder="0.00" 
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                />
                            </div>
                        </div>
                    </FormSectionContainer>

                    {/* Quantity & Measurements Section */}
                    <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />}>
                        <div className="row g-3">
                            {/* UOM */}
                            <div className="col-md-6">
                                <label className="form-label">UOM <span className="text-danger">*</span></label>
                                <div>
                                    <Select 
                                        options={uomOptions} 
                                        styles={customStyles} 
                                        placeholder=""
                                        value={uom}
                                        onChange={setUom}
                                    />
                                </div>
                            </div>
                            {/* Quantity Type */}
                            <div className="col-md-6">
                                <label className="form-label">Quantity Type <span className="text-danger">*</span></label>
                                <div>
                                    <Select 
                                        options={quantityTypeOptions} 
                                        styles={customStyles} 
                                        placeholder=""
                                        value={quantityType}
                                        onChange={setQuantityType}
                                    />
                                </div>
                            </div>
                            {/* Coefficient */}
                            <div className="col-md-6">
                                <label className="form-label">Coefficient <span className="text-danger">*</span></label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    style={{ borderRadius: '0.5rem' }} 
                                    placeholder="0.00" 
                                    value={coefficient}
                                    onChange={(e) => setCoefficient(e.target.value)}
                                />
                            </div>
                            {/* Calculated Quantity */}
                            <div className="col-md-6">
                                <label className="form-label">Calculated Quantity <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    style={{ borderRadius: '0.5rem', backgroundColor: '#f8f9fa' }} 
                                    value={calculatedQuantity}
                                    readOnly 
                                />
                            </div>
                        </div>
                    </FormSectionContainer>

                    {/* Wastage & Net Quantity Section (Collapsible - empty content per request) */}
                    <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />} defaultOpen={false}>
                        {/* Content area is left empty as per the request to not include excess data */}
                    </FormSectionContainer>
                    
                    {/* Pricing & Currency Section (Collapsible - empty content per request) */}
                    <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />} defaultOpen={false}>
                        {/* Content area is left empty as per the request to not include excess data */}
                    </FormSectionContainer>
                    
                    {/* Cost Summary Section */}
                    <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                        <div className="d-flex justify-content-end align-items-center mb-3">
                            <span className="me-2">Rate Lock</span>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
                            </div>
                        </div>
                        <div className="row g-3 text-center">
                            {/* Cost Unit Rate 1 */}
                            <div className="col-md-4">
                                <div className="p-3 border rounded">
                                    <div className="text-muted">Cost Unit Rate</div>
                                    <div className="fw-bold">0.00</div>
                                    <small className="text-muted">per {boqUOM}</small>
                                </div>
                            </div>
                            {/* Cost Unit Rate 2 (Light Blue Background) */}
                            <div className="col-md-4">
                                <div className="p-3 border rounded" style={{ backgroundColor: '#e9f5ff' }}>
                                    <div className="text-muted">Cost Unit Rate</div>
                                    <div className="fw-bold">0.00</div>
                                    <small className="text-muted">per {boqUOM}</small>
                                </div>
                            </div>
                            {/* Cost Unit Rate 3 (Light Green Background) */}
                            <div className="col-md-4">
                                <div className="p-3 border rounded" style={{ backgroundColor: '#e6ffe6' }}>
                                    <div className="text-muted">Cost Unit Rate</div>
                                    <div className="fw-bold">0.00</div>
                                    <small className="text-muted">per {boqUOM}</small>
                                </div>
                            </div>
                        </div>
                    </FormSectionContainer>
                    
                    {/* Action Buttons */}
                    <div className="d-flex justify-content-end pt-3">
                        <button 
                            className="btn me-2" 
                            style={{ 
                                backgroundColor: darkBlue, // Match the dark blue button in the screenshot
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.5rem' 
                            }}
                        >
                            Start editing
                        </button>
                        <button 
                            className="btn" 
                            style={{ 
                                backgroundColor: vibrantBlue, // Match the vibrant blue button in the screenshot
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.5rem' 
                            }}
                        >
                            Add Resource
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AddResource;