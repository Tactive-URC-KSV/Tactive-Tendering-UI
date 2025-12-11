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
        phoneNo,
    emailId,
    addressType,
    address1,
    address2,
    country,
    city,
    zipCode
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

                    <div className="attachments-section mt-4">
                        <h5 className="fw-bold mb-3" 
                            style={{ 
                                color: labelTextColor,
                                width: "66%",
                                marginLeft: "auto",
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
                                <p className="text-muted ms-1">  style={{ 
                                color: labelTextColor,
                                width: "66%",
                                marginLeft: "auto",
                            }} No attachments uploaded.</p>
                            )}
                        </div>
                    </div>

                    {/* Address Details Section */}
<div className="row mt-5">

    {/* Left title section */}
    <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
        <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Address Details</h5>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Registered company address</p>
    </div>

    {/* Right content section */}
    <div className="col-lg-8 col-md-12 col-sm-12">

        <div className="row">
            <DetailItem label="Phone No" value={formData.phoneNo} />
            <DetailItem label="Email ID" value={formData.emailId} />
            <DetailItem label="Address Type" value={formData.addressType} />
        </div>

        <div className="row">
            <DetailItem label="Address 1" value={formData.address1} />
            <DetailItem label="Address 2" value={formData.address2} />
        </div>

        <div className="row mb-4">
            <DetailItem label="Country" value={formData.country} />
            <DetailItem label="City" value={formData.city} />
            <DetailItem label="Zip/Postal Code" value={formData.zipCode} />
        </div>
    </div>
</div>

                    

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
