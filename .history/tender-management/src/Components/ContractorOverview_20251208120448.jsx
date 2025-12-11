import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

// --- Constants (Defined once) ---
const bluePrimary = '#005197'; 

// ----------------------------------------------------------------------
// 1. TOP-LEVEL COMPONENT DEFINITIONS (Moved Outside ContractorOverview)
//    All components now accept props for state, handlers, and options.
// ----------------------------------------------------------------------

// Placeholder component for AddressDetailsContent (assuming its structure is similar to the others)
const AddressDetailsContent = ({ formData, handleChange, handleSelectChange, addressTypeOptions, countryOptions, addresscityOptions }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Building size={20} className="me-2 text-white" /> 
            <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="addressType" className="projectform-select text-start d-block">Address Type <span className="text-danger">*</span></label>
                <Select
                    name="addressType"
                    options={addressTypeOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={addressTypeOptions.find(option => option.value === formData.addressType)}
                    placeholder="Select address type"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Address 1 <span style={{ color: 'red' }}>*</span></label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 1"
                    name="address1" // Added name
                    value={formData.address1}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Address 2</label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    name="address2" // Added name
                    value={formData.address2}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="country" className="projectform-select text-start d-block">Country <span className="text-danger">*</span></label>
                <Select
                    name="country"
                    options={countryOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={countryOptions.find(option => option.value === formData.country)}
                    placeholder="Select country"
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="addresscity" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                <Select
                    name="addresscity"
                    options={addresscityOptions}
                    onChange={handleSelectChange} 
                    classNamePrefix="select"
                    value={addresscityOptions.find(option => option.value === formData.addresscity)}
                    placeholder="Select city"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Zip/Postal Code</label>
                <input type="text" className="form-input w-100" placeholder="Enter Zip/Postal Code"
                    name="zipCode" // Added name
                    value={formData.zipCode}
                    onChange={handleChange}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Phone No</label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    name="phoneNo" // Added name
                    value={formData.phoneNo}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Email ID</label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="emailID" // Added name
                    value={formData.emailID}
                    onChange={handleChange}
                />
            </div>
        </div>
    </div>
);

// Placeholder component for ManualEntryForm 
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
                    name="entityCode" // Added name
                    value={formData.entityCode}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                <input type="text" className="form-input w-100" placeholder="Enter Entity Name"
                    name="entityName" // Added name
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
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Upload Document</label>
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="No file selected" readOnly style={{ height: "40px" }} value={formData.attachment ? formData.attachment.name : ''} />
                    <label className="input-group-text bg-white" htmlFor="uploadAttachment" style={{ borderLeft: "none", height: "40px", cursor: 'pointer' }}>
                        <UploadCloud size={18} className="text-muted" />
                    </label>
                    <input type="file" id="uploadAttachment" style={{ display: 'none' }} onChange={handleFileChange} />
                </div>
            </div>
        </div>
    </>
);

// Placeholder component for EmailInviteForm
const EmailInviteForm = ({ formData, setFormData, handleSendInvitation }) => (
    <form onSubmit={handleSendInvitation} className="p-3" id="emailInviteForm">
        <div className="text-center p-4">
            <Mail size={30} className=" mb-3" style={{ color: bluePrimary }} />
            <h3 className="fs-5 fw-bold mb-2" style={{ color: bluePrimary }}>
                Invite Contractor via Email
            </h3>
            <p className="text-muted">An email will be sent to the contractor with a link to fill in their details.</p>
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text" 
                    className="form-input w-100"
                    placeholder="Enter Contractor Name"
                    value={formData.contractorName}
                    onChange={(e) =>
                        setFormData(prev => ({ ...prev, contractorName: e.target.value }))
                    }
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="email" 
                    className="form-input w-100"
                    placeholder="Enter Contractor Email ID"
                    value={formData.contractorEmailId}
                    onChange={(e) =>
                        setFormData(prev => ({ ...prev, contractorEmailId: e.target.value }))
                    }
                />
            </div>
        </div>
        <div className="mt-3 mb-4">
            <label className="projectform text-start d-block">
                Message (Optional)
            </label>
            <textarea
                className="form-input w-100"
                rows="3"
                placeholder="Enter a custom message for the contractor"
                value={formData.contractorMessage}
                onChange={(e) =>
                    setFormData(prev => ({ ...prev, contractorMessage: e.target.value }))
                }
            ></textarea>
        </div>
    </form>
);


// Components provided in your original request (updated to use props and unified handleChange)

const ContactDetailsContent = ({ formData, handleChange, handleSelectChange, contactPositionOptions }) => (
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
                    name="contactName" // Added name
                    value={formData.contactName}
                    onChange={handleChange} // Use unified handleChange
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
                    name="contactPhoneNo" // Added name
                    value={formData.contactPhoneNo}
                    onChange={handleChange} // Use unified handleChange
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="contactEmailID" // Added name
                    value={formData.contactEmailID}
                    onChange={handleChange} // Use unified handleChange
                />
            </div>  
        </div>
    </div>
);

const TaxDetailsContent = ({ formData, handleChange, handleSelectChange, taxTypeOptions, territoryTypeOptions, territoryOptions, taxCityOptions }) => (
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
                    options={  territoryOptions}
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
                    name="taxRegNo" // Added name
                    value={formData.taxRegNo}
                    onChange={handleChange} // Use unified handleChange
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
                    name="taxAddress1" // Added name
                    value={formData.taxAddress1}
                    onChange={handleChange} // Use unified handleChange
                />  
            </div> 
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 2 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    name="taxAddress2" // Added name
                    value={formData.taxAddress2}
                    onChange={handleChange} // Use unified handleChange
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
                    name="taxZipCode" // Added name
                    value={formData.taxZipCode}
                    onChange={handleChange} // Use unified handleChange
                />
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="taxEmailID" // Added name
                    value={formData.taxEmailID}
                    onChange={handleChange} // Use unified handleChange
                />   
            </div>
        </div>
    </div>
);

const BankAccountsContent = ({ formData, handleChange }) => (
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
                    name="accountHolderName" // Added name
                    value={formData.accountHolderName}
                    onChange={handleChange} // Use unified handleChange
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Account No"
                    name="accountNo" // Added name
                    value={formData.accountNo}
                    onChange={handleChange} // Use unified handleChange
                />  
            </div> 
        </div>
        
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Name"
                    name="bankName" // Added name
                    value={formData.bankName}
                    onChange={handleChange} // Use unified handleChange
                />  
            </div> 
        
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Branch Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Branch Name"
                    name="branchName" // Added name
                    value={formData.branchName}
                    onChange={handleChange} // Use unified handleChange
                />  
            </div> 
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Address 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Address"
                    name="bankAddress" // Added name
                    value={formData.bankAddress}
                    onChange={handleChange} // Use unified handleChange
                /> 
            </div> 
            <div className="col-md-6"> 
            </div>
        </div>
    </div>
);

const AdditionalInfoContent = ({ formData, handleChange, handleSelectChange, additionalInfoTypeOptions }) => (
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
                    name="registrationNo" // Added name
                    value={formData.registrationNo}
                    onChange={handleChange} // Use unified handleChange
                />  
            </div> 
        </div>
    </div>
);


// ----------------------------------------------------------------------
// 2. MAIN COMPONENT (ContractorOverview)
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
        // The safe state update that prevents component recreation
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


    // --- Styling Logic (Remains unchanged) ---
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const buttonGroupStyle = { borderRadius: '6px', overflow: 'hidden', boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' };
    const manualButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopRightRadius: isManualActive ? 0 : '6px', borderBottomRightRadius: isManualActive ? 0 : '6px', backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };
    const emailButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopLeftRadius: isEmailActive ? 0 : '6px', borderBottomLeftRadius: isEmailActive ? 0 : '6px', backgroundColor: isEmailActive ? bluePrimary : 'white', color: isEmailActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };

    // --- Placeholder Options (Define or import these) ---
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