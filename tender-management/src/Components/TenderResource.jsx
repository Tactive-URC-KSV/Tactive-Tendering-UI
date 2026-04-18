import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plus, EditIcon, Trash2, IndianRupee, BadgeDollarSign, Table, Grid, EyeIcon } from "lucide-react";
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
  const parentTenderEstimationId = searchParams.get('tenderEstimationId');
  const internalBoqId = parentTenderEstimationId; // Store it for reuse per instructions
  
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    if (projectId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.status === 200) {
          setProject(res.data);
          if (isInternal) {
            fetchTenderEstimationDetails();
          } else {
            fetchBoqDetails();
          }
          fetchEstimatedResources();
        }
      }).catch(err => {
        if (err.response?.status === 401) {
          // navigate('/login');
        } else {
          console.error(err);
          toast.error('Failed to fetch project information.');
        }
      });
    } else {
      fetchEstimatedResources();
    }
  }, [projectId]);

  const fetchTenderEstimationDetails = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/tender-estimation/complex/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.status === 200) {
        const tenderData = res.data || [];
        const tender = tenderData.find(item => item.id === parentTenderEstimationId);
        if (!tender) return;
        
        const cost = tender.costDetails || tender;
        
        let rType = tender.resource?.resourceType || tender.resourceType;
        if (typeof rType === 'object') rType = rType?.resourceTypeName;

        // Map fields to mock a BOQ object so the existing UI cards display the values without modification
        const simulatedBoq = {
           boqCode: tender.resource?.resourceCode || tender.resources?.resourceCode || rType || '',
           totalRate: tender.rate || tender.costUnitRate || cost.costUnitRate || 0,
           totalAmount: tender.totalCost || cost.resourceTotalCost || cost.totalCostCompanyCurrency || tender.totalCostCompanyCurrency || 0,
           quantity: tender.totalQuantity || tender.calculatedQuantity || cost.calculatedQuantity || cost.netQuantity || tender.coEfficient || 1,
           uom: tender.uom || { uomCode: 'N/A' },
           boqName: tender.resource?.resourceName || tender.resources?.resourceName || 'Complex Resource'
        };
        
        setBoq(simulatedBoq);
        
        const bName = simulatedBoq.boqName;
        setBoqName(bName && bName.length > 20 ? bName.substring(0, 20) + '...' : bName);
      }
    }).catch(err => {
      console.error(err);
      toast.error('Failed to fetch tender estimation details.');
    });
  }

  const fetchBoqDetails = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/BOQ/${boqId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.status === 200) {
        setBoq(res.data);
        const boqName = res?.data?.boqName;
        setBoqName(boqName && boqName?.length > 20
          ? boqName.substring(0, 20) + '...'
          : boqName);
      }
    }).catch(err => {
      if (err.response?.status === 401) {
        // navigate('/login');
      } else {
        console.error(err);
        toast.error('Failed to fetch BOQ information.');
      }
    });
  }
  const fetchEstimatedResources = () => {
    const url = isInternal 
      ? `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/internal-boq/${parentTenderEstimationId}`
      : `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/estimatedResources/${boqId}`;

    axios.get(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        const data = Array.isArray(res.data) ? res.data : (res.data?.content || (res.data ? [res.data] : []));
        setEstimatedResources(data);
      }
    }).catch(err => {
      if (err?.response?.status === 401) {
        // navigate('/login');
      } else {
        toast.error(err?.response?.data?.message || 'Failed to fetch resources.');
      }
    });
  };

  const handleAddResource = () => {
    const qs = isInternal ? `?isInternal=true&tenderEstimationId=${parentTenderEstimationId}` : '';
    navigate(isInternal ? `/add-resource/internal/${projectId}${qs}` : `/add-resource/${boqId}/${projectId}`);
  };
  const handleViewResource = (tId) => {
    const qs = isInternal ? `?isInternal=true&tenderEstimationId=${parentTenderEstimationId}` : '';
    navigate(isInternal ? `/add-resource/internal/${projectId}/${tId}${qs}` : `/add-resource/${boqId}/${projectId}/${tId}`);
  };
  const handleEditResource = (tId) => {
    const qs = isInternal ? `?isInternal=true&tenderEstimationId=${parentTenderEstimationId}&isEdit=true` : '?isEdit=true';
    navigate(isInternal ? `/add-resource/internal/${projectId}/${tId}${qs}` : `/add-resource/${boqId}/${projectId}/${tId}?isEdit=true`);
  };

  const handleDeleteResource = (resourceId) => {
    const url = isInternal 
      ? `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/deleteInternalResource/${resourceId}/${parentTenderEstimationId}`
      : `${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/deleteResourceFromBoq/${resourceId}/${boqId}`;
    axios.delete(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.status === 200 || res.status === 201) {
        toast.success(res.data);
        fetchEstimatedResources();
      }
    }).catch((err) => {
      if (err.response.status === 401) {
        // navigate('/login');
      } else {
        toast.error(err.response.data.message);
      }
    })
  }
  return (
    <>
      <div className="container-fluid mt-4 p-4 min-vh-100">
        <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
          <div className="fw-bold text-start">
            <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
            <span className="ms-2">BOQ Details</span>
          </div>
        </div>
        <div className="bg-white rounded-3 ms-3 me-3 p-4" style={{ border: '1px solid #0051973D' }}>
          <div className="text-start fw-bold ms-3 mb-2 d-flex align-items-center">
            {project?.projectName}
            {isInternal && (
              <span className="badge bg-warning text-dark ms-3">Shared Internal BOQ</span>
            )}
          </div>
          <div className="row g-2 mb-4 ms-3">
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{isInternal ? 'Resource Code' : 'BOQ Code'}</span>
                  <ActivityCode />
                </div>
                <div className="fw-bold text-start mt-2">{boq?.boqCode}</div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4">
              <div className="rounded-2 p-3" style={{ backgroundColor: '#EFF6FF', width: '90%', height: '100%' }}>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">{isInternal ? 'Resource Name' : 'BOQ Name'}</span>
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
            const displayedResources = estimatedResources?.filter(item => {
              if (isInternal) {
                return true; // Use the entire array as InternalBoq structures.
              }
              return !item.tenderEstimation?.parent;
            }) || [];

            const formatResourceType = (tender) => {
              let type = tender?.resource?.resourceType || tender?.resourceType;
              if (typeof type === 'object') type = type?.resourceTypeName;
              if (typeof type === 'string' && type) return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
              return 'N/A';
            };

            const toggleRow = (id) => {
              setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
            };

            if (isInternal) {
              return displayedResources.length > 0 ? (
                <div className="mt-4 table-responsive">
                  <table className="table activity-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px' }}></th>
                        <th>S.No</th>
                        <th>Resource</th>
                        <th>UOM</th>
                        <th>Total Quantity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedResources.map((item, index) => {
                        const isShared = item.items && item.items.length > 1;
                        const tenderEstimationId = item.internalBoqId || item.id;
                        const rowId = tenderEstimationId || index;
                        const isExpanded = expandedRows[rowId];
                        return (
                          <React.Fragment key={rowId}>
                            <tr>
                              <td className="text-center align-middle">
                                {item.items && item.items.length > 0 && (
                                  <button className="btn btn-sm btn-link p-0 text-dark" onClick={() => toggleRow(rowId)}>
                                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                  </button>
                                )}
                              </td>
                              <td className="align-middle">{index + 1}</td>
                              <td className="align-middle">
                                {item.resourceName || 'N/A'}
                                {isShared && <span className="badge bg-warning text-dark ms-2">Shared BOQ</span>}
                              </td>
                              <td className="align-middle">{item.uomCode || 'N/A'}</td>
                              <td className="align-middle">{(item.totalQuantity || 0).toFixed(3)}</td>
                              <td className="align-middle">
                                <button className="btn btn-sm" style={{ background: "#DCFCE7", cursor: "pointer" }} onClick={() => {
                                  if (!tenderEstimationId) {
                                    toast.error("Tender Estimation ID is missing.");
                                    return;
                                  }
                                  console.log("Calling Internal BOQ with:", tenderEstimationId);
                                  handleViewResource(tenderEstimationId);
                                }}>
                                  <Eye color="#15803D" size={20} /><span className="ms-1" style={{ color: '#15803D' }}>View</span>
                                </button>
                              </td>
                            </tr>
                            {isExpanded && item.items && item.items.map((child, cIndex) => (
                              <tr key={child.tenderEstimationId || cIndex} style={{ backgroundColor: '#f9fafb' }}>
                                <td></td>
                                <td></td>
                                <td colSpan={2} style={{ paddingLeft: '2.5rem' }} className="align-middle">
                                  <span className="text-muted d-inline-block small me-2">Tender Estimation ID:</span>
                                  <span className="fw-medium">{child.tenderEstimationId || 'N/A'}</span>
                                </td>
                                <td colSpan={2} className="align-middle">
                                  <span className="text-muted d-inline-block small me-2">Contribution:</span>
                                  <span className="fw-medium text-primary">{(child.quantity || 0).toFixed(3)}</span>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : <div className="text-center py-4 text-muted">No Content Available</div>;
            }

            return displayedResources.length > 0 ? (
              viewType === 'table' ? (
                <div className="mt-4">
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
                    {displayedResources.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{formatResourceType(item.tenderEstimation)}</td>
                        <td>{item.tenderEstimation?.refCode || item.tenderEstimation?.resource?.resourceCode || item.tenderEstimation?.resources?.refCode || '-'}</td>
                        <td>{item.tenderEstimation?.resource?.resourceName || item.tenderEstimation?.resources?.resourceName}</td>
                        <td>{item.tenderEstimation?.resourceNature ? item.tenderEstimation.resourceNature.charAt(0).toUpperCase() + item.tenderEstimation.resourceNature.slice(1).toLowerCase() : 'N/A'}</td>
                        <td>{item.tenderEstimation?.uom?.uomCode}</td>
                        <td>{item.tenderEstimation?.quantityType ? item.tenderEstimation.quantityType.charAt(0).toUpperCase() + item.tenderEstimation.quantityType.slice(1).toLowerCase() : 'N/A'}</td>
                        <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={buildFormulaDisplay(item.tenderEstimation?.formulaElements) || ''}>
                          {buildFormulaDisplay(item.tenderEstimation?.formulaElements) || '—'}
                        </td>
                        <td>{(item.tenderEstimation?.coEfficient || 0).toFixed(5)}</td>
                        <td>{(item.netQuantity || 0).toFixed(3)}</td>
                        <td>{(item.tenderEstimation?.costUnitRate || 0).toFixed(2)}</td>
                        <td>{(item.totalCostCompanyCurrency || 0).toFixed(2)}</td>
                        <td>
                          <EyeIcon size={20} color="#005197" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleViewResource(item.tenderEstimation.id)} />
                          <Trash2 size={20} color="red" className="me-2" style={{ cursor: 'pointer' }} onClick={() => handleDeleteResource(item.tenderEstimation.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>) : (
              <div className="mt-4">
                <div className="row g-4">
                  {displayedResources.map((tender, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-sm-12">
                      <div className="card resource-card h-100 shadow-sm border-0">
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="project-code fw-bold text-primary">
                              {formatResourceType(tender?.tenderEstimation)}
                            </span>
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
                          <div className="d-flex justify-content-between mt-1 small">
                            <span>Calculated Quantity</span>
                            <span className="fw-medium">
                              {(tender?.calculatedQuantity || 0).toFixed(3)}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mt-1 small">
                            <span>Quantity (Net):</span>
                            <span className="fw-medium">
                              {(tender.netQuantity || 0).toFixed(3)}
                            </span>
                          </div>
                          <div className="d-flex justify-content-between mt-1 small">
                            <span>Rate:</span>
                            <span className="fw-medium">
                              <IndianRupee size={14} />{(tender.tenderEstimation?.costUnitRate || 0).toFixed(2)}
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
                            <EditIcon
                              size={20}
                              color="#005197"
                              className="me-3"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleEditResource(tender.tenderEstimation.id)}
                            />
                            <Trash2
                              size={20}
                              color="red"
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleDeleteResource(tender.tenderEstimation.id)}
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
              <p>No resources found for this {isInternal ? 'complex resource' : 'BOQ'}.</p>
            </div>
          );
          })()}
        </div>
      </div>
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