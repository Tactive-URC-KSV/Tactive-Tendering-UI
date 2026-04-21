import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, EditIcon, Trash2, IndianRupee, BadgeDollarSign, Table, Grid, EyeIcon, ChevronDown, ChevronRight, Eye, AlertTriangle, BookOpenText } from "lucide-react";
import ActivityCode from '../assest/ActivityCode.svg?react';
import ActivityView from "../assest/Activity.svg?react";
import Area from '../assest/Area.svg?react';
import Cost from '../assest/Cost.svg?react';
import TotalCost from '../assest/TotalCost.svg?react';
import { toast } from "react-toastify";

function TenderResource() {
  const { projectId, boqId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [estimatedResources, setEstimatedResources] = useState([]);
  const [boq, setBoq] = useState();
  const [boqName, setBoqName] = useState();
  const [viewType, setViewType] = useState('table');
  const [selectedBoqForModal, setSelectedBoqForModal] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const buildFormulaDisplay = (formulaElements) => {
    if (!formulaElements || !Array.isArray(formulaElements) || formulaElements.length === 0) return null;
    return formulaElements
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
      .map(el => {
        if (el.type === 'OPERATOR') return el.operator;
        if (el.type === 'NUMBER') return String(el.value ?? 0);
        const refLabel = el.boq?.boqCode || el.resource?.refCode || el.globalValue?.name || el.refCode || '';
        return `[${el.sourceType}] ${refLabel}`;
      })
      .join(' ');
  };
  
  const [searchParams] = useSearchParams();
  const isInternal = searchParams.get('isInternal') === 'true';
  const internalBoqId = searchParams.get('internalBoqId');

  
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes highlight-fade {
        0% { background-color: #fff3cd; }
        100% { background-color: transparent; }
      }
      .table-warning {
        animation: highlight-fade 4s ease-out forwards !important;
      }
      .tree-row-child {
        background-color: #f8f9fa;
      }
      .tree-row-child:hover {
        background-color: #f1f3f5 !important;
      }
      .activity-table tr {
        transition: background-color 0.3s;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const fetchBoqDetails = () => {
    if (boqId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/BOQ/${boqId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 200) {
          setBoq(res.data);
          const bName = res.data.boqName;
          setBoqName(bName && bName.length > 20 ? bName.substring(0, 20) + '...' : bName);
        }
      }).catch(err => {
        console.error("Error fetching BOQ details:", err);
      });
    }
  };

  useEffect(() => {
    if (projectId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 200) {
          setProject(res.data);
          if (!isInternal) {
            fetchBoqDetails();
          }
          fetchEstimatedResources();
        }
      })
    }
  }, [projectId, boqId, internalBoqId]);
  const fetchEstimatedResources = () => {
    if (isInternal) {
      // 1. Fetch Header Info
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/internal-boq/${internalBoqId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      }).then(res => {
        const internal = res.data;
        if (internal) {
          setBoq({
            id: internal.id || internalBoqId,
            boqCode: internal.resource?.resourceCode || "N/A",
            boqName: internal.resource?.resourceName || "N/A",
            uom: { uomCode: internal.uom?.uomCode || "N/A" },
            quantity: internal.totalQuantity || 0
          });
          setBoqName(internal.resource?.resourceName || "N/A");
        }
      });

      // 2. Fetch Breakup Resources (DTOs with internalBoqId)
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/internal-boq-resources/${internalBoqId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      }).then(res => {
        setEstimatedResources(res.data || []);
      });
    } else {
      // Normal BOQ Flow
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResources/${boqId}`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      }).then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.content || []);
        setEstimatedResources(data);
      });
    }
  };

  const handleAddResource = () => {
    navigate(`/add-resource/${boqId}/${projectId}?isInternal=${isInternal}${isInternal ? `&internalBoqId=${internalBoqId}` : ''}`);
  };

  const handleViewResource = (resourceId) => {
    navigate(`/add-resource/${boqId}/${projectId}/${resourceId}?isInternal=${isInternal}&viewMode=true${isInternal ? `&internalBoqId=${internalBoqId}` : ''}`);
  };

  const handleDeleteResource = (resourceId) => {
    setResourceToDelete(resourceId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      const targetBoqId = isInternal ? internalBoqId : boqId;
      axios.delete(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/deleteResourceFromBoq/${resourceToDelete}/${targetBoqId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 200) {
          toast.success("Resource deleted successfully");
          setShowDeleteModal(false);
          setResourceToDelete(null);
          fetchEstimatedResources();
        }
      }).catch(err => {
        console.error("Error deleting resource:", err);
        toast.error("Failed to delete resource");
        setShowDeleteModal(false);
      });
    }
  };

  if (isInternal && !internalBoqId) {
    console.error("Missing internalBoqId");
    return null;
  }

  return (
    <>
      <div className="container-fluid mt-4 p-4 min-vh-100">
        <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
          <div className="fw-bold text-start">
            <ArrowLeft size={20} onClick={() => {
              if (isInternal) {
                navigate(`/tender-resource/${projectId}/${boqId}`);
              } else {
                navigate(`/tenderestimation/${projectId}`);
              }
            }} style={{ cursor: 'pointer' }} />
            <span className="ms-2">BOQ Details</span>
          </div>
        </div>
        <div className="bg-white rounded-3 ms-3 me-3 p-4" style={{ border: '1px solid #0051973D' }}>
          <div className="text-start fw-bold ms-3 mb-2 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {project?.projectName}
            </div>
          </div>
          <div className="row g-2 mb-4 ms-3">
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">BOQ Code</span>
                  <ActivityCode />
                </div>
                <div className="fw-bold text-start mt-2">{boq?.boqCode}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">BOQ Name</span>
                  <ActivityView size={16} style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />
                </div>
                <div className="fw-bold text-start mt-2" title="Click to view full BOQ Name" onClick={() => setSelectedBoqForModal(boq)} style={{ cursor: 'pointer' }}>{boqName}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Unit of Measurement</span>
                  <Area />
                </div>
                <div className="fw-bold text-start mt-2">{boq?.uom?.uomCode}</div>
              </div>
            </div>
          </div>
          <div className="row g-2 ms-3">
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Quantity</span>
                  <TotalCost />
                </div>
                <div className="fw-bold text-start mt-2">{boq?.quantity?.toFixed(3) || '0.000'}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Rate</span>
                  <Cost />
                </div>
                <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {boq?.totalRate?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Amount</span>
                  <BadgeDollarSign color="#005197" />
                </div>
                <div className="fw-bold text-start mt-2"><IndianRupee size={16} /> {boq?.totalAmount?.toFixed(2) || '0.00'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-start d-flex justify-content-between align-items-center pb-3 mt-5 ms-3 me-3">
          <h6>Resource Details</h6>
          <div className="d-flex align-items-center">
            <button className="btn btn-success d-flex align-items-center me-2 " onClick={handleAddResource}><Plus size={20} className="me-2" />Add Resource</button>

            <div className="btn-group me-2" role="group" aria-label="View switch">
              <button type="button" className="btn btn-sm text-center" onClick={() => setViewType('table')}
                style={{
                  backgroundColor: viewType === 'table' ? '#005197' : '#ffffff',
                  color: viewType === 'table' ? '#ffffff' : '#005197',
                  border: '1px solid #0051973D',
                  borderRadius: '5px 0 0 5px',
                  padding: '8px 12px',
                }}
                title="Table View"
              >
                <Table size={20} />
              </button>
              <button
                type="button"
                className="btn btn-sm text-center"
                onClick={() => setViewType('grid')}
                style={{
                  backgroundColor: viewType === 'grid' ? '#005197' : '#ffffff',
                  color: viewType === 'grid' ? '#ffffff' : '#005197',
                  border: '1px solid #0051973D',
                  borderRadius: '0 5px 5px 0',
                  padding: '8px 12px',
                }}
                title="Grid View"
              >
                <Grid size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white ms-3 me-3 rounded-3 p-3">
          {(() => {
            const displayedResources = (estimatedResources || []).filter(item => {
              if (isInternal) return true;
              const tender = item.tenderEstimation || item;
              return !tender.parent || tender.parent.length === 0;
            });
            const highlightId = searchParams.get('highlightId');

            const formatResourceType = (tender) => {
              let type = tender?.resource?.resourceType || tender?.resourceType;
              if (typeof type === 'object') type = type?.resourceTypeName;
              if (typeof type === 'string' && type) return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
              return 'N/A';
            };

            const toggleRow = (id) => {
              setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
            };

            const renderResourceRow = (item, index, level = 0) => {
              const tender = item.tenderEstimation || item;
              const isComplex = tender.resourceNature?.toLowerCase() === 'complex' || tender.isInternal === true;
              const rowId = tender.id || item.id || index;
              const isExpanded = expandedRows[rowId];
              const isHighlighted = highlightId === String(rowId);

              return (
                <React.Fragment key={rowId}>
                  <tr className={isHighlighted ? 'table-warning' : ''} style={isHighlighted ? { animation: 'highlight-fade 3s forwards' } : {}}>
                    <td style={{ paddingLeft: `${level * 20 + 8}px` }}>
                      {isComplex && (
                        <button className="btn btn-sm btn-link p-0 me-1" onClick={() => toggleRow(rowId)}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      )}
                      {index + 1}
                    </td>
                    <td>{formatResourceType(tender)}</td>
                    <td>{tender.refCode || tender.resource?.resourceCode || tender.resources?.refCode || '-'}</td>
                    <td>
                        {tender.resource?.resourceName || tender.resources?.resourceName}
                        {item.merged && <span className="badge bg-info ms-2 small">Merged</span>}
                    </td>
                    <td>{tender.resourceNature ? tender.resourceNature.charAt(0).toUpperCase() + tender.resourceNature.slice(1).toLowerCase() : 'N/A'}</td>
                    <td>{tender.uom?.uomCode}</td>
                    <td>{tender.quantityType ? tender.quantityType.charAt(0).toUpperCase() + tender.quantityType.slice(1).toLowerCase() : 'N/A'}</td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={buildFormulaDisplay(tender.formulaElements) || ''}>
                      {buildFormulaDisplay(tender.formulaElements) || '—'}
                    </td>
                    <td>{(tender.coEfficient || 0).toFixed(5)}</td>
                    <td>{(item.netQuantity || 0).toFixed(3)}</td>
                    <td>{(tender.costUnitRate || 0).toFixed(2)}</td>
                    <td>{(item.totalCostCompanyCurrency || 0).toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <EyeIcon size={20} color="#005197" className="me-2" title="View Details" style={{ cursor: 'pointer' }} onClick={() => handleViewResource(tender.id)} />

                        <Trash2 size={20} color="red" className="me-2" title="Delete" style={{ cursor: 'pointer' }} onClick={() => handleDeleteResource(tender.id)} />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && item.items && item.items.map((child, cIdx) => renderResourceRow(child, cIdx, level + 1))}
                </React.Fragment>
              );
            };

            return displayedResources.length > 0 ? (
              viewType === 'table' ? (
                <div className="mt-4 table-responsive">
                  <table className="table activity-table">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Resource Type</th>
                        <th>Reference Code</th>
                        <th>Resource Name</th>
                        <th>Resource Nature</th>
                        <th>UOM</th>
                        <th>Quantity Type</th>
                        <th>Formula</th>
                        <th>Coefficient</th>
                        <th>Quantity</th>
                        <th>Rate</th>
                        <th><IndianRupee size={16} /><span>Total Cost</span></th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedResources.map((item, index) => renderResourceRow(item, index))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="row g-4">
                    {displayedResources.map((tender, index) => (
                      <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                        <div className={`card resource-card h-100 shadow-sm border-0 ${highlightId === String(tender.tenderEstimation?.id) ? 'border-primary border-2' : ''}`}>
                          <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="project-code fw-bold text-primary">
                                {formatResourceType(tender?.tenderEstimation)}
                              </span>
                              {tender.merged && <span className="badge bg-info small">Merged</span>}
                            </div>
                            <div className="mb-2 text-start">
                              <p className="project-name fw-bold">
                                {tender?.tenderEstimation?.resource?.resourceCode || tender?.tenderEstimation?.resources?.resourceCode}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between mt-2 small">
                              <span>Reference Code</span>
                              <span className="fw-medium">
                                {tender?.tenderEstimation?.refCode || tender?.tenderEstimation?.resource?.refCode || tender?.tenderEstimation?.resources?.refCode || '-'}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mt-1 small">
                              <span>Resource Name</span>
                              <span className="fw-medium">
                                {tender?.tenderEstimation?.resource?.resourceName || tender?.tenderEstimation?.resources?.resourceName}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mt-1 small">
                              <span>Resource Nature</span>
                              <span className="fw-medium">
                                {tender?.tenderEstimation?.resourceNature ? tender.tenderEstimation.resourceNature.charAt(0).toUpperCase() + tender.tenderEstimation.resourceNature.slice(1).toLowerCase() : 'N/A'}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mt-1 small">
                              <span>Quantity Type</span>
                              <span className="fw-medium">
                                {tender?.tenderEstimation?.quantityType ? tender.tenderEstimation.quantityType.charAt(0).toUpperCase() + tender.tenderEstimation.quantityType.slice(1).toLowerCase() : 'N/A'}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mt-1 small">
                              <span>Coefficient</span>
                              <span className="fw-medium">
                                {(tender?.tenderEstimation?.coEfficient || 0).toFixed(3)}
                              </span>
                            </div>
                            {/* ... grid view continues ... */}
                            <div className="d-flex justify-content-between mt-1 small">
                              <span>Quantity (Net):</span>
                              <span className="fw-medium">
                                {(tender.netQuantity || 0).toFixed(3)}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between mt-1 small">
                              <span>Total Cost:</span>
                              <span className="fw-bold text-success">
                                <IndianRupee size={14} />{(tender.totalCostCompanyCurrency || 0).toFixed(2)}
                              </span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-end mt-1">
                              <EyeIcon
                                size={20}
                                color="#005197"
                                className="me-3"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleViewResource(tender.tenderEstimation?.id || tender.id)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center mt-4">
                <p>No resources found for this BOQ.</p>
              </div>
            );
          })()}
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-body text-center p-4">
                <div className="mb-3">
                  <AlertTriangle size={48} color="#ffc107" />
                </div>
                <h5 className="fw-bold mb-3">Delete Confirmation</h5>
                <p className="text-muted">Are you sure you want to delete this resource? This action cannot be undone.</p>
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger px-4" onClick={confirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedBoqForModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#005197' }}>
                <h5 className="modal-title fw-medium text-white">BOQ Name : {selectedBoqForModal.boqCode}</h5>
                <button type="button" className="btn-close text-white bg-white" onClick={() => setSelectedBoqForModal(null)}></button>
              </div>
              <div className="modal-body text-start" style={{ maxHeight: '60vh', overflowY: 'auto', wordWrap: 'break-word', borderBottom: 'none' }}>
                <p className="fs-6 lh-lg" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{selectedBoqForModal.boqName}</p>
              </div>
              <div className="modal-footer" style={{ borderTop: 'none' }}>
                <button type="button" className="btn btn-secondary px-4 mt-2 mb-2" onClick={() => setSelectedBoqForModal(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TenderResource;  