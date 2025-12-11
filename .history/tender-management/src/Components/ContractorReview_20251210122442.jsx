import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const grayHeader = "#6c757d";
const labelTextColor = '#00000080';

const DetailItem = ({ label, value }) => {
    const displayValue = value ? value : '\u00A0';
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                <p 
                    className="detail-label mb-1 fw-normal fs-6" 
                    style={{ color: labelTextColor }}
                >
                    {label}
                </p>
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

// NEW: Component configured for the 4-column Address Details layout
const AddressDetailItem = ({ label, value }) => {
    const displayValue = value ? value : '\u00A0';
    return (
        <div className="col-lg-3 col-md-6 col-sm-12 mb-4"> 
            <div className="text-start">
                <p 
                    className="detail-label mb-1 fw-normal fs-6" 
                    style={{ color: labelTextColor }}
                >
                    {label}
                </p>
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

    // Destructure existing fields
    const {
        entityCode,
        entityName,
        effectiveDate,
        entityType,
        natureOfBusiness,
        grade,
        attachments = [],
        // NEW ADDRESS FIELDS added here, defaulting to empty strings
        phoneNo = '',
        emailId = '',
        addressType = '',
        address1 = '',
        address2 = '',
        country = '',
        city = '',
        zipPostalCode = '',
    } = formData;

    const hasAttachments = attachments && attachments.length > 0;

    return (
        <div className="container-fluid min-vh-100 p-0">

            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">

                <div
                    className="bg-white p-4 mb-4 shadow-sm"
                    style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}
                >

                    <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                        <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                    </div>

                    {/* BASIC INFORMATION GRID */}
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
                                <DetailItem label="Entity Type" value={entityType} />
                                <DetailItem label="Nature of Business" value={natureOfBusiness} />
                                <DetailItem label="Grade" value={grade} />
                            </div>
                        </div>
                    </div>

                    {/* --- NEW: ADDRESS DETAILS SECTION (4-column layout) --- */}
                    <div className="row mt-4 pt-3 border-top" style={{ borderColor: '#f0f0f0' }}>

                        {/* LEFT COLUMN: Address Details Header (col-lg-4) */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Address Details</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Registered company address</p>
                        </div>

                        {/* RIGHT COLUMN: Address Details (col-lg-8) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            
                            {/* Visual Row 1: Phone No, Email ID, Address Type */}
                            <div className="row">
                                <AddressDetailItem label="Phone No" value={phoneNo} />
                                <AddressDetailItem label="Email ID" value={emailId} />
                                <AddressDetailItem label="Address Type" value={addressType} />
                                <div className="col-lg-3"></div> {/* Empty column for spacing */}
                            </div>

                            {/* Visual Row 2: Address 1, Address 2 */}
                            <div className="row">
                                <AddressDetailItem label="Address 1" value={address1} />
                                <AddressDetailItem label="Address 2" value={address2} />
                                <div className="col-lg-6"></div> {/* Empty columns for spacing */}
                            </div>

                            {/* Visual Row 3: Country, City, Zip/Postal Code */}
                            <div className="row mb-4">
                                <AddressDetailItem label="Country" value={country} />
                                <AddressDetailItem label="City" value={city} />
                                <AddressDetailItem label="Zip/Postal Code" value={zipPostalCode} />
                                <div className="col-lg-3"></div> {/* Empty column for spacing */}
                            </div>
                        </div>
                    </div>
                    {/* --- END ADDRESS DETAILS SECTION --- */}

                    {/* --- ATTACHMENTS SECTION (Existing Format) --- */}
                    <div className="attachments-section mt-4 pt-3 border-top" style={{ borderColor: '#f0f0f0' }}>
                        <h5 className="fw-bold mb-3" 
                            style={{ 
                                color: labelTextColor,
                                width: "66%",
                                marginLeft: "auto",
                                textAlign: "right"
                            }}>
                            Attachments (Certificates/Licenses)
                        </h5>

                        <div className="attachment-file-list px-3">
                            {hasAttachments ? (
                                attachments.map((file, index) => (
                                    <div
                                        key={index}
                                        className="d-flex justify-content-between align-items-center p-3 rounded mb-2"
                                        style={{ border: '1px solid #00000014', width: '66%', marginLeft: "auto", background:'#00000004' }}
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
                                <p className="text-muted ms-1" style={{ textAlign: "right", width: '66%', marginLeft: "auto" }}>
                                    No attachments uploaded.
                                </p>
                            )}
                        </div>
                    </div>
                    {/* --- END ATTACHMENTS SECTION --- */}
                    
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