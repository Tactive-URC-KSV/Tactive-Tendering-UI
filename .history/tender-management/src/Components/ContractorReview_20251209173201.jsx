import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Icons used for section headers
import { ArrowLeft, CheckCircle, FileText, MapPin, Phone, Briefcase, Landmark, Info, Eye } from 'lucide-react';

// Define the consistent blue color used in headers
const bluePrimary = "#005197"; 

/**
 * Component to display a single field (Label and Value) in a condensed format.
 */
const ReviewField = ({ label, value }) => (
    // col-md-6 for two columns. mb-2 significantly reduces spacing between rows.
    <div className="col-12 col-md-6 mt-1 mb-2"> 
        {/* Label: Small, light grey, tight bottom margin (mb-1) */}
        <label className="text-start d-block mb-1" style={{ fontSize: '0.7rem', color: '#6c757d' }}>
            {label}
        </label>
        {/* Value: Bold, dark text, slightly smaller font. */}
        <p className="mb-0 fw-bold text-dark" style={{ fontSize: '0.8rem' }}> 
            {value || 'N/A'} 
        </p>
    </div>
);

/**
 * Wrapper component for each major section card with condensed styling 
 * and a non-blue header (white background, blue text).
 */
const ReviewSectionWrapper = ({ title, icon: Icon, children, subtitle }) => (
    // Removed mt-4 for tighter vertical spacing between sections
    <div className="card text-start border-0 shadow-sm mt-3" style={{ borderRadius: "4px", padding: "0 1.25rem 1.25rem 1.25rem" }}>
        {/* Header Bar: White background with blue text and border */}
        <div className="p-2 mb-3 d-flex align-items-center justify-content-start" 
             style={{ 
                 backgroundColor: 'transparent', 
                 borderBottom: `2px solid ${bluePrimary}`, // Blue separator line
                 width: "calc(100% + 2.5rem)", 
                 marginLeft: "-1.25rem", 
                 marginRight: "-1.25rem"
             }}>
            <Icon size={16} className="ms-3 me-2" style={{ color: bluePrimary }} /> 
            <h3 className="mb-0 fs-6 fw-bold" style={{ color: bluePrimary }}>{title}</h3>
        </div>
        
        {/* Subtitle/Description */}
        {subtitle && (
            <p className="text-muted mb-3" style={{ fontSize: '0.8rem' }}>{subtitle}</p>
        )}

        {/* Row container for the field content */}
        <div className="row">
            {children}
        </div>
    </div>
);


