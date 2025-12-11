import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
const bluePrimary = "#005197"; 





function ContractorReview() {
    const location = useLocation();
    const formData = location.state?.formData || {};
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">
                <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark">Review & Submit</h4>
                    </div>
                    <p className="text-muted mb-0">Please verify all the information below is correct before final submitting...</p>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleGoBack} style={{ borderRadius: "6px" }}>
                        Edit
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSubmitFinal}
                        className="btn px-4 fw-bold" 
                        style={{ backgroundColor: '#005197CC', color: "white", borderRadius: "6px", borderColor: '#28a745' }}
                    >
                        Submit
                    </button>
                </div>
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorReview;