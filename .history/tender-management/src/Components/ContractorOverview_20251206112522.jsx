import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);
    const [emailInviteData, setEmailInviteData] = useState({
        contractorEmailID: '',
        contractorName: '',
        message: ''
    });

    const handleEmailInviteChange = (e) => {
        const { name, value } = e.target;
        setEmailInviteData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendInvitation = (e) => {
        e.preventDefault();
        console.log("Invitation Sent:", emailInviteData);
    };
    const [formData, setFormData] = useState({
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: '',
        natureOfBusiness: '',
        grade: '',
        attachment: null,
        phoneNo: '', 
        emailID: '', 
        addressType: '', 
        address1: '',
        address2: '',
        country: '',
        city: '',
        zipCode: '',
        contactName: '',
        contactPosition: '',
        contactPhoneNo: '', 
        contactEmailID: '',
        taxType: '',
        territoryType: '',
        territory: '',
        taxRegNo: '',
        taxRegDate: '',
        taxAddress1: '', 
        taxAddress2: '', 
        taxCity: '',
        taxZipCode: '',
        taxEmailID: '', 
        accountHolderName: '',
        accountNo: '',
        bankName: '',
        branchName: '',
        bankAddress: '',
        additionalInfoType: '',
        registrationNo: ''
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

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const bluePrimary = '#005197';
    const buttonGroupStyle = { borderRadius: '6px', overflow: 'hidden', boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' };
    const manualButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopRightRadius: isManualActive ? 0 : '6px', borderBottomRightRadius: isManualActive ? 0 : '6px', backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };
    const emailButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopLeftRadius: isEmailActive ? 0 : '6px', borderBottomLeftRadius: isEmailActive ? 0 : '6px', backgroundColor: isEmailActive ? bluePrimary : 'white', color: isEmailActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };

    
    const entityTypeOptions = [
    ];

    const  natureOfBusinessOptions = [];

    const  gradeOptions = [];

    const  addressTypeOptions = [];

    const  countryOptions = [];

    const  cityOptions = [];

    const  contactPositionOptions = [];

    const  territoryTypeOptions = [];

    const  taxTypeOptions = [];

    const  Options = [];

    const EmailInviteForm = () => (
        <form onSubmit={handleSendInvitation} className="p-3">
            <div className="text-center p-4">
                <Mail size={30} className="text-muted mb-3" />
                <h3 className="fs-5 fw-bold mb-2">Invite Contractor via Email</h3>
                <p className="text-secondary mb-4">
                    Send a secure link to the contractor. They will be able to fill out their details, upload documents, and submit.
                </p>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="contractorEmailID" className="projectform text-start d-block">Contractor Email ID <span className="text-danger">*</span></label>
                    <input 
                        type="email" 
                        className="form-input w-100" 
                        id="contractorEmailID" 
                        name="contractorEmailID" 
                        value={emailInviteData.contractorEmailID} 
                        onChange={handleEmailInviteChange} 
                        placeholder="Enter contractor email id" 
                        style={{ height: "40px" }} 
                        required
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="contractorName" className="projectform text-start d-block">Contractor Name</label>
                    <input 
                        type="text" 
                        className="form-input w-100" 
                        id="contractorName" 
                        name="contractorName" 
                        value={emailInviteData.contractorName} 
                        onChange={handleEmailInviteChange} 
                        placeholder="Enter contractor name" 
                        style={{ height: "40px" }} 
                    />
                </div>
            </div>

            <div className="mb-4">
                <label htmlFor="message" className="projectform-select text-start d-block">Message</label>
                <textarea 
                    className="w-100" 
                    id="message" 
                    name="message" 
                    rows="3" 
                    value={emailInviteData.message} 
                    onChange={handleEmailInviteChange} 
                    placeholder="Add a personalized message."
                ></textarea>
            </div>

            <div className="d-flex align-items-center mb-5 mt-4">
                <Info size={18} className="me-2" style={{ color: bluePrimary }} />
                <p className="mb-0 small text-muted">
                    Invitation link will be sent to the contractor's email address. They'll receive a secure link to complete their onboarding process.
                </p>
            </div>
            
            <div className="d-flex justify-content-center pt-3">
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
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityCode" className="projectform-select text-start d-block">Entity Code</label>
                    <input type="text" className="form-input w-100" id="entityCode" name="entityCode" value={formData.entityCode} onChange={handleChange} placeholder="Enter entity code" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityName" className="projectform-select text-start d-block">Entity Name</label>
                    <input type="text" className="form-input w-100" id="entityName" name="entityName" value={formData.entityName} onChange={handleChange} placeholder="Enter entity name" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                        <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}>< FaCalendarAlt size={18} className="text-muted" /></span>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityType" className="projectform-select text-start d-block">Entity Type</label>
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
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="natureOfBusiness" className="projectform-select text-start d-block">Nature of business</label>
                    <Select
                        name=" natureOfBusiness"
                        options={ natureOfBusinessOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={ natureOfBusinessOptions.find(option => option.value === formData. natureOfBusiness)}
                        placeholder="Select nature of business"
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="grade" className="projectform-select text-start d-block">Grade</label>
                   <Select
                        name=" grade"
                        options={ gradeOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={ gradeOptions.find(option => option.value === formData.grade)}
                        placeholder="Select grades"
                    />
                </div>
            </div>
            <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>
            <div className="border border-dashed p-4 text-center rounded" style={{ backgroundColor: "#f9f9f9", cursor: "pointer" }}>
                <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                <label htmlFor="fileUpload" className="d-block cursor-pointer">
                    <UploadCloud size={30} className="text-muted mb-2" />
                    <p className="mb-1 fw-bold text-muted">Click to upload or drag and drop</p>
                    <p className="mb-0 small text-muted">PDF, DOCX up to 10MB</p>
                </label>
            </div>
        </>
    );

    const AddressDetailsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                <Building size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="phoneNo" className="projectform-select text-start d-block">Phone No</label>
                    <input type="tel" className="form-input w-100" id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Enter phone no" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="emailID" className="projectform-select text-start d-block">Email ID</label>
                    <input type="email" className="form-input w-100" id="emailID" name="emailID" value={formData.emailID} onChange={handleChange} placeholder="Enter email id" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="addressType" className="projectform-select text-start d-block">Address Type</label>
                    <Select
                        name="  addressType"
                        options={ addressTypeOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={ addressTypeOptions.find(option => option.value === formData.addressType)}
                        placeholder="Select addressType"
                    />
                   
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address1" className="projectform-select text-start d-block">Address 1</label>
                    <textarea className="form-control" id="address1" name="address1" rows="3" value={formData.address1} onChange={handleChange} placeholder="Enter address 1"></textarea>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="address2" className="projectform-select text-start d-block">Address 2</label>
                    <textarea className="form-control" id="address2" name="address2" rows="3" value={formData.address2} onChange={handleChange} placeholder="Enter address 2"></textarea>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="projectform-select text-start d-block">Country <span className="text-danger">*</span></label>
                    <Select
                        name="country"
                        options={ countryOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={ countryOptions.find(option => option.value === formData.country)}
                        placeholder="Select Country"
                    />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                    <Select
                        name="  city"
                        options={ cityOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={ cityOptions.find(option => option.value === formData.city)}
                        placeholder="Select city"
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="zipCode" className="projectform-select text-start d-block">Zip/Postal Code</label>
                    <input type="text" className="form-input w-100" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Enter Zip/Postal Code" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    const ContactDetailsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                <PhoneCall size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactName" className="projectform-select text-start d-block">Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Enter contact name" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactPosition" className="projectform-select text-start d-block">Position <span className="text-danger">*</span></label>
                    <Select
                        name="contactPosition"
                        options={ contactPositionOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={contactPositionOptions.find(option => option.value === formData.contactPosition)}
                        placeholder="Select position"
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactPhoneNo" className="projectform-select text-start d-block">Phone No</label>
                    <input type="tel" className="form-input w-100" id="contactPhoneNo" name="contactPhoneNo" value={formData.contactPhoneNo} onChange={handleChange} placeholder="Enter phone no" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactEmailID" className="projectform-select text-start d-block">Email ID</label>
                    <input type="email" className="form-input w-100" id="contactEmailID" name="contactEmailID" value={formData.contactEmailID} onChange={handleChange} placeholder="Enter email id" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    const TaxDetailsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                <Receipt size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Tax Details</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxType" className="projectform-select text-start d-block">Tax Type <span className="text-danger">*</span></label>
                   <Select
                        name="taxType"
                        options={ taxTypeOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={taxTypeOptions.find(option => option.value === formData.taxType)}
                        placeholder="Select tax type"
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="territoryType" className="projectform-select text-start d-block">Territory Type <span className="text-danger">*</span></label>
                    <Select
                        name="territoryType"
                        options={ territoryTypeOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={territoryTypeOptions.find(option => option.value === formData.territoryType)}
                        placeholder="Select territory type"
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="territory" className="projectform-select text-start d-block">Territory <span className="text-danger">*</span></label>
                    <select className="form-select" id="territory" name="territory" value={formData.territory} onChange={handleChange} style={{ height: "40px" }}>
                       
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxRegNo" className="projectform-select text-start d-block">Tax Reg. No <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="taxRegNo" name="taxRegNo" value={formData.taxRegNo} onChange={handleChange} placeholder="Enter tax registration no" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxRegDate" className="projectform-select text-start d-block">Tax Reg. Date <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="taxRegDate" name="taxRegDate" value={formData.taxRegDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                        <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}>< FaCalendarAlt size={18} className="text-muted" /></span>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxAddress1" className="projectform-select text-start d-block">Address 1</label>
                    <textarea className="form-control" id="taxAddress1" name="taxAddress1" rows="3" value={formData.taxAddress1} onChange={handleChange} placeholder="Enter address 1"></textarea>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxAddress2" className="projectform-select text-start d-block">Address 2</label>
                    <textarea className="form-control" id="taxAddress2" name="taxAddress2" rows="3" value={formData.taxAddress2} onChange={handleChange} placeholder="Enter address 2"></textarea>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxCity" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                    <select className="form-select" id="taxCity" name="taxCity" value={formData.taxCity} onChange={handleChange} style={{ height: "40px" }}>
                        
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxZipCode" className="projectform-select text-start d-block">Zip/Postal Code</label>
                    <input type="text" className="form-input w-100" id="taxZipCode" name="taxZipCode" value={formData.taxZipCode} onChange={handleChange} placeholder="Enter Zip/Postal Code" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxEmailID" className="projectform-select text-start d-block">Email ID</label>
                    <input type="email" className="form-input w-100" id="taxEmailID" name="taxEmailID" value={formData.taxEmailID} onChange={handleChange} placeholder="Enter email id" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    const BankAccountsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                <Landmark size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Bank Accounts</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="accountHolderName" className="projectform-select text-start d-block">Account Holder Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="accountHolderName" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="Enter account holder name" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="accountNo" className="projectform-select text-start d-block">Account No <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="accountNo" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Enter account no" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="bankName" className="projectform-select text-start d-block">Bank Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Enter bank name" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="branchName" className="projectform-select text-start d-block">Branch Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="branchName" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="Enter branch name" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12 mb-3">
                    <label htmlFor="bankAddress" className="projectform-select text-start d-block">Bank Address</label>
                    <textarea className="form-control" id="bankAddress" name="bankAddress" rows="3" value={formData.bankAddress} onChange={handleChange} placeholder="Enter bank address"></textarea>
                </div>
            </div>
        </div>
    );

    const AdditionalInfoContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                <Info size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Additional Info</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="additionalInfoType" className="projectform-select text-start d-block">Type <span className="text-danger">*</span></label>
                    <select className="form-select" id="additionalInfoType" name="additionalInfoType" value={formData.additionalInfoType} onChange={handleChange} style={{ height: "40px" }}>
                       
                    
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="registrationNo" className="projectform-select text-start d-block">Registration No <span className="text-danger">*</span></label>
                    <input type="text" className="form-input w-100" id="registrationNo" name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder="Enter registration no" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

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