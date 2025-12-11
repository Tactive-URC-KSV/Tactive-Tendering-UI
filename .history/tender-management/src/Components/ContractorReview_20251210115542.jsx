import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const grayHeader = "#6c757d"; // Requested grey color for the Attachments header

const DetailItem = ({ label, value }) => {
    const displayValue = value ? value : '\u00A0';
    return (
        // These fields are 1/3 of the col-lg-8 parent container
        <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <div className="text-start">
                <p className="detail-label mb-1 text-muted fw-normal fs-6">{label}</p>
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
    } = formData;

    const hasAttachments = attachments && attachments.length > 0;
    const displayAttachments = hasAttachments ? attachments : [];

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

                    {/* SECTION: Review */}
                    <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                        <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                    </div>

                    {/* ROW: Basic Info & Entity Details */}
                    <div className="row mt-4">

                        {/* LEFT COLUMN (col-lg-4): Basic Information Header */}
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                        </div>

                        {/* RIGHT COLUMN (col-lg-8): Data Fields */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            
                            {/* Visual Row 1: Entity Code, Entity Name, Effective Date */}
                            <div className="row">
                                <DetailItem label="Entity Code" value={entityCode} />
                                <DetailItem label="Entity Name" value={entityName} />
                                <DetailItem label="Effective Date" value={effectiveDate} />
                            </div>

                            {/* Visual Row 2: Entity Type, Nature of Business, Grade */}
                            <div className="row">
                                <DetailItem label="Entity Type" value={entityType} />
                                <DetailItem label="Nature of Business" value={natureOfBusiness} />
                                <DetailItem label="Grade" value={grade} />
                            </div>
                        </div>
                    </div>
                    {/* END ROW: Basic Info & Entity Details */}
                    
                    {/* ROW: Attachments Header and List (Needs Alignment) */}
                    <div className="row mt-4">
                        
                        {/* LEFT COLUMN (col-lg-4): Empty Placeholder */}
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            {/* Empty to push content right */}
                        </div>

                        {/* RIGHT COLUMN (col-lg-8): Attachments Header and List */}
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            
                            {/* Attachments Header: Aligns with data fields, color is grey */}
                            <h5 className="fw-bold mb-3" style={{ color: grayHeader }}>
                                Attachments (Certificates/Licenses)
                            </h5>

                            {/* Attachment File List (Reduced Width, Right Aligned) */}
                            <div className="mt-2">
                                {displayAttachments.length > 0 ? (
                                    displayAttachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="d-flex justify-content-between align-items-center p-3 rounded mb-3 shadow-sm"
                                            style={{
                                                border: '1px solid #d9d9d9',
                                                width: "75%", 
                                                marginLeft: "auto", // 🚨 ALIGNS RIGHT
                                                backgroundColor: "#f7faff",
                                                borderRadius: "6px"
                                            }}
                                        >
                                            <div className="d-flex align-items-center">
                                                <FileText size={24} className="me-3" style={{ color: bluePrimary }} />
                                                <div>
                                                    <p className="mb-0 fw-bold" style={{ fontSize: "0.95rem" }}>{file.name}</p>
                                                    <small className="text-muted">{file.type} • {file.size}</small>
                                                </div>
                                            </div>

                                            <button
                                                className="btn btn-sm fw-bold"
                                                style={{
                                                    color: bluePrimary,
                                                    border: "none",
                                                    background: "transparent"
                                                }}
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted ms-1">No attachments uploaded.</p>
                                )}
                            </div>
                        </div>
                    </div>

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