import {ArrowLeft, CheckCircle, ChevronDown, Info, Home, User, FileText, CreditCard, AlertCircle, Briefcase,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const submissionsData = [
  { id: 1, name: "Mike Johnson", email: "mike.j@contractor.com", date: "08-12-2025", status: "Pending Review" },
  { id: 2, name: "David Chen", email: "david.c@contractor.com", date: "11-12-2025", status: "Pending Review" },
  { id: 3, name: "Grace Hall", email: "grace.h@contractor.com", date: "14-12-2025", status: "Pending Review" },
  { id: 4, name: "Jane Smith", email: "jane.smith@contractor.com", date: "08-12-2025", status: "Invited" },
  { id: 5, name: "Carlos Roy", email: "carlos.roy@contractor.com", date: "09-12-2025", status: "Invited" },
  { id: 6, name: "Anna Lee", email: "anna.lee@contractor.com", date: "10-12-2025", status: "Invited" },
  { id: 7, name: "Emily White", email: "emily.w@contractor.com", date: "12-12-2025", status: "Invited" },
  { id: 8, name: "Frank Green", email: "frank.g@contractor.com", date: "13-12-2025", status: "Invited" },
];


const ReviewSection = ({ icon: Icon, title, id, isOpen, toggleSection }) => {
  const renderContent = () => {
    return (
      <p className="text-muted mb-0">
        {title} details will be displayed here for review. This container is currently empty.
      </p>
    );
  };

  return (
    <div className="card mb-3 border">
      <div
        className="card-header bg-white d-flex justify-content-between align-items-center p-3"
        onClick={() => toggleSection(id)}
        style={{ cursor: "pointer" }}>
        <h6 className="mb-0 fw-bold d-flex align-items-center text-dark">
          <Icon size={18} className="me-3 text-secondary" />
          {title}
        </h6>
        <ChevronDown size={20} className="text-secondary"
          style={{transition: "0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",}}
        />
      </div>

      {isOpen && (
        <div className="card-body bg-light p-4">
          {renderContent()}
        </div>
      )}
    </div>
  );
};
function ContractorReviewMinimal() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({}); 
  const [selectedContractorId, setSelectedContractorId] = useState(1);
  const selectedContractor = submissionsData.find(
    (c) => c.id === selectedContractorId
  );
  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-100 py-4">
      <div className="mb-4 px-5"> 
        <div className="d-flex align-items-center">
          <ArrowLeft size={22} onClick={() => navigate(-1)}
            className="me-3"
            style={{ cursor: "pointer" }}
          />
          <h4 className="mb-0 fw-bold text-dark">Review Submissions</h4>
        </div>
        <div className="text-start mt-1 ms-5">
            <p className="mb-0 text-secondary fs-6">Manage and verify new contractor submissions... </p>
        </div>
      </div>
      <div className="row g-4 m-0 px-5"> 
        <div className="col-lg-4">
          <div className="card shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-2 d-flex align-items-center">
              <CheckCircle size={18} className="me-2 text-success" />
              Submissions
            </h5>

            <p className="text-secondary mb-3"> Review pending applications... </p>
            <div 
              style={{
                maxHeight: 'calc(100vh - 250px)', 
                overflowY: 'auto',
                msOverflowStyle: 'none',     
                scrollbarWidth: 'none',      
              }}
            >
              {submissionsData.map((c) => (
               <div key={c.id} 
                 className={`border rounded p-3 mb-2 text-start${
                   selectedContractorId === c.id
                     ? "bg-light border-primary"
                     : "bg-white border-light"
                 }`}
                 style={{ cursor: "pointer" }}
                 onClick={() => setSelectedContractorId(c.id)}
               >
                 <div className="d-flex justify-content-between">
                   <h6 className="fw-bold mb-1 text-dark">{c.name}</h6>
                   <span
                     className={`badge rounded-pill ${
                       c.status === "Pending Review"
                         ? "bg-warning text-dark"
                         : "bg-info text-dark"
                     }`}
                     style={{ fontSize: '0.75rem', fontWeight: 500 }}
                   >
                     {c.status}
                   </span>
                 </div>
                 <small className="text-muted d-block text-start">{c.email}</small>
                 <small className="text-muted d-block text-start">Invited On: {c.date}</small>
               </div>
             ))}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div 
            className="card shadow-sm p-4"
            style={{
                maxHeight: 'calc(100vh - 120px)', 
                overflowY: 'auto',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
            }}
          >
            <h4 className="fw-bold text-dark">{selectedContractor.name}</h4>
            <p className="text-muted mb-4">
              Submitted for verification. Please review the details below...
            </p>
            <ReviewSection icon={Info} title="Basic Information" id="basic-info" isOpen={openSections['basic-info']} toggleSection={toggleSection} />
            <ReviewSection icon={Home} title="Address Details" id="address-details" isOpen={openSections['address-details']} toggleSection={toggleSection} />
            <ReviewSection icon={User} title="Contact Details" id="contact-details" isOpen={openSections['contact-details']} toggleSection={toggleSection} />
            <ReviewSection icon={FileText} title="Tax Details" id="tax-details" isOpen={openSections['tax-details']} toggleSection={toggleSection} />
            <ReviewSection icon={CreditCard} title="Bank Accounts" id="bank-accounts" isOpen={openSections['bank-accounts']} toggleSection={toggleSection} />
            <ReviewSection icon={AlertCircle} title="Additional Info" id="additional-info" isOpen={openSections['additional-info']} toggleSection={toggleSection} />
            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <button className="btn btn-outline-danger me-3">
                Reject
              </button>
              <button className="btn btn-success d-flex align-items-center">
                <Briefcase size={18} className="me-2" />
                Verify & Add Contractor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractorReviewMinimal;