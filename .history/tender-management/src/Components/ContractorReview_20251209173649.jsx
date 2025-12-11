import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
const bluePrimary = "#005197"; 


/**
 * Wrapper component for each major section card.
 */
const ReviewSectionWrapper = ({ title, icon: Icon, children }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* Blue Header Bar (Styling unchanged, as this matches your design) */}
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Icon size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">{title}</h3>
        </div>
        {/* Row container for the field content */}
        <div className="row">
            {children}
        </div>
    </div>
);


function ContractorReview() {
    // 1. Data Retrieval (CRITICAL: Needs correct data passing from ContractorOverview)
    const location = useLocation();
    const formData = location.state?.formData || {};
    
    // 2. Navigation
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    
    // Placeholder for final submission logic
    const handleSubmitFinal = () => {
        console.log("Submitting final contractor data:", formData);
        // Integrate your final submission API call here
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* Top Navigation Header */}
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">
                
                {/* Review & Submit Summary Card */}
                <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                    <div className="d-flex align-items-center mb-3">
                        <CheckCircle size={24} className="me-2" style={{ color: '#28a745' }} /> 
                        <h4 className="fw-bold mb-0 text-dark">Review & Submit</h4>
                    </div>
                    <p className="text-muted mb-0">Please verify the information below before final submission.</p>
                </div>



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