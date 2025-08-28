import axios from "axios";
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import ClosedList from '../assest/ClosedList.svg?react';
import DropDown from '../assest/DropDown.svg?react';
import LargeFolder from '../assest/LargeFolder.svg?react';
import MediumFolder from '../assest/MediumFolder.svg?react';
import SaveMappingIcon from '../assest/SaveMapping.svg?react';
import Search from '../assest/Search.svg?react';
import SmallFolder from '../assest/SmallFolder.svg?react';
import '../CSS/Styles.css';

const CCMOverview = () => {
    const [project, setProject] = useState();
    const { projectId } = useParams();
    const [boqTree, setBoqTree] = useState([]);
    const [selectedBOQs, setSelectedBOQs] = useState(new Set());
    const [selectedMappingType, setSelectedMappingType] = useState("1 : M");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [activitySearchQuery, setActivitySearchQuery] = useState("");
    const [expandedActivityFolders, setExpandedActivityFolders] = useState(new Set());
    const [costCodeTypes, setCostCodeTypes] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState({
        costCodes: true,
        activities: true
    });
    const [showAddActivityForm, setShowAddActivityForm] = useState(false);
    const [newActivity, setNewActivity] = useState({
        costCodeTypeId: "",
        activityCode: "",
        activityName: ""
    });

    const mappingTypes = [
        {
            key: "1 : M",
            title: "One to Many (1 : M)",
            desc: "Map 1 BOQ item to multiple activities",
            footer: "BOQ → Activities",
        },
        {
            key: "1 : 1",
            title: "One to One (1 : 1)",
            desc: "Map 1 BOQ item to 1 activity",
            footer: "BOQ → Activity",
        },
        {
            key: "M : 1",
            title: "Many to One (M : 1)",
            desc: "Map multiple BOQ items to 1 activity",
            footer: "BOQ → Activity",
        },
    ];

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setProject(res.data);
            } else {
                console.error('Failed to fetch project info:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching project info:', err);
        });

        fetchBOQData();
        fetchCostCodeTypes();
        fetchActivities();
    }, [projectId]);

    const fetchBOQData = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBOQ/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                const allBOQ = res.data || [];
                processBOQData(allBOQ);
            } else {
                console.error('Failed to fetch BOQ data:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching BOQ data:', err);
        });
    };

    const fetchCostCodeTypes = () => {
        setLoading(prev => ({ ...prev, costCodes: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setCostCodeTypes(res.data || []);
            } else {
                console.error('Failed to fetch cost code types:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching cost code types:', err);
        }).finally(() => {
            setLoading(prev => ({ ...prev, costCodes: false }));
        });
    };

    const fetchActivities = () => {
        setLoading(prev => ({ ...prev, activities: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/activities`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setActivities(res.data || []);
            } else {
                console.error('Failed to fetch activities:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching activities:', err);
        }).finally(() => {
            setLoading(prev => ({ ...prev, activities: false }));
        });
    };

    const addActivity = () => {
        if (!newActivity.costCodeTypeId || !newActivity.activityCode || !newActivity.activityName) {
            alert("Please fill all fields");
            return;
        }

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/activity/add`, {
            ...newActivity,
            projectId: projectId
        }, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setNewActivity({
                    costCodeTypeId: "",
                    activityCode: "",
                    activityName: ""
                });
                setShowAddActivityForm(false);
                fetchActivities();
            } else {
                console.error('Failed to add activity:', res.status);
                alert('Failed to add activity');
            }
        }).catch(err => {
            console.error('Error adding activity:', err);
            alert('Error adding activity');
        });
    };

    const handleCancelAddActivity = () => {
        setShowAddActivityForm(false);
        setNewActivity({
            costCodeTypeId: "",
            activityCode: "",
            activityName: ""
        });
    };

    const processBOQData = (allBOQ) => {
        const codeToBOQ = new Map();
        allBOQ.forEach(b => codeToBOQ.set(b.boqCode, { ...b, children: [] }));

        allBOQ.forEach(b => {
            if (b.parentBOQ && b.parentBOQ.boqCode) {
                const parent = codeToBOQ.get(b.parentBOQ.boqCode);
                if (parent) {
                    parent.children.push(codeToBOQ.get(b.boqCode));
                }
            }
        });

        const roots = allBOQ.filter(b => !b.parentBOQ).map(b => codeToBOQ.get(b.boqCode));

        const calculateTotals = (node) => {
            if (node.children && node.children.length > 0) {
                node.calculatedTotal = node.children.reduce((sum, child) => sum + calculateTotals(child), 0);
            } else {
                node.calculatedTotal = node.totalAmount || 0;
            }
            return node.calculatedTotal;
        };

        roots.forEach(root => calculateTotals(root));

        setBoqTree(roots);
    };

    const handleBOQSelection = (boqCode, isSelected) => {
        setSelectedBOQs(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(boqCode);
            } else {
                newSet.delete(boqCode);
            }
            return newSet;
        });
    };

    const toggleFolder = (boqCode) => {
        setExpandedFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(boqCode)) {
                newSet.delete(boqCode);
            } else {
                newSet.add(boqCode);
            }
            return newSet;
        });
    };

    const toggleActivityFolder = (folderId) => {
        setExpandedActivityFolders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(folderId)) {
                newSet.delete(folderId);
            } else {
                newSet.add(folderId);
            }
            return newSet;
        });
    };

    const handleSaveMapping = () => {
        alert(`Mapping saved successfully for ${selectedBOQs.size} BOQ items!`);
    };

    const handleReset = () => {
        setSelectedMappingType("1 : M");
        setSelectedBOQs(new Set());
        setSearchQuery("");
        setExpandedFolders(new Set());
        setActivitySearchQuery("");
        setExpandedActivityFolders(new Set());
    };

    const expandParentFolders = (node, codeToBOQ, newExpandedFolders) => {
        if (node.parentBOQ && node.parentBOQ.boqCode) {
            const parentCode = node.parentBOQ.boqCode;
            newExpandedFolders.add(parentCode);
            const parent = codeToBOQ.get(parentCode);
            if (parent) {
                expandParentFolders(parent, codeToBOQ, newExpandedFolders);
            }
        }
    };

    const filteredBOQTree = useMemo(() => {
        if (!searchQuery.trim()) {
            return boqTree;
        }

        const query = searchQuery.toLowerCase().trim();
        const codeToBOQ = new Map();

        const flattenBOQ = (nodes) => {
            nodes.forEach(node => {
                codeToBOQ.set(node.boqCode, node);
                if (node.children && node.children.length > 0) {
                    flattenBOQ(node.children);
                }
            });
        };

        flattenBOQ(boqTree);

        const matchingCodes = new Set();
        codeToBOQ.forEach((node, code) => {
            if (
                code.toLowerCase().includes(query) ||
                (node.boqName && node.boqName.toLowerCase().includes(query))
            ) {
                matchingCodes.add(code);
            }
        });

        const newExpandedFolders = new Set(expandedFolders);
        matchingCodes.forEach(code => {
            const node = codeToBOQ.get(code);
            if (node) {
                expandParentFolders(node, codeToBOQ, newExpandedFolders);
            }
        });
        setExpandedFolders(newExpandedFolders);

        const filterTree = (nodes) => {
            return nodes
                .map(node => ({ ...node }))
                .filter(node => {
                    if (matchingCodes.has(node.boqCode)) {
                        return true;
                    }

                    if (node.children && node.children.length > 0) {
                        const filteredChildren = filterTree(node.children);
                        node.children = filteredChildren;
                        return filteredChildren.length > 0;
                    }

                    return false;
                });
        };

        return filterTree(boqTree);
    }, [boqTree, searchQuery]);

    const filteredActivityData = useMemo(() => {
        if (!activitySearchQuery.trim()) {
            return costCodeTypes;
        }

        const query = activitySearchQuery.toLowerCase().trim();

        const filterActivities = (items) => {
            return items
                .map(item => ({ ...item }))
                .filter(item => {
                    if (item.costCodeName && item.costCodeName.toLowerCase().includes(query)) {
                        return true;
                    }

                    if (item.activities && item.activities.length > 0) {
                        const filteredChildren = filterActivities(item.activities);
                        item.activities = filteredChildren;
                        return filteredChildren.length > 0;
                    }

                    return false;
                });
        };

        return filterActivities(costCodeTypes);
    }, [costCodeTypes, activitySearchQuery]);

    const BOQNode = ({ boq, level = 0 }) => {
        const hasChildren = boq.children && boq.children.length > 0;
        const isSelected = selectedBOQs.has(boq.boqCode);
        const total = boq.calculatedTotal || 0;
        const isExpanded = expandedFolders.has(boq.boqCode);

        const handleCheckboxChange = (e) => {
            handleBOQSelection(boq.boqCode, e.target.checked);
        };

        const handleFolderToggle = (e) => {
            e.stopPropagation();
            if (hasChildren) {
                toggleFolder(boq.boqCode);
            }
        };

        const getIcon = () => {
            if (!hasChildren) return <FileText size={16} className="text-muted me-1" />;

            if (level === 0) {
                return <LargeFolder />;
            } else if (level === 1) {
                return <MediumFolder />;
            } else {
                return <SmallFolder />;
            }
        };

        if (hasChildren) {
            return (
                <div
                    className={`mb-3 ${level === 0 ? " " : "border-start"} border-1 ps-3 py-3 pe-3 w-100`}
                    style={{ borderColor: '#0051973D' }}
                >
                    <div
                        className="d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={handleFolderToggle}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center mb-2">
                            <span className="me-2">
                                {isExpanded ? <DropDown /> : <ClosedList />}
                            </span>
                            <span>{getIcon()}</span>
                            <span className="fw-bold me-md-2 ms-2 text-nowrap" style={{ maxWidth: '80px' }}>{boq.boqCode}</span>
                            <span>-</span>
                            <span className="flex-start fw-bold ms-2 text-nowrap" style={{ maxWidth: '400px' }}>{boq.boqName}</span>

                        </div>
                        {!boq.parentBOQ && (
                            <span className="text-nowrap text-secondary ms-auto mb-2" style={{ minWidth: '100px' }}>
                                $ {total.toFixed(2).toLocaleString()}
                            </span>
                        )}
                    </div>
                    {isExpanded && (
                        <div className="ms-3 mt-2">
                            {boq.children.map((child, index) => (
                                <BOQNode key={index} boq={child} level={level + 1} />
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className="d-flex align-items-center py-2">
                <input
                    type="checkbox"
                    className="form-check-input flex-shrink-0"
                    style={{ borderColor: '#0051973D', width: '18px', height: '18px' }}
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                />
                <div className="d-flex align-items-center flex-grow-1 pt-1">
                    <span style={{ width: '16px' }}></span>
                    <SmallFolder style={{ minWidth: '16px' }} />
                    <div className="d-flex flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between">
                            <span className=" me-2 text-nowrap" >{boq.boqCode}</span>
                            <span>-</span>
                            <span className="ms-2 text-nowrap">{boq.boqName}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ActivityNode = ({ activity, level = 0, costCodeTypeId }) => {
        const isExpanded = expandedActivityFolders.has(activity.id);

        const handleFolderToggle = (e) => {
            e.stopPropagation();
            toggleActivityFolder(activity.id);
        };

        const getIcon = () => {
            if (level === 0) {
                return <LargeFolder />;
            } else if (level === 1) {
                return <MediumFolder />;
            } else {
                return <SmallFolder />;
            }
        };

        return (
            <div className="d-flex align-items-center py-2 ms-3">
                <input
                    type="checkbox"
                    className="form-check-input flex-shrink-0 me-2"
                    style={{ borderColor: '#0051973D', width: '18px', height: '18px' }}
                />
                <SmallFolder style={{ minWidth: '16px' }} />
                <div className="d-flex flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                    <div className="d-flex justify-content-between">
                        <span className="me-2 text-nowrap">{activity.activityCode}</span>
                        <span>-</span>
                        <span className="ms-2 text-nowrap">{activity.activityName}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
                <div className="ms-3">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className='ms-2'>Cost Code Mapping</span>
                    <span className='ms-2'>-</span>
                    <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
                </div>
            </div>

            <div className="row bg-white rounded-3 ms-4 me-4 py-4 ps-4 mt-3 pe-4 mb-4 " style={{ border: '0.5px solid #0051973D' }}>
                <h5 className="card-title text-start fs-6 ms-1 mb-3">Select Mapping Type</h5>
                {mappingTypes.map((type) => (
                    <div className="col-md-6 col-lg-4 mb-3" key={type.key}>
                        <div
                            className={`p-3 m-2  rounded h-100 d-flex flex-column ${selectedMappingType === type.key
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border"
                                }`}
                            style={{
                                cursor: "pointer",
                                minWidth: "200px",
                                transition: "all 0.2s ease", border: '0.5px solid #0051973D'
                            }}
                            onClick={() => setSelectedMappingType(type.key)}
                        >
                            <h6 className="text-start">{type.title}</h6>
                            <p className=" small text-start flex-grow-1 p-0 m-0">{type.desc}</p>
                            <div className="text-start">
                                <small className="text-muted">
                                    {type.key === "1 : M" ? (
                                        <span className="d-flex align-items-center">
                                            <span className="d-flex align-items-center me-2 ">
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                BOQ
                                            </span>
                                            <span className="me-2">→</span>
                                            <span className="d-flex align-items-center">
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                Activities
                                            </span>
                                        </span>
                                    ) : type.key === "1 : 1" ? (
                                        <span className="d-flex align-items-center">
                                            <span className="d-flex align-items-center me-2">
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                BOQ
                                            </span>
                                            <span className="me-2">→</span>
                                            <span className="d-flex align-items-center">
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                Activity
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="d-flex align-items-center">
                                            <span className="d-flex align-items-center me-2">
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                BOQ
                                            </span>
                                            <span className="me-2">→</span>
                                            <span className="d-flex align-items-center">
                                                <span className="bg-success me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                Activity
                                            </span>
                                        </span>
                                    )}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row ms-1 py-4 ps-4 mt-3 pe-4 mb-4">
                <div className="col-md-5 bg-white rounded-3 p-3" style={{ border: '0.5px solid #0051973D' }}>
                    <div className="card border-0 bg-transparent">
                        <div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent pb-3">
                            <h5 className="mb-0">BOQ Details</h5>
                        </div>

                        <div className="position-relative mb-3 pb-1">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="search form-control ps-5"
                                placeholder="Search BOQ items..." style={{ border: '0.5px solid #0051973D', fontSize: "15px" }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="card-body boq-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredBOQTree.length > 0 ? (
                                filteredBOQTree.map((boq, index) => (
                                    <BOQNode key={index} boq={boq} />
                                ))
                            ) : (
                                <div className="text-center text-muted py-4">
                                    {boqTree.length > 0 ? "No matching BOQ items found" : "No BOQ data available"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-2 d-flex justify-content-center align-items-center ">
                    <div className="card text-center border-0 bg-transparent">
                        <div className="d-flex justify-content-center mb-2">
                            <ArrowRight
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow"
                                style={{ width: "60px", height: "60px", cursor: "pointer" }}
                            />
                        </div>

                        <small className="text-nowrap mt-2 mb-1 ">Selected Type:</small>
                        <div className="fs-6 text-nowrap mb-2 text-primary">{selectedMappingType} Mapping</div>

                        <div className="d-flex justify-content-center">
                            <ArrowLeft
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow "
                                style={{ width: "60px", height: "60px", cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-5 bg-white rounded-3 p-3" style={{ border: '0.5px solid #0051973D' }}>
                    <div className="card border-0 bg-transparent h-100">
                        <div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent pb-3">
                            <h5 className="mb-0">Activity Details</h5>
                            {!showAddActivityForm && (
                                <button
                                    className="border-0 bg-transparent"
                                    onClick={() => setShowAddActivityForm(true)}
                                >
                                    <small className="text-nowrap text-primary">+ Add Activity</small>
                                </button>
                            )}
                        </div>

                        <div className="position-relative mb-3 pb-1">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="search form-control ps-5"
                                placeholder="Search activities..." style={{ border: '0.5px solid #0051973D', fontSize: "15px" }}
                                value={activitySearchQuery}
                                onChange={(e) => setActivitySearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="card-body activity-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {showAddActivityForm ? (
                                <div className="mb-4 p-3 border rounded" style={{ borderColor: '#0051973D' }}>
                                    <h6 className="mb-3">New Activity</h6>
                                    <div className="mb-3">
                                        <label className="form-label small mb-1">Activity Code</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={newActivity.activityCode}
                                            onChange={(e) => setNewActivity({ ...newActivity, activityCode: e.target.value })}
                                            placeholder="Enter activity code"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small mb-1">Activity Name</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={newActivity.activityName}
                                            onChange={(e) => setNewActivity({ ...newActivity, activityName: e.target.value })}
                                            placeholder="Enter activity name"
                                        />
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={handleCancelAddActivity}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-primary"
                                            onClick={addActivity}
                                        >
                                            + Add Activity
                                        </button>
                                    </div>
                                </div>
                            ) :

                                loading.costCodes ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading activities...</p>
                                    </div>
                                ) : costCodeTypes.length > 0 ? (
                                    costCodeTypes.map((costCodeType) => {
                                        const typeActivities = activities.filter(activity =>
                                            activity.costCodeType && activity.costCodeType.id === costCodeType.id
                                        );

                                        return (
                                            <div key={costCodeType.id} className="mb-3">
                                                <div
                                                    className="d-flex align-items-center py-2 cursor-pointer"
                                                    onClick={() => toggleActivityFolder(costCodeType.id)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <span className="me-2">
                                                        {expandedActivityFolders.has(costCodeType.id) ? <DropDown /> : <ClosedList />}
                                                    </span>
                                                    <LargeFolder />
                                                    <span className="ms-2 fw-semibold">{costCodeType.costCodeName}</span>
                                                </div>
                                                {expandedActivityFolders.has(costCodeType.id) && typeActivities.length > 0 && (
                                                    <div className="ms-4 mt-2">
                                                        {typeActivities.map((activity) => (
                                                            <ActivityNode
                                                                key={activity.id}
                                                                activity={activity}
                                                                level={1}
                                                                costCodeTypeId={costCodeType.id}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        No activity data available
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row ">
                <div className="col-md-12">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <div className="d-flex justify-content-end gap-2">
                                <button className="bg-transparent border-0" style={{ color: "#3273AB" }} onClick={handleReset}>
                                    Reset
                                </button>
                                <button className="border-0 text-white p-2 rounded" style={{ backgroundColor: "#3273AB" }} onClick={handleSaveMapping}>
                                    <SaveMappingIcon className="ms-2" />
                                    <span className="ps-2">Save Mapping</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CCMOverview;