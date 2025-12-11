import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 
import Flatpickr from "react-flatpickr";

const bluePrimary = '#005197';

const entityTypeOptions = [];
const natureOfBusinessOptions = [];
const gradeOptions = [];
const addressTypeOptions = [];
const countryOptions = [];
const addresscityOptions = [];
const contactPositionOptions = [];
const territoryTypeOptions = [];
const taxTypeOptions = [];
const territoryOptions = [];
const taxCityOptions = [];
const additionalInfoTypeOptions = [];

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

const ManualEntryForm = ({ formData, setFormData, handleChange, handleSelectChange, handleFileChange }) => (
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
                <h4 className="fs-6 fw-bold mb-3" style={{ color: bluePrimary }}>Attachment (Certificates/Licenses)</h4>
            
                <div 
                    className="p-4 text-center rounded" 
                    style={{ 
                        cursor: "pointer", 
                        border: `2px dashed ${bluePrimary}B2`, 
                        borderRadius: '8px' 
                    }}
                >
                    <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                    
                    <label htmlFor="fileUpload" className="d-block cursor-pointer">
                        <UploadCloud size={30} className="mb-2" style={{ color: bluePrimary }} /> 
                        <p className="mb-1 fw-bold" style={{ color: bluePrimary }}>Click to upload or drag and drop</p>
                        <p className="mb-0 small" style={{ color: bluePrimary }}>PDF, DOCX up to 10MB</p>
                    </label>
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

        ...

