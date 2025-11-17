import React, { useState } from "react";
// Import icons for the back arrow and the BOQ summary document
import { ArrowLeft, BookOpenText } from "lucide-react"; 
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// NOTE: You would typically import axios here for submission

function AddResource() {
    const navigate = useNavigate();
    const { projectId, boqId } = useParams(); // Using useParams for context
    
    // --- State Management Placeholders ---
    const [resourceType, setResourceType] = useState("");
    const [rate, setRate] = useState("");
    // ... add states for other fields (nature, resourceName, uom, coefficient, etc.)
    
    // --- Constant Styles and Data ---
    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';

    // In a real app, these would come from an API call (see previous response logic)
    const boqUOM = "CUM"; 
    const boqTotalQuantity = "3922.494"; 

    const handleBack = () => {
        navigate(-1); 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // **API Submission Logic would go here**
        toast.success("New Resource added successfully!");
        // navigate(`/tenderestimation/${projectId}/resourceadding/${boqId}`);
    };

    // Helper component for collapsible sections
    const FormSection = ({ title, icon, children, defaultOpen = false }) => (
        <div className="mb-4">
            <details open={defaultOpen}>
                <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
                    {icon}
                    <span className="ms-2 text-primary">{title}</span>
                </summary>
                <div className="row g-3 mt-2 px-3">
                    {children}
                </div>
            </details>
            <hr className="my-3" />
        </div>
    );

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
                    // Gradient for the dark-to-light blue transition
                    background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, 
                    // Explicit border radius for the top-rounded, bottom-flat shape
                    borderRadius: '0.5rem 0.5rem 0 0', 
                }} 
            >
                {/* Left Side: Icon and Title */}
                <div className="d-flex align-items-center">
                    <BookOpenText size={20} className="me-2" /> 
                    <span>BOQ Summary</span>
                </div>
                
                {/* Right Side: UOM and Quantity Data */}
                <div className="d-flex">
                    <span className="me-3">Unit of Measurement <strong>{boqUOM}</strong></span> 
                    <span>Total Quantity <strong>{boqTotalQuantity}</strong></span>
                </div>
            </div>

            {/* Main Form Content Container - White Box */}
            <form onSubmit={handleSubmit}>
                <div 
                    className="bg-white ms-3 me-3 p-4 border border-top-0" 
                    style={{ 
                        borderColor: '#dee2e6', 
                        maxWidth: '98%', 
                        borderRadius: '0 0 0.5rem 0.5rem',
                        border: '1px solid #dee2e6', // Border for the white box
                        borderTop: 'none' // Remove top border as it meets the blue bar
                    }}
                >
                    
                    {/* Basic Information Section (Open by Default) */}
                    <FormSection title="Basic Information" icon={<span style={{ fontSize: '1.2em' }}>•</span>} defaultOpen>
                        <div className="col-md-6">
                            <label htmlFor="resourceType" className="form-label text-start d-block">Resource Type <span className="text-danger">*</span></label>
                            <select 
                                id="resourceType" 
                                className="form-select" 
                                style={{ borderRadius: '0.5rem' }} // Rounded shape
                                value={resourceType} 
                                onChange={(e) => setResourceType(e.target.value)} 
                                required
                            >
                                <option value="">Labor</option>
                                {/* Add more options */}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nature" className="form-label text-start d-block">Nature <span className="text-danger">*</span></label>
                            <select id="nature" className="form-select" style={{ borderRadius: '0.5rem' }} required>
                                <option value="">Simple</option>
                                {/* Add more options */}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="resourceName" className="form-label text-start d-block">Resource Name <span className="text-danger">*</span></label>
                            <select id="resourceName" className="form-select" style={{ borderRadius: '0.5rem' }} required>
                                <option value="">Select resource</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="rate" className="form-label text-start d-block">Rate <span className="text-danger">*</span></label>
                            <input 
                                type="number" 
                                id="rate" 
                                className="form-control" 
                                style={{ borderRadius: '0.5rem' }} // Rounded shape
                                placeholder="0.00" 
                                value={rate} 
                                onChange={(e) => setRate(e.target.value)} 
                                required 
                            />
                        </div>
                    </FormSection>

                    {/* Quantity & Measurements Section (Open by Default) */}
                    <FormSection title="Quantity & Measurements" icon={<span style={{ fontSize: '1.2em' }}>•</span>} defaultOpen>
                        <div className="col-md-6">
                            <label htmlFor="uom" className="form-label text-start d-block">UOM <span className="text-danger">*</span></label>
                            <select id="uom" className="form-select" style={{ borderRadius: '0.5rem' }} required>
                                <option value="">kg</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="quantityType" className="form-label text-start d-block">Quantity Type <span className="text-danger">*</span></label>
                            <select id="quantityType" className="form-select" style={{ borderRadius: '0.5rem' }} required>
                                <option value="">Coefficient</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="coefficient" className="form-label text-start d-block">Coefficient <span className="text-danger">*</span></label>
                            <input type="number" id="coefficient" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" required />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="calculatedQuantity" className="form-label text-start d-block">Calculated Quantity <span className="text-danger">*</span></label>
                            <input type="text" id="calculatedQuantity" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" readOnly />
                        </div>
                    </FormSection>

                    {/* Wastage & Net Quantity Section (Collapsed) */}
                    <FormSection title="Wastage & Net Quantity" icon={<span style={{ fontSize: '1.2em' }}>•</span>}>
                        {/* Add form fields here */}
                        <p className="text-muted">Fields for Wastage and Net Quantity...</p>
                    </FormSection>

                    {/* Pricing & Currency Section (Collapsed) */}
                    <FormSection title="Pricing & Currency" icon={<span style={{ fontSize: '1.2em' }}>•</span>}>
                        {/* Add form fields here */}
                        <p className="text-muted">Fields for Pricing and Currency...</p>
                    </FormSection>
                    
                    {/* Cost Summary Section */}
                    <div className="mb-4">
                        <details open>
                             <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
                                <span style={{ fontSize: '1.2em' }}>•</span>
                                <span className="ms-2 text-primary">Cost Summary</span>
                            </summary>
                            <div className="d-flex justify-content-end align-items-center mt-2 px-3">
                                <span className="me-2">Rate Lock</span>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
                                </div>
                            </div>
                            <div className="row g-3 mt-2 text-center px-3">
                                {/* Cost boxes replicated */}
                                <div className="col-md-4">
                                    <div className="p-3 border rounded text-dark">
                                        <div className="text-muted">Cost Unit Rate</div>
                                        <div className="fw-bold">0.00</div>
                                        <small className="text-muted">per CUM</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded text-dark" style={{ backgroundColor: '#e9f5ff' }}>
                                        <div className="text-muted">Cost Unit Rate</div>
                                        <div className="fw-bold">0.00</div>
                                        <small className="text-muted">per CUM</small>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 border rounded text-dark" style={{ backgroundColor: '#e6ffe6' }}>
                                        <div className="text-muted">Cost Unit Rate</div>
                                        <div className="fw-bold">0.00</div>
                                        <small className="text-muted">per CUM</small>
                                    </div>
                                </div>
                            </div>
                        </details>
                        <hr className="my-3" />
                    </div>

                    
                    {/* Action Buttons at the bottom - Dark Blue Button */}
                    <div className="d-flex justify-content-end">
                        <button 
                            type="submit"
                            className="btn" 
                            style={{ 
                                backgroundColor: darkBlue, 
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1.5rem',
                                borderRadius: '0.5rem' // Rounded button edges
                            }}
                        >
                            Add Resource
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}

export default AddResource;