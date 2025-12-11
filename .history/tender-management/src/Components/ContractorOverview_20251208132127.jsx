import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Mail, UploadCloud, FileText, Building, PhoneCall, Receipt, Landmark, Info } from "lucide-react"; 
import { FaCalendarAlt } from 'react-icons/fa';
import Select from 'react-select';

const bluePrimary = '#005197';

// --- Subcomponents --- //
const EmailInviteForm = React.memo(({ formData, handleChange, handleSendInvitation }) => (
  <form onSubmit={handleSendInvitation} className="p-3">
    <div className="text-center p-4">
      <Mail size={30} className=" mb-3" style={{ color: bluePrimary }} />
      <h3 className="fs-5 fw-bold mb-2" style={{ color: bluePrimary }}>Invite Contractor via Email</h3>
      <p className="mb-4" style={{ color: '#6286A6' }}>
        Send a secure link to the contractor. They will be able to fill out their details, upload documents, and submit.
      </p>
    </div>

    <div className="row mb-4">
      <div className="col-md-6 mt-3 mb-4">
        <label className="projectform text-start d-block">Contractor Email ID <span style={{ color: 'red' }}>*</span></label>
        <input type="text" className="form-input w-100" placeholder="Enter Contractor Email ID"
          name="contractorEmailId" value={formData.contractorEmailId} onChange={handleChange} />
      </div>

      <div className="col-md-6 mt-3 mb-4">
        <label className="projectform text-start d-block">Contractor Name</label>
        <input type="text" className="form-input w-100" placeholder="Enter Contractor Name"
          name="contractorName" value={formData.contractorName} onChange={handleChange} />
      </div>
    </div>

    <div className="col-md-12 mt-3 mb-4">
      <label className="projectform text-start d-block">Message</label>
      <input type="text" className="form-input w-100" placeholder="Add a personalized message..."
        name="contractorMessage" value={formData.contractorMessage} onChange={handleChange} />
    </div>

    <div className="d-flex align-items-center p-3 rounded" style={{ backgroundColor: "#F3F8FF" }}>
      <Info size={18} className="me-2" style={{ color: "#2563EBCC" }} />
      <p className="mb-0 small" style={{ color: "#2563EBCC" }}>
        Invitation link will be sent to the contractor's email address.
        They'll receive a secure link to complete their onboarding process.
      </p>
    </div>

    <div className="d-flex justify-content-end pt-3">
      <button type="submit" className="btn d-flex align-items-center fw-bold px-4"
        style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px" }}>
        <Mail size={20} className="me-2" /> Send Invitation Link
      </button>
    </div>
  </form>
));

const ManualEntryForm = React.memo(({ formData, handleChange, handleSelectChange, handleFileChange, entityTypeOptions, natureOfBusinessOptions, gradeOptions }) => (
  <>
    <div className="p-3 mb-4 d-flex align-items-center justify-content-center" style={{
      backgroundColor: bluePrimary, width: "calc(100% + 3rem)",
      marginLeft: "-1.5rem", marginRight: "-1.5rem", borderRadius: "8px 8px 0 0"
    }}>
      <FileText size={20} className="me-2 text-white" />
      <h3 className="mb-0 fs-6 fw-bold text-white">Basic Information</h3>
    </div>

    <div className="row mb-3">
      <div className="col-md-6 mt-3 mb-4">
        <label className="projectform text-start d-block">Entity Code <span style={{ color: "red" }}>*</span></label>
        <input type="text" className="form-input w-100" placeholder="Enter Entity Code"
          name="entityCode" value={formData.entityCode} onChange={handleChange} />
      </div>

      <div className="col-md-6 mt-3 mb-4">
        <label className="projectform text-start d-block">Entity Name <span style={{ color: "red" }}>*</span></label>
        <input type="text" className="form-input w-100" placeholder="Enter Entity Name"
          name="entityName" value={formData.entityName} onChange={handleChange} />
      </div>
    </div>

    <div className="row mb-3">
      <div className="col-md-6 mb-3">
        <label htmlFor="effectiveDate" className="projectform-select text-start d-block">Effective Date<span style={{ color: "red" }}>*</span></label>
        <input type="text" className="form-control" id="effectiveDate" name="effectiveDate"
          value={formData.effectiveDate} onChange={handleChange} placeholder="mm/dd/yy" style={{ height: "40px" }} />
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="entityType" className="projectform-select text-start d-block">Entity Type <span style={{ color: "red" }}>*</span></label>
        <Select name="entityType" options={entityTypeOptions} onChange={handleSelectChange} classNamePrefix="select"
          value={entityTypeOptions.find(option => option.value === formData.entityType)} placeholder="Select entity type" />
      </div>
    </div>
  </>
));

// --- Main Component --- //
function ContractorOverview() {
  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  const [selectedView, setSelectedView] = useState('manual');
  const [formData, setFormData] = useState({
    entityCode: '', entityName: '', effectiveDate: '', entityType: '',
    natureOfBusiness: '', grade: '', attachment: null,
    phoneNo: '', emailID: '', addressType: '', address1: '', address2: '', country: '', addresscity: '', zipCode: '',
    contactName: '', contactPosition: '', contactPhoneNo: '', contactEmailID: '',
    taxType: '', territoryType: '', territory: '', taxRegNo: '', taxRegDate: '', taxAddress1: '', taxAddress2: '', taxCity: '', taxZipCode: '', taxEmailID: '',
    accountHolderName: '', accountNo: '', bankName: '', branchName: '', bankAddress: '',
    additionalInfoType: '', registrationNo: '',
    contractorEmailId: '', contractorName:'', contractorMessage:''
  });

  // Dummy options
  const entityTypeOptions = []; const natureOfBusinessOptions = []; const gradeOptions = [];

  const handleViewChange = (view) => setSelectedView(view);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setFormData(prev => ({ ...prev, [name]: selectedOption.value }));
  };

  const handleFileChange = (e) => setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));

  const handleSubmit = (e) => { e.preventDefault(); console.log("Form submitted", formData); };
  const handleSendInvitation = (e) => { e.preventDefault(); console.log("Invitation sent", formData); };
  const handleCancel = () => console.log("Form cancelled");

  return (
    <div className="container-fluid min-vh-100 p-0">
      <div className="d-flex align-items-center py-3 px-4 mb-4">
        <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
        <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
      </div>

      <div className="px-4 text-start">
        <div className="d-inline-flex mb-4">
          <button className="btn" onClick={() => handleViewChange('manual')} style={{ backgroundColor: selectedView === 'manual' ? bluePrimary : 'white', color: selectedView === 'manual' ? 'white' : bluePrimary }}>Manual Entry</button>
          <button className="btn" onClick={() => handleViewChange('email')} style={{ backgroundColor: selectedView === 'email' ? bluePrimary : 'white', color: selectedView === 'email' ? 'white' : bluePrimary }}>Email Invite</button>
        </div>

        <form onSubmit={handleSubmit}>
          {selectedView === 'manual' ?
            <ManualEntryForm formData={formData} handleChange={handleChange} handleSelectChange={handleSelectChange} handleFileChange={handleFileChange} entityTypeOptions={entityTypeOptions} natureOfBusinessOptions={natureOfBusinessOptions} gradeOptions={gradeOptions} /> :
            <EmailInviteForm formData={formData} handleChange={handleChange} handleSendInvitation={handleSendInvitation} />
          }

          {selectedView === 'manual' &&
            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-outline-secondary me-3" onClick={handleCancel}>Cancel</button>
              <button type="submit" className="btn" style={{ backgroundColor: bluePrimary, color: "white" }}>Submit</button>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

export default ContractorOverview;
