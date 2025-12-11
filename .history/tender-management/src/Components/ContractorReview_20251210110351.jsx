import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 
// NOTE: Ensure your global CSS (including Bootstrap) is correctly linked in your project.

const bluePrimary = "#005197"; // Matches the color of the titles in the images
const bluePrimaryLight = "#005197CC"; // Used for button colors

/**
 * Helper component to display a single key-value pair in a 3-column layout.
 * Ensures vertical height is maintained even when the value is empty.
 */
const DetailItem = ({ label, value }) => {
    // Use non-breaking space if value is missing/empty to preserve line height.
    const displayValue = value ? value : '\u00A0'; 

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                {/* Label styling */}
                <p className="detail-label mb-1 text-muted fw-normal fs-6">{label}</p>
                
                {/* Value styling: conditionally bold and transparent if empty */}
                <p 
                    className={`detail-value ${value ? 'fw-bold' : ''}`} 
                    style={{ 
                        fontSize: '0.9rem', 
                        // Make text transparent if empty, but keep the non-breaking space height
                        color: value ? '#333' : 'transparent',
                        minHeight: '1.2em' 
                    }}
                >
                    {displayValue}
                </p>
            </div>
        </div>
    );
};

function ContractorReview() {
    const location = useLocation();
    // Safely retrieve formData from router state, defaulting to an empty object
    const formData = location.state?.formData || {}; 

    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1); // Used for back arrow and Edit button
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
        // Add your final submission logic here (e.g., API call)
    };

    // Destructure fields from formData
    const {
        entityCode,
        entityName,
        effectiveDate,
        entityType,
        natureOfBusiness,
        grade,
        // Using a mock array structure for attachments, if not provided
        attachments = [], 
    } = formData;

    // Mock data for display when filled (You should delete this in production and use real `attachments` array)
    // For demonstration, if entityCode is filled, we mock a file item as well.
    const displayAttachments = attachments.length > 0 ? attachments : (entityCode ? [{ name: 'business_license_2025.pdf', type: 'pdf', size: '4.2 MB' }] : []);


    return (
        <div className="container-fluid min-vh-100 p-0">
            
            {/* New Contractor Header (Free-floating, no container/background) */}
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">
                
                {/* === START: SINGLE MAIN REVIEW CONTAINER (The big white card) === */}
                <div 
                    className="main-review-container bg-white p-4 mb-4 shadow-sm" 
                    style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}
                >
                    
                    {/* 1. Review & Submit Header */}
                    <div className="header-section mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                        <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                    </div>
                    
                    {/* 2. Basic Information Section (Uses row structure for alignment) */}
                    <div className="row mt-4 mb-5">
                        
                        {/* A. Left Header Column (Basic Info Title) */}
                        {/* This column forces the data fields to the right */}
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        {/* B. Basic Information Details (The data fields, shifted right) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            {/* Inner Row 1 */}
                            <div className="row">
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>
                            
                            {/* Inner Row 2 */}
                            <div className="row">
                                <DetailItem label="Entity Type" value={entityType} />
                                <DetailItem label="Nature of Business" value={natureOfBusiness} />
                                <DetailItem label="Grade" value={grade} />
                            </div>
                        </div>
                    </div>
                    {/* === END: BASIC INFORMATION SECTION === */}
                    
                    <hr className="my-4" style={{ borderColor: '#f0f0f0' }} />

                    {/* 3. Attachments Section (Full Width List Format, aligned left) */}
                    <div className="attachments-section mt-5">
                        <div className="mb-4">
                            {/* Title is BLUE, matching all provided images */}
                            <h5 className="fw-bold" style={{ color: bluePrimary }}>Attachments (Certificates/Licenses)</h5>
                        </div>

                        {displayAttachments.length > 0 ? (
                            displayAttachments.map((file, index) => (
                                // This div is the single file item row (PDF icon, name, view button)
                                <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded" style={{ border: '1px solid #f0f0f0' }}>
                                    <div className="d-flex align-items-center">
                                        {/* File Icon */}
                                        <FileText size={20} className="me-2 text-danger" /> 
                                        <div>
                                            {/* File Name */}
                                            <p className="mb-0 fw-medium">{file.name}</p>
                                            {/* File Type and Size */}
                                            <small className="text-muted">{file.type} • {file.size}</small>
                                        </div>
                                    </div>
                                    {/* View Button */}
                                    <button className="btn btn-sm" style={{ color: bluePrimary }}>View</button>
                                </div>
                            ))
                        ) : (
                            // Empty state display for attachments
                            <p className="text-muted">No attachments uploaded.</p>
                        )}
                    </div>
                    {/* === END: ATTACHMENTS SECTION === */}
                    
                    
                    {/* 4. Action Buttons (Edit/Submit) */}
                    <div className="d-flex justify-content-end mt-5 pt-3 border-top" style={{ borderColor: '#f0f0f0' }}>
                        <button 
                            type="button" 
                            className="btn px-4 fw-bold" 
                            onClick={handleGoBack} 
                            style={{ borderRadius: "6px", border: `1px solid ${bluePrimaryLight}`, color:bluePrimaryLight, backgroundColor: 'white' }}
                        >
                            Edit
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmitFinal}
                            className="btn px-4 fw-bold ms-3" 
                            style={{ backgroundColor: bluePrimaryLight, color: "white", borderRadius: "6px", border: 'none'}}
                        >
                            Submit
                        </button>
                    </div>

                </div>
                {/* === END: SINGLE MAIN REVIEW CONTAINER === */}
                
                <div className="mb-5"></div>
            </div>
        </div>
    );
}

export default ContractorReview;