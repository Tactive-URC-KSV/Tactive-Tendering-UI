import React, { useState } from "react";
// Import useNavigate for the back button functionality
import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, Pencil, Mail } from "lucide-react";

function ContractorOverview() {
    // Hooks initialization
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState('manual'); 

    // Handlers
    const handleGoBack = () => {
        // Navigates one step back in the browser history
        navigate(-1); 
    };

    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    // --- Dynamic Class Definitions using Bootstrap ---
    
    const isManualActive = selectedView === 'manual';
    // Active: btn-primary (Filled Blue), Inactive: btn-light border (Outline Look)
    const manualBtnClass = isManualActive 
        ? 'btn btn-primary d-flex align-items-center text-white' 
        : 'btn btn-light border d-flex align-items-center text-primary'; 

    const isEmailActive = selectedView === 'email';
    // Active: btn-primary (Filled Blue), Inactive: btn-light border (Outline Look)
    const emailBtnClass = isEmailActive 
        ? 'btn btn-primary d-flex align-items-center text-white' 
        : 'btn btn-light border d-flex align-items-center text-primary'; 

    // Style for the button group container (to achieve the joined look)
    const buttonGroupStyle = {
        display: 'inline-flex',
        borderRadius: '6px', 
        overflow: 'hidden', 
    };

    // Dynamic styles to control the corners
    const manualButtonStyle = { 
        flex: 1, 
        borderTopRightRadius: isManualActive ? 0 : '6px', 
        borderBottomRightRadius: isManualActive ? 0 : '6px',
        borderColor: isManualActive ? 'transparent' : undefined,
        transition: 'all 0.3s'
    };

    const emailButtonStyle = { 
        flex: 1, 
        borderTopLeftRadius: isEmailActive ? 0 : '6px', 
        borderBottomLeftRadius: isEmailActive ? 0 : '6px',
        borderColor: isEmailActive ? 'transparent' : undefined,
        transition: 'all 0.3s'
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* --- Header Section (Back Arrow and Title) --- */}
            <div className="d-flex align-items-center py-3 px-4 mb-4 bg-white shadow-sm">
                <ArrowLeft 
                    size={24} 
                    className="me-3" 
                    onClick={handleGoBack} 
                    style={{ cursor: 'pointer' }}
                />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>
            
            {/* Main Content Area */}
            <div className="px-4">

                {/* --- Toggle Buttons Section --- */}
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

                {/* --- Content Placeholder Section --- */}
                <div className="p-4 border rounded bg-white" style={{ minHeight: '300px' }}>
                    {selectedView === 'manual' ? (
                        <h4 className="text-primary">Manual Entry View Active (Content Hidden)</h4>
                    ) : (
                        <h4 className="text-primary">Email Invite View Active (Content Hidden)</h4>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContractorOverview;