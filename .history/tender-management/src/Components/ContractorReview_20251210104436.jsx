import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download } from 'lucide-react'; // Added FileText and Download icons for attachments (optional)
// import '../CSS/Styles.css'; // Make sure your styles are imported if needed

const bluePrimary = "#005197"; 
const bluePrimaryLight = "#005197CC";

// Helper component to display a single key-value pair.
const DetailItem = ({ label, value }) => {
    // Determine the value to display: 
    // Use the actual value if present, otherwise use a non-breaking space for layout consistency.
    const displayValue = value ? value : '\u00A0'; 

    return (
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
    // Safely retrieve the formData. It should contain all the contractor fields.
    const formData = location.state?.formData || {}; 

    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1); // Use for Edit button / Back Arrow
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
        // Add your API call/submission logic here
    };

    // Destructure the data from formData for easy access
    const {
        entityCode,
        entityName,
        effectiveDate,
        entityType,
        natureOfBusiness,
        grade,
        // Add other fields here as they become available, e.g., attachments:
        attachments, 
    } = formData;

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* Header: New Contractor & Back Arrow */}
            <div className="d-flex align-items-center py-3 px-4 mb-4" style={{ backgroundColor: 'white' }}>
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">
                
                {/* Review & Submit Card Header */}
                <div className="card text-start border-0 shadow-sm mb-4" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark">Review & Submit</h4>
                    </div>
                    <p className="text-muted mb-0">Please verify all the information below is correct before final submitting...</p>
                </div>
                
                {/* === START: BASIC INFORMATION SECTION === */}
                <div className="review-details-container bg-white p-4 mb-4 shadow-sm" style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}>
                    
                    {/* Basic Information Header */}
                    <div className="mb-4 pb-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                    </div>

                    {/* Details Grid */}
                    <div className="row">
                        <DetailItem label="Entity Code" value={entityCode} />
                        <DetailItem label="Entity Name" value={entityName} />
                        <DetailItem label="Effective Date" value={effectiveDate} />
                        
                        <DetailItem label="Entity Type" value={entityType} />
                        <DetailItem label="Nature of Business" value={natureOfBusiness} />
                        <DetailItem label="Grade" value={grade} />
                        
                        {/* You can add more DetailItem components here for other fields */}
                    </div>
                </div>
                {/* === END: BASIC INFORMATION SECTION === */}

                {/* === START: ATTACHMENTS SECTION (Placeholder) === */}
                {/* This section is structured to show where file attachments would go */}
                 <div className="review-details-container bg-white p-4 mb-4 shadow-sm" style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}>
                    
                    <div className="mb-4 pb-2" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Attachments (Certificates/Licenses)</h5>
                    </div>

                    {/* Example attachment display (Replace with map over `attachments` from formData) */}
                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{ border: '1px solid #f0f0f0' }}>
                        <div className="d-flex align-items-center">
                            <FileText size={20} className="me-2 text-danger" /> 
                            <div>
                                <p className="mb-0 fw-medium">business_license_2025.pdf</p>
                                <small className="text-muted">pdf • 4.2 MB</small>
                            </div>
                        </div>
                        <button className="btn btn-sm text-primary">View</button>
                    </div>
                    {/* End example attachment */}

                </div>
                {/* === END: ATTACHMENTS SECTION === */}


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