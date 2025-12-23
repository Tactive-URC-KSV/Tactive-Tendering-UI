import React, { useState } from 'react';
import { Building2, MapPin, Mail, Landmark, Users,UploadCloud, FileText, X,  Handshake,  Info, Languages, Calendar} from 'lucide-react';
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

function CompanyDetails() {
    const bluePrimary = "#005197";
    const fieldBorderColor = '#005197CC';
      const CalendarIcon = (props) => (
    <Calendar {...props} size={18} stroke="#005197" />
  );

const typeOptions = [
        { value: 'Group', label: 'Group' },
        { value: 'Company', label: 'Company' }
];
const levelNoOptions = [
    { value: 'First Level', label: 'First Level' },
    { value: 'Second Level', label: 'Second Level' },
    { value: 'Third Level', label: 'Third Level' },
    { value: 'Fourth Level', label: 'Fourth Level' },
    { value: 'Fifth Level', label: 'Fifth Level' }
];
const companyNatureOptions = [
    { value: 'Operational', label: 'Operational'},
    { value: 'Non-Operational', label: 'Non-Operational'},
]
const natureOfBusinessOptions = [
    { value: 'Software', label: 'Software'},
    { value: 'Construction', label: 'Construction'},
    { value: 'Textile', label: 'Textile'}
]
const constitutionOptions = [
    { value: 'Joint Venture', label: 'Joint Venture'},
    { value: 'Partnership', label: 'Partnership'},
    { value: 'Public Limited', label: 'Public Limited'}, 
    { value: 'Private Limited', label: 'Private Limited'},
    { value: 'Individual', label: 'Individual'}
]
const companyStatusOptions = [
    { value: 'Active', label: 'Active'},
    { value: 'Closed', label: 'Closed'},
    { value: 'Suspended Operations', label: 'Suspended Operations'}, 
    { value: 'Resume', label: 'Resume'}
]
const addressTypeOptions = [
    { value: 'Present', label: 'Present'},
    { value: 'Residence', label: 'Residence'},
    { value: 'Permanent ', label: 'Permanent'}, 
    { value: 'Office', label: 'Office'},
    { value: 'Contact', label: 'Contact'},
    { value: 'Reference ', label: 'Reference'}, 
    { value: 'Dispatch Address', label: 'Dispatch Address'}
]
const territoryTypeOptions = [
    { value: 'Country', label: 'Country'},
    { value: 'State', label: 'State'},
]
const taxTypeOptions = [
    { value: 'License Register', label: 'License Register'},
    { value: 'GST UnRegister', label: 'GST UnRegister'},
    { value: 'Input Service Distributor', label: 'Input Service Distributor'}
]
const directorTypeOptions = [
        { value: 'Part Time', label: 'Part Time' },
        { value: 'Full Time', label: 'Full Time' }
];
const additionalInfoTypeOptions = [
    { value: 'PAN No', label: 'PAN No'},
    { value: 'TIN No', label: 'TIN No'},
    { value: 'CIN No', label: 'CIN No'}
]
     
const monthOptions = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
];

const languageOptions = [
    { value: 'English', label: 'English' },
    { value: 'Arabic', label: 'Arabic' },
    { value: 'French', label: 'French' }
];

const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'AED', label: 'AED - UAE Dirham' }
];
const [attachments, setAttachments] = useState([]);

const handleFiles = (e) => {
  const files = Array.from(e.target.files);
  setAttachments(prev => [...prev, ...files]);
};

const removeFile = (index) => {
  setAttachments(prev => prev.filter((_, i) => i !== index));
};