function ContractorReview() {
    // --- Mock Data Setup to Match the Screenshot Content (using provided fields) ---
    const location = useLocation();
    const formData = location.state?.formData || {
        // Basic Information
        entityCode: 'CR9381', entityName: 'Apex Builders', effectiveDate: '2025-10-09', entityType: 'Contractor', 
        natureOfBusiness: 'Contracting Services', grade: 'A Grade',
        attachments: [{ name: 'business_license_2025.pdf', size: 4096000 }], // 4.0 MB
        
        // Address Details
        addressSubtitle: 'Registered Company Address',
        phoneNo: '+91 (984) 123-4567', emailID: 'contact@apexbuilders.com', addressType: 'Office Address', 
        address1: '123 Innovation Drive, Suite 450', address2: 'Tech Park', country: 'United States', addresscity: 'Metropolis', zipCode: '10002',
        
        // Contact Details
        contactSubtitle: 'Primary point of contact',
        contactName: 'Michael', contactPosition: 'Project Manager', contactPhoneNo: '+91 (984) 123-4567', contactEmailID: 'michael@gmail.com',
        
        // Tax Details
        taxSubtitle: 'Tax registration information',
        taxType: 'VAT Register', territoryType: 'Country', territory: 'United States', taxRegNo: 'GST456789XYZ', taxRegDate: '2019-09-01', 
        
        // Bank Accounts
        bankSubtitle: 'Financial transaction details',
        accountHolderName: 'Apex Builders', accountNo: '******** 8890', bankName: 'Metropolis National Bank', 
        branchName: 'Downtown Branch', bankAddress: '100 Financial Ave, Metropolis, 10002',

        // Additional Info
        additionalSubtitle: 'Other relevant information',
        additionalInfoType: 'PAN No', registrationNo: 'ID-98765'
    };
    
    // 2. Navigation
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1); 
    
    // Placeholder for final submission logic
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
        alert("Submitting Final Approval (Simulated)");
    };

    const handleViewFile = (fileName) => {
        alert(`Viewing file: ${fileName}`);
    };
    
    return (
        // The container-fluid class and min-vh-100 ensure full-page width and height.
        <div className="container-fluid min-vh-100 p-0" style={{ backgroundColor: '#f8f9fa' }}>
            
            {/* Top Navigation Bar: Stretched across full width */}
            <div className="py-2 px-4 d-flex align-items-center" style={{ borderBottom: '1px solid #dee2e6', backgroundColor: 'white' }}>
                <ArrowLeft size={20} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-6 fw-bold">Contractor Review</h2>
            </div>

            {/* Scrollable Content Area: Uses padding to keep content inset from edges */}
            <div className="px-4 pt-3 pb-5 text-start">
                
                {/* Review & Submit Summary Card */}
                <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "4px", padding: "1.25rem", borderLeft: '3px solid #28a745' }}>
                    <div className="d-flex align-items-center mb-1">
                        <CheckCircle size={20} className="me-2" style={{ color: '#28a745' }} /> 
                        <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>Review & Submit</h4>
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Please verify the information below before final submission.</p>
                </div>

                {/* --- 1. Basic Information Section --- */}
                <ReviewSectionWrapper title="Basic Information" icon={FileText} subtitle="Core details of the entity">
                    <ReviewField label="Entity Code" value={formData.entityCode} />
                    <ReviewField label="Entity Name" value={formData.entityName} />
                    <ReviewField label="Effective Date" value={formData.effectiveDate} />
                    <ReviewField label="Entity Type" value={formData.entityType} />
                    <ReviewField label="Nature of Business" value={formData.natureOfBusiness} />
                    <ReviewField label="Grade" value={formData.grade} />

                    {/* Attachments Field (takes full row) */}
                    <div className="col-12 mt-2 mb-2">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.7rem', color: '#6c757d' }}>
                            Attachments ({formData.attachments.length})
                        </label>
                        <div className="d-flex flex-wrap mt-2">
                            {formData.attachments && formData.attachments.length > 0 ? (
                                formData.attachments.map((file, index) => (
                                    <div key={index} className="d-flex align-items-center me-4">
                                        <span className="mb-0 fw-bold text-dark me-2" style={{ fontSize: '0.8rem' }}>
                                            {file.name}
                                        </span>
                                        <span className="text-muted me-3" style={{ fontSize: '0.75rem' }}>
                                            ({(file.size / 1024 / 1024).toFixed(1)} MB)
                                        </span>
                                        <button 
                                            className="btn btn-sm text-primary p-0" 
                                            onClick={() => handleViewFile(file.name)}
                                            style={{ fontSize: '0.8rem' }}
                                        >
                                            View
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="mb-0 fw-bold text-dark" style={{ fontSize: '0.8rem' }}>N/A</p>
                            )}
                        </div>
                    </div>
                </ReviewSectionWrapper>

                {/* --- 2. Address Details Section --- */}
                <ReviewSectionWrapper title="Address Details" icon={MapPin} subtitle={formData.addressSubtitle}>
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
                <ReviewSectionWrapper title="Contact Details" icon={Phone} subtitle={formData.contactSubtitle}>
                    <ReviewField label="Name" value={formData.contactName} />
                    <ReviewField label="Position" value={formData.contactPosition} />
                    <ReviewField label="Phone No" value={formData.contactPhoneNo} />
                    <ReviewField label="Email ID" value={formData.contactEmailID} />
                </ReviewSectionWrapper>

                {/* --- 4. Tax Details Section --- */}
                <ReviewSectionWrapper title="Tax Details" icon={Briefcase} subtitle={formData.taxSubtitle}>
                    <ReviewField label="Tax Type" value={formData.taxType} />
                    <ReviewField label="Territory Type" value={formData.territoryType} />
                    <ReviewField label="Territory" value={formData.territory} />
                    <ReviewField label="Tax Reg. No" value={formData.taxRegNo} />
                    <ReviewField label="Tax Reg. Date" value={formData.taxRegDate} />
                </ReviewSectionWrapper>

                {/* --- 5. Bank Accounts Section --- */}
                <ReviewSectionWrapper title="Bank Accounts" icon={Landmark} subtitle={formData.bankSubtitle}>
                    <ReviewField label="Account Holder Name" value={formData.accountHolderName} />
                    <ReviewField label="Account No" value={formData.accountNo} />
                    <ReviewField label="Bank Name" value={formData.bankName} />
                    <ReviewField label="Branch Name" value={formData.branchName} />
                    <ReviewField label="Bank Address" value={formData.bankAddress} />
                </ReviewSectionWrapper>
                
                {/* --- 6. Additional Info Section --- */}
                <ReviewSectionWrapper title="Additional Info" icon={Info} subtitle={formData.additionalSubtitle}>
                    <ReviewField label="Type" value={formData.additionalInfoType} />
                    <ReviewField label="Registration No" value={formData.registrationNo} />
                </ReviewSectionWrapper>


                {/* Action Buttons at the bottom (aligned left in the mockup) */}
                <div className="d-flex justify-content-start mt-4">
                    <button 
                        type="button" 
                        className="btn px-4 fw-bold me-3" 
                        onClick={handleGoBack} 
                        style={{ 
                            backgroundColor: bluePrimary, 
                            color: "white", 
                            borderRadius: "6px",
                            padding: '8px 20px',
                            fontSize: '0.875rem'
                        }}
                    >
                        <ArrowLeft size={16} className="me-2" />
                        Start editing
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={handleSubmitFinal}
                        className="btn px-4 fw-bold" 
                        style={{ 
                            backgroundColor: 'transparent', 
                            color: bluePrimary, 
                            borderRadius: "6px", 
                            border: `1px solid ${bluePrimary}`,
                            padding: '8px 20px',
                            fontSize: '0.875rem'
                        }}
                    >
                        <Eye size={16} className="me-2" />
                        Submit Final Approval
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContractorReview;