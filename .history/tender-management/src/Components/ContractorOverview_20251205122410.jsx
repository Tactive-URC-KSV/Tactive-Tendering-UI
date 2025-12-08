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
    
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';

    // Classes
    const manualBtnClass = 'btn d-flex align-items-center fw-bold'; 
    const emailBtnClass = 'btn d-flex align-items-center fw-bold'; 

    const buttonGroupStyle = {
        borderRadius: '6px', 
        overflow: 'hidden', 
        boxShadow: (isManualActive || isEmailActive) ? '0 0 0 1px #005197' : 'none',
    };

    // Inline styles with #005197 for active and inactive buttons
    const manualButtonStyle = { 
        paddingLeft: '20px', 
        paddingRight: '20px',
        borderTopRightRadius: isManualActive ? 0 : '6px', 
        borderBottomRightRadius: isManualActive ? 0 : '6px',
        border: '1px solid #005197',
        backgroundColor: isManualActive ? '#005197' : 'white',
        color: isManualActive ? 'white' : '#005197',
        transition: 'all 0.3s'
    };

    const emailButtonStyle = { 
        paddingLeft: '20px', 
        paddingRight: '20px',
        borderTopLeftRadius: isEmailActive ? 0 : '6px', 
        borderBottomLeftRadius: isEmailActive ? 0 : '6px',
        border: '1px solid #005197',
        backgroundColor: isEmailActive ? '#005197' : 'white',
        color: isEmailActive ? 'white' : '#005197',
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
