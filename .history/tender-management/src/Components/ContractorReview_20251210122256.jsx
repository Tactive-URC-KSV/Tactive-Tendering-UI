import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const grayHeader = "#6c757d";
const labelTextColor = '#00000080';

// Component for 3-column Basic Info layout
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

// Component for 4-column Address Details layout
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

    // Destructure all fields, including the new Address fields, defaulting to empty strings
    const {
        entityCode,
        entityName,
        effectiveDate,
        entityType,
        natureOfBusiness,
        grade,
        attachments = [], // Assuming attachments is an array of objects {name: string, size: string, type: string}
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

                    {/* SECTION: Review & Submit Header */}
                    <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                        <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                    </div>

                    {/* BASIC INFORMATION GRID */}
                    <div className="row mt-4">

                        {/* LEFT COLUMN: Basic Information Header (col-lg-4) */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        {/* RIGHT COLUMN: Entity Details (col-lg-8) */}
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
                    
                    {/* ADDRESS DETAILS SECTION */}
                    <div className="row mt-4 pt-3 border-top" style={{ borderColor: '#f0f0f0' }}>

                        {/* LEFT COLUMN: Address Details Header (col-lg-4) */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Address Details</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Registered company address</p>
                        </div>

                        {/* RIGHT COLUMN: Address Details (col-lg-8) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <AddressDetailItem label="Phone No" value={phoneNo} />
                                <AddressDetailItem label="Email ID" value={emailId} />
                                <AddressDetailItem label="Address Type" value={addressType} />
                                <div className="col-lg-3"></div>
                            </div>
                            <div className="row">
                                <AddressDetailItem label="Address 1" value={address1} />
                                <AddressDetailItem label="Address 2" value={address2} />
                                <div className="col-lg-6"></div>
                            </div>
                            <div className="row mb-4">
                                <AddressDetailItem label="Country" value={country} />
                                <AddressDetailItem label="City" value={city} />
                                <AddressDetailItem label="Zip/Postal Code" value={zipPostalCode} />
                                <div className="col-lg-3"></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* --- ATTACHMENTS SECTION (TABLE-LIKE) --- */}
                    <div className="row mt-4 pt-3 border-top" style={{ borderColor: '#f0f0f0' }}>

                        {/* LEFT COLUMN: Attachments Header (col-lg-4) */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Attachments</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Certificates and Licenses</p>
                        </div>

                        {/* RIGHT COLUMN: Attachment List/Table (col-lg-8) */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            
                            {/* Attachment List Header Row (Table Header) */}
                            <div className="row mb-2 pb-1 border-bottom">
                                <div className="col-4">
                                    <p className="mb-0 fw-medium" style={{ color: labelTextColor, fontSize: '0.85rem' }}>CERTIFICATE NAME</p>
                                </div>
                                <div className="col-5">
                                    <p className="mb-0 fw-medium" style={{ color: labelTextColor, fontSize: '0.85rem' }}>FILE</p>
                                </div>
                                <div className="col-3 text-start">
                                    <p className="mb-0 fw-medium" style={{ color: labelTextColor, fontSize: '0.85rem' }}>STATUS</p>
                                </div>
                            </div>

                            {/* Attachment Data Rows */}
                            {hasAttachments ? (
                                attachments.map((file, index) => (
                                    <div key={index} className="row py-2 align-items-center border-bottom" style={{ borderColor: '#f9f9f9' }}>
                                        
                                        {/* Certificate Name (col-4) */}
                                        <div className="col-4">
                                            <p className="mb-0 fw-bold" style={{ fontSize: '0.9rem' }}>{file.name}</p>
                                        </div>

                                        {/* File Link/Name (col-5) */}
                                        <div className="col-5 d-flex align-items-center">
                                            <FileText size={16} className="me-2" style={{ color: bluePrimary }} />
                                            <p className="mb-0 text-decoration-underline" style={{ color: bluePrimary, cursor: 'pointer', fontSize: '0.9rem' }}>
                                                View Document ({file.size})
                                            </p>
                                        </div>

                                        {/* Status (col-3) */}
                                        <div className="col-3 text-start">
                                            <span className="badge bg-success-subtle text-success fw-bold">
                                                Uploaded
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted mt-2">No attachments uploaded.</p>
                            )}
                        </div>
                    </div>
                    {/* --- END ATTACHMENTS SECTION --- */}


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