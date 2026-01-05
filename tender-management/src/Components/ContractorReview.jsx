import { ArrowLeft, CheckCircle, ChevronDown, Info, Home, User, FileText, CreditCard, AlertCircle, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

const ReviewSection = ({ icon: Icon, title, id, isOpen, toggleSection }) => {
  return (
    <div className="accordion-item mb-3 border-0 rounded-3 bg-light">
      <div
        className="accordion-header d-flex justify-content-between align-items-center px-4 py-3 bg-light rounded-3"
        style={{ cursor: "pointer" }}
        onClick={() => toggleSection(id)}
      >
        <h6 className="mb-0 fw-semibold d-flex align-items-center">
          <Icon size={18} className="me-3 text-secondary" />
          {title}
        </h6>
        <ChevronDown
          size={18}
          className="text-secondary"
          style={{ transition: "0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {isOpen && (
        <div className="accordion-body bg-white px-4 py-3 ">
          <p className="text-muted mb-0">
            {title} details will be displayed here for review. This container is currently empty.
          </p>
        </div>
      )}
    </div>
  );
};

function ContractorReviewMinimal() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [contractors, setContractors] = useState([]);
  const [selectedContractorId, setSelectedContractorId] = useState(null);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get(`${baseUrl}/invitedContractor`, { headers });
        const data = response.data.data || response.data || [];
        setContractors(data);
        if (data.length > 0) {
          setSelectedContractorId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching contractors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContractors();
  }, []);

  const selectedContractor = contractors.find(
    (c) => c.id === selectedContractorId
  );

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusBadgeClass = (status) => {
    const statusStr = String(status || "").toUpperCase();
    if (statusStr.includes("PENDING")) return "bg-warning text-dark";
    return "bg-info text-dark";
  };

  return (
    <div className="container-fluid min-vh-100 p-2 py-4 mt-4">
      <div className="mb-4">
        <div className="d-flex align-items-center ps-4">
          <ArrowLeft size={22} onClick={() => navigate(-1)}
            className="me-3"
            style={{ cursor: "pointer" }}
          />
          <h5 className="mb-0 fw-bold ms-2 text-dark">Review Submissions</h5>
        </div>
        <div className="text-start ms-5 ps-4">
          <p className="mb-0 text-secondary fs-6">Manage and verify new contractor submissions... </p>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row g-4 m-0">
          <div className="col-lg-4 ps-4">
            <div className="card shadow-sm p-4 h-100 text-start">
              <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}>
                <h5 className="fw-bold mb-2 d-flex align-items-center">
                  <CheckCircle size={18} className="me-2 text-success" />
                  Submissions
                </h5>
                <p className="text-secondary mb-3"> Review pending applications... </p>
              </div>
              <div
                style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', }}
              >
                {loading ? (
                  <p className="text-center text-muted">Loading...</p>
                ) : contractors.length === 0 ? (
                  <p className="text-center text-muted">No submissions found.</p>
                ) : (
                  contractors.map((c) => (
                    <div key={c.id}
                      className={`border rounded p-3 mb-2 ${selectedContractorId === c.id
                          ? "bg-light border-primary"
                          : "bg-white border-light"
                        }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedContractorId(c.id)}
                    >
                      <div className="d-flex justify-content-between">
                        <h6 className="fw-bold mb-1 text-dark">{c.name}</h6>
                        <span
                          className={`badge rounded-pill ${getStatusBadgeClass(c.contractorStatus)}`}
                          style={{ fontSize: '0.75rem', fontWeight: 500 }}
                        >
                          {c.contractorStatus}
                        </span>
                      </div>
                      <small className="text-muted d-block">{c.email}</small>
                      <small className="text-muted">Invited On: {formatDate(c.invitedOn)}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-8 pe-4">
            <div
              className="card shadow-sm p-4 text-start"
              style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', }}
            >
              {selectedContractor ? (
                <>
                  <div className="mb-4 pb-3" style={{ borderBottom: '1px solid #f0f0f0' }}></div>
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

                  <div className="d-flex justify-content-end mt-4 pt-3 ">
                    <button className="btn btn-outline-danger me-3">
                      Reject
                    </button>
                    <button className="btn btn-success d-flex align-items-center">
                      <Briefcase size={18} className="me-2" />
                      Verify & Add Contractor
                    </button>
                  </div>
                </>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <p className="text-muted">Select a contractor to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractorReviewMinimal;