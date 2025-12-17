import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, ArrowRight, Pencil, Mail, FileText, MapPin, User, Briefcase, DollarSign, Info, X, UploadCloud } from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa';
import Flatpickr from 'flatpickr';
import '../CSS/custom-flatpickr.css';
import '../CSS/Styles.css';
const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const labelTextColor = '#00000080';
const STORAGE_KEY = 'contractorFormData';


const entityTypeOptions = [
    { value: 'contractor', label: 'Contractor' },
    { value: 'Design Consultant', label: 'Design Consultant' },
    { value: 'PMC Consultant', label: 'PMC Consultant' },
];
const natureOfBusinessOptions = [
    { value: 'Contracting Services', label: 'Contracting Services' },
    { value: 'Civil Contractor', label: 'Civil Contractor' },
    { value: 'Infrastructure Contracting Services', label: 'Infrastructure Contracting Services' },
];
const gradeOptions = [
    { value: 'A Grade', label: 'A Grade' },
    { value: 'B Grade', label: 'B Grade' },
];
const addressTypeOptions = [
    { value: 'Office Address', label: 'Office Address' },
    { value: 'Present Address', label: 'Present Address' },
];
const countryOptions = [];
const addresscityOptions = [];
const contactPositionOptions = [];
const territoryTypeOptions = [
    { value: 'Country', label: 'Country' },
    { value: 'State', label: 'State' },
];
const taxTypeOptions = [
    { value: 'Regular GST', label: 'Regular GST' },
    { value: 'Composite GST', label: 'Composite GST' },
    { value: 'GST Un-Register', label: 'GST Un-Register' },
    { value: 'VAT Register', label: 'VAT Register' },
    { value: 'VAT Un-Register', label: 'VAT Un-Register' },
    { value: 'Trade License Register', label: 'Trade License Register' },
    { value: 'Trade License Un-Register', label: 'Trade License Un-Register' },
    { value: 'MSME Register', label: 'MSME Register' },
];
const territoryOptions = [];
const taxCityOptions = [];
const additionalInfoTypeOptions = [
    { value: 'PAN No', label: 'PAN No' },
    { value: 'TIN No', label: 'TIN No' },
    { value: 'CIN No', label: 'CIN No' },
];

const DetailItem = ({ label, value }) => {
    const adjustedValue = value === undefined || value === null || value === '' ? undefined : value;
    const displayValue = adjustedValue ? adjustedValue : '\u00A0';

    return (
        <div className="col-lg-4 col-md-6 col-sm-12 mb-3">
            <p className="detail-label mb-0 fw-normal fs-6" style={{ color: labelTextColor }}>
                {label}
            </p>
            <p
                className={`detail-value ${adjustedValue ? 'fw-bold' : ''}`}
                style={{
                    fontSize: '0.9rem',
                    color: adjustedValue ? '#333' : 'transparent',
                    minHeight: '1.1em',
                    marginBottom: '0.5rem'
                }}
            >
                {displayValue}
            </p>
        </div>
    );
};

