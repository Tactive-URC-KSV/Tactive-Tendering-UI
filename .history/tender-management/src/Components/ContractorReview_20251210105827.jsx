import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 
// NOTE: Ensure your global CSS (including Bootstrap) is correctly linked in your project.

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";

// Helper component to display a single key-value pair, ensuring height is maintained when empty.
const DetailItem = ({ label, value }) => {
    // If value is missing/empty, use a non-breaking space to preserve the height of the line.
    const displayValue = value ? value : '\u00A0'; 

    return (
        // mb-4 provides vertical separation between the two rows of fields
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                <p className="detail-label mb-1 text-muted fw-normal fs-6">{label}</p>
                {/* Apply height property or padding/margin to ensure consistent line spacing */}
                <p 
                    className={`detail-value ${value ? 'fw-bold' : ''}`} 
                    style={{ 
                        fontSize: '0.9rem', 
                        color: value ? '#333' : 'transparent', // Make text transparent if empty
                        minHeight: '1.2em' // Ensure the paragraph has a minimal height
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
    // Retrieve formData, which will be empty {} if no data was passed from the previous step.
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
        attachments = [], // Should be an array of file objects
    } = formData;

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
                    
                    {/* 2. Basic Information Section (Row structure for shifting data) */}
                    {/* The mb-5 here adds space below the entire data block before the HR/Attachments */}
                    <div className="row mt-4 mb-5">
                        
                        {/* A. Basic Information Header Block (Aligns to the far left - col-4) */}
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        {/* B. Basic Information Details (The actual data, shifted to the right - col-8) */}
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

                    {/* 3. Attachments Section (Aligned to the far left of the main container) */}
                    <div className="attachments-section mt-5">
                        <div className="mb-4">
                            <h5 className="fw-bold" style={{ color: bluePrimary }}>Attachments (Certificates/Licenses)</h5>
                        </div>

                        {attachments.length > 0 ? (
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