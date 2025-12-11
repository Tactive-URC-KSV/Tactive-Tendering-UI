import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 
// import '../CSS/Styles.css'; // Ensure your CSS is imported

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";

// Helper component to display a single key-value pair.
const DetailItem = ({ label, value }) => {
    // Determine the value to display: 
    // Use the actual value if present, otherwise use a non-breaking space for layout consistency.
    const displayValue = value ? value : '\u00A0'; 

    return (
        // Each detail takes up 1/3 of the row space (col-4)
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                {/* Detail Label - slightly muted */}
                <p className="detail-label mb-1 text-muted fw-normal fs-6">{label}</p>
                {/* Detail Value - bold if present, otherwise regular font */}
                <p className={`detail-value ${value ? 'fw-bold' : ''}`} style={{ fontSize: '0.9rem', color: '#333' }}>
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
        attachments = [], // Default to an empty array
    } = formData;

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* Header: New Contractor & Back Arrow */}
            <div className="d-flex align-items-center py-3 px-4 mb-4" style={{ backgroundColor: 'white' }}>
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">
                
                {/* Review & Submit Card Header (Top Section) */}
                <div className="card text-start border-0 shadow-sm mb-4" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark">Review & Submit</h4>
                    </div>
                    <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                </div>
                
                {/* === START: MAIN REVIEW CONTENT (Basic Info & Attachments) === */}
                <div className="review-content-box bg-white p-4 mb-4 shadow-sm" style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}>
                    
                    {/* Use a ROW to hold the "Basic Information" header and the data fields side-by-side */}
                    <div className="row">
                        
                        {/* 1. Basic Information Header Block (Takes up 1/3 of the row space) */}
                        {/* This column is crucial to shifting the data to the right */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        {/* 2. Basic Information Details (Takes up 2/3 of the row space) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            {/* Inner Row to lay out the data fields */}
                            <div className="row">
                                {/* The first data row starts here, adjacent to the header block */}
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>
                            
                            {/* Second data row */}
                            <div className="row">
                                <DetailItem label="Entity Type" value={entityType} />
                                <DetailItem label="Nature of Business" value={natureOfBusiness} />
                                <DetailItem label="Grade" value={grade} />
                            </div>
                        </div>
                    </div>
                    {/* === END: BASIC INFORMATION SECTION === */}
                    
                    <hr className="my-4" style={{ borderColor: '#f0f0f0' }} />

                    {/* === START: ATTACHMENTS SECTION === */}
                    <div className="attachments-section">
                        <div className="mb-4">
                            <h5 className="fw-bold" style={{ color: bluePrimary }}>Attachments (Certificates/Licenses)</h5>
                        </div>

                        {/* Rendering attachments or a placeholder */}
                        {attachments.length > 0 ? (
                            attachments.map((file, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ border: '1px solid #f0f0f0' }}>
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

                </div>
                {/* === END: MAIN REVIEW CONTENT === */}


                {/* Action Buttons: Edit and Submit */}
                <div className="d-flex justify-content-end mt-4">
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
                <div className="mb-5"></div>
            </div>
        </div>
    );
}

export default ContractorReview;