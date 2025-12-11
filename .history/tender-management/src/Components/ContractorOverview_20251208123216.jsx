import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, Info, FileText, Building, PhoneCall, Receipt, Landmark, UploadCloud } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

// --- Constants ---
const bluePrimary = '#005197'; 
const darkTextColor = '#333'; // Used for main text, like the Email Invite title

// --- Placeholder Options (Essential for Select components) ---
const entityTypeOptions = [{ label: 'Individual', value: 'individual' }, { label: 'Company', value: 'company' }]; 
const natureOfBusinessOptions = [{ label: 'IT Services', value: 'it' }, { label: 'Construction', value: 'construction' }]; 
const gradeOptions = [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }];
const addressTypeOptions = [{ label: 'Office', value: 'office' }, { label: 'Residential', value: 'residential' }]; 
const countryOptions = [{ label: 'India', value: 'IN' }, { label: 'USA', value: 'US' }]; 
const addresscityOptions = [{ label: 'Mumbai', value: 'mumbai' }, { label: 'Delhi', value: 'delhi' }];
const contactPositionOptions = [{ label: 'Manager', value: 'manager' }, { label: 'Owner', value: 'owner' }]; 
const territoryTypeOptions = [{ label: 'National', value: 'national' }, { label: 'State', value: 'state' }]; 
const taxTypeOptions = [{ label: 'VAT', value: 'vat' }, { label: 'GST', value: 'gst' }];
const territoryOptions = [{ label: 'Maharashtra', value: 'MH' }, { label: 'Texas', value: 'TX' }]; 
const taxCityOptions = [{ label: 'Pune', value: 'pune' }, { label: 'Bangalore', value: 'bangalore' }]; 
const additionalInfoTypeOptions = [{ label: 'Cert', value: 'cert' }, { label: 'License', value: 'license' }];

// ----------------------------------------------------------------------
// 1. NESTED FORM COMPONENTS
// ----------------------------------------------------------------------

/**
 * Custom Upload Component (Kept for Manual Form consistency)
 */
const UploadDocumentSection = ({ file, handleFileChange, bluePrimary }) => (
    <div className="row mb-4">
        <div className="col-12 mt-3">
            <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>
            
            <div 
                className="p-4 text-center rounded" 
                style={{  
                    cursor: "pointer", 
                    border: `2px dashed ${bluePrimary}B2`, 
                    borderRadius: '8px',
                    backgroundColor: file ? '#E6F0FF' : 'transparent' 
                }}
            >
                <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                
                <label htmlFor="fileUpload" className="d-block cursor-pointer">
                    <UploadCloud size={30} className="mb-2" style={{ color: bluePrimary }} /> 
                    {file ? (
                        <p className="mb-1 fw-bold text-success text-truncate" style={{ maxWidth: '100%' }}>File uploaded: {file.name}</p>
                    ) : (
                        <p className="mb-1 fw-bold" style={{ color: bluePrimary }}>Click to upload or drag and drop</p>
                    )}
                    <p className="mb-0 small text-muted">PDF, DOCX up to 10MB</p>
                </label>
            </div>
        </div>
    </div>
);


/**
 * Manual Entry Form (Basic Information)
 */
const ManualEntryForm = ({ formData, handleChange, handleSelectChange, handleFileChange, bluePrimary }) => (
    <>
        <div
            className="p-3 mb-4 d-flex align-items-center justify-content-center"
            style={{
                backgroundColor: bluePrimary,
                width: "calc(100% + 3rem)",
                marginLeft: "-1.5rem",
                marginRight: "-1.5rem",
                borderRadius: "8px 8px 0 0",
            }}
        >
            <FileText size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
        </div>

        <div className="row mb-3">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-input w-100" placeholder="Enter Entity Code" name="entityCode" value={formData.entityCode} onChange={handleChange} />
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-input w-100" placeholder="Enter Entity Name" name="entityName" value={formData.entityName} onChange={handleChange} />
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-md-6 mb-3">
                <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date<span style={{ color: "red" }}>*</span></label>
                <div className="input-group">
                    <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
            </div>

            <div className="col-md-6 mb-3">
                <label htmlFor="entityType" className="projectform-select text-start d-block">Entity Type <span style={{ color: "red" }}>*</span></label>
                <Select
                    name="entityType"
                    options={entityTypeOptions}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'entityType' })}
                    classNamePrefix="select"
                    value={entityTypeOptions.find(option => option.value === formData.entityType)}
                    placeholder="Select entity type"
                />
            </div>
        </div>

        <div className="row mb-4">
            <div className="col-md-6 mb-3">
                <label htmlFor="natureOfBusiness" className="projectform-select text-start d-block">Nature of business</label>
                <Select
                    name="natureOfBusiness"
                    options={natureOfBusinessOptions}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'natureOfBusiness' })}
                    classNamePrefix="select"
                    value={natureOfBusinessOptions.find(option => option.value === formData.natureOfBusiness)}
                    placeholder="Select nature of business"
                />
            </div>
        
            <div className="col-md-6 mb-3">
                <label htmlFor="grade" className="projectform-select text-start d-block">Grade</label>
                <Select
                    name="grade"
                    options={gradeOptions}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'grade' })}
                    classNamePrefix="select"
                    value={gradeOptions.find(option => option.value === formData.grade)}
                    placeholder="Select grades"
                />
            </div>
        </div>
        
        <UploadDocumentSection 
            file={formData.attachment} 
            handleFileChange={handleFileChange} 
            bluePrimary={bluePrimary}
        />
    </>
);

