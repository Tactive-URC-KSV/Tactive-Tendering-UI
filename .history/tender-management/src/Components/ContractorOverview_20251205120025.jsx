import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { ArrowLeft, Pencil, Mail } from "lucide-react";

function ContractorOverview() {
    // Hooks initialization
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState('manual'); 

    // Handlers
    const handleGoBack = () => {
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

    // Style for the button group container
    const buttonGroupStyle = {
        display: 'inline-flex', // Use d-inline-flex equivalent for size control
        borderRadius: '6px', 
        overflow: 'hidden', 
        boxShadow: isManualActive || isEmailActive ? '0 0 0 1px var(--bs-primary)' : 'none', // Optional: Add a border effect to the group
    };

    // Dynamic styles to control the corners to create the joined effect
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
            {/* --- Header Section --- */}
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

                {/* --- Content Sections --- */}
                {selectedView === 'manual' && (
                    <div className="mb-4">
                        {/* Header for Basic Information using bg-primary for blue background */}
                        <div className="bg-primary text-white p-3 mb-4 rounded-top">
                            <h3 className="mb-0 fs-6 d-flex align-items-center">
                                <span className="me-2">📝</span> Basic Information
                            </h3>
                        </div>
                        {/* Form area using card-like styling (border/bg-white) */}
                        <div className="p-4 border rounded-bottom bg-white">
                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Entity Code <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter entity code" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Entity Name <span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" placeholder="Enter entity name" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Effective Date <span className="text-danger">*</span></label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" placeholder="mm/dd/yyyy" />
                                        <span className="input-group-text"><Mail size={16} /></span> 
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Entity Type <span className="text-danger">*</span></label>
                                    <select className="form-select">
                                        <option>Contractor</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Nature of Business</label>
                                    <select className="form-select">
                                        <option>Select nature of business</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectedView === 'email' && (
                    <div className="card p-4">
                        <h4 className="text-primary">Email Invite Setup 📧</h4>
                        <p>This section would contain the form for sending an email invitation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContractorOverview;