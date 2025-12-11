import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react'; 

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";
const grayDark = "#333"; // Using dark gray for the Attachments header

/**
 * Helper component to display a single key-value pair in a 3-column layout.
 */
const DetailItem = ({ label, value }) => {
    const displayValue = value ? value : '\u00A0';
    return (
        // Occupies 1/4 of the total content width (1/3 of the col-lg-8 data section)
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

                    {/* === START MAIN GRID LAYOUT (Total of 12 columns) === */}
                    <div className="row mt-4">

                        {/* ROW 1 (Visual) - Headers and Data */}
                        
                        {/* 1. Basic Information Header (4 columns wide) */}
                        <div className="col-lg-3 col-md-12 col-sm-12"> {/* Using col-lg-3 for better field spacing (4 fields wide) */}
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>
                        
                        {/* 2. Entity Code (3 columns wide) */}
                        <DetailItem label="Entity Code" value={entityCode} />
                        
                        {/* 3. Entity Name (3 columns wide) */}
                        <DetailItem label="Entity Name" value={entityName} />
                        
                        {/* 4. Effective Date (3 columns wide) */}
                        <DetailItem label="Effective Date" value={effectiveDate} />
                        

                        {/* ROW 2 (Visual) - Attachments Header and Data */}
                        
                        {/* 5. Empty Column (4 columns wide) - Placeholder under 'Basic Information' */}
                        {/* This pushes the rest of the content to the right. */}
                        <div className="col-lg-3 col-md-12 col-sm-12">
                            {/* Empty space to align the next header */}
                        </div>

                        {/* 6. Attachments Header (3 columns wide) - ALIGNED BELOW ENTITY CODE */}
                        <div className="col-lg-3 col-md-12 col-sm-12"> 
                            {/* Color changed to grey/dark, as requested */}
                            <h5 className="fw-bold mb-1" style={{ color: grayDark }}>Attachments (Certificates/Licenses)</h5>
                            <div className="mb-3"></div> {/* Spacing for alignment */}
                        </div>
                        
                        {/* 7. Entity Type (3 columns wide) - ALIGNED BELOW ENTITY NAME */}
                        <DetailItem label="Entity Type" value={entityType} />
                        
                        {/* 8. Nature of Business (3 columns wide) - ALIGNED BELOW EFFECTIVE DATE */}
                        <DetailItem label="Nature of Business" value={natureOfBusiness} />

                        {/* 9. Grade (3 columns wide) - This field will wrap to the next line or cause misalignment if we follow the image exactly.
                           Based on your images, Grade is usually the third column, so we'll adjust the layout above.
                           We'll place Grade here, and handle the file list separately below the grid.
                        */}
                        <DetailItem label="Grade" value={grade} />
                        
                        
                    </div>
                    {/* === END MAIN GRID LAYOUT === */}

                    {/* --- ATTACHMENT FILE LIST --- */}
                    {/* This list is placed below the main grid and must be horizontally indented 
                        to align with the 'Attachments' header from the grid above. */}
                    <div className="row mt-3">
                         {/* Empty space to align file list with the header position (4 columns + 3 columns) */}
                         <div className="col-lg-3"></div> 
                         <div className="col-lg-9">
                            {hasAttachments ? (
                                displayAttachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center p-3 rounded mb-2"
                                        style={{ border: '1px solid #f0f0f0' }}
                                    >
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
                                <p className="text-muted ms-1">No attachments uploaded.</p>
                            )}
                         </div>
                    </div>
                    
                    
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