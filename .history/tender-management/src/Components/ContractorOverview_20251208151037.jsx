import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

const bluePrimary = '#005197';
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


const EmailInviteForm = React.memo(({ formData, handleChange, handleSendInvitation }) => (
    <form onSubmit={handleSendInvitation} className="p-3">
        <div className="text-center p-4">
            <Mail size={30} className="mb-3" style={{ color: bluePrimary }} />
            <h3 className="fs-5 fw-bold mb-2" style={{ color: bluePrimary }}>
                Invite Contractor via Email
            </h3>
            <p className="mb-4" style={{ color: '#6286A6' }}>
                Send a secure link to the contractor. They will be able to fill out their details, 
                upload documents, and submit.
            </p>
        </div>

        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Contractor Email ID"
                    name="contractorEmailId"
                    value={formData.contractorEmailId}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Contractor Name</label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Contractor Name"
                    name="contractorName"
                    value={formData.contractorName}
                    onChange={handleChange}
                />
            </div>
        </div>

        <div className="col-md-12 mt-3 mb-4">
            <label className="projectform text-start d-block">Message</label>
            <input
                type="text"
                className="form-input w-100"
                placeholder="Add a personalized message..."
                name="contractorMessage"
                value={formData.contractorMessage}
                onChange={handleChange}
            />
        </div>

        <div
            className="d-flex align-items-center p-3 rounded"
            style={{ backgroundColor: "#F3F8FF" }}
        >
            <Info size={18} className="me-2" style={{ color: "#2563EBCC" }} />
            <p className="mb-0 small" style={{ color: "#2563EBCC" }}>
                Invitation link will be sent to the contractor's email address.
                They'll receive a secure link to complete their onboarding process.
            </p>
        </div>

        <div className="d-flex justify-content-end pt-3">
            <button
                type="submit"
                className="btn d-flex align-items-center fw-bold px-4"
                style={{
                    backgroundColor: bluePrimary,
                    color: "white",
                    borderRadius: "6px",
                }}
            >
                <Mail size={20} className="me-2" /> Send Invitation Link
            </button>
        </div>
    </form>
));

const ManualEntryForm = React.memo(({ formData, handleChange, handleSelectChange, handleFileChange }) => (
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
                <label className="projectform text-start d-block">
                    Entity Code <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Entity Code"
                    name="entityCode"
                    value={formData.entityCode}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Entity Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Entity Name"
                    name="entityName"
                    value={formData.entityName}
                    onChange={handleChange}
                />
            </div>
        </div>

        <div className="row mb-3">
            <div className="col-md-6 mb-3">
                <label htmlFor="effectiveDate" className="projectform-select text-start d-block">
                    Effective Date<span style={{ color: "red" }}>*</span>
                </label>
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        id="effectiveDate"
                        name="effectiveDate"
                        value={formData.effectiveDate}
                        onChange={handleChange}
                        placeholder="mm/dd/yy"
                        style={{ height: "40px" }}
                    />
                </div>
            </div>

            <div className="col-md-6 mb-3">
                <label htmlFor="entityType" className="projectform-select text-start d-block">
                    Entity Type <span style={{ color: "red" }}>*</span>
                </label>
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
                <label htmlFor="natureOfBusiness" className="projectform-select text-start d-block">
                    Nature of business
                </label>
                <Select
                    name="natureOfBusiness"
                    options={natureOfBusinessOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    value={natureOfBusinessOptions.find(option => option.value === formData.natureOfBusiness)}
                    placeholder="Select nature of business"
                />
            </div>
        
            <div className="col-md-6 mb-3">
                <label htmlFor="grade" className="projectform-select text-start d-block">
                    Grade
                </label>
                <Select
                    name="grade"
                    options={gradeOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    value={gradeOptions.find(option => option.value === formData.grade)}
                    placeholder="Select grades"
                />
            </div>
        </div>

        <div className="row mb-4">
        <div className="col-12 mt-3">
            <h4 className="fs-6 fw-bold mb-3" style={{ color: bluePrimary }}>Attachment (Certificates/Licenses)</h4>
        
            <div 
                className="p-4 text-center rounded" 
                style={{  
                    cursor: "pointer", 
                    border: "2px dashed #005197B2", 
                    borderRadius: '8px' 
                }}
            >
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
));


const AddressDetailsContent = React.memo(({ formData, handleChange, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Building size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    name="phoneNo"
                    value={formData.phoneNo}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="emailID"
                    value={formData.emailID}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="addressType" className="projectform-select text-start d-block">Address Type <span style={{ color: "red" }}>*</span></label>
                <Select
                    name="addressType"
                    options={ addressTypeOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={ addressTypeOptions.find(option => option.value === formData.addressType)}
                    placeholder="Select addressType"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 1 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 1"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                /> 
            </div>
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label className="projectform text-start d-block">
                    Address 2 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4"> 
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
        <div className="row">
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="city" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                <Select
                    name="addresscity"
                    options={ addresscityOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={ addresscityOptions.find(option => option.value === formData.addresscity)}
                    placeholder="Select city"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4"> 
                <label className="projectform text-start d-block">
                    Zip/Postal Code 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Zip/Postal Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                />
            </div>
        </div>
    </div>
));

const ContactDetailsContent = React.memo(({ formData, handleChange, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <PhoneCall size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
        </div>
        
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter contact name"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4"> 
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
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    name="contactPhoneNo"
                    value={formData.contactPhoneNo}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="contactEmailID"
                    value={formData.contactEmailID}
                    onChange={handleChange}
                />
            </div> 
        </div>
    </div>
));

const TaxDetailsContent = React.memo(({ formData, handleChange, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Receipt size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Tax Details</h3>
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
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
            <div className="col-md-6 mt-3 mb-4"> 
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
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="territory" className="projectform-select text-start d-block">Territory <span className="text-danger">*</span></label>
                <Select
                    name="territory"
                    options={ territoryOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={ territoryOptions.find(option => option.value === formData.territory)}
                    placeholder="Select territory type"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Tax Reg. No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter tax registration no"
                    name="taxRegNo"
                    value={formData.taxRegNo}
                    onChange={handleChange}
                />
            </div> 
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="taxRegDate" className="projectform-select text-start d-block">Tax Reg. Date <span className="text-danger">*</span></label>
                <div className="input-group">
                    <input type="text" className="form-control" id="taxRegDate" name="taxRegDate" value={formData.taxRegDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}>< FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 1 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 1"
                    name="taxAddress1"
                    value={formData.taxAddress1}
                    onChange={handleChange}
                />  
            </div> 
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 2 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    name="taxAddress2"
                    value={formData.taxAddress2}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="taxCity" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                <Select
                    name="taxCity"
                    options={ taxCityOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={ taxCityOptions.find(option => option.value === formData.taxCity)}
                    placeholder="Select City type"
                />
            </div>
        </div>
        <div className="row mb-4"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Zip/Postal Code 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Zip/Postal Code"
                    name="taxZipCode"
                    value={formData.taxZipCode}
                    onChange={handleChange}
                />
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="taxEmailID"
                    value={formData.taxEmailID}
                    onChange={handleChange}
                /> 
            </div>
        </div>
    </div>
));

const BankAccountsContent = React.memo(({ formData, handleChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Landmark size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Bank Accounts</h3>
        </div>
        
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account Holder Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Account Holder Name"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Account No"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                /> 
            </div> 
        </div>
        
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Name"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                /> 
            </div> 
        
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Branch Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Branch Name"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleChange}
                /> 
            </div> 
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Address 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Address"
                    name="bankAddress"
                    value={formData.bankAddress}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6"> 
            </div>
        </div>
    </div>
));

const AdditionalInfoContent = React.memo(({ formData, handleChange, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Info size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Additional Info</h3>
        </div>
        
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="additionalInfoType" className="projectform-select text-start d-block">Type <span className="text-danger">*</span></label>
                <Select
                    name="additionalInfoType"
                    options={ additionalInfoTypeOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={ additionalInfoTypeOptions.find(option => option.value === formData.additionalInfoType)}
                    placeholder="Select type"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Registration No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Registration No"
                    name="registrationNo"
                    value={formData.registrationNo}
                    onChange={handleChange}
                /> 
            </div> 
        </div>
    </div>
));

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);

    const [formData, setFormData] = useState({
        entityCode: '', entityName: '', effectiveDate: '', entityType: '',
        natureOfBusiness: '', grade: '', attachment: null, phoneNo: '', 
        emailID: '', addressType: '', address1: '', address2: '', country: '',
        addresscity: '', zipCode: '', contactName: '', contactPosition: '', 
        contactPhoneNo: '', contactEmailID: '', taxType: '', territoryType: '',
        territory: '', taxRegNo: '', taxRegDate: '', taxAddress1: '', 
        taxAddress2: '', taxCity: '', taxZipCode: '', taxEmailID: '', 
        accountHolderName: '', accountNo: '', bankName: '', branchName: '', 
        bankAddress: '', additionalInfoType: '', registrationNo: '',
        contractorEmailId: '', contractorName:'', contractorMessage:''
    });
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSelectChange = useCallback((selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData(prev => ({ ...prev, [name]: selectedOption.value }));
    }, []);

    const handleFileChange = useCallback((e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] })), []);

    const handleSubmit = (e) => { e.preventDefault(); console.log("Manual Form Submitted:", formData); };
    const handleCancel = () => console.log("Form Cancelled");

    const handleSendInvitation = (e) => {
        e.preventDefault();
        console.log("Invitation Sent:", {
            contractorEmailId: formData.contractorEmailId,
            contractorName: formData.contractorName,
            contractorMessage: formData.contractorMessage
        });
    };

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const buttonGroupStyle = { borderRadius: '6px', overflow: 'hidden', boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' };
    const manualButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopRightRadius: isManualActive ? 0 : '6px', borderBottomRightRadius: isManualActive ? 0 : '6px', backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };
    const emailButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopLeftRadius: isEmailActive ? 0 : '6px', borderBottomLeftRadius: isEmailActive ? 0 : '6px', backgroundColor: isEmailActive ? bluePrimary : 'white', color: isEmailActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };

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
                        {selectedView === 'manual' ? (
                            <ManualEntryForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange}
                                handleFileChange={handleFileChange}
                            />
                        ) : (
                            <EmailInviteForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSendInvitation={handleSendInvitation}
                            />
                        )}
                    </div>
                    {selectedView === 'manual' && (
                        <>
                            <AddressDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                            <ContactDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                            <TaxDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                            <BankAccountsContent formData={formData} handleChange={handleChange} />
                            <AdditionalInfoContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />
                        </>
                    )}
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