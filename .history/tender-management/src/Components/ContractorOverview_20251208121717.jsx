import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

// --- Constants ---
const bluePrimary = '#005197'; 

// --- Placeholder Options (DO NOT CHANGE) ---
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
 * Custom Upload Component (NO CHANGES AS REQUESTED)
 */
const UploadDocumentSection = ({ file, handleFileChange }) => (
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
                {/* Hidden file input */}
                <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                
                {/* Label acts as the clickable area */}
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
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
const ManualEntryForm = ({ formData, handleChange, handleSelectChange, handleFileChange }) => (
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
                    name="entityCode" // 🔑 ADDED NAME
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
                    name="entityName" // 🔑 ADDED NAME
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
                        name="effectiveDate" // 🔑 ADDED NAME
                        value={formData.effectiveDate}
                        onChange={handleChange}
                        placeholder="mm/dd/yy"
                        style={{ height: "40px" }}
                    />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
            </div>

            <div className="col-md-6 mb-3">
                <label htmlFor="entityType" className="projectform-select text-start d-block">
                    Entity Type <span style={{ color: "red" }}>*</span>
                </label>
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
                <label htmlFor="natureOfBusiness" className="projectform-select text-start d-block">
                    Nature of business
                </label>
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
                <label htmlFor="grade" className="projectform-select text-start d-block">
                    Grade
                </label>
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
        />
    </>
);

/**
 * Email Invite Form
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
const EmailInviteForm = ({ formData, handleChange, handleFileChange }) => (
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
            <Mail size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Invite Contractor via Email</h3>
        </div>

        <div className="row mb-3">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Contractor Name"
                    name="inviteName" // 🔑 ADDED NAME
                    value={formData.inviteName}
                    onChange={handleChange}
                />
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Email ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="email"
                    className="form-input w-100"
                    placeholder="Enter Email ID"
                    name="inviteEmailID" // 🔑 ADDED NAME
                    value={formData.inviteEmailID}
                    onChange={handleChange}
                />
            </div>
        </div>

        <UploadDocumentSection 
            file={formData.attachment} 
            handleFileChange={handleFileChange} 
        />
    </>
);


/**
 * Address Details Form
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
const AddressDetailsContent = ({ formData, handleChange, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Building size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
        </div>
        
        <div className="row"> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Phone No</label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    name="phoneNo" // 🔑 ADDED NAME
                    value={formData.phoneNo}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Email ID</label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="emailID" // 🔑 ADDED NAME
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
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'addressType' })}
                    classNamePrefix="select"
                    value={ addressTypeOptions.find(option => option.value === formData.addressType)}
                    placeholder="Select addressType"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 1 <span style={{ color: "red" }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 1"
                    name="address1" // 🔑 ADDED NAME
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
                    name="address2" // 🔑 ADDED NAME
                    value={formData.address2}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="country" className="projectform-select text-start d-block">Country <span className="text-danger">*</span></label>
                <Select
                    name="country"
                    options={ countryOptions}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'country' })}
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
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'addresscity' })}
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
                    name="zipCode" // 🔑 ADDED NAME
                    value={formData.zipCode}
                    onChange={handleChange}
                />
            </div>
        </div>
    </div>
);


/**
 * Contact Details Form
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
const ContactDetailsContent = ({ formData, handleChange, handleSelectChange }) => (
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
                    name="contactName" // 🔑 ADDED NAME
                    value={formData.contactName}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4"> 
                <label htmlFor="contactPosition" className="projectform-select text-start d-block">Position <span className="text-danger">*</span></label>
                <Select
                    name="contactPosition"
                    options={ contactPositionOptions}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'contactPosition' })}
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
                    name="contactPhoneNo" // 🔑 ADDED NAME
                    value={formData.contactPhoneNo}
                    onChange={handleChange}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="contactEmailID" // 🔑 ADDED NAME
                    value={formData.contactEmailID}
                    onChange={handleChange}
                />
            </div>  
        </div>
    </div>
);


/**
 * Tax Details Form
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
const TaxDetailsContent = ({ formData, handleChange, handleSelectChange }) => (
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
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'taxType' })}
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
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'territoryType' })}
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
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'territory' })}
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
                    name="taxRegNo" // 🔑 ADDED NAME
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
                    name="taxAddress1" // 🔑 ADDED NAME
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
                    name="taxAddress2" // 🔑 ADDED NAME
                    value={formData.taxAddress2}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="taxCity" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                <Select
                    name="taxCity"
                    options={ taxCityOptions}
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'taxCity' })}
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
                    name="taxZipCode" // 🔑 ADDED NAME
                    value={formData.taxZipCode}
                    onChange={handleChange}
                />
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    name="taxEmailID" // 🔑 ADDED NAME
                    value={formData.taxEmailID}
                    onChange={handleChange}
                />   
            </div>
        </div>
    </div>
);


/**
 * Bank Accounts Form
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
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
                    name="accountHolderName" // 🔑 ADDED NAME
                    value={formData.accountHolderName}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Account No"
                    name="accountNo" // 🔑 ADDED NAME
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
                    name="bankName" // 🔑 ADDED NAME
                    value={formData.bankName}
                    onChange={handleChange}
                />  
            </div> 
    
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Branch Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Branch Name"
                    name="branchName" // 🔑 ADDED NAME
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
                    name="bankAddress" // 🔑 ADDED NAME
                    value={formData.bankAddress}
                    onChange={handleChange}
                /> 
            </div> 
            <div className="col-md-6"> 
            </div>
        </div>
    </div>
);


/**
 * Additional Info Form
 * FIX: Added 'name' attribute to all inputs and used consistent handlers.
 */
const AdditionalInfoContent = ({ formData, handleChange, handleSelectChange }) => (
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
                    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'additionalInfoType' })}
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
                    name="registrationNo" // 🔑 ADDED NAME
                    value={formData.registrationNo}
                    onChange={handleChange}
                />  
            </div> 
        </div>
    </div>
);


// ----------------------------------------------------------------------
// 2. MAIN COMPONENT
// ----------------------------------------------------------------------

const ContractorOverview = () => {
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState('manual'); // 'manual' or 'email'

    // 🔑 STEP 1: Initialize comprehensive form data state
    const [formData, setFormData] = useState({
        // Basic Info
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: '',
        natureOfBusiness: '',
        grade: '',
        attachment: null, // For file uploads
        
        // Address Details
        phoneNo: '',
        emailID: '',
        addressType: '',
        address1: '',
        address2: '',
        country: '',
        addresscity: '',
        zipCode: '',

        // Contact Details
        contactName: '',
        contactPosition: '',
        contactPhoneNo: '',
        contactEmailID: '',

        // Tax Details
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

        // Bank Accounts
        accountHolderName: '',
        accountNo: '',
        bankName: '',
        branchName: '',
        bankAddress: '',

        // Additional Info
        additionalInfoType: '',
        registrationNo: '',

        // Email Invite (used when selectedView === 'email')
        inviteName: '',
        inviteEmailID: '',
    });

    // 🔑 STEP 2: Universal change handler for regular inputs (text, date)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 🔑 STEP 3: Universal change handler for react-select components
    const handleSelectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        // The value for react-select is the option's value
        setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
    };
    
    // 🔑 STEP 4: Handler for file input
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    // --- View and Navigation Handlers ---
    const handleGoBack = () => navigate(-1);
    const handleCancel = () => {
        // Implement cancellation logic, e.g., reset form or navigate back
        setFormData({ /* Reset initial state */ });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted with data:", formData);
        // Add form validation and submission logic here
    };

    const handleViewChange = (view) => setSelectedView(view);

    // --- Styling based on selected view ---
    const getButtonStyle = (view) => ({
        backgroundColor: selectedView === view ? bluePrimary : '#E9E9E9',
        color: selectedView === view ? 'white' : bluePrimary,
        borderRadius: selectedView === view ? '6px' : '6px ',
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
                
                <form id="contractorForm" onSubmit={handleSubmit}>
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: selectedView === 'manual' ? "0 1.5rem 1.5rem 1.5rem" : "1.5rem" }}>
                        {selectedView === 'manual' ? 
                            <ManualEntryForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange} 
                                handleFileChange={handleFileChange} 
                            /> : 
                            <EmailInviteForm 
                                formData={formData} 
                                handleChange={handleChange} 
                                handleSelectChange={handleSelectChange}
                                handleFileChange={handleFileChange} 
                            />
                        }
                    </div>
                    
                    {selectedView === 'manual' && <AddressDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />}
                    {selectedView === 'manual' && <ContactDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />}
                    {selectedView === 'manual' && <TaxDetailsContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />}
                    {selectedView === 'manual' && <BankAccountsContent formData={formData} handleChange={handleChange} />}
                    {selectedView === 'manual' && <AdditionalInfoContent formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} />}
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