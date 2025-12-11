import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, ArrowRight, File, Receipt, Landmark, Info, Mail, Pencil, Phone, MapPin, User, Calendar } from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa';

// --- PLACEHOLDER CONSTANTS ---
// Replace these with your actual definitions
const bluePrimary = "#007bff";
const STORAGE_KEY = "contractorFormData";

const entityTypeOptions = [{ value: 'corp', label: 'Corporation' }];
const taxTypeOptions = [{ value: 'vat', label: 'VAT' }];
const territoryTypeOptions = [{ value: 'state', label: 'State' }];
const territoryOptions = [{ value: 'tx', label: 'Texas' }];
const taxCityOptions = [{ value: 'dallas', label: 'Dallas' }];
const additionalInfoTypeOptions = [{ value: 'license', label: 'License' }];
const addressTypeOptions = [{ value: 'hq', label: 'Headquarters' }];
const countryOptions = [{ value: 'usa', label: 'USA' }];
const addresscityOptions = [{ value: 'houston', label: 'Houston' }];
const contactPositionOptions = [{ value: 'manager', label: 'Manager' }];
// --- END PLACEHOLDER CONSTANTS ---
// Function to apply dynamic error class
const getErrorClass = (fieldName, errors) => errors[fieldName] ? 'is-invalid-field' : '';

// Function to render error message
const renderError = (fieldName, errors) => 
    errors[fieldName] && <p className="text-danger small mt-1">{errors[fieldName]}</p>;


const EmailInviteForm = ({ formData, setFormData, handleSendInvitation, errors }) => (
    <form onSubmit={handleSendInvitation} className="p-3" >
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Email ID <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="contractorEmailId" // ADDED name for validation
                    className={`form-input w-100 ${getErrorClass('contractorEmailId', errors)}`}
                    placeholder="Enter Contractor Email ID"
                    value={formData.contractorEmailId}
                    onChange={(e) => setFormData({ ...formData, contractorEmailId: e.target.value })}
                />
                {renderError('contractorEmailId', errors)}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contractor Name
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Contractor Name"
                    value={formData.contractorName}
                    onChange={(e) => setFormData({ ...formData, contractorName: e.target.value })}

                />
            </div>
        </div>
        <div className="row">
            <div className="col-12 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Message
                </label>
                <textarea
                    className="form-input w-100"
                    placeholder="Enter message for the contractor"
                    rows="4"
                    value={formData.contractorMessage}
                    onChange={(e) => setFormData({ ...formData, contractorMessage: e.target.value })}
                />
            </div>
        </div>
        <div className="d-flex justify-content-end mt-4">
            <button type="submit" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Send Invitation<Mail size={21} color="white" className="ms-2" /></button>
        </div>
    </form>
);


