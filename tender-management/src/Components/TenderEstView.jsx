import { Children, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, ArrowRight, IndianRupee, Plus } from 'lucide-react';
import '../CSS/Styles.css';
import ActivityView from "../assest/Activity.svg?react";
import Directcost from '../assest/DirectCost.svg?react';
import Indirectcost from '../assest/IndirectCost.svg?react';
import Profit from '../assest/Profit.svg?react';
import CollapseIcon from '../assest/Collapse.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import { FolderTree, Eye, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const handleUnauthorized = () => {
    const navigate = useNavigate();
    navigate('/login');
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

function BOQView({ boq }) {
  const [boqTree, setBoqTree] = useState([]);
  useEffect(() => {
    if (Array.isArray(boq) && boq.length > 0) {
      const boqMap = new Map();
      boq.forEach((item) => {
        boqMap.set(item.id, { ...item, children: [] });
      });

      const roots = [];
      boq.forEach((item) => {
        if (item.parentBOQ?.id && boqMap.has(item.parentBOQ?.id)) {
          boqMap.get(item.parentBOQ?.id).children.push(boqMap.get(item.id));
        } else if (item.level === 1) {
          roots.push(boqMap.get(item.id));
        }
      });

      setBoqTree(roots);
    }
  }, [boq]);

  const BOQRow = ({ item, level = 0 }) => {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <>
        <tr className="border-b border-gray-200">
          <td className="py-2 px-4">
            <div
              className="flex items-center cursor-pointer"
              style={{ paddingLeft: `${level * 20}px` }}
              onClick={() => hasChildren && setExpanded(!expanded)}
            >
              {hasChildren && (
                <span className="mr-2 text-gray-600">
                  {expanded ? "▼" : "▶"}
                </span>
              )}
              <span>{item.boqName}</span>
            </div>
          </td>
          <td className="py-2 px-4 text-right">{item.quantity ?? "-"}</td>
          <td className="py-2 px-4">{item.uom ?? "-"}</td>
          <td className="py-2 px-4 text-right">{item.totalRate ?? "-"}</td>
          <td className="py-2 px-4 text-right">{item.totalAmount ?? "-"}</td>
        </tr>

        {expanded &&
          hasChildren &&
          item.children.map((child) => (
            <BOQRow key={child.id} item={child} level={level + 1} />
          ))}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h4 className="font-semibold mb-3 text-start">BOQ Structure</h4>
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="py-2 px-4 text-left">BOQ Name</th>
            <th className="py-2 px-4 text-right">Quantity</th>
            <th className="py-2 px-4 text-left">UOM</th>
            <th className="py-2 px-4 text-right">Rate</th>
            <th className="py-2 px-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {boqTree.length > 0 ? (
            boqTree.map((item) => <BOQRow key={item.id} item={item} />)
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No BOQ Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
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
                <button className={`btn ${contentView === 'boq' ? 'activeView' : 'bg-white'} px-3 py-2 border border-start-0 rounded-end rounded-0`} onClick={() => {setContentView('boq'); fetchBoq()}}>
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
                <BOQView boq={boq} />
            }
        </div>
    );
}
export default TenderEstView;