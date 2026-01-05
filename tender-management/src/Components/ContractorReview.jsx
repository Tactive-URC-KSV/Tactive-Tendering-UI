import { ArrowLeft, CheckCircle, ChevronDown, Info, Home, User, FileText, CreditCard, AlertCircle, Briefcase, File } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

const ReviewSection = ({ icon: Icon, title, id, isOpen, toggleSection, children }) => {
  return (
    <div 
      className={`accordion-item mb-4 border rounded-3 ${isOpen ? 'shadow-sm' : ''}`}
      style={{ 
        backgroundColor: isOpen ? '#fff' : '#F9FAFB',
        transition: 'all 0.2s ease-in-out',
        border: '1px solid #eee'
      }}
    >
      <div
        className="accordion-header d-flex justify-content-between align-items-center px-4 py-3 rounded-3"
        style={{ cursor: "pointer", backgroundColor: 'transparent' }}
        onClick={() => toggleSection(id)}
      >
        <h6 className="mb-0 fw-bold d-flex align-items-center text-dark">
          <Icon size={18} className="me-2 text-dark" />
          {title}
        </h6>
        <ChevronDown
          size={18}
          className="text-dark"
          style={{ transition: "0.3s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>

      {isOpen && (
        <div className="accordion-body px-4 py-4 border-top">
          {children}
        </div>
      )}
    </div>
  );
};

const DetailGridItem = ({ label, value }) => (
  <div className="col-md-4 mb-4">
    <small className="text-muted d-block mb-2" style={{ fontSize: '0.85rem' }}>{label}</small>
    <h6 className="fw-bold text-dark mb-0 text-break" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{value || "N/A"}</h6>
  </div>
);

function ContractorReviewMinimal() {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({});
  const [contractors, setContractors] = useState([]);
  const [selectedContractorId, setSelectedContractorId] = useState(null);
  const [contractorDetails, setContractorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const response = await axios.get(`${baseUrl}/invitedContractor`, { headers });
      const data = response.data.data || response.data || [];
      setContractors(data);
      if (data.length > 0 && !selectedContractorId) {
        setSelectedContractorId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching contractors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedContractorId) return;

    const fetchContractorDetails = async () => {
      setDetailsLoading(true);
      setContractorDetails(null);
      try {
        const response = await axios.get(`${baseUrl}/contractor/${selectedContractorId}`, { headers });
        setContractorDetails(response.data); 
      } catch (error) {
        console.error("Error fetching contractor details:", error);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchContractorDetails();
    setOpenSections({ "basic-info": true });
  }, [selectedContractorId]);

  const toggleSection = (id) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVerification = async (status) => {
    if (!selectedContractorId) return;

    try {
        await axios.put(
            `${baseUrl}/contractor/verify/${selectedContractorId}`,
            null,
            {
                params: { contractorStatus: status },
                headers: headers
            }
        );
        
        await fetchContractors();
        
        if (contractorDetails && contractorDetails.contractor) {
            setContractorDetails(prev => ({
                ...prev,
                contractor: {
                    ...prev.contractor,
                    status: status
                }
            }));
        }

    } catch (error) {
        console.error("Error verifying contractor:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusBadgeClass = (status) => {
    const statusStr = String(status || "").toUpperCase();
    if (statusStr.includes("PENDING")) return "bg-warning text-dark opacity-75";
    if (statusStr.includes("VERIFIED")) return "bg-success text-white opacity-75";
    if (statusStr.includes("REJECTED")) return "bg-danger text-white opacity-75";
    return "bg-primary text-white opacity-75";
  };

  const getNatureStr = (natures) => {
    if (!natures || natures.length === 0) return "N/A";
    return natures.map(n => n.nature).join(", ");
  };

  const getFileName = (path) => {
    return path.split('/').pop();
  };

  return (
    <div className="container-fluid min-vh-100 p-2 py-4 mt-4 bg-light">
      <div className="mb-4">
        <div className="d-flex align-items-center ps-4">
          <ArrowLeft size={22} onClick={() => navigate(-1)}
            className="me-3"
            style={{ cursor: "pointer" }}
          />
          <h4 className="mb-0 fw-bold ms-2 text-dark">Review Submissions</h4>
        </div>
        <div className="text-start ms-5 ps-4">
          <p className="mb-0 text-muted fs-6">Manage and verify new contractor submissions...</p>
        </div>
      </div>
      <div className="container-fluid">
        <div className="row g-4 m-0">
          <div className="col-lg-4 ps-4">
            <div className="card border-0 shadow-sm p-4 h-100 text-start bg-white">
              <div className="mb-4 pb-3">
                <h5 className="fw-bold mb-2 d-flex align-items-center text-dark">
                  <CheckCircle size={20} className="me-2 text-success" />
                  Submissions
                </h5>
                <p className="text-muted mb-3 small"> Review pending applications... </p>
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
                      className={`border rounded-3 p-3 mb-3 ${selectedContractorId === c.id
                          ? "bg-white border-primary shadow-sm"
                          : "bg-white border-light"
                        }`}
                      style={{ cursor: "pointer", borderLeft: selectedContractorId === c.id ? '4px solid #0d6efd' : '1px solid #dee2e6' }}
                      onClick={() => setSelectedContractorId(c.id)}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0 text-dark">{c.name || c.entityName}</h6>
                        <span
                          className={`badge rounded-pill ${getStatusBadgeClass(c.contractorStatus || c.status)}`}
                          style={{ fontSize: '0.65rem', fontWeight: 600 }}
                        >
                          {c.contractorStatus || c.status || "Invited"}
                        </span>
                      </div>
                      <small className="text-muted d-block mb-1">{c.email}</small>
                      <small className="text-muted">Invited On: {formatDate(c.invitedOn || c.createdDate)}</small>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-8 pe-4">
            <div
              className="card border-0 shadow-sm p-5 text-start bg-white"
              style={{ minHeight: '80vh', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto', msOverflowStyle: 'none', scrollbarWidth: 'none', }}
            >
              {detailsLoading ? (
                 <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                 </div>
              ) : contractorDetails && contractorDetails.contractor ? (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h3 className="fw-bold text-dark mb-0">{contractorDetails.contractor.entityName || "Unknown Entity"}</h3>
                    <span className={`badge ${getStatusBadgeClass(contractorDetails.contractor.status)} fs-6`}>
                        {contractorDetails.contractor.status}
                    </span>
                  </div>
                  
                  <p className="text-muted mb-4 border-bottom pb-4">
                    Submitted for verification. Please review the details below...
                  </p>
                  
                  <ReviewSection icon={Info} title="Basic Information" id="basic-info" isOpen={openSections['basic-info']} toggleSection={toggleSection}>
                    <div className="row g-4">
                        <DetailGridItem label="Entity Code" value={contractorDetails.contractor.entityCode} />
                        <DetailGridItem label="Entity Name" value={contractorDetails.contractor.entityName} />
                        <DetailGridItem label="Effective Date" value={formatDate(contractorDetails.contractor.effectiveDate)} />
                        
                        <DetailGridItem label="Entity Type" value={contractorDetails.contractor.contractorType?.type} />
                        <DetailGridItem label="Nature of Business" value={getNatureStr(contractorDetails.contractor.contractorNature)} />
                        <DetailGridItem label="Grade" value={contractorDetails.contractor.contractorGrade?.gradeName} />
                    </div>
                    
                    {contractorDetails.contractor.attachmentUrls && contractorDetails.contractor.attachmentUrls.length > 0 && (
                        <div className="mt-4 pt-3 border-top">
                            <small className="text-muted d-block mb-3">Attachments (Certificates/Licenses)</small>
                            <div className="d-flex flex-wrap gap-3">
                                {contractorDetails.contractor.attachmentUrls.map((url, index) => (
                                    <div key={index} className="d-flex align-items-center bg-light px-3 py-3 rounded border w-100">
                                        <File size={16} className="text-danger me-2" />
                                        <span className="text-dark small fw-medium">{getFileName(url)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                  </ReviewSection>
                  <ReviewSection icon={Home} title="Address Details" id="address-details" isOpen={openSections['address-details']} toggleSection={toggleSection}>
                     <div className="row g-4">
                        <DetailGridItem label="Address Type" value={contractorDetails.contractorAddress?.addressType?.addressType} />
                        <DetailGridItem label="Address Line 1" value={contractorDetails.contractorAddress?.address1} />
                        <DetailGridItem label="City" value={contractorDetails.contractorAddress?.city} />
                        <DetailGridItem label="Zip Code" value={contractorDetails.contractorAddress?.zipCode} />
                        <DetailGridItem label="Country" value={contractorDetails.contractorAddress?.country} />
                    </div>
                  </ReviewSection>
                  <ReviewSection icon={User} title="Contact Person" id="contact-details" isOpen={openSections['contact-details']} toggleSection={toggleSection}>
                    <div className="row g-4">
                        <DetailGridItem label="Contact Name" value={contractorDetails.contractorContacts?.name} />
                        <DetailGridItem label="Designation" value={contractorDetails.contractorContacts?.designation} />
                        <DetailGridItem label="Email Address" value={contractorDetails.contractorContacts?.email} />
                        <DetailGridItem label="Phone Number" value={contractorDetails.contractorContacts?.phoneNumber} />
                    </div>
                  </ReviewSection>
                  <ReviewSection icon={FileText} title="Tax Details" id="tax-details" isOpen={openSections['tax-details']} toggleSection={toggleSection}>
                     <div className="row g-4">
                        <DetailGridItem label="Tax Type" value={contractorDetails.contractorTaxDetails?.taxType?.taxType} />
                        <DetailGridItem label="Registration No" value={contractorDetails.contractorTaxDetails?.taxRegNumber} />
                        <DetailGridItem label="Registration Date" value={formatDate(contractorDetails.contractorTaxDetails?.taxRegDate)} />
                        <DetailGridItem label="Territory" value={contractorDetails.contractorTaxDetails?.territory} />
                    </div>
                  </ReviewSection>
                  <ReviewSection icon={CreditCard} title="Bank Accounts" id="bank-accounts" isOpen={openSections['bank-accounts']} toggleSection={toggleSection}>
                     <div className="row g-4">
                        <DetailGridItem label="Bank Name" value={contractorDetails.contractorBankDetails?.bankName} />
                        <DetailGridItem label="Account Holder" value={contractorDetails.contractorBankDetails?.accHolderName} />
                        <DetailGridItem label="Account Number" value={contractorDetails.contractorBankDetails?.accNumber} />
                        <DetailGridItem label="Branch" value={contractorDetails.contractorBankDetails?.branch} />
                        <DetailGridItem label="Bank Address" value={contractorDetails.contractorBankDetails?.bankAddress} />
                    </div>
                  </ReviewSection>
                  <ReviewSection icon={AlertCircle} title="Additional Info" id="additional-info" isOpen={openSections['additional-info']} toggleSection={toggleSection}>
                     <div className="row g-4">
                        <DetailGridItem label="Identity Type" value={contractorDetails.contractorAddInfo?.identityType?.idType} />
                        <DetailGridItem label="Identity Reg No" value={contractorDetails.contractorAddInfo?.regNo} />
                    </div>
                  </ReviewSection>
                 {(contractorDetails.contractor.status === 'PENDING' || contractorDetails.contractor.status === 'REJECTED') && (
                    <div className="d-flex justify-content-end mt-3 pt-3 border-top">
                        <button 
                            className="btn btn-outline-danger px-4 me-3 fw-medium"
                            onClick={() => handleVerification('REJECTED')}
                        >
                        Reject
                        </button>
                        <button 
                            className="btn d-flex align-items-center px-4 fw-medium text-white" 
                            style={{background: '#0DB27B' }}
                            onClick={() => handleVerification('VERIFIED')}
                        > 
                        <Briefcase size={18} className="me-2" />
                        Verify & Add Contractor
                        </button>
                    </div>
                  )}
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