import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, Calendar, FileText } from "lucide-react";

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    const [formData, setFormData] = useState({
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: 'Contractor',
        natureOfBusiness: '',
        grade: '',
        attachment: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
    };

    const handleCancel = () => {
        console.log("Form Cancelled");
    };

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';

    const manualBtnClass = 'btn d-flex align-items-center fw-bold';
    const emailBtnClass = 'btn d-flex align-items-center fw-bold';

    const bluePrimary = '#005197';

    const buttonGroupStyle = {
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none',
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
        outline: 'none',
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
        outline: 'none',
    };

    // ----------------------------
    // Manual Entry Form
    // ----------------------------
    const ManualEntryForm = () => (
        <form onSubmit={handleSubmit}>
            
            {/* FULL-WIDTH BLUE HEADER */}
            <div 
                className="w-100 p-3 mb-4 d-flex align-items-center"
                style={{ 
                    backgroundColor: bluePrimary,
                    marginLeft: '-1.5rem',
                    marginRight: '-1.5rem',
                    borderRadius: '8px 8px 0 0'
                }}
            >
                <FileText size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
            </div>

            {/* Row 1 */}
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary small">Entity Code</label>
                    <input
                        type="text"
                        className="form-control"
                        name="entityCode"
                        value={formData.entityCode}
                        onChange={handleChange}
                        placeholder="Enter entity code"
                        style={{ height: '40px' }}
                    />
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary small">Entity Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="entityName"
                        value={formData.entityName}
                        onChange={handleChange}
                        placeholder="Enter entity name"
                        style={{ height: '40px' }}
                    />
                </div>
            </div>

            {/* Row 2 */}
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary small">Effective Date</label>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            name="effectiveDate"
                            value={formData.effectiveDate}
                            onChange={handleChange}
                            placeholder="mm/dd/yy"
                            style={{ height: '40px' }}
                        />
                        <span className="input-group-text bg-white" style={{ borderLeft: 'none', height: '40px' }}>
                            <Calendar size={18} className="text-muted" />
                        </span>
                    </div>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary small">Entity Type</label>
                    <select
                        className="form-select"
                        name="entityType"
                        value={formData.entityType}
                        onChange={handleChange}
                        style={{ height: '40px' }}
                    >
                        <option value="Contractor">Contractor</option>
                        <option value="Supplier">Supplier</option>
                        <option value="Vendor">Vendor</option>
                    </select>
                </div>
            </div>

            {/* Row 3 */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary small">Nature of business</label>
                    <select
                        className="form-select"
                        name="natureOfBusiness"
                        value={formData.natureOfBusiness}
                        onChange={handleChange}
                        style={{ height: '40px' }}
                    >
                        <option value="">Select Nature of business</option>
                        <option value="IT">IT Services</option>
                        <option value="Construction">Construction</option>
                        <option value="Consulting">Consulting</option>
                    </select>
                </div>

                <div className="col-md-6 mb-3">
                    <label className="form-label text-secondary small">Grade</label>
                    <select
                        className="form-select"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        style={{ height: '40px' }}
                    >
                        <option value="A">A Grade</option>
                        <option value="B">B Grade</option>
                        <option value="C">C Grade</option>
                    </select>
                </div>
            </div>

            {/* Attachment */}
            <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>

            <div className="border border-dashed p-4 text-center rounded" style={{ backgroundColor: '#f9f9f9', cursor: 'pointer' }}>
                <input type="file" id="fileUpload" className="d-none" onChange={handleFileChange} />
                <label htmlFor="fileUpload" className="d-block cursor-pointer">
                    <UploadCloud size={30} className="text-muted mb-2" />
                    <p className="mb-1 fw-bold text-muted">Click to upload or drag and drop</p>
                    <p className="mb-0 small text-muted">PDF, DOCX up to 10MB</p>
                </label>
            </div>

            {/* Buttons */}
            <div className="d-flex justify-content-end pt-4 mt-5">
                <button
                    type="button"
                    className="btn btn-outline-secondary me-3 px-4 fw-bold"
                    onClick={handleCancel}
                    style={{ borderRadius: '6px' }}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="btn px-4 fw-bold"
                    style={{ backgroundColor: bluePrimary, color: 'white', borderRadius: '6px', borderColor: bluePrimary }}
                >
                    Submit
                </button>
            </div>
        </form>
    );


    // ----------------------------
    // MAIN RETURN
    // ----------------------------
    return (
        <div className="container-fluid min-vh-100 p-0">

            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft
                    size={24}
                    className="me-3"
                    onClick={handleGoBack}
                    style={{ cursor: 'pointer', color: bluePrimary }}
                />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>

            <div className="px-4 text-start">

                {/* Switch */}
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    <button
                        className={manualBtnClass}
                        onClick={() => handleViewChange('manual')}
                        style={manualButtonStyle}
                    >
                        <Pencil size={20} className="me-2" />
                        Manual Entry
                    </button>

                    <button
                        className={emailBtnClass}
                        onClick={() => handleViewChange('email')}
                        style={emailButtonStyle}
                    >
                        <Mail size={20} className="me-2" />
                        Email Invite
                    </button>
                </div>

                {/* Card */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '8px' }}>
                    <div className="p-4">
                        {selectedView === 'manual' ? (
                            <ManualEntryForm />
                        ) : (
                            <div>
                                <h4 className="text-primary">Email Invite View Active</h4>
                                <p>Content for sending an email invite goes here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default ContractorOverview;
