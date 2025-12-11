import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";

/**
 * Helper component to display a single label/value pair, occupying 1/4 of the row.
 */
const DetailItem = ({ label, value, isHeader = false }) => {
    const displayValue = value ? value : '\u00A0';
    
    // Determine the content based on whether it's a field or a descriptive header
    let content;
    if (isHeader) {
        content = (
            <>
                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>{label}</h5>
                {/* Only include this paragraph for the 'Basic Information' header */}
                {label === "Basic Information" && <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>}
            </>
        );
    } else {
        content = (
            <>
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
            </>
        );
    }

    return (
        // Each item occupies 1/4 of the total content width (col-lg-3)
        <div className={`col-lg-3 col-md-6 col-sm-12 mb-4 ${isHeader ? 'text-start' : ''}`}>
            {content}
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
    const displayAttachments = hasAttachments ? attachments : []; 

    return (
        <div className="container-fluid min-vh-100 p-0">

            {/* HEADER */}
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">

                <div
                    className="bg-white p-4 mb-4 shadow-sm"
                    style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}
                >

                    {/* SECTION: Review */}
                    <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                        <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                    </div>

                    {/* === START MAIN 4-COLUMN GRID LAYOUT (Visual Rows 1 & 2) === */}
                    <div className="row mt-4">

                        {/* Visual Row 1: Basic Info Header and First 3 Fields */}
                        
                        {/* 1. Basic Information Header (Col 1) - Blue */}
                        <DetailItem label="Basic Information" isHeader={true} />
                        
                        {/* 2. Entity Code (Col 2) */}
                        <DetailItem label="Entity Code" value={entityCode} />
                        
                        {/* 3. Entity Name (Col 3) */}
                        <DetailItem label="Entity Name" value={entityName} />
                        
                        {/* 4. Effective Date (Col 4) */}
                        <DetailItem label="Effective Date" value={effectiveDate} />
                        
                        
                        {/* Visual Row 2: Attachments Header and Last 3 Fields */}
                        
                        {/* 5. Attachments Header (Col 1) - Blue, aligned under Basic Info */}
                        <DetailItem label="Attachments (Certificates/Licenses)" isHeader={true} />
                        
                        {/* 6. Entity Type (Col 2) - Aligned under Entity Code */}
                        <DetailItem label="Entity Type" value={entityType} />
                        
                        {/* 7. Nature of Business (Col 3) - Aligned under Entity Name */}
                        <DetailItem label="Nature of Business" value={natureOfBusiness} />
                        
                        {/* 8. Grade (Col 4) - Aligned under Effective Date */}
                        <DetailItem label="Grade" value={grade} />
                        
                    </div>
                    {/* === END MAIN 4-COLUMN GRID LAYOUT === */}

                    {/* --- ATTACHMENT FILE LIST (Full Width Below Grid) --- */}
                    <div className="attachment-file-list mt-3">
                        {displayAttachments.length > 0 ? (
                            displayAttachments.map((file, index) => (
                                <div
                                    key={index}
                                    className="d-flex justify-content-between align-items-center p-3 rounded mb-2"
                                    style={{ border: '1px solid #f0f0f0' }}
                                >
                                    <div className="d-flex align-items-center">
                                        {/* Icon is red/dark, as seen in images */}
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
                    {/* --- END ATTACHMENT FILE LIST --- */}


                    {/* BUTTONS */}
                    <div className="d-flex justify-content-end mt-5 pt-3 border-top" style={{ borderColor: '#f0f0f0' }}>
                        <button
                            type="button"
                            className="btn px-4 fw-bold"
                            onClick={handleGoBack}
                            style={{
                                borderRadius: "6px",
                                border: `1px solid ${bluePrimaryLight}`,
                                color: bluePrimaryLight,
                                backgroundColor: 'white'
                            }}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmitFinal}
                            className="btn px-4 fw-bold ms-3"
                            style={{
                                backgroundColor: bluePrimaryLight,
                                color: "white",
                                borderRadius: "6px",
                                border: 'none'
                            }}
                        >
                            Submit
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default ContractorReview;