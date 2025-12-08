import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, Pencil, Mail } from "lucide-react";

function ContractorOverview() {
    // Initialize the useNavigate hook
    const navigate = useNavigate();
    
    // Function to handle the backward navigation
    const handleGoBack = () => {
        // This function navigates one step back in the browser history
        navigate(-1); 
    };

    // 1. Use state to track which view is currently selected
    const [selectedView, setSelectedView] = useState('manual'); // 'manual' or 'email'

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

    // Dynamic styles to remove corner radius where the buttons meet and control padding
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
            
            {/* Header Section: Reverted to your original structure, but with better styling */}
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                {/* Back Arrow Icon */}
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
            
                {/* Toggle Buttons Section: Changed to d-inline-flex and removed flex: 1 from buttons */}
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    
                    {/* Manual Entry Button */}
                    <button 
                        className={manualBtnClass} 
                        onClick={() => handleViewChange('manual')}
                        style={manualButtonStyle} // Use specific styles for rounded corners
                    >
                        <Pencil size={20} className="me-2" />
                        Manual Entry
                    </button>

                    {/* Email Invite Button */}
                    <button 
                        className={emailBtnClass} 
                        onClick={() => handleViewChange('email')}
                        style={emailButtonStyle} // Use specific styles for rounded corners
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