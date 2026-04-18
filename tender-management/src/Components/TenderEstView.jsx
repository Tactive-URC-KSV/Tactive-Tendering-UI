import { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, IndianRupee, Plus } from 'lucide-react';
import '../CSS/Styles.css';
import ActivityView from "../assest/Activity.svg?react";
import Directcost from '../assest/DirectCost.svg?react';
import Indirectcost from '../assest/IndirectCost.svg?react';
import Profit from '../assest/Profit.svg?react';
import CollapseIcon from '../assest/Collapse.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import { FolderTree, Eye, ChevronRight, ChevronDown, ChevronLeft, Search, Table, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useUom } from "../Context/UomContext";
import useDebounce from "../Utills/useDebounce";
import { searchBoq } from "../Utills/projectApi";
import { toast } from "react-toastify";


const handleUnauthorized = () => {
  // // window.location.href = '/login';
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
function BOQStructureView({ projectId }) {
  const navigate = useNavigate();
  const [parentBoq, setParentBoq] = useState([]);
  const [parentTree, setParentTree] = useState([]);
  const [expandedParentIds, setExpandedParentIds] = useState(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());
  const debouncedSearchQuery = useDebounce(searchQuery, 3000);
  const uoms = useUom();
  const [selectedBoqForModal, setSelectedBoqForModal] = useState(null);
  const [boqCurrentPage, setBoqCurrentPage] = useState(0);
  const [boqTotalPages, setBoqTotalPages] = useState(0);
  const [boqTotalItems, setBoqTotalItems] = useState(0);
  const pageSize = 15;

  const expandParents = async (searchResults) => {
    const parentsToExpand = new Set();
    const parentsByLevel = new Map();

    const collectParents = (boq) => {
      if (boq.parentBOQ) {
        const p = boq.parentBOQ;
        parentsToExpand.add(p.id);
        if (!parentsByLevel.has(p.level)) {
          parentsByLevel.set(p.level, new Set());
        }
        parentsByLevel.get(p.level).add(p.id);
        collectParents(p);
      }
    };
    searchResults.forEach(item => collectParents(item));

    let currentTree = [...parentTree];

    const sortedLevels = Array.from(parentsByLevel.keys()).sort((a, b) => a - b);

    const updateTreeStruct = (tree, nodeId, children) => {
      return tree.map(node => {
        if (node.id === nodeId) {
          return { ...node, children: children };
        }
        if (Array.isArray(node.children)) {
          return { ...node, children: updateTreeStruct(node.children, nodeId, children) };
        }
        return node;
      });
    };

    const findNodeInTree = (tree, nodeId) => {
      for (const node of tree) {
        if (node.id === nodeId) return node;
        if (Array.isArray(node.children)) {
          const found = findNodeInTree(node.children, nodeId);
          if (found) return found;
        }
      }
      return null;
    };

    for (const level of sortedLevels) {
      const levelIds = parentsByLevel.get(level);
      const promises = Array.from(levelIds).map(async (parentId) => {
        const node = findNodeInTree(currentTree, parentId);
        if (!node) return null;
        if (Array.isArray(node.children) && node.children.length > 0) return null;

        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${projectId}/${parentId}`,
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              }
            }
          );
          if (response.status === 200) {
            const childrenData = (response.data || []).map(child => ({
              ...child,
              children: (child.lastLevel === false) ? null : []
            }));
            return { parentId, childrenData };
          }
        } catch (e) {
          console.error("Error fetching child boq during search expansion", e);
        }
        return null;
      });

      const results = await Promise.all(promises);
      for (const res of results) {
        if (res) {
          currentTree = updateTreeStruct(currentTree, res.parentId, res.childrenData);
        }
      }
    }

    setParentTree(currentTree);
    setExpandedParentIds(prev => {
      const next = new Set(prev);
      parentsToExpand.forEach(id => next.add(id));
      return next;
    });
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.trim()) {
        try {
          const data = await searchBoq(projectId, debouncedSearchQuery);
          const matchingIds = new Set(data.map(item => item.id));
          setHighlightedNodes(matchingIds);
          await expandParents(data);
        } catch (error) {
          console.error("Error searching BOQs:", error);
          toast.error("Failed to search BOQs");
        }
      } else {
        setHighlightedNodes(new Set());
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery, projectId]);
  const findUom = (uomId) => {
    const uom = uoms.find((uom) => uom.id === uomId);
    return uom?.uomCode;
  }
  const handleResource = (boqId) => {
    navigate(`/tenderestimation/${projectId}/resourceadding/${boqId}`);
  }
  const refreshParentBoqData = async (page = 0) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${projectId}`, {
        params: { page, size: pageSize },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.status === 200) {
        const { data, currentPage, totalPages, totalItems } = res.data;
        setParentBoq(data || []);
        handleParentBoqTree(data || []);
        setBoqCurrentPage(currentPage);
        setBoqTotalPages(totalPages);
        setBoqTotalItems(totalItems);
      } else {
        console.error('Failed to fetch BOQ data:', res.status);
        setParentBoq([]);
        setBoqTotalPages(0);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        // navigate('/login');
      }
      setParentBoq([]);
      setBoqTotalPages(0);
    }
  };
  const handleParentBoqTree = (data = parentBoq) => {
    if (Array.isArray(data) && data.length > 0) {
      const parentTree = new Map();
      data.forEach(parent => {
        const parentId = parent.id;
        if (!parentTree.has(parentId)) {
          parentTree.set(parentId, {
            ...parent,
            children: (parent.lastLevel === false) ? null : []
          });
        }
      })
      setParentTree(Array.from(parentTree.values()))
    }
  }
  const updateNodeInTree = (tree, nodeId, newProps) => {
    return tree.map(node => {
      if (node.id === nodeId) {
        return { ...node, ...newProps };
      }
      if (Array.isArray(node.children)) {
        return { ...node, children: updateNodeInTree(node.children, nodeId, newProps) };
      }
      return node;
    });
  };
  const fetchChildrenBoq = async (parentId) => {
    const findNode = (tree) => {
      for (const node of tree) {
        if (node.id === parentId) {
          return node;
        }
        if (Array.isArray(node.children)) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    const parentNode = findNode(parentTree);
    if (parentNode && parentNode.children !== null) {
      return;
    }
    setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: 'pending' }));
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${projectId}/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.status === 200) {
        const childrenData = (response.data || []).map(child => ({
          ...child,
          children: (child.lastLevel === false) ? null : []
        }));
        setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: childrenData }));
      } else {
        console.error('Failed to fetch children BOQ data:', response.status);
        setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        // navigate('/login');
      }
      console.error('Error fetching children BOQ data:', err);
      setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
    }
  };
  const handleToggle = (parentId) => {
    setExpandedParentIds(prevSet => {
      const newSet = new Set(prevSet);
      const isExpanded = newSet.has(parentId);
      if (isExpanded) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
        fetchChildrenBoq(parentId);
      }
      return newSet;
    });
  };
  useEffect(() => {
    refreshParentBoqData();
  }, [projectId, navigate]);

  const BOQNode = ({ boq, level = 0 }) => {
    const canExpand = boq.level === 1 || boq.level === 2 || boq.level === 3;
    const isExpanded = expandedParentIds.has(boq.id);
    const childrenStatus = boq.children;
    const isLoading = isExpanded && childrenStatus === 'pending';
    const hasFetchedChildren = Array.isArray(childrenStatus) && childrenStatus.length > 0;
    const hasNoChildren = Array.isArray(childrenStatus) && childrenStatus.length === 0;

    let leafChildren = [];
    let nonLeafChildren = [];

    if (hasFetchedChildren) {
      leafChildren = childrenStatus.filter(child => child.lastLevel === true);
      nonLeafChildren = childrenStatus.filter(child => child.lastLevel === false);
    }
    const hasLeafChildren = leafChildren.length > 0;
    const hasNonLeafChildren = nonLeafChildren.length > 0;
    const BoqIcon = isExpanded ? ChevronDown : ChevronRight;
    const boqNameDisplay = boq.boqName && boq.boqName.length > 80
      ? boq.boqName.substring(0, 80) + '...'
      : boq.boqName;
    const indentation = level * 10;
    if (boq.lastLevel === true) {
      return (
        <tr className="boq-leaf-row bg-white" style={{ borderBottom: '1px solid #eee', backgroundColor: highlightedNodes.has(boq.id) ? '#EFF6FF' : 'white' }}>
          <td className="px-2">{boq.boqCode}</td>
          <td className="px-2" title="Click to view full BOQ Name" onClick={(e) => { e.stopPropagation(); setSelectedBoqForModal(boq); }} style={{ cursor: 'pointer' }}>{boqNameDisplay}</td>
          <td className="px-2">{boq?.uom?.uomCode || '-'}</td>
          <td className="px-2">{boq.quantity?.toFixed(3) || 0}</td>
          <td className="px-2">
            <button className="btn btn-sm" style={{ background: "#DCFCE7", cursor: "pointer" }} onClick={() => handleResource(boq.id)}><Eye color="#15803D" size={20} /><span className="ms-1" style={{ color: '#15803D' }}>View</span></button>
          </td>
        </tr>
      );
    }

    return (
      <div
        className="boq-non-leaf-container rounded-3"
        key={boq.id}
        style={{ marginLeft: `${indentation}px` }}
      >
        <div
          className="parent-boq text-start p-3 rounded-2 d-flex flex-column mb-4"
          style={{ cursor: canExpand ? 'pointer' : 'default', backgroundColor: highlightedNodes.has(boq.id) ? '#EFF6FF' : (boq.level === 2 && 'white'), borderLeft: `${isExpanded ? '0.5px solid #0051973D' : 'none'}` }}
        >
          <div className="d-flex"
            onClick={(e) => {
              if (boq.level > 0) e.stopPropagation();
              if (canExpand) handleToggle(boq.id);
            }}>
            {canExpand ? <BoqIcon size={18} /> : <span style={{ width: 20, marginRight: 4 }}></span>}

            <span className="ms-2 fw-bold">{boq.boqCode}</span>
            <span className="ms-3" title="Click to view full BOQ Name" onClick={(e) => { e.stopPropagation(); setSelectedBoqForModal(boq); }} style={{ cursor: 'pointer' }}>{boqNameDisplay}</span>
          </div>

          {isExpanded && canExpand && (
            <div
              className="children-section mt-1"
            >
              {isLoading && (
                <div className="text-muted p-2">Loading items...</div>
              )}

              {hasFetchedChildren && (
                <div className="children-content mt-2">
                  {hasLeafChildren && (
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead>
                          <tr style={{ borderBottom: '0.5px solid #0051973D', color: '#005197' }}>
                            <th className="px-2">BOQ Code</th>
                            <th className="px-2">BOQ Name</th>
                            <th className="px-2">UOM</th>
                            <th className="px-2">Quantity</th>
                            <th className="px-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leafChildren.map(child => (
                            <BOQNode key={child.id} boq={child} level={level + 1} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {hasNonLeafChildren && (
                    <div className="p-0">
                      {nonLeafChildren.map(child => (
                        <BOQNode key={child.id} boq={child} level={level + 1} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {hasNoChildren && (
                <div className="no-items-message text-muted p-2">
                  No items found.
                </div>
              )}
            </div>
          )}
        </div>


      </div>
    );
  }

  const visibleTree = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return parentTree;

    const filterTree = (nodes) => {
      return nodes.reduce((acc, node) => {
        let filteredChildren = [];
        if (Array.isArray(node.children)) {
          filteredChildren = filterTree(node.children);
        }

        if (highlightedNodes.has(node.id) || filteredChildren.length > 0) {
          acc.push({
            ...node,
            children: filteredChildren.length > 0 ? filteredChildren : (Array.isArray(node.children) ? [] : node.children)
          });
        }
        return acc;
      }, []);
    };

    return filterTree(parentTree);

  }, [parentTree, debouncedSearchQuery, highlightedNodes]);

  // Ensure all visible parents with children are expanded when searching
  useEffect(() => {
    if (debouncedSearchQuery.trim() && visibleTree.length > 0) {
      const getAllIds = (nodes) => {
        let ids = [];
        nodes.forEach(node => {
          ids.push(node.id);
          if (Array.isArray(node.children)) {
            ids.push(...getAllIds(node.children));
          }
        });
        return ids;
      };
      setExpandedParentIds(prev => {
        const newSet = new Set(prev);
        getAllIds(visibleTree).forEach(id => newSet.add(id));
        return newSet;
      });
    }
  }, [visibleTree, debouncedSearchQuery]);

  return (

    <>
      <div className="bg-white rounded-3 ms-3 me-3 mt-5 p-2 d-flex flex-column" style={{ border: '0.5px solid #0051973D', maxHeight: '80vh' }}>
        <div className="d-flex justify-content-between mb-3 sticky-top bg-white p-2" style={{ top: 0, zIndex: 10, borderBottom: '1px solid #f0f0f0' }}>
          <div className="fw-bold text-start mt-2 ms-1 d-flex align-items-center gap-3">
            <span>BOQ Structure</span>
          </div>
          <div className="me-1 d-flex align-items-center gap-3">
            <div className="position-relative" style={{ width: '300px' }}>
              <Search
                className="position-absolute"
                style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', zIndex: 1 }}
                size={18}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Search BOQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingRight: '30px' }}
              />
            </div>
          </div>
        </div>

        <div className="boq-structure-list mt-3 flex-grow-1 overflow-y-auto px-2" style={{ scrollbarWidth: 'thin' }}>
          {visibleTree.length > 0 ? (
            visibleTree.map((boq) => (
              <BOQNode key={boq.id} boq={boq} level={0} />
            ))
          ) : (
            <div className="text-center p-5 text-muted">No Parent or Matching BOQ data available.</div>
          )}
        </div>
        {parentBoq.length > 0 && (
          <div className='d-flex justify-content-between align-items-center mt-3 p-3 border-top bg-white sticky-bottom' style={{ bottom: 0, zIndex: 10 }}>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted small">
                Showing {(boqCurrentPage * pageSize) + 1} - {Math.min((boqCurrentPage + 1) * pageSize, boqTotalItems)} of {boqTotalItems} Items
              </span>
            </div>
            <div className='d-flex align-items-center gap-2'>
              <button
                className="btn pagination-btn"
                style={{ padding: '4px 12px', border: '1px solid #dee2e6', cursor: boqCurrentPage === 0 ? 'default' : 'pointer', backgroundColor: boqCurrentPage === 0 ? '#f8f9fa' : 'white' }}
                onClick={() => refreshParentBoqData(boqCurrentPage - 1)}
                disabled={boqCurrentPage === 0}
              >
                <ChevronLeft size={16} />
              </button>
              <div className="px-3 py-1 rounded bg-light border small fw-medium">
                Page {boqCurrentPage + 1} of {boqTotalPages || 1}
              </div>
              <button
                className="btn pagination-btn"
                style={{ padding: '4px 12px', border: '1px solid #dee2e6', cursor: boqCurrentPage >= boqTotalPages - 1 ? 'default' : 'pointer', backgroundColor: boqCurrentPage >= boqTotalPages - 1 ? '#f8f9fa' : 'white' }}
                onClick={() => refreshParentBoqData(boqCurrentPage + 1)}
                disabled={boqCurrentPage >= boqTotalPages - 1}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function InternalBoq({ projectId }) {
  const [internalBoqList, setInternalBoqList] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const navigate = useNavigate();

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (projectId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/tender-estimation/complex/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.status === 200) {
          setInternalBoqList(Array.isArray(res.data) ? res.data : (res.data?.content || []));
        }
      }).catch(err => {
        if (err?.response?.status === 401) {
          // window.location.href = '/login';
        } else {
          toast.error(err?.response?.data?.message || 'Failed to fetch internal boq resources.');
        }
      });
    }
  }, [projectId]);

  const handleViewResource = (item) => {
    // The JSON payload uses "internalBoqId", but it logically represents the tenderEstimationId of the overarching complex resource.
    const tenderEstimationId = item.internalBoqId || item.id;
    if (!tenderEstimationId) {
      toast.error("Tender Estimation ID is missing.");
      return;
    }
    console.log("Calling Internal BOQ with:", tenderEstimationId);
    navigate(`/tenderestimation/${projectId}/resourceadding/internal?isInternal=true&tenderEstimationId=${tenderEstimationId}`);
  };

  return (
    <div className="bg-white ms-3 me-3 mt-4 rounded-3 p-4" style={{ border: '1px solid #0051973D' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Internal BOQ Resources</h5>
      </div>
      <div className="table-responsive">
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
            {internalBoqList?.length > 0 ? (
              internalBoqList.map((item, index) => {
                const isShared = item.items && item.items.length > 1;
                const rowId = item.internalBoqId || item.id || index;
                const isExpanded = expandedRows[rowId];
                
                return (
                  <Fragment key={rowId || index}>
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
                        {isShared && (
                          <span className="badge bg-warning text-dark ms-2">Shared BOQ</span>
                        )}
                      </td>
                      <td className="align-middle">{item.uomCode || 'N/A'}</td>
                      <td className="align-middle">{(item.totalQuantity || 0).toFixed(3)}</td>
                      <td className="align-middle">
                        <button className="btn btn-sm" style={{ background: "#DCFCE7", cursor: "pointer" }} onClick={() => handleViewResource(item)}>
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
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">No Content Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GlobalValuesView({ projectId }) {
  const [globalValues, setGlobalValues] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState({ id: null, name: '', value: 0 });

  const fetchGlobalValues = useCallback(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/globalValue/${projectId}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
    }).then(res => {
      if (res.status === 200) {
        setGlobalValues(res.data || []);
      }
    }).catch(err => {
      console.error("Error fetching global values:", err);
      toast.error("Failed to load global values");
    });
  }, [projectId]);

  useEffect(() => {
    fetchGlobalValues();
  }, [fetchGlobalValues]);

  const handleAdd = () => {
    setIsEdit(false);
    setCurrentValue({ id: null, name: '', value: 0, code: '' });
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setCurrentValue({ ...item });
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    toast.info("Delete functionality is currently processed via backend");
  };

  const handleSave = () => {
    if (!currentValue.name.trim()) {
      toast.error("Please enter a name");
      return;
    }
    
    const url = isEdit 
      ? `${import.meta.env.VITE_API_BASE_URL}/globalVaue/edit/${projectId}`
      : `${import.meta.env.VITE_API_BASE_URL}/globalValue/${projectId}`;
    
    const method = isEdit ? 'put' : 'post';
    
    // Ensure we send what the backend expects
    const payload = {
      ...currentValue,
      project: { id: projectId }
    };
    
    // For new items, omit the ID entirely so backend can generate UUID
    if (!isEdit) {
      delete payload.id;
    }

    axios[method](url, payload, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
    }).then(res => {
      if (res.status === 200) {
        toast.success(isEdit ? "Global value updated" : "Global value added");
        setOpenModal(false);
        fetchGlobalValues();
      }
    }).catch(err => {
      console.error("Error saving global value:", err);
      toast.error(err.response?.data?.message || "Failed to save global value");
    });
  };

  return (
    <div className="bg-white ms-3 me-3 mt-4 rounded-3 p-4" style={{ border: '1px solid #0051973D' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Global Values</h5>
        <button className="btn action-button" onClick={handleAdd}>
          <Plus size={16} /> <span className="ms-2">Add Global Value</span>
        </button>
      </div>
      <div className="table-responsive">
        <table className="table activity-table text-start">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Code</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {globalValues.length > 0 ? (
              globalValues.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.code || '-'}</td>
                  <td>{item.value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">No Global Values Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={() => setOpenModal(false)}>
          <div className="modal-dialog modal-md modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content rounded-3">
              <div className="modal-header d-flex justify-content-between">
                <p className="fw-bold mb-0">{isEdit ? "Edit Global Value" : "Add Global Value"}</p>
                <button className="btn-close" onClick={() => setOpenModal(false)}></button>
              </div>
              <div className="modal-body text-start">
                <div className="mb-3">
                  <label className="form-label text-start w-100">Name <span className="text-danger">*</span></label>
                  <input
                    className="form-input w-100"
                    placeholder="Enter name (e.g. Labor Rate)"
                    value={currentValue.name}
                    onChange={(e) => setCurrentValue({ ...currentValue, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-start w-100">Code</label>
                  <input
                    className="form-input w-100"
                    placeholder="Enter code (optional)"
                    value={currentValue.code || ''}
                    onChange={(e) => setCurrentValue({ ...currentValue, code: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-start w-100">Value <span className="text-danger">*</span></label>
                  <input
                    type="number"
                    className="form-input w-100"
                    placeholder="Enter value"
                    value={currentValue.value}
                    onChange={(e) => setCurrentValue({ ...currentValue, value: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AbstractView({ projectId }) {

  const [parentBoq, setParentBoq] = useState([]);
  const [parentTotals, setParentTotals] = useState({});
  const [selectedBoqForModal, setSelectedBoqForModal] = useState(null);
  const [boqCurrentPage, setBoqCurrentPage] = useState(0);
  const [boqTotalPages, setBoqTotalPages] = useState(0);
  const [boqTotalItems, setBoqTotalItems] = useState(0);
  const pageSize = 15;

  useEffect(() => {
    if (projectId) {
      refreshParentBoqData();
      fetchParentTotals();
    }
  }, [projectId]);

  // 🔹 Fetch Parent BOQ list (Level 1)
  const refreshParentBoqData = async (page = 0) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${projectId}`,
        {
          params: { page, size: pageSize },
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 200) {
        const { data, currentPage, totalPages, totalItems } = res.data;
        setParentBoq(data || []);
        setBoqCurrentPage(currentPage);
        setBoqTotalPages(totalPages);
        setBoqTotalItems(totalItems);
      } else {
        setParentBoq([]);
        setBoqTotalPages(0);
      }

    } catch (err) {
      setParentBoq([]);
      setBoqTotalPages(0);
    }
  };

  // 🔹 Fetch Calculated Totals Map
  const fetchParentTotals = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/project/getParentBoqTotals/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 200) {
        setParentTotals(res.data || {});
      }

    } catch (err) {
      setParentTotals({});
    }
  };

  const boqNameDisplay = (boqName) => {
    return boqName && boqName.length > 40
      ? boqName.substring(0, 40) + '...'
      : boqName;
  };

  return (
    <div
      className="p-3 bg-white rounded-3 ms-3 me-3 mt-5"
      style={{ border: '1px solid #0051973D' }}
    >
      <div className="text-start fw-bold">
        BOQ Work Packages
      </div>

      <div className="table-responsive">
        <table className="table table-borderless">
          <thead>
            <tr
              style={{
                borderBottom: '0.5px solid #0051973D',
                color: '#005197'
              }}
            >
              <th className="px-2">S.no</th>
              <th className="px-2 text-start">BOQ Code</th>
              <th className="px-2 text-start">BOQ Name</th>
              <th className="px-2 text-end">Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {parentBoq.map((boq, index) => {

              const calculatedTotal =
                parentTotals[boq.id] ?? 0;   // 👈 Map lookup

              return (
                <tr key={boq.id} className="bg-white">
                  <td className="px-2">{index + 1}</td>

                  <td
                    className="px-2 text-start"
                    title={boq.boqCode}
                  >
                    {boqNameDisplay(boq.boqCode)}
                  </td>

                  <td
                    className="px-2 text-start"
                    title="Click to view full BOQ Name"
                    onClick={(e) => { e.stopPropagation(); setSelectedBoqForModal(boq); }}
                    style={{ cursor: 'pointer' }}
                  >
                    {boq.boqName
                      ? boqNameDisplay(boq.boqName)
                      : '-'}
                  </td>

                  <td className="px-2 text-end fw-semibold">
                    {calculatedTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {parentBoq.length > 0 && (
          <tfoot style={{ borderTop: '2px solid #0051973D' }}>
            <tr className="bg-light">
              <td colSpan="3" className="px-2 text-end fw-bold" style={{ color: '#005197', paddingTop: '12px', paddingBottom: '12px' }}>Project Total Value</td>
              <td className="px-2 text-end fw-bold" style={{ color: '#005197', paddingTop: '12px', paddingBottom: '12px' }}>
                <IndianRupee size={15} className="me-1" style={{ marginTop: '-2px' }}/>
                {Object.values(parentTotals).reduce((sum, val) => sum + (val || 0), 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          </tfoot>
          )}

        </table>
      </div>
      {parentBoq.length > 0 && (
        <div className='d-flex justify-content-between align-items-center mt-3 p-3 border-top'>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted small">
              Showing {(boqCurrentPage * pageSize) + 1} - {Math.min((boqCurrentPage + 1) * pageSize, boqTotalItems)} of {boqTotalItems} Items
            </span>
          </div>
          <div className='d-flex align-items-center gap-2'>
            <button
              className="btn pagination-btn"
              style={{ padding: '4px 12px', border: '1px solid #dee2e6', cursor: boqCurrentPage === 0 ? 'default' : 'pointer', backgroundColor: boqCurrentPage === 0 ? '#f8f9fa' : 'white' }}
              onClick={() => refreshParentBoqData(boqCurrentPage - 1)}
              disabled={boqCurrentPage === 0}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 py-1 rounded bg-light border small fw-medium">
              Page {boqCurrentPage + 1} of {boqTotalPages || 1}
            </div>
            <button
              className="btn pagination-btn"
              style={{ padding: '4px 12px', border: '1px solid #dee2e6', cursor: boqCurrentPage >= boqTotalPages - 1 ? 'default' : 'pointer', backgroundColor: boqCurrentPage >= boqTotalPages - 1 ? '#f8f9fa' : 'white' }}
              onClick={() => refreshParentBoqData(boqCurrentPage + 1)}
              disabled={boqCurrentPage >= boqTotalPages - 1}
            >
              <ChevronRight size={16} />
            </button>
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
    </div>
  );
}
function TenderEstView({ projectId }) {
  const [project, setProject] = useState();
  const [contentView, setContentView] = useState('activity');
  const [costCodeTypes, setCostCodeTypes] = useState([]);
  const [activities, setActivities] = useState([]);
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
    <div className="container-fluid p-2 min-vh-100">
      <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
        <div>
          <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
          <span className='ms-2'>Tender Estimation</span>
          <span className='ms-2'>-</span>
          <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
        </div>
      </div>
      <div className="d-flex ms-3 mt-3">
        <button className={`btn ${contentView === 'activity' ? 'activeView' : 'bg-white'} px-3 py-2 border border-end-0 rounded-start rounded-0`} onClick={() => setContentView('activity')}>
          {contentView === 'activity' ?
            (<ActivityView />)
            :
            (<ActivityView style={{ filter: "brightness(0) saturate(100%) invert(25%) sepia(100%) saturate(6000%) hue-rotate(200deg) brightness(95%) contrast(90%)" }} />)
          }
          <span className="ms-2 fs-6">Abstract View</span>
        </button>
        <button className={`btn ${contentView === 'boq' ? 'activeView' : 'bg-white'} px-3 py-2 border border-start-0 border-end-0 rounded-0`} onClick={() => { setContentView('boq'); }}>
          {contentView === 'boq' ?
            (<FolderTree color="white" size={24} />)
            :
            (<FolderTree color="#005197" size={24} />)
          }
          <span className="ms-2 fs-6">BOQ View</span>
        </button>
        <button className={`btn ${contentView === 'internalBoq' ? 'activeView' : 'bg-white'} px-3 py-2 border border-start-0 rounded-0`} onClick={() => { setContentView('internalBoq'); }}>
          {contentView === 'internalBoq' ?
            (<Table color="white" size={24} />)
            :
            (<Table color="#005197" size={24} />)
          }
          <span className="ms-2 fs-6">Internal BOQ</span>
        </button>
        <button className={`btn ${contentView === 'globalValues' ? 'activeView' : 'bg-white'} px-3 py-2 border border-start-0 rounded-end rounded-0`} onClick={() => { setContentView('globalValues'); }}>
          {contentView === 'globalValues' ?
            (<Plus color="white" size={24} />)
            :
            (<Plus color="#005197" size={24} />)
          }
          <span className="ms-2 fs-6">Global Values</span>
        </button>
      </div>
      {contentView === 'activity' &&
        <AbstractView projectId={projectId} />
      }
      {contentView === 'boq' &&
        <BOQStructureView projectId={projectId} />
      }
      {contentView === 'internalBoq' &&
        <InternalBoq projectId={projectId} />
      }
      {contentView === 'globalValues' &&
        <GlobalValuesView projectId={projectId} />
      }
    </div>
  );
}
export default TenderEstView;