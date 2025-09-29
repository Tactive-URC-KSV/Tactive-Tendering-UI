import axios from "axios";
import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from "react";
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

const handleUnauthorized = () => {
    const navigate = useNavigate();
    navigate('/login');
}


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
    const [selectedCostCodeType, setSelectedCostCodeType] = useState(null);
    const [mappingActivities, setMappingActivities] = useState([]);
    const [totalPercentageUsed, setTotalPercentageUsed] = useState(0);
    const [boqTotalAmount, setBoqTotalAmount] = useState(0);
    const [boqTotalRate, setBoqTotalRate] = useState(0);
    const [boqTotalQuantity, setBoqTotalQuantity] = useState(0);
    const [splitType, setSplitType] = useState("quantity");

    const addActivityFormRef = useRef(null);
    const [notification, setNotification] = useState(null);
    const [showNotification, setShowNotification] = useState(false);
    const [pendingMappings, setPendingMappings] = useState([]);

    const showAlert = (message, type = "info") => {
        switch (type) {
            case "error":
                toast.error(message);
                break;
            case "success":
                toast.success(message);
                break;
            case "warning":
                toast.warning(message);
                break;
            default:
                toast.info(message);
        }
    };

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
        { id: "rate", name: "Rate" },
        { id: "amount", name: "Amount" },
        { id: "quantity", name: "Quantity" },
        { id: "qty_rate", name: "Quantity & Rate" }
    ];
    const splitOption = splitTypes.map(type => ({
        value: type.id,
        label: type.name
    }));

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showAddActivityForm && addActivityFormRef.current && !addActivityFormRef.current.contains(event.target)) {
                handleCancelAddActivity();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showAddActivityForm]);

    const getCostCodeTypeFromActivityGroup = (activityGroupId) => {
        if (!activityGroupId) return "";

        const activityGroup = activityGroups.find(group => group.id === activityGroupId);
        return activityGroup?.costCodeType?.id || "";
    };

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
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
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
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
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
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
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
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
            console.error('Error fetching activity groups:', err);
        }).finally(() => {
            setLoading(prev => ({ ...prev, activityGroups: false }));
        });
    };

    const fetchCostCodeActivities = () => {
        setLoading(prev => ({ ...prev, costCodeActivities: true }));
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/costCodeActivity/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setCostCodeActivities(res.data || []);
            } else {
                console.error('Failed to fetch cost code activities:', res.status);
                setCostCodeActivities([]);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
            console.error('Error fetching cost code activities:', err);
            setCostCodeActivities([]);
        }).finally(() => {
            setLoading(prev => ({ ...prev, costCodeActivities: false }));
        });
    };

    const addActivityGroup = () => {
        if (!newActivity.costCodeTypeId || !newActivity.activityCode || !newActivity.activityName) {
            showAlert("Please fill all required fields", "error");
            return;
        }

        const activityGroupData = {
            costCodeType: { id: newActivity.costCodeTypeId },
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
                showAlert('Activity group added successfully!', "success");
            } else {
                console.error('Failed to add activity group:', res.status);
                showAlert('Failed to add activity group', "error");
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                handleUnauthorized();
            }
            console.error('Error adding activity group:', err);
            showAlert('Error adding activity group: ' + (err.response?.data?.message || err.message), "error");
        });
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
        } else if (selectedMappingType === "M : 1") {
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


        setPendingMappings(prev => [...prev, ...costCodeDtos.map(dto => ({
            ...dto,
            id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))]);

        const newMappings = costCodeDtos.map(dto => ({
            id: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...dto,
            boq: findBOQItemByCode(dto.boqId[0]),
            activityGroup: activityGroups.find(group => group.id === dto.activityGroupId) || null,
            isPending: true
        }));

        setCostCodeActivities(prev => [...prev, ...newMappings]);

        setShowMappingPopover(false);
        setSelectedBOQs(new Set());
        setSelectedActivities(new Set());
        setMappingActivities([]);
        setTotalPercentageUsed(0);

        showAlert(`Cost code mapping configured for ${selectedBOQs.size} BOQ items!`, "success");
    };

    const findBOQItemByCode = (boqCode) => {
        const findInTree = (nodes) => {
            for (const node of nodes) {
                if (node.boqCode === boqCode) return node;
                if (node.children && node.children.length > 0) {
                    const found = findInTree(node.children);
                    if (found) return found;
                }
            }
            return null;
        };

        return findInTree(boqTree);
    };

    const findBOQItem = (boqCode) => {
        const findInTree = (nodes) => {
            for (const node of nodes) {
                if (node.boqCode === boqCode) return node;
                if (node.children && node.children.length > 0) {
                    const found = findInTree(node.children);
                    if (found) return found;
                }
            }
            return null;
        };

        return findInTree(boqTree);
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

            setCostCodeActivities(prev =>
                prev.filter(activity => !activitiesToRemove.includes(activity.id))
            );

            setPendingMappings(prev =>
                prev.filter(mapping => !activitiesToRemove.includes(mapping.id))
            );
        }

        setSelectedActivities(new Set());
        setSelectedCostCodeType(null);
    };

    const handleActivitySelection = (activityId, isSelected) => {
        setSelectedActivities(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(activityId);
                setSelectedCostCodeType(null);
            } else {
                newSet.delete(activityId);
            }
            return newSet;
        });
    };

    const handleCostCodeTypeSelection = (costCodeTypeId) => {
        setSelectedActivities(new Set());

        if (selectedCostCodeType === costCodeTypeId) {
            setSelectedCostCodeType(null);
        } else {
            setSelectedCostCodeType(costCodeTypeId);
        }
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
        if (selectedMappingType === "1 : M" && isSelected && selectedBOQs.size >= 1) {
            showAlert("One to Many mapping allows only one BOQ item to be selected", "error");
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
        setExpandedFolders(new Set());
        setActivitySearchQuery("");
        setExpandedActivityFolders(new Set());
        setSelectedCostCodeType(null);
        setMappingActivities([]);
        setPendingMappings([]);
        setCostCodeActivities(prev => prev.filter(activity => !activity.isPending));
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

    const activityGroupsByCostCodeType = useMemo(() => {
        const grouped = {};

        costCodeTypes.forEach(type => {
            grouped[type.id] = {
                costCodeType: type,
                activityGroups: []
            };
        });

        activityGroups.forEach(group => {
            const costCodeTypeId = group.costCodeType?.id || 'uncategorized';

            if (!grouped[costCodeTypeId]) {
                grouped[costCodeTypeId] = {
                    costCodeType: group.costCodeType || { id: 'uncategorized', costCodeName: 'Uncategorized' },
                    activityGroups: []
                };
            }

            grouped[costCodeTypeId].activityGroups.push(group);
        });

        return grouped;
    }, [activityGroups, costCodeTypes]);

    const BOQNode = ({ boq, level = 0 }) => {
        const hasChildren = boq.children && boq.children.length > 0;
        const isSelected = selectedBOQs.has(boq.boqCode);
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
                    className={`mb-1 ${level === 0 ? " " : "border-start"} border-1 ps-3 py-2 pe-3 w-100`}
                    style={{ borderColor: '#0051973D' }}
                >
                    <div
                        className="d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={handleFolderToggle}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center mb-1">
                                <span className="me-2">
                                    {isExpanded ? <DropDown /> : <ClosedList />}
                                </span>
                                <span>{getIcon()}</span>
                                <span className="fw-bold me-md-2 ms-2 text-nowrap" style={{ maxWidth: "80px" }}>
                                    {boq.boqCode}
                                </span>
                                <span>-</span>
                                <span className="flex-start fw-bold ms-2 text-nowrap" style={{ maxWidth: "400px" }}>
                                    {boq.boqName}
                                </span>
                                {isMapped && <Check size={16} className="text-success ms-2" />}
                            </div>
                        </div>
                    </div>
                    {isExpanded && (
                        <div className="ms-3">
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
                    className={`d-flex align-items-center cursor-pointer py-2 ${isSelected ? 'bg-primary bg-opacity-10 border border-primary rounded' : ''}`}
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
                    className={`d-flex align-items-center cursor-pointer py-2 ${isSelected ? 'bg-primary bg-opacity-10 border border-primary rounded' : ''}`}
                    onClick={handleActivityGroupClick}
                    style={{ cursor: 'pointer' }}
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
                            <span className="ms-2 text-nowrap">{activity.activityName}</span>
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

    return (
        <div className="container-fluid">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

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

            <div className="row bg-white rounded-3 ms-4 me-4 py-4 ps-4 mt-3 pe-4 mb-4 " style={{ border: '0.5px solid #0051973D' }}>
                <h5 className="card-title text-start fs-6 ms-1 mb-3">Select Mapping Type</h5>
                {mappingTypes.map((type) => (
                    <div className="col-md-6 col-lg-4 mb-3 text-start" key={type.key}>
                        <div
                            className={`text-start p-3 m-2 rounded h-100 d-flex flex-column ${selectedMappingType === type.key
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
                                Selected: {selectedBOQs.size} {selectedMappingType === "1 : M" ? "(Max: 1)" : ""}
                            </div>
                        </div>

                        <div className="position-relative mb-3 pb-1">
                            <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="search form-input w-100 ps-5"
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