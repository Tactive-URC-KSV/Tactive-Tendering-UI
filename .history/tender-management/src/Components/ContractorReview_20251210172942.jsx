import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MapPin, User, Briefcase, DollarSign, Info } from 'lucide-react';

const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const labelTextColor = '#00000080';

const DetailItem = ({ label, value }) => {
    // If 'value' is an object (which shouldn't happen with the new logic, but is a good safeguard)
    // or if it's the old 'value' string, we default to the empty string behavior.
    const displayValue = value ? value : '\u00A0';
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <p className="detail-label mb-0 fw-normal fs-6" style={{ color: labelTextColor }}>
                {label}
            </p>
            <p
                className={`detail-value ${value ? 'fw-bold' : ''}`}
                style={{
                    fontSize: '0.9rem',
                    color: value ? '#333' : 'transparent',
                    minHeight: '1.1em',
                    marginBottom: '0.5rem'
                }}
            >
                {displayValue}
            </p>
        </div>
    );
};

function ContractorReview() {
    const location = useLocation();
    const formData = location.state?.formData || {};

    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const handleSubmitFinal = () => console.log("Submitting:", formData);

    // --- START: UPDATED DATA EXTRACTION ---
    // 1. Destructure all simple string fields and arrays
    const {
        entityCode,
        entityName,
        effectiveDate,
        attachmentMetadata = [],
        phoneNo,
        emailId,
        address1,
        address2,
        zipCode,
        contactName,
        contactPhoneNo,
        contactEmailID,
        taxRegNo,
        taxRegDate,
        accountHolderName,
        accountNo,
        bankName,
        branchName,
        bankAddress,
        registrationNo,
    } = formData;

    // 2. Extract the .label for all Select fields
    // Use the ternary operator to safely access .label, falling back to an empty string if null
    const entityTypeLabel = formData.entityType ? formData.entityType.label : '';
    const natureOfBusinessLabel = formData.natureOfBusiness ? formData.natureOfBusiness.label : '';
    const gradeLabel = formData.grade ? formData.grade.label : '';
    
    const addressTypeLabel = formData.addressType ? formData.addressType.label : '';
    const countryLabel = formData.country ? formData.country.label : '';
    // Note: 'addresscity' was used in the input form, but 'city' is used here. 
    // Assuming formData.city holds the select object.
    const cityLabel = formData.city ? formData.city.label : ''; 

    const contactPositionLabel = formData.contactPosition ? formData.contactPosition.label : '';

    const taxTypeLabel = formData.taxType ? formData.taxType.label : '';
    const territoryTypeLabel = formData.territoryType ? formData.territoryType.label : '';
    const territoryLabel = formData.territory ? formData.territory.label : '';

    const additionalInfoTypeLabel = formData.additionalInfoType ? formData.additionalInfoType.label : '';
    // --- END: UPDATED DATA EXTRACTION ---
    
    const hasAttachments = attachmentMetadata && attachmentMetadata.length > 0;

    return (
        <div className="container-fluid min-vh-100 p-0">

            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">

                <div className="bg-white p-4 mb-4 shadow-sm" style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}>
                    
                    <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                        <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                    </div>

                    <div className="row mt-4">
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>
                            <div className="row mb-4">
                                {/* --- START: BASIC INFO FIX --- */}
                                <DetailItem label="Entity Type" value={entityTypeLabel} />
                                <DetailItem label="Nature of Business" value={natureOfBusinessLabel} />
                                <DetailItem label="Grade" value={gradeLabel} />
                                {/* --- END: BASIC INFO FIX --- */}
                            </div>
                        </div>
                    </div>

                    <div className="attachments-section">
                        <h5 className="fw-bold mb-3"
                            style={{
                                color: labelTextColor,
                                width: "66%",
                                marginLeft: "auto"
                            }}>
                            Attachments (Certificates/Licenses)
                        </h5>

                        <div className="attachment-file-list px-3">
                            {hasAttachments ? (
                                attachmentMetadata.map((file, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center p-3 rounded mb-2"
                                        style={{
                                            border: '1px solid #00000014',
                                            width: '66%',
                                            marginLeft: "auto",
                                            background: '#00000004'
                                        }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <FileText size={20} className="me-2 text-danger" />
                                            <div>
                                                <p className="mb-0 fw-medium">{file.name}</p>
                                                <small className="text-muted">
                                                    {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'File'}
                                                    {file.lastModified ? ` • Modified: ${new Date(file.lastModified).toLocaleDateString()}` : ''}
                                                </small>
                                            </div>
                                        </div>
                                        <button className="btn btn-sm" style={{ color: bluePrimary }}>View</button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted p-3" style={{ width: "66%", marginLeft: "auto" }}>
                                    No attachments uploaded.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <MapPin size={18} className="me-2" /> Address Details
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Registered company address</p>
                            </div>

                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    <DetailItem label="Phone No" value={phoneNo} />
                                    <DetailItem label="Email ID" value={emailId} />
                                    {/* --- START: ADDRESS DETAIL FIX --- */}
                                    <DetailItem label="Address Type" value={addressTypeLabel} />
                                </div>

                                <div className="row">
                                    <DetailItem label="Address 1" value={address1} />
                                    <DetailItem label="Address 2" value={address2} />
                                    <DetailItem label="" value="" />
                                </div>

                                <div className="row mb-3">
                                    <DetailItem label="Country" value={countryLabel} />
                                    <DetailItem label="City" value={cityLabel} />
                                    {/* --- END: ADDRESS DETAIL FIX --- */}
                                    <DetailItem label="Zip/Postal Code" value={zipCode} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <User size={18} className="me-2" /> Contact Details
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Primary point of contact</p>
                            </div>

                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    <DetailItem label="Name" value={contactName} />
                                    {/* --- START: CONTACT DETAIL FIX --- */}
                                    <DetailItem label="Position" value={contactPositionLabel} />
                                    {/* --- END: CONTACT DETAIL FIX --- */}
                                    <DetailItem label="" value="" />
                                </div>

                                <div className="row mb-3">
                                    <DetailItem label="Phone No" value={contactPhoneNo} />
                                    <DetailItem label="Email ID" value={contactEmailID} />
                                    <DetailItem label="" value="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <Briefcase size={18} className="me-2" /> Tax Details
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Tax registration information</p>
                            </div>

                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    {/* --- START: TAX DETAIL FIX --- */}
                                    <DetailItem label="Tax Type" value={taxTypeLabel} />
                                    <DetailItem label="Territory Type" value={territoryTypeLabel} />
                                    <DetailItem label="Territory" value={territoryLabel} />
                                </div>

                                <div className="row mb-3">
                                    <DetailItem label="Tax Reg No" value={taxRegNo} />
                                    <DetailItem label="Tax Reg Date" value={taxRegDate} />
                                    {/* --- END: TAX DETAIL FIX --- */}
                                    <DetailItem label="" value="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <DollarSign size={18} className="me-2" /> Bank Accounts
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Financial transaction details</p>
                            </div>

                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    <DetailItem label="Account Holder Name" value={accountHolderName} />
                                    <DetailItem label="Account No" value={accountNo} />
                                    <DetailItem label="Bank Name" value={bankName} />
                                </div>

                                <div className="row mb-3">
                                    <DetailItem label="Branch Name" value={branchName} />
                                    <DetailItem label="Bank Address" value={bankAddress} />
                                    <DetailItem label="" value="" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <Info size={18} className="me-2" /> Additional Info
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Other relevant registrations</p>
                            </div>

                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    {/* --- START: ADDITIONAL INFO FIX --- */}
                                    <DetailItem label="Type" value={additionalInfoTypeLabel} />
                                    {/* --- END: ADDITIONAL INFO FIX --- */}
                                    <DetailItem label="Registration No" value={registrationNo} />
                                    <DetailItem label="" value="" />
                                </div>
                            </div>
                        </div>
                    </div>
                
                </div> 
                <div className="d-flex justify-content-end mt-4 pb-5"> 
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
    );
}

export default ContractorReview;