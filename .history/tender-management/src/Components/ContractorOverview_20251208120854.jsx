import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

// --- Constants (Defined once) ---
const bluePrimary = '#005197'; 

// ----------------------------------------------------------------------
// 1. TOP-LEVEL COMPONENT DEFINITIONS (Only AddressDetailsContent, ContactDetailsContent, etc. are shown here for brevity, 
//    but their definitions remain COMPLETE as in the previous response.)
// ----------------------------------------------------------------------

// Placeholder component for AddressDetailsContent - REMAINS UNCHANGED
const AddressDetailsContent = ({ formData, handleChange, handleSelectChange, addressTypeOptions, countryOptions, addresscityOptions }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Building size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
        </div>
        {/* ... (rest of the AddressDetailsContent fields) ... */}
        {/* Skipping for brevity in this response */}
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
    </div>
);

// Placeholder for a new, detailed Upload Document Component
const NewUploadDocumentSection = ({ file, handleFileChange }) => (
    <div className="d-flex flex-column align-items-center justify-content-center p-3" style={{ border: '2px dashed #D3D3D3', borderRadius: '8px', minHeight: '120px', backgroundColor: '#F8F8F8' }}>
        <UploadCloud size={30} className="text-muted mb-2" />
        <p className="mb-1 text-muted fw-bold">Drag and drop file here or</p>
        <label htmlFor="detailedUpload" className="btn btn-sm" style={{ backgroundColor: bluePrimary, color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>
            Browse File
        </label>
        <input type="file" id="detailedUpload" style={{ display: 'none' }} onChange={handleFileChange} />
        {file && <p className="mt-2 mb-0 text-success fw-bold text-truncate" style={{ maxWidth: '100%' }}>File selected: {file.name}</p>}
    </div>
);


// Placeholder component for ManualEntryForm - UPDATED
const ManualEntryForm = ({ formData, handleChange, handleSelectChange, handleFileChange, entityTypeOptions, natureOfBusinessOptions, gradeOptions }) => (
    <>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <FileText size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
        </div>
        <div className="row mb-3">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-input w-100" placeholder="Enter Entity Code"
                    name="entityCode"
                    value={formData.entityCode}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-input w-100" placeholder="Enter Entity Name"
                    name="entityName"
                    value={formData.entityName}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date <span className="text-danger">*</span></label>
                <div className="input-group">
                    <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" placeholder="mm/dd/yy" style={{ height: "40px" }}
                        value={formData.effectiveDate}
                        onChange={handleChange}
                    />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="entityType" className="projectform-select text-start d-block">Entity Type <span className="text-danger">*</span></label>
                <Select
                    name="entityType"
                    options={entityTypeOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={entityTypeOptions.find(option => option.value === formData.entityType)}
                    placeholder="Select entity type"
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="natureOfBusiness" className="projectform-select text-start d-block">Nature of Business <span className="text-danger">*</span></label>
                <Select
                    name="natureOfBusiness"
                    options={natureOfBusinessOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={natureOfBusinessOptions.find(option => option.value === formData.natureOfBusiness)}
                    placeholder="Select nature of business"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="grade" className="projectform-select text-start d-block">Grade <span className="text-danger">*</span></label>
                <Select
                    name="grade"
                    options={gradeOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={gradeOptions.find(option => option.value === formData.grade)}
                    placeholder="Select grade"
                />
            </div>
        </div>
        {/* --- MODIFIED UPLOAD SECTION START --- */}
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block mb-3">Upload Document</label>
                <NewUploadDocumentSection 
                    file={formData.attachment} 
                    handleFileChange={handleFileChange} 
                />
            </div>
             <div className="col-md-6">
                {/* Empty column for alignment */}
             </div>
        </div>
        {/* --- MODIFIED UPLOAD SECTION END --- */}
    </>
);

// Placeholder component for EmailInviteForm - REMAINS UNCHANGED
const EmailInviteForm = ({ formData, setFormData, handleSendInvitation }) => (
    <form onSubmit={handleSendInvitation} className="p-3" id="emailInviteForm">
        {/* ... (rest of the EmailInviteForm fields) ... */}
        {/* Skipping for brevity in this response */}
        <div className="text-center p-4">
            <Mail size={30} className=" mb-3" style={{ color: bluePrimary }} />
            <h3 className="fs-5 fw-bold mb-2" style={{ color: bluePrimary }}>
                Invite Contractor via Email
            </h3>
            <p className="text-muted">An email will be sent to the contractor with a link to fill in their details.</p>
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
        <div className="mt-3 mb-4">{/* ... (fields) ... */}</div>
    </form>
);

// Contact Details Component - REMAINS UNCHANGED
const ContactDetailsContent = ({ formData, handleChange, handleSelectChange, contactPositionOptions }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* ... (rest of the ContactDetailsContent fields) ... */}
        {/* Skipping for brevity in this response */}
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <PhoneCall size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
        <div className="row mb-3">
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
            <div className="col-md-6 mt-3 mb-4">{/* ... (fields) ... */}</div>
        </div>
    </div>
);

// Tax Details Component - REMAINS UNCHANGED
const TaxDetailsContent = ({ formData, handleChange, handleSelectChange, taxTypeOptions, territoryTypeOptions, territoryOptions, taxCityOptions }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* ... (rest of the TaxDetailsContent fields) ... */}
        {/* Skipping for brevity in this response */}
    </div>
);

// Bank Accounts Component - REMAINS UNCHANGED
const BankAccountsContent = ({ formData, handleChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* ... (rest of the BankAccountsContent fields) ... */}
        {/* Skipping for brevity in this response */}
    </div>
);

// Additional Info Component - REMAINS UNCHANGED
const AdditionalInfoContent = ({ formData, handleChange, handleSelectChange, additionalInfoTypeOptions }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        {/* ... (rest of the AdditionalInfoContent fields) ... */}
        {/* Skipping for brevity in this response */}
    </div>
);


// ----------------------------------------------------------------------
// 2. MAIN COMPONENT (ContractorOverview) - REMAINS UNCHANGED
// ----------------------------------------------------------------------

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);
    
    // --- State Management ---
    const [formData, setFormData] = useState({
        // Basic Info
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
        contractorEmailId: '', contractorName:'', contractorMessage:''
    });

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData(prev => ({ ...prev, [name]: selectedOption.value }));
    };

    const handleFileChange = (e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    const handleSubmit = (e) => { e.preventDefault(); console.log("Manual Form Submitted:", formData); };
    const handleCancel = () => { navigate(-1); /* Example: Go back */ };
    const handleSendInvitation = (e) => { e.preventDefault(); console.log("Invitation Sent:", formData.contractorEmailId); };


    // --- Styling Logic ---
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const buttonGroupStyle = { borderRadius: '6px', overflow: 'hidden', boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' };
    const manualButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopRightRadius: isManualActive ? 0 : '6px', borderBottomRightRadius: isManualActive ? 0 : '6px', backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };
    const emailButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopLeftRadius: isEmailActive ? 0 : '6px', borderBottomLeftRadius: isEmailActive ? 0 : '6px', backgroundColor: isEmailActive ? bluePrimary : 'white', color: isEmailActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };

    // --- Placeholder Options ---
    const entityTypeOptions = [{ label: 'Individual', value: 'individual' }, { label: 'Company', value: 'company' }]; 
    const natureOfBusinessOptions = [{ label: 'IT', value: 'it' }]; 
    const gradeOptions = [{ label: 'A', value: 'a' }];
    const addressTypeOptions = [{ label: 'Office', value: 'office' }]; 
    const countryOptions = [{ label: 'India', value: 'IN' }]; 
    const addresscityOptions = [{ label: 'Mumbai', value: 'mumbai' }];
    const contactPositionOptions = [{ label: 'Manager', value: 'manager' }]; 
    const territoryTypeOptions = [{ label: 'National', value: 'national' }]; 
    const taxTypeOptions = [{ label: 'VAT', value: 'vat' }];
    const territoryOptions = [{ label: 'Maharashtra', value: 'MH' }]; 
    const taxCityOptions = [{ label: 'Pune', value: 'pune' }]; 
    const additionalInfoTypeOptions = [{ label: 'GST', value: 'gst' }];

    
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
                
                {/* --- MANUAL ENTRY FORM --- */}
                {selectedView === 'manual' && (
                    <form id="manualContractorForm" onSubmit={handleSubmit}>
                        <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                            <ManualEntryForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange} 
                                handleFileChange={handleFileChange}
                                entityTypeOptions={entityTypeOptions} 
                                natureOfBusinessOptions={natureOfBusinessOptions} 
                                gradeOptions={gradeOptions}
                            />
                        </div>
                        <AddressDetailsContent 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSelectChange={handleSelectChange}
                            addressTypeOptions={addressTypeOptions} 
                            countryOptions={countryOptions} 
                            addresscityOptions={addresscityOptions}
                        />
                        <ContactDetailsContent 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSelectChange={handleSelectChange}
                            contactPositionOptions={contactPositionOptions}
                        />
                        <TaxDetailsContent 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSelectChange={handleSelectChange}
                            territoryTypeOptions={territoryTypeOptions} 
                            taxTypeOptions={taxTypeOptions} 
                            territoryOptions={territoryOptions} 
                            taxCityOptions={taxCityOptions}
                        />
                        <BankAccountsContent 
                            formData={formData} 
                            handleChange={handleChange}
                        />
                        <AdditionalInfoContent 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleSelectChange={handleSelectChange}
                            additionalInfoTypeOptions={additionalInfoTypeOptions}
                        />
                    </form>
                )}

                {/* --- EMAIL INVITE FORM --- */}
                {selectedView === 'email' && (
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "1.5rem" }}>
                        <EmailInviteForm 
                            formData={formData} 
                            setFormData={setFormData}
                            handleSendInvitation={handleSendInvitation}
                        />
                    </div>
                )}


                {/* --- FOOTER BUTTONS --- */}
                <div className="d-flex justify-content-end mt-4">

                    {/* Manual Entry Buttons (Cancel & Submit) */}
                    {selectedView === 'manual' && (
                        <>
                            <button 
                                type="button" 
                                className="btn btn-outline-secondary me-3 px-4 fw-bold" 
                                onClick={handleCancel} 
                                style={{ borderRadius: "6px" }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                form="manualContractorForm" // Linked to the Manual form
                                className="btn px-4 fw-bold" 
                                style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}
                            >
                                Submit
                            </button>
                        </>
                    )}

                    {/* Email Invite Button (Send Invitation) */}
                    {selectedView === 'email' && (
                        <button 
                            type="submit" 
                            form="emailInviteForm" // Linked to the Email form
                            className="btn d-flex align-items-center fw-bold px-4"
                            style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}
                        >
                            <Mail size={20} className="me-2" /> Send Invitation Link
                        </button>
                    )}
                </div>
                {/* --- END FOOTER BUTTONS --- */}

            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;