/**
 * Email Invite Form (Corrected to match UI/Figma)
 */
const EmailInviteForm = ({ formData, handleChange, bluePrimary, darkTextColor }) => (
    <>
        {/* Header Section (Icon is blue, Title is dark) */}
        <div className="text-center mb-4">
            <Mail size={40} className="mb-3" style={{ color: bluePrimary }} /> 
            <h3 className="fs-5 fw-bold mb-2" style={{ color: darkTextColor }}>Invite Contractor via Email</h3> 
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
        
        {/* Message Field */}
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
        
        {/* Information Alert/Hint */}
        <div className="d-flex align-items-center mb-5 p-2 rounded" style={{ backgroundColor: 'transparent' }}>
            <Info size={18} className="me-2" style={{ color: bluePrimary }} />
            <span className="small text-muted">
                Invitation link will be sent to the contractor's email address. They'll receive a secure link to complete their onboarding process.
            </span>
        </div>
        
        {/* Send Invitation Button */}
        <div className="d-flex justify-content-end mt-4">
            <button type="submit" form="contractorForm" className="btn px-4 fw-bold d-flex align-items-center" 
                style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}>
                <Mail size={18} className="me-2" /> Send Invitation Link
            </button>
        </div>
    </>
);


/**
 * Placeholder components for Manual Entry (Minimal content for brevity)
 */
const AddressDetailsContent = ({ formData, handleChange, handleSelectChange, bluePrimary }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Building size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
        </div>
        <p className="text-muted">Content for address details...</p>
    </div>
);
const ContactDetailsContent = ({ formData, handleChange, handleSelectChange, bluePrimary }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <PhoneCall size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
        </div>
        <p className="text-muted">Content for contact details...</p>
    </div>
);
const TaxDetailsContent = ({ formData, handleChange, handleSelectChange, bluePrimary }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Receipt size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Tax Details</h3>
        </div>
        <p className="text-muted">Content for tax details...</p>
    </div>
);
const BankAccountsContent = ({ formData, handleChange, bluePrimary }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Landmark size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Bank Accounts</h3>
        </div>
        <p className="text-muted">Content for bank accounts...</p>
    </div>
);
const AdditionalInfoContent = ({ formData, handleChange, handleSelectChange, bluePrimary }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Info size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Additional Info</h3>
        </div>
        <p className="text-muted">Content for additional info...</p>
    </div>
);


// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------

const ContractorOverview = () => {
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState('email'); // Defaulted to 'email'

    // 🔑 STEP 1: Initialize comprehensive form data state
    const [formData, setFormData] = useState({
        // Basic Info (Manual Entry)
        entityCode: '', entityName: '', effectiveDate: '', entityType: '', natureOfBusiness: '', grade: '', attachment: null,
        // Address Details
        phoneNo: '', emailID: '', addressType: '', address1: '', address2: '', country: '', addresscity: '', zipCode: '',
        // Contact Details
        contactName: '', contactPosition: '', contactPhoneNo: '', contactEmailID: '',
        // Tax Details
        taxType: '', territoryType: '', territory: '', taxRegNo: '', taxRegDate: '', taxAddress1: '', taxAddress2: '', taxCity: '', taxZipCode: '', taxEmailID: '',
        // Bank Accounts
        accountHolderName: '', accountNo: '', bankName: '', branchName: '', bankAddress: '',
        // Additional Info
        additionalInfoType: '', registrationNo: '',

        // Email Invite 
        inviteName: '',
        inviteEmailID: '',
        message: '', 
    });

    // 🔑 STEP 2: Universal change handler for regular inputs (text, date, textarea)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🔑 STEP 3: Universal change handler for react-select components
    const handleSelectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
    };
    
    // 🔑 STEP 4: Handler for file input
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    // --- View and Navigation Handlers ---
    const handleGoBack = () => navigate(-1);
    const handleCancel = () => {
        // Implement cancellation logic
        console.log("Form Cancelled.");
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        // Add validation and API call logic here
    };

    const handleViewChange = (view) => setSelectedView(view);

    // --- Styling based on selected view (Fix included here) ---
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
                
                {/* Form wrapper for submission */}
                <form id="contractorForm" onSubmit={handleSubmit}>
                    {/* Main Content Card */}
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: selectedView === 'manual' ? "0 1.5rem 1.5rem 1.5rem" : "1.5rem" }}>
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
                                bluePrimary={bluePrimary}
                                darkTextColor={darkTextColor}
                            />
                        }
                    </div>
                    
                    {/* Additional sections only for Manual Entry mode */}
                    {selectedView === 'manual' && <AddressDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <ContactDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <TaxDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <BankAccountsContent formData={formData} handleChange={handleChange} bluePrimary={bluePrimary} />}
                    {selectedView === 'manual' && <AdditionalInfoContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} bluePrimary={bluePrimary} />}
                    
                    {/* Manual Entry submit buttons (Email form has its own submit button inside the card) */}
                    {selectedView === 'manual' && (
                        <div className="d-flex justify-content-end mt-4">
                            <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleCancel} style={{ borderRadius: "6px" }}>Cancel</button>
                            <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Submit</button>
                        </div>
                    )}
                </form>
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;