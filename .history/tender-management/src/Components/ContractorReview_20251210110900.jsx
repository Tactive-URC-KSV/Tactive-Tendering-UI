import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";

/**
 * Helper component to display a single key-value pair in a 3-column layout.
 */
const DetailItem = ({ label, value }) => {
    // Use non-breaking space if value is missing/empty to preserve line height.
    const displayValue = value ? value : '\u00A0'; 

    return (
        // Each DetailItem occupies 1/3 of the right-hand side (col-4 inside col-8)
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                <p className="detail-label mb-1 text-muted fw-normal fs-6">{label}</p>
                
                <p 
                    className={`detail-value ${value ? 'fw-bold' : ''}`} 
                    style={{ 
                        fontSize: '0.9rem', 
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
    const formData = location.state?.formData || {}; 

    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1); 
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
    };

    const {
        entityCode,
        entityName,
        effectiveDate,
        entityType,
        natureOfBusiness,
        grade,
        attachments = [], 
    } = formData;

    const hasAttachments = attachments && attachments.length > 0;

    // Use attachment data from formData, or mock data for the filled state view
    const displayAttachments = hasAttachments ? attachments : []; 
    // If the data fields are filled, we can mock a file entry to show the full look:
    // This is optional but helps visualize the filled state:
    // const displayAttachments = hasAttachments ? attachments : (entityCode ? [{ name: 'business_license_2025.pdf', type: 'pdf', size: '4.2 MB' }] : []);


    return (
        <div className="container-fluid min-vh-100 p-0">
            
            {/* New Contractor Header (Free-floating) */}
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
                    
                    {/* 2. Basic Information & Attachment GRID */}
                    {/* This outer row contains BOTH the headers (col-4) and data (col-8) */}
                    <div className="row mt-4">

                        {/* --- LEFT COLUMN: HEADERS (Col-4) --- */}
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            
                            {/* A. Basic Information Header */}
                            <div className="mb-5"> 
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                            </div>

                            {/* C. Attachments Header (Aligned directly below Basic Info) */}
                            {/* The vertical positioning is achieved naturally because this is outside the data grid. */}
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Attachments (Certificates/Licenses)</h5>
                        </div>

                        {/* --- RIGHT COLUMN: DATA FIELDS (Col-8) --- */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            
                            {/* B. Data Fields: Entity Code / Name / Date (Visual Row 1) */}
                            <div className="row mb-4"> 
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>

                            {/* D. Data Fields: Entity Type / Nature / Grade (Visual Row 2) */}
                            {/* This second row is vertically aligned with the Attachments header on the left. */}
                            <div className="row"> 
                                <DetailItem label="Entity Type" value={entityType} />
                                <DetailItem label="Nature of Business" value={natureOfBusiness} />
                                <DetailItem label="Grade" value={grade} />
                            </div>
                        </div>

                    </div>
                    {/* === END: GRID STRUCTURE === */}
                    
                    {/* HR IS HERE, SEPARATING THE GRID FROM THE FILE LIST */}
                    <hr className="my-4" style={{ borderColor: '#f0f0f0' }} />

                    {/* 3. Attachment File List (Full Width, below the HR, matching the image) */}
                    {/* The content is placed below the main row, aligned to the left side of the container. */}
                    <div className="attachment-file-list mt-3 px-3">
                        {displayAttachments.length > 0 ? (
                            displayAttachments.map((file, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded mb-2" style={{ border: '1px solid #f0f0f0' }}>
                                    <div className="d-flex align-items-center">
                                        <FileText size={20} className="me-2 text-danger" /> 
                                        <div>
                                            <p className="mb-0 fw-medium">{file.name}</p>
                                            <small className="text-muted">{file.type} • {file.size}</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-sm" style={{ color: bluePrimary }}>View</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-muted">No attachments uploaded.</p>
                        )}
                    </div>
                    {/* === END: ATTACHMENT FILE LIST === */}
                    
                    
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