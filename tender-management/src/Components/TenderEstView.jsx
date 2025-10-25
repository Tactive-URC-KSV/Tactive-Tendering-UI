import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, ChartArea, IndianRupee, Plus, X } from 'lucide-react';
import '../CSS/Styles.css';
import ActivityView from "../assest/Activity.svg?react";
import Directcost from '../assest/DirectCost.svg?react';
import Indirectcost from '../assest/IndirectCost.svg?react';
import Profit from '../assest/Profit.svg?react';
import CollapseIcon from '../assest/Collapse.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import WeightIcon from '../assest/NetAmount.svg?react';
import { FolderTree, Eye, ChevronRight, ChevronUp, ChevronDown, Percent, Calculator} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const handleUnauthorized = () => {
  const navigate = useNavigate();
  navigate('/login');
}

function ProfitDialog({ isOpen, handleSetProfit, profitPer, setProfitPer, setIsOpen, selectedBoq }) {
  if (!isOpen) return null;
  return (
    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.51)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between" style={{ background: 'linear-gradient(to right, #0056b3, #007bff)' }}>
            <p className="modal-title"><Percent size={20} color="#FFFFFF" /><span className="ms-2 text-white">Set Profit</span></p>
            <X color="#FFFFFF" size={20} onClick={() => { setIsOpen(false); setProfitPer(0.0) }} style={{ cursor: 'pointer' }} />
          </div>
          <div className="modal-body ms-2 me-2">
            <p className="text-start fw-bold mb-2">Selected BOQ</p>
            <div className="mb-3" style={{ maxHeight: '150px', overflow: 'auto' }}>
              {selectedBoq.map((item, index) => (
                <div key={index} className="mb-1 text-start p-1 rounded-3" style={{ backgroundColor: '#2563EB14' }}>
                  <span>{item.boqCode + ' - ' + item.boqName}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 mb-3">
              <label className="text-start d-block fw-bold">
                Profit Percentage <span style={{ color: 'red' }}>*</span>
              </label>
              <input type="text" className="form-input w-100" placeholder="%"
                value={profitPer}
                onChange={(e) => setProfitPer(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn template-button" onClick={() => setIsOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn action-button" onClick={handleSetProfit}>
              Set Profit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Activity({ costCodeTypes, costCodeType, setCostCodeType, amounts, icon, activities, projectId }) {
  const navigate = useNavigate();
  const [percentage, setPercentage] = useState({});
  const [totalAmount, setTotalAmount] = useState();
  const [expandedGroups, setExpandedGroups] = useState({});
  const [activityGroup, setActivityGroup] = useState([]);
  const [hoverStates, setHoverStates] = useState({});
  const handleResource = (costCodeId) => {
    navigate(`/tenderestimation/${projectId}/resourceadding/${costCodeId}`);
  }
  const handleGlobalResource = (costCodeId) => {
    navigate(`/tenderestimation/resourceadding/${costCodeId}`);
  }
  useEffect(() => {
    let total = 0;
    costCodeTypes.forEach(costCode => {
      total += amounts[costCode.id];
    })
    setTotalAmount(total);
  }, [amounts, costCodeTypes])
  useEffect(() => {
    costCodeTypes.forEach(costCode => {
      let percentage = amounts[costCode.id] / totalAmount;
      setPercentage(prev => ({
        ...prev,
        [costCode.id]: percentage * 100
      }))
    })
  }, [amounts, totalAmount, costCodeTypes])

  useEffect(() => {
    if (Array.isArray(activities) && activities.length > 0) {
      const groupMap = new Map();

      activities.forEach(item => {
        if (item && item.activityGroup) {
          const groupId = item.activityGroup.id;

          if (!groupMap.has(groupId)) {
            groupMap.set(groupId, {
              ...item.activityGroup,
              children: []
            });
          }
          groupMap.get(groupId).children.push({
            id: item.id,
            activityCode: item.activityCode,
            activityName: item.activityName,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            uom: item.uom,
            activityGroupId: item.activityGroup.id,
            buttonHover: false

          });
        }
      });
      setActivityGroup(Array.from(groupMap.values()));
    } else {
      setActivityGroup([]);
    }
  }, [activities]);
  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  const expandAll = () => {
    const allExpanded = {};
    activityGroup.forEach(group => {
      allExpanded[group.id] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAll = () => {
    const allCollapsed = {};
    activityGroup.forEach(group => {
      allCollapsed[group.id] = false;
    });
    setExpandedGroups(allCollapsed);
  };
  const handleHover = (groupId, isHovering) => {
    setHoverStates(prev => ({
      ...prev,
      [groupId]: isHovering
    }));
  };

  return (
    <>
      <div className="row g-3 ms-2 mt-3 mb-3 d-flex justify-content-between">
        {costCodeTypes.map((costCode, index) => (
          <div className="col-md-6 col-lg-4 col-sm-12" key={index}>
            <div className={`card project-card ${costCode.id === costCodeType ? 'active' : ''} shadow-sm border-0 h-100 p-1 rounded-3`} style={{ width: '90%', cursor: 'pointer' }} onClick={() => setCostCodeType(costCode.id)}>
              <div className="card-body d-flex justify-content-between text-start">
                <div>
                  <p className="fw-medium mb-1">{costCode.costCodeName}</p>
                  <p className="mb-1 text-primary fw-bold"><IndianRupee size={15} />{(amounts[costCode.id] / 1000000).toFixed(2)} M</p>
                  <p className="text-muted small mb-0">{(percentage[costCode.id] ?? 0).toFixed(2)}% of total</p>
                </div>
                <div>
                  {icon.find(item => item.label === costCode.costCodeName)?.icon}
                </div>
              </div>
              <div className="card-body d-flex justify-content-end" style={{ fontSize: '14px', color: '#005197' }}><span className="me-2">View Details</span><ArrowRight size={18} /></div>
            </div>
          </div>
        ))}
      </div>
      {activities.length > 0 ? (
        <>
          {Array.isArray(activityGroup) && activityGroup.length > 0 && (
            <div className="row ms-3 mt-3 mb-3 me-3 p-2 bg-white rounded-3" style={{ border: '1px solid #0051973D' }}>
              <div className="d-flex justify-content-between px-2 mb-3" style={{ borderBottom: '1px solid #0051973D' }}>
                <p className="fw-bold text-start mt-2 ms-1 mb-1">{activityGroup?.[0].costCodeType?.costCodeName} Details</p>
                <div className="mb-1">
                  <button className="btn" onClick={collapseAll} style={{ cursor: "pointer", color: "#005197" }}>
                    <CollapseIcon /><span>Collapse All</span>
                  </button>
                  <button className="btn" onClick={expandAll} style={{ cursor: "pointer", color: "#005197" }}>
                    <ExpandIcon /><span>Expand All</span>
                  </button>
                </div>
              </div>
              {activityGroup.map((group, index) => (
                <div key={index} className="mb-3 activity-details p-2">
                  <div className="d-flex align-items-center rounded p-1 justify-content-between">
                    <div className="ms-1" onClick={() => toggleGroup(group.id)}>
                      <ChevronRight size={22} className={`me-2 text-primary ${expandedGroups[group.id] ? "rotate-180" : ""}`} />
                      <strong>{group.activityName}</strong>
                    </div>
                    <div
                      className="rounded d-flex align-items-center justify-content-end px-2 py-1"
                      style={{
                        cursor: 'pointer',
                        overflow: 'hidden',
                        minWidth: '140px',
                        transition: 'background 0.3s ease',
                        position: 'relative',
                      }}
                      onMouseEnter={() => handleHover(group.id, true)}
                      onMouseLeave={() => handleHover(group.id, false)}
                      onClick={() => { handleGlobalResource(group.id) }}
                    >
                      <span
                        style={{
                          opacity: hoverStates[group.id] ? 1 : 0,
                          transform: hoverStates[group.id]
                            ? 'translateX(0)'
                            : 'translateX(20px)',
                          transition: 'opacity 0.3s ease, transform 0.3s ease',
                          whiteSpace: 'nowrap',
                          fontSize: '14px',
                          color: '#005197',
                          marginRight: '6px',
                          pointerEvents: 'none',
                        }}
                      >
                        Add Resource
                      </span>
                      <Plus color="#005197" />
                    </div>

                  </div>
                  {expandedGroups[group.id] && (
                    <div className="ms-4 mt-2 bg-white rounded-3 p-2 mb-3">
                      <table className="table activity-table table-responsive border-none">
                        <thead>
                          <tr>
                            <th>Activity Code</th>
                            <th>Activity Name</th>
                            <th>UOM</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.children.map((child, cIndex) => (
                            <tr key={cIndex}>
                              <td>{child.activityCode}</td>
                              <td>{child.activityName}</td>
                              <td>{child.uom?.uomCode}</td>
                              <td>{(child.quantity).toFixed(3)}</td>
                              <td>{(child.rate).toFixed(2)}</td>
                              <td>{(child.amount).toFixed(2)}</td>
                              <td>
                                <button className="btn btn-sm" onClick={() => handleResource(child.id)} style={{ background: "#DCFCE7", cursor: "pointer" }}><Eye color="#15803D" size={20} /><span className="ms-1" style={{ color: '#15803D' }}>View</span></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}

            </div>
          )
          }
        </>
      ) : (<div className="mt-5 mb-5">No Content Available</div>)}

      <div className="project-title-header d-flex justify-content-between ms-3 mt-4 me-3">
        <div className="text-start">
          <p>Total Tender Estimation</p>
          <p className="fw-bold"><IndianRupee size={14} /> {(totalAmount / 1000000).toFixed(2)} M</p>
        </div>
        <div className="text-end">
          <p>Total activities : {activities.length}</p>
        </div>
      </div>
    </>
  );
}

function BOQView({ boq, fetchBoq }) {
  const [boqTree, setBoqTree] = useState([]);
  const [expandedDivisions, setExpandedDivisions] = useState({});
  const [checkedRows, setCheckedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [profitPer, setProfitPer] = useState(0.0);
  const [selectedBoq, setSelectedBoq] = useState({});
  const [serviceTotal, setServiceTotal] = useState(0.0);
  const [profitTotal, setProfitTotal] = useState(0.0);
  const [netTotal, setNetTotal] = useState(0.0);

  useEffect(() => {
    if (!Array.isArray(boq) || boq.length === 0) {
      setBoqTree([]);
      return;
    }

    const map = new Map();

    boq.forEach((item) => {
      const id = item.id || item.boqCode;
      map.set(item.boqCode, {
        ...item,
        id,
        children: [],
      });
    });

    const roots = [];

    boq.forEach((item) => {
      const node = map.get(item.boqCode);
      if (item.parentLevel === 0) {
        roots.push(node);
      } else {
        const parentCode = item.boqCode.split(".").slice(0, -1).join(".");
        const parent = map.get(parentCode);
        if (parent) parent.children.push(node);
      }
    });

    setBoqTree(roots);
    calculateAmount();
  }, [boq]);
  const calculateAmount = () => {
    let serviceTotal = 0.0;
    let profitTotal = 0.0;
    let netTotal = 0.0;
    boq.forEach((item) => {
      if(item.lastLevel){
        serviceTotal += Number(item.totalAmount);
        profitTotal += Number(item.profitAmount);
        netTotal += Number(item.netAmount);
      }
    })
    setServiceTotal(serviceTotal);
    setProfitTotal(profitTotal);
    setNetTotal(netTotal);
  }
  const toggleDivision = (id) => {
    setExpandedDivisions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRowCheck = (id, checked, parentDivision = null) => {
    setCheckedRows((prev) => {
      const updated = { ...prev, [id]: checked };
      if (parentDivision && parentDivision.children?.length) {
        const allChecked = parentDivision.children.every((c) => updated[c.id]);
        updated[parentDivision.id] = allChecked;
      }
      return updated;
    });
  };

  const handleHeadCheck = (division, checked) => {
    const updates = {};
    const walk = (children) => {
      children.forEach((c) => {
        updates[c.id] = checked;
        if (c.children?.length) walk(c.children);
      });
    };
    walk(division.children);
    updates[division.id] = checked;
    setCheckedRows((prev) => ({ ...prev, ...updates }));
  };

  const BOQRow = ({ item, level = 0, isLastRow = false, parentDivision = null }) => {
    const hasChildren = !item.lastLevel && item.children?.length > 0;
    const border = isLastRow ? "none" : "1px solid #0051973D";

    return (
      <>
        <tr>
          <td className="text-center">
            <input
              type="checkbox"
              className={`form-check-input border-primary ${checkedRows[item.id] ? "bg-primary" : ""}`}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
              checked={!!checkedRows[item.id]}
              onChange={(e) => handleRowCheck(item.id, e.target.checked, parentDivision)}
            />
          </td>
          <td className="text-nowrap p-3">{item.boqName}</td>
          <td className="text-nowrap p-3">{item.uom?.uomCode ?? "-"}</td>
          <td className="text-end text-nowrap p-3">
            {item.quantity != null ? Number(item.quantity).toFixed(3) : "-"}
          </td>
          <td className="text-end text-nowrap p-3">
            {item.totalRate != null ? Number(item.totalRate).toFixed(2) : "-"}
          </td>
          <td className="text-end text-nowrap p-3">
            {item.totalAmount != null ? Number(item.totalAmount).toFixed(2) : "-"}
          </td>
          <td className="text-end text-nowrap p-3">{item.profitPer ?? "-"}</td>
          <td className="text-end text-nowrap p-3">
            {item.profitRate != null ? Number(item.profitRate).toFixed(2) : "-"}
          </td>
          <td className="text-end text-nowrap p-3">
            {item.profitAmount != null ? Number(item.profitAmount).toFixed(2) : "-"}
          </td>
          <td className="text-end text-nowrap p-3">
            {item.netRate != null ? Number(item.netRate).toFixed(2) : "-"}
          </td>
          <td className="text-end text-nowrap p-3">
            {item.netAmount != null ? Number(item.netAmount).toFixed(2) : "-"}
          </td>
        </tr>
        {hasChildren &&
          item.children.map((child, idx) => (
            <BOQRow
              key={child.id}
              item={child}
              level={level + 1}
              isLastRow={isLastRow && idx === item.children.length - 1}
              parentDivision={item}
            />
          ))}
      </>
    );
  };

  const renderInnerChildren = (children, parentDivision, isLastRow = false, level = 0) => {
    return children
      .filter((child) => !child.lastLevel)
      .map((child, idx) => {
        const last = idx === children.length - 1 && isLastRow;
        return (
          <div key={child.id} className="mb-2 text-start">
            <div className="fw-bold text-dark">
              {child.boqCode} - {child.boqName}
            </div>
            <div className="text-muted small">
              BOQ Code: {child.boqCode}
            </div>
            {child.children?.length > 0 && (
              <div className="ms-4">
                {renderInnerChildren(child.children, child, last, level + 1)}
              </div>
            )}
          </div>
        );
      });
  };

  const filterBoqTree = (items, query) => {
    const lowerQuery = query.toLowerCase();
    return items
      .map((item) => {
        const matches = item.boqName.toLowerCase().includes(lowerQuery);
        const filteredChildren = item.children?.length > 0 ? filterBoqTree(item.children, query) : [];
        if (matches || filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  };
  const handleProfit = () => {
    const selectedItems = boq
      .filter(item => checkedRows[item.id])
      .filter(item => item.lastLevel);
    setSelectedBoq(selectedItems);
    setIsOpen(true);
  }
  const handleSetProfit = () => {
    const boqIds = selectedBoq.map(item => item.id);
    axios.put(`${import.meta.env.VITE_API_BASE_URL}/boq/updateProfitMargin?profitPer=${profitPer}`, boqIds,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 200) {
          toast.success(res.data);
        }
      }).catch(err => {
        if (err.response.status === 401) {
          handleUnauthorized();
        }
      }).finally(() => {
        setIsOpen(false);
        setProfitPer(0.0);
        setSelectedBoq({});
        setCheckedRows({});
        fetchBoq();
      })
  }

  const filteredBoqTree = searchQuery ? filterBoqTree(boqTree, searchQuery) : boqTree;

  return (
    <>
      <div className="row g-3 ms-2 mt-3 mb-3 me-2 d-flex justify-content-between">
        <div className="col-md-6 col-lg-4 col-sm-12">
          <div className="card project-card shadow-sm border-0 h-100 p-1 rounded-3">
            <div className="card-body d-flex justify-content-between text-start">
                <div>
                  <p className="fw-medium mb-1">Working Amount</p>
                  <p className="mb-2 text-primary fw-bold"><IndianRupee size={15}/><span>{serviceTotal.toFixed(2)}</span></p>
                  <p className="text-muted small mb-0">Total Service Amount</p>
                </div>
                <div className="rounded-5 me-2 p-2" style={{backgroundColor: '#DBEAFE', height:'fit-content'}}>
                  <Calculator size={24} color="#005197"/>
                </div>
              </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-sm-12">
          <div className="card project-card shadow-sm border-0 h-100 p-1 rounded-3">
            <div className="card-body d-flex justify-content-between text-start">
                <div>
                  <p className="fw-medium mb-1">Profit Amount</p>
                  <p className="mb-2 text-primary fw-bold"><IndianRupee size={15} /><span>{profitTotal.toFixed(2)}</span></p>
                  <p className="text-muted small mb-0">Total Profit Amount</p>
                </div>
                <div className="rounded-5 me-2 p-2" style={{backgroundColor: '#F0FDF4', height:'fit-content'}}>
                  <ChartArea size={24} color="#2BA95A"/>
                </div>
              </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4 col-sm-12">
          <div className="card project-card shadow-sm border-0 h-100 p-1 rounded-3">
            <div className="card-body d-flex justify-content-between text-start">
                <div>
                  <p className="fw-medium mb-1">Net Amount</p>
                  <p className="mb-2 text-primary fw-bold"><IndianRupee size={15} /><span>{netTotal.toFixed(2)}</span></p>
                  <p className="text-muted small mb-0">Net Amount Calculation</p>
                </div>
                <div className="rounded-5 me-2 p-2" style={{backgroundColor: '#FAF5FF', height:'fit-content'}}>
                  <WeightIcon size={24} color="#005197"/>
                </div>
              </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-white rounded-3 ms-2 me-2 mt-4" style={{ border: "1px solid #0051973D", maxWidth: '1200px' }}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6 className="fw-bold">BOQ Categories</h6>
          <div className="d-flex justify-content-end">
            <input
              type="text"
              className="form-control"
              placeholder="Search BOQ items"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", minWidth: "350px", fontSize: "14px" }}
            />
            <button className="btn text-white ms-4 p-0" style={{ backgroundColor: '#005197', minWidth: '130px' }} onClick={handleProfit}>
              <Percent size={18} /> <span>Set Profit</span>
            </button>
          </div>
          <ProfitDialog
            isOpen={isOpen}
            handleSetProfit={handleSetProfit}
            profitPer={profitPer}
            setProfitPer={setProfitPer}
            setIsOpen={setIsOpen}
            selectedBoq={selectedBoq}
          />
        </div>
        {filteredBoqTree.length > 0 ? (
          filteredBoqTree.map((division) => {
            const hasChildren = division.children?.length > 0;
            const collectLastLevelItems = (items, result = []) => {
              items.forEach((item) => {
                if (item.lastLevel) {
                  result.push(item);
                } else if (item.children?.length) {
                  collectLastLevelItems(item.children, result);
                }
              });
              return result;
            };
            const lastLevelItems = collectLastLevelItems(division.children);

            return (
              <div key={division.id} className="mb-3 p-2 rounded" style={{ backgroundColor: "#EFF6FF" }}>
                <div
                  className="d-flex flex-column mb-2"
                  onClick={() => hasChildren && toggleDivision(division.id)}
                  style={{ cursor: hasChildren ? "pointer" : "default" }}
                >
                  <div className="d-flex fw-bold align-items-center">
                    {hasChildren && (
                      <div className="d-flex align-items-center">
                        {expandedDivisions[division.id] ? (
                          <ChevronUp size={28} color="#005197" />
                        ) : (
                          <ChevronDown size={28} color="#005197" />
                        )}
                      </div>
                    )}
                    <span className="fw-bold ms-3">{division.boqName}</span>
                  </div>
                  {division.parentLevel === 0 && (
                    <div className="text-muted small text-start ms-5">
                      BOQ Code: {division.boqCode}
                    </div>
                  )}
                </div>
                {expandedDivisions[division.id] && hasChildren && (
                  <div className="mt-2 bg-white rounded-3 ms-4 p-3 mb-3">
                    {renderInnerChildren(division.children, division, true)}
                    {lastLevelItems.length > 0 && (
                      <div className="table-responsive">
                        <table className="tables mb-0">
                          <thead>
                            <tr>
                              <th className="text-center me-2">
                                <input type="checkbox"
                                  className={`form-check-input border-primary ${lastLevelItems.every((c) => checkedRows[c.id]) ? "bg-primary" : ""
                                    }`}
                                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                  checked={lastLevelItems.every((c) => checkedRows[c.id])}
                                  onChange={(e) => handleHeadCheck(division, e.target.checked)}
                                />
                              </th>
                              <th className="text-primary text-nowrap p-3">BOQ Name</th>
                              <th className="text-primary text-nowrap p-3">UOM</th>
                              <th className="text-primary text-nowrap p-3">Quantity</th>
                              <th className="text-primary text-nowrap p-3">Service<p>Rate</p></th>
                              <th className="text-primary text-nowrap p-3">Service<p>Amount</p></th>
                              <th className="text-primary text-nowrap p-3">Service<p>Profit %</p> </th>
                              <th className="text-primary text-nowrap p-3">Service<p>Profit Rate</p></th>
                              <th className="text-primary text-nowrap p-3">Service<p>Profit Amount</p></th>
                              <th className="text-primary text-nowrap p-3">Service<p>Net Rate</p></th>
                              <th className="text-primary text-nowrap p-3">Service<p>Net Amount</p></th>
                            </tr>
                          </thead>
                          <tbody>
                            {lastLevelItems.map((child, idx) => (
                              <BOQRow
                                key={child.id}
                                item={child}
                                level={0}
                                isLastRow={idx === lastLevelItems.length - 1}
                                parentDivision={division}
                              />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 text-muted">No BOQ Data Found</div>
        )}
      </div>
    </>
  );
}

function TenderEstView({ projectId }) {
  const [project, setProject] = useState();
  const [contentView, setContentView] = useState('activity');
  const [costCodeTypes, setCostCodeTypes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [boq, setBoq] = useState([]);
  const icon = [
    { label: 'Direct cost', icon: <Directcost /> },
    { label: 'In-Direct cost', icon: <Indirectcost /> },
    { label: 'Profit', icon: <Profit /> }
  ];
  const [costCodeType, setCostCodeType] = useState();
  const [amounts, setAmounts] = useState({});

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    }).then(res => {
      if (res.status === 200) {
        setProject(res.data);
        getCostCodeTypes();
      }
    }).catch(err => {
      if (err.response.status === 401) {
        handleUnauthorized();
      }
    });
  }, [projectId]);

  const getCostCodeTypes = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        setCostCodeTypes(res.data || []);
        setCostCodeType(res.data[0]?.id);
        calculateTotalAmount(res.data);
      }
    }).catch(err => {
      if (err.response.status === 401) {
        handleUnauthorized();
      }
    })
  }
  useEffect(() => {
    if (costCodeType) {
      findActivity();
    }
  }, [costCodeType])

  const findActivity = () => {
    setActivities([]);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/${costCodeType}/${projectId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        setActivities(res.data);
      }
    }).catch(err => {
      if (err.response.status === 401) {
        handleUnauthorized();
      }
    })
  }
  const fetchBoq = () => {
    setBoq([]);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBOQ/${projectId}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status === 200) {
        setBoq(res.data || []);
      }
    }).catch(err => {
      if (err?.response?.status === 401) {
        handleUnauthorized();
      }
      setBoq([]);
    });
  }
  const calculateTotalAmount = (types) => {
    types.forEach(costCode => {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/totalAmount/${costCode.id}/${projectId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 200) {
          setAmounts(prev => ({
            ...prev,
            [costCode.id]: res.data
          }));
        }
      }).catch(err => {
        if (err.response.status === 401) {
          handleUnauthorized();
        }
      });
    })

  }

  return (
    <div className="container-fluid min-vh-100">
      <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
        <div className="ms-3">
          <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
          <span className='ms-2'>Tender Estimation</span>
          <span className='ms-2'>-</span>
          <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
        </div>
      </div>
      <div className="d-flex ms-3 mt-2">
        <button className={`btn ${contentView === 'activity' ? 'activeView' : 'bg-white'} px-3 py-2 border border-end-0 rounded-start rounded-0`} onClick={() => setContentView('activity')}>
          {contentView === 'activity' ?
            (<ActivityView />)
            :
            (<ActivityView style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />)
          }
          <span className="ms-2 fs-6">Activity View</span>
        </button>
        <button className={`btn ${contentView === 'boq' ? 'activeView' : 'bg-white'} px-3 py-2 border border-start-0 rounded-end rounded-0`} onClick={() => { setContentView('boq'); fetchBoq() }}>
          {contentView === 'activity' ?
            (<FolderTree color="#005197" size={24} />)
            :
            (<FolderTree color="white" size={24} />)
          }
          <span className="ms-2 fs-6">BOQ View</span>
        </button>
      </div>
      {contentView === 'activity' &&
        <Activity
          costCodeTypes={costCodeTypes}
          costCodeType={costCodeType}
          setCostCodeType={setCostCodeType}
          amounts={amounts}
          icon={icon}
          findActivity={findActivity}
          activities={activities}
          projectId={projectId}
        />
      }
      {contentView === 'boq' &&
        <BOQView boq={boq} fetchBoq={fetchBoq} />
      }
    </div>
  );
}
export default TenderEstView;