const ManualEntryForm = ({ formData, setFormData, handleChange, handleSelectChange, handleFileChange, handleRemoveFile }) => {

    const fileInputRef = useRef(null);
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileChange({ target: { files: files } });
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    const openCalendar = (id) => {
        const input = document.querySelector(`#${id}`);
        if (input && input._flatpickr) {
            input._flatpickr.open();
        }
    };
    return (
        <>
            <div
                className="p-3 mb-4 d-flex align-items-center justify-content-center"
                style={{
                    backgroundColor: bluePrimary,
                    width: "calc(100% + 3rem)",
                    marginLeft: "-1.5rem",
                    marginRight: "-1.5rem",
                    borderRadius: "8px 8px 0 0"
                }}
            >
                <Briefcase size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
            </div>
            <div className="row">
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform text-start d-block">
                        Entity Code <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        type="text"
                        className="form-input w-100"
                        placeholder="Enter entity code"
                        value={formData.entityCode}
                        onChange={(e) =>
                            setFormData({ ...formData, entityCode: e.target.value })
                        }
                    />
                </div>
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform text-start d-block">
                        Entity Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                        type="text"
                        className="form-input w-100"
                        placeholder="Enter entity name"
                        value={formData.entityName}
                        onChange={(e) =>
                            setFormData({ ...formData, entityName: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform-select text-start d-block">
                        Effective Date <span style={{ color: "red" }}>*</span>
                    </label>
                    <Flatpickr
                        id="effectiveDate"
                        className="form-input w-100"
                        placeholder="Select Effective date"
                        options={{ dateFormat: "d-m-Y" }}
                        value={formData.effectiveDate}
                        onChange={([date]) => setFormData({ ...formData, effectiveDate: date })}
                        ref={datePickerRef}
                    />
                    <span className='calender-icon' onClick={() => openCalendar('effectiveDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                </div>
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform-select text-start d-block">
                        Entity Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                        name="entityType"
                        options={entityTypeOptions}
                        value={entityTypeOptions.find(
                            (opt) => opt.value === formData.entityType
                        )}
                        onChange={handleSelectChange}
                        placeholder="Select entity type"
                        classNamePrefix="select"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform-select text-start d-block">
                        Nature of Business <span style={{ color: "red" }}>*</span>
                    </label>
                    <Select
                        name="natureOfBusiness"
                        options={natureOfBusinessOptions}
                        value={natureOfBusinessOptions.find(
                            (opt) => opt.value === formData.natureOfBusiness
                        )}
                        onChange={handleSelectChange}
                        placeholder="Select nature of business"
                        classNamePrefix="select"
                    />
                </div>
                <div className="col-md-6 mt-3 mb-4">
                    <label className="projectform-select text-start d-block">
                        Grade
                    </label>
                    <Select
                        name="grade"
                        options={gradeOptions}
                        value={gradeOptions.find(
                            (opt) => opt.value === formData.grade
                        )}
                        onChange={handleSelectChange}
                        placeholder="Select grade"
                        classNamePrefix="select"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 mt-3">
                    <label className="projectform text-start d-block">
                        Attachments (Certificates/Licenses)
                    </label>
                </div>
                <div className="col-md-12 mt-3 mb-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={{
                            border: `2px dashed ${bluePrimaryLight}`,
                            borderRadius: "8px",
                            padding: "20px",
                            textAlign: "center",
                            minHeight:
                                formData.attachmentMetadata.length > 0
                                    ? "auto"
                                    : "150px"
                        }}
                    >
                        <div onClick={handleUploadClick} style={{ cursor: "pointer" }}>
                            <UploadCloud size={30} style={{ color: bluePrimaryLight }} />
                            <p className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                Click to upload or drag and drop
                            </p>
                            <p className="mb-0 small" style={{ color: bluePrimary }}>PDF, DOCX up to 10MB</p>
                        </div>
                        {formData.attachmentMetadata.length > 0 && (
                            <div className="d-flex flex-wrap justify-content-center mt-3">
                                {formData.attachmentMetadata.map((file) => (
                                    <div
                                        key={file.id}
                                        className="d-flex align-items-center mx-2 mb-2 px-3 py-2 rounded"
                                        style={{ backgroundColor: "#fff", border: "1px solid #ced4da", fontSize: "0.9rem" }}
                                    >
                                        <FileText size={16} className="me-2 text-muted" />
                                        <span className="text-dark me-2">{file.name}</span>
                                        <X
                                            size={14}
                                            className="text-danger"
                                            onClick={() => handleRemoveFile(file.id)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

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

const AddressDetailsContent = ({ formData, setFormData, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <MapPin size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter phone no"
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
        <div className="row mb-4">
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
            <User size={20} className="me-2 text-white" />
            <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Contact Name <span style={{ color: 'red' }}>*</span>
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
        <div className="row mb-4">
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Phone No <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" className="form-input w-100" placeholder="Enter phone no"
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

const TaxDetailsContent = ({ formData, setFormData, handleChange, handleSelectChange }) => (
    <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
        <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
            <Briefcase size={20} className="me-2 text-white" />
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
                    value={taxTypeOptions.find(option => option.value === formData.taxType)}
                    placeholder="Select tax type"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="territoryType" className="projectform-select text-start d-block">Territory Type <span className="text-danger">*</span></label>
                <Select
                    name="territoryType"
                    options={territoryTypeOptions}
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
                    options={territoryOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    value={territoryOptions.find(option => option.value === formData.territory)}
                    placeholder="Select territory type"
                />
            </div>
            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">
                    Tax Reg. No <span style={{ color: 'red' }}>*</span>
                </label>
                <Flatpickr
                        id="taxRegDate"
                        className="form-input w-100"
                        placeholder="Select Tax Registration date"
                        options={{ dateFormat: "d-m-Y" }}
                        value={formData.effectiveDate}
                        onChange={([date]) => setFormData({ ...formData, taxRegDate: date })}
                        ref={datePickerRef}
                    />
                    <span className='calender-icon' onClick={() => openCalendar('taxRegDate')}><FaCalendarAlt size={18} color='#005197' /></span>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6 mt-3 mb-4">
                <label htmlFor="taxRegDate" className="projectform-select text-start d-block">Tax Reg. Date <span className="text-danger">*</span></label>
                <div className="input-group">
                    <input type="text" className="form-control" id="taxRegDate" name="taxRegDate" value={formData.taxRegDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                    <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><FaCalendarAlt size={18} className="text-muted" /></span>
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
                    options={taxCityOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    value={taxCityOptions.find(option => option.value === formData.taxCity)}
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
            <DollarSign size={20} className="me-2 text-white" />
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
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}

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
                    options={additionalInfoTypeOptions}
                    onChange={handleSelectChange}
                    classNamePrefix="select"
                    value={additionalInfoTypeOptions.find(option => option.value === formData.additionalInfoType)}
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

const ReviewSummaryContent = ({ formData, handleGoBackToEntry, handleSubmitFinal }) => {
    const { entityCode, entityName, effectiveDate, entityType, natureOfBusiness, grade, attachmentMetadata = [] } = formData;
    const { phoneNo, emailID, addressType, address1, address2, country, addresscity, zipCode, } = formData;
    const { contactName, contactPosition, contactPhoneNo, contactEmailID, } = formData;
    const { taxType, territoryType, territory, taxRegNo, taxRegDate, taxAddress1, taxAddress2, taxCity, taxZipCode, taxEmailID, } = formData;
    const { accountHolderName, accountNo, bankName, branchName, bankAddress, } = formData;
    const { additionalInfoType, registrationNo, } = formData;
    const hasAttachments = attachmentMetadata && attachmentMetadata.length > 0;
    const handleViewAttachment = (fileData) => {
        const file = fileData.fileObject;

        if (file instanceof File || (typeof Blob !== 'undefined' && file instanceof Blob)) {
            const objectUrl = URL.createObjectURL(file);
            const newWindow = window.open(objectUrl, '_blank');

            if (newWindow) {
                newWindow.onload = () => {
                    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
                };
            } else {
                alert("The file view window was blocked. Please enable pop-ups for this site.");
                URL.revokeObjectURL(objectUrl);
            }
        } else {
            console.error("File object not found or not a valid File/Blob:", fileData);
            alert("Cannot view document. File data is corrupted or not accessible. (Ensure the file object was stored correctly during upload.)");
        }
    };
    return (
        <div className="px-4 text-start">
            <div className="bg-white p-4 mb-4 shadow-sm" style={{ borderRadius: "8px", border: '1px solid #e0e0e0' }}>

                <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <h4 className="fw-bold mb-1 text-dark">Review & Submit</h4>
                    <p className="text-muted mb-0">Please verify all the information below is correct before submitting...</p>
                </div>

                <div className="row mt-4">
                    <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                        <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>Basic Information</h5>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Core details of the entity</p>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12">
                        <div className="row">
                            <DetailItem label="Entity Code" value={entityCode} />
                            <DetailItem label="Entity Name" value={entityName} />
                            <DetailItem label="Effective Date" value={effectiveDate} />
                        </div>
                        <div className="row mb-4">
                            <DetailItem label="Entity Type" value={entityType} />
                            <DetailItem label="Nature of Business" value={natureOfBusiness} />
                            <DetailItem label="Grade" value={grade} />
                        </div>
                    </div>
                </div>

                <div className="attachments-section">
                    <h5 className="fw-bold mb-3"
                        style={{
                            color: labelTextColor,
                            width: "66%",
                            marginLeft: "auto"
                        }}>
                        Attachments (Certificates/Licenses)
                    </h5>

                    <div className="attachment-file-list px-3">
                        {hasAttachments ? (
                            attachmentMetadata.map((file) => (
                                <div
                                    key={file.id}
                                    className="d-flex justify-content-between align-items-center p-3 rounded mb-2"
                                    style={{
                                        border: '1px solid #00000014',
                                        width: '66%',
                                        marginLeft: "auto",
                                        background: '#00000004'
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <FileText size={20} className="me-2 text-danger" />
                                        <div>
                                            <p className="mb-0 fw-medium">{file.name}</p>
                                            <small className="text-muted">
                                                {file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'File'}
                                                {file.lastModified ? ` • Modified: ${new Date(file.lastModified).toLocaleDateString()}` : ''}
                                            </small>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-sm"
                                        style={{ color: bluePrimary }}
                                        onClick={() => handleViewAttachment(file)}
                                    >
                                        View
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-muted p-3" style={{ width: "66%", marginLeft: "auto" }}>
                                No attachments uploaded.
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="row mt-3">
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                <MapPin size={18} className="me-2" /> Address Details
                            </h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Registered company address</p>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Phone No" value={phoneNo} />
                                <DetailItem label="Email ID" value={emailID} />
                                <DetailItem label="Address Type" value={addressType} />
                            </div>
                            <div className="row">
                                <DetailItem label="Address 1" value={address1} />
                                <DetailItem label="Address 2" value={address2} />
                                <DetailItem label="" value="" />
                            </div>
                            <div className="row mb-3">
                                <DetailItem label="Country" value={country} />
                                <DetailItem label="City" value={addresscity} />
                                <DetailItem label="Zip/Postal Code" value={zipCode} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="row mt-3">
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                <User size={18} className="me-2" /> Contact Details
                            </h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Primary point of contact</p>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Name" value={contactName} />
                                <DetailItem label="Position" value={contactPosition} />
                                <DetailItem label="" value="" />
                            </div>
                            <div className="row mb-3">
                                <DetailItem label="Phone No" value={contactPhoneNo} />
                                <DetailItem label="Email ID" value={contactEmailID} />
                                <DetailItem label="" value="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="row mt-3">
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                <Briefcase size={18} className="me-2" /> Tax Details
                            </h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Tax registration information</p>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Tax Type" value={taxType} />
                                <DetailItem label="Territory Type" value={territoryType} />
                                <DetailItem label="Territory" value={territory} />
                            </div>
                            <div className="row">
                                <DetailItem label="Tax Reg No" value={taxRegNo} />
                                <DetailItem label="Tax Reg Date" value={taxRegDate} />
                                <DetailItem label="Email ID" value={taxEmailID} />
                            </div>
                            <div className="row mb-3">
                                <DetailItem label="Address 1" value={taxAddress1} />
                                <DetailItem label="Address 2" value={taxAddress2} />
                                <DetailItem label="City" value={taxCity} />
                            </div>
                            <div className="row mb-3">
                                <DetailItem label="Zip/Postal Code" value={taxZipCode} />
                                <DetailItem label="" value="" />
                                <DetailItem label="" value="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="row mt-3">
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                <DollarSign size={18} className="me-2" /> Bank Accounts
                            </h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Financial transaction details</p>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Account Holder Name" value={accountHolderName} />
                                <DetailItem label="Account No" value={accountNo} />
                                <DetailItem label="Bank Name" value={bankName} />
                            </div>
                            <div className="row mb-3">
                                <DetailItem label="Branch Name" value={branchName} />
                                <DetailItem label="Bank Address" value={bankAddress} />
                                <DetailItem label="" value="" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="row mt-3">
                        <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                            <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                <Info size={18} className="me-2" /> Additional Info
                            </h5>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Other relevant registrations</p>
                        </div>
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="row">
                                <DetailItem label="Type" value={additionalInfoType} />
                                <DetailItem label="Registration No" value={registrationNo} />
                                <DetailItem label="" value="" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="d-flex justify-content-end mt-4 pb-5">
                <button
                    type="button"
                    className="btn px-4 fw-bold"
                    onClick={handleGoBackToEntry}
                    style={{
                        borderRadius: "6px",
                        border: `1px solid ${bluePrimaryLight}`,
                        color: bluePrimaryLight,
                        backgroundColor: 'white'
                    }}
                >
                    Edit
                </button>
                <button
                    type="button"
                    onClick={handleSubmitFinal}
                    className="btn px-4 fw-bold ms-3"
                    style={{
                        backgroundColor: bluePrimary,
                        color: "white",
                        borderRadius: "6px",
                        border: 'none'
                    }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

function ContractorOverview() {
    const navigate = useNavigate();
    const location = useLocation();
    const datePickerRef = useRef();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const [viewMode, setViewMode] = useState('entry');

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

    }, [location.pathname])


    const handleViewChange = (view) => {
        setSelectedView(view);
        setViewMode('entry');
    };

    const defaultBasicInfo = {
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: '',
        natureOfBusiness: '',
        grade: '',
        attachments: [],
        attachmentMetadata: []
    };

    const defaultAddressDetails = {
        phoneNo: '',
        emailID: '',
        addressType: '',
        address1: '',
        address2: '',
        country: '',
        addresscity: '',
        zipCode: ''
    };

    const defaultContactDetails = {
        contactName: '',
        contactPosition: '',
        contactPhoneNo: '',
        contactEmailID: ''
    };

    const defaultTaxDetails = {
        taxType: '',
        territoryType: '',
        territory: '',
        taxRegNo: '',
        taxRegDate: '',
        taxAddress1: '',
        taxAddress2: '',
        taxCity: '',
        taxZipCode: '',
        taxEmailID: ''
    };

    const defaultBankAccounts = {
        accountHolderName: '',
        accountNo: '',
        bankName: '',
        branchName: '',
        bankAddress: ''
    };

    const defaultAdditionalInfo = {
        additionalInfoType: '',
        registrationNo: ''
    };

    const defaultEmailInvite = {
        contractorEmailId: '',
        contractorName: '',
        contractorMessage: ''
    };

    const defaultFormData = {
        ...defaultBasicInfo,
        ...defaultAddressDetails,
        ...defaultContactDetails,
        ...defaultTaxDetails,
        ...defaultBankAccounts,
        ...defaultAdditionalInfo,
        ...defaultEmailInvite
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
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            fileObject: file,
        }));

        setFormData(prev => ({
            ...prev,
            attachmentMetadata: [...prev.attachmentMetadata, ...newMetadata]
        }));
    };

    const handleRemoveFile = (fileIdToRemove) => {
        setFormData(prev => ({
            ...prev,
            attachmentMetadata: prev.attachmentMetadata.filter(
                (meta) => meta.id !== fileIdToRemove
            )
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data ready for review:", formData);
        setViewMode('review');
        window.scrollTo(0, 0);
    };

    const handleSubmitFinal = () => {
        console.log("FINAL SUBMISSION:", formData);
        sessionStorage.removeItem(STORAGE_KEY);
        navigate('ContractorOnboarding');
    };

    const handleGoBackToEntry = () => {
        setViewMode('entry');
        window.scrollTo(0, 0);
    };

    const handleSendInvitation = (e) => {
        e.preventDefault();
        console.log("Invitation Sent:", {
            contractorEmailId: formData.contractorEmailId,
            contractorName: formData.contractorName,
            message: formData.contractorMessage
        });
    };

    const handleCancel = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        navigate('/ContractorOnboarding');
        console.log("Form Cancelled. Data cleared and navigating to /ContractorOnboarding.");
    };

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const isEntryMode = viewMode === 'entry';
    const isReviewMode = viewMode === 'review';

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
            {isEntryMode && (
                <div className="px-4 text-start">
                    <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                        <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('manual')} style={manualButtonStyle}>
                            <Pencil size={20} className="me-2" /> Manual Entry
                        </button>
                        <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('email')} style={emailButtonStyle}>
                            <Mail size={20} className="me-2" /> Email Invite
                        </button>
                    </div>
                </div>
            )}

            {isEntryMode && (
                <div className="px-4 text-start">
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
                            <button type="button" onClick={handleCancel} className="fw-bold px-4" style={{ background: "none", border: "none", color: bluePrimary, cursor: "pointer" }}>Cancel</button>
                            <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Review & Submit<ArrowRight size={21} color="white" className="ms-2" /></button>
                        </div>
                    )}
                </div>
            )}
            {isReviewMode && (
                <ReviewSummaryContent
                    formData={formData}
                    handleGoBackToEntry={handleGoBackToEntry}
                    handleSubmitFinal={handleSubmitFinal}
                />
            )}

            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;