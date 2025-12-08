import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, Pencil, Mail } from "lucide-react";

function ContractorOverview() {
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        navigate(-1); 
    };

    const [selectedView, setSelectedView] = useState('manual'); 

    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    // --- Dynamic Class and Style Definitions ---
    
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';

    // Active button: filled blue (btn-primary, text-white), Inactive: outline (btn-light border, text-primary)
    const manualBtnClass = isManualActive 
        ? 'btn btn-primary d-flex align-items-center text-white fw-bold' 
        : 'btn btn-light border d-flex align-items-center text-primary fw-bold'; 

    const emailBtnClass = isEmailActive 
        ? 'btn btn-primary d-flex align-items-center text-white fw-bold' 
        : 'btn btn-light border d-flex align-items-center text-primary fw-bold'; 

    // Style for the button group container (d-inline-flex wraps content, ensuring it's not full width)
    const buttonGroupStyle = {
        borderRadius: '6px', 
        overflow: 'hidden', 
        boxShadow: (isManualActive || isEmailActive) ? '0 0 0 1px var(--bs-primary)' : 'none',
    };

    // Dynamic styles to remove corner radius where the buttons meet
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
            
            {/* Header Section */}
            <div className="d-flex align-items-center py-3 px-4 mb-4 bg-white shadow-sm">
                <ArrowLeft 
                    size={24} 
                    className="me-3 cursor-pointer" 
                    onClick={handleGoBack} 
                    style={{ cursor: 'pointer' }} 
                />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            {/* Main Content Area for Centering the Toggle */}
            <div className="px-4 text-center"> 
            
                {/* Toggle Buttons Section: Fixed with d-inline-flex for correct width */}
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    
                    {/* Manual Entry Button */}
                    <button 
                        className={manualBtnClass} 
                        onClick={() => handleViewChange('manual')}
                        style={manualButtonStyle}
                    >
                        <Pencil size={20} className="me-2" />
                        Manual Entry
                    </button>

                    {/* Email Invite Button */}
                    <button 
                        className={emailBtnClass} 
                        onClick={() => handleViewChange('email')}
                        style={emailButtonStyle}
                    >
                        <Mail size={20} className="me-2" />
                        Email Invite
                    </button>
                </div>

                {/* Content Section - Toggles based on state */}
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