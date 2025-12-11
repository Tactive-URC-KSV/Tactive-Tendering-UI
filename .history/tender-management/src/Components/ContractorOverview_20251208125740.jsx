import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info 
} from "lucide-react"; 
import { FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);

    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);

    const [formData, setFormData] = useState({
        entityCode: '', entityName: '', effectiveDate: '', entityType: '', natureOfBusiness: '', grade: '',
        attachment: null, phoneNo: '', emailID: '', addressType: '', address1: '', address2: '', country: '', addresscity: '', zipCode: '',
        contactName: '', contactPosition: '', contactPhoneNo: '', contactEmailID: '',
        taxType: '', territoryType: '', territory: '', taxRegNo: '', taxRegDate: '', taxAddress1: '', taxAddress2: '', taxCity: '', taxZipCode: '', taxEmailID: '',
        accountHolderName: '', accountNo: '', bankName: '', branchName: '', bankAddress: '',
        additionalInfoType: '', registrationNo: '', contractorEmailId: '', contractorName:'', contractorMessage:''
    });

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
    const handleCancel = () => console.log("Form Cancelled");

    const bluePrimary = '#005197';
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';

    const buttonGroupStyle = { borderRadius: '6px', overflow: 'hidden', boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' };
    const manualButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopRightRadius: isManualActive ? 0 : '6px', borderBottomRightRadius: isManualActive ? 0 : '6px', backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };
    const emailButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopLeftRadius: isEmailActive ? 0 : '6px', borderBottomLeftRadius: isEmailActive ? 0 : '6px', backgroundColor: isEmailActive ? bluePrimary : 'white', color: isEmailActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };

    // Example options - replace with actual data
    const entityTypeOptions = [];
    const natureOfBusinessOptions = [];
    const gradeOptions = [];
    const addressTypeOptions = [];
    const countryOptions = [];
    const addresscityOptions = [];
    const contactPositionOptions = [];
    const territoryTypeOptions = [];
    const taxTypeOptions = [];
    const territoryOptions = [];
    const taxCityOptions = [];
    const additionalInfoTypeOptions = [];

    // --- Forms ---
    const EmailInviteForm = () => (
        <form onSubmit={(e) => { e.preventDefault(); console.log("Invitation Sent:", formData); }} className="p-3">
            <div className="text-center p-4">
                <Mail size={30} className="mb-3" style={{ color: bluePrimary }} />
                <h3 className="fs-5 fw-bold mb-2" style={{ color: bluePrimary }}>Invite Contractor via Email</h3>
                <p className="mb-4" style={{ color: '#6286A6' }}>
                    Send a secure link to the contractor. They will be able to fill out their details, upload documents, and submit.
                </p>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform text-start d-block">Contractor Email ID <span style={{ color: 'red' }}>*</span></label>
                    <input type="text" className="form-input w-100" placeholder="Enter Contractor Email ID"
                        value={formData.contractorEmailId}
                        onChange={(e) => setFormData({ ...formData, contractorEmailId: e.target.value })} />
                </div>
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform text-start d-block">Contractor Name</label>
                    <input type="text" className="form-input w-100" placeholder="Enter Contractor Name"
                        value={formData.contractorName}
                        onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })} />
                </div>
            </div>

            <div className="col-md-12 mt-3 mb-4">
                <label className="projectform text-start d-block">Message</label>
                <input type="text" className="form-input w-100" placeholder="Add a personalized message..."
                    value={formData.contractorMessage}
                    onChange={(e) => setFormData({ ...formData, contractorMessage: e.target.value })} />
            </div>

            <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: "#F3F8FF" }}>
                <Info size={18} className="me-2" style={{ color: "#2563EBCC" }} />
                <p className="mb-0 small" style={{ color: "#2563EBCC" }}>
                    Invitation link will be sent to the contractor's email address. They'll receive a secure link to complete their onboarding process.
                </p>
            </div>

            <div className="d-flex justify-content-end pt-3">
                <button type="submit" className="btn d-flex align-items-center fw-bold px-4" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}>
                    <Mail size={20} className="me-2" /> Send Invitation Link
                </button>
            </div>
        </form>
    );

    const ManualEntryForm = () => (
        <>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                <FileText size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
            </div>

            <div className="row mb-3">
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
                    <input type="text" className="form-input w-100" placeholder="Enter Entity Code" value={formData.entityCode} onChange={handleChange} name="entityCode" />
                </div>
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                    <input type="text" className="form-input w-100" placeholder="Enter Entity Name" value={formData.entityName} onChange={handleChange} name="entityName" />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date<span style={{ color: "red" }}>*</span></label>
                    <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityType" className="projectform-select text-start d-block">Entity Type <span style={{ color: "red" }}>*</span></label>
                    <Select name="entityType" options={entityTypeOptions} onChange={handleSelectChange} classNamePrefix="select" value={entityTypeOptions.find(option => option.value === formData.entityType)} placeholder="Select entity type" />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="natureOfBusiness" className="projectform-select text-start d-block">Nature of business</label>
                    <Select name="natureOfBusiness" options={natureOfBusinessOptions} onChange={handleSelectChange} classNamePrefix="select" value={natureOfBusinessOptions.find(option => option.value === formData.natureOfBusiness)} placeholder="Select nature of business" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="grade" className="projectform-select text-start d-block">Grade</label>
                    <Select name="grade" options={gradeOptions} onChange={handleSelectChange} classNamePrefix="select" value={gradeOptions.find(option => option.value === formData.grade)} placeholder="Select grades" />
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-12 mt-3">
                    <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>
                    <div className="p-4 text-center rounded" style={{ cursor: "pointer", border: "2px dashed #005197B2", borderRadius: '8px' }}>
                        <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                        <label htmlFor="fileUpload" className="d-block cursor-pointer">
                            <UploadCloud size={30} className="mb-2" style={{ color: bluePrimary }} />
                            <p className="mb-1 fw-bold" style={{ color: bluePrimary }}>Click to upload or drag and drop</p>
                            <p className="mb-0 small text-muted">PDF, DOCX up to 10MB</p>
                        </label>
                    </div>
                </div>
            </div>
        </>
    );
    

    // --- AddressDetailsContent, ContactDetailsContent, TaxDetailsContent, BankAccountsContent, AdditionalInfoContent ---
    // Use exactly your existing code for these sections (copied verbatim from your code above)

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

                <form id="contractorForm" onSubmit={handleSubmit}>
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: selectedView === 'manual' ? "0 1.5rem 1.5rem 1.5rem" : "1.5rem" }}>
                        {selectedView === 'manual' ? <ManualEntryForm /> : <EmailInviteForm />}
                    </div>

                    {selectedView === 'manual' && <AddressDetailsContent />}
                    {selectedView === 'manual' && <ContactDetailsContent />}
                    {selectedView === 'manual' && <TaxDetailsContent />}
                    {selectedView === 'manual' && <BankAccountsContent />}
                    {selectedView === 'manual' && <AdditionalInfoContent />}
                </form>

                {selectedView === 'manual' && (
                    <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleCancel} style={{ borderRadius: "6px" }}>Cancel</button>
                        <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Submit</button>
                    </div>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;