const ManualEntryForm = ({ formData, setFormData, handleChange, handleSelectChange, handleFileChange, handleRemoveFile, errors }) => ( // ADDED errors
    <div style={{ padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Pencil size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
                <input
                    type="text"
                    name="entityCode"
                    className={`form-input w-100 ${getErrorClass('entityCode', errors)}`} // MODIFIED
                    placeholder="Enter Entity Code"
                    value={formData.entityCode}
                    onChange={(e) => setFormData({ ...formData, entityCode: e.target.value })}
                />
                {renderError('entityCode', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                <input
                    type="text"
                    name="entityName"
                    className={`form-input w-100 ${getErrorClass('entityName', errors)}`} // MODIFIED
                    placeholder="Enter Entity Name"
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                />
                {renderError('entityName', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mb-3">
                <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date<span style={{ color: "red" }}>*</span></label>
                <div className="input-group">
                    <input
                        type="text"
                        className={`form-control ${getErrorClass('effectiveDate', errors)}`} // MODIFIED
                        id="effectiveDate"
                        name="effectiveDate"
                        value={formData.effectiveDate}
                        onChange={handleChange}
                        placeholder="mm/dd/yy"
                        style={{ height: "40px" }}
                    />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
                {renderError('effectiveDate', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mb-3">
                <label htmlFor="entityType" className="projectform-select text-start d-block">Entity Type <span style={{ color: "red" }}>*</span></label>
                <Select
                    name="entityType"
                    options={entityTypeOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.entityType ? 'is-invalid-field-select' : ''} // MODIFIED for select
                    value={entityTypeOptions.find(option => option.value === formData.entityType)}
                    placeholder="Select entity type"
                />
                {renderError('entityType', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Nature of Business</label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Nature of Business"
                    value={formData.natureOfBusiness}
                    onChange={(e) => setFormData({ ...formData, natureOfBusiness: e.target.value })}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Grade</label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Phone No.</label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Phone No."
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Email ID</label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Email ID"
                    value={formData.emailID}
                    onChange={(e) => setFormData({ ...formData, emailID: e.target.value })}
                />
            </div>
        </div>
        {/* Attachments Section */}
        <div className="mt-3">
            <label className="projectform text-start d-block mb-2">Attachments</label>
            <div className="d-flex align-items-center mb-3">
                <input
                    type="file"
                    id="fileUpload"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    onClick={() => document.getElementById('fileUpload').click()}
                    className="btn d-flex align-items-center fw-bold"
                    style={{ backgroundColor: 'white', color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '6px', padding: '0.375rem 0.75rem' }}
                >
                    <File size={18} className="me-2" /> Upload Files
                </button>
            </div>
            {formData.attachmentMetadata.length > 0 && (
                <div className="list-group">
                    {formData.attachmentMetadata.map((file, index) => (
                        <div key={index} className="list-group-item d-flex justify-content-between align-items-center" style={{ padding: '0.5rem 1rem', borderRadius: '4px', marginBottom: '4px', border: '1px solid #e9ecef' }}>
                            <span>{file.name}</span>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Remove"
                                onClick={() => handleRemoveFile(file.name)}
                            ></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);


const AddressDetailsContent = ({ formData, setFormData, handleSelectChange, errors }) => ( // ADDED errors
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <MapPin size={20} className="me-2 text-white" />
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
                    className={errors.addressType ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={addressTypeOptions.find(option => option.value === formData.addressType)}
                    placeholder="Select Address Type"
                />
                {renderError('addressType', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 1 <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="address1"
                    className={`form-input w-100 ${getErrorClass('address1', errors)}`} // MODIFIED
                    placeholder="Enter Address 1"
                    value={formData.address1}
                    onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                />
                {renderError('address1', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 2
                </label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Address 2"
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
                    className={errors.country ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={countryOptions.find(option => option.value === formData.country)}
                    placeholder="Select Country"
                />
                {renderError('country', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="addresscity" className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                <Select
                    name="addresscity"
                    options={addresscityOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.addresscity ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={addresscityOptions.find(option => option.value === formData.addresscity)}
                    placeholder="Select City"
                />
                {renderError('addresscity', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Zip/Postal Code <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    name="zipCode"
                    className={`form-input w-100 ${getErrorClass('zipCode', errors)}`} // MODIFIED
                    placeholder="Enter Zip/Postal Code"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
                {renderError('zipCode', errors)} {/* ADDED error display */}
            </div>
        </div>
    </div>
);


const ContactDetailsContent = ({ formData, setFormData, handleSelectChange, errors }) => ( // ADDED errors
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <User size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contact Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="contactName"
                    className={`form-input w-100 ${getErrorClass('contactName', errors)}`} // MODIFIED
                    placeholder="Enter Contact Name"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                />
                {renderError('contactName', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="contactPosition" className="projectform-select text-start d-block">Contact Position <span className="text-danger">*</span></label>
                <Select
                    name="contactPosition"
                    options={contactPositionOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.contactPosition ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={contactPositionOptions.find(option => option.value === formData.contactPosition)}
                    placeholder="Select Contact Position"
                />
                {renderError('contactPosition', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
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

const TaxDetailsContent = ({ formData, setFormData, handleChange, handleSelectChange, errors }) => ( // ADDED errors
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
                    options={taxTypeOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.taxType ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={taxTypeOptions.find(option => option.value === formData.taxType)}
                    placeholder="Select tax type"
                />
                {renderError('taxType', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="territoryType" className="projectform-select text-start d-block">Territory Type <span className="text-danger">*</span></label>
                <Select
                    name="territoryType"
                    options={territoryTypeOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.territoryType ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={territoryTypeOptions.find(option => option.value === formData.territoryType)}
                    placeholder="Select territory type"
                />
                {renderError('territoryType', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="territory" className="projectform-select text-start d-block">Territory <span className="text-danger">*</span></label>
                <Select
                    name="territory"
                    options={territoryOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.territory ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={territoryOptions.find(option => option.value === formData.territory)}
                    placeholder="Select territory type"
                />
                {renderError('territory', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Tax Reg. No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="taxRegNo"
                    className={`form-input w-100 ${getErrorClass('taxRegNo', errors)}`} // MODIFIED
                    placeholder="Enter tax registration no"
                    value={formData.taxRegNo}
                    onChange={(e) => setFormData({ ...formData, taxRegNo: e.target.value })}
                />
                {renderError('taxRegNo', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="taxRegDate" className="projectform-select text-start d-block">Tax Reg. Date <span className="text-danger">*</span></label>
                <div className="input-group">
                    <input type="text"
                        className={`form-control ${getErrorClass('taxRegDate', errors)}`} // MODIFIED
                        id="taxRegDate"
                        name="taxRegDate"
                        value={formData.taxRegDate}
                        onChange={handleChange}
                        placeholder="mm/dd/yy"
                        style={{ height: "40px" }}
                    />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><FaCalendarAlt size={18} className="text-muted" /></span>
                </div>
                {renderError('taxRegDate', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Address 1 <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="taxAddress1"
                    className={`form-input w-100 ${getErrorClass('taxAddress1', errors)}`} // MODIFIED
                    placeholder="Enter Address 1"
                    value={formData.taxAddress1}
                    onChange={(e) => setFormData({ ...formData, taxAddress1: e.target.value })}
                />
                {renderError('taxAddress1', errors)} {/* ADDED error display */}
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
                    options={taxCityOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.taxCity ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={taxCityOptions.find(option => option.value === formData.taxCity)}
                    placeholder="Select City type"
                />
                {renderError('taxCity', errors)} {/* ADDED error display */}
            </div>
        </div>
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Zip/Postal Code <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="taxZipCode"
                    className={`form-input w-100 ${getErrorClass('taxZipCode', errors)}`} // MODIFIED
                    placeholder="Enter Zip/Postal Code"
                    value={formData.taxZipCode}
                    onChange={(e) => setFormData({ ...formData, taxZipCode: e.target.value })}

                />
                {renderError('taxZipCode', errors)} {/* ADDED error display */}
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

const BankAccountsContent = ({ formData, setFormData, errors }) => ( // ADDED errors
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
                <input type="text"
                    name="accountHolderName"
                    className={`form-input w-100 ${getErrorClass('accountHolderName', errors)}`} // MODIFIED
                    placeholder="Enter Account Holder Name"
                    value={formData.accountHolderName}
                    onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}

                />
                {renderError('accountHolderName', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Account No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="accountNo"
                    className={`form-input w-100 ${getErrorClass('accountNo', errors)}`} // MODIFIED
                    placeholder="Enter Account No"
                    value={formData.accountNo}
                    onChange={(e) => setFormData({ ...formData, accountNo: e.target.value })}

                />
                {renderError('accountNo', errors)} {/* ADDED error display */}
            </div>
        </div>

        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Bank Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="bankName"
                    className={`form-input w-100 ${getErrorClass('bankName', errors)}`} // MODIFIED
                    placeholder="Enter Bank Name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}

                />
                {renderError('bankName', errors)} {/* ADDED error display */}
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Branch Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="branchName"
                    className={`form-input w-100 ${getErrorClass('branchName', errors)}`} // MODIFIED
                    placeholder="Enter Branch Name"
                    value={formData.branchName}
                    onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}

                />
                {renderError('branchName', errors)} {/* ADDED error display */}
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

const AdditionalInfoContent = ({ formData, setFormData, handleSelectChange, errors }) => ( // ADDED errors
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
                    options={additionalInfoTypeOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    className={errors.additionalInfoType ? 'is-invalid-field-select' : ''} // MODIFIED
                    value={additionalInfoTypeOptions.find(option => option.value === formData.additionalInfoType)}
                    placeholder="Select type"
                />
                {renderError('additionalInfoType', errors)} {/* ADDED error display */}
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Registration No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text"
                    name="registrationNo"
                    className={`form-input w-100 ${getErrorClass('registrationNo', errors)}`} // MODIFIED
                    placeholder="Enter Registration No"
                    value={formData.registrationNo}
                    onChange={(e) => setFormData({ ...formData, registrationNo: e.target.value })}

                />
                {renderError('registrationNo', errors)} {/* ADDED error display */}
            </div>
        </div>
    </div>
);
