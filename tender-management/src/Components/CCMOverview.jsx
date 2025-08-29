import axios from "axios";
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react';
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
    const [selectedActivities, setSelectedActivities] = useState(new Set());
    const [selectedMappingType, setSelectedMappingType] = useState("1 : M");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [activitySearchQuery, setActivitySearchQuery] = useState("");
    const [expandedActivityFolders, setExpandedActivityFolders] = useState(new Set());
    const [costCodeTypes, setCostCodeTypes] = useState([]);
    const [activityGroups, setActivityGroups] = useState([]);
    const [costCodeActivities, setCostCodeActivities] = useState([]);
    const [loading, setLoading] = useState({
        costCodes: true,
        activityGroups: true,
        costCodeActivities: true
    });
    const [showAddActivityForm, setShowAddActivityForm] = useState(false);
    const [showMappingPopover, setShowMappingPopover] = useState(false);
    const [newActivity, setNewActivity] = useState({
        costCodeTypeId: "",
        activityGroupId: "",
        activityCode: "",
        activityName: "",
        quantity: 0,
        rate: 0,
        uomId: ""
    });
    const [mappingConfig, setMappingConfig] = useState({
        splitType: "",
        percentage: "",
        value: ""
    });
    const [selectedCostCodeType, setSelectedCostCodeType] = useState(null);

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

    const splitTypes = [
        { id: "percentage", name: "Percentage" },
        { id: "value", name: "Value" },
        { id: "equal", name: "Equal Split" }
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
        fetchActivityGroups();
        fetchCostCodeActivities();
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

    const fetchActivityGroups = () => {
        setLoading(prev => ({ ...prev, activityGroups: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/activityGroups`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setActivityGroups(res.data || []);
            } else {
                console.error('Failed to fetch activity groups:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching activity groups:', err);
        }).finally(() => {
            setLoading(prev => ({ ...prev, activityGroups: false }));
        });
    };

    const fetchCostCodeActivities = () => {
        setLoading(prev => ({ ...prev, costCodeActivities: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivities/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setCostCodeActivities(res.data || []);
            } else {
                console.error('Failed to fetch cost code activities:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching cost code activities:', err);
        }).finally(() => {
            setLoading(prev => ({ ...prev, costCodeActivities: false }));
        });
    };

    const addActivityGroup = () => {
        if (!newActivity.costCodeTypeId || !newActivity.activityCode || !newActivity.activityName) {
            alert("Please fill all required fields");
            return;
        }

        const activityGroupData = {
            costCodeTypeId: newActivity.costCodeTypeId,
            activityCode: newActivity.activityCode,
            activityName: newActivity.activityName,
        };

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/activityGroup/add`, activityGroupData, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setNewActivity({
                    costCodeTypeId: "",
                    activityGroupId: "",
                    activityCode: "",
                    activityName: "",
                    quantity: 0,
                    rate: 0,
                    uomId: ""
                });
                setShowAddActivityForm(false);
                fetchActivityGroups();
            } else {
                console.error('Failed to add activity group:', res.status);
                alert('Failed to add activity group');
            }
        }).catch(err => {
            console.error('Error adding activity group:', err);
            alert('Error adding activity group');
        });
    };

    const saveCostCodeMapping = () => {
        if (selectedBOQs.size === 0 || selectedActivities.size === 0) {
            alert("Please select BOQ items and activities to map");
            return;
        }

        const costCodeDtos = Array.from(selectedBOQs).map(boqId => {
            return {
                boqId: parseInt(boqId, 10),
                activityCode: newActivity.activityCode || "",
                activityName: newActivity.activityName || "",
                quantity: newActivity.quantity || 1,
                rate: newActivity.rate || 0,
                amount: (newActivity.quantity || 1) * (newActivity.rate || 0),
                uomId: newActivity.uomId || "",
                mappingType: selectedMappingType,
                costCodeTypeId: newActivity.costCodeTypeId || "",
                activityGroupId: newActivity.activityGroupId || "",
                projectId: projectId
            };
        });

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/costCode/save/${projectId}`, costCodeDtos, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                alert(`Cost code mapping saved successfully for ${selectedBOQs.size} BOQ items!`);
                setShowMappingPopover(false);
                setMappingConfig({
                    splitType: "",
                    percentage: "",
                    value: ""
                });
                setSelectedBOQs(new Set());
                setSelectedActivities(new Set());
                fetchCostCodeActivities();
            } else {
                console.error('Failed to save cost code mapping:', res.status);
                alert('Failed to save cost code mapping');
            }
        }).catch(err => {
            console.error('Error saving cost code mapping:', err);
            alert('Error saving cost code mapping');
        });
    };

    const deleteCostCodeActivity = (costCodeId) => {
        if (window.confirm("Are you sure you want to delete this cost code activity?")) {
            axios.delete(`${import.meta.env.VITE_API_BASE_URL}/costCode/delete/${costCodeId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    alert("Cost code activity deleted successfully!");
                    fetchCostCodeActivities();
                } else {
                    console.error('Failed to delete cost code activity:', res.status);
                    alert('Failed to delete cost code activity');
                }
            }).catch(err => {
                console.error('Error deleting cost code activity:', err);
                alert('Error deleting cost code activity');
            });
        }
    };

    const handleCancelAddActivity = () => {
        setShowAddActivityForm(false);
        setNewActivity({
            costCodeTypeId: "",
            activityGroupId: "",
            activityCode: "",
            activityName: "",
            quantity: 0,
            rate: 0,
            uomId: ""
        });
    };

    const handleRightArrowClick = () => {
        if (selectedBOQs.size === 0) {
            alert("Please select at least one BOQ item to map");
            return;
        }

        if (selectedActivities.size == 0) {
            alert("Please select at least one Activity Group to map");
            return;
        }

        if (selectedMappingType === "1 : 1" && selectedBOQs.size !== 1) {
            alert("One to One mapping requires exactly one BOQ item to be selected");
            return;
        }

        if (selectedMappingType === "1 : M" && selectedBOQs.size !== 1) {
            alert("One to Many mapping requires exactly one BOQ item to be selected");
            return;
        }

        setShowMappingPopover(true);
    };

    const handleLeftArrowClick = () => {
        setSelectedActivities(new Set());
    };

    const handleActivitySelection = (activityId, isSelected) => {
        if (selectedMappingType === "1 : 1" && isSelected && selectedActivities.size >= 1) {
            alert("One to One mapping allows only one activity to be selected");
            return;
        }

        setSelectedActivities(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(activityId);
            } else {
                newSet.delete(activityId);
            }
            return newSet;
        });
    };

    const handleCostCodeTypeSelection = (costCodeTypeId) => {
        setSelectedCostCodeType(costCodeTypeId);
        setNewActivity(prev => ({ ...prev, costCodeTypeId }));
    };

    const handleActivityGroupSelection = (activityGroupId) => {
        handleActivitySelection(activityGroupId, true);
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
        if (selectedMappingType === "1 : 1" && isSelected && selectedBOQs.size >= 1) {
            alert("One to One mapping allows only one BOQ item to be selected");
            return;
        }

        if (selectedMappingType === "1 : M" && isSelected && selectedBOQs.size >= 1) {
            alert("One to Many mapping allows only one BOQ item to be selected");
            return;
        }

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
        if (costCodeActivities.length === 0) {
            alert("No cost code activities to save. Please configure mappings first.");
            return;
        }

        alert(`All cost code activities saved successfully!`);
    };

    const handleReset = () => {
        setSelectedMappingType("1 : M");
        setSelectedBOQs(new Set());
        setSelectedActivities(new Set());
        setSearchQuery("");
        setExpandedFolders(new Set());
        setActivitySearchQuery("");
        setExpandedActivityFolders(new Set());
        setSelectedCostCodeType(null);
    };

    const filteredBOQTree = useMemo(() => {
        if (!searchQuery.trim()) {
            return boqTree;
        }

        const query = searchQuery.toLowerCase().trim();

        const filterTree = (nodes) => {
            return nodes
                .map(node => ({ ...node }))
                .filter(node => {
                    if (
                        node.boqCode.toLowerCase().includes(query) ||
                        (node.boqName && node.boqName.toLowerCase().includes(query))
                    ) {
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

    const filteredActivityGroups = useMemo(() => {
        if (!activitySearchQuery.trim()) {
            return activityGroups;
        }

        const query = activitySearchQuery.toLowerCase().trim();

        return activityGroups.filter(group =>
            (group.activityCode && group.activityCode.toLowerCase().includes(query)) ||
            (group.activityName && group.activityName.toLowerCase().includes(query)) ||
            (group.costCodeType && group.costCodeType.costCodeName && group.costCodeType.costCodeName.toLowerCase().includes(query))
        );
    }, [activityGroups, activitySearchQuery]);

    const activityGroupsByCostCodeType = useMemo(() => {
        const grouped = {};
        activityGroups.forEach(group => {
            const costCodeTypeId = group.costCodeType?.id || 'uncategorized';
            if (!grouped[costCodeTypeId]) {
                grouped[costCodeTypeId] = {
                    costCodeType: group.costCodeType,
                    activityGroups: []
                };
            }
            grouped[costCodeTypeId].activityGroups.push(group);
        });
        return grouped;
    }, [activityGroups]);

    const BOQNode = ({ boq, level = 0 }) => {
        const hasChildren = boq.children && boq.children.length > 0;
        const isSelected = selectedBOQs.has(boq.boqCode);
        const total = boq.calculatedTotal || 0;
        const isExpanded = expandedFolders.has(boq.boqCode);
        const isMapped = costCodeActivities.some(activity => activity.boq && activity.boq.boqCode === boq.boqCode);

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
                            {isMapped && <Check size={16} className="text-success ms-2" />}
                        </div>
                        {!boq.parentBOQ && (
                            <span className="text-nowrap text-secondary ms-auto mb-2" style={{ minWidth: '100px' }}>
                                $ {total.toLocaleString()}
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
                    disabled={isMapped}
                />
                <div className="d-flex align-items-center flex-grow-1 pt-1">
                    <span style={{ width: '16px' }}></span>
                    <SmallFolder style={{ minWidth: '16px' }} />
                    <div className="d-flex flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between">
                            <span className=" me-2 text-nowrap" >{boq.boqCode}</span>
                            <span>-</span>
                            <span className="ms-2 text-nowrap">{boq.boqName}</span>
                            {isMapped && <Check size={16} className="text-success ms-2" />}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const CostCodeTypeNode = ({ costCodeTypeId, data }) => {
        const isExpanded = expandedActivityFolders.has(costCodeTypeId);
        const costCodeType = data.costCodeType;
        const activityGroups = data.activityGroups;
        const isSelected = selectedCostCodeType === costCodeTypeId;

        const handleFolderToggle = (e) => {
            e.stopPropagation();
            toggleActivityFolder(costCodeTypeId);
        };

        const handleCostCodeTypeClick = (e) => {
            e.stopPropagation();
            handleCostCodeTypeSelection(costCodeTypeId);
        };

        return (
            <div className="mb-3">
                <div
                    className={`d-flex align-items-center cursor-pointer py-2 ${isSelected ? 'bg-primary bg-opacity-10' : ''}`}
                    onClick={handleCostCodeTypeClick}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="me-2" onClick={handleFolderToggle}>
                        {isExpanded ? <DropDown /> : <ClosedList />}
                    </span>
                    <LargeFolder />
                    <div className="d-flex flex-grow-1 ms-2">
                        <span className="fw-bold">{costCodeType?.costCodeName || 'Uncategorized'}</span>
                    </div>
                </div>
                {isExpanded && (
                    <div className="ms-4 mt-2">
                        {activityGroups.map((group) => (
                            <ActivityGroupNode key={group.id} group={group} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const ActivityGroupNode = ({ group }) => {
        const isExpanded = expandedActivityFolders.has(group.id);
        const isSelected = selectedActivities.has(group.id);
        const isMapped = costCodeActivities.some(activity => activity.activityGroup && activity.activityGroup.id === group.id);

        const handleFolderToggle = (e) => {
            e.stopPropagation();
            toggleActivityFolder(group.id);
        };

        const handleActivityGroupClick = (e) => {
            e.stopPropagation();
            handleActivityGroupSelection(group.id);
        };

        return (
            <div className="mb-2">
                <div
                    className={`d-flex align-items-center cursor-pointer py-2 ${isSelected ? 'bg-primary bg-opacity-10' : ''}`}
                    onClick={handleActivityGroupClick}
                    style={{ cursor: 'pointer' }}
                >
                    <span className="me-2">
                        {isExpanded && group.activities && group.activities.length > 0 ? <DropDown /> : group.activities && group.activities.length > 0 ? <ClosedList /> : ""}
                        <MediumFolder />
                    </span>

                    <div className="d-flex flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between">
                            <span className="me-2 text-nowrap">{group.activityCode}</span>
                            <span>-</span>
                            <span className="ms-2 text-nowrap">{group.activityName}</span>
                            {isMapped && <Check size={16} className="text-success ms-2" />}
                        </div>
                    </div>
                </div>
                {isExpanded && group.activities && group.activities.length > 0 && (
                    <div className="ms-4 mt-2">
                        {group.activities.map((activity) => (
                            <ActivityNode key={activity.id} activity={activity} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const ActivityNode = ({ activity }) => {
        const isSelected = selectedActivities.has(activity.id);
        const isMapped = costCodeActivities.some(ca => ca.activity && ca.activity.id === activity.id);

        const handleCheckboxChange = (e) => {
            handleActivitySelection(activity.id, e.target.checked);
        };

        return (
            <div className="d-flex align-items-center py-2">
                <input
                    type="checkbox"
                    className="form-check-input flex-shrink-0 me-2"
                    style={{ borderColor: '#0051973D', width: '18px', height: '18px' }}
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    disabled={isMapped}
                />
                <div className="d-flex align-items-center flex-grow-1">
                    <FileText size={16} className="text-muted me-2" />
                    <div className="d-flex flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between">
                            <span className="me-2 text-nowrap">{activity.activityCode}</span>
                            <span>-</span>
                            <span className="ms-2 text-nowrap">{activity.activityName}</span>
                            {isMapped && <Check size={16} className="text-success ms-2" />}
                        </div>
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
                            className={`p-3 m-2 rounded h-100 d-flex flex-column ${selectedMappingType === type.key
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border"
                                }`}
                            style={{
                                cursor: "pointer",
                                minWidth: "200px",
                                transition: "all 0.2s ease",
                                border: '0.5px solid #0051973D'
                            }}
                            onClick={() => setSelectedMappingType(type.key)}
                        >
                            <div className="d-flex flex-column h-100">
                                <div className="mb-2">
                                    <h6 className="mb-1">{type.title}</h6>
                                    <p className="text-muted small mb-2">{type.desc}</p>
                                </div>
                                <div className="mt-auto">
                                    <div className="text-start">
                                        <small className="text-muted">
                                            {type.key === "1 : M" ? (
                                                <span className="d-flex align-items-center">
                                                    <span className="d-flex align-items-center me-2 ">
                                                        <span className="bg-primary me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        BOQ
                                                    </span>
                                                    <span className="me-2">→</span>
                                                    <span className="d-flex align-items-center">
                                                        <span className="bg-success me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        <span className="bg-success me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        <span className="bg-success me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        Activities
                                                    </span>
                                                </span>
                                            ) : type.key === "1 : 1" ? (
                                                <span className="d-flex align-items-center">
                                                    <span className="d-flex align-items-center me-2">
                                                        <span className="bg-primary me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        BOQ
                                                    </span>
                                                    <span className="me-2">→</span>
                                                    <span className="d-flex align-items-center">
                                                        <span className="bg-success me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        Activity
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="d-flex align-items-center">
                                                    <span className="d-flex align-items-center me-2">
                                                        <span className="bg-primary me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        <span className="bg-primary me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                        <span className="bg-primary me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
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
                        </div>
                    </div>
                ))}
            </div>

            <div className="row ms-1 py-4 ps-4 mt-3 pe-4 mb-4">
                <div className="col-md-5 bg-white rounded-3 p-3" style={{ border: '0.5px solid #0051973D' }}>
                    <div className="card border-0 bg-transparent">
                        <div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent pb-3">
                            <h5 className="mb-0">BOQ Details</h5>
                            <div className="text-muted small">
                                Selected: {selectedBOQs.size} {selectedMappingType === "1 : 1" || selectedMappingType === "1 : M" ? "(Max: 1)" : ""}
                            </div>
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
                                onClick={handleRightArrowClick}
                            />
                        </div>

                        <small className="text-nowrap mt-2 mb-1 ">Selected Type:</small>
                        <div className="fs-6 text-nowrap mb-2 text-primary">{selectedMappingType} Mapping</div>

                        <div className="d-flex justify-content-center">
                            <ArrowLeft
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow "
                                style={{ width: "60px", height: "60px", cursor: "pointer" }}
                                onClick={handleLeftArrowClick}
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

                        <div className="card-body boq-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {showAddActivityForm ? (
                                <div className="mb-4 p-3 border rounded" style={{ borderColor: '#0051973D' }}>
                                    <div className="d-flex"><h6 className="mb-3">New Activity</h6>
                                        <div className="border"></div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small mb-1">Cost Code Type</label>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small mb-1">Activity Code</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            value={newActivity.activityCode}
                                            onChange={(e) => setNewActivity({ ...newActivity, activityCode: e.target.value })}
                                            placeholder="Enter activity code"
                                            required
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
                                            required
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
                                            onClick={addActivityGroup}
                                        >
                                            + Add Activity Group
                                        </button>
                                    </div>
                                </div>
                            ) : loading.activityGroups ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading activity groups...</p>
                                </div>
                            ) : Object.keys(activityGroupsByCostCodeType).length > 0 ? (
                                Object.entries(activityGroupsByCostCodeType).map(([costCodeTypeId, data]) => (
                                    <CostCodeTypeNode key={costCodeTypeId} costCodeTypeId={costCodeTypeId} data={data} />
                                ))
                            ) : (
                                <div className="text-center text-muted py-4">
                                    No activity groups available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showMappingPopover && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Configure Mapping</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowMappingPopover(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <h6>Selected BOQ Items:</h6>
                                    <div className="border rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                        {Array.from(selectedBOQs).map(boqCode => {
                                            const boqItem = boqTree.flatMap(b => [b, ...(b.children || [])])
                                                .find(item => item.boqCode === boqCode);
                                            return (
                                                <div key={boqCode} className="d-flex align-items-center">
                                                    <SmallFolder className="me-2" />
                                                    <span>{boqCode} - {boqItem?.boqName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h6>Selected Activities:</h6>
                                    <div className="border rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                        {Array.from(selectedActivities).map(activityId => {
                                            let activity = null;
                                            for (const group of activityGroups) {
                                                if (group.id === activityId) {
                                                    activity = group;
                                                    break;
                                                }
                                                if (group.activities) {
                                                    activity = group.activities.find(a => a.id === activityId);
                                                    if (activity) break;
                                                }
                                            }
                                            return (
                                                <div key={activityId} className="d-flex align-items-center">
                                                    <FileText size={16} className="text-muted me-2" />
                                                    <span>{activity?.activityCode} - {activity?.activityName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Split Type</label>
                                    <select
                                        className="form-select"
                                        value={mappingConfig.splitType}
                                        onChange={(e) => setMappingConfig({ ...mappingConfig, splitType: e.target.value })}
                                    >
                                        <option value="">Select split type</option>
                                        {splitTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {mappingConfig.splitType === 'percentage' && (
                                    <div className="mb-3">
                                        <label className="form-label">Percentage</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={mappingConfig.percentage}
                                            onChange={(e) => setMappingConfig({ ...mappingConfig, percentage: e.target.value })}
                                            placeholder="Enter percentage"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                )}

                                {mappingConfig.splitType === 'value' && (
                                    <div className="mb-3">
                                        <label className="form-label">Value</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={mappingConfig.value}
                                            onChange={(e) => setMappingConfig({ ...mappingConfig, value: e.target.value })}
                                            placeholder="Enter value"
                                            min="0"
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newActivity.quantity}
                                        onChange={(e) => setNewActivity({ ...newActivity, quantity: parseFloat(e.target.value) || 0 })}
                                        placeholder="Enter quantity"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Rate</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newActivity.rate}
                                        onChange={(e) => setNewActivity({ ...newActivity, rate: parseFloat(e.target.value) || 0 })}
                                        placeholder="Enter rate"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowMappingPopover(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={saveCostCodeMapping}
                                >
                                    Save Cost Code Mapping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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