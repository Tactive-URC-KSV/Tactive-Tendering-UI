import React from 'react';
import { ArrowLeft } from 'lucide-react';
// Assuming you have a CSS file for custom styles
// import '../CSS/Styles.css'; 

// Helper component to display a single key-value pair.
// It checks for empty/missing values.
const DetailItem = ({ label, value }) => {
    // Determine the value to display: 
    // If value is truthy (not null, not undefined, not empty string), use it.
    // Otherwise, use a non-breaking space (&nbsp;) to maintain layout height.
    const displayValue = value ? value : '\u00A0'; // \u00A0 is the non-breaking space character

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div className="text-start">
                <p className="detail-label mb-1 text-muted">{label}</p>
                {/* Apply fw-bold only if the value is present */}
                <p className={`detail-value ${value ? 'fw-bold' : ''}`}>
                    {displayValue}
                </p>
            </div>
        </div>
    );
};

/**
 * ContractorReview component displays the contractor's data for review.
 * @param {object} props - Component properties.
 * @param {object} props.contractorData - The actual data object from user input.
 */
function ContractorReview({ contractorData = {} }) {
    // Destructure properties from contractorData. 
    // We provide a default empty object {} to avoid errors if the prop is not passed.
    const {
        entityCode,
        entityName,
        effectiveDate,
        entityType,
        natureOfBusiness,
        grade,
    } = contractorData;

    return (
        <div className='container-fluid min-vh-100'>
            <div className="d-flex align-items-center mb-3 mx-4">
                {/* Back button and title (optional, based on your full app structure) */}
                <ArrowLeft size={24} className="me-2 text-primary" />
                <h3 className="mb-0 fw-normal">New Contractor</h3>
            </div>
            
            <div className="mt-3 rounded-3 bg-white mx-4 p-4 shadow-sm" style={{ border: '1px solid #e0e0e0' }}>
                
                {/* Review & Submit Header */}
                <div className="header-section mb-4">
                    <h4 className="fw-bold mb-1">Review & Submit</h4>
                    <p className="text-muted">Please verify all the information below is correct before final submitting...</p>
                </div>

                {/* === Basic Information Section === */}
                <div className="basic-info-section">
                    <h5 className="fw-bold mb-1 text-primary">Basic Information</h5>
                    <p className="text-muted mb-4">Core details of the entity</p>

                    <div className="row">
                        {/* Pass the actual data variables to the DetailItem component */}
                        <DetailItem label="Entity Code" value={entityCode} />
                        <DetailItem label="Entity Name" value={entityName} />
                        <DetailItem label="Effective Date" value={effectiveDate} />

                        <DetailItem label="Entity Type" value={entityType} />
                        <DetailItem label="Nature of Business" value={natureOfBusiness} />
                        <DetailItem label="Grade" value={grade} />
                    </div>
                </div>

                {/* === Attachments Section (Placeholder) === */}
                <div className="attachments-section mt-4 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <h5 className="fw-bold mb-3 text-primary">Attachments (Certificates/Licenses)</h5>
                    {/* Placeholder for actual attachment list rendering */}
                    <p className="text-muted">No attachments uploaded.</p>
                </div>

                {/* === Submit/Edit Buttons (Placeholder) === */}
                <div className="d-flex justify-content-end mt-5 pt-3">
                    <button className='btn btn-light me-2' style={{ color: '#005197', border: '1px solid #005197' }}>Edit</button>
                    <button className='btn btn-primary' style={{ backgroundColor: '#005197', border: 'none' }}>Submit</button>
                </div>

            </div>
        </div>
    );
}

export default ContractorReview;