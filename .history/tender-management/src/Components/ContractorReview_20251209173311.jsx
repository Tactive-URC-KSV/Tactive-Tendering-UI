import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used for section headers
import { ArrowLeft, CheckCircle, FileText, MapPin, Phone, Briefcase, Landmark, Info } from 'lucide-react';

// Define the consistent blue color used in headers
const bluePrimary = "#005197"; 

/**
 * Component to display a single field (Label and Value) in the design's format.
 * Focuses on precise spacing and typography.
 */
const ReviewField = ({ label, value }) => (
    // col-md-6 for two columns. mb-4 ensures spacing between rows, mt-2 provides space from the previous row.
    <div className="col-md-6 mt-2 mb-4"> 
        {/* Label: Small, light grey, tight bottom margin (mb-0 to prevent large gaps) */}
        <label className="text-start d-block mb-1" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
            {label}
        </label>
        {/* Value: Bold, dark text, standard size (mb-0 ensures no padding below the value) */}
        <p className="mb-0 fw-bold text-dark" style={{ fontSize: '0.85rem' }}> 
            {value || 'N/A'} 
        </p>
    </div>
);

/**
 * Wrapper component for each major section card.
 */
const ReviewSectionWrapper = ({ title, icon: Icon, children }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* Blue Header Bar (Styling unchanged, as this matches your design) */}
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Icon size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">{title}</h3>
        </div>
        {/* Row container for the field content */}
        <div className="row">
            {children}
        </div>
    </div>
);


function ContractorReview() {
    // 1. Data Retrieval (CRITICAL: Needs correct data passing from ContractorOverview)
    const location = useLocation();
    const formData = location.state?.formData || {};
    
    // 2. Navigation
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    
    // Placeholder for final submission logic
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
        // Integrate your final submission API call here
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* Top Navigation Header */}
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">Contractor Review</h2>
            </div>

            <div className="px-4 text-start">
                
                {/* Review & Submit Summary Card */}
                <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                        <CheckCircle size={24} className="me-2" style={{ color: '#28a745' }} /> 
                        <h4 className="fw-bold mb-0 text-dark">Review & Submit</h4>
                    </div>
                    <p className="text-muted mb-0">Please verify the information below before final submission.</p>
                </div>

                {/* --- 1. Basic Information Section --- */}
                <ReviewSectionWrapper title="Basic Information" icon={FileText}>
                    <ReviewField label="Entity Code" value={formData.entityCode} />
                    <ReviewField label="Entity Name" value={formData.entityName} />
                    <ReviewField label="Effective Date" value={formData.effectiveDate} />
                    <ReviewField label="Entity Type" value={formData.entityType} />
                    <ReviewField label="Nature of Business" value={formData.natureOfBusiness} />
                    <ReviewField label="Grade" value={formData.grade} />

                    {/* Attachments Field (takes full row) */}
                    <div className="col-12 mt-2 mb-4">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                            Attachments
                        </label>
                        <div className="d-flex flex-wrap mt-2">
                            {formData.attachments && formData.attachments.length > 0 ? (
                                formData.attachments.map((file, index) => (
                                    <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2 fw-normal border">
                                        {file.name} ({Math.round(file.size / 1024)} KB)
                                    </span>
                                ))
                            ) : (
                                <p className="mb-0 fw-bold text-dark" style={{ fontSize: '0.85rem' }}>N/A</p>
                            )}
                        </div>
                    </div>
                </ReviewSectionWrapper>

               
}

export default ContractorReview;