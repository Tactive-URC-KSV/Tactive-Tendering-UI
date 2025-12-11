import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MapPin, User, Briefcase, DollarSign, Info } from 'lucide-react';

const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const labelTextColor = '#00000080';
const STORAGE_KEY = 'contractorFormData';

// ... (DetailItem component remains the same) ...

const DetailItem = ({ label, value }) => { 
    // ... (content of DetailItem component) ... 
};

function ContractorReview() {
    const location = useLocation();
    const formData = location.state?.formData || {};

    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);

    const handleSubmitFinal = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        navigate('/ContractorOnboarding'); 
    };

    // 🌟 NEW FUNCTION: Handler to view the selected file
    const handleViewFile = (file) => {
        // --- VIEWING LOGIC ---
        
        // 1. Check for a direct data reference (e.g., a Data URL or Blob URL saved during upload)
        if (file.fileData) {
            // Opens the data URL or Blob URL in a new tab for native browser viewing (PDFs, images)
            window.open(file.fileData, '_blank');
        } else {
            // 2. Fallback/Error if the file reference is missing
            alert(`Could not view "${file.name}". The required file data/URL was not found in the form data. (Requires server-side file hosting for production use.)`);
        }
    };
    
    // Destructure all expected fields from formData
    const {
        // ... (all other destructured variables) ...
        attachmentMetadata = [], // Ensure it defaults to an array
        // ... (rest of destructured variables) ...
    } = formData;

    const hasAttachments = attachmentMetadata && attachmentMetadata.length > 0;

    return (
        <div className="container-fluid min-vh-100 p-0">

            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">

                <div className="bg-white p-4 mb-4 shadow-sm" style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}>
                    
                    {/* ... (Basic Info Section) ... */}

                    {/* Attachments Section (Updated with onClick handler) */}
                    <div className="attachments-section pb-4">
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
                                                <p className="mb-0 fw-medium">{file.name || 'Untitled File'}</p>
                                                <small className="text-muted">
                                                    {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'Size N/A'}
                                                    {file.lastModified ? ` • Modified: ${new Date(file.lastModified).toLocaleDateString()}` : ''}
                                                </small>
                                            </div>
                                        </div>
                                        
                                        {/* 🎯 "View" Button Implementation */}
                                        <button 
                                            className="btn btn-sm" 
                                            style={{ color: bluePrimary }}
                                            onClick={() => handleViewFile(file)} // Call the new handler
                                        >
                                            View
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-muted p-3" style={{ width: "66%", marginLeft: "auto" }}>
                                    No attachments uploaded.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ... (Rest of the review sections) ... */}
                
                </div> 
                <div className="d-flex justify-content-end mt-4 pb-5"> 
                    {/* ... (Edit and Submit Buttons remain the same) ... */}
                </div>

            </div>
        </div>
    );
}

export default ContractorReview;