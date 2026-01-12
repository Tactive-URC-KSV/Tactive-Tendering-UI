import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, Plus, Paperclip, Users, Edit3, Package, Folder, FolderOpen, 
  ChevronRight, ChevronDown, ChevronLeft, Eye, Building2, Download, FileText 
} from "lucide-react";
import { FaInfoCircle } from "react-icons/fa";

function TenderDetails() {
  const [activeTab, setActiveTab] = useState("General Details");
  const [selectedTenderId, setSelectedTenderId] = useState('');
  const [tenderList, setTenderList] = useState([]);
  const tabs = ["General Details", "Package Details", "Contractor Details", "Attachments"];
  const [projectCode, setProjectCode] = useState("");
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState("");
  const [expandedNodes, setExpandedNodes] = useState({});
  const [attachmentData, setAttachmentData] = useState(null);

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

  const fetchAttachments = async (tenderId) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderAttachments/${tenderId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (res.status === 200) {
        setAttachmentData(res.data);
      } else {
        setAttachmentData(null);
      }
    } catch (err) {
      console.log(err);
      setAttachmentData(null);
    }
  }

  useEffect(() => {
    if (selectedTenderId) {
      fetchAttachments(selectedTenderId);
    }
  }, [selectedTenderId]);

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

  const toggleNode = (id) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const NavigationButtons = () => (
    <div className="d-flex justify-content-between mt-5 pt-3 border-top">
      <button
        onClick={handlePrev}
        className="btn btn-link text-decoration-none d-flex align-items-center fw-medium"
        style={{ color: '#005197', visibility: activeTab === tabs[0] ? 'hidden' : 'visible' }}
        disabled={activeTab === tabs[0]}
      >
        <ChevronLeft size={20} className="me-1" /> Previous
      </button>
      <button
        onClick={handleNext}
        className="btn btn-link text-decoration-none d-flex align-items-center fw-medium"
        style={{ color: '#005197', visibility: activeTab === tabs[tabs.length - 1] ? 'hidden' : 'visible' }}
        disabled={activeTab === tabs[tabs.length - 1]}
      >
        Next <ChevronRight size={20} className="ms-1" />
      </button>
    </div>
  );

  const buildBoqTree = (boqItems) => {
    if (!boqItems) return [];
    const tree = [];
    const map = {};

    const getOrCreateNode = (data, isLeaf = false) => {
      if (!map[data.id]) {
        map[data.id] = { ...data, children: [], isLeaf };
      }
      return map[data.id];
    };

    boqItems.forEach(item => {
      const leafNode = getOrCreateNode(item, true);
      let currentLevel = leafNode;
      let parentData = item.parentBOQ;

      while (parentData) {
        const parentNode = getOrCreateNode(parentData, false);
        if (!parentNode.children.find(c => c.id === currentLevel.id)) {
          parentNode.children.push(currentLevel);
        }
        currentLevel = parentNode;
        parentData = parentData.parentBOQ;
      }

      if (!tree.find(n => n.id === currentLevel.id)) {
        tree.push(currentLevel);
      }
    });

    return tree;
  };

  const renderBoqTree = (nodes, level = 0) => {
    return nodes.map(node => {
      if (node.isLeaf) return null;

      const hasLeafChildren = node.children.some(c => c.isLeaf);
      const isExpanded = expandedNodes[node.id];

      return (
        <div key={node.id} className="mb-3" style={{fontSize:"14px"}}>
          <div 
            className="d-flex align-items-center mb-2" 
            style={{ cursor: 'pointer', paddingLeft: level === 0 ? '0' : `${level * 20}px` }}
            onClick={() => toggleNode(node.id)}
          >
            <span className="me-2 text-muted">
               {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
            {isExpanded ? (
              <FolderOpen size={20} className="text-primary me-2" fill="#005197" style={{ fillOpacity: 0.1 }} />
            ) : (
              <Folder size={20} className="text-primary me-2" fill="#005197" style={{ fillOpacity: 0.1 }} />
            )}
            
            <span className="text-dark fw-medium">{node.boqName}</span>
          </div>
          
          {level === 0 && (
             <p className="text-muted text-start mb-2" style={{ fontSize: '12px', paddingLeft: '28px' }}>
                BOQ Code: {node.boqCode || 'N/A'}
             </p>
          )}

          {isExpanded && (
            <div className="" style={{ paddingLeft: level === 0 ? '0' : `${level * 20}px` }}>
              {hasLeafChildren ? (
                <div className="table-responsive bg-white rounded">
                  <table className="table table-borderless align-middle mb-0">
                    <thead>
                      <tr style={{ color: '#005197' }}>
                        <th className="fw-medium pb-3 ps-4">BOQ Code</th>
                        <th className="fw-medium pb-3">BOQ Name</th>
                        <th className="fw-medium pb-3">Unit</th>
                        <th className="fw-medium pb-3">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {node.children.map(child => (
                        <tr key={child.id} className="border-bottom border-light">
                          <td className="py-3 text-dark ps-4">{child.boqCode}</td>
                          <td className="py-3 text-dark">{child.boqName}</td>
                          <td className="py-3 text-dark">{child.uom?.uomCode || '-'}</td>
                          <td className="py-3 text-dark">{child.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                renderBoqTree(node.children, level + 1)
              )}
            </div>
          )}
        </div>
      );
    });
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return "Unknown File";
    try {
        return url.substring(url.lastIndexOf('/') + 1);
    } catch (e) {
        return url;
    }
  };

  const transformFiles = (urls) => {
    if (!urls || !Array.isArray(urls)) return [];
    return urls.map(url => ({
        name: getFileNameFromUrl(url),
        size: "-", 
        url: url,
        type: url.split('.').pop()
    }));
  };

  const attachmentCategories = [
    { 
        name: "Technical Specifications", 
        files: transformFiles(attachmentData?.technicalTermsUrl) 
    },
    { 
        name: "Drawings", 
        files: transformFiles(attachmentData?.drawingUrl) 
    },
    { 
        name: "Commercial Conditions", 
        files: transformFiles(attachmentData?.commercialTermsUrl) 
    },
    { 
        name: "Others", 
        files: transformFiles(attachmentData?.otherUrl) 
    }
  ];

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
            <div className="d-flex gap-2">
              <button className="btn text-white d-flex align-items-center gap-2" style={{ backgroundColor: "#005197" }}>
                <Eye size={16} /> View Offers
              </button>
              <button className="btn text-white d-flex align-items-center gap-2" style={{ backgroundColor: "#005197" }} >
                <Edit3 size={16} /> Edit Tender
              </button>
            </div>
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
                {selectedTenderData ? (
                  <>
                    {activeTab === "General Details" && (
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
                            <p className="text-muted text-start mb-2" style={{ fontSize: '0.85rem' }}>
                              Scope of Packages
                            </p>
                            <div className="d-flex flex-wrap gap-2">
                              {selectedTenderData.scopeOfPackages && selectedTenderData.scopeOfPackages.length > 0 ? (
                                selectedTenderData.scopeOfPackages.map((item, index) => (
                                  <span
                                    key={item.id || index}
                                    className="px-3 py-2 rounded-pill fw-medium"
                                    style={{
                                      backgroundColor: "#e0f2fe",
                                      color: "#0284c7",
                                      fontSize: "0.9rem",
                                      border: "1px solid #bae6fd"
                                    }}
                                  >
                                    {item.scope}
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
                              {formatDate(selectedTenderData.preBiddingDate)}
                            </div>
                          </div>
                          <div className="col-12 mb-4">
                            <p className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>Site Inspection Date</p>
                            <div className="border-bottom pb-2">
                              {formatDate(selectedTenderData.siteInvestigationDate)}
                            </div>
                          </div>
                        </div>
                        
                        <NavigationButtons />
                      </div>
                    )}

                    {activeTab === "Package Details" && (
                      <div className="p-4">
                        <div className="d-flex align-items-center mb-4">
                          <Package size={22} color="#9333ea" />
                          <h6 className="mb-0 ms-2 fw-bold text-dark">Package Details</h6>
                        </div>

                        {selectedTenderData.boq && selectedTenderData.boq.length > 0 ? (
                          <div className="border-0 rounded">
                            {renderBoqTree(buildBoqTree(selectedTenderData.boq))}
                          </div>
                        ) : (
                          <div className="text-center p-5 text-muted">No Package Details Available</div>
                        )}
                        
                        <NavigationButtons />
                      </div>
                    )}

                    {activeTab === "Contractor Details" && (
                      <div className="p-4">
                         <div className="d-flex align-items-center mb-4">
                          <Users size={22} color="#f97316" />
                          <h6 className="mb-0 ms-2 fw-bold text-dark">Contractor Details</h6>
                        </div>
                        
                        {selectedTenderData.contractor && selectedTenderData.contractor.length > 0 ? (
                            <div className="d-flex flex-column gap-3">
                                {selectedTenderData.contractor.map((cont, idx) => (
                                    <div key={idx} className="border rounded p-3 bg-white d-flex align-items-center" style={{ borderColor: '#e5e7eb' }}>
                                        <div className="rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#eff6ff', minWidth:'48px', minHeight:'48px' }}>
                                            <Building2 size={24} color="#2563eb" />
                                        </div>
                                        <div>
                                            <h6 className="mb-1 fw-bold text-dark text-start">{cont.entityName}</h6>
                                            <div className="d-flex align-items-center text-muted small">
                                                <span className="me-2">{cont.contactName || cont.entityCode}</span>
                                                <span className="me-2">•</span>
                                                <span>{cont.email || 'No email provided'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-5 text-muted">No Contractors Found</div>
                        )}
                        
                         <NavigationButtons />
                      </div>
                    )}

                    {activeTab === "Attachments" && (
                      <div className="p-4">
                         <div className="d-flex align-items-center mb-4">
                          <Paperclip size={22} color="#005197" />
                          <h6 className="mb-0 ms-2 fw-bold text-dark">Attachments</h6>
                        </div>
                        
                        <div className="d-flex flex-column gap-4">
                           {attachmentCategories.map((category, index) => (
                                <div key={index}>
                                    <h6 className="fw-bold mb-3 text-start" style={{fontSize: '15px'}}>{category.name}</h6>
                                    {category.files.length > 0 ? (
                                        <div className="d-flex flex-column gap-2">
                                            {category.files.map((file, fIdx) => (
                                                <div key={fIdx} className="p-3 bg-white border rounded d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <FileText size={24} className="text-danger me-3" />
                                                        <div className="text-start">
                                                            <p className="mb-0 fw-medium text-dark" style={{fontSize: '14px'}}>{file.name}</p>
                                                            <small className="text-muted">{file.size}</small>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <button 
                                                            className="btn btn-light btn-sm d-flex align-items-center justify-content-center" 
                                                            style={{color: '#005197', width: '32px', height: '32px'}}
                                                            title="View"
                                                            onClick={() => window.open(file.url, '_blank')}
                                                        >
                                                            <Eye size={16}/>
                                                        </button>
                                                        <button 
                                                            className="btn btn-light btn-sm d-flex align-items-center justify-content-center" 
                                                            style={{color: '#005197', width: '32px', height: '32px'}}
                                                            title="Download"
                                                            onClick={() => window.open(file.url, '_blank')}
                                                        >
                                                            <Download size={16}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-light border rounded text-muted text-center small fst-italic">
                                            No files uploaded for {category.name}
                                        </div>
                                    )}
                                </div>
                           ))}
                        </div>

                         <NavigationButtons />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-3 py-3 pe-0 ps-1 h-100 overflow-hidden">
              <div className="bg-white border rounded-3 h-100 p-3 overflow-auto">
                <h6 className="fw-bold mb-3 p">Edit History</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TenderDetails;