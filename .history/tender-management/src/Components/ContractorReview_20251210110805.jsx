import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 

const bluePrimary = "#005197"; 
const grayDark = "#333"; // Use dark gray for non-blue headers
const bluePrimaryLight = "#005197CC"; 

/**
 * Helper component to display a single key-value pair in a 3-column layout.
 */
const DetailItem = ({ label, value }) => {
    // Use non-breaking space if value is missing/empty to preserve line height.
    const displayValue = value ? value : '\u00A0'; 

    return (
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

    // We will use the main grid structure for the entire content display

    return (
        <div className="container-fluid min-vh-100 p-0">
            
            {/* New Contractor Header */}
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
                    
                    {/* 2. Full Content Grid (All content now flows through this single row) */}
                    <div className="row mt-4">

                        {/* --- ROW 1 ITEMS --- */}
                        
                        {/* A. Left Header Column: "Basic Information" */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        {/* B. Data Fields (Shifted Right) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>
                        </div>
                        
                        {/* --- ROW 2 ITEMS --- */}

                        {/* C. Data Field: Entity Type */}
                        <DetailItem label="Entity Type" value={entityType} />

                        {/* D. Data Field: Nature of Business */}
                        <DetailItem label="Nature of Business" value={natureOfBusiness} />
                        
                        {/* E. Data Field: Grade */}
                        <DetailItem label="Grade" value={grade} />

                        {/* --- ATTACHMENTS SECTION --- */}
                        
                        {/* F. Attachment Header: Takes up one column slot, acting as a label */}
                        {/* NOTE: This header is now gray, matching the request to remove blue */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mt-3 mb-3">
                            <h5 className="fw-bold mb-1" style={{ color: grayDark }}>Attachments (Certificates/Licenses)</h5>
                        </div>

                        {/* G. Attachment File Display: Takes up the remaining two column slots */}
                        {/* The file list starts directly below the Entity Type column, taking two columns. */}
                        <div className="col-lg-8 col-md-12 col-sm-12 mt-3 mb-3">
                            {hasAttachments ? (
                                attachments.map((file, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center p-3 rounded" style={{ border: '1px solid #f0f0f0' }}>
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

                    </div>
                    {/* === END: FULL CONTENT GRID === */}
                    
                    
                    {/* 3. Action Buttons (Edit/Submit) */}
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