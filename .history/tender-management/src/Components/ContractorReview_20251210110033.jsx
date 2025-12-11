import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 
// NOTE: Ensure your global CSS (including Bootstrap) is correctly linked in your project.

// Note: Removed FileText import as attachment is now represented as text fields

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";

// Helper component to display a single key-value pair, ensuring height is maintained when empty.
const DetailItem = ({ label, value, isAttachment = false }) => {
    // If value is missing/empty, use a non-breaking space to preserve the height of the line.
    const displayValue = value ? value : '\u00A0'; 

    // Adjust style based on whether it's an attachment (which often doesn't need bolding)
    const fontWeightClass = value && !isAttachment ? 'fw-bold' : '';
    const textColor = value ? (isAttachment ? '#333' : '#333') : 'transparent'; // Keep the color consistent for attachment names

    return (
        // mb-4 provides vertical separation between rows
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                <p className="detail-label mb-1 text-muted fw-normal fs-6">{label}</p>
                <p 
                    className={`detail-value ${fontWeightClass}`} 
                    style={{ 
                        fontSize: '0.9rem', 
                        color: textColor,
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
        // Mocking a single attachment for demonstration in the field layout
        attachments = [{ name: 'business_license_2025.pdf', type: 'pdf', size: '4.2 MB' }], 
    } = formData;

    // Use the first attachment for display, assuming only one is needed for this layout.
    const firstAttachment = attachments[0] || {}; 

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
                    
                    {/* 2. Basic Information & Attachment Sections (Wrapped in a single row to handle alignment) */}
                    <div className="row mt-4">
                        
                        {/* A. Left Header Column (Basic Info Title) */}
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                            
                            {/* --- ATTACHMENT HEADER SECTION (No Blue Color) --- */}
                            {/* Positioned right below the Basic Info text */}
                            <h5 className="fw-bold mb-1 mt-5" style={{ color: '#333' }}>Attachments (Certificates/Licenses)</h5>
                        </div>

                        {/* B. Right Data Column (col-lg-8) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            
                            {/* --- Basic Information Fields --- */}
                            <div className="row">
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>
                            
                            <div className="row">
                                <DetailItem label="Entity Type" value={entityType} />
                                <DetailItem label="Nature of Business" value={natureOfBusiness} />
                                <DetailItem label="Grade" value={grade} />
                            </div>
                            
                            {/* --- Attachments Fields (Spaced vertically) --- */}
                            {/* Add empty space to push attachment fields down, mirroring the header spacing */}
                            <div className="my-5 pt-3"></div>

                            {/* Inner Row for Attachment Details */}
                            <div className="row">
                                {attachments.length > 0 ? (
                                    <>
                                        <DetailItem 
                                            label="File Name" 
                                            value={firstAttachment.name} 
                                            isAttachment={true} 
                                        />
                                        <DetailItem 
                                            label="File Type / Size" 
                                            value={`${firstAttachment.type} / ${firstAttachment.size}`} 
                                            isAttachment={true} 
                                        />
                                        <DetailItem 
                                            label="Action" 
                                            value="View" 
                                            isAttachment={true} 
                                        />
                                    </>
                                ) : (
                                    <p className="text-muted ms-3">No attachments uploaded.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* === END: BASIC INFORMATION & ATTACHMENTS SECTIONS === */}
                    
                    
                    {/* 3. Action Buttons (Edit/Submit) - Fixed to the bottom right of the card */}
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