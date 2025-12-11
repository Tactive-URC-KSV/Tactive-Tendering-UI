import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info, X, ArrowRight } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

const bluePrimary = '#005197';
const STORAGE_KEY = 'contractorFormData';

const entityTypeOptions = [{ value: 'contractor', label: 'Contractor' },
    { value: 'Design Consultant', label: 'Design Consultant' },
    { value: 'PMC Consultant', label: 'PMC Consultant' },];
const natureOfBusinessOptions = [{ value: 'Contracting Services', label: 'Contracting Services' },
    { value: 'Civil Contractor', label: 'Civil Contractor' },
    { value: 'Infrastructure Contracting Services', label: 'Infrastructure Contracting Services' },];
const gradeOptions = [{ value: 'A Grade', label: 'A Grade' },
    { value: 'B Grade', label: 'B Grade' },];
const addressTypeOptions = [{ value: 'Office Address', label: 'Office Address' },
    { value: 'Present Address', label: 'Present Address' },];
const countryOptions = [];
const addresscityOptions = [];
const contactPositionOptions = [];
const territoryTypeOptions = [{ value: 'Country', label: 'Country' },
    { value: 'State', label: 'State' },];
const taxTypeOptions = [{ value: 'Regular GST', label: 'Regular GST' },
    { value: 'Composite GST', label: 'Composite GST' },
    { value: 'gst_un_register', label: 'GST Un-Register' },
    { value: 'vat_register', label: 'VAT Register' },
    { value: 'vat_un_register', label: 'VAT Un-Register' },
    { value: 'trade_license_register', label: 'Trade License Register' },
    { value: 'trade_license_un_register', label: 'Trade License Un-Register' },
    { value: 'msme_register', label: 'MSME Register' },];
const territoryOptions = [];
const taxCityOptions = [];
const additionalInfoTypeOptions = [{ value: 'PAN No', label: 'PAN No' },
    { value: 'TIN No', label: 'TIN No' },
    { value: 'CIN No', label: 'CIN No' },];


const EmailInviteForm = ({ formData, setFormData, handleSendInvitation }) => (
    <form onSubmit={handleSendInvitation} className="p-3" >
        <div className="text-center p-4">
            <Mail size={30} className=" mb-3" style={{ color: bluePrimary }} />
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
                    value={formData.contractorEmailId}
                    onChange={(e) =>
                        setFormData({ ...formData, contractorEmailId: e.target.value })
                    }
                />
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Contractor Name</label>
                <input
                    type="text"
                    className="form-input w-100"
                    placeholder="Enter Contractor Name"
                    value={formData.contractorName}
                    onChange={(e) =>
                        setFormData({ ...formData, contractorName: e.target.value })
                    }
                />
            </div>
        </div>

        <div className="col-md-12 mt-3 mb-4">
            <label className="projectform text-start d-block">Message</label>
            <input
                type="text"
                className="form-input w-100"
                placeholder="Add a personalized message..."
                value={formData.contractorMessage}
                onChange={(e) =>
                    setFormData({ ...formData, contractorMessage: e.target.value })
                }
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
);

const ManualEntryForm = ({ formData, setFormData, handleChange, handleSelectChange, handleFileChange, handleRemoveFile }) => (
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
                    value={formData.entityCode}
                    onChange={(e) => setFormData({ ...formData, entityCode: e.target.value })}
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
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
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
    <h4 className="fs-6 fw-bold mb-3" style={{ color: bluePrimary }}>
        Attachment (Certificates/Licenses)
    </h4>

    <div
        className="p-4 text-center rounded"
        style={{
        cursor: "pointer",
        border: `2px dashed ${bluePrimary}B2`,
        borderRadius: "8px",
        }}
    >
        <input
        type="file"
        id="fileUpload"
        name="attachments"
        onChange={handleFileChange}
        className="d-none"
        multiple
        />

        <label htmlFor="fileUpload" className="d-block cursor-pointer">
        <UploadCloud size={30} className="mb-2" style={{ color: bluePrimary }} />
        <p className="mb-1 fw-bold" style={{ color: bluePrimary }}>
            Click to upload or drag and drop
        </p>
        <p className="mb-0 small" style={{ color: bluePrimary }}>
            PDF, DOCX up to 10MB
        </p>
        </label>

        {formData.attachmentMetadata && formData.attachmentMetadata.length > 0 && (
    <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
        {formData.attachmentMetadata.map((file, index) => (
            <div
                key={index}
                className="d-flex align-items-center p-2 border rounded bg-light"
                style={{
                maxWidth: "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                }}
            >
                <span className="text-truncate small me-2" title={file.name}>
                {file.name}
                </span>
                <button
                type="button"
                className="ms-auto bg-transparent border-0"
                onClick={() => handleRemoveFile(file.name)}
            >
                <X color="red" size={18} />
                </button>

            </div>
            ))}
        </div>
        )}
    </div>
    </div>
</div>
    </>
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
                    Phone No 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Phone No"
                    value={formData.phoneNo}
                    onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}

                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Email ID 
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter Email ID"
                    value={formData.emailID}
                    onChange={(e) => setFormData({ ...formData, emailID: e.target.value })}

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
                    Name <span style={{ color: 'red' }}>*</span>
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

function ContractorOverview() {
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        const scrollTimer = setTimeout(() => {
            window.scrollTo(0, 0); 
        }, 0);
        return () => {
            clearTimeout(scrollTimer);
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'auto';
            }
        };
       
    }, [])
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);
const defaultFormData = {
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
    contractorMessage:'',
    attachmentMetadata: [] 
};

const loadFormData = () => {
    try {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            return { 
                ...defaultFormData, 
                ...parsedData, 
                attachments: [], 
                attachmentMetadata: parsedData.attachmentMetadata || [] 
            };
        }
    } catch (error) {
        console.error("Could not load data from sessionStorage:", error);
    }
    return defaultFormData;
};

const [formData, setFormData] = useState(loadFormData());
    useEffect(() => {
        const serializableData = { 
            ...formData, 
            attachments: [], 
            attachmentMetadata: formData.attachmentMetadata 
        }; 
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
    }, [formData]);

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
    const newMetadata = newFiles.map(file => ({
        name: file.name,
        size: file.size,
        lastModified: file.lastModified,
    }));

    setFormData(prev => ({ 
        ...prev, 
        attachments: [...prev.attachments, ...newFiles], 
        attachmentMetadata: [...prev.attachmentMetadata, ...newMetadata] 
    }));
};

    const handleRemoveFile = (fileNameToRemove) => {
    setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter(file => file.name !== fileNameToRemove),
        attachmentMetadata: prev.attachmentMetadata.filter(meta => meta.name !== fileNameToRemove) 
    }));
};
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        console.log("Form data ready for review:", formData); 
        navigate('/contractor-review', { state: { formData } });
    };

    const handleSendInvitation = (e) => {
        e.preventDefault();
        console.log("Invitation Sent:", { 
            contractorEmailId: formData.contractorEmailId, 
            contractorName: formData.contractorName, 
            message: formData.contractorMessage 
        });
    };
    
    const handleCancel = () => console.log("Form Cancelled");

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    
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
                </form>

                {selectedView === 'manual' && (
                    <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleCancel} style={{ borderRadius: "6px" }}>Cancel</button>
                        <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Review & Submit<ArrowRight size={21} color="white" className="ms-2" /></button>
                    </div>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;