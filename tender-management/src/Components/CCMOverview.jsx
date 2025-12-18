import axios from "axios";
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClosedList from '../assest/ClosedList.svg?react';
import DeleteIcon from '../assest/DeleteIcon.svg?react';
import DropDown from '../assest/DropDown.svg?react';
import LargeFolder from '../assest/LargeFolder.svg?react';
import MediumFolder from '../assest/MediumFolder.svg?react';
import SaveMappingIcon from '../assest/SaveMapping.svg?react';
import Search from '../assest/Search.svg?react';
import SmallFolder from '../assest/SmallFolder.svg?react';
import '../CSS/Styles.css';



const CCMOverview = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [parentBoq, setParentBoq] = useState([]);
    const [parentTree, setParentTree] = useState([]);
    const [expandedParentIds, setExpandedParentIds] = useState(new Set());

    const [selectedBOQs, setSelectedBOQs] = useState(new Set());
    const [selectedActivities, setSelectedActivities] = useState(new Set());
    const [selectedMappingType, setSelectedMappingType] = useState("1 : M");

    const [searchQuery, setSearchQuery] = useState("");
    const [activitySearchQuery, setActivitySearchQuery] = useState("");

    const [pendingCounter, setPendingCounter] = useState(1);
    const [costCodeTypes, setCostCodeTypes] = useState([]);
    const [activityGroups, setActivityGroups] = useState([]);
    const [costCodeActivities, setCostCodeActivities] = useState([]);
    const [loading, setLoading] = useState({
        costCodes: true,
        activityGroups: true,
        costCodeActivities: true
    });

    const [showAddActivityForm, setShowAddActivityForm] = useState(false);
    const addActivityFormRef = useRef(null);
    const [newActivity, setNewActivity] = useState({
        costCodeTypeId: "",
        activityGroupId: "",
        activityCode: "",
        activityName: "",
        quantity: 0,
        rate: 0,
        uomId: ""
    });
    const [selectedCostCodeType, setSelectedCostCodeType] = useState(null);
    const [expandedActivityFolders, setExpandedActivityFolders] = useState(new Set());
    const [showMappingPopover, setShowMappingPopover] = useState(false);
    const [mappingActivities, setMappingActivities] = useState([]);
    const [totalPercentageUsed, setTotalPercentageUsed] = useState(0);
    const [boqTotalAmount, setBoqTotalAmount] = useState(0);
    const [boqTotalRate, setBoqTotalRate] = useState(0);
    const [boqTotalQuantity, setBoqTotalQuantity] = useState(0);
    const [splitType, setSplitType] = useState("quantity");

    const [pendingMappings, setPendingMappings] = useState([]);
    const [notification, setNotification] = useState(null);
    const [showNotification, setShowNotification] = useState(false);

    const [removedSavedIds, setRemovedSavedIds] = useState(new Set());
    const handleUnauthorized = () => {
        // navigate('/login');
    };
    const showAlert = (message, type = "info") => {
        switch (type) {
            case "error": toast.error(message); break;
            case "success": toast.success(message); break;
            case "warning": toast.warning(message); break;
            default: toast.info(message);
        }
    };
    const mappingTypes = [
        { key: "1 : M", title: "One to Many (1 : M)", desc: "Map 1 BOQ item to multiple activities", footer: "BOQ → Activities" },
        { key: "1 : 1", title: "One to One (1 : 1)", desc: "Map 1 BOQ item to 1 activity", footer: "BOQ → Activity" },
        { key: "M : 1", title: "Many to One (M : 1)", desc: "Map multiple BOQ items to 1 activity", footer: "BOQ → Activity" },
    ];
    const splitTypes = [
        { id: "rate", name: "Rate" },
        { id: "amount", name: "Amount" },
        { id: "quantity", name: "Quantity" },
        { id: "qty_rate", name: "Quantity & Rate" }
    ];
    const splitOption = splitTypes.map(t => ({ value: t.id, label: t.name }));
    useEffect(() => {
        const handler = (e) => {
            if (showAddActivityForm && addActivityFormRef.current && !addActivityFormRef.current.contains(e.target)) {
                handleCancelAddActivity();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showAddActivityForm]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(r => { if (r.status === 200) setProject(r.data); })
            .catch(e => { if (e?.response?.status === 401) handleUnauthorized(); });
        fetchParentBOQData();
        fetchCostCodeTypes();
        fetchActivityGroups();
        fetchCostCodeActivities();
    }, [projectId]);

    const fetchParentBOQData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${projectId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            });
            if (res.status === 200) {
                setParentBoq(res.data || []);
                handleParentBoqTree(res.data || []);
            } else {
                setParentBoq([]);
            }
        } catch (e) {
            if (e?.response?.status === 401) handleUnauthorized();
            setParentBoq([]);
        }
    };

    const handleParentBoqTree = (data = parentBoq) => {
        if (!Array.isArray(data) || data.length === 0) return;
        const map = new Map();
        data.forEach(p => {
            map.set(p.id, {
                ...p,
                children: p.lastLevel === false ? null : []
            });
        });
        setParentTree(Array.from(map.values()));
    };

    const handleToggle = (parentId) => {
        setExpandedParentIds(prev => {
            const n = new Set(prev);
            if (n.has(parentId)) {
                n.delete(parentId);
            } else {
                n.add(parentId);
                fetchChildrenBoq(parentId);
            }
            return n;
        });
    };

    const updateNodeInTree = (tree, nodeId, newProps) => {
        return tree.map(node => {
            if (node.id === nodeId) return { ...node, ...newProps };
            if (Array.isArray(node.children)) {
                return { ...node, children: updateNodeInTree(node.children, nodeId, newProps) };
            }
            return node;
        });
    };

    const fetchChildrenBoq = async (parentId) => {
        const findNode = (tree) => {
            for (const n of tree) {
                if (n.id === parentId) return n;
                if (Array.isArray(n.children)) {
                    const f = findNode(n.children);
                    if (f) return f;
                }
            }
            return null;
        };
        const node = findNode(parentTree);
        if (node && node.children !== null) return;

        setParentTree(prev => updateNodeInTree(prev, parentId, { children: 'pending' }));

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${projectId}/${parentId}`,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );
            if (res.status === 200) {
                const children = (res.data || []).map(c => ({
                    ...c,
                    children: c.lastLevel === false ? null : []
                }));
                setParentTree(prev => updateNodeInTree(prev, parentId, { children }));
            } else {
                setParentTree(prev => updateNodeInTree(prev, parentId, { children: [] }));
            }
        } catch (e) {
            if (e?.response?.status === 401) navigate('/login');
            setParentTree(prev => updateNodeInTree(prev, parentId, { children: [] }));
        }
    };

    const findBOQItem = (boqId) => {
        const search = (nodes) => {
            for (const n of nodes) {
                if (n.id === boqId) return n;
                if (Array.isArray(n.children)) {
                    const f = search(n.children);
                    if (f) return f;
                }
            }
            return null;
        };
        return search(parentTree);
    };

    const toggleBOQSelection = (boqId) => {
        if (selectedMappingType === "1 : M" && selectedBOQs.size >= 1 && !selectedBOQs.has(boqId)) {
            showAlert("One to Many mapping allows only one BOQ item to be selected", "error");
            return;
        }
        setSelectedBOQs(prev => {
            const n = new Set(prev);
            n.has(boqId) ? n.delete(boqId) : n.add(boqId);
            return n;
        });
    };

    const filteredBOQTree = useMemo(() => {
        if (!searchQuery.trim()) return parentTree;
        const q = searchQuery.toLowerCase().trim();
        const filter = (nodes) => nodes
            .map(n => ({ ...n }))
            .filter(n => {
                const match = n.boqCode.toLowerCase().includes(q) ||
                    (n.boqName && n.boqName.toLowerCase().includes(q));
                if (match) return true;
                if (Array.isArray(n.children)) {
                    const fc = filter(n.children);
                    n.children = fc;
                    return fc.length > 0;
                }
                return false;
            });
        return filter(parentTree);
    }, [parentTree, searchQuery]);
    const BOQNode = ({ boq, level = 0 }) => {
        const canExpand = boq.lastLevel === false;
        const isExpanded = expandedParentIds.has(boq.id);
        const childrenStatus = boq.children;
        const isLoading = isExpanded && childrenStatus === 'pending';
        const hasFetched = Array.isArray(childrenStatus) && childrenStatus.length > 0;
        const hasNoChildren = Array.isArray(childrenStatus) && childrenStatus.length === 0;

        let leafChildren = [], nonLeafChildren = [];
        if (hasFetched) {
            leafChildren = childrenStatus.filter(c => c.lastLevel);
            nonLeafChildren = childrenStatus.filter(c => !c.lastLevel);
        }
        const boqNameDisplay = boq.boqName && boq.boqName.length > 30
            ? boq.boqName.substring(0, 30) + '...'
            : boq.boqName;

        const Icon = isExpanded ? DropDown : ClosedList;

        if (boq.lastLevel) {
            return (
                <div className="d-flex align-items-center py-2">
                    <div className="d-flex align-items-center p-2 rounded-2" onClick={() => toggleBOQSelection(boq.id)} style={{ backgroundColor: `${selectedBOQs.has(boq.id) ? '#EFF6FFCC' : 'transparent'}`, border: `${selectedBOQs.has(boq.id) ? '1px solid #2563EB' : 'none'}` }}>
                        <SmallFolder />
                        <div className="d-flex flex-grow-1 ms-2" >
                            <div className="d-flex justify-content-between">
                                <span className="me-2 text-nowrap">{boq.boqCode}</span>
                                <span>-</span>
                                <span className="ms-2 text-nowrap" title={boq.boqName}>{boqNameDisplay}</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div
                className={`mb-1 ${level === 0 ? "" : "border-start"} border-1 ps-3 py-2 pe-3 w-100`}
                style={{ borderColor: '#0051973D' }}
            >
                <div
                    className="d-flex justify-content-between align-items-center cursor-pointer"
                    onClick={() => canExpand && handleToggle(boq.id)}
                    style={{ cursor: canExpand ? 'pointer' : 'default' }}
                >
                    <div className="d-flex align-items-center">
                        <span className="me-2">{canExpand ? <Icon /> : <span style={{ width: 20 }}></span>}</span>
                        {boq.level === 1 ? <LargeFolder /> : <MediumFolder />}
                        <span className="fw-bold me-md-2 ms-2 text-nowrap" style={{ maxWidth: "80px" }}>
                            {boq.boqCode}
                        </span>
                        <span>-</span>
                        <span className="flex-start fw-bold ms-2 text-nowrap" style={{ maxWidth: "400px" }} title={boq.boqName}>
                            {boqNameDisplay}
                        </span>
                    </div>
                </div>

                {isExpanded && canExpand && (
                    <div className="ms-3">
                        {isLoading && <div className="text-muted py-2">Loading...</div>}
                        {hasFetched && (
                            <>
                                {leafChildren.length > 0 && (
                                    leafChildren.map(c => (
                                        <BOQNode key={c.id} boq={c} level={level + 1} />
                                    ))
                                )}
                                {nonLeafChildren.map(c => (
                                    <BOQNode key={c.id} boq={c} level={level + 1} />
                                ))}
                            </>
                        )}
                        {hasNoChildren && <div className="text-muted py-2">No items found.</div>}
                    </div>
                )}
            </div>
        );
    };

    const fetchCostCodeTypes = () => {
        setLoading(p => ({ ...p, costCodes: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(r => { if (r.status === 200) setCostCodeTypes(r.data || []); })
            .catch(e => { if (e?.response?.status === 401) handleUnauthorized(); })
            .finally(() => setLoading(p => ({ ...p, costCodes: false })));
    };

    const fetchActivityGroups = () => {
        setLoading(p => ({ ...p, activityGroups: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/activityGroups`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (r.status === 200)
                setActivityGroups(r.data || []);
        }).catch(e => {
            if (e?.response?.status === 401)
                handleUnauthorized();
        }).finally(() =>
            setLoading(p => ({ ...p, activityGroups: false }))
        );
    };

    const fetchCostCodeActivities = () => {
        setLoading(p => ({ ...p, costCodeActivities: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/${projectId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(r => { if (r.status === 200) setCostCodeActivities(r.data || []); })
            .catch(e => { if (e?.response?.status === 401) handleUnauthorized(); })
            .finally(() => setLoading(p => ({ ...p, costCodeActivities: false })));
    };

    const addActivityGroup = () => {
        if (!newActivity.costCodeTypeId || !newActivity.activityCode || !newActivity.activityName) {
            showAlert("Please fill all required fields", "error");
            return;
        }
        const payload = {
            costCodeType: { id: newActivity.costCodeTypeId },
            activityCode: newActivity.activityCode,
            activityName: newActivity.activityName,
        };
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/activityGroup/add`, payload, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(r => {
            if (r.status === 200) {
                setNewActivity({ costCodeTypeId: "", activityGroupId: "", activityCode: "", activityName: "", quantity: 0, rate: 0, uomId: "" });
                setShowAddActivityForm(false);
                fetchActivityGroups();
                showAlert('Activity group added successfully!', "success");
            }
        }).catch(e => {
            if (e?.response?.status === 401) handleUnauthorized();
            showAlert('Error adding activity group: ' + (e.response?.data?.message || e.message), "error");
        });
    };

    const handleCancelAddActivity = () => {
        setShowAddActivityForm(false);
        setNewActivity({ costCodeTypeId: "", activityGroupId: "", activityCode: "", activityName: "", quantity: 0, rate: 0, uomId: "" });
        setSelectedCostCodeType(null);
    };

    const handleRightArrowClick = () => {
        if (selectedBOQs.size === 0) {
            showAlert("Please select at least one BOQ item to map", "error");
            return;
        }

        if (selectedMappingType === "1 : M" && selectedBOQs.size !== 1) {
            showAlert("One to Many mapping requires exactly one BOQ item to be selected", "error");
            return;
        }

        if (selectedActivities.size !== 1) {
            showAlert("Please select exactly one activity group", "error");
            return;
        }

        const boqCode = Array.from(selectedBOQs)[0];
        const boqItem = findBOQItem(boqCode);
        console.debug(boqItem);
        const activityGroupId = Array.from(selectedActivities)[0];
        const activityGroup = activityGroups.find(group => group.id === activityGroupId);

        setBoqTotalAmount(boqItem.totalAmount || 0);
        setBoqTotalQuantity(boqItem.quantity || 1);
        setBoqTotalRate(boqItem.totalRate || 0);

        if (selectedMappingType === "1 : 1") {
            saveCostCodeMapping();
        } else if (selectedMappingType === "1 : M") {
            setMappingActivities([{
                activityCode: activityGroup.activityCode,
                activityName: activityGroup.activityName,
                quantity: 0,
                rate: 0,
                splitType: "quantity",
                qtypercentage: "",
                qtyvalue: "",
                ratepercentage: "",
                ratevalue: "",
                amountpercentage: "",
                amountvalue: ""
            }]);
            setTotalPercentageUsed(0);
            setShowMappingPopover(true);
        } else if (selectedMappingType === "M : 1") {
            setMappingActivities([{
                activityCode: activityGroup.activityCode,
                activityName: activityGroup.activityName,
                quantity: 1,
                rate: 0,
                splitType: "",
                percentage: "",
                value: ""
            }]);
            setShowMappingPopover(true);
        }
    };
    const handleLeftArrowClick = () => {
        if (selectedActivities.size > 0) {
            const activitiesToRemove = Array.from(selectedActivities);
            setPendingMappings(prev =>
                prev.filter(mapping => !activitiesToRemove.includes(mapping.id))
            );
            setCostCodeActivities(prev =>
                prev.filter(activity => !activitiesToRemove.includes(activity.id))
            );
        }
        setSelectedActivities(new Set());
        setSelectedCostCodeType(null);
    };

    const handleActivitySelection = (actId, checked) => {
        setSelectedActivities(prev => {
            const n = new Set(prev);
            checked ? n.add(actId) : n.delete(actId);
            return n;
        });
    };

    const handleCostCodeTypeSelection = (cctId) => {
        setSelectedActivities(new Set());
        setSelectedCostCodeType(prev => prev === cctId ? null : cctId);
    };

    const getCostCodeTypeFromActivityGroup = (agId) => {
        const g = activityGroups.find(x => x.id === agId);
        return g?.costCodeType?.id || "";
    };
    const deleteCostCodeActivity = (costCodeId) => {
        if (costCodeId.startsWith('pending-')) {
            setCostCodeActivities(prev => prev.filter(activity => activity.id !== costCodeId));
            setPendingMappings(prev => prev.filter(mapping => mapping.id !== costCodeId));
            showAlert("Pending mapping removed successfully!", "success");
            return;
        }

        setNotification({
            message: "Are you sure you want to delete this cost code activity?",
            type: "confirm",
            onConfirm: () => {
                axios.delete(`${import.meta.env.VITE_API_BASE_URL}/costCode/delete/${costCodeId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }).then(res => {
                    if (res.status === 200) {
                        showAlert("Cost code activity deleted successfully!", "success");
                        fetchCostCodeActivities();
                    } else {
                        console.error('Failed to delete cost code activity:', res.status);
                        showAlert('Failed to delete cost code activity', "error");
                    }
                }).catch(err => {
                    if (err?.response?.status === 401) {
                        handleUnauthorized();
                    }
                    console.error('Error deleting cost code activity:', err);
                    showAlert('Error deleting cost code activity: ' + (err.response?.data?.message || err.message), "error");
                });
            },
            onCancel: () => setShowNotification(false)
        });
        setShowNotification(true);
    };


    const saveCostCodeMapping = () => {
        if (selectedMappingType === "1 : M") {
            if (mappingActivities.some(activity =>
                !activity.activityCode?.trim() ||
                !activity.activityName?.trim()
            )) {
                showAlert("Please fill all required fields in activity details", "error");
                return;
            }
        } else if (selectedMappingType === "M : 1") {
            if (mappingActivities.some(activity =>
                !activity.activityCode?.trim() ||
                !activity.activityName?.trim()
            )) {
                showAlert("Please fill all required fields in activity details", "error");
                return;
            }
        }

        if (selectedBOQs.size === 0 || selectedActivities.size !== 1) {
            showAlert("Please select BOQ items and exactly one activity group to map", "error");
            return;
        }

        const costCodeDtos = [];
        const activityGroupId = Array.from(selectedActivities)[0];
        const activityGroup = activityGroups.find(group => group.id === activityGroupId);
        const boqCode = Array.from(selectedBOQs)[0];
        const boqItem = findBOQItem(boqCode);

        if (selectedMappingType === "1 : 1") {
            Array.from(selectedBOQs).forEach(boqCode => {
                const boqItem = findBOQItem(boqCode);
                costCodeDtos.push({
                    projectId: projectId,
                    boqId: [Number(boqItem.id)],
                    activityCode: boqItem.boqCode,
                    activityName: boqItem.boqName,
                    quantity: boqItem.quantity || 1,
                    rate: boqItem.totalRate || 0,
                    amount: boqItem.totalAmount || 0,
                    uomId: boqItem.uom.id,
                    mappingType: selectedMappingType,
                    costCodeTypeId: getCostCodeTypeFromActivityGroup(activityGroupId),
                    activityGroupId: activityGroupId,
                });
            });
        } else if (selectedMappingType === "1 : M") {
            const boqCode = Array.from(selectedBOQs)[0];
            const boqItem = findBOQItem(boqCode);

            mappingActivities.forEach((activity) => {
                costCodeDtos.push({
                    projectId: projectId,
                    boqId: [boqItem.id],
                    activityCode: activity.activityCode,
                    activityName: activity.activityName,
                    quantity: boqItem.quantity,
                    rate: boqItem.totalRate,
                    amount: boqItem.totalAmount,
                    uomId: boqItem.uom.id,
                    mappingType: selectedMappingType,
                    costCodeTypeId: getCostCodeTypeFromActivityGroup(activityGroupId),
                    activityGroupId: activityGroupId,
                    splitType: activity.splitType || "amount",
                    qtySplitPercentage: parseFloat(activity.qtypercentage),
                    rateSplitPercentage: parseFloat(activity.ratepercentage),
                    amountSplitPercentage: parseFloat(activity.amountpercentage),
                });
            });
        }
        else if (selectedMappingType === "M : 1") {
            const activity = mappingActivities[0];
            const boqItems = Array.from(selectedBOQs).map((boqCode) => findBOQItem(boqCode));

            const uniqueUoms = [...new Set(boqItems.map(item => item.uom.id))];
            const totalAmount = boqItems.reduce((sum, item) => sum + (item.totalAmount || 0), 0);

            let avgRate = 0;
            let avgQty = 0;
            let uomId = null;

            if (uniqueUoms.length === 1) {
                avgRate = boqItems.reduce((sum, item) => sum + (item.totalRate || 0), 0) / boqItems.length;
                avgQty = boqItems.reduce((sum, item) => sum + (item.quantity || 0), 0) / boqItems.length;
                uomId = boqItems[0].uom.id;
            } else {

                avgRate = 0;
                avgQty = 0;
                uomId = null;
            }

            costCodeDtos.push({
                projectId: projectId,
                boqId: boqItems.map(item => item.id),
                activityCode: activity.activityCode,
                activityName: activity.activityName,
                quantity: avgQty,
                rate: avgRate,
                amount: totalAmount,
                uomId: uomId,
                mappingType: selectedMappingType,
                costCodeTypeId: getCostCodeTypeFromActivityGroup(activityGroupId),
                activityGroupId: activityGroupId,
                mergeType: activity.mergeType || "amount",
            });
        }


        const newPendingMappings = costCodeDtos.map(dto => {
            const serialId = `pending-${pendingCounter}`;
            setPendingCounter(c => c + 1);           
            return {
                ...dto,
                id: serialId
            };
        });

        setPendingMappings(prev => [...prev, ...newPendingMappings]);

        const newMappings = costCodeDtos.map(dto => {
            const serialId = `pending-${pendingCounter}`;
            setPendingCounter(c => c + 1);           
            return {
                id: serialId,
                ...dto,
                boq: findBOQItem(dto.boqId[0]),
                activityGroup: activityGroups.find(g => g.id === dto.activityGroupId) || null,
                isPending: true
            };
        });

        setCostCodeActivities(prev => [...prev, ...newMappings]);

        setShowMappingPopover(false);
        setSelectedBOQs(new Set());
        setSelectedActivities(new Set());
        setMappingActivities([]);
        setTotalPercentageUsed(0);

        showAlert(`Cost code mapping configured for ${selectedBOQs.size} BOQ items!`, "success");
    };
    const handleSaveMapping = () => {
        if (pendingMappings.length === 0) {
            showAlert("No pending mappings to save. Please configure mappings first.", "error");
            return;
        }

        const mappingsByType = {
            "1 : 1": [],
            "1 : M": [],
            "M : 1": []
        };
        pendingMappings.forEach(mapping => {
            mappingsByType[mapping.mappingType].push({
                boqId: mapping.boqId,
                activityCode: mapping.activityCode,
                activityName: mapping.activityName,
                quantity: mapping.quantity,
                rate: mapping.rate,
                amount: mapping.amount,
                uomId: mapping.uomId,
                mappingType: mapping.mappingType,
                costCodeTypeId: mapping.costCodeTypeId,
                activityGroupId: mapping.activityGroupId,
                projectId: mapping.projectId,
                splitType: mapping.splitType,
                qtySplitPercentage: parseFloat(mapping.qtySplitPercentage) || 0,
                rateSplitPercentage: parseFloat(mapping.rateSplitPercentage) || 0,
                amountSplitPercentage: parseFloat(mapping.amountSplitPercentage) || 0
            });
        });

        const savePromises = [];

        if (mappingsByType["1 : 1"].length > 0) {
            console.log("1 : 1 Mappings to save.");
            savePromises.push(
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/costCode/saveOneToOne`, mappingsByType["1 : 1"], {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
            );
        }

        if (mappingsByType["1 : M"].length > 0) {
            console.log("1 : M Mappings to save.");
            savePromises.push(
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/costCode/saveOneToMany`, mappingsByType["1 : M"], {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
            );
        }

        if (mappingsByType["M : 1"].length > 0) {
            console.log("M : 1 Mappings to save.");
            savePromises.push(
                axios.post(`${import.meta.env.VITE_API_BASE_URL}/costCode/saveManyToOne`, mappingsByType["M : 1"], {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                })
            );
        }

        Promise.all(savePromises)
            .then(responses => {
                const allSuccess = responses.every(res => res.status === 200);
                if (allSuccess) {
                    showAlert(`All cost code activities saved successfully!`, "success");
                    setCostCodeActivities(prev =>
                        prev.map(activity => ({ ...activity, isPending: false }))
                    );
                    setPendingMappings([]);
                    fetchCostCodeActivities();
                } else {

                    console.error('Failed to save some cost code mappings');
                    showAlert('Failed to save some cost code mappings', "error");
                }
            })
            .catch(err => {
                if (err?.response?.status === 401) {
                    handleUnauthorized();
                }
                console.error('Error saving cost code mappings:', err);
                showAlert('Error saving cost code mappings: ' + (err.response?.data?.message || err.message), "error");
            });
    };
    const handleReset = () => {
        setSelectedMappingType("1 : M");
        setSelectedBOQs(new Set());
        setSelectedActivities(new Set());
        setSearchQuery("");
        setActivitySearchQuery("");
        setExpandedActivityFolders(new Set());
        setSelectedCostCodeType(null);
        setMappingActivities([]);
        setPendingCounter(1);
        setPendingMappings([]);
        setCostCodeActivities(prev => prev.filter(activity => !activity.isPending));
    };
    const filteredCostCodeActivities = useMemo(() => {
        if (!activitySearchQuery.trim()) {
            return costCodeActivities;
        }

        const query = activitySearchQuery.toLowerCase().trim();

        return costCodeActivities.filter(activity =>
            (activity.activityCode && activity.activityCode.toLowerCase().includes(query)) ||
            (activity.activityName && activity.activityName.toLowerCase().includes(query)) ||
            (activity.activityGroup && activity.activityGroup.activityCode &&
                activity.activityGroup.activityCode.toLowerCase().includes(query)) ||
            (activity.activityGroup && activity.activityGroup.activityName &&
                activity.activityGroup.activityName.toLowerCase().includes(query))
        );
    }, [costCodeActivities, activitySearchQuery]);
    const CostCodeTypeNode = ({ costCodeTypeId, data }) => {
        const isExpanded = expandedActivityFolders.has(costCodeTypeId);
        const isSelected = selectedCostCodeType === costCodeTypeId;

        return (
            <div className="mb-3">
                <div
                    className={`d-flex align-items-center cursor-pointer py-2 ${isSelected ? 'bg-primary bg-opacity-10 border border-primary rounded' : ''}`}
                    onClick={() => handleCostCodeTypeSelection(costCodeTypeId)}
                >
                    <span className="me-2" onClick={e => { e.stopPropagation(); toggleActivityFolder(costCodeTypeId); }}>
                        {isExpanded ? <DropDown /> : <ClosedList />}
                    </span>
                    <LargeFolder />
                    <div className="d-flex flex-grow-1 ms-2">
                        <span className="fw-bold">{data.costCodeType?.costCodeName || 'Uncategorized'}</span>
                    </div>
                </div>
                {isExpanded && data.activityGroups.map(g => <ActivityGroupNode key={g.id} group={g} />)}
            </div>
        );
    };
    const handleActivityGroupSelection = (activityGroupId) => {
        setSelectedActivities(prev => {
            const newSet = new Set();
            setSelectedCostCodeType(null);

            if (prev.has(activityGroupId)) {
                return newSet;
            }

            newSet.add(activityGroupId);
            return newSet;
        });
    };
    const ActivityGroupNode = ({ group }) => {
        const isExpanded = expandedActivityFolders.has(group.id);
        const isSelected = selectedActivities.has(group.id);
        const groupActivities = costCodeActivities.filter(activity =>
            activity.activityGroup && activity.activityGroup.id === group.id
        );

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
                    className={`d-flex align-items-center cursor-pointer py-2 rounded-2`}
                    onClick={handleActivityGroupClick}
                    style={{ backgroundColor: `${selectedActivities.has(group.id) ? '#EFF6FFCC' : 'transparent'}`, border: `${selectedActivities.has(group.id) ? '1px solid #2563EB' : 'none'}` }}
                >
                    <span className="me-2" onClick={handleFolderToggle}>
                        {isExpanded ? <span className="d-flex"><DropDown /> <MediumFolder className="mt-2" /> </span> : <span className="d-flex"><ClosedList /> <MediumFolder className="mt-2" /> </span>}
                    </span>
                    <div className="d-flex flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between">
                            <span className="me-2 text-nowrap">{group.activityCode}</span>
                            <span>-</span>
                            <span className="ms-2 text-nowrap">{group.activityName}</span>
                        </div>
                    </div>
                </div>
                {isExpanded && groupActivities.length > 0 && (
                    <div className="ms-4 mt-2">
                        {groupActivities.map((activity) => (
                            <CostCodeActivityNode key={activity.id} activity={activity} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const CostCodeActivityNode = ({ activity }) => {
        const isSelected = selectedActivities.has(activity.id);
        const isMapped = !activity.isPending;

        const handleCheckboxChange = (e) => {
            if (!isMapped) {
                handleActivitySelection(activity.id, e.target.checked);
            }
        };
        const activityNameDisplay = activity.activityName && activity.activityName.length > 20
            ? activity.activityName.substring(0, 20) + '...'
            : activity.activityName;

        return (
            <div className="d-flex align-items-center py-2">
                {!isMapped && (
                    <input
                        type="checkbox"
                        className="form-check-input flex-shrink-0 me-2"
                        style={{ borderColor: '#0051973D', width: '18px', height: '18px' }}
                        checked={isSelected}
                        onChange={handleCheckboxChange}
                    />
                )}
                {isMapped && <span style={{ width: '30px' }}></span>}
                <div className="d-flex align-items-center flex-grow-1">
                    <FileText size={16} className="text-muted me-2" />
                    <div className="d-flex flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex justify-content-between">
                            <span className="me-2 text-nowrap">{activity.activityCode}</span>
                            <span>-</span>
                            <span className="ms-2 text-nowrap" title={activity.activityName}>{activityNameDisplay}</span>
                        </div>
                    </div>
                    {isMapped && (
                        <button
                            className="btn btn-sm ms-2"
                            onClick={() => deleteCostCodeActivity(activity.id)}
                            title="Delete mapping"
                        >
                            <DeleteIcon size={14} />
                        </button>
                    )}
                </div>
            </div>
        );
    };
    const addMappingActivity = () => {
        const boqCode = Array.from(selectedBOQs)[0];
        const boqItem = findBOQItem(boqCode);
        const remainingPercentage = 100 - totalPercentageUsed;
        const activityGroupId = Array.from(selectedActivities)[0];
        const activityGroup = activityGroups.find(group => group.id === activityGroupId);

        if (remainingPercentage <= 0) {
            showAlert("Cannot add more activities - total percentage already reached 100%", "error");
            return;
        }

        setMappingActivities([
            ...mappingActivities,
            {
                activityCode: activityGroup?.activityCode,
                activityName: activityGroup?.activityName,
                quantity: 0,
                rate: 0,
                splitType: "quantity",
                qtypercentage: "",
                qtyvalue: "",
                ratepercentage: "",
                ratevalue: "",
                amountpercentage: "",
                amountvalue: ""
            }
        ]);
    };
    const removeMappingActivity = (index) => {
        if ((selectedMappingType === "1 : 1" || selectedMappingType === "M : 1") && mappingActivities.length <= 1) {
            showAlert(`Cannot remove the only activity for ${selectedMappingType} mapping`, "error");
            return;
        }

        const updatedActivities = [...mappingActivities];
        const removedPercentage = parseFloat(updatedActivities[index].percentage) || 0;
        updatedActivities.splice(index, 1);
        setMappingActivities(updatedActivities);
        setTotalPercentageUsed(prev => prev - removedPercentage);
    };
    const updateMappingActivity = (index, field, value) => {
        const updatedActivities = [...mappingActivities];
        const boqCode = Array.from(selectedBOQs)[0];
        const boqItem = findBOQItem(boqCode);
        if (field === 'splitType') {
            setSplitType(value);
        }
        let newPercentage = parseFloat(value) || 0;

        if (['qtypercentage', 'ratepercentage', 'amountpercentage'].includes(field)) {
            if (newPercentage > 100) {
                showAlert("Percentage cannot exceed 100%", "error");
                return;
            }

            let currentTotal = updatedActivities.reduce((sum, act, i) => {
                if (i === index) {
                    return sum + newPercentage;
                }
                return sum +
                    (parseFloat(act.qtypercentage) || 0) +
                    (parseFloat(act.ratepercentage) || 0) +
                    (parseFloat(act.amountpercentage) || 0);
            }, 0);

            if (currentTotal > 100) {
                showAlert("Total percentage cannot exceed 100%", "error");
                return;
            }

            setTotalPercentageUsed(currentTotal);

            let calculatedValue = 0;
            if (field === 'qtypercentage') {
                calculatedValue = (boqItem.quantity * newPercentage / 100) || 0;
                updatedActivities[index].qtyvalue = calculatedValue.toFixed(2);
            }
            if (field === 'ratepercentage') {
                calculatedValue = (boqItem.totalRate * newPercentage / 100) || 0;
                updatedActivities[index].ratevalue = calculatedValue.toFixed(2);
            }
            if (field === 'amountpercentage') {
                calculatedValue = (boqItem.totalAmount * newPercentage / 100) || 0;
                updatedActivities[index].amountvalue = calculatedValue.toFixed(2);
            }
        }

        if (['qtyvalue', 'ratevalue', 'amountvalue'].includes(field)) {
            const numericValue = parseFloat(value) || 0;
            let calculatedPercentage = 0;

            if (field === 'qtyvalue') {
                calculatedPercentage = (numericValue / boqItem.quantity) * 100 || 0;
                updatedActivities[index].qtypercentage = calculatedPercentage.toFixed(2);
            }
            if (field === 'ratevalue') {
                calculatedPercentage = (numericValue / boqItem.totalRate) * 100 || 0;
                updatedActivities[index].ratepercentage = calculatedPercentage.toFixed(2);
            }
            if (field === 'amountvalue') {
                calculatedPercentage = (numericValue / boqItem.totalAmount) * 100 || 0;
                updatedActivities[index].amountpercentage = calculatedPercentage.toFixed(2);
            }
        }
        updatedActivities[index] = {
            ...updatedActivities[index],
            [field]: value
        };

        setMappingActivities(updatedActivities);
    };
    const toggleActivityFolder = (id) => {
        setExpandedActivityFolders(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });
    };

    const activityGroupsByCostCodeType = useMemo(() => {
        const grouped = {};
        costCodeTypes.forEach(t => grouped[t.id] = { costCodeType: t, activityGroups: [] });
        activityGroups.forEach(g => {
            const key = g.costCodeType?.id || 'uncategorized';
            if (!grouped[key]) grouped[key] = { costCodeType: g.costCodeType || { id: 'uncategorized', costCodeName: 'Uncategorized' }, activityGroups: [] };
            grouped[key].activityGroups.push(g);
        });
        return grouped;
    }, [activityGroups, costCodeTypes]);

    return (
        <div className="container-fluid p-4 mt-3">
            <ToastContainer position="top-right" autoClose={3000} />
            {showNotification && notification && notification.type === "confirm" && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Action</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowNotification(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>{notification.message}</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowNotification(false);
                                        if (notification.onCancel) notification.onCancel();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        setShowNotification(false);
                                        if (notification.onConfirm) notification.onConfirm();
                                    }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showMappingPopover && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg text-start">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Configure Mapping - {selectedMappingType}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowMappingPopover(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="d-flex justify-content-between">
                                    <div className="col-md-6 mb-3">
                                        <h6>Selected BOQ Items:</h6>
                                        <div className="rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            {Array.from(selectedBOQs).map(boqCode => {
                                                const boqItem = findBOQItem(boqCode);
                                                return (
                                                    <div key={boqCode} className="d-flex align-items-center">
                                                        <SmallFolder className="me-2" />
                                                        <span>{boqCode} - {boqItem?.boqName}</span>
                                                        <br />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <h6>Selected Activities:</h6>
                                        <div className="rounded p-2" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            {Array.from(selectedActivities).map(activityId => {
                                                const activityGroup = activityGroups.find(group => group.id === activityId);
                                                return (
                                                    <div key={activityId} className="d-flex align-items-center">
                                                        <FileText size={16} className="text-muted me-2" />
                                                        <span>{activityGroup?.activityCode} - {activityGroup?.activityName}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {selectedCostCodeType && (
                                    <div className="mb-3">
                                        <h6>Selected Cost Code Type:</h6>
                                        <div className="border rounded p-2">
                                            <div className="d-flex align-items-center">
                                                <LargeFolder className="me-2" />
                                                <span>{costCodeTypes.find(type => type.id === selectedCostCodeType)?.costCodeName}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {selectedMappingType === "1 : M" && (
                                    <>
                                        {splitType === 'amount' && (
                                            <div className="alert alert-info mb-3">
                                                <small>
                                                    <strong>BOQ Total Amount: ${boqTotalAmount.toFixed(2)}</strong><br />
                                                    Total Percentage Used: {totalPercentageUsed.toFixed(2)}% / 100%<br />
                                                    Remaining Percentage: {(100 - totalPercentageUsed).toFixed(2)}%<br />
                                                    Allocated Amount: ${(boqTotalAmount * totalPercentageUsed / 100).toFixed(2)}<br />
                                                    Remaining Amount: ${(boqTotalAmount * (100 - totalPercentageUsed) / 100).toFixed(2)}
                                                </small>
                                            </div>
                                        )}
                                        {splitType === 'rate' && (
                                            <div className="alert alert-info mb-3">
                                                <small>
                                                    <strong>BOQ Total Rate: ${boqTotalRate.toFixed(2)}</strong><br />
                                                    Total Percentage Used: {totalPercentageUsed.toFixed(2)}% / 100%<br />
                                                    Remaining Percentage: {(100 - totalPercentageUsed).toFixed(2)}%<br />
                                                    Allocated Rate: ${(boqTotalRate * totalPercentageUsed / 100).toFixed(2)}<br />
                                                    Remaining Rate: ${(boqTotalRate * (100 - totalPercentageUsed) / 100).toFixed(2)}
                                                </small>
                                            </div>
                                        )}
                                        {splitType === 'quantity' && (
                                            <div className="alert alert-info mb-3">
                                                <small>
                                                    <strong>BOQ Total Quantity: {boqTotalQuantity.toFixed(2)}</strong><br />
                                                    Total Percentage Used: {totalPercentageUsed.toFixed(2)}% / 100%<br />
                                                    Remaining Percentage: {(100 - totalPercentageUsed).toFixed(2)}%<br />
                                                    Allocated Quantity: {(boqTotalQuantity * totalPercentageUsed / 100).toFixed(2)}<br />
                                                    Remaining Quantity: {(boqTotalQuantity * (100 - totalPercentageUsed) / 100).toFixed(2)}
                                                </small>
                                            </div>
                                        )}
                                    </>
                                )}

                                <h6 className="mb-3">Activity Details:</h6>

                                {mappingActivities.map((activity, index) => (
                                    <div key={index} className="mb-4 p-3 border rounded position-relative pt-5" style={{ borderColor: '#0051973D' }}>
                                        <div className="position-absolute top-0 start-0 px-2 py-1 rounded rounded-bottom-right text-center" style={{ width: '150px', height: '30px', color: "#005197", backgroundColor: "#eef0f1ff", margin: "10px" }}>
                                            Activity : {index + 1}
                                        </div>

                                        {(selectedMappingType === "1 : M" && mappingActivities.length > 1) && (
                                            <button
                                                type="button"
                                                className="btn-close position-absolute top-0 end-0 m-2"
                                                onClick={() => {
                                                    const newPercentage = parseFloat(activity.percentage) || 0;
                                                    setTotalPercentageUsed(prev => prev - newPercentage);
                                                    removeMappingActivity(index);
                                                }}
                                            ></button>
                                        )}

                                        <div className="row mt-4">
                                            <div className="col-md-6 mb-4">
                                                <label className="projectform text-start d-block">Activity Code <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input w-100"
                                                    value={activity.activityCode}
                                                    onChange={(e) => updateMappingActivity(index, 'activityCode', e.target.value)}
                                                    placeholder="Enter activity code"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <label className="projectform text-start d-block">Activity Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input w-100"
                                                    value={activity.activityName}
                                                    onChange={(e) => updateMappingActivity(index, 'activityName', e.target.value)}
                                                    placeholder="Enter activity name"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {selectedMappingType === "1 : M" && (
                                            <>
                                                <div className="row">
                                                    <div className="col-12 mb-4">
                                                        <label className="projectform-select text-start d-block">Split Type<span className="text-danger">*</span></label>
                                                        <Select
                                                            options={splitOption}
                                                            classNamePrefix="select"
                                                            placeholder="Select split type"
                                                            required
                                                            value={splitOption.find(option => option.value === activity.splitType)}
                                                            onChange={(option) => (updateMappingActivity(index, 'splitType', option.value))}
                                                        />
                                                    </div>
                                                </div>
                                                {(activity.splitType === 'quantity' || activity.splitType === 'qty_rate') && (
                                                    <div className="row">
                                                        <div className="col-md-6 mb-4">
                                                            <label className="projectform text-start d-block">Quantity %</label>
                                                            <input
                                                                type="number"
                                                                className="form-input w-100"
                                                                value={activity.qtypercentage}
                                                                onChange={(e) => updateMappingActivity(index, 'qtypercentage', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <label className="projectform text-start d-block">Quantity Value</label>
                                                            <input
                                                                type="number"
                                                                className="form-input w-100"
                                                                value={activity.qtyvalue}
                                                                onChange={(e) => updateMappingActivity(index, 'qtyvalue', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {(activity.splitType === 'rate' || activity.splitType === 'qty_rate') && (
                                                    <div className="row">
                                                        <div className="col-md-6 mb-4">
                                                            <label className="projectform text-start d-block">Rate %</label>
                                                            <input
                                                                type="number"
                                                                className="form-input w-100"
                                                                value={activity.ratepercentage}
                                                                onChange={(e) => updateMappingActivity(index, 'ratepercentage', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <label className="projectform text-start d-block">Rate Value</label>
                                                            <input
                                                                type="number"
                                                                className="form-input w-100"
                                                                value={activity.ratevalue}
                                                                onChange={(e) => updateMappingActivity(index, 'ratevalue', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {activity.splitType === 'amount' && (
                                                    <div className="row">
                                                        <div className="col-md-6 mb-4">
                                                            <label className="projectform text-start d-block">Amount %</label>
                                                            <input
                                                                type="number"
                                                                className="form-input w-100"
                                                                value={activity.amountpercentage}
                                                                onChange={(e) => updateMappingActivity(index, 'amountpercentage', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                                min="0"
                                                                max="100"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-4">
                                                            <label className="projectform text-start d-block">Amount Value</label>
                                                            <input
                                                                type="number"
                                                                className="form-input w-100"
                                                                value={activity.amountvalue}
                                                                onChange={(e) => updateMappingActivity(index, 'amountvalue', e.target.value)}
                                                                onWheel={(e) => e.target.blur()}
                                                                min="0"
                                                                step="0.01"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}

                                {selectedMappingType === "1 : M" && (
                                    <div className="d-flex justify-content-end mb-3">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={addMappingActivity}
                                        >
                                            + Add Activity
                                        </button>
                                    </div>
                                )}
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
                                    className="btn action-button"
                                    onClick={saveCostCodeMapping}
                                >
                                    Configure Mapping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
                <div className="ms-3">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className='ms-2'>Cost Code Mapping</span>
                    <span className='ms-2'>-</span>
                    <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
                </div>
            </div>
            <div className="row bg-white rounded-3 ms-4 me-4 py-4 ps-4 mt-3 pe-4 mb-4" style={{ border: '0.5px solid #0051973D' }}>
                <h5 className="card-title text-start fs-6 ms-1 mb-3">Select Mapping Type</h5>
                {mappingTypes.map((t) => (
                    <div className="col-md-6 col-lg-4 mb-3 text-start" key={t.key}>
                        <div
                            className={`text-start p-3 m-2 rounded h-100 d-flex flex-column ${selectedMappingType === t.key
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border"
                                }`}
                            style={{
                                cursor: "pointer",
                                minWidth: "200px",
                                transition: "all 0.2s ease",
                                border: '0.5px solid #0051973D'
                            }}
                            onClick={() => setSelectedMappingType(t.key)}
                        >
                            <div className="d-flex flex-column h-100">
                                <div className="mb-2">
                                    <h6 className="mb-1">{t.title}</h6>
                                    <p className="text-muted small mb-2">{t.desc}</p>
                                </div>
                                <div className="mt-auto">
                                    <div className="text-start">
                                        <small className="text-muted">
                                            {t.key === "1 : M" ? (
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
                                            ) : t.key === "1 : 1" ? (
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
                                Selected: {selectedBOQs.size} {selectedMappingType === "1 : M" ? "(Max: 1)" : ""}
                            </div>
                        </div>
                        <div className="position-relative mb-3 pb-1">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="search form-input w-100 ps-5"
                                placeholder="Search BOQ items..."
                                style={{ border: '0.5px solid #0051973D', fontSize: "15px" }}
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="card-body boq-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredBOQTree.length > 0 ? filteredBOQTree.map(b => (
                                <BOQNode key={b.id} boq={b} />
                            )) : (
                                <div className="text-center text-muted py-4">
                                    {parentTree.length > 0 ? "No matching BOQ items found" : "No BOQ data available"}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-md-2 d-flex justify-content-center align-items-center">
                    <div className="card text-center border-0 bg-transparent">
                        <div className="d-flex justify-content-center mb-2">
                            <ArrowRight
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow"
                                style={{ width: "60px", height: "60px", cursor: "pointer" }}
                                onClick={handleRightArrowClick}
                            />
                        </div>
                        <small className="text-nowrap mt-2 mb-1">Selected Type:</small>
                        <div className="fs-6 text-nowrap mb-2 text-primary">{selectedMappingType} Mapping</div>
                        <div className="d-flex justify-content-center">
                            <ArrowLeft
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow"
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
                                    onClick={() => {
                                        if (!selectedCostCodeType) {
                                            showAlert("Please select a cost code type first to add an activity", "error");
                                            return;
                                        }
                                        setShowAddActivityForm(true);
                                        setNewActivity(prev => ({
                                            ...prev,
                                            costCodeTypeId: selectedCostCodeType
                                        }));
                                    }}
                                >
                                    <small className="text-nowrap text-primary">+ Add Activity</small>
                                </button>
                            )}
                        </div>
                        <div className="position-relative mb-3 pb-1">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="search form-input w-100 ps-5"
                                placeholder="Search activities..." style={{ border: '0.5px solid #0051973D', fontSize: "15px" }}
                                value={activitySearchQuery}
                                onChange={(e) => setActivitySearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="card-body boq-scroll-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {showAddActivityForm ? (
                                <div ref={addActivityFormRef} className="mb-4 p-3 border rounded" style={{ borderColor: '#0051973D' }}>
                                    <form>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="mb-0">New Activity</h6>
                                            <div className="d-flex align-items-center border rounded p-2">
                                                <LargeFolder className="me-2" />
                                                {selectedCostCodeType && (
                                                    <span>{costCodeTypes.find(type => type.id === selectedCostCodeType)?.costCodeName}</span>
                                                )}
                                                {!selectedCostCodeType && (
                                                    <span className="text-muted">No cost code type selected</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-4">
                                                <label className="projectform text-start d-block">Activity Code <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input w-100"
                                                    value={newActivity.activityCode}
                                                    onChange={(e) => setNewActivity({ ...newActivity, activityCode: e.target.value })}
                                                    placeholder="Enter activity code"
                                                    required
                                                />
                                            </div>
                                            <div className=" mb-4">
                                                <label className="projectform text-start d-block">Activity Name <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-input w-100"
                                                    value={newActivity.activityName}
                                                    onChange={(e) => setNewActivity({ ...newActivity, activityName: e.target.value })}
                                                    placeholder="Enter activity name"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                type="button"
                                                className="btn btn-secondary me-3"
                                                onClick={handleCancelAddActivity}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="btn action-button"
                                                onClick={addActivityGroup}
                                            >
                                                + Add Activity Group
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : loading.activityGroups || loading.costCodeActivities ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2">Loading activities...</p>
                                </div>
                            ) : activitySearchQuery && filteredCostCodeActivities.length > 0 ? (
                                <div className="mb-3">
                                    <h6 className="small text-muted">Matching Activities:</h6>
                                    {filteredCostCodeActivities.map((activity) => (
                                        <CostCodeActivityNode key={activity.id} activity={activity} />
                                    ))}
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
            <div className="row ">
                <div className="col-md-12">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <div className="d-flex justify-content-end gap-2">
                                <button className="bg-transparent border-0" style={{ color: "#3273AB" }} onClick={handleReset}>
                                    Reset
                                </button>
                                <button className="btn action-button" onClick={handleSaveMapping}>
                                    <SaveMappingIcon />
                                    <span className="ms-2">Save Mapping</span>
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