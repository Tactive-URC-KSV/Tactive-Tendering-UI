import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, ArrowRight, Pencil, Mail, FileText, MapPin, User, Briefcase, DollarSign, Info, X, UploadCloud, CreditCard, Trash2 } from 'lucide-react';
import { FaCalendarAlt } from 'react-icons/fa';
import Flatpickr from "react-flatpickr";
import '../CSS/Styles.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const bluePrimary = "#005197";
const bluePrimaryLight = "#005197CC";
const labelTextColor = '#00000080';

const formatDateForBackend = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
};

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
    handleFileChange,
    handleRemoveFile,
    effectiveDateRef,
    taxRegDateRef,
    entityTypeOptions,
    natureOfBusinessOptions,
    gradeOptions,
    addressTypeOptions,
    countryOptions,
    territoryTypeOptions,
    territoryOptions,
    taxTypeOptions,
    additionalInfoTypeOptions,
    fetchNatureOfBusiness,
    fetchAddressState,
    fetchAddressCity,
    handleAddressChange,
    addAddress,
    removeAddress,
    handleContactChange,
    addContact,
    removeContact,
    handleTaxCountryFilterChange,
    handleTaxStateFilterChange,
    taxFilterCountry,
    taxFilterState,
    taxStateOptions,
    activeTab,
    setActiveTab,
    tabs,
    handleTabClick
}) => {
    const fileInputRef = useRef(null);

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

    return (
        <div className="manual-entry-form">
            <div className="bg-white rounded-3 shadow-sm mb-4" style={{ overflowX: 'auto' }}>
                <div className="d-flex border-bottom">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`custom-tab d-flex align-items-center px-4 py-3 text-nowrap ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <span className="me-2 d-flex align-items-center">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card text-start border-0 shadow-sm p-4 bg-white" style={{ borderRadius: "8px" }}>
                {activeTab === 'basic' && (
                    <>
                        <div className="row">
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
                                <input type="text" name="entityCode" className="form-input w-100" placeholder="Auto Generated" value={formData.entityCode}
                                    readOnly />
                            </div>
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
                                <input type="text" name="entityName" className="form-input w-100" placeholder="Enter entity name" value={formData.entityName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, entityName: e.target.value });
                                    }} />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform-select text-start d-block">Effective Date <span style={{ color: "red" }}>*</span></label>
                                <div className="position-relative">
                                    <Flatpickr
                                        ref={effectiveDateRef}
                                        value={formData.effectiveDate}
                                        name="effectiveDate"
                                        className="form-input w-100"
                                        placeholder="Select Effective date"
                                        options={{ dateFormat: "d-m-Y", allowInput: true }}
                                        onClose={(_, dateStr) => {
                                            setFormData({ ...formData, effectiveDate: dateStr });
                                        }}
                                    />
                                    <span
                                        className='calendar-icon'
                                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                        onClick={() => effectiveDateRef.current?.flatpickr?.open()}
                                    >
                                        <FaCalendarAlt size={18} color='#005197' />
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform-select text-start d-block">Entity Type <span style={{ color: "red" }}>*</span></label>
                                <Select
                                    name="entityType"
                                    options={entityTypeOptions}
                                    value={entityTypeOptions?.find(opt => opt.value === formData.entityType)}
                                    onChange={(option) => {
                                        setFormData({ ...formData, entityType: option.value });
                                        fetchNatureOfBusiness(option.value);
                                    }}
                                    placeholder="Select entity type"
                                    classNamePrefix="select"
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform-select text-start d-block">Nature of Business </label>
                                <Select
                                    name="natureOfBusiness"
                                    options={natureOfBusinessOptions}
                                    value={natureOfBusinessOptions?.find(opt => opt.value === formData.natureOfBusiness)}
                                    onChange={(option) => {
                                        setFormData({ ...formData, natureOfBusiness: option.value });
                                    }}
                                    placeholder="Select nature of business"
                                    classNamePrefix="select"
                                />
                            </div>
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform-select text-start d-block">Grade</label>
                                <Select
                                    name="grade"
                                    options={gradeOptions}
                                    value={gradeOptions?.find(opt => opt.value === formData.grade)}
                                    onChange={(option) => {
                                        setFormData({ ...formData, grade: option.value });
                                    }}
                                    placeholder="Select grade"
                                    classNamePrefix="select"
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-12 mb-4 position-relative">
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
                    </>
                )}

                {activeTab === 'address' && (
                    <div className="address-section">
                        {formData.addressList.map((addr, index) => (
                            <div key={index} className={`mb-5 ${index > 0 ? "pt-4 border-top" : ""}`}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0" style={{ color: bluePrimary }}>Address {index + 1}</h5>
                                    {index > 0 && (
                                        <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={() => removeAddress(index)}>
                                            <Trash2 size={16} className="me-1" /> Remove
                                        </button>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block">Phone No</label>
                                        <input type="text" name="phoneNo" className="form-input w-100" placeholder="Enter phone no" value={addr.phoneNo}
                                            onChange={(e) => handleAddressChange(index, e)} />
                                    </div>
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block">Email ID</label>
                                        <input type="text" name="emailID" className="form-input w-100" placeholder="Enter email ID" value={addr.emailID}
                                            onChange={(e) => handleAddressChange(index, e)} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform-select text-start d-block">Address Type <span className="text-danger">*</span></label>
                                        <Select name="addressType"
                                            options={addressTypeOptions}
                                            onChange={(option) => {
                                                const newList = [...formData.addressList];
                                                newList[index].addressType = option.value;
                                                setFormData({ ...formData, addressList: newList });
                                            }}
                                            classNamePrefix="select"
                                            value={addressTypeOptions?.find(opt => opt.value === addr.addressType)}
                                            placeholder="Select address type" />
                                    </div>
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block">Address 1</label>
                                        <input type="text" name="address1" className="form-input w-100" placeholder="Enter address 1" value={addr.address1}
                                            onChange={(e) => handleAddressChange(index, e)} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block">Address 2</label>
                                        <input type="text" name="address2" className="form-input w-100" placeholder="Enter address 2" value={addr.address2}
                                            onChange={(e) => handleAddressChange(index, e)} />
                                    </div>
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform-select text-start d-block">Country <span className="text-danger">*</span></label>
                                        <Select name="country"
                                            options={countryOptions}
                                            onChange={(option) => {
                                                const newList = [...formData.addressList];
                                                newList[index].country = option.value;
                                                newList[index].addressState = null;
                                                newList[index].addresscity = null;
                                                setFormData({ ...formData, addressList: newList });
                                                fetchAddressState(index, option.value);
                                            }}
                                            classNamePrefix="select"
                                            value={countryOptions?.find(opt => opt.value === addr.country)}
                                            placeholder="Select country" />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform-select text-start d-block">State <span className="text-danger">*</span></label>
                                        <Select name="addressState"
                                            options={addr.stateOptions || []}
                                            onChange={(option) => {
                                                const newList = [...formData.addressList];
                                                newList[index].addressState = option.value;
                                                newList[index].addresscity = null;
                                                setFormData({ ...formData, addressList: newList });
                                                fetchAddressCity(index, option.value);
                                            }}
                                            classNamePrefix="select"
                                            isDisabled={!addr.country}
                                            value={(addr.stateOptions || []).find(opt => opt.value === addr.addressState)}
                                            placeholder="Select state" />
                                    </div>
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform-select text-start d-block">City <span className="text-danger">*</span></label>
                                        <Select name="addresscity"
                                            options={addr.cityOptions || []}
                                            onChange={(option) => {
                                                const newList = [...formData.addressList];
                                                newList[index].addresscity = option.value;
                                                setFormData({ ...formData, addressList: newList });
                                            }}
                                            classNamePrefix="select"
                                            isDisabled={!addr.addressState}
                                            value={(addr.cityOptions || []).find(opt => opt.value === addr.addresscity)}
                                            placeholder="Select city" />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block">Zip/Postal Code <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" name="zipCode" className="form-input w-100" placeholder="Enter Zip/Postal Code" value={addr.zipCode}
                                            onChange={(e) => handleAddressChange(index, e)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline-primary d-flex align-items-center mt-2 fw-bold" onClick={addAddress}>
                            <ArrowRight size={18} className="me-2" style={{ transform: 'rotate(-90deg)' }} /> Add Another Address
                        </button>
                    </div>
                )}

                {activeTab === 'contact' && (
                    <div className="contact-section">
                        {formData.contactList.map((contact, index) => (
                            <div key={index} className={`mb-5 ${index > 0 ? "pt-4 border-top" : ""}`}>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="fw-bold mb-0" style={{ color: bluePrimary }}>Contact {index + 1}</h5>
                                    {index > 0 && (
                                        <button type="button" className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={() => removeContact(index)}>
                                            <Trash2 size={16} className="me-1" /> Remove
                                        </button>
                                    )}
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block"> Name <span style={{ color: 'red' }}>*</span></label>
                                        <input type="text" name="name" className="form-input w-100" placeholder="Enter contact name" value={contact.name}
                                            onChange={(e) => handleContactChange(index, e)} />
                                    </div>
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform-select text-start d-block"> Position <span className="text-danger">*</span></label>
                                        <input type="text" name="position" className="form-input w-100" placeholder="Enter contact position" value={contact.position}
                                            onChange={(e) => handleContactChange(index, e)} />
                                    </div>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block">Phone No <span className="text-danger">*</span> </label>
                                        <input type="text" name="phoneNo" className="form-input w-100" placeholder="Enter phone no" value={contact.phoneNo}
                                            onChange={(e) => handleContactChange(index, e)} />
                                    </div>
                                    <div className="col-md-6 mb-4 position-relative">
                                        <label className="projectform text-start d-block"> Email ID <span className="text-danger">*</span></label>
                                        <input type="text" name="emailId" className="form-input w-100" placeholder="Enter email ID" value={contact.emailId}
                                            onChange={(e) => handleContactChange(index, e)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline-primary d-flex align-items-center mt-2 fw-bold" onClick={addContact}>
                            <ArrowRight size={18} className="me-2" style={{ transform: 'rotate(-90deg)' }} /> Add Another Contact
                        </button>
                    </div>
                )}

                {activeTab === 'tax' && (
                    <div className="row mt-2">
                        <div className="col-md-6 mb-4 position-relative">
                            <label className="projectform-select text-start d-block">Tax Type <span className="text-danger">*</span></label>
                            <Select name="taxType"
                                options={taxTypeOptions}
                                onChange={(option) => {
                                    const val = option ? option.value : null;
                                    if (val === 'GST_UNREGISTER') {
                                        setFormData({
                                            ...formData,
                                            taxType: val,
                                            territoryType: '',
                                            territory: '',
                                            taxRegNo: '',
                                            taxRegDate: '',
                                            taxAddress1: '',
                                            taxAddress2: '',
                                            taxZipCode: '',
                                            taxEmailID: ''
                                        });
                                    } else {
                                        setFormData({ ...formData, taxType: val });
                                    }
                                }}
                                classNamePrefix="select"
                                value={taxTypeOptions?.find(opt => opt.value === formData.taxType)}
                                placeholder="Select tax type"
                                isClearable />
                        </div>
                        {formData.taxType !== 'GST_UNREGISTER' && (
                            <>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform-select text-start d-block">Territory Type <span style={{ color: "red" }}>*</span></label>
                                    <Select name="territoryType"
                                        options={territoryTypeOptions}
                                        onChange={(option) => {
                                            const newTerritoryTypeId = option ? option.value : null;
                                            setFormData({ ...formData, territoryType: newTerritoryTypeId, territory: null });
                                            if (newTerritoryTypeId) {
                                                fetchTerritory(newTerritoryTypeId);
                                            } else {
                                                handleTaxCountryFilterChange(null);
                                            }
                                        }}
                                        classNamePrefix="select"
                                        value={territoryTypeOptions?.find(opt => opt.value === formData.territoryType) || null}
                                        placeholder="Select territory type"
                                        isClearable />
                                </div>
                                {['STATE', 'CITY'].includes(formData.territoryType) && (
                                    <>
                                        <div className={`${formData.territoryType === 'CITY' ? 'col-md-4' : 'col-md-6'} mb-4 position-relative`}>
                                            <label className="projectform-select text-start d-block">Filter Country <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                options={taxCountryOptions}
                                                placeholder="Select Country"
                                                value={taxFilterCountry}
                                                onChange={handleTaxCountryFilterChange}
                                                classNamePrefix="select"
                                                isClearable
                                            />
                                        </div>
                                        {formData.territoryType === 'CITY' && (
                                            <div className="col-md-4 mb-4 position-relative">
                                                <label className="projectform-select text-start d-block">Filter State <span style={{ color: "red" }}>*</span></label>
                                                <Select
                                                    options={taxStateOptions}
                                                    placeholder="Select State"
                                                    value={taxFilterState}
                                                    onChange={handleTaxStateFilterChange}
                                                    isDisabled={!taxFilterCountry}
                                                    classNamePrefix="select"
                                                    isClearable
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className={`${formData.territoryType === 'CITY' ? 'col-md-4' : 'col-md-6'} mb-4 position-relative`}>
                                    <label className="projectform-select text-start d-block">Territory <span style={{ color: "red" }}>*</span></label>
                                    <Select name="territory"
                                        options={territoryOptions}
                                        onChange={(option) => {
                                            setFormData({ ...formData, territory: option ? option.value : null });
                                        }}
                                        classNamePrefix="select"
                                        value={territoryOptions?.find(opt => opt.value === formData.territory) || null}
                                        placeholder="Select territory"
                                        isDisabled={
                                            (formData.territoryType === 'STATE' && !taxFilterCountry) ||
                                            (formData.territoryType === 'CITY' && !taxFilterState)
                                        }
                                        isClearable
                                    />
                                </div>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform text-start d-block">Tax Reg No <span style={{ color: 'red' }}>*</span></label>
                                    <input type="text" name="taxRegNo" className="form-input w-100" placeholder="Enter tax registration no" value={formData.taxRegNo || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, taxRegNo: e.target.value });
                                        }} />
                                </div>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform-select text-start d-block">Tax Reg Date <span style={{ color: "red" }}>*</span></label>
                                    <div className="position-relative">
                                        <Flatpickr
                                            ref={taxRegDateRef}
                                            name="taxRegDate"
                                            value={formData.taxRegDate || ''}
                                            className="form-input w-100"
                                            placeholder="Select Tax Reg date"
                                            options={{ dateFormat: "d-M-Y", allowInput: true }}
                                            onClose={(_, dateStr) => {
                                                setFormData({ ...formData, taxRegDate: dateStr });
                                            }}
                                        />
                                        <span
                                            className='calendar-icon'
                                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                            onClick={() => taxRegDateRef.current?.flatpickr?.open()}
                                        >
                                            <FaCalendarAlt size={18} color='#005197' />
                                        </span>
                                    </div>
                                </div>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform text-start d-block">Address 1</label>
                                    <input type="text" name="taxAddress1" className="form-input w-100" placeholder="Enter address 1" value={formData.taxAddress1 || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, taxAddress1: e.target.value });
                                        }} />
                                </div>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform text-start d-block">Address 2</label>
                                    <input type="text" name="taxAddress2" className="form-input w-100" placeholder="Enter address 2" value={formData.taxAddress2 || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, taxAddress2: e.target.value });
                                        }} />
                                </div>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform text-start d-block">Zip/Postal Code</label>
                                    <input type="text" name="taxZipCode" className="form-input w-100" placeholder="Enter Zip/Postal Code" value={formData.taxZipCode || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, taxZipCode: e.target.value })
                                        }} />
                                </div>
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform text-start d-block">Email ID</label>
                                    <input type="text" name="taxEmailID" className="form-input w-100" placeholder="Enter email ID" value={formData.taxEmailID || ''}
                                        onChange={(e) => {
                                            setFormData({ ...formData, taxEmailID: e.target.value })
                                        }} />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'bank' && (
                    <>
                        <div className="row">
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Account Holder Name <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" name="accountHolderName" className="form-input w-100" placeholder="Enter account holder name" value={formData.accountHolderName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, accountHolderName: e.target.value });
                                    }
                                    } />
                            </div>
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Account No <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" name="accountNo" className="form-input w-100" placeholder="Enter account no" value={formData.accountNo}
                                    onChange={(e) => {
                                        setFormData({ ...formData, accountNo: e.target.value });
                                    }} />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Bank Name <span style={{ color: 'red' }}>*</span></label>
                                <input type="text" name="bankName" className="form-input w-100" placeholder="Enter bank name" value={formData.bankName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, bankName: e.target.value });
                                    }} />
                            </div>
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Branch Name <span style={{ color: "red" }}>*</span></label>
                                <input type="text" name="branchName" className="form-input w-100" placeholder="Enter branch name" value={formData.branchName}
                                    onChange={(e) => {
                                        setFormData({ ...formData, branchName: e.target.value });
                                    }} />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-12 mb-4 position-relative">
                                <label className="projectform text-start d-block">Bank Address</label>
                                <input type="text" name="bankAddress" className="form-input w-100" placeholder="Enter bank address" value={formData.bankAddress}
                                    autoComplete='off'
                                    onChange={(e) => {
                                        setFormData({ ...formData, bankAddress: e.target.value });
                                    }} />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'additional' && (
                    <>
                        <div className="row">
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform-select text-start d-block">Type <span style={{ color: "red" }}>*</span></label>
                                <Select name="additionalInfoType" options={additionalInfoTypeOptions}
                                    onChange={(option) => {
                                        setFormData({ ...formData, additionalInfoType: option.value });
                                    }}
                                    classNamePrefix="select"
                                    value={additionalInfoTypeOptions?.find(opt => opt.value === formData.additionalInfoType)}
                                    placeholder="Select type" />
                            </div>
                            <div className="col-md-6 mb-4 position-relative">
                                <label className="projectform text-start d-block">Registration No <span style={{ color: "red" }}>*</span></label>
                                <input type="text" name="registrationNo" className="form-input w-100" placeholder="Enter registration no" value={formData.registrationNo}
                                    onChange={(e) => {
                                        setFormData({ ...formData, registrationNo: e.target.value });
                                    }} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const EmailInviteForm = ({ formData, setFormData, handleSendInvitation, isLoading }) => (
    <>
        <div className="text-center pt-2 pb-4">
            <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#EAF2FF",
                }}
            >
                <Mail size={22} style={{ color: bluePrimary }} />
            </div>

            <h3 className="fs-5 fw-bold mb-1" style={{ color: bluePrimary }}>
                Invite Contractor via Email
            </h3>

            <p className="mb-0" style={{ color: "#6286A6", fontSize: "14px" }}>
                Send a secure link to the contractor. They will be able to fill out their
                details, upload documents, and submit.
            </p>
        </div>

        <div className="row">
            <div className="col-md-6" style={{ marginBottom: "32px" }}>
                <label className="projectform d-block mb-1">
                    Contractor Email ID <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    name="contractorEmailId"
                    className="form-input w-100"
                    placeholder="Enter Contractor Email ID"
                    value={formData.contractorEmailId}
                    onChange={(e) => {
                        setFormData({ ...formData, contractorEmailId: e.target.value });
                    }}
                />
            </div>

            <div className="col-md-6" style={{ marginBottom: "32px" }}>
                <label className="projectform d-block mb-1">
                    Contractor Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                    type="text"
                    name="contractorName"
                    className="form-input w-100"
                    placeholder="Enter Contractor Name"
                    value={formData.contractorName}
                    onChange={(e) => {
                        setFormData({ ...formData, contractorName: e.target.value })
                    }}
                />
            </div>
        </div>

        <div style={{ marginBottom: "32px" }}>
            <label className="projectform d-block mb-1">
                Message
            </label>
            <input
                type="text"
                name="contractorMessage"
                className="form-input w-100"
                placeholder="Add a personalized message..."
                value={formData.contractorMessage}
                onChange={(e) => {
                    setFormData({ ...formData, contractorMessage: e.target.value });
                }}
            />
        </div>

        <div
            className="d-flex align-items-center p-3 rounded"
            style={{ backgroundColor: "#F3F8FF" }}
        >
            <Info size={18} className="me-2" style={{ color: "#2563EB" }} />
            <p className="mb-0 small" style={{ color: "#2563EB" }}>
                Invitation link will be sent to the contractor's email address.
                They'll receive a secure link to complete their onboarding process.
            </p>
        </div>
        <div className="d-flex justify-content-end mt-3">
            <button
                type="button"
                onClick={handleSendInvitation}
                className="btn d-flex align-items-center fw-bold px-4"
                style={{
                    backgroundColor: bluePrimary,
                    color: "white",
                    borderRadius: "6px",
                }}
                disabled={isLoading}
            >
                <Mail size={18} className="me-2" />
                Send Invitation Link
            </button>
        </div>
    </>
);

const ReviewSummaryContent = ({
    formData,
    handleGoBackToEntry,
    handleSubmitFinal,
    entityTypeOptions,
    natureOfBusinessOptions,
    gradeOptions,
    addressTypeOptions,
    countryOptions,
    addressStateOptions,
    addresscityOptions,
    territoryTypeOptions,
    territoryOptions,
    taxTypeOptions,
    additionalInfoTypeOptions,
    isLoading,
}) => {
    const { entityCode, entityName, effectiveDate, entityType, natureOfBusiness, grade, attachmentMetadata = [], addressList = [], contactList = [] } = formData;
    const { taxType, territoryType, territory, taxRegNo, taxRegDate, taxAddress1, taxAddress2, taxZipCode, taxEmailID, } = formData;
    const { accountHolderName, accountNo, bankName, branchName, bankAddress, } = formData;
    const { additionalInfoType, registrationNo, } = formData;

    const getLabel = (value, options) => {
        if (!value || !options) return value;
        const option = options.find(opt => opt.value === value);
        return option ? option.label : value;
    };

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
                toast.error("The file view window was blocked. Please enable pop-ups for this site.");
                URL.revokeObjectURL(objectUrl);
            }
        } else {
            toast.error("Cannot view document. File data is corrupted or not accessible. (Ensure the file object was stored correctly during upload.)");
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
                            <DetailItem label="Entity Type" value={getLabel(entityType, entityTypeOptions)} />
                            <DetailItem label="Nature of Business" value={getLabel(natureOfBusiness, natureOfBusinessOptions)} />
                            <DetailItem label="Grade" value={getLabel(grade, gradeOptions)} />
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

                {addressList.map((addr, idx) => (
                    <div key={idx} className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <MapPin size={18} className="me-2" /> Address Details {addressList.length > 1 ? `(${idx + 1})` : ''}
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Registered company address</p>
                            </div>
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    <DetailItem label="Phone No" value={addr.phoneNo} />
                                    <DetailItem label="Email ID" value={addr.emailID} />
                                    <DetailItem label="Address Type" value={getLabel(addr.addressType, addressTypeOptions)} />
                                </div>
                                <div className="row">
                                    <DetailItem label="Address 1" value={addr.address1} />
                                    <DetailItem label="Address 2" value={addr.address2} />
                                    <DetailItem label="" value="" />
                                </div>
                                <div className="row mb-3">
                                    <DetailItem label="Country" value={getLabel(addr.country, countryOptions)} />
                                    <DetailItem label="State" value={getLabel(addr.addressState, addr.stateOptions)} />
                                    <DetailItem label="City" value={getLabel(addr.addresscity, addr.cityOptions)} />
                                    <DetailItem label="Zip/Postal Code" value={addr.zipCode} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {contactList.map((contact, idx) => (
                    <div key={idx} className="pt-4 mt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <div className="row mt-3">
                            <div className="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <h5 className="fw-bold mb-1" style={{ color: bluePrimary }}>
                                    <User size={18} className="me-2" /> Contact Details {contactList.length > 1 ? `(${idx + 1})` : ''}
                                </h5>
                                <p className="text-muted" style={{ fontSize: '0.9rem' }}>Primary point of contact</p>
                            </div>
                            <div className="col-lg-8 col-md-12 col-sm-12">
                                <div className="row">
                                    <DetailItem label="Name" value={contact.name} />
                                    <DetailItem label="Position" value={contact.position} />
                                    <DetailItem label="" value="" />
                                </div>
                                <div className="row mb-3">
                                    <DetailItem label="Phone No" value={contact.phoneNo} />
                                    <DetailItem label="Email ID" value={contact.emailId} />
                                    <DetailItem label="" value="" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

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
                                <DetailItem label="Tax Type" value={getLabel(taxType, taxTypeOptions)} />
                                {taxType !== 'GST_UNREGISTER' && (
                                    <>
                                        <DetailItem label="Territory Type" value={getLabel(territoryType, territoryTypeOptions)} />
                                        <DetailItem label="Territory" value={getLabel(territory, territoryOptions)} />
                                    </>
                                )}
                            </div>
                            {taxType !== 'GST_UNREGISTER' && (
                                <>
                                    <div className="row">
                                        <DetailItem label="Tax Reg No" value={taxRegNo} />
                                        <DetailItem label="Tax Reg Date" value={taxRegDate} />
                                        <DetailItem label="Email ID" value={taxEmailID} />
                                    </div>
                                    <div className="row mb-3">
                                        <DetailItem label="Address 1" value={taxAddress1} />
                                        <DetailItem label="Address 2" value={taxAddress2} />
                                        <DetailItem label="Zip/Postal Code" value={taxZipCode} />
                                    </div>
                                </>
                            )}
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
                                <DetailItem label="Type" value={getLabel(additionalInfoType, additionalInfoTypeOptions)} />
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
                    disabled={isLoading}
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
    const effectiveDateRef = useRef();
    const taxRegDateRef = useRef();
    const datePickerRef = useRef();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const [viewMode, setViewMode] = useState('entry');
    const STORAGE_KEY = 'contractorFormData';
    const [isLoading, setIsLoading] = useState(false);
    const [entityTypeOptions, setEntityTypeOptions] = useState([]);
    const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);
    const [gradeOptions, setGradeOptions] = useState([]);
    const [addressTypeOptions, setAddressTypeOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [addressStateOptions, setAddressStateOptions] = useState([]);
    const [addresscityOptions, setAddresscityOptions] = useState([]);
    const [territoryTypeOptions, setTerritoryTypeOptions] = useState([]);
    const [territoryOptions, setTerritoryOptions] = useState([]);
    const [taxTypeOptions, setTaxTypeOptions] = useState([]);
    const [additionalInfoTypeOptions, setAdditionalInfoTypeOptions] = useState([]);
    const [taxCountryOptions, setTaxCountryOptions] = useState([]);
    const [taxStateOptions, setTaxStateOptions] = useState([]);
    const [taxFilterCountry, setTaxFilterCountry] = useState(null);
    const [taxFilterState, setTaxFilterState] = useState(null);
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchAddressState = (index, countryId) => {
        if (!countryId) {
            setFormData(prev => {
                const newList = [...prev.addressList];
                newList[index] = { ...newList[index], stateOptions: [], cityOptions: [] };
                return { ...prev, addressList: newList };
            });
            return;
        }
        axios.get(`${baseUrl}/states/${countryId}`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                const options = list.map(item => ({ value: item.id, label: item.state }));
                setFormData(prev => {
                    const newList = [...prev.addressList];
                    newList[index] = { ...newList[index], stateOptions: options };
                    return { ...prev, addressList: newList };
                });
            })
            .catch(() => {
                setFormData(prev => {
                    const newList = [...prev.addressList];
                    newList[index] = { ...newList[index], stateOptions: [], cityOptions: [] };
                    return { ...prev, addressList: newList };
                });
            });
    }

    const fetchAddressCity = (index, stateId) => {
        if (!stateId) {
            setFormData(prev => {
                const newList = [...prev.addressList];
                newList[index] = { ...newList[index], cityOptions: [] };
                return { ...prev, addressList: newList };
            });
            return;
        }
        axios.get(`${baseUrl}/cities/byState/${stateId}`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                const options = list.map(item => ({ value: item.id, label: item.city }));
                setFormData(prev => {
                    const newList = [...prev.addressList];
                    newList[index] = { ...newList[index], cityOptions: options };
                    return { ...prev, addressList: newList };
                });
            })
            .catch(() => {
                setFormData(prev => {
                    const newList = [...prev.addressList];
                    newList[index] = { ...newList[index], cityOptions: [] };
                    return { ...prev, addressList: newList };
                });
            });
    }

    const handleAddressChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newList = [...prev.addressList];
            newList[index] = { ...newList[index], [name]: value };
            return { ...prev, addressList: newList };
        });
    };

    const addAddress = () => {
        setFormData(prev => ({
            ...prev,
            addressList: [...prev.addressList, {
                addressType: '', address1: '', address2: '', country: '',
                addressState: '', addresscity: '', zipCode: '', phoneNo: '', emailID: '',
                stateOptions: [], cityOptions: []
            }]
        }));
    };

    const removeAddress = (index) => {
        if (formData.addressList.length > 1) {
            setFormData(prev => ({
                ...prev,
                addressList: prev.addressList.filter((_, i) => i !== index)
            }));
        }
    };

    const handleContactChange = (index, e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newList = [...prev.contactList];
            newList[index] = { ...newList[index], [name]: value };
            return { ...prev, contactList: newList };
        });
    };

    const addContact = () => {
        setFormData(prev => ({
            ...prev,
            contactList: [...prev.contactList, { name: '', position: '', phoneNo: '', emailId: '' }]
        }));
    };

    const removeContact = (index) => {
        if (formData.contactList.length > 1) {
            setFormData(prev => ({
                ...prev,
                contactList: prev.contactList.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSendInvitation = async () => {
        if (!formData.contractorEmailId) {
            toast.error("Please enter the contractor's email address.");
            return;
        }

        const payload = {
            email: formData.contractorEmailId,
            name: formData.contractorName,
            message: formData.contractorMessage
        };

        try {
            await axios.post(`${baseUrl}/contractor/invite`, payload, { headers });
            toast.success("Invitation sent successfully!");
            setFormData(prev => ({
                ...prev,
                contractorEmailId: '',
                contractorName: '',
                contractorMessage: ''
            }));
        } catch (error) {
            console.error("Error sending invitation:", error);
            const errorMessage = error.response?.data?.message || error.response?.data || "Failed to send invitation.";
            toast.error(typeof errorMessage === 'string' ? errorMessage : "Failed to send invitation.");
        }
    };

    const [activeTab, setActiveTab] = useState("basic");
    const tabs = [
        { id: "basic", label: "Basic Details", icon: <Briefcase size={16} /> },
        { id: "address", label: "Address Details", icon: <MapPin size={16} /> },
        { id: "contact", label: "Contact Details", icon: <User size={16} /> },
        { id: "tax", label: "Tax Details", icon: <FileText size={16} /> },
        { id: "bank", label: "Bank Details", icon: <CreditCard size={16} /> },
        { id: "additional", label: "Additional Info", icon: <Info size={16} /> },
    ];

    useEffect(() => {
        if (!token) return;
        axios.get(`${baseUrl}/contractorType`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setEntityTypeOptions(
                    list.map(item => ({
                        value: item.id,
                        label: item.type
                    }))
                );
            });
        axios.get(`${baseUrl}/contractorGrade`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setGradeOptions(
                    list.map(item => ({
                        value: item.id,
                        label: item.gradeName
                    }))
                );
            });
        axios.get(`${baseUrl}/addressType`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setAddressTypeOptions(
                    list.map(item => ({
                        value: item.id,
                        label: item.addressType
                    }))
                );
            });
        axios.get(`${baseUrl}/countries`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setCountryOptions(
                    list.map(item => ({
                        value: item.id,
                        label: item.country
                    }))
                );
            });
        axios.get(`${baseUrl}/taxType`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setTaxTypeOptions(
                    list.map(item => ({
                        value: item.code,
                        label: item.label
                    }))
                );
            });
        axios.get(`${baseUrl}/territoryType`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setTerritoryTypeOptions(
                    list.map(item => ({
                        value: item.code,
                        label: item.label
                    }))
                );
            });
        axios.get(`${baseUrl}/identityType`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setAdditionalInfoTypeOptions(
                    list.map(item => ({
                        value: item.id,
                        label: item.idType
                    }))
                );
            });

    }, [token]);

    const fetchNatureOfBusiness = (entityTypeId) => {
        axios.get(`${baseUrl}/contractorNature/${entityTypeId}`, { headers })
            .then(r => {
                const list = r.data?.data ?? r.data ?? [];
                setNatureOfBusinessOptions(
                    list.map(item => ({
                        value: item.id,
                        label: item.nature
                    }))
                );
            });
    }
    const toOptions = (data, labelKey) =>
        (data || [])
            .filter(item => item.active !== false)
            .map(item => ({
                value: item.id,
                label: item[labelKey]
            }));
    const fetchTerritory = async (territoryTypeId) => {
        if (!territoryTypeId) {
            setTerritoryOptions([]);
            setFormData({ ...formData, territoryTypeId: null, territory: null });
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            let url = '';
            let response = [];

            // Reset filters
            setTaxFilterCountry(null);
            setTaxFilterState(null);
            setTaxCountryOptions([]);
            setTaxStateOptions([]);

            switch (territoryTypeId) {
                case 'COUNTRY':
                    url = `${import.meta.env.VITE_API_BASE_URL}/countries`;
                    response = await axios.get(url, { headers });
                    setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item.country })));
                    break;
                case 'STATE':
                    // Load Countries for Filter
                    response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/countries`, { headers });
                    setTaxCountryOptions(response.data.map(item => ({ value: item.id, label: item.country })));
                    setTerritoryOptions([]); // Wait for filter selection
                    break;
                case 'CITY':
                    // Load Countries for Filter (State filter depends on Country)
                    response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/countries`, { headers });
                    setTaxCountryOptions(response.data.map(item => ({ value: item.id, label: item.country })));
                    setTerritoryOptions([]); // Wait for filter selection
                    break;
                default:
                    setTerritoryOptions([]);
                    return;
            }
        } catch (error) {
            console.error("Error fetching territory:", error);
            setTerritoryOptions([]);
        }
    };

    const handleTaxCountryFilterChange = async (selectedOption) => {
        setTaxFilterCountry(selectedOption);
        setTaxFilterState(null);
        setTerritoryOptions([]);

        if (!selectedOption) return;

        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };

            if (formData.territoryType === 'STATE') {
                // Fetch States by Country for Territory Options
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/states/${selectedOption.value}`, { headers });
                setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item.state })));
            } else if (formData.territoryType === 'CITY') {
                // Fetch States by Country for State Filter
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/states/${selectedOption.value}`, { headers });
                setTaxStateOptions(response.data.map(item => ({ value: item.id, label: item.state })));
            }
        } catch (error) {
            console.error("Error fetching territory options:", error);
        }
    };

    const handleTaxStateFilterChange = async (selectedOption) => {
        setTaxFilterState(selectedOption);
        setTerritoryOptions([]);

        if (!selectedOption) return;

        if (formData.territoryType === 'CITY') {
            try {
                const token = sessionStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };
                // Fetch Cities by State for Territory Options
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cities/byState/${selectedOption.value}`, { headers });
                setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item.city })));
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        }
    };

    const generateEntityCode = () => `CON-${Math.floor(100 + Math.random() * 900)}`;

    const defaultFormData = {
        id: null,
        entityCode: generateEntityCode(), entityName: '', effectiveDate: '', entityType: '',
        natureOfBusiness: '', grade: '', attachments: [], attachmentMetadata: [],
        addressList: [{
            addressType: '', address1: '', address2: '', country: '',
            addressState: '', addresscity: '', zipCode: '', phoneNo: '', emailID: '',
            stateOptions: [], cityOptions: []
        }],
        contactList: [{
            name: '', position: '', phoneNo: '', emailId: ''
        }],
        taxType: '', territoryType: '', territory: '', taxRegNo: '',
        taxRegDate: '', taxAddress1: '', taxAddress2: '',
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

    const validateCurrentTab = (tabId) => {
        if (tabId === 'basic') {
            if (!formData.entityName || !formData.effectiveDate || !formData.entityType) {
                toast.error("Please fill in all mandatory basic details.");
                return false;
            }
        } else if (tabId === 'address') {
            const isValid = formData.addressList.every(addr =>
                addr.addressType && addr.country && addr.addressState && addr.addresscity && addr.zipCode
            );
            if (!isValid) {
                toast.error("Please fill in all mandatory address details.");
                return false;
            }
        } else if (tabId === 'contact') {
            const isValid = formData.contactList.every(contact =>
                contact.name && contact.position && contact.emailId && contact.phoneNo
            );
            if (!isValid) {
                toast.error("Please fill in all mandatory contact details.");
                return false;
            }
        } else if (tabId === 'tax') {
            if (!formData.taxType) {
                toast.error("Please select a tax type.");
                return false;
            }
            if (formData.taxType !== 'GST_UNREGISTER') {
                if (!formData.territoryType || !formData.territory || !formData.taxRegNo || !formData.taxRegDate) {
                    toast.error("Please fill in all mandatory tax details.");
                    return false;
                }
            }
        } else if (tabId === 'bank') {
            if (!formData.accountHolderName || !formData.accountNo || !formData.bankName || !formData.branchName) {
                toast.error("Please fill in all mandatory bank details.");
                return false;
            }
        } else if (tabId === 'additional') {
            if (!formData.additionalInfoType || !formData.registrationNo) {
                toast.error("Please fill in all mandatory additional info details.");
                return false;
            }
        }
        return true;
    };

    const handleTabClick = (targetTabId) => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        const targetIndex = tabs.findIndex(t => t.id === targetTabId);
        
        if (targetIndex > currentIndex) {
            for (let i = currentIndex; i < targetIndex; i++) {
                if (!validateCurrentTab(tabs[i].id)) {
                    setActiveTab(tabs[i].id);
                    return;
                }
            }
        }
        setActiveTab(targetTabId);
    };

    const handleNextTab = () => {
        if (!validateCurrentTab(activeTab)) return;
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex < tabs.length - 1) {
            setActiveTab(tabs[currentIndex + 1].id);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevTab = () => {
        const currentIndex = tabs.findIndex(t => t.id === activeTab);
        if (currentIndex > 0) {
            setActiveTab(tabs[currentIndex - 1].id);
            window.scrollTo(0, 0);
        }
    };
    const handleSubmitFinal = async () => {
        setIsLoading(true);

        // Run the same validations as the tabs
        for (let i = 0; i < tabs.length; i++) {
            if (!validateCurrentTab(tabs[i].id)) {
                setViewMode('entry');
                setActiveTab(tabs[i].id);
                setIsLoading(false);
                return;
            }
        }

        const contractorDTO = {
            id: formData.id || null,
            entityCode: formData.entityCode,
            entityName: formData.entityName,
            effectiveDate: formatDateForBackend(formData.effectiveDate),
            contractorTypeId: formData.entityType,
            contractorGradeId: formData.grade,
            contractorNatureIds: formData.natureOfBusiness ? [formData.natureOfBusiness] : [],
            submissionMode: "MANUAL",
            attachmentUrls: [],
            contacts: formData.contactList.map(c => ({
                id: c.id || null,
                name: c.name,
                position: c.position,
                phoneNo: c.phoneNo,
                email: c.emailId
            })),
            addresses: formData.addressList.map(a => ({
                id: a.id || null,
                addressTypeId: a.addressType,
                address1: a.address1,
                address2: a.address2,
                zipcode: a.zipCode,
                email: a.emailID,
                phone: a.phoneNo,
                countryId: a.country,
                stateId: a.addressState,
                cityId: a.addresscity
            })),
            taxDetails: [{
                id: formData.taxId || null,
                taxTypeId: formData.taxType,
                territoryTypeId: formData.territoryType,
                territory: formData.territory,
                taxRegNo: formData.taxRegNo,
                taxRegDate: formatDateForBackend(formData.taxRegDate),
                address1: formData.taxAddress1,
                address2: formData.taxAddress2,
                city: "",
                pinCode: formData.taxZipCode,
                email: formData.taxEmailID
            }],
            bankDetails: [{
                id: formData.bankId || null,
                accHolderName: formData.accountHolderName,
                accNumber: formData.accountNo,
                bankName: formData.bankName,
                branch: formData.branchName,
                bankAddress: formData.bankAddress
            }],
            additionalInfo: [{
                id: formData.additionalInfoId || null,
                identityTypeId: formData.additionalInfoType,
                regNo: formData.registrationNo
            }]
        };

        const data = new FormData();
        data.append("contractor", new Blob([JSON.stringify(contractorDTO)], { type: "application/json" }));

        if (formData.attachmentMetadata) {
            formData.attachmentMetadata.forEach(fileData => {
                if (fileData.fileObject) {
                    data.append("files", fileData.fileObject);
                }
            });
        }

        try {
            await axios.post(`${baseUrl}/addContractor`, data, {
                headers: { ...headers, "Content-Type": "multipart/form-data" }
            });
            sessionStorage.removeItem(STORAGE_KEY);
            toast.success("Contractor details submitted successfully!");
            navigate("/ContractorOnboarding");
        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Failed to submit contractor details.");
        }
        finally {
            setIsLoading(false);
        }
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
        setFormData({
            ...formData,
            attachmentMetadata: [...formData.attachmentMetadata, ...newMetadata]
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        for (let i = 0; i < tabs.length; i++) {
            if (!validateCurrentTab(tabs[i].id)) {
                setActiveTab(tabs[i].id);
                return;
            }
        }

        setViewMode('review');
        window.scrollTo(0, 0);
    };

    const handleGoBackToEntry = () => {
        setViewMode("entry");
        window.scrollTo(0, 0);
    };

    const isManualActive = selectedView === 'manual';
    const isEntryMode = viewMode === 'entry';
    const isReviewMode = viewMode === 'review';

    return (
        <div className="container-fluid mt-3 min-vh-100 p-4">
            <div className="w-100 bg-transparent" >
                <div className={`d-flex align-items-center py-3 ${isReviewMode ? "px-4" : "px-0"}`}>
                    <ArrowLeft size={20}
                        className="me-3"
                        onClick={handleGoBack}
                        style={{ cursor: "pointer", color: bluePrimary }} />
                    <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
                </div>
                <div className="text-start w-100">

                    {isEntryMode && (
                        <>
                            <div className="d-inline-flex mb-4"
                                style={{ borderRadius: "6px", border: `1px solid ${bluePrimary}`, }}>
                                <button
                                    className="btn fw-bold"
                                    onClick={() => setSelectedView("manual")}
                                    style={{
                                        backgroundColor: isManualActive ? bluePrimary : "white",
                                        color: isManualActive ? "white" : bluePrimary,
                                        border: "none",
                                        borderRadius: 0,
                                    }}
                                >
                                    <Pencil size={18} className="me-2" /> Manual Entry
                                </button>

                                <button
                                    className="btn fw-bold"
                                    onClick={() => setSelectedView("email")}
                                    style={{
                                        backgroundColor: !isManualActive ? bluePrimary : "white",
                                        color: !isManualActive ? "white" : bluePrimary,
                                        border: "none",
                                        borderRadius: 0,
                                    }}
                                >
                                    <Mail size={18} className="me-2" /> Email Invite
                                </button>
                            </div>

                            <form id="contractorForm" onSubmit={handleSubmit} className="w-100">

                                {isManualActive && (
                                    <ManualEntryForm
                                        formData={formData}
                                        setFormData={setFormData}
                                        handleFileChange={handleFileChange}
                                        effectiveDateRef={effectiveDateRef}
                                        taxRegDateRef={taxRegDateRef}
                                        handleRemoveFile={(id) =>
                                            setFormData({
                                                ...formData,
                                                attachmentMetadata: formData.attachmentMetadata.filter(
                                                    (m) => m.id !== id
                                                ),
                                            })
                                        }
                                        datePickerRef={datePickerRef}
                                        entityTypeOptions={entityTypeOptions}
                                        natureOfBusinessOptions={natureOfBusinessOptions}
                                        gradeOptions={gradeOptions}
                                        addressTypeOptions={addressTypeOptions}
                                        countryOptions={countryOptions}
                                        territoryTypeOptions={territoryTypeOptions}
                                        territoryOptions={territoryOptions}
                                        taxTypeOptions={taxTypeOptions}
                                        additionalInfoTypeOptions={additionalInfoTypeOptions}
                                        fetchNatureOfBusiness={fetchNatureOfBusiness}
                                        fetchAddressState={fetchAddressState}
                                        fetchAddressCity={fetchAddressCity}
                                        handleAddressChange={handleAddressChange}
                                        addAddress={addAddress}
                                        removeAddress={removeAddress}
                                        handleContactChange={handleContactChange}
                                        addContact={addContact}
                                        removeContact={removeContact}
                                        taxCountryOptions={taxCountryOptions}
                                        taxStateOptions={taxStateOptions}
                                        taxFilterCountry={taxFilterCountry}
                                        taxFilterState={taxFilterState}
                                        handleTaxCountryFilterChange={handleTaxCountryFilterChange}
                                        handleTaxStateFilterChange={handleTaxStateFilterChange}
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        tabs={tabs}
                                        handleTabClick={handleTabClick}
                                    />
                                )}

                                {!isManualActive && (
                                    <>
                                        <div
                                            className="mx-auto bg-white"
                                            style={{
                                                width: "100%",
                                                maxWidth: "100%",
                                                borderRadius: "10px",
                                                padding: "24px 32px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            <EmailInviteForm
                                                formData={formData}
                                                setFormData={setFormData}
                                                handleSendInvitation={handleSendInvitation}
                                                isLoading={isLoading}
                                            />
                                        </div>
                                    </>
                                )}
                            </form>
                            {isManualActive && (
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate("/ContractorOnboarding")}
                                        className="btn px-4 fw-bold"
                                        style={{ color: bluePrimary }}
                                    >
                                        Cancel
                                    </button>

                                    <div className="d-flex">
                                        {activeTab !== tabs[0].id && (
                                            <button
                                                type="button"
                                                onClick={handlePrevTab}
                                                className="btn px-4 fw-bold me-3"
                                                style={{ border: `1px solid ${bluePrimary}`, color: bluePrimary, backgroundColor: 'white' }}
                                            >
                                                Previous
                                            </button>
                                        )}
                                        
                                        {activeTab !== tabs[tabs.length - 1].id ? (
                                            <button
                                                type="button"
                                                onClick={handleNextTab}
                                                className="btn px-4 fw-bold"
                                                style={{ backgroundColor: bluePrimary, color: "white" }}
                                            >
                                                Next <ArrowRight size={20} className="ms-2" />
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                form="contractorForm"
                                                className="btn px-4 fw-bold"
                                                style={{ backgroundColor: bluePrimary, color: "white" }}
                                            >
                                                Review & Submit <ArrowRight size={20} className="ms-2" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                    {isReviewMode && (
                        <ReviewSummaryContent
                            formData={formData}
                            handleGoBackToEntry={handleGoBackToEntry}
                            handleSubmitFinal={handleSubmitFinal}
                            entityTypeOptions={entityTypeOptions}
                            natureOfBusinessOptions={natureOfBusinessOptions}
                            gradeOptions={gradeOptions}
                            addressTypeOptions={addressTypeOptions}
                            countryOptions={countryOptions}
                            addresscityOptions={addresscityOptions}
                            addressStateOptions={addressStateOptions}
                            territoryTypeOptions={territoryTypeOptions}
                            territoryOptions={territoryOptions}
                            taxTypeOptions={taxTypeOptions}
                            additionalInfoTypeOptions={additionalInfoTypeOptions}
                            isLoading={isLoading}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
export default ContractorOverview;