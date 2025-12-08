Here is the complete and corrected `ContractorOverview` component code:

```javascript
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// UPDATED: Added Building icon for the new Address Details header
import { ArrowLeft, Pencil, Mail, UploadCloud, Calendar, FileText, Building } from "lucide-react"; 

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => {
        setSelectedView(view);
    };

    // UPDATED STATE: Includes all Basic and Address fields
    const [formData, setFormData] = useState({
        // Basic Info Fields (Existing)
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: 'Contractor', 
        natureOfBusiness: '',
        grade: '',
        attachment: null,
        
        // --- ADDRESS FIELDS (New) ---
        phoneNo: '',
        emailID: '',
        addressType: 'Office Address', 
        address1: '',
        address2: '',
        country: '',
        city: '',
        zipCode: ''
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
        // This logs the complete object including all fields from both sections
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
    
    // --- Component 1: Basic Information and Attachment (First Card Content) ---
    const ManualEntryForm = () => (
        // The form tag is here to allow the external submit button to work by ID
        <form id="contractorForm" onSubmit={handleSubmit}> 
            {/* Basic Information Section Header */}
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
                <FileText size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
            </div>

            {/* Basic Information Fields (Existing) */}
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityCode" className="form-label text-secondary small">Entity Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="entityCode"
                        name="entityCode"
                        value={formData.entityCode}
                        onChange={handleChange}
                        placeholder="Enter entity code"
                        style={{ height: "40px" }}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityName" className="form-label text-secondary small">Entity Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="entityName"
                        name="entityName"
                        value={formData.entityName}
                        onChange={handleChange}
                        placeholder="Enter entity name"
                        style={{ height: "40px" }}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveDate" className="form-label text-secondary small">Effective Date</label>
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
                        <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}>
                            <Calendar size={18} className="text-muted" />
                        </span>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityType" className="form-label text-secondary small">Entity Type</label>
                    <select
                        className="form-select"
                        id="entityType"
                        name="entityType"
                        value={formData.entityType}
                        onChange={handleChange}
                        style={{ height: "40px" }}
                    >
                        <option value="Contractor">Contractor</option>
                        <option value="Vendor">Vendor</option>
                    </select>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="natureOfBusiness" className="form-label text-secondary small">Nature of business</label>
                    <select
                        className="form-select"
                        id="natureOfBusiness"
                        name="natureOfBusiness"
                        value={formData.natureOfBusiness}
                        onChange={handleChange}
                        style={{ height: "40px" }}
                    >
                        <option value="">Select business type</option>
                        <option value="IT">IT Services</option>
                        <option value="Construction">Construction</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="grade" className="form-label text-secondary small">Grade</label>
                    <select
                        className="form-select"
                        id="grade"
                        name="grade"
                        value={formData.grade}
                        onChange={handleChange}
                        style={{ height: "40px" }}
                    >
                        <option value="">Select grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                </div>
            </div>
            
            {/* Attachment Section (Existing) */}
            <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>

            <div className="border border-dashed p-4 text-center rounded" style={{ backgroundColor: "#f9f9f9", cursor: "pointer" }}>
                <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                <label htmlFor="fileUpload" className="d-block cursor-pointer">
                    <UploadCloud size={30} className="text-muted mb-2" />
                    <p className="mb-1 fw-bold text-muted">Click to upload or drag and drop</p>
                    <p className="mb-0 small text-muted">PDF, DOCX up to 10MB</p>
                </label>
            </div>
        </form>
    );

    // --- Component 2: Address Details Content (Second Card Content) ---
    const AddressDetailsContent = () => (
        <div 
            className="card text-start border-0 shadow-sm mt-4" // mt-4 creates space below the first card
            style={{
                borderRadius: "8px",
                padding: "0 1.5rem 1.5rem 1.5rem"   
            }}
        >
            {/* Address Details Header */}
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
                <Building size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
            </div>

            {/* Address Details Fields */}
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="phoneNo" className="form-label text-secondary small">Phone No</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phoneNo"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        placeholder="Enter phone no"
                        style={{ height: "40px" }}
                    />
                </div>
                
                <div className="col-md-6 mb-3">
                    <label htmlFor="emailID" className="form-label text-secondary small">Email ID</label>
                    <input
                        type="email"
                        className="form-control"
                        id="emailID"
                        name="emailID"
                        value={formData.emailID}
                        onChange={handleChange}
                        placeholder="Enter email id"
                        style={{ height: "40px" }}
                    />
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="addressType" className="form-label text-secondary small">Address Type</label>
                    <select
                        className="form-select"
                        id="addressType"
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleChange}
                        style={{ height: "40px" }}
                    >
                        <option value="Office Address">Office Address</option>
                        <option value="Residential Address">Residential Address</option>
                        <option value="Site Address">Site Address</option>
                    </select>
                </div>
                
                <div className="col-md-6 mb-3">
                    <label htmlFor="address1" className="form-label text-secondary small">Address 1</label>
                    <textarea
                        className="form-control"
                        id="address1"
                        name="address1"
                        rows="3"
                        value={formData.address1}
                        onChange={handleChange}
                        placeholder="Enter address 1"
                    ></textarea>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="address2" className="form-label text-secondary small">Address 2</label>
                    <textarea
                        className="form-control"
                        id="address2"
                        name="address2"
                        rows="3"
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder="Enter address 2"
                    ></textarea>
                </div>
                
                <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label text-secondary small">Country <span className="text-danger">*</span></label>
                    <select
                        className="form-select"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        style={{ height: "40px" }}
                    >
                        <option value="">Select Country</option>
                        <option value="USA">United States</option>
                        <option value="IND">India</option>
                    </select>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label text-secondary small">City <span className="text-danger">*</span></label>
                    <select
                        className="form-select"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        style={{ height: "40px" }}
                    >
                        <option value="">Select City</option>
                        <option value="NY">New York</option>
                        <option value="DEL">Delhi</option>
                    </select>
                </div>
                
                <div className="col-md-6 mb-3">
                    <label htmlFor="zipCode" className="form-label text-secondary small">Zip/Postal Code</label>
                    <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Enter Zip/Postal Code"
                        style={{ height: "40px" }}
                    />
                </div>
            </div>
        </div>
    );


    // --- Main Component Return Block ---
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
                
                {/* --- FIRST CARD: Basic Info & Attachment --- */}
                <div
                    className="card text-start border-0 shadow-sm"
                    style={{
                        borderRadius: "8px",
                        padding: "0 1.5rem 1.5rem 1.5rem"   
                    }}
                >
                    {selectedView === 'manual' ? (
                        <ManualEntryForm />
                    ) : (
                        <div>
                            <h4 className="text-primary">Email Invite View Active</h4>
                            <p>Content for sending an email invite goes here.</p>
                        </div>
                    )}
                </div>

                {/* --- SECOND CARD: Address Details (Separated) --- */}
                {selectedView === 'manual' && <AddressDetailsContent />}


                {/* --- Buttons outside cards --- */}
                {selectedView === 'manual' && (
                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="button"
                            className="btn btn-outline-secondary me-3 px-4 fw-bold"
                            onClick={handleCancel}
                            style={{ borderRadius: "6px" }}
                        >
                            Cancel
                        </button>

                        {/* Submit button uses form="contractorForm" to trigger the handleSubmit in the ManualEntryForm */}
                        <button
                            type="submit"
                            form="contractorForm"
                            className="btn px-4 fw-bold"
                            style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContractorOverview;