import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, Info } from "lucide-react"; 
import Select from 'react-select'; 
// NOTE: Removed unused imports like FaCalendarAlt, Building, PhoneCall, etc., 
// as they are not needed in this specific 'ContractorOverview' view mode (Email Invite).

// --- Constants ---
const bluePrimary = '#005197'; 

// --- Dummy Form Components (Keeping simple Manual Entry for context) ---
// Note: These forms below are NOT the focus, but necessary if the component is fully rendered.
const ManualEntryForm = ({ formData, handleChange, handleSelectChange, handleFileChange, bluePrimary }) => (
    <div style={{ padding: '1.5rem 0' }}>
        <h3 style={{ color: bluePrimary }}>Manual Entry Form Placeholder</h3>
        <p>This section is for manual data input.</p>
    </div>
);
const AddressDetailsContent = () => <div className="mt-4 p-3 bg-light rounded">Address Details Content...</div>;
const ContactDetailsContent = () => <div className="mt-4 p-3 bg-light rounded">Contact Details Content...</div>;
const TaxDetailsContent = () => <div className="mt-4 p-3 bg-light rounded">Tax Details Content...</div>;
const BankAccountsContent = () => <div className="mt-4 p-3 bg-light rounded">Bank Accounts Content...</div>;
const AdditionalInfoContent = () => <div className="mt-4 p-3 bg-light rounded">Additional Info Content...</div>;

/**
 * Email Invite Form
 * **FIXED:** Text color for the main title matches the provided image (dark/black).
 * **STREAMLINED:** Removed unused file handling props and sections.
 */
const EmailInviteForm = ({ formData, handleChange, bluePrimary }) => (
    <>
        {/* Header Section (Matches image: Icon is blue, Title is dark) */}
        <div className="text-center mb-4">
            <Mail size={40} className="mb-3" style={{ color: bluePrimary }} /> 
            {/* 🔑 FIX: Removed bluePrimary color style from h3, making it dark/black */}
            <h3 className="fs-5 fw-bold mb-2" style={{ color: '#333' }}>Invite Contractor via Email</h3> 
            <p className="text-muted mb-4">
                Send a secure link to the contractor. They will be able to fill out their details, upload documents, and submit.
            </p>
        </div>
        
        {/* Email ID and Name Row */}
        <div className="row mb-3">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Email ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="email"
                    className="form-input w-100"
                    placeholder="Enter Contractor Email ID" 
                    name="inviteEmailID" 
                    value={formData.inviteEmailID}
                    onChange={handleChange}
                    style={{ height: '40px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Contractor Name" 
                    name="inviteName" 
                    value={formData.inviteName}
                    onChange={handleChange}
                    style={{ height: '40px', border: '1px solid #ced4da', borderRadius: '4px' }}
                />
            </div>
        </div>
        
        {/* Message Field (Used Textarea to match multi-line input in image) */}
        <div className="row mb-4">
            <div className="col-12 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Message
                </label>
                <textarea
                    className="form-input w-100"
                    rows="3"
                    placeholder="Add a personalized message..." 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    style={{ resize: "none", border: '1px solid #ced4da', borderRadius: '4px' }}
                ></textarea>
            </div>
        </div>
        
        {/* Information Alert/Hint (Matches image) */}
        <div className="d-flex align-items-center mb-5 p-2 rounded" style={{ backgroundColor: 'transparent' }}>
            <Info size={18} className="me-2" style={{ color: bluePrimary }} />
            <span className="small text-muted">
                Invitation link will be sent to the contractor's email address. They'll receive a secure link to complete their onboarding process.
            </span>
        </div>
        
        {/* Send Invitation Button (Used type="submit" so it works with the <form>) */}
        <div className="d-flex justify-content-end mt-4">
            <button type="submit" form="contractorForm" className="btn px-4 fw-bold d-flex align-items-center" 
                style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}>
                <Mail size={18} className="me-2" /> Send Invitation Link
            </button>
        </div>
    </>
);


// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------

const ContractorOverview = () => {
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState('email'); // Defaulting to 'email' view for quick testing

    const [formData, setFormData] = useState({
        // ... (Manual Entry fields omitted for brevity, but needed in real app)
        
        // Email Invite 
        inviteName: '',
        inviteEmailID: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = () => {}; // Placeholder
    const handleFileChange = () => {}; // Placeholder

    const handleGoBack = () => navigate(-1);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        if (selectedView === 'email') {
            alert(`Sending invitation to ${formData.inviteEmailID}`);
        }
    };

    const handleViewChange = (view) => setSelectedView(view);

    const getButtonStyle = (view) => ({
        backgroundColor: selectedView === view ? bluePrimary : '#E9E9E9',
        color: selectedView === view ? 'white' : bluePrimary,
        borderRadius: selectedView === view ? '6px' : '6px', 
    });

    const manualButtonStyle = getButtonStyle('manual');
    const emailButtonStyle = getButtonStyle('email');

    const buttonGroupStyle = {
        borderRadius: '6px',
        border: `1px solid ${bluePrimary}`,
        overflow: 'hidden',
    };

    // ----------------------------------------------------------------------
    // 3. RENDER
    // ----------------------------------------------------------------------

    return (
        <div className="container-fluid min-vh-100 p-0">
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>
            <div className="px-4 text-start">
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('manual')} style={manualButtonStyle}>
                        <Pencil size={20} className="me-2" /> Manual Entry
                    </button>
                    <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('email')} style={emailButtonStyle}>
                        <Mail size={20} className="me-2" /> Email Invite
                    </button>
                </div>
                
                {/* Form starts here to capture input data */}
                <form id="contractorForm" onSubmit={handleSubmit}>
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                        {selectedView === 'manual' ? 
                            <ManualEntryForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange} 
                                handleFileChange={handleFileChange} 
                                bluePrimary={bluePrimary}
                            /> : 
                            <EmailInviteForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                bluePrimary={bluePrimary} // Pass color constant for styling
                            />
                        }
                    </div>
                    
                    {/* Placeholder content for Manual Entry, rendered outside the main card */}
                    {selectedView === 'manual' && <AddressDetailsContent bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <ContactDetailsContent bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <TaxDetailsContent bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <BankAccountsContent bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <AdditionalInfoContent bluePrimary={bluePrimary} />}
                </form>

                {/* Submit/Cancel buttons only for Manual Entry mode (Email form has its own submit button) */}
                {selectedView === 'manual' && (
                    <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" style={{ borderRadius: "6px" }}>Cancel</button>
                        <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Submit</button>
                    </div>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;