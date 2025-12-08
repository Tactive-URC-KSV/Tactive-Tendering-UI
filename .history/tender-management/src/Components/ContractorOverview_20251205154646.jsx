import React, { useState } from "react";
// Since useNavigate is used, we assume this is part of a larger React Router application.
// For self-contained testing, if React Router is not available, these imports might cause errors, 
// but based on the provided code, they must be kept.
// We will mock useNavigate and other external dependencies for a runnable component.
// In a real environment, you'd need React Router installed.
// Assuming a safe environment, we keep the original dependencies.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ArrowLeft, Pencil, Mail, UploadCloud, Calendar, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 

// Mock useNavigate for standalone execution in this environment
const useNavigate = () => {
    return (delta) => console.log(`Navigating back by ${delta} steps (mocked).`);
};

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);

    const [formData, setFormData] = useState({
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: 'Contractor', 
        natureOfBusiness: '',
        grade: '',
        attachment: null,
        phoneNo: '', 
        emailID: '', 
        addressType: 'Office Address', 
        address1: '',
        address2: '',
        country: '',
        city: '',
        zipCode: '',
        contactName: '',
        contactPosition: '',
        contactPhoneNo: '', 
        contactEmailID: '',
        taxType: '',
        territoryType: '',
        territory: '',
        taxRegNo: '',
        taxRegDate: '',
        taxAddress1: '', 
        taxAddress2: '', 
        taxCity: '',
        taxZipCode: '',
        taxEmailID: '', 
        accountHolderName: '',
        accountNo: '',
        bankName: '',
        branchName: '',
        bankAddress: '',
        additionalInfoType: '',
        registrationNo: '',
        // New fields for Email Invite
        recipientEmail: '',
        customMessage: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    
    // Updated handleSubmit to handle both views
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        if (selectedView === 'manual') {
            console.log("Manual Form Submitted:", formData);
            // Implement API call for manual submission here
        } else if (selectedView === 'email') {
            console.log("Email Invite Sent:", {
                recipient: formData.recipientEmail,
                entity: formData.entityName,
                message: formData.customMessage
            });
            // Implement API call for sending invitation here
        }
    };
    
    const handleCancel = () => console.log("Form Cancelled");

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const bluePrimary = '#005197'; 

    // --- Styling Variables ---
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
    const headerContainerStyle = { 
        backgroundColor: bluePrimary, 
        width: "calc(100% + 3rem)", 
        marginLeft: "-1.5rem", 
        marginRight: "-1.5rem", 
        borderRadius: "8px 8px 0 0" 
    };

    // --- Sub-Components (Manual Entry) ---

    const ManualEntryForm = () => (
        <>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <FileText size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityCode" className="form-label text-secondary small">Entity Code</label>
                    <input type="text" className="form-control" id="entityCode" name="entityCode" value={formData.entityCode} onChange={handleChange} placeholder="Enter entity code" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityName" className="form-label text-secondary small">Entity Name</label>
                    <input type="text" className="form-control" id="entityName" name="entityName" value={formData.entityName} onChange={handleChange} placeholder="Enter entity name" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="effectiveDate" className="form-label text-secondary small">Effective Date</label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="effectiveDate" name="effectiveDate" value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                        <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><Calendar size={18} className="text-muted" /></span>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="entityType" className="form-label text-secondary small">Entity Type</label>
                    <select className="form-select" id="entityType" name="entityType" value={formData.entityType} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="Contractor">Contractor</option>
                        <option value="Vendor">Vendor</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="natureOfBusiness" className="form-label text-secondary small">Nature of business</label>
                    <select className="form-select" id="natureOfBusiness" name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select business type</option>
                        <option value="IT">IT Services</option>
                        <option value="Construction">Construction</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="grade" className="form-label text-secondary small">Grade</label>
                    <select className="form-select" id="grade" name="grade" value={formData.grade} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select grade</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </select>
                </div>
            </div>
            <h4 className="fs-6 fw-bold mb-3">Attachment (Certificates/Licenses)</h4>
            <div className="border border-dashed p-4 text-center rounded" style={{ backgroundColor: "#f9f9f9", cursor: "pointer" }}>
                <input type="file" id="fileUpload" name="attachment" onChange={handleFileChange} className="d-none" />
                <label htmlFor="fileUpload" className="d-block cursor-pointer">
                    <UploadCloud size={30} className="text-muted mb-2" />
                    <p className="mb-1 fw-bold text-muted">Click to upload or drag and drop</p>
                    <p className="mb-0 small text-muted">PDF, DOCX up to 10MB</p>
                </label>
            </div>
        </>
    );

    // --- Sub-Components (Address Details) ---
    const AddressDetailsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <Building size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Address Details</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="phoneNo" className="form-label text-secondary small">Phone No</label>
                    <input type="tel" className="form-control" id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Enter phone no" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="emailID" className="form-label text-secondary small">Email ID</label>
                    <input type="email" className="form-control" id="emailID" name="emailID" value={formData.emailID} onChange={handleChange} placeholder="Enter email id" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="addressType" className="form-label text-secondary small">Address Type</label>
                    <select className="form-select" id="addressType" name="addressType" value={formData.addressType} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="Office Address">Office Address</option>
                        <option value="Residential Address">Residential Address</option>
                        <option value="Site Address">Site Address</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address1" className="form-label text-secondary small">Address 1</label>
                    <textarea className="form-control" id="address1" name="address1" rows="3" value={formData.address1} onChange={handleChange} placeholder="Enter address 1"></textarea>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="address2" className="form-label text-secondary small">Address 2</label>
                    <textarea className="form-control" id="address2" name="address2" rows="3" value={formData.address2} onChange={handleChange} placeholder="Enter address 2"></textarea>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label text-secondary small">Country <span className="text-danger">*</span></label>
                    <select className="form-select" id="country" name="country" value={formData.country} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select Country</option>
                        <option value="USA">United States</option>
                        <option value="IND">India</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label text-secondary small">City <span className="text-danger">*</span></label>
                    <select className="form-select" id="city" name="city" value={formData.city} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select City</option>
                        <option value="NY">New York</option>
                        <option value="DEL">Delhi</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="zipCode" className="form-label text-secondary small">Zip/Postal Code</label>
                    <input type="text" className="form-control" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Enter Zip/Postal Code" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    // --- Sub-Components (Contact Details) ---
    const ContactDetailsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <PhoneCall size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Contact Details</h3>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactName" className="form-label text-secondary small">Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Enter contact name" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactPosition" className="form-label text-secondary small">Position <span className="text-danger">*</span></label>
                    <select className="form-select" id="contactPosition" name="contactPosition" value={formData.contactPosition} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select position</option>
                        <option value="Manager">Manager</option>
                        <option value="Director">Director</option>
                        <option value="Representative">Representative</option>
                    </select>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactPhoneNo" className="form-label text-secondary small">Phone No</label>
                    <input type="tel" className="form-control" id="contactPhoneNo" name="contactPhoneNo" value={formData.contactPhoneNo} onChange={handleChange} placeholder="Enter phone no" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="contactEmailID" className="form-label text-secondary small">Email ID</label>
                    <input type="email" className="form-control" id="contactEmailID" name="contactEmailID" value={formData.contactEmailID} onChange={handleChange} placeholder="Enter email id" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    // --- Sub-Components (Tax Details) ---
    const TaxDetailsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <Receipt size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Tax Details</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxType" className="form-label text-secondary small">Tax Type <span className="text-danger">*</span></label>
                    <select className="form-select" id="taxType" name="taxType" value={formData.taxType} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select tax type</option>
                        <option value="VAT">VAT</option>
                        <option value="GST">GST</option>
                        <option value="Sales Tax">Sales Tax</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="territoryType" className="form-label text-secondary small">Territory Type <span className="text-danger">*</span></label>
                    <select className="form-select" id="territoryType" name="territoryType" value={formData.territoryType} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select territory type</option>
                        <option value="Country">Country</option>
                        <option value="State">State</option>
                    </select>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="territory" className="form-label text-secondary small">Territory <span className="text-danger">*</span></label>
                    <select className="form-select" id="territory" name="territory" value={formData.territory} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select territory</option>
                        <option value="US">USA</option>
                        <option value="IN">India</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxRegNo" className="form-label text-secondary small">Tax Reg. No <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="taxRegNo" name="taxRegNo" value={formData.taxRegNo} onChange={handleChange} placeholder="Enter tax registration no" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxRegDate" className="form-label text-secondary small">Tax Reg. Date <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <input type="text" className="form-control" id="taxRegDate" name="taxRegDate" value={formData.taxRegDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
                        <span className="input-group-text bg-white" style={{ borderLeft: "none", height: "40px" }}><Calendar size={18} className="text-muted" /></span>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxAddress1" className="form-label text-secondary small">Address 1</label>
                    <textarea className="form-control" id="taxAddress1" name="taxAddress1" rows="3" value={formData.taxAddress1} onChange={handleChange} placeholder="Enter address 1"></textarea>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxAddress2" className="form-label text-secondary small">Address 2</label>
                    <textarea className="form-control" id="taxAddress2" name="taxAddress2" rows="3" value={formData.taxAddress2} onChange={handleChange} placeholder="Enter address 2"></textarea>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxCity" className="form-label text-secondary small">City <span className="text-danger">*</span></label>
                    <select className="form-select" id="taxCity" name="taxCity" value={formData.taxCity} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select City</option>
                        <option value="NY">New York</option>
                        <option value="DEL">Delhi</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxZipCode" className="form-label text-secondary small">Zip/Postal Code</label>
                    <input type="text" className="form-control" id="taxZipCode" name="taxZipCode" value={formData.taxZipCode} onChange={handleChange} placeholder="Enter Zip/Postal Code" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="taxEmailID" className="form-label text-secondary small">Email ID</label>
                    <input type="email" className="form-control" id="taxEmailID" name="taxEmailID" value={formData.taxEmailID} onChange={handleChange} placeholder="Enter email id" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    // --- Sub-Components (Bank Accounts) ---
    const BankAccountsContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <Landmark size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Bank Accounts</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="accountHolderName" className="form-label text-secondary small">Account Holder Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="accountHolderName" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} placeholder="Enter account holder name" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="accountNo" className="form-label text-secondary small">Account No <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="accountNo" name="accountNo" value={formData.accountNo} onChange={handleChange} placeholder="Enter account no" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="bankName" className="form-label text-secondary small">Bank Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="bankName" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Enter bank name" style={{ height: "40px" }} />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="branchName" className="form-label text-secondary small">Branch Name <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="branchName" name="branchName" value={formData.branchName} onChange={handleChange} placeholder="Enter branch name" style={{ height: "40px" }} />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12 mb-3">
                    <label htmlFor="bankAddress" className="form-label text-secondary small">Bank Address</label>
                    <textarea className="form-control" id="bankAddress" name="bankAddress" rows="3" value={formData.bankAddress} onChange={handleChange} placeholder="Enter bank address"></textarea>
                </div>
            </div>
        </div>
    );

    // --- Sub-Components (Additional Info) ---
    const AdditionalInfoContent = () => (
        <div className="card text-start border-0 shadow-sm mt-4" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <Info size={20} className="me-2 text-white" /> 
                <h3 className="mb-0 fs-6 fw-bold text-white">Additional Info</h3>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 mb-3">
                    <label htmlFor="additionalInfoType" className="form-label text-secondary small">Type <span className="text-danger">*</span></label>
                    <select className="form-select" id="additionalInfoType" name="additionalInfoType" value={formData.additionalInfoType} onChange={handleChange} style={{ height: "40px" }}>
                        <option value="">Select type</option>
                        <option value="License">License</option>
                        <option value="Permit">Permit</option>
                        <option value="Certification">Certification</option>
                    </select>
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="registrationNo" className="form-label text-secondary small">Registration No <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" id="registrationNo" name="registrationNo" value={formData.registrationNo} onChange={handleChange} placeholder="Enter registration no" style={{ height: "40px" }} />
                </div>
            </div>
        </div>
    );

    // --- New Sub-Component (Email Invite) ---
    const EmailInviteForm = () => (
        <>
            <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={headerContainerStyle}>
                <Mail size={20} className="me-2 text-white" />
                <h3 className="mb-0 fs-6 fw-bold text-white">Send Contractor Invitation</h3>
            </div>

            {/* Instruction Alert */}
            <div className="alert alert-info d-flex align-items-center mb-4 small rounded-lg p-3" role="alert" style={{ backgroundColor: '#e6f7ff', borderColor: '#b3e0ff', color: bluePrimary, borderLeft: `4px solid ${bluePrimary}` }}>
                <Info size={18} className="me-3 flex-shrink-0" />
                <div>
                    The contractor will receive an email containing a secure link to a form where they can fill out all necessary details (Basic, Address, Tax, Bank) themselves.
                </div>
            </div>

            {/* Recipient Email */}
            <div className="row mb-3">
                <div className="col-md-12 mb-3">
                    <label htmlFor="recipientEmail" className="form-label text-secondary small">Recipient Email Address <span className="text-danger">*</span></label>
                    <input
                        type="email"
                        className="form-control"
                        id="recipientEmail"
                        name="recipientEmail"
                        value={formData.recipientEmail}
                        onChange={handleChange}
                        placeholder="e.g., procurement@contractorname.com"
                        required
                        style={{ height: "40px" }}
                    />
                </div>
            </div>

            {/* Entity Name (for personalization) */}
            <div className="row mb-3">
                <div className="col-md-12 mb-3">
                    <label htmlFor="entityName" className="form-label text-secondary small">Contractor/Entity Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="entityName"
                        name="entityName"
                        value={formData.entityName}
                        onChange={handleChange}
                        placeholder="Optional: This name will be used in the email greeting"
                        style={{ height: "40px" }}
                    />
                </div>
            </div>
            
            {/* Optional Custom Message */}
            <div className="row mb-4">
                <div className="col-md-12 mb-3">
                    <label htmlFor="customMessage" className="form-label text-secondary small">Optional Custom Message</label>
                    <textarea
                        className="form-control"
                        id="customMessage"
                        name="customMessage"
                        rows="4"
                        value={formData.customMessage}
                        onChange={handleChange}
                        placeholder="Add a personalized note to the recipient here (e.g., 'Please complete this form by Friday.')."
                    ></textarea>
                </div>
            </div>
        </>
    );
    

    // --- Main Component Render ---
    return (
        <div className="container-fluid min-vh-100 p-0" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Header / Back Button */}
            <div className="d-flex align-items-center py-3 px-4 mb-4 border-bottom shadow-sm" style={{ backgroundColor: 'white' }}>
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor Onboarding</h2>
            </div>

            <div className="px-4 text-start">
                {/* View Selector Toggle */}
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('manual')} style={manualButtonStyle}>
                        <Pencil size={20} className="me-2" /> Manual Entry
                    </button>
                    <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('email')} style={emailButtonStyle}>
                        <Mail size={20} className="me-2" /> Email Invite
                    </button>
                </div>
                
                <form id="contractorForm" onSubmit={handleSubmit}>
                    {/* Main Content Card (Manual or Email) */}
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: "0 1.5rem 1.5rem 1.5rem" }}>
                        {selectedView === 'manual' ? <ManualEntryForm /> : <EmailInviteForm />}
                    </div>

                    {/* Additional Sections (Only visible for Manual Entry) */}
                    {selectedView === 'manual' && <AddressDetailsContent />}
                    {selectedView === 'manual' && <ContactDetailsContent />}
                    {selectedView === 'manual' && <TaxDetailsContent />}
                    {selectedView === 'manual' && <BankAccountsContent />}
                    {selectedView === 'manual' && <AdditionalInfoContent />}
                </form>

                {/* Action Buttons (Dynamically changes text) */}
                <div className="d-flex justify-content-end mt-4 pb-5">
                    <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold shadow-sm" onClick={handleCancel} style={{ borderRadius: "6px" }}>Cancel</button>
                    <button 
                        type="submit" 
                        form="contractorForm" 
                        className="btn px-4 fw-bold shadow-sm" 
                        style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}
                    >
                        {selectedView === 'manual' ? 'Submit' : 'Send Invitation'}
                    </button>
                </div>
            </div>
            {/* Spacer for bottom margin */}
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;