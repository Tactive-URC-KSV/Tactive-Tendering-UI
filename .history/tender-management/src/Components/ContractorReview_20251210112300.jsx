import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function ContractorReview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);

    return (
        <div className="container-fluid p-4">
            {/* Back */}
            <div className="d-flex align-items-center mb-3" onClick={handleGoBack} style={{ cursor: "pointer" }}>
                <ArrowLeft size={20} className="me-2" />
                <span className="fw-semibold">New Contractor</span>
            </div>

            {/* Main Card */}
            <div className="card shadow-sm p-4" style={{ borderRadius: "12px" }}>
                
                {/* TITLE */}
                <h4 className="fw-bold mb-1" style={{ color: "#0F4C81" }}>
                    Review & Submit
                </h4>
                <p className="text-muted mb-4" style={{ fontSize: "15px" }}>
                    Please verify all the information below is correct before submitting…
                </p>

                {/* --- BASIC INFORMATION --- */}
                <h5 className="fw-bold" style={{ color: "#0F4C81" }}>Basic Information</h5>
                <div className="text-muted mb-3">Core details of the entity</div>

                {/* Row 1 */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="fw-semibold text-muted">Entity Code</div>
                        <div className="fw-bold">abc</div>
                    </div>
                    <div className="col-md-3">
                        <div className="fw-semibold text-muted">Entity Name</div>
                        <div className="fw-bold">def</div>
                    </div>
                    <div className="col-md-3">
                        <div className="fw-semibold text-muted">Effective Date</div>
                        <div className="fw-bold">112/12/2025</div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="row mb-4">
                    <div className="col-md-3">
                        <div className="fw-semibold text-muted">Entity Type</div>
                        <div className="fw-bold">contractor</div>
                    </div>
                    <div className="col-md-3">
                        <div className="fw-semibold text-muted">Nature of Business</div>
                        <div className="fw-bold">contracting_services</div>
                    </div>
                    <div className="col-md-3">
                        <div className="fw-semibold text-muted">Grade</div>
                        <div className="fw-bold">a_grade</div>
                    </div>
                </div>

                {/* --- ATTACHMENTS SECTION --- */}
                <div className="mt-2">
                    <h5 className="fw-bold" style={{ color: "#0F4C81" }}>
                        Attachments (Certificates/Licenses)
                    </h5>

                    <div className="text-muted mb-2" style={{ fontSize: "14px" }}>
                        Uploaded documents
                    </div>

                    {/* --- Figma-Style Attachment Card --- */}
                    <div
                        className="d-flex align-items-center justify-content-between p-3"
                        style={{
                            width: "420px",
                            backgroundColor: "#F4F7FB",
                            border: "1px solid #E2E8F0",
                            borderRadius: "12px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                        }}
                    >
                        {/* Left: Icon + Text */}
                        <div className="d-flex">
                            <i className="bi bi-file-earmark-pdf" style={{ fontSize: "32px", color: "#0F4C81" }}></i>

                            <div className="ms-3">
                                <div className="fw-semibold" style={{ fontSize: "15px" }}>
                                    BOQ_Green Heights.pdf
                                </div>
                                <div className="text-muted" style={{ fontSize: "13px" }}>
                                    application/pdf • 0 KB
                                </div>
                            </div>
                        </div>

                        {/* Right: View Button */}
                        <button
                            className="btn btn-link p-0"
                            style={{ color: "#0F4C81", fontWeight: "600" }}
                        >
                            View
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-4" />

                {/* Buttons */}
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-outline-secondary me-3 px-4"
                        style={{ borderRadius: "6px" }}
                        onClick={handleGoBack}
                    >
                        Edit
                    </button>

                    <button className="btn px-4 text-white" style={{ backgroundColor: "#0F4C81", borderRadius: "6px" }}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContractorReview;
