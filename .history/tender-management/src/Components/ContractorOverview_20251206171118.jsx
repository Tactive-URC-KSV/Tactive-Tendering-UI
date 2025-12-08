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
        addresscity: '',
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
        registrationNo: '',
        contractorEmailId: '',
        contractorName:'',
        contractorMessage:''
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

    const  addresscityOptions = [];

    const  contactPositionOptions = [];

    const  territoryTypeOptions = [];

    const  taxTypeOptions = [];

    const  territoryOptions = [];

    const  taxCityOptions = [];

    const  additionalInfoTypeOptions = [];

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
                <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">
                            Contractor Email ID <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Contractor Email ID"
                            value={formData.contractorEmailId}
                            onChange={(e) => setFormData({ ...formData, contractorEmailId: e.target.value })}

                        />     
                    </div>  
                   <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">
                            Contractor Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Contractor Name"
                            value={formData.contractorName}
                            onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}

                        />     
                    </div>  
            </div>

                <div className="col-md-12 mt-3 mb-4">
                        <label className="projectform text-start d-block">
                            Message <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Add a personalized message..."
                            value={formData.contractorMessage}
                            onChange={(e) => setFormData({ ...formData, contractorMessage: e.target.value })}

                        />     
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
                <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">
                            Entity Code <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Entity Code"
                            value={formData.entityCode}
                            onChange={(e) => setFormData({ ...formData, entityCode: e.target.value })}

                        />
                </div>
                <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">
                            Entity Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Entity Name"
                            value={formData.entityName}
                            onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}

                        />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                        
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
                        name="natureOfBusiness"
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
                        name="grade"
                        options={ gradeOptions}
                        onChange={handleSelectChange} 
                        classNamePrefix="select"
                        value={ gradeOptions.find(option => option.value === formData.grade)}
                        placeholder="Select grades"
                    />
                </div>
            </div>
            <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>
<div className="border border-dashed p-4 text-center rounded" style={{ backgroundColor: "#f9f9f9", cursor: "pointer", borderColor: "#ccc" }}>
    <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
    <label htmlFor="fileUpload" className="d-block cursor-pointer">
        <UploadCloud size={30} className="mb-2" style={{ color: bluePrimary || '#007bff' }} /> 
        <p className="mb-1 fw-bold" style={{ color: bluePrimary || '#007bff' }}>Click to upload or drag and drop</p>
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
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    value={formData.emailID}
                    onChange={(e) => setFormData({ ...formData, emailID: e.target.value })}

                />
            </div>
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="addressType" className="projectform-select text-start d-block">Address Type</label>
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
                    Address 1 <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 1"
                    value={formData.address1}
                    onChange={(e) => setFormData({ ...formData, address1: e.target.value })}

                /> 
            </div> 
        </div>
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label className="projectform text-start d-block">
                    Address 2 <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}

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
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and mb-4 for consistency */}
                <label className="projectform text-start d-block">
                    Zip/Postal Code <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Zip/Postal Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}

                />
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
        
        {/* Row 1: Name | Position */}
        <div className="row"> {/* Changed mb-4 to just row, margins handled by columns */}
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter contact name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4"> {/* ADDED mt-3 mb-4 here for consistency */}
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
        
        {/* Row 2: Phone No | Email ID */}
        <div className="row mb-3">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    value={formData.contactPhoneNo}
                    onChange={(e) => setFormData({ ...formData, contactPhoneNo: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    value={formData.contactEmailID}
                    onChange={(e) => setFormData({ ...formData, contactEmailID: e.target.value })}

                />
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
        {/* Row 1: Tax Type | Territory Type */}
        <div className="row"> {/* Removed mb-3, controlled by col margins */}
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and changed mb-3 to mb-4 for consistency */}
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
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and changed mb-3 to mb-4 for consistency */}
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
        {/* Row 2: Territory | Tax Reg. No */}
        <div className="row"> {/* Removed mb-3, controlled by col margins */}
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and changed mb-3 to mb-4 for consistency */}
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
                    value={formData.taxRegNo}
                    onChange={(e) => setFormData({ ...formData, taxRegNo: e.target.value })}

                />
            </div>  
        </div>
        {/* Row 3: Tax Reg. Date | Address 1 */}
        <div className="row"> {/* Removed mb-3, controlled by col margins */}
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and changed mb-3 to mb-4 for consistency */}
                <label htmlFor="taxRegDate" className="projectform-select text-start d-block">Tax Reg. Date <span className="text-danger">*</span></label>
                <div className="input-group">
                    <input type="text" className="form-control" id="taxRegDate" name="taxRegDate" value={formData.taxRegDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}>< FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 1 <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 1"
                    value={formData.taxAddress1}
                    onChange={(e) => setFormData({ ...formData, taxAddress1: e.target.value })}

                />     
            </div>  
        </div>
        {/* Row 4: Address 2 | City */}
        <div className="row"> {/* Removed mb-3, controlled by col margins */}
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 2 <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    value={formData.taxAddress2}
                    onChange={(e) => setFormData({ ...formData, taxAddress2: e.target.value })}

                />     
            </div>  
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and changed mb-3 to mb-4 for consistency */}
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
        {/* Row 5: Zip/Postal Code | Email ID */}
        <div className="row mb-4"> {/* kept mb-4 here to control bottom margin of the entire section */}
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Zip/Postal Code <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Zip/Postal Code"
                    value={formData.taxZipCode}
                    onChange={(e) => setFormData({ ...formData, taxZipCode: e.target.value })}

                />
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    value={formData.taxEmailID}
                    onChange={(e) => setFormData({ ...formData, taxEmailID: e.target.value })}

                />   
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
        
        {/* Row 1: Account Holder Name | Account No */}
        <div className="row"> {/* Removed mb-3 here for consistency */}
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account Holder Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Account Holder Name"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}

                />     
            </div>  
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Account No"
                    value={formData.accountNo}
                    onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}

                />     
            </div> 
        </div>
        
        {/* Row 2: Bank Name | Branch Name */}
        <div className="row"> {/* Removed mb-3 here for consistency */}
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({...formData, bankName: e.target.value })}

                />     
            </div>  
    
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Branch Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Branch Name"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}

                />     
            </div>  
        </div>
        
        {/* Row 3: Bank Address (Single field) */}
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Address <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Address"
                    value={formData.bankAddress}
                    onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}

                />     
            </div>  
            <div className="col-md-6"> 
                {/* Intentional Empty Column to keep Bank Address aligned left */}
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
        
        {/* Row 1: Type | Registration No */}
        <div className="row"> {/* Removed mb-3, controlled by col margins */}
            <div className="col-md-6 mt-3 mb-4"> {/* Added mt-3 and changed mb-3 to mb-4 for consistency */}
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
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}

                />     
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