import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Paperclip, Users, Edit3, Info, InfoIcon, CircleCheck } from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";

function TenderDetails() {
  const [activeTab, setActiveTab] = useState("General Details");
  const [selectedTenderId, setSelectedTenderId] = useState('');
  const [tenderList, setTenderList] = useState([]);
  const tabs = ["General Details", "Package Details", "Contractor Details", "Attachments"];
  const [projectCode, setProjectCode] = useState("");
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (res.status === 200) {
          const project = res.data;
          if (project) {
            setProjectName(project.projectName);
            setProjectCode(project.projectCode);
            fetchTender(projectId);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (projectId) {
      fetchProjectName();
    }
  }, [projectId]);

  const fetchTender = async (projectId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tender/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if (res.status === 200) {
        setTenderList(res.data);
        if (res.data.length > 0) {
          setSelectedTenderId(res.data[0].id);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const selectedTenderData = tenderList.find(t => t.id === selectedTenderId);
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };
  const DetailItem = ({ label, value }) => (
    <div className="col-md-4 mb-4 text-start">
      <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{label}</p>
      <p className="text-dark fw-bold" style={{ fontSize: '14px' }}>{value || '-'}</p>
    </div>
  );

  return (
    <div className="container-fluid bg-light p-3 d-flex flex-column overflow-hidden" style={{ height: "130vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div className="d-flex align-items-center gap-3">
          <ArrowLeft
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => window.history.back()}
          />
          <h5 className="mb-0 fw-bold">
            Tender Details – {projectName} ({projectCode})
          </h5>
        </div>
        <button className="btn text-white fw-semibold d-flex align-items-center gap-2" style={{ backgroundColor: "#16a34a" }}>
          <Plus size={16} /> Float New Tender
        </button>
      </div>

      <div className="row g-0 flex-grow-1 align-items-stretch overflow-hidden h-100">
        <div className="col-md-3 bg-white border p-3 h-100 overflow-auto rounded-start-3 rounded-bottom-3" style={{ maxHeight: "115vh" }}>
          {tenderList.map((tender, i) => {
            const isActive = selectedTenderId === tender.id;
            return (
              <div
                key={i}
                onClick={() => setSelectedTenderId(tender.id)}
                className="card mb-3"
                style={{
                  cursor: "pointer",
                  backgroundColor: isActive ? "#EFF6FF" : "#FFFFFF",
                  borderLeft: isActive ? "4px solid #005197" : "1px solid #00519752",
                  borderTop: "1px solid #00519752",
                  borderRight: "1px solid #00519752",
                  borderBottom: "1px solid #00519752",
                  borderRadius: "8px",
                  boxShadow: "none"
                }}
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold p" style={{ color: isActive ? "#005197" : "#334155" }}>
                      {tender.tenderNumber}
                    </span>
                    <Paperclip size={12} className="text-muted" />
                  </div>
                  <p className="text-muted p mb-1 text-start">Floated By : {tender.floatedUser}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <p className="text-muted">Last Date : {formatDate(tender.lastDate)}</p>
                    <span className={`badge border fw-semibold d-flex align-items-center gap-1 ${isActive ? "bg-white" : "bg-transparent"}`}
                      style={{ color: "#005197", borderColor: "#00519752" }}>
                      <Users size={12} /> {tender.contractor ? tender.contractor.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="col-md-9 d-flex flex-column h-100 overflow-hidden">
          <div className="bg-white border rounded-end-3 p-4 d-flex justify-content-between align-items-start flex-shrink-0">
            <div>
              <h4 className="fw-bold mb-1" style={{ color: "#005197" }}>
                {selectedTenderData ? selectedTenderData.tenderNumber : ''}
              </h4>
              <div className="text-muted text-start">
                {selectedTenderData ? selectedTenderData.tenderName : ''}
              </div>
            </div>
            <button className="btn  text-white d-flex align-items-center gap-2 " style={{ backgroundColor: "#005197" }} >
              <Edit3 size={16} /> Edit Tender
            </button>
          </div>

          <div className="row g-0 flex-grow-1 align-items-stretch overflow-hidden">
            <div className="col-md-9 ps-3 py-3 pe-1 d-flex flex-column h-100">
              <ul className="nav nav-tabs mb-3 flex-shrink-0 border-bottom d-flex">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <li className="nav-item" key={tab}>
                      <button
                        className="nav-link"
                        onClick={() => setActiveTab(tab)}
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          color: isActive ? "#005197" : "#6c757d",
                          fontWeight: isActive ? "600" : "400",
                          borderBottom: isActive ? "3px solid #005197" : "3px solid transparent",
                          marginBottom: "-1px",
                          position: "relative",
                          zIndex: isActive ? 2 : 1,
                          borderRadius: 0,
                          boxShadow: "none",
                          padding: "10px 20px"
                        }}
                      >
                        {tab}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="bg-white border rounded-3 flex-grow-1 mt-2 overflow-auto" style={{ position: "relative" }}>
                {activeTab === "General Details" && selectedTenderData ? (
                  <div className="p-4">
                    <div className="mb-4 text-start">
                      <FaInfoCircle color="#2BA95A" size={20} /><span className="ms-2">General Details</span>
                    </div>
                    <div className="row">
                      <DetailItem label="Tender Number" value={selectedTenderData.tenderNumber} />
                      <DetailItem label="Tender Name" value={selectedTenderData.tenderName} />
                      <DetailItem label="Submission Mode" value={selectedTenderData.submissionMode} />
                      <DetailItem label="Bid Opening Date" value={formatDate(selectedTenderData.bidOpeningdate)} />
                      <DetailItem label="Last Date" value={formatDate(selectedTenderData.lastDate)} />
                      <DetailItem label="Contact Name" value={selectedTenderData.contactName} />
                      <DetailItem label="Contact Number" value={selectedTenderData.contactNumber} />
                      <DetailItem label="Contact Email" value={selectedTenderData.contactEmail} />
                      <div className="col-md-4 mb-4"></div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12 mb-4">
                        <p className="text-muted text-start mb-2"style={{ fontSize: '0.85rem' }}>
                          Scope of Packages
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                          {selectedTenderData.scopeDetails ? (
                            selectedTenderData.scopeDetails.split(',').map((item, index) => (
                              <span
                                key={index}
                                className="px-3 py-2 rounded-pill fw-medium"
                                style={{
                                  backgroundColor: "#e0f2fe",
                                  color: "#0284c7",
                                  fontSize: "0.9rem",
                                  border: "1px solid #bae6fd"
                                }}
                              >
                                {item.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small fst-italic">No scope details provided.</span>
                          )}
                        </div>
                      </div>
                      <div className="col-12 mb-4">
                        <p className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Pre-Bid Meeting Date</p>
                        <div className="border-bottom pb-2">
                          {formatDate(selectedTenderData.preBidMeetingDate)}
                        </div>
                      </div>

                      <div className="col-12 mb-4">
                        <p className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Site Inspection Date</p>
                        <div className="border-bottom pb-2">
                          {formatDate(selectedTenderData.siteInspectionDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <h3 className="fw-bold text-muted" style={{ opacity: 0.6 }}>{activeTab} Content</h3>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-3 py-3 pe-0 ps-1 h-100 overflow-hidden">
              <div className="bg-white border rounded-3 h-100 p-3 overflow-auto">
                <h6 className="fw-bold mb-3 p">Edit History</h6>
                {/* Edit history content would go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TenderDetails;