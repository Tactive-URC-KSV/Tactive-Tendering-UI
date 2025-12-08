import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, Pencil, Mail } from "lucide-react";

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1); 
    };
    const [selectedView, setSelectedView] = useState('manual'); 

    // Function to handle the view selection
    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    // --- Dynamic Class Definitions based on the Image ---
    
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';

    // Active button must be filled blue (btn-primary), Inactive must be outline/light (btn-light border)
    // Added fw-bold to match image font weight
    const manualBtnClass = isManualActive 
        ? 'btn btn-primary d-flex align-items-center text-white fw-bold' 
        : 'btn btn-light border d-flex align-items-center text-primary fw-bold'; 

    const emailBtnClass = isEmailActive 
        ? 'btn btn-primary d-flex align-items-center text-white fw-bold' 
        : 'btn btn-light border d-flex align-items-center text-primary fw-bold'; 

    // Style for the button group container (d-inline-flex is key for wrapping content)
    const buttonGroupStyle = {
        borderRadius: '6px', 
        overflow: 'hidden', 
        // Add subtle border effect around the group
        boxShadow: (isManualActive || isEmailActive) ? '0 0 0 1px var(--bs-primary)' : 'none',
    };
    
    const manualButtonStyle = { 
        paddingLeft: '20px', 
        paddingRight: '20px',
        borderTopRightRadius: isManualActive ? 0 : '6px', 
        borderBottomRightRadius: isManualActive ? 0 : '6px',
        borderColor: isManualActive ? 'transparent' : undefined,
        transition: 'all 0.3s'
    };

    const emailButtonStyle = { 
        paddingLeft: '20px', 
        paddingRight: '20px',
        borderTopLeftRadius: isEmailActive ? 0 : '6px', 
        borderBottomLeftRadius: isEmailActive ? 0 : '6px',
        borderColor: isEmailActive ? 'transparent' : undefined,
        transition: 'all 0.3s'
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft 
                    size={24} 
                    className="me-3 cursor-pointer" 
                    onClick={handleGoBack} 
                    style={{ cursor: 'pointer' }} 
                />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>
            <div className="px-4 text-center"> 
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    <button 
                        className={manualBtnClass} 
                        onClick={() => handleViewChange('manual')}
                        style={manualButtonStyle} 
                    >
                        <Pencil size={20} className="me-2" />
                        Manual Entry
                    </button>
                    <button 
                        className={emailBtnClass} 
                        onClick={() => handleViewChange('email')}
                        style={emailButtonStyle} 
                    >
                        <Mail size={20} className="me-2" />
                        Email Invite
                    </button>
                </div>
                <div className="card p-4 text-start">
                    {selectedView === 'manual' ? (
                        <div>
                            <h4 className="text-primary">Manual Entry View Active (Content Placeholder)</h4>
                            <p>Content for manually adding a new contractor goes here...</p>
                        </div>
                    ) : (
                        <div>
                            <h4 className="text-primary">Email Invite View Active (Content Placeholder)</h4>
                            <p>Content for sending an email invite goes here...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContractorOverview;