import React from "react";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
    const navigate = useNavigate();
    
    // --- Constant Styles and Data ---
    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 

    // Placeholder data (matching the image)
    const boqUOM = "CUM"; 
    const boqTotalQuantity = "3922.494"; 

    const handleBack = () => {
        navigate(-1); 
    };

    // Reusable component for the styled vertical containers
    const FormSectionContainer = ({ title, icon, defaultOpen = false, children }) => {
        // Sections 1, 2, and 5 are static (no arrow, always open)
        const isStatic = ['Basic Information', 'Quantity & Measurements', 'Cost Summary'].includes(title);
        
        // Style for the header background and border
        const headerStyle = {
            cursor: isStatic ? 'default' : 'pointer',
            listStyle: 'none',
            backgroundColor: containerBgColor,
            border: `1px solid ${containerBorderColor}`,
            borderRadius: '0.5rem',
            marginBottom: '1rem',
        };

        // Style for the content area
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
                {/* Title and Icon on the Left */}
                <div className="d-flex align-items-center">
                    {icon}
                    <span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span>
                </div>
                
                {/* Dropdown Arrow on the Right (Only for collapsible sections) */}
                {!isStatic && <ChevronDown size={20} className="text-secondary" />}
            </div>
        );

        if (isStatic) {
            // Render as a simple div structure (always expanded)
            return (
                <div className="mb-4">
                    <div style={headerStyle}>
                        {HeaderContent}
                    </div>
                    {/* For static sections, the content area is always visible */}
                    <div style={contentStyle}>
                        {children}
                    </div>
                </div>
            );
        }

        // Render as collapsible <details> (for sections 3 and 4)
        return (
            <div className="mb-4">
                <details open={defaultOpen}>
                    <summary style={headerStyle}>
                        {HeaderContent}
                    </summary>
                    {/* For collapsible sections, the content is inside the details element */}
                    <div style={contentStyle}>
                        {children}
                    </div>
                </details>
            </div>
        );
    };

    return (
        <div className="container-fluid min-vh-100">
            
            {/* Page Header (Back Arrow and Title) */}
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">Add New Resource</span>
                </div>
            </div>

            {/* BOQ Summary Header - Exact Gradient and Shape */}
            <div 
                className="text-white p-3 d-flex justify-content-between align-items-center mx-3" 
                style={{ 
                    maxWidth: '98%', 
                    background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, 
                    borderRadius: '0.5rem 0.5rem 0 0', 
                }} 
            >
                <div className="d-flex align-items-center">
                    <BookOpenText size={20} className="me-2" /> 
                    <span>BOQ Summary</span>
                </div>
                <div className="d-flex">
                    <span className="me-3" style={{ fontSize: '0.9rem' }}>
                        Unit of Measurement <strong>{boqUOM}</strong>
                    </span> 
                    <span style={{ fontSize: '0.9rem' }}>
                        Total Quantity <strong>{boqTotalQuantity}</strong>
                    </span>
                </div>
            </div>

            {/* Main Form Content Container - White Box */}
            <div 
                className="bg-white ms-3 me-3 p-4" 
                style={{ 
                    maxWidth: '98%', 
                    borderRadius: '0 0 0.5rem 0.5rem',
                    border: `1px solid ${containerBorderColor}`, 
                    borderTop: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}
            >
                {/* --- 1. Basic Information (STATIC - OPEN) --- */}
                <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>}>
                    {/* Placeholder for actual form fields - Rounded Inputs */}
                    <div className="row g-3">
                        <div className="col-md-6"><label className="form-label">Resource Type</label><select className="form-select" style={{ borderRadius: '0.5rem' }}><option></option></select></div>
                        <div className="col-md-6"><label className="form-label">Nature</label><select className="form-select" style={{ borderRadius: '0.5rem' }}><option></option></select></div>
                        <div className="col-md-6"><label className="form-label">Resource Name</label><select className="form-select" style={{ borderRadius: '0.5rem' }}><option></option></select></div>
                        <div className="col-md-6"><label className="form-label">Rate</label><input type="number" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" /></div>
                    </div>
                </FormSectionContainer>

                {/* --- 2. Quantity & Measurements (STATIC - OPEN) --- */}
                <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />}>
                    {/* Placeholder for actual form fields - Rounded Inputs */}
                    <div className="row g-3">
                        <div className="col-md-6"><label className="form-label">UOM</label><select className="form-select" style={{ borderRadius: '0.5rem' }}><option></option></select></div>
                        <div className="col-md-6"><label className="form-label">Quantity Type</label><select className="form-select" style={{ borderRadius: '0.5rem' }}><option></option></select></div>
                        <div className="col-md-6"><label className="form-label">Coefficient</label><input type="number" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" /></div>
                        <div className="col-md-6"><label className="form-label">Calculated Quantity</label><input type="text" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" readOnly /></div>
                    </div>
                </FormSectionContainer>

                {/* --- 3. Wastage & Net Quantity (COLLAPSIBLE - CLOSED) --- */}
                <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
                    <p className="text-muted">Fields for Wastage and Net Quantity will go here...</p>
                </FormSectionContainer>

                {/* --- 4. Pricing & Currency (COLLAPSIBLE - CLOSED) --- */}
                <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
                    <p className="text-muted">Fields for Pricing and Currency will go here...</p>
                </FormSectionContainer>

                {/* --- 5. Cost Summary (STATIC - OPEN) --- */}
                <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                    {/* Cost Summary content structure - Placeholder data */}
                    <div className="d-flex justify-content-end align-items-center mb-3">
                        <span className="me-2">Rate Lock</span>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
                        </div>
                    </div>
                    <div className="row g-3 text-center">
                        <div className="col-md-4"><div className="p-3 border rounded"><div className="text-muted">Cost Unit Rate</div><div className="fw-bold">0.00</div><small className="text-muted">per CUM</small></div></div>
                        <div className="col-md-4"><div className="p-3 border rounded" style={{ backgroundColor: '#e9f5ff' }}><div className="text-muted">Cost Unit Rate</div><div className="fw-bold">0.00</div><small className="text-muted">per CUM</small></div></div>
                        <div className="col-md-4"><div className="p-3 border rounded" style={{ backgroundColor: '#e6ffe6' }}><div className="text-muted">Cost Unit Rate</div><div className="fw-bold">0.00</div><small className="text-muted">per CUM</small></div></div>
                    </div>
                </FormSectionContainer>

                {/* Action Button (Add Resource) - Dark Blue */}
                <div className="d-flex justify-content-end pt-3">
                    <button 
                        className="btn" 
                        style={{ 
                            backgroundColor: darkBlue, 
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
    );
}

export default AddResource;