const [basicInfo, setBasicInfo] = useState({ parentCompany: '',companyName: '', shortName: '', finStartMonth: '', defaultLanguage: '',defaultCurrency: '',bank: ''});
const [addressDetails, setAddressDetails] = useState({ address1: '', address2: '', country: '', city: '', zipCode: '', phoneNo: '', faxNo: '', email: '', website: ''});
const [contactDetails, setContactDetails] = useState({ position: '', name: '', phoneNo: '', email: ''});
const [taxDetails, setTaxDetails] = useState({ effectiveFrom: '', effectiveTo: '', territory: '', taxRegNo: '',taxRegDate: '', address1: '',address2: '', city: '', pinCode: '', email: '',isPrimary: false});
const [directorDetails, setDirectorDetails] = useState({ directorName: '', sharePercentage: '', noOfShares: ''});
const [jointVenture, setJointVenture] = useState({ partnerName: '', sharePercentage: ''});
const [companyProfile, setCompanyProfile] = useState({orderNo: '', attachment: null, description: '', remarks: ''});
const [additionalInfo, setAdditionalInfo] = useState({registrationNo: ''});
const [localName, setLocalName] = useState({ language: '', name: ''});
const handleInputChange = (setter) => (e) => {
    const { name, value, type, checked } = e.target;

    setter(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
};
const handleSelectChange = (setter, field) => (selectedOption) => {
    setter(prev => ({
        ...prev,
        [field]: selectedOption ? selectedOption.value : ''
    }));
};
const handleDateChange = (setter, field) => (date) => {
    setter(prev => ({
        ...prev,
        [field]: date[0] || ''
    }));
};

  const selectStyles = {
  control: (base) => ({
    ...base,
    height: '55px',
    borderRadius: '10px',
    border: `1px solid ${fieldBorderColor}`,
    boxShadow: 'none',
    '&:hover': {
      border: `1px solid ${fieldBorderColor}`
    }
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 15px'
  }),
  placeholder: (base) => ({
    ...base,
    color: '#6c757d'
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999
  })
};

    const labelStyle = {
        position: 'absolute',
        backgroundColor: 'white',
        padding: '0 8px',
        top: '-10px',
        left: '20px',
        zIndex: 2,
        fontSize: '13px',
        color: bluePrimary,
        fontWeight: '600'
    };

    return (
        <div className="container-fluid min-vh-100 bg-light p-4">
            <div className="d-flex align-items-center mb-4 ps-2">
                <h2 className="mb-0 fs-5 fw-bold" style={{ color: bluePrimary }}>Company Details</h2>
            </div>

            <div className="row">
                <div className="col-12">
<div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
    <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
        <Building2 size={20} className="me-2" /> 
        <strong>Basic Information</strong>
    </div>

    <div className="card-body p-5 bg-white">
        <div className="row mt-2">
            <div className="col-md-6 mb-4 position-relative">
                <label style={labelStyle}>Type <span style={{ color: "red" }}>*</span></label>
                <Select
                    styles={selectStyles}
                    className="w-100"
                            classNamePrefix="select"
                    placeholder="Select Type"
                    value={basicInfo.type ? { label: basicInfo.type, value: basicInfo.type } : null}
                    onChange={handleSelectChange(setBasicInfo, 'type')}
                    options={typeOptions} 
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    components={{ IndicatorSeparator: () => null }}
                />
            </div>

            <div className="col-md-6 mb-4 position-relative">
                <label style={labelStyle}>Level No <span style={{ color: "red" }}>*</span></label>
                <Select
                    styles={selectStyles}
                    className="w-100"
                            classNamePrefix="select"
                    placeholder="Select Level No"
                    value={basicInfo.levelNo ? { label: basicInfo.levelNo, value: basicInfo.levelNo } : null}
                    onChange={handleSelectChange(setBasicInfo, 'levelNo')}
                    options={levelNoOptions}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    components={{ IndicatorSeparator: () => null }}
                />
            </div>

            <div className="col-md-6 mb-4 position-relative">
                <label style={labelStyle}>Parent Company</label>
                <Select
                    styles={selectStyles}
                    className="w-100"
                            classNamePrefix="select"
                    placeholder="Select Parent Company"
                    value={basicInfo.parentCompany ? { label: basicInfo.parentCompany, value: basicInfo.parentCompany } : null}
                    onChange={handleSelectChange(setBasicInfo, 'parentCompany')}
                    options={[]}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    components={{ IndicatorSeparator: () => null }}
                />
            </div>

            <div className="col-md-6 mb-4 position-relative">
                <label style={labelStyle}>Company Name <span style={{ color: "red" }}>*</span></label>
                <input
                className="form-input w-100"
                    type="text"
                    name="companyName"
                    value={basicInfo.companyName}
                    onChange={handleInputChange(setBasicInfo)}
                    
                    style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                    placeholder="Enter Company Name"
                />
            </div>

            <div className="col-md-6 mb-4 position-relative">
                <label style={labelStyle}>Short Name <span style={{ color: "red" }}>*</span></label>
                <input
                    type="text"
                    name="shortName"
                    value={basicInfo.shortName}
                    onChange={handleInputChange(setBasicInfo)}
                    className="form-input w-100"
                    style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                    placeholder="Enter Short Name"
                />
            </div>

            <div className="col-md-6 mb-4 position-relative">
                <label style={labelStyle}>Company Nature <span style={{ color: "red" }}>*</span></label>
                <Select
                    styles={selectStyles}
                    className="w-100"
                            classNamePrefix="select"
                    placeholder="Select Company Nature"
                    value={basicInfo.companyNature ? { label: basicInfo.companyNature, value: basicInfo.companyNature } : null}
                    onChange={handleSelectChange(setBasicInfo, 'companyNature')}
                    options={companyNatureOptions}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    components={{ IndicatorSeparator: () => null }}
                />
            </div>

            {basicInfo.type === 'Company' && (
                <>
                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Nature of Business</label>
                        <Select
                            styles={selectStyles}
                            className="w-100"
                            classNamePrefix="select"
                            placeholder="Select Nature of Business"
                            value={basicInfo.natureOfBusiness ? { label: basicInfo.natureOfBusiness, value: basicInfo.natureOfBusiness } : null}
                            onChange={handleSelectChange(setBasicInfo, 'natureOfBusiness')}
                            options={natureOfBusinessOptions}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            components={{ IndicatorSeparator: () => null }}
                        />
                    </div>

                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Constitution</label>
                        <Select
                            styles={selectStyles}
                            className="w-100"
                            classNamePrefix="select"
                            placeholder="Select Constitution"
                            value={basicInfo.constitution ? { label: basicInfo.constitution, value: basicInfo.constitution } : null}
                            onChange={handleSelectChange(setBasicInfo, 'constitution')}
                            options={constitutionOptions}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            components={{ IndicatorSeparator: () => null }}
                        />
                    </div>

                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Company Status <span style={{ color: "red" }}>*</span></label>
                        <Select
                            styles={selectStyles}
                            className="w-100"
                            classNamePrefix="select"
                            placeholder="Select Company Status"
                            value={basicInfo.companyStatus ? { label: basicInfo.companyStatus, value: basicInfo.companyStatus } : null}
                            onChange={handleSelectChange(setBasicInfo, 'companyStatus')}
                            options={companyStatusOptions}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            components={{ IndicatorSeparator: () => null }}
                        />
                    </div>

                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Fin. Start Month <span style={{ color: "red" }}>*</span></label>
                        <Select
                            styles={selectStyles}
                            className="w-100"
                            classNamePrefix="select"
                            placeholder="Select Fin. Start Month"
                            value={basicInfo.finStartMonth ? { label: basicInfo.finStartMonth, value: basicInfo.finStartMonth } : null}
                            onChange={handleSelectChange(setBasicInfo, 'finStartMonth')}
                            options={monthOptions} 
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            components={{ IndicatorSeparator: () => null }}
                        />
                    </div>

                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Default Language <span style={{ color: "red" }}>*</span></label>
                        <Select
                            styles={selectStyles}
                            className="w-100"
                            classNamePrefix="select"
                            placeholder="Select Default Language"
                            value={basicInfo.defaultLanguage ? { label: basicInfo.defaultLanguage, value: basicInfo.defaultLanguage } : null}
                            onChange={handleSelectChange(setBasicInfo, 'defaultLanguage')}
                            options={languageOptions}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            components={{ IndicatorSeparator: () => null }}
                        />
                    </div>

                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Default Currency <span style={{ color: "red" }}>*</span></label>
                        <Select
                            styles={selectStyles}
                            className="w-100"
                            classNamePrefix="select"
                            placeholder="Select Default Currency"
                            value={basicInfo.defaultCurrency ? { label: basicInfo.defaultCurrency, value: basicInfo.defaultCurrency } : null}
                            onChange={handleSelectChange(setBasicInfo, 'defaultCurrency')}
                            options={currencyOptions}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            components={{ IndicatorSeparator: () => null }}
                        />
                    </div>

                    <div className="col-md-6 mb-4 position-relative">
                        <label style={labelStyle}>Bank</label>
                        <input
                    type="text"
                    name="bank"
                    value={basicInfo.bank}
                    onChange={handleInputChange(setBasicInfo, 'bank')}
                    className="form-input w-100"
                    style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                    placeholder="Enter Bank Name"
                />
                    </div>
                </>
            )}
        </div>
    </div>
</div>

{basicInfo.type === 'Company' && (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
        <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
            <MapPin size={20} className="me-2" /> 
            <strong>Address Details</strong>
        </div>

        <div className="card-body p-5 bg-white">
            <div className="row mt-2">

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Address Type <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select Address Type"
                        value={addressDetails.addressType ? { label: addressDetails.addressType, value: addressDetails.addressType } : null}
                        onChange={handleSelectChange(setAddressDetails, 'addressType')}
                        options={addressTypeOptions} // Using your existing options
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Address 1 </label>
                    <input
                        type="text"
                        name="address1"
                        value={addressDetails.address1}
                        onChange={handleInputChange(setAddressDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px' ,  border: '1px solid #005197CC', boxShadow: 'none'}}
                        placeholder="Enter Address 1"
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Address 2</label>
                    <input
                        type="text"
                        name="address2"
                        value={addressDetails.address2}
                        onChange={handleInputChange(setAddressDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        placeholder="Enter Address 2"
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Country <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select Country"
                        value={addressDetails.country ? { label: addressDetails.country, value: addressDetails.country } : null}
                        onChange={handleSelectChange(setAddressDetails, 'country')}
                        options={[]}
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>City <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select City"
                        value={addressDetails.city ? { label: addressDetails.city, value: addressDetails.city } : null}
                        onChange={handleSelectChange(setAddressDetails, 'city')}
                        options={[]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Zip Code </label>
                    <input
                        type="text"
                        name="zipCode"
                        value={addressDetails.zipCode}
                        onChange={handleInputChange(setAddressDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px',  border: '1px solid #005197CC', boxShadow: 'none' }}
                        placeholder="Enter Zip Code"
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Phone No </label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="phoneNo"
                            value={addressDetails.phoneNo}
                            onChange={handleInputChange(setAddressDetails)}
                            className="form-input w-100"
                            style={{ height: '55px', borderRadius: '10px 0 0 10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                            placeholder="Enter Phone No"
                        />
                        
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Fax No</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="faxNo"
                            value={addressDetails.faxNo}
                            onChange={handleInputChange(setAddressDetails)}
                            className="form-input w-100"
                            style={{ height: '55px', borderRadius: '10px 0 0 10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                            placeholder="Enter Fax No"
                        />
                       
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Email ID </label>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            value={addressDetails.email}
                            onChange={handleInputChange(setAddressDetails)}
                            className="form-input w-100"
                            style={{ height: '55px', borderRadius: '10px 0 0 10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                            placeholder="Enter Email ID"
                        />
                        
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Website</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="website"
                            value={addressDetails.website}
                            onChange={handleInputChange(setAddressDetails)}
                            className="form-input w-100"
                            style={{ height: '55px', borderRadius: '10px 0 0 10px' , border: '1px solid #005197CC', boxShadow: 'none'}}
                            placeholder="Enter Website"
                        />
                        
                    </div>
                </div>

            </div>
        </div>
    </div>
)}

{basicInfo.type === 'Company' && (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
        <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
            <Mail size={20} className="me-2" /> 
            <strong>Contact Details</strong>
        </div>

        <div className="card-body p-5 bg-white">
            <div className="row mt-2">

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Position <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select Position"
                        value={contactDetails.position ? { label: contactDetails.position, value: contactDetails.position } : null}
                        onChange={handleSelectChange(setContactDetails, 'position')}
                        options={[]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Name <span style={{ color: "red" }}>*</span></label>
                    <input
                        type="text"
                        name="name"
                        value={contactDetails.name}
                        onChange={handleInputChange(setContactDetails)}
                        className="form-input w-100"
                        style={{ 
                            height: '55px', 
                            borderRadius: '10px', 
                            border: '1px solid #005197CC',
                            boxShadow: 'none' 
                        }}
                        placeholder="Enter Name"
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Phone No</label>
                    <div className="input-group">
                        <input
                            type="text"
                            name="phoneNo"
                            value={contactDetails.phoneNo}
                            onChange={handleInputChange(setContactDetails)}
                            className="form-input w-100"
                            style={{ 
                                height: '55px', 
                                borderRadius: '10px 0 0 10px', 
                                border: '1px solid #005197CC',
                                boxShadow: 'none' 
                            }}
                            placeholder="Enter Phone No"
                        />
                        
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Email ID</label>
                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            value={contactDetails.email}
                            onChange={handleInputChange(setContactDetails)}
                            className="form-input w-100"
                            style={{ 
                                height: '55px', 
                                borderRadius: '10px 0 0 10px', 
                                border: '1px solid #005197CC',
                                boxShadow: 'none' 
                            }}
                            placeholder="Enter Email ID"
                        />
                        
                    </div>
                </div>

            </div>
        </div>
    </div>
)}

{basicInfo.type === 'Company' && (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
        <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
            <Landmark size={20} className="me-2" /> 
            <strong>Tax Details</strong>
        </div>

        <div className="card-body p-5 bg-white">
            <div className="row mt-2">

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Effective From <span style={{ color: "red" }}>*</span></label>
                    <div className="position-relative">
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select Date"
                            value={taxDetails.effectiveFrom}
                            onChange={date => setTaxDetails(prev => ({ ...prev, effectiveFrom: date[0] }))}
                            options={{ dateFormat: "d-M-Y" }}
                            style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        />
                         <CalendarIcon
    className="position-absolute end-0 top-50 translate-middle-y me-3"
    style={{ pointerEvents: "none" }}
  />
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Effective To</label>
                    <div className="position-relative">
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select Date"
                            value={taxDetails.effectiveTo}
                            onChange={date => setTaxDetails(prev => ({ ...prev, effectiveTo: date[0] }))}
                            options={{ dateFormat: "d-M-Y" }}
                            style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        />
                         <CalendarIcon
    className="position-absolute end-0 top-50 translate-middle-y me-3"
    style={{ pointerEvents: "none" }}
  />
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Territory Type <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select Type"
                        value={taxDetails.territoryType ? { label: taxDetails.territoryType, value: taxDetails.territoryType } : null}
                        onChange={handleSelectChange(setTaxDetails, 'territoryType')}
                        options={[
                            { value: 'Country', label: 'Country' },
                            { value: 'State', label: 'State' }
                        ]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Territory <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select Territory"
                        value={taxDetails.territory ? { label: taxDetails.territory, value: taxDetails.territory } : null}
                        onChange={handleSelectChange(setTaxDetails, 'territory')}
                        options={[]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Tax Type <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select Tax Type"
                        value={taxDetails.taxType ? { label: taxDetails.taxType, value: taxDetails.taxType } : null}
                        onChange={handleSelectChange(setTaxDetails, 'taxType')}
                        options={[
                            { value: 'Register', label: 'Register' },
                            { value: 'GST UnRegister', label: 'GST UnRegister' },
                            { value: 'Input Service Distributor', label: 'Input Service Distributor' }
                        ]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Tax Reg. No <span style={{ color: "red" }}>*</span></label>
                    <input
                        type="text"
                        name="taxRegNo"
                        value={taxDetails.taxRegNo}
                        onChange={handleInputChange(setTaxDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        placeholder="Enter Reg. No"
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Tax Reg. Date <span style={{ color: "red" }}>*</span></label>
                    <div className="position-relative">
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select Date"
                            value={taxDetails.taxRegDate}
                            onChange={date => setTaxDetails(prev => ({ ...prev, taxRegDate: date[0] }))}
                            options={{ dateFormat: "d-M-Y" }}
                            style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        />
                         <CalendarIcon
    className="position-absolute end-0 top-50 translate-middle-y me-3"
    style={{ pointerEvents: "none" }}
  />
                    </div>
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>City <span style={{ color: "red" }}>*</span></label>
                    <Select
                        styles={selectStyles}
                        className="w-100"
                            classNamePrefix="select"
                        placeholder="Select City"
                        value={taxDetails.city ? { label: taxDetails.city, value: taxDetails.city } : null}
                        onChange={handleSelectChange(setTaxDetails, 'city')}
                        options={[]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Address 1</label>
                   
                     <input
                        type="text"
                        name="address1"
                        value={taxDetails.address1}
                        onChange={handleInputChange(setTaxDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        placeholder="Enter Address 1"
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Address 2</label>
                     <input
                        type="text"
                        name="address2"
                        value={taxDetails.address1}
                        onChange={handleInputChange(setTaxDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }}
                        placeholder="Enter Address 2"
                    />
                </div>

                <div className="col-md-12 mb-4">
    <div className="form-check form-switch custom-switch d-flex justify-content-end align-items-center w-100">
        <label className="form-check-label me-3 fw-bold" style={{ color: bluePrimary }}>
            Is Primary <span style={{ color: "red" }}>*</span>
        </label>
        <input
            className="form-check-input"
            type="checkbox"
            checked={taxDetails.isPrimary}
            onChange={e => setTaxDetails(prev => ({ ...prev, isPrimary: e.target.checked }))}
            style={{ 
                cursor: 'pointer', 
                width: '45px', 
                height: '22px', 
                margin: 0 
            }}
        />
    </div>
</div>
            </div>
        </div>
    </div>
)}

{basicInfo.type === 'Company' && (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
        <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
            <Users size={20} className="me-2" /> 
            <strong>Director Details</strong>
        </div>

        <div className="card-body p-5 bg-white">
            <div className="row mt-2">

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Director Type <span style={{ color: "red" }}>*</span></label>
                    <Select 
                        styles={selectStyles} 
                        className="w-100"
                            classNamePrefix="select"

                        placeholder="Select Director Type" 
                        value={directorDetails.directorType ? { label: directorDetails.directorType, value: directorDetails.directorType } : null}
                        onChange={handleSelectChange(setDirectorDetails, 'directorType')}
                        options={[
                            { value: 'Part time', label: 'Part time' },
                            { value: 'Full time', label: 'Full time' }
                        ]} 
                        menuPortalTarget={document.body}
                        menuPosition="fixed"
                        components={{ IndicatorSeparator: () => null }}
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Director Name <span style={{ color: "red" }}>*</span></label>
                    
                            <input 
            type="text" 
            name="directorName"
            className="form-input w-100" 
            style={{ 
              height: '55px', 
              borderRadius: '10px', 
              border: '1px solid #005197CC',
              boxShadow: 'none' 
            }} 
            placeholder="Enter Director Name" 
            value={localName.directorName}
            onChange={handleInputChange(setDirectorDetails, 'directorName')}
          />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Share %</label>
                    <input 
                        type="number"
                        name="sharePercentage"
                        value={directorDetails.sharePercentage}
                        onChange={handleInputChange(setDirectorDetails)}
                        className="form-input w-100" 
                        style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }} 
                        placeholder="0.00" 
                    />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>No of Shares</label>
                    <input 
                        type="number"
                        name="noOfShares"
                        value={directorDetails.noOfShares}
                        onChange={handleInputChange(setDirectorDetails)}
                        className="form-input w-100"
                        style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }} 
                        placeholder="Enter No of Shares" 
                    />
                </div>

            </div>
        </div>
    </div>
)}

{basicInfo.type === 'Company' && (
    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
        <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
            <Handshake size={20} className="me-2" /> 
            <strong>Joint Venture</strong>
        </div>

        <div className="card-body p-5 bg-white">
            <div className="row mt-2">

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Partner Name <span style={{ color: "red" }}>*</span></label>
                    
                      <input 
            type="text" 
            name="partherName"
            className="form-input w-100" 
            style={{ 
              height: '55px', 
              borderRadius: '10px', 
              border: '1px solid #005197CC',
              boxShadow: 'none' 
            }} 
            placeholder="Enter Partner Name" 
            value={localName.partnerName}
            onChange={handleInputChange(setJointVenture, 'partnerName')}
          />
                </div>

                <div className="col-md-6 mb-4 position-relative">
                    <label style={labelStyle}>Share % <span style={{ color: "red" }}>*</span></label>
                    <div className="input-group">
                        <input 
                            type="number"
                            name="sharePercentage"
                            value={jointVenture.sharePercentage}
                            onChange={handleInputChange(setJointVenture)}
                            className="form-input w-100" 
                            style={{ 
                                height: '55px', 
                                borderRadius: '10px', 
                                border: '1px solid #005197CC',
                                boxShadow: 'none' 
                            }} 
                            placeholder="0.00" 
                        />
                    </div>
                </div>

            </div>
        </div>
    </div>
)}

{basicInfo.type === 'Company' && (
  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
    <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
        <FileText size={20} className="me-2" /> 
        <strong>Company Profile</strong>
    </div>

    <div className="card-body p-5 bg-white">
      <div className="row mb-4">
        <div className="col-md-6 position-relative">
          <label style={labelStyle}>Order No <span style={{ color: "red" }}>*</span></label>
          <input 
              type="number" 
              className="form-input w-100" 
              style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }} 
              placeholder="Enter Order No"
              value={companyProfile.orderNo}
              onChange={e => setCompanyProfile(prev => ({ ...prev, orderNo: e.target.value }))}
          />
        </div>

        <div className="col-md-6 position-relative">
          <label style={labelStyle}>Remarks</label>
          
          <input 
              type="text" 
              className="form-input w-100" 
              style={{ height: '55px', borderRadius: '10px', border: '1px solid #005197CC', boxShadow: 'none' }} 
              placeholder="Enter Remarks"
              value={companyProfile.remarks}
              onChange={e => setCompanyProfile(prev => ({ ...prev, remarks: e.target.value }))}
          />
        
          
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 position-relative">
          <label style={labelStyle}>Description <span style={{ color: "red" }}>*</span></label>
          <textarea 
              className="form-input w-100" 
              rows="3" 
              style={{ borderRadius: '10px', paddingTop: '15px', border: '1px solid #005197CC', boxShadow: 'none' }} 
              placeholder="Enter Description"
              value={companyProfile.description}
              onChange={e => setCompanyProfile(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>

<div className="row">
  <div className="col-12 position-relative">
    <label style={labelStyle}>
      Attachments (Certificates / Licenses)
    </label>

    <div
      className="rounded-3 p-4 text-center"
      style={{
        border: "2px dashed #005197",
        minHeight: "160px",
        cursor: "pointer"
      }}
      onClick={() => document.getElementById("attachmentInput").click()}
    >
      <input
        type="file"
        id="attachmentInput"
        className="d-none"
        multiple
        accept=".pdf,.doc,.docx,.png,.jpg"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          setAttachments(prev => [...prev, ...files]);
        }}
      />

      <UploadCloud
  size={34}
  className="mb-2"
  style={{ color: "#005197" }}
/>

<div
  className="fw-semibold"
  style={{ color: "#005197" }}
>
  Click to upload or drag and drop
</div>

      <small className="text-muted">
        PDF, DOCX up to 10MB
      </small>

      {attachments.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="d-flex align-items-center gap-2 px-3 py-2 rounded shadow-sm"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E0E0E0",
                maxWidth: "260px"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <FileText size={16} className="text-primary" />

              <span
                className="small text-truncate"
                style={{ maxWidth: "170px" }}
                title={file.name}
              >
                {file.name}
              </span>

              <X
                size={16}
                className="text-danger"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setAttachments(prev =>
                    prev.filter((_, i) => i !== index)
                  )
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
    </div>
  </div>
)}

{basicInfo.type === 'Company' && (
  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
    <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
      <Info size={20} className="me-2" /> 
      <strong>Additional Info</strong>
    </div>
    <div className="card-body p-5 bg-white">
      <div className="row mt-2">
        <div className="col-md-6 mb-4 position-relative">
          <label style={labelStyle}>Type <span style={{ color: "red" }}>*</span></label>
          <Select 
            styles={selectStyles} 
            className="w-100"
                            classNamePrefix="select"
            placeholder="Select Type" 
            options={[
              { value: 'PAN No.', label: 'PAN No.' },
              { value: 'TIN No.', label: 'TIN No.' },
              { value: 'CIN No.', label: 'CIN No.' }
            ]} 
            value={additionalInfo.type ? { label: additionalInfo.type, value: additionalInfo.type } : null}
            onChange={handleSelectChange(setAdditionalInfo, 'type')}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            components={{ IndicatorSeparator: () => null }}
          />
        </div>

        <div className="col-md-6 mb-4 position-relative">
          <label style={labelStyle}>Reg. No</label>
          <input 
            type="text" 
            name="regNo"
            className="form-input w-100" 
            style={{ 
              height: '55px', 
              borderRadius: '10px', 
              border: '1px solid #005197CC',
              boxShadow: 'none' 
            }} 
            placeholder="Enter Registration No" 
            value={additionalInfo.regNo}
            onChange={handleInputChange(setAdditionalInfo)}
          />
        </div>
      </div>
    </div>
  </div>
)}

{basicInfo.type === 'Company' && (
  <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", overflow: 'hidden' }}>
    <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
      <Languages size={20} className="me-2" /> 
      <strong>Local Name</strong>
    </div>
    <div className="card-body p-5 bg-white">
      <div className="row mt-2">
        <div className="col-md-6 mb-4 position-relative">
          <label style={labelStyle}>Language <span style={{ color: "red" }}>*</span></label>
          <Select 
            styles={selectStyles} 
            className="w-100"
                            classNamePrefix="select"
            placeholder="Select Language" 
            options={[]} 
            value={localName.language ? { label: localName.language, value: localName.language } : null}
            onChange={handleSelectChange(setLocalName, 'language')}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            components={{ IndicatorSeparator: () => null }}
          />
        </div>

        <div className="col-md-6 mb-4 position-relative">
          <label style={labelStyle}>Name <span style={{ color: "red" }}>*</span></label>
          <input 
            type="text" 
            name="name"
            className="form-input w-100" 
            style={{ 
              height: '55px', 
              borderRadius: '10px', 
              border: '1px solid #005197CC',
              boxShadow: 'none' 
            }} 
            placeholder="Enter Local Name" 
            value={localName.name}
            onChange={handleInputChange(setLocalName)}
          />
        </div>
      </div>
    </div>
  </div>
)}
          </div> 
        </div> 

        <div className="d-flex justify-content-end gap-3 mt-2 pb-5">
            <button className="btn px-4 fw-bold" style={{ color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '8px' }}>Reset</button>
            <button className="btn px-4 fw-bold text-white" style={{ backgroundColor: bluePrimary, borderRadius: '8px' }}>Save Details</button>
        </div>
      </div>
    );
}

export default CompanyDetails;