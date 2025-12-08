import React, { useState } from "react";
// Import useNavigate for the back button functionality
import { useNavigate } from "react-router-dom"; 
// Import icons from lucide-react
import { ArrowLeft, Pencil, Mail } from "lucide-react";

function ContractorOverview() {
    // 1. Hooks initialization
    const navigate = useNavigate();
    // State tracks the selected view ('manual' is active by default)
    const [selectedView, setSelectedView] = useState('manual'); 

    // 2. Handlers
    const handleGoBack = () => {
        // Navigates one step back in the browser history (requires React Router setup)
        navigate(-1); 
    };

    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    // --- 3. Dynamic Class and Style Definitions for Toggle Buttons ---
    
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    
    // Class for Manual Entry button
    // Active: Filled Blue (btn-primary), Inactive: Outline/Light (btn-light border)
    const manualBtnClass = isManualActive 
        ? 'btn btn-primary d-flex align-items-center text-white fw-bold' 
        : 'btn btn-light border d-flex align-items-center text-primary fw-bold'; 

    // Class for Email Invite button
    // Active: Filled Blue (btn-primary), Inactive: Outline/Light (btn-light border)
    const emailBtnClass = isEmailActive 
        ? 'btn btn-primary d-flex align-items-center text-white fw-bold' 
        : 'btn btn-light border d-flex align-items-center text-primary fw-bold'; 

    // Style for the button group container (matches the continuous look)
    const buttonGroupStyle = {
        display: 'inline-flex',
        borderRadius: '6px', 
        overflow: 'hidden', 
        // Optional: Add a subtle border to the whole group when one is active
        boxShadow: isManualActive ? '0 0 0 1px var(--bs-primary)' : (isEmailActive ? '0 0 0 1px var(--bs-primary)' : 'none'),
    };

    // Dynamic styles to control the corners to create the joined effect
    const manualButtonStyle = { 
        flex: 1, 
        paddingLeft: '20px', // Extra padding for alignment
        paddingRight: '20px',
        // Remove radius on the right edge when active
        borderTopRightRadius: isManualActive ? 0 : '6px', 
        borderBottomRightRadius: isManualActive ? 0 : '6px',
        borderColor: isManualActive ? 'transparent' : undefined,
        transition: 'all 0.3s'
    };

    const emailButtonStyle = { 
        flex: 1, 
        paddingLeft: '20px', // Extra padding for alignment
        paddingRight: '20px',
        // Remove radius on the left edge when active
        borderTopLeftRadius: isEmailActive ? 0 : '6px', 
        borderBottomLeftRadius: isEmailActive ? 0 : '6px',
        borderColor: isEmailActive ? 'transparent' : undefined,
        transition: 'all 0.3s'
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            {/* --- 1. Header Section (Matching Screenshot) --- */}
            <div className="d-flex align-items-center py-3 px-4 mb-4 bg-white shadow-sm">
                <ArrowLeft 
                    size={24} 
                    className="me-3" 
                    onClick={handleGoBack} // BACK BUTTON FUNCTIONALITY
                    style={{ cursor: 'pointer' }}
                />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>
            
            {/* Main Content Area */}
            <div className="px-4">

                {/* --- 2. Toggle Buttons Section (Matching Screenshot) --- */}
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

                {/* --- Content Placeholder Section (Hidden Details as requested) --- */}
                <div className="p-4 border rounded bg-white" style={{ minHeight: '300px' }}>
                    {selectedView === 'manual' ? (
                        <p className="text-muted">Content for Manual Entry Form goes here.</p>
                    ) : (
                        <p className="text-muted">Content for Email Invite Setup goes here.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ContractorOverview;