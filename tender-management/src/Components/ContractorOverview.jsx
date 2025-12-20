import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, ArrowRight, Pencil, Mail, FileText, MapPin, User, Briefcase, DollarSign, Info, X, UploadCloud, CreditCard, Trash2} from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import '../CSS/Styles.css';

function ContractorOverview() {
    const navigate = useNavigate();
    const location = useLocation();

    const effectiveDateRef = useRef();
    const taxRegDateRef = useRef();
    const datePickerRef = useRef(); 
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const [viewMode, setViewMode] = useState('entry');

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

const defaultFormData = {
    entityCode: '', entityName: '', effectiveDate: '', entityType: '', 
    natureOfBusiness: '', grade: '', attachments: [], attachmentMetadata: [],
    phoneNo: '', emailID: '', addressType: '', address1: '', address2: '', 
    country: '', addresscity: '', zipCode: '',
    contactName: '', contactPosition: '', contactPhoneNo: '', contactEmailID: '',
    taxType: '', territoryType: '', territory: '', taxRegNo: '', 
    taxRegDate: '', taxAddress1: '', taxAddress2: '', taxCity: '', 
    taxZipCode: '', taxEmailID: '',
    accountHolderName: '', accountNo: '', bankName: '', branchName: '', bankAddress: '',
    additionalInfoType: '', registrationNo: '',
    contractorEmailId: '', contractorName: '', contractorMessage: ''
};

    const [formData, setFormData] = useState(() => {
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
            console.error("Session storage error:", error);
        }
        return defaultFormData;
    });

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

const ManualEntryForm = ({ 
    formData, 
    setFormData, 
    handleChange, 
    handleSelectChange, 
    handleFileChange, 
    handleRemoveFile,
    effectiveDateRef, 
    taxRegDateRef,    
    
}) => {
    const fileInputRef = useRef(null);
    const datePickerRef = useRef(null);

    const handleUploadClick = () => fileInputRef.current.click();
    
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

    const openCalendar = (id) => {
        const input = document.querySelector(`#${id}`);
        if (input && input._flatpickr) {
            input._flatpickr.open();
        }
    };

    return (
        <>
            <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                    <Briefcase size={20} className="me-2 text-white" />
                    <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="entityCode" className="form-input w-100" placeholder="Enter entity code" value={formData.entityCode} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="entityName" className="form-input w-100" placeholder="Enter entity name" value={formData.entityName} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
       <div className="col-md-6 mt-3 mb-4">
    <label className="projectform-select text-start d-block">
        Effective Date <span style={{ color: "red" }}>*</span>
    </label>
    <div className="position-relative">
      <Flatpickr
    ref={effectiveDateRef}
     value={formData.effectiveDate}
    name="effectiveDate"
    className="form-input w-100"
    placeholder="Select Effective date"
    options={{
        dateFormat: "d-m-Y",
        allowInput: true
    }}
    onClose={(_, dateStr) => {
        setFormData(prev => ({
            ...prev,
            effectiveDate: dateStr
        }));
    }}
/>

        <span
            className='calendar-icon'
            style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                cursor: 'pointer' 
            }}
            onClick={() => {
                if (effectiveDateRef.current?.flatpickr) {
                    effectiveDateRef.current.flatpickr.open();
                }
            }}
        >
            <FaCalendarAlt size={18} color='#005197' />
        </span>
    </div>
</div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Entity Type <span style={{ color: "red" }}>*</span></label>
                        <Select name="entityType" options={entityTypeOptions} value={entityTypeOptions?.find(opt => opt.value === formData.entityType)} onChange={handleSelectChange} placeholder="Select entity type" classNamePrefix="select" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Nature of Business </label>
                        <Select name="natureOfBusiness" options={natureOfBusinessOptions} value={natureOfBusinessOptions?.find(opt => opt.value === formData.natureOfBusiness)} onChange={handleSelectChange} placeholder="Select nature of business" classNamePrefix="select" />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Grade</label>
                        <Select name="grade" options={gradeOptions} value={gradeOptions?.find(opt => opt.value === formData.grade)} onChange={handleSelectChange} placeholder="Select grade" classNamePrefix="select" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mt-3 mb-4">
                        <label className="projectform text-start d-block">Attachments (Certificates/Licenses)</label>
                        <input type="file" ref={fileInputRef} multiple onChange={handleFileChange} style={{ display: "none" }} />
                        <div onDragOver={handleDragOver} onDrop={handleDrop} style={{ border: `2px dashed ${bluePrimaryLight}`, borderRadius: "8px", padding: "20px", textAlign: "center" }}>
                            <div onClick={handleUploadClick} style={{ cursor: "pointer" }}>
                                <UploadCloud size={30} style={{ color: bluePrimaryLight }} />
                                <p className="mb-0 fw-bold" style={{ color: bluePrimary }}>Click to upload or drag and drop</p>
                                <p className="mb-0 small" style={{ color: bluePrimary }}>PDF, DOCX up to 10MB</p>
                            </div>
                            <div className="d-flex flex-wrap justify-content-center mt-3">
                                {formData.attachmentMetadata.map((file) => (
                                    <div key={file.id} className="d-flex align-items-center mx-2 mb-2 px-3 py-2 rounded border bg-white shadow-sm">
                                        <FileText size={16} className="me-2 text-muted" />
                                        <span className="text-dark me-2">{file.name}</span>
                                        <X size={14} className="text-danger" onClick={() => handleRemoveFile(file.id)} style={{ cursor: "pointer" }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                    <MapPin size={20} className="me-2 text-white" />
                    <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Phone No</label>
                        <input type="text" name="phoneNo" className="form-input w-100" placeholder="Enter phone no" value={formData.phoneNo} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Email ID</label>
                        <input type="text" name="emailID" className="form-input w-100" placeholder="Enter email ID" value={formData.emailID} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Address Type <span className="text-danger">*</span></label>
                        <Select name="addressType" options={addressTypeOptions} onChange={handleSelectChange} classNamePrefix="select" value={addressTypeOptions?.find(opt => opt.value === formData.addressType)} placeholder="Select address type" />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Address 1</label>
                        <input type="text" name="address1" className="form-input w-100" placeholder="Enter address 1" value={formData.address1} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Address 2</label>
                        <input type="text" name="address2" className="form-input w-100" placeholder="Enter address 2" value={formData.address2} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Country <span className="text-danger">*</span></label>
                        <Select name="country" options={countryOptions} onChange={handleSelectChange} classNamePrefix="select" value={countryOptions?.find(opt => opt.value === formData.country)} placeholder="Select country" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                        <Select name="addresscity" options={addresscityOptions} onChange={handleSelectChange} classNamePrefix="select" value={addresscityOptions?.find(opt => opt.value === formData.addresscity)} placeholder="Select city" />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Zip/Postal Code <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="zipCode" className="form-input w-100" placeholder="Enter Zip/Postal Code" value={formData.zipCode} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                    <User size={20} className="me-2 text-white" />
                    <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block"> Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="contactName" className="form-input w-100" placeholder="Enter contact name" value={formData.contactName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block"> Position <span className="text-danger">*</span></label>
                        <Select name="contactPosition" options={contactPositionOptions} onChange={handleSelectChange} classNamePrefix="select" value={contactPositionOptions?.find(opt => opt.value === formData.contactPosition)} placeholder="Select position" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Phone No </label>
                        <input type="text" name="contactPhoneNo" className="form-input w-100" placeholder="Enter phone no" value={formData.contactPhoneNo} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block"> Email ID </label>
                        <input type="text" name="contactEmailID" className="form-input w-100" placeholder="Enter email ID" value={formData.contactEmailID} onChange={handleChange} />
                    </div>
                </div>
            </div>

           <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
    <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
        <FileText size={20} className="me-2 text-white" />
        <h3 className="mb-0 fs-6 fw-bold text-white">Tax Details</h3>
    </div>

    <div className="row">
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform-select text-start d-block">Tax Type <span className="text-danger">*</span></label>
            <Select 
                name="taxType" 
                options={taxTypeOptions} 
                onChange={handleSelectChange} 
                classNamePrefix="select" 
                value={taxTypeOptions?.find(opt => opt.value === formData.taxType)} 
                placeholder="Select tax type" 
            />
        </div>
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform-select text-start d-block">Territory Type <span style={{ color: "red" }}>*</span></label>
            <Select 
                name="territoryType" 
                options={territoryTypeOptions} 
                onChange={handleSelectChange} 
                classNamePrefix="select" 
                value={territoryTypeOptions?.find(opt => opt.value === formData.territoryType)} 
                placeholder="Select territory type" 
            />
        </div>
    </div>

    <div className="row">
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform-select text-start d-block">Territory <span style={{ color: "red" }}>*</span></label>
            <Select 
                name="territory" 
                options={territoryOptions} 
                onChange={handleSelectChange} 
                classNamePrefix="select" 
                value={territoryOptions?.find(opt => opt.value === formData.territory)} 
                placeholder="Select territory" 
            />
        </div>
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform text-start d-block">Tax Reg No <span style={{ color: 'red' }}>*</span></label>
            <input 
                type="text" 
                name="taxRegNo" 
                className="form-input w-100" 
                placeholder="Enter tax registration no" 
                value={formData.taxRegNo} 
                onChange={handleChange} 
            />
        </div>
    </div>

    <div className="row">
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform-select text-start d-block">Tax Reg Date <span style={{ color: "red" }}>*</span></label>
            <div className="position-relative">
               <Flatpickr
    ref={taxRegDateRef}
    name="taxRegDate"
    value={formData.taxRegDate}
    className="form-input w-100"
    placeholder="Select Tax Reg date"
    options={{
        dateFormat: "d-m-Y",
        allowInput: true
    }}
    onClose={(_, dateStr) => {
        setFormData(prev => ({
            ...prev,
            taxRegDate: dateStr
        }));
    }}
/>

                <span 
                    className='calendar-icon' 
                    style={{ 
                        position: 'absolute', 
                        right: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        cursor: 'pointer' 
                    }} 
                    onClick={() => {
                        if (taxRegDateRef.current?.flatpickr) {
                            taxRegDateRef.current.flatpickr.open();
                        }
                    }}
                >
                    <FaCalendarAlt size={18} color='#005197' />
                </span>
            </div>
        </div>
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform text-start d-block">Address 1</label>
            <input 
                type="text" 
                name="taxAddress1" 
                className="form-input w-100" 
                placeholder="Enter address 1" 
                value={formData.taxAddress1} 
                onChange={handleChange} 
            />
        </div>
    </div>

    <div className="row">
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform text-start d-block">Address 2</label>
            <input 
                type="text" 
                name="taxAddress2" 
                className="form-input w-100" 
                placeholder="Enter address 2" 
                value={formData.taxAddress2} 
                onChange={handleChange} 
            />
        </div>
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform-select text-start d-block">City <span style={{ color: "red" }}>*</span></label>
            <Select 
                name="taxCity" 
                options={taxCityOptions} 
                onChange={handleSelectChange} 
                classNamePrefix="select" 
                value={taxCityOptions?.find(opt => opt.value === formData.taxCity)} 
                placeholder="Select city" 
            />
        </div>
    </div>

    <div className="row">
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform text-start d-block">Zip/Postal Code</label>
            <input 
                type="text" 
                name="taxZipCode" 
                className="form-input w-100" 
                placeholder="Enter Zip/Postal Code" 
                value={formData.taxZipCode} 
                onChange={handleChange} 
            />
        </div>
        <div className="col-md-6 mt-3 mb-4">
            <label className="projectform text-start d-block">Email ID</label>
            <input 
                type="text" 
                name="taxEmailID" 
                className="form-input w-100" 
                placeholder="Enter email ID" 
                value={formData.taxEmailID} 
                onChange={handleChange} 
            />
        </div>
    </div>
            </div>

            <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                    <CreditCard size={20} className="me-2 text-white" />
                    <h3 className="mb-0 fs-6 fw-bold text-white">Bank Accounts</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Account Holder Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="accountHolderName" className="form-input w-100" placeholder="Enter account holder name" value={formData.accountHolderName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Account No <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="accountNo" className="form-input w-100" placeholder="Enter account no" value={formData.accountNo} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Bank Name <span style={{ color: 'red' }}>*</span></label>
                        <input type="text" name="bankName" className="form-input w-100" placeholder="Enter bank name" value={formData.bankName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Branch Name <span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="branchName" className="form-input w-100" placeholder="Enter branch name" value={formData.branchName} onChange={handleChange} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mt-3 mb-4">
                        <label className="projectform text-start d-block">Bank Address</label>
                        <input type="text" name="bankAddress" className="form-input w-100" placeholder="Enter bank address" value={formData.bankAddress} onChange={handleChange} />
                    </div>
                </div>
            </div>

            <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{ backgroundColor: bluePrimary, width: "calc(100% + 3rem)", marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0" }}>
                    <Info size={20} className="me-2 text-white" />
                    <h3 className="mb-0 fs-6 fw-bold text-white">Additional Info</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Type <span style={{ color: "red" }}>*</span></label>
                        <Select name="additionalInfoType" options={additionalInfoTypeOptions} onChange={handleSelectChange} classNamePrefix="select" value={additionalInfoTypeOptions?.find(opt => opt.value === formData.additionalInfoType)} placeholder="Select type" />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Registration No <span style={{ color: "red" }}>*</span></label>
                        <input type="text" name="registrationNo" className="form-input w-100" placeholder="Enter registration no" value={formData.registrationNo} onChange={handleChange} />
                    </div>
                </div>
            </div>
        </>
    );
};

const EmailInviteForm = ({ formData, handleChange, handleSendInvitation }) => (
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
    name="contractorEmailId" 
    className="form-input w-100"
    placeholder="Enter Contractor Email ID"
    value={formData.contractorEmailId}
    onChange={handleChange} 
/>
            </div>

            <div className="col-md-6 mt-3 mb-4">
                <label className="projectform text-start d-block">Contractor Name</label>
                <input
    type="text"
    name="contractorName"
    className="form-input w-100"
    placeholder="Enter Contractor Name"
    value={formData.contractorName}
    onChange={handleChange}
/>
            </div>
        </div>

        <div className="col-md-12 mt-3 mb-4">
            <label className="projectform text-start d-block">Message</label>
            <input
    type="text"
    name="contractorMessage"
    className="form-input w-100"
    placeholder="Add a personalized message..."
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

    useEffect(() => {
        const serializableData = {
            ...formData,
            attachments: [], 
            attachmentMetadata: formData.attachmentMetadata
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
    }, [formData]);

    useEffect(() => {
    window.scrollTo(0, 0);
}, [viewMode]);


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

    const handleSubmit = (e) => {
        e.preventDefault();
        setViewMode('review');
    };

    const isManualActive = selectedView === 'manual';
    const isEntryMode = viewMode === 'entry';
    const isReviewMode = viewMode === 'review';

    return (
        <div className="container-fluid mt-3  min-vh-100 p-4">
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            {isEntryMode && (
                <div className="px-4 text-start">
                    <div className="d-inline-flex mb-4" style={{ borderRadius: '6px', overflow: 'hidden', border: `1px solid ${bluePrimary}` }}>
                        <button 
                            className="btn fw-bold" 
                            onClick={() => setSelectedView('manual')} 
                            style={{ backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, border: 'none', borderRadius: 0 }}
                        >
                            <Pencil size={18} className="me-2" /> Manual Entry
                        </button>
                        <button 
                            className="btn fw-bold" 
                            onClick={() => setSelectedView('email')} 
                            style={{ backgroundColor: !isManualActive ? bluePrimary : 'white', color: !isManualActive ? 'white' : bluePrimary, border: 'none', borderRadius: 0 }}
                        >
                            <Mail size={18} className="me-2" /> Email Invite
                        </button>
                    </div>

                    <form id="contractorForm" onSubmit={handleSubmit}>
                        <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px" }}>
                            {isManualActive ? (
                                <ManualEntryForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    handleChange={handleChange}
                                    handleSelectChange={handleSelectChange}
                                    handleFileChange={handleFileChange}
                                    effectiveDateRef={effectiveDateRef}
                                    taxRegDateRef={taxRegDateRef}
                                    handleRemoveFile={(id) => setFormData(prev => ({
                                        ...prev, attachmentMetadata: prev.attachmentMetadata.filter(m => m.id !== id)
                                    }))}
                                    datePickerRef={datePickerRef} 
                                />
                            ) : (
                                <EmailInviteForm
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                            )}
                        </div>
                    </form>

                    {isManualActive && (
                        <div className="d-flex justify-content-end mt-4 mb-5">
                            <button type="button" onClick={() => navigate('/ContractorOnboarding')} className="btn px-4 fw-bold me-3" style={{ color: bluePrimary }}>Cancel</button>
                            <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white" }}>
                                Review & Submit <ArrowRight size={20} className="ms-2" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {isReviewMode && (
                <ReviewSummaryContent
                    formData={formData}
                    handleGoBackToEntry={() => setViewMode('entry')}
                    handleSubmitFinal={() => {
                        sessionStorage.removeItem(STORAGE_KEY);
                        navigate('/ContractorOnboarding');
                    }}
                />
            )}
        </div>
    );
}

export default ContractorOverview; 