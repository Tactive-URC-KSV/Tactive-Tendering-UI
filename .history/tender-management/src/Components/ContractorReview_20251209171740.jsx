import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, MapPin, Phone, Briefcase, Landmark, Info } from 'lucide-react';

// Define the primary color used in headers (must be defined or imported)
const bluePrimary = "#005197"; 

/**
 * Helper component to display a single form field in a read-only review format.
 * This structure closely mimics the spacing and font styles of your input fields 
 * but displays the saved data instead of an input box.
 */
const ReviewField = ({ label, value }) => (
    <div className="col-md-6 mt-3 mb-4">
        {/* Label style matching projectform text-start d-block */}
        <label className="projectform text-start d-block" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
            {label}
        </label>
        {/* Value style: Bold, standard size, dark text */}
        <p className="mb-0 fw-bold" style={{ fontSize: '1rem', color: '#333' }}>
            {value || 'N/A'}
        </p>
    </div>
);

/**
 * Reusable wrapper component for each section (matches the card structure from your form).
 */
const ReviewSectionWrapper = ({ title, icon: Icon, children }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* Header style matches p-3 mb-4 d-flex align-items-center justify-content-center */}
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Icon size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">{title}</h3>
        </div>
        <div className="row">
            {children}
        </div>
    </div>
);


function ContractorReview() {
    // 1. Retrieve data passed via navigation state
    const location = useLocation();
    // CRITICAL: Ensure you are safely reading the 'state' and 'formData' property
    const formData = location.state?.formData || {};
    
    // 2. Navigation
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    
    // Placeholder for final submission logic
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
        // Add your final submission logic/API call here
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* Header with Back Button */}
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">Contractor Review</h2>
            </div>

            <div className="px-4 text-start">
                
                {/* Review & Submit Header Card - Matches Figma/Design */}
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
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform text-start d-block" style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                            Attachments
                        </label>
                        <div className="d-flex flex-wrap">
                            {formData.attachments && formData.attachments.length > 0 ? (
                                formData.attachments.map((file, index) => (
                                    <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2 fw-normal border">
                                        {file.name} ({Math.round(file.size / 1024)} KB)
                                    </span>
                                ))
                            ) : (
                                <p className="mb-0 fw-bold" style={{ fontSize: '1rem', color: '#333' }}>N/A</p>
                            )}
                        </div>
                    </div>
                </ReviewSectionWrapper>

                {/* --- 2. Address Details Section --- */}
                <ReviewSectionWrapper title="Address Details" icon={MapPin}>
                    <ReviewField label="Phone No" value={formData.phoneNo} />
                    <ReviewField label="Email ID" value={formData.emailID} />
                    <ReviewField label="Address Type" value={formData.addressType} />
                    <ReviewField label="Address 1" value={formData.address1} />
                    <ReviewField label="Address 2" value={formData.address2} />
                    <ReviewField label="Country" value={formData.country} />
                    <ReviewField label="City" value={formData.addresscity} />
                    <ReviewField label="Zip/Postal Code" value={formData.zipCode} />
                </ReviewSectionWrapper>

                {/* --- 3. Contact Details Section --- */}
                <ReviewSectionWrapper title="Contact Details" icon={Phone}>
                    <ReviewField label="Contact Name" value={formData.contactName} />
                    <ReviewField label="Position" value={formData.contactPosition} />
                    <ReviewField label="Phone No" value={formData.contactPhoneNo} />
                    <ReviewField label="Email ID" value={formData.contactEmailID} />
                </ReviewSectionWrapper>

                {/* --- 4. Tax Details Section --- */}
                <ReviewSectionWrapper title="Tax Details" icon={Briefcase}>
                    <ReviewField label="Tax Type" value={formData.taxType} />
                    <ReviewField label="Territory Type" value={formData.territoryType} />
                    <ReviewField label="Territory" value={formData.territory} />
                    <ReviewField label="Tax Reg. No" value={formData.taxRegNo} />
                    <ReviewField label="Tax Reg. Date" value={formData.taxRegDate} />
                    <ReviewField label="Address 1" value={formData.taxAddress1} />
                    <ReviewField label="Address 2" value={formData.taxAddress2} />
                    <ReviewField label="City" value={formData.taxCity} />
                    <ReviewField label="Zip/Postal Code" value={formData.taxZipCode} />
                    <ReviewField label="Email ID" value={formData.taxEmailID} />
                </ReviewSectionWrapper>

                {/* --- 5. Bank Accounts Section --- */}
                <ReviewSectionWrapper title="Bank Accounts" icon={Landmark}>
                    <ReviewField label="Account Holder Name" value={formData.accountHolderName} />
                    <ReviewField label="Account No" value={formData.accountNo} />
                    <ReviewField label="Bank Name" value={formData.bankName} />
                    <ReviewField label="Branch Name" value={formData.branchName} />
                    <ReviewField label="Bank Address" value={formData.bankAddress} />
                </ReviewSectionWrapper>
                
                {/* --- 6. Additional Info Section --- */}
                <ReviewSectionWrapper title="Additional Info" icon={Info}>
                    <ReviewField label="Type" value={formData.additionalInfoType} />
                    <ReviewField label="Registration No" value={formData.registrationNo} />
                </ReviewSectionWrapper>


                {/* Action Buttons */}
                <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleGoBack} style={{ borderRadius: "6px" }}>
                        Edit Details
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmitFinal}
                        className="btn px-4 fw-bold" 
                        style={{ backgroundColor: '#28a745', color: "white", borderRadius: "6px", borderColor: '#28a745' }}
                    >
                        Submit Final Approval <CheckCircle size={21} color="white" className="ms-2" />
                    </button>
                </div>
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorReview;