import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // Assuming you use react-select for dropdowns
import { FaCalendarAlt } from 'react-icons/fa'; // Assuming you use react-icons for the calendar
import {
    ArrowLeft, ArrowRight, Pencil, Mail, FileText,
    Building, PhoneCall, Receipt, Landmark, Info,
    Paperclip, X
} from 'lucide-react'; // Assuming you use lucide-react or similar for other icons

// --- Global/Mock Definitions (Replace with your actual imports/data) ---
// Define your primary color
const bluePrimary = '#2582E5'; 
// Mock options for react-select (You must define these arrays in your actual file)
const entityTypeOptions = [{ value: 'corp', label: 'Corporation' }];
const natureOfBusinessOptions = [{ value: 'it', label: 'IT Services' }];
const gradeOptions = [{ value: 'a', label: 'Grade A' }];
const addressTypeOptions = [{ value: 'hq', label: 'Headquarters' }];
const countryOptions = [{ value: 'us', label: 'United States' }];
const addresscityOptions = [{ value: 'ny', label: 'New York' }];
const contactPositionOptions = [{ value: 'manager', label: 'Manager' }];
const taxTypeOptions = [{ value: 'vat', label: 'VAT' }];
const territoryTypeOptions = [{ value: 'int', label: 'International' }];
const territoryOptions = [{ value: 'eu', label: 'Europe' }];
const taxCityOptions = [{ value: 'lon', label: 'London' }];
const additionalInfoTypeOptions = [{ value: 'cin', label: 'CIN' }];
// ----------------------------------------------------------------------


// ======================================================================
// 1. FORM CONTENT COMPONENTS (Inputs)
// ======================================================================

const ManualEntryForm = ({ formData, setFormData, handleChange, handleSelectChange, handleFileChange, handleRemoveFile }) => (
    <>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <FileText size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Entity Code <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter entity code"
                    value={formData.entityCode}
                    onChange={(e) => setFormData({ ...formData, entityCode: e.target.value })}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Entity Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter entity name"
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="effectiveDate" className="projectform text-start d-block">
                    Effective Date <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                    <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
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
        <div className="mt-3 mb-4">
            <label className="projectform text-start d-block">
                Attachments (Certificates/Licenses)
            </label>
            <div className="input-group">
                <input
                    type="file"
                    className="form-control"
                    id="fileUpload"
                    onChange={handleFileChange}
                    style={{ height: "40px", borderRight: "none" }}
                    multiple
                />
                <label className="input-group-text bg-white" htmlFor="fileUpload" style={{ height: "40px" }}>
                    <Paperclip size={18} className="text-muted" />
                </label>
            </div>
            <div className="mt-2">
                {formData.attachments.map((file, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-between p-2 mt-2" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                        <div className="d-flex align-items-center">
                            <FileText size={16} className="me-2 text-muted" />
                            <span className="small text-truncate">{file.name}</span>
                            <span className="text-muted ms-2 small">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                        <X size={16} className="text-danger" style={{ cursor: 'pointer' }} onClick={() => handleRemoveFile(file.name)} />
                    </div>
                ))}
            </div>
        </div>
    </>
);

const EmailInviteForm = ({ formData, setFormData, handleSendInvitation }) => (
    <form onSubmit={handleSendInvitation}>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="email" className="form-input w-100" placeholder="Enter Contractor Email ID"
                    value={formData.contractorEmailId}
                    onChange={(e) => setFormData({ ...formData, contractorEmailId: e.target.value })}
                    required
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Contractor Name"
                    value={formData.contractorName}
                    onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}
                    required
                />
            </div>
        </div>
        <div className="row">
            <div className="col-12 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Message
                </label>
                <textarea className="form-control" rows="4" placeholder="Enter invitation message"
                    value={formData.contractorMessage}
                    onChange={(e) => setFormData({ ...formData, contractorMessage: e.target.value })}
                ></textarea>
            </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}>
                Send Invitation <Mail size={21} color="white" className="ms-2" />
            </button>
        </div>
    </form>
);

const AddressDetailsContent = ({ formData, setFormData, handleSelectChange }) => (
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
                <input type="text" className="form-input w-100" placeholder="Enter phone no"
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
                <label className="projectform text-start d-block">
                    Address 1
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
                    Address 2
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

const ContactDetailsContent = ({ formData, setFormData, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <PhoneCall size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contact Person Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter contact name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="contactPosition" className="projectform-select text-start d-block">Position <span className="text-danger">*</span></label>
                <Select
                    name="contactPosition"
                    options={contactPositionOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    value={contactPositionOptions.find(option => option.value === formData.contactPosition)}
                    placeholder="Select position"
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter phone no"
                    value={formData.contactPhoneNo}
                    onChange={(e) => setFormData({ ...formData, contactPhoneNo: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    value={formData.contactEmailID}
                    onChange={(e) => setFormData({ ...formData, contactEmailID: e.target.value })}

                />
            </div>
        </div>
    </div>
);

const TaxDetailsContent = ({ formData, setFormData, handleChange, handleSelectChange }) => (
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
                    value={formData.taxRegNo}
                    onChange={(e) => setFormData({ ...formData, taxRegNo: e.target.value })}

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
                    value={formData.taxAddress1}
                    onChange={(e) => setFormData({ ...formData, taxAddress1: e.target.value })}

                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 2
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Address 2"
                    value={formData.taxAddress2}
                    onChange={(e) => setFormData({ ...formData, taxAddress2: e.target.value })}

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
                    value={formData.taxZipCode}
                    onChange={(e) => setFormData({ ...formData, taxZipCode: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    value={formData.taxEmailID}
                    onChange={(e) => setFormData({ ...formData, taxEmailID: e.target.value })}

                />
            </div>
        </div>
    </div>
);

const BankAccountsContent = ({ formData, setFormData }) => (
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

        <div className="row">
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
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Address
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Bank Address"
                    value={formData.bankAddress}
                    onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}

                />
            </div>
            <div className="col-md-6">
            </div>
        </div>
    </div>
);

const AdditionalInfoContent = ({ formData, setFormData, handleSelectChange }) => (
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
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}

                />
            </div>
        </div>
    </div>
);


// ======================================================================
// 2. REVIEW CONTENT COMPONENTS (Read-Only Display)
// ======================================================================

const Field = ({ label, value }) => (
    <div className="col-md-6">
        <label className="projectform text-start d-block small mb-1" style={{ color: '#6286A6' }}>
            {label}
        </label>
        <p className="mb-0 fw-bold" style={{ color: '#333' }}>
            {value || 'N/A'}
        </p>
    </div>
);

const ReviewCard = ({ title, icon, children, bluePrimary }) => (
    <div className="mb-4">
        <div className="p-2 mb-3 d-flex align-items-center" style={{ backgroundColor: bluePrimary, borderRadius: "6px" }}>
            {icon}
            <h4 className="mb-0 fs-6 fw-bold text-white ms-2">{title}</h4>
        </div>
        <div className="row g-4 px-2">
            {children}
        </div>
    </div>
);

const ReviewSubmitContent = ({ formData, handleEditForm, handleFinalSubmit, bluePrimary }) => (
    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center" style={{ borderBottom: `1px solid #E0E0E0` }}>
            <h3 className="mb-0 fs-5 fw-bold" style={{ color: bluePrimary }}>
                Review & Submit
            </h3>
        </div>
        <p className="small mb-4" style={{ color: '#6286A6' }}>
            Please verify the information below is correct before submitting.
        </p>

        {/* 1. Basic Information */}
        <ReviewCard title="Basic Information" icon={<FileText size={20} className="text-white" />} bluePrimary={bluePrimary}>
            <Field label="Entity Code" value={formData.entityCode} />
            <Field label="Entity Name" value={formData.entityName} />
            <Field label="Effective Date" value={formData.effectiveDate} />
            <Field label="Entity Type" value={formData.entityType} />
            <Field label="Nature of Business" value={formData.natureOfBusiness} />
            <Field label="Grade" value={formData.grade} />
            <div className="col-12">
                <label className="projectform text-start d-block small mb-1" style={{ color: '#6286A6' }}>
                    Attachment (Certificates/Licenses) ({formData.attachments.length} files)
                </label>
                <div className="d-flex flex-wrap gap-2">
                    {formData.attachments.map(file => (
                        <span key={file.name} className="badge bg-light text-dark border p-2 small">
                            {file.name}
                        </span>
                    ))}
                    {formData.attachments.length === 0 && <span className="text-muted">No files uploaded</span>}
                </div>
            </div>
        </ReviewCard>

        {/* 2. Address Details */}
        <ReviewCard title="Address Details" icon={<Building size={20} className="text-white" />} bluePrimary={bluePrimary}>
            <Field label="Phone No" value={formData.phoneNo} />
            <Field label="Email ID" value={formData.emailID} />
            <Field label="Address Type" value={formData.addressType} />
            <Field label="Address 1" value={formData.address1} />
            <Field label="Address 2" value={formData.address2} />
            <Field label="Country" value={formData.country} />
            <Field label="City" value={formData.addresscity} />
            <Field label="Zip/Postal Code" value={formData.zipCode} />
        </ReviewCard>

        {/* 3. Contact Details */}
        <ReviewCard title="Contact Details" icon={<PhoneCall size={20} className="text-white" />} bluePrimary={bluePrimary}>
            <Field label="Name" value={formData.contactName} />
            <Field label="Position" value={formData.contactPosition} />
            <Field label="Phone No" value={formData.contactPhoneNo} />
            <Field label="Email ID" value={formData.contactEmailID} />
        </ReviewCard>

        {/* 4. Tax Details */}
        <ReviewCard title="Tax Details" icon={<Receipt size={20} className="text-white" />} bluePrimary={bluePrimary}>
            <Field label="Tax Type" value={formData.taxType} />
            <Field label="Territory Type" value={formData.territoryType} />
            <Field label="Territory" value={formData.territory} />
            <Field label="Tax Reg. No" value={formData.taxRegNo} />
            <Field label="Tax Reg. Date" value={formData.taxRegDate} />
            <Field label="Address 1" value={formData.taxAddress1} />
            <Field label="Address 2" value={formData.taxAddress2} />
            <Field label="City" value={formData.taxCity} />
            <Field label="Zip/Postal Code" value={formData.taxZipCode} />
            <Field label="Email ID" value={formData.taxEmailID} />
        </ReviewCard>

        {/* 5. Bank Accounts */}
        <ReviewCard title="Bank Accounts" icon={<Landmark size={20} className="text-white" />} bluePrimary={bluePrimary}>
            <Field label="Account Holder Name" value={formData.accountHolderName} />
            <Field label="Account No" value={formData.accountNo} />
            <Field label="Bank Name" value={formData.bankName} />
            <Field label="Branch Name" value={formData.branchName} />
            <Field label="Bank Address" value={formData.bankAddress} />
        </ReviewCard>

        {/* 6. Additional Info */}
        <ReviewCard title="Additional Info" icon={<Info size={20} className="text-white" />} bluePrimary={bluePrimary}>
            <Field label="Type" value={formData.additionalInfoType} />
            <Field label="Registration No" value={formData.registrationNo} />
        </ReviewCard>
        
        {/* Review Footer Buttons */}
        <div className="d-flex justify-content-end pt-4 border-top">
             <button
                type="button"
                className="btn btn-outline-secondary me-3 px-4 fw-bold"
                onClick={handleEditForm}
                style={{ borderRadius: "6px" }}
            >
                <Pencil size={20} className="me-2" /> Edit Form
            </button>
            <button
                type="button"
                onClick={handleFinalSubmit}
                className="btn px-4 fw-bold"
                style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}
            >
                Submit <ArrowRight size={21} color="white" className="ms-2" />
            </button>
        </div>
    </div>
);


// ======================================================================
// 3. MAIN ContractorOverview COMPONENT
// ======================================================================

function ContractorOverview() {
    const navigate = useNavigate();

    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);
    
    // State to toggle between form entry and review screen
    const [isReviewMode, setIsReviewMode] = useState(false); 

    const [formData, setFormData] = useState({
        entityCode: '', entityName: '', effectiveDate: '', entityType: '',
        natureOfBusiness: '', grade: '', 
        attachments: [], 
        phoneNo: '', emailID: '',
        addressType: '', address1: '', address2: '', country: '', addresscity: '', zipCode: '',
        contactName: '', contactPosition: '', contactPhoneNo: '', contactEmailID: '',
        taxType: '', territoryType: '', territory: '', taxRegNo: '', taxRegDate: '',
        taxAddress1: '', taxAddress2: '', taxCity: '', taxZipCode: '', taxEmailID: '',
        accountHolderName: '', accountNo: '', bankName: '', branchName: '', bankAddress: '',
        additionalInfoType: '', registrationNo: '',
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
        setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        e.target.value = null; 

        setFormData(prev => ({ 
            ...prev, 
            attachments: [...prev.attachments, ...newFiles] 
        }));
    };

    const handleRemoveFile = (fileNameToRemove) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter(file => file.name !== fileNameToRemove)
        }));
    };
    
    // Function called by the "Review & Submit" button to show the review screen
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        console.log("Switching to Review Mode with data:", formData);
        setIsReviewMode(true); 
    };

    // Function called by the "Submit" button on the Review screen
    const handleFinalSubmit = () => {
        console.log("Final Submission successful! Data sent to backend:", formData);
    };

    // Function called by the "Edit Form" button on the Review screen
    const handleEditForm = () => {
        setIsReviewMode(false); 
    };
    
    // Cancellation handler
    const handleCancel = () => console.log("Form Cancelled");

    const handleSendInvitation = (e) => {
        e.preventDefault();
        console.log("Invitation Sent:", { 
            contractorEmailId: formData.contractorEmailId, 
            contractorName: formData.contractorName, 
            message: formData.contractorMessage 
        });
    };
    
    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    
    // Styling constants (using bluePrimary defined at the top)
    const buttonGroupStyle = { 
        borderRadius: '6px', 
        overflow: 'hidden', 
        boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' 
    };
    
    const manualButtonStyle = { 
        paddingLeft: '20px', 
        paddingRight: '20px', 
        borderTopRightRadius: isManualActive ? 0 : '6px', 
        borderBottomRightRadius: isManualActive ? 0 : '6px', 
        backgroundColor: isManualActive ? bluePrimary : 'white', 
        color: isManualActive ? 'white' : bluePrimary, 
        transition: 'all 0.3s', 
        border: 'none', 
        outline: 'none' 
    };
    
    const emailButtonStyle = { 
        paddingLeft: '20px', 
        paddingRight: '20px', 
        borderTopLeftRadius: isEmailActive ? 0 : '6px', 
        borderBottomLeftRadius: isEmailActive ? 0 : '6px', 
        backgroundColor: isEmailActive ? bluePrimary : 'white', 
        color: isEmailActive ? 'white' : bluePrimary, 
        transition: 'all 0.3s', 
        border: 'none', 
        outline: 'none' 
    };

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
                
                {/* CONDITIONAL RENDERING: Show Review Screen OR Forms */}
                {isReviewMode ? (
                    <ReviewSubmitContent 
                        formData={formData} 
                        handleEditForm={handleEditForm} 
                        handleFinalSubmit={handleFinalSubmit} 
                        bluePrimary={bluePrimary}
                    />
                ) : (
                    <form id="contractorForm" onSubmit={handleSubmit}>
                        <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: selectedView === 'manual' ? "0 1.5rem 1.5rem 1.5rem" : "1.5rem" }}>
                            {selectedView === 'manual' ? 
                                <ManualEntryForm 
                                    formData={formData} 
                                    setFormData={setFormData} 
                                    handleChange={handleChange} 
                                    handleSelectChange={handleSelectChange}
                                    handleFileChange={handleFileChange} 
                                    handleRemoveFile={handleRemoveFile}
                                /> 
                                : 
                                <EmailInviteForm 
                                    formData={formData} 
                                    setFormData={setFormData}
                                    handleSendInvitation={handleSendInvitation}
                                />
                            }
                        </div>
                        {selectedView === 'manual' && <AddressDetailsContent formData={formData} setFormData={setFormData} handleSelectChange={handleSelectChange} />}
                        {selectedView === 'manual' && <ContactDetailsContent formData={formData} setFormData={setFormData} handleSelectChange={handleSelectChange} />}
                        {selectedView === 'manual' && <TaxDetailsContent formData={formData} setFormData={setFormData} handleChange={handleChange} handleSelectChange={handleSelectChange} />}
                        {selectedView === 'manual' && <BankAccountsContent formData={formData} setFormData={setFormData} />}
                        {selectedView === 'manual' && <AdditionalInfoContent formData={formData} setFormData={setFormData} handleSelectChange={handleSelectChange} />}
                        
                        {/* Only show "Review & Submit" button when in Manual Entry mode and Form mode */}
                        {selectedView === 'manual' && (
                            <div className="d-flex justify-content-end mt-4">
                                <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleCancel} style={{ borderRadius: "6px" }}>Cancel</button>
                                <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Review & Submit<ArrowRight size={21} color="white" className="ms-2" /></button>
                            </div>
                        )}
                    </form>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;