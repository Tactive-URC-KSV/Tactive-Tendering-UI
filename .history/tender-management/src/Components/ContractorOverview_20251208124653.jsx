import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt} from 'react-icons/fa';
import Select from 'react-select'; 

function ContractorOverview() {
    const navigate = useNavigate();
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);
    const [emailInviteData, setEmailInviteData] = useState({
        contractorEmailID: '',
        contractorName: '',
        message: ''
    });

    const handleEmailInviteChange = (e) => {
        const { name, value } = e.target;
        setEmailInviteData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendInvitation = (e) => {
        e.preventDefault();
        console.log("Invitation Sent:", emailInviteData);
    };
    const [formData, setFormData] = useState({
        entityCode: '',
        entityName: '',
        effectiveDate: '',
        entityType: '',
        natureOfBusiness: '',
        grade: '',
        attachment: null,
        phoneNo: '', 
        emailID: '', 
        addressType: '', 
        address1: '',
        address2: '', 
        country: '',
        addresscity: '',
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
        contractorEmailId: '',
        contractorName:'',
        contractorMessage:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData(prev => ({ ...prev, [name]: selectedOption.value }));
    };

    const handleFileChange = (e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    const handleSubmit = (e) => { e.preventDefault(); console.log("Manual Form Submitted:", formData); };
    const handleCancel = () => console.log("Form Cancelled");

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';
    const bluePrimary = '#005197';
    const buttonGroupStyle = { borderRadius: '6px', overflow: 'hidden', boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none' };
    const manualButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopRightRadius: isManualActive ? 0 : '6px', borderBottomRightRadius: isManualActive ? 0 : '6px', backgroundColor: isManualActive ? bluePrimary : 'white', color: isManualActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };
    const emailButtonStyle = { paddingLeft: '20px', paddingRight: '20px', borderTopLeftRadius: isEmailActive ? 0 : '6px', borderBottomLeftRadius: isEmailActive ? 0 : '6px', backgroundColor: isEmailActive ? bluePrimary : 'white', color: isEmailActive ? 'white' : bluePrimary, transition: 'all 0.3s', border: 'none', outline: 'none' };

    
    const entityTypeOptions = [
    ];

    const  natureOfBusinessOptions = [];

    const  gradeOptions = [];

    const  addressTypeOptions = [];

    const  countryOptions = [];

    const  addresscityOptions = [];

    const  contactPositionOptions = [];

    const  territoryTypeOptions = [];

    const  taxTypeOptions = [];

    const  territoryOptions = [];

    const  taxCityOptions = [];

    const  additionalInfoTypeOptions = [];

    const EmailInviteForm = () => (
        <form onSubmit={handleSendInvitation} className="p-3" >
            <div className="text-center p-4">
                <Mail size={30} className=" mb-3" style={{ color: '#005197' }} />
                <h3 className="fs-5 fw-bold mb-2" style={{ color: '#005197' }}>
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

    const ManualEntryForm = () => (
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
        {/* … all the rest of ManualEntryForm fields … */}
        </>
    );

    const AddressDetailsContent = () => (
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
            {/* … rest of AddressDetailsContent fields … */}
        </div>
    );

    // … similarly ContactDetailsContent, TaxDetailsContent, BankAccountsContent, AdditionalInfoContent …

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
                        {selectedView === 'manual' ? <ManualEntryForm /> : <EmailInviteForm />}
                    </div>
                    {selectedView === 'manual' && <AddressDetailsContent />}
                    {selectedView === 'manual' && <ContactDetailsContent />}
                    {selectedView === 'manual' && <TaxDetailsContent />}
                    {selectedView === 'manual' && <BankAccountsContent />}
                    {selectedView === 'manual' && <AdditionalInfoContent />}
                </form>

                {selectedView === 'manual' && (
                    <div className="d-flex justify-content-end mt-4">
                        <button type="button" className="btn btn-outline-secondary me-3 px-4 fw-bold" onClick={handleCancel} style={{ borderRadius: "6px" }}>Cancel</button>
                        <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Submit</button>
                    </div>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;
