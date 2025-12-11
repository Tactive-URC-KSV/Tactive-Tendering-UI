import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileText, MapPin, Phone, Briefcase, DollarSign, Info } from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa'; 

// Define a common color for accents
const bluePrimary = "#005197";

/**
 * Renders the Contractor Review page, displaying all submitted data.
 * The data is received via the useLocation hook from the ContractorOverview page.
 */
function ContractorReview() {
    // 1. Retrieve data passed via navigation state
    const location = useLocation();
    // Use optional chaining and default to an empty object for safety
    const formData = location.state?.formData || {};
    
    // 2. Navigation for the "Go Back" button
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    
    // Helper function to render a data row
    const DataRow = ({ label, value }) => (
        <div className="col-md-6 mb-3">
            <p className="text-muted mb-1 fw-medium" style={{ fontSize: '0.85rem' }}>{label}</p>
            <p className="mb-0 fw-bold" style={{ color: '#333' }}>{value || 'N/A'}</p>
        </div>
    );
    
    // Helper component for section headers
    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="p-3 mb-4 d-flex align-items-center" style={{ 
            backgroundColor: bluePrimary, 
            width: "calc(100% + 3rem)", 
            marginLeft: "-1.5rem", 
            marginRight: "-1.5rem", 
            borderRadius: "8px 8px 0 0" 
        }}>
            <Icon size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">{title}</h3>
        </div>
    );

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* Header with Back Button */}
            <div className="d-flex align-items-center py-3 px-4 mb-4" style={{ borderBottom: '1px solid #eee' }}>
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">Contractor Review</h2>
            </div>

            <div className="px-4 text-start">
                <h4 className="fw-bold mb-3 d-flex align-items-center text-secondary">
                    <CheckCircle size={24} className="me-2" style={{ color: '#28a745' }} /> 
                    Review & Submit
                </h4>
                <p className="text-muted mb-4">Please verify the information below before final submission.</p>

                {/* Main Content Card */}
                <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                    
                    {/* Basic Information Section */}
                    <SectionHeader icon={FileText} title="Basic Information" />
                    <div className="row">
                        <DataRow label="Entity Code" value={formData.entityCode} />
                        <DataRow label="Entity Name" value={formData.entityName} />
                        <DataRow label="Effective Date" value={formData.effectiveDate} />
                        <DataRow label="Entity Type" value={formData.entityType} />
                        <DataRow label="Nature of Business" value={formData.natureOfBusiness} />
                        <DataRow label="Grade" value={formData.grade} />
                    </div>

                    {/* Attachments Display */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <p className="text-muted mb-1 fw-medium" style={{ fontSize: '0.85rem' }}>Attachments (Certificates/Licenses)</p>
                            <div className="d-flex flex-wrap">
                                {formData.attachments && formData.attachments.length > 0 ? (
                                    formData.attachments.map((file, index) => (
                                        <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2 fw-normal border">
                                            {file.name} ({Math.round(file.size / 1024)} KB)
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-muted fst-italic">No attachments uploaded.</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address Details Section */}
                <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                    <SectionHeader icon={MapPin} title="Address Details" />
                    <div className="row">
                        <DataRow label="Phone No" value={formData.phoneNo} />
                        <DataRow label="Email ID" value={formData.emailID} />
                        <DataRow label="Address Type" value={formData.addressType} />
                        <DataRow label="Address 1" value={formData.address1} />
                        <DataRow label="Address 2" value={formData.address2} />
                        <DataRow label="Country" value={formData.country} />
                        <DataRow label="City" value={formData.addresscity} />
                        <DataRow label="Zip/Postal Code" value={formData.zipCode} />
                    </div>
                </div>

                {/* Contact Details Section */}
                <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                    <SectionHeader icon={Phone} title="Contact Details" />
                    <div className="row">
                        <DataRow label="Contact Name" value={formData.contactName} />
                        <DataRow label="Position" value={formData.contactPosition} />
                        <DataRow label="Phone No" value={formData.contactPhoneNo} />
                        <DataRow label="Email ID" value={formData.contactEmailID} />
                    </div>
                </div>

                {/* Tax Details Section */}
                <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                    <SectionHeader icon={Briefcase} title="Tax Details" />
                    <div className="row">
                        <DataRow label="Tax Type" value={formData.taxType} />
                        <DataRow label="Territory Type" value={formData.territoryType} />
                        <DataRow label="Territory" value={formData.territory} />
                        <DataRow label="Tax Reg. No" value={formData.taxRegNo} />
                        <DataRow label="Tax Reg. Date" value={formData.taxRegDate} />
                        <DataRow label="Address 1" value={formData.taxAddress1} />
                        <DataRow label="Address 2" value={formData.taxAddress2} />
                        <DataRow label="City" value={formData.taxCity} />
                        <DataRow label="Zip/Postal Code" value={formData.taxZipCode} />
                        <DataRow label="Email ID" value={formData.taxEmailID} />
                    </div>
                </div>

                {/* Bank Accounts Section */}
                <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                    <SectionHeader icon={DollarSign} title="Bank Accounts" />
                    <div className="row">
                        <DataRow label="Account Holder Name" value={formData.accountHolderName} />
                        <DataRow label="Account No" value={formData.accountNo} />
                        <DataRow label="Bank Name" value={formData.bankName} />
                        <DataRow label="Branch Name" value={formData.branchName} />
                        <DataRow label="Bank Address" value={formData.bankAddress} />
                    </div>
                </div>
                
                {/* Additional Info Section */}
                <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                    <SectionHeader icon={Info} title="Additional Info" />
                    <div className="row">
                        <DataRow label="Type" value={formData.additionalInfoType} />
                        <DataRow label="Registration No" value={formData.registrationNo} />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleGoBack} style={{ borderRadius: "6px" }}>
                        Edit Details
                    </button>
                    <button type="button" className="btn px-4 fw-bold" style={{ backgroundColor: '#28a745', color: "white", borderRadius: "6px", borderColor: '#28a745' }}>
                        Submit Final Approval <CheckCircle size={21} color="white" className="ms-2" />
                    </button>
                </div>
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorReview;