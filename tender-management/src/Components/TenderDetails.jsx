import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, Paperclip, Users, Edit3, User } from "lucide-react";

function TenderDetails() {
  const [activeTab, setActiveTab] = useState("General Details");
  const [selectedTenderId, setSelectedTenderId] = useState("TF - 2025 - 001");

  const tabs = ["General Details", "Package Details", "Contractor Details", "Attachments"];

  const tenderList = [
    { id: "TF - 2025 - 001", floatedBy: "You", lastDate: "2025-11-30", users: "+2" },
    { id: "TF - 2025 - 002", floatedBy: "Naveen", lastDate: "2025-11-30", users: "+2" },
    { id: "TF - 2025 - 003", floatedBy: "Hari's", lastDate: "2025-11-30", users: "+1" },
  ];
const [projectCode, setProjectCode] = useState("");
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBoqUploadedProject`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (res.status === 200) {
          const project = res.data.find(p => String(p.projectId) === String(projectId));
         if (project) {
  setProjectName(project.projectName);
  setProjectCode(project.projectCode); 
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
                    <span className="fw-bold small" style={{ color: isActive ? "#005197" : "#334155" }}>
                      {tender.id}
                    </span>
                    <Paperclip size={12} className="text-muted" />
                  </div>
                  <p className="text-muted small mb-1">Floated By : {tender.floatedBy}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">Last Date : {tender.lastDate}</small>
                   <span className={`badge border fw-semibold d-flex align-items-center gap-1 ${isActive ? "bg-white" : "bg-transparent"}`}
                  style={{ color: "#005197", borderColor: "#00519752" }}>
                      <Users size={12} /> {tender.users}
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
              <h4 className="fw-bold mb-1" style={{ color: "#005197" }}>{selectedTenderId}</h4>
              <small className="text-muted">
                Awarded to <span className="fw-bold text-primary">Build Tech Solutions</span>
              </small>
            </div>
            <button className="btn  text-white d-flex align-items-center gap-2 "style={{ backgroundColor: "#005197" }} >
              <Edit3 size={16} /> Edit Tender
            </button>
          </div>

          <div className="row g-0 flex-grow-1 align-items-stretch overflow-hidden">
            <div className="col-md-9 p-3 d-flex flex-column h-100">
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

              <div className="bg-white border rounded-3 flex-grow-1 mt-2 d-flex align-items-center justify-content-center" >
                <div className="p-4 text-center">
                  <h3 className="fw-bold text-muted" style={{ opacity: 0.6 }}>{activeTab}</h3>
                </div>
              </div>
            </div>

            <div className="col-md-3 p-3 pe-0 h-100 overflow-hidden">
              <div className="bg-white border rounded-3 h-100 p-3 overflow-auto">
                <h6 className="fw-bold mb-3 small">Edit History</h6>

                <div className="mb-4">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-primary p-2">
                      <User size={14} className="text-white" />
                    </div>
                    <div className="d-flex flex-column text-start">
                      <span className="fw-bold text-secondary-emphasis " style={{ fontSize: "12px",lineHeight: "1.2" }}>Jane Doe</span>
                      <span className="text-muted" style={{ fontSize: "10px" }}>Dec 3, 2025, 11:45 AM</span>
                    </div>
                  </div>
                  <div className="border rounded-2 p-2 text-center bg-light-subtle" style={{fontSize: "11px" }}>
                    Changed <span className="fw-semibold text-warning">Submission Last Date</span> from Nov 25 to Nov 30
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex align-items-start gap-2 mb-2">
                    <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-primary" style={{ width: 28, height: 28, marginTop: "2px" }}>
                      <User size={14} className="text-white" />
                    </div>
                    <div className="d-flex flex-column text-start">
                      <span className="fw-bold text-secondary-emphasis" style={{ fontSize: "12px", lineHeight: "1.2" }}>Giri</span>
                      <span className="text-muted" style={{ fontSize: "10px" }}>Dec 3, 2025, 11:45 AM</span>
                    </div>
                  </div>
                  <div className="border rounded-2 p-2 text-center bg-light-subtle" style={{ fontSize: "11px" }}>
                    Changed <span className="fw-semibold text-warning">Submission Last Date</span> from Nov 25 to Nov 30
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenderDetails;
