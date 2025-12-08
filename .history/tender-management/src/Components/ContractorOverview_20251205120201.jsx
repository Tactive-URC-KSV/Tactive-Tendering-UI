import React, { useState } from "react";
// Import useNavigate along with other imports
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

    // 2. Define the appearance for active/inactive buttons
    const manualBtnClass = selectedView === 'manual' 
        ? 'btn btn-primary d-flex align-items-center' // Active/Selected style
        : 'btn btn-outline-primary d-flex align-items-center'; // Inactive style

    const emailBtnClass = selectedView === 'email' 
        ? 'btn btn-primary d-flex align-items-center' // Active/Selected style
        : 'btn btn-outline-primary d-flex align-items-center'; // Inactive style

    return (
        <div className="container-fluid min-vh-100">
            
            {/* Header Section */}
            <div className="d-flex align-items-center py-3 mb-4">
                {/* Back Arrow Icon - NOW CALLS handleGoBack */}
                <ArrowLeft 
                    size={24} 
                    className="me-3 cursor-pointer" 
                    onClick={handleGoBack} // <--- Updated line
                    style={{ cursor: 'pointer' }} 
                />
                <h2 className="mb-0">New Contractor</h2>
            </div>
            
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
            <div className="card p-4">
                {selectedView === 'manual' ? (
                    <div>
                        ### Manual Entry Form 📝
                        <p>Content for manually adding a new contractor goes here...</p>
                    </div>
                ) : (
                    <div>
                        ### Email Invite Setup 📧
                        <p>Content for sending an email invite goes here...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContractorOverview;