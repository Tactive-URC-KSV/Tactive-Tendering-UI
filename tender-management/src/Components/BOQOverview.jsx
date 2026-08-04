import axios from "axios";
import { ArrowLeft, ChevronDown, ChevronRight, IndianRupee } from 'lucide-react';
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import CollapseIcon from '../assest/Collapse.svg?react';
import DeleteIcon from '../assest/DeleteIcon.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import Export from '../assest/Export.svg?react';
import Import from '../assest/Import.svg?react';
import BOQUpload from "./BOQUpload";
import { toast } from 'react-toastify';
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useUom } from "../Context/UomContext";
import useDebounce from "../Utills/useDebounce";
import { searchBoq, updateBOQHierarchy } from "../Utills/projectApi";
import { Move, Save, X, ChevronLeft, Edit, PlusCircle } from 'lucide-react';
import Select from 'react-select';


function ConfirmationDialog({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Confirm Deletion</h5>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HierarchySelectionNode({ boq, onSelect, selectedBoqForMove, level = 0 }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const BoqIcon = isExpanded ? ChevronDown : ChevronRight;
    const isSelf = boq.id === selectedBoqForMove?.id;

    if (boq.lastLevel === true) return null; // Only non-leaf nodes can be parents

    return (
        <div className="ms-3">
            <div
                className={`d-flex align-items-center p-2 rounded ${isSelf ? 'text-muted' : 'text-dark'}`}
                style={{ cursor: isSelf ? 'not-allowed' : 'pointer', borderBottom: '1px solid #f0f0f0' }}
            >
                <div onClick={() => setIsExpanded(!isExpanded)} className="me-2">
                    <BoqIcon size={16} />
                </div>
                <div
                    className="flex-grow-1"
                    onClick={() => !isSelf && onSelect(boq.id)}
                >
                    <span className="fw-medium">{boq.boqCode}</span>
                    <span className="ms-2 small">{boq.boqName?.substring(0, 50)}</span>
                </div>
            </div>
            {isExpanded && Array.isArray(boq.children) && (
                <div className="ms-2">
                    {boq.children.map(child => (
                        <HierarchySelectionNode
                            key={child.id}
                            boq={child}
                            onSelect={onSelect}
                            selectedBoqForMove={selectedBoqForMove}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function BOQOverview({ projectId }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useParams();
    const [parentBoq, setParentBoq] = useState([]);

    const isExternalAccess = location.pathname.startsWith('/external');

    // Parse query parameters from URL
    const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

    const getQueryParam = (name) => {
        if (queryParams.has(name)) return queryParams.get(name);
        const normalizedName = name.toLowerCase().replace(/[\s\._-]/g, '');
        for (const key of queryParams.keys()) {
            const normalizedKey = key.toLowerCase().replace(/[\s\._-]/g, '');
            if (normalizedKey === normalizedName) {
                return queryParams.get(key);
            }
        }
        return null;
    };

    const externalModuleRef = useMemo(() => isExternalAccess ? (getQueryParam("Module_Reference") || getQueryParam("moduleReference") || getQueryParam("moduleRef") || getQueryParam("projectId")) : null, [isExternalAccess, queryParams]);
    const externalEnqirySlno = useMemo(() => isExternalAccess ? (getQueryParam("EnqirySlno") || getQueryParam("enquirySlno") || getQueryParam("EnquirySlNo") || getQueryParam("enqirySlno")) : null, [isExternalAccess, queryParams]);
    const externalTenderRevNo = useMemo(() => isExternalAccess ? (getQueryParam("Tender_Rev_No") || getQueryParam("tenderRevNo") || getQueryParam("TenderRevNo") || getQueryParam("tenderRev")) : null, [isExternalAccess, queryParams]);
    const externalTederCode = useMemo(() => isExternalAccess ? (getQueryParam("Teder_Code") || getQueryParam("tenderCode") || getQueryParam("TederCode") || getQueryParam("tender_code") || getQueryParam("Tender_Code")) : null, [isExternalAccess, queryParams]);
    const externalTenderName = useMemo(() => isExternalAccess ? (getQueryParam("Tender_Name") || getQueryParam("tenderName") || getQueryParam("TenderName") || getQueryParam("tender_name")) : null, [isExternalAccess, queryParams]);

    const effectiveProjectId = (isExternalAccess && externalEnqirySlno) ? externalEnqirySlno : projectId;

    const [parentTree, setParentTree] = useState([]);
    const [project, setProject] = useState();
    const displayProjectName = (isExternalAccess && (externalTederCode || externalTenderName))
        ? `${externalTederCode ? externalTederCode.replace(/_/g, '/') : ''} - ${externalTenderName ? externalTenderName.replace(/_/g, ' ') : ''}`
        : (project?.projectName ? `${project.projectName}(${project.projectCode})` : 'No Project');
    const [uploadScreen, setUploadScreen] = useState(false);
    const [expandedParentIds, setExpandedParentIds] = useState(new Set());
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [totalBOQ, setTotalBOQ] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedNodes, setHighlightedNodes] = useState(new Set());
    const [initialInvalidNodes, setInitialInvalidNodes] = useState(new Set());
    const [isExpanding, setIsExpanding] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 3000);
    const uoms = useUom();
    const [selectedBoqForModal, setSelectedBoqForModal] = useState(null);
    const [isHierarchyMode, setIsHierarchyMode] = useState(false);
    const [hierarchyUpdates, setHierarchyUpdates] = useState({}); // childId -> parentId
    const [showHierarchyModal, setShowHierarchyModal] = useState(false);
    const [selectedBoqForMove, setSelectedBoqForMove] = useState(null);
    const [boqCurrentPage, setBoqCurrentPage] = useState(0);
    const [boqTotalPages, setBoqTotalPages] = useState(0);
    const [boqTotalItems, setBoqTotalItems] = useState(0);
    const [boqPageSize, setBoqPageSize] = useState(15);
    const [groupingMode, setGroupingMode] = useState('level');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBoqData, setNewBoqData] = useState({
        division: '',
        level: '',
        parentBoqId: '',
        boqCode: '',
        boqName: '',
        uomCode: '',
        quantity: '',
        pageNo: '',
        enqSlNo: '',
        version: 1,
        clientBoqCode: '',
        boqShortName: '',
        description: '',
        rateOnly: false,
        provisionalSum: false,
        notQuotedBoq: false,
        pricedBoq: false,
        lastLevel: false
    });
    const [parentBoqOptions, setParentBoqOptions] = useState([]);
    const [isCreatingBoq, setIsCreatingBoq] = useState(false);
    const [editBoqId, setEditBoqId] = useState(null);
    const [boqTotalsMap, setBoqTotalsMap] = useState({});

    const handleAddChildClick = (e, boq) => {
        e.stopPropagation();
        setEditBoqId(null);
        setNewBoqData({
            division: boq.division || boq.divisionName || '',
            level: boq.level + 1,
            parentBoqId: boq.isDivision ? '' : boq.id,
            boqCode: '',
            boqName: '',
            uomCode: '',
            quantity: '',
            pageNo: boq.pageNo || '',
            enqSlNo: '',
            version: 1,
            clientBoqCode: '',
            boqShortName: '',
            description: '',
            rateOnly: false,
            provisionalSum: false,
            notQuotedBoq: false,
            lastLevel: false
        });
        if (!boq.isDivision) {
            setParentBoqOptions([boq]);
        } else {
            setParentBoqOptions([]);
        }
        setShowCreateModal(true);
    };

    const handleAddRootBoqClick = () => {
        setEditBoqId(null);
        setNewBoqData({
            division: '',
            level: 1,
            parentBoqId: '',
            boqCode: '',
            boqName: '',
            uomCode: '',
            quantity: '',
            pageNo: '',
            enqSlNo: '',
            version: 1,
            clientBoqCode: '',
            boqShortName: '',
            description: '',
            rateOnly: false,
            provisionalSum: false,
            notQuotedBoq: false,
            lastLevel: false
        });
        setParentBoqOptions([]);
        setShowCreateModal(true);
    };

    const handleEditClick = (e, boq) => {
        e.stopPropagation();
        setEditBoqId(boq.id);
        setNewBoqData({
            division: boq.division || '',
            level: boq.level || '',
            parentBoqId: boq.parentBOQ ? boq.parentBOQ.id : (boq.parentBoqId || ''),
            boqCode: boq.boqCode || '',
            boqName: boq.boqName || '',
            uomCode: boq.uomCode || boq?.uom?.uomCode || '',
            quantity: boq.quantity || '',
            pageNo: boq.pageNo || '',
            enqSlNo: boq.enqSlNo || '',
            version: boq.version || 1,
            clientBoqCode: boq.clientBoqCode || '',
            boqShortName: boq.boqShortName || '',
            description: boq.description || '',
            rateOnly: boq.rateOnly || false,
            provisionalSum: boq.provisionalSum || false,
            notQuotedBoq: boq.notQuotedBoq || false,
            pricedBoq: boq.pricedBoq || false,
            lastLevel: boq.lastLevel || false
        });

        if (boq.level && boq.level > 1) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBoqsByLevel/${effectiveProjectId}/${boq.level - 1}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            }).then(res => {
                if (res.status === 200) {
                    setParentBoqOptions(res.data || []);
                }
            }).catch(err => {
                console.error("Failed to load parent BOQs", err);
            });
        } else {
            setParentBoqOptions([]);
        }
        setShowCreateModal(true);
    };

    const handleCreateBoqChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewBoqData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleIntegerInput = (e) => {
        if (['e', 'E', '+', '-', '.'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleDecimalInput = (e) => {
        if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleLevelChange = async (e) => {
        const val = e.target.value;
        const newLevel = val === '' ? '' : parseInt(val);
        setNewBoqData(prev => ({ ...prev, level: newLevel, parentBoqId: '', pageNo: '' }));
        if (newLevel && newLevel > 1) {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBoqsByLevel/${effectiveProjectId}/${newLevel - 1}`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
                if (res.status === 200) {
                    setParentBoqOptions(res.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch parent boqs by level", err);
                toast.error("Failed to load parent BOQs");
            }
        } else {
            setParentBoqOptions([]);
        }
    };

    const handleParentChange = (selectedOption) => {
        const parentId = selectedOption ? selectedOption.value : '';
        const selectedParent = parentBoqOptions.find(p => p.id === parentId);
        setNewBoqData(prev => ({
            ...prev,
            parentBoqId: parentId,
            pageNo: selectedParent?.pageNo || ''
        }));
    };

    const handleUomChange = (selectedOption) => {
        setNewBoqData(prev => ({ ...prev, uomCode: selectedOption ? selectedOption.value : '' }));
    };

    const submitCreateBoq = async () => {
        if (!newBoqData.boqCode || !newBoqData.boqName) {
            toast.warn("BOQ Code and Name are required");
            return;
        }
        if (newBoqData.level > 1 && !newBoqData.parentBoqId) {
            toast.warn("Parent BOQ is required for level > 1");
            return;
        }
        try {
            setIsCreatingBoq(true);
            let res;
            if (editBoqId) {
                res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/project/updateSingleBoq/${effectiveProjectId}/${editBoqId}`, newBoqData, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
            } else {
                res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/createSingleBoq/${effectiveProjectId}`, newBoqData, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
            }
            if (res.status === 201 || res.status === 200) {
                toast.success(editBoqId ? "BOQ Updated Successfully" : "BOQ Created Successfully");
                if (isExternalAccess) {
                    window.parent.postMessage(
                        {
                            type: "FORM_SAVE_COMPLETED",
                            status: "SUCCESS",
                            message: "Data saved successfully",
                            data: {
                                projectId: effectiveProjectId,
                                boqCode: newBoqData.boqCode
                            },
                        },
                        "*"
                    );
                }
                setShowCreateModal(false);
                setEditBoqId(null);
                setNewBoqData({
                    division: '',
                    level: '',
                    parentBoqId: '',
                    boqCode: '',
                    boqName: '',
                    uomCode: '',
                    quantity: '',
                    pageNo: ''
                });
                refreshParentBoqData();
            }
        } catch (err) {
            console.error("Failed to create BOQ", err);
            toast.error(err?.response?.data || "Failed to create BOQ");
            if (isExternalAccess) {
                window.parent.postMessage(
                    {
                        type: "FORM_SAVE_COMPLETED",
                        status: "FAILED",
                        message: err.response?.data?.message || "Save failed",
                    },
                    "*"
                );
            }
        } finally {
            setIsCreatingBoq(false);
        }
    };

    const handleExpandCollapseAll = async () => {
        if (isAllExpanded) {
            setExpandedParentIds(new Set());
            setIsAllExpanded(false);
        } else {
            setIsExpanding(true);
            const newExpandedIds = new Set();
            let tempTree = JSON.parse(JSON.stringify(parentTree)); // Deep copy to manage state locally

            const fetchChildren = async (node) => {
                try {
                    if (node.isDivision) {
                        const response = await axios.get(
                            `${import.meta.env.VITE_API_BASE_URL}/project/getParentBoqByDivision/${effectiveProjectId}/${encodeURIComponent(node.divisionName)}`,
                            { params: { page: 0, size: 1000 }, headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
                        );
                        if (response.status === 200) {
                            return (response.data.data || []).map(child => ({ ...child, lastLevel: true }));
                        }
                        return [];
                    }

                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${effectiveProjectId}/${node.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    if (response.status === 200) {
                        return (response.data || []).map(child => ({
                            ...child,
                            children: (child.lastLevel === false) ? null : []
                        }));
                    }
                } catch (e) {
                    console.error("Error fetching child boq during expand all", e);
                }
                return [];
            };

            const processNode = async (node) => {
                if (node.lastLevel === true) return;

                newExpandedIds.add(node.id);

                if (!Array.isArray(node.children) || node.children === 'pending' || (node.children.length === 0 && node.lastLevel === false)) {
                    const children = await fetchChildren(node);
                    node.children = children;
                }

                if (Array.isArray(node.children)) {
                    for (const child of node.children) {
                        await processNode(child);
                    }
                }
            };

            for (const node of tempTree) {
                await processNode(node);
            }

            setParentTree(tempTree);
            setExpandedParentIds(newExpandedIds);
            setIsAllExpanded(true);
            setIsExpanding(false);
        }
    };

    const expandParents = async (searchResults) => {
        const parentsToExpand = new Set();

        if (groupingMode === 'division') {
            searchResults.forEach(item => {
                const divName = item.division || "Non-Categorized";
                parentsToExpand.add(`div_${divName}`);
            });
            let currentTree = [...parentTree];
            const promises = Array.from(parentsToExpand).map(async (divId) => {
                const node = currentTree.find(n => n.id === divId);
                if (!node || (Array.isArray(node.children) && node.children.length > 0)) return null;
                try {
                    const response = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/project/getParentBoqByDivision/${effectiveProjectId}/${encodeURIComponent(node.divisionName)}`,
                        { params: { page: 0, size: 1000 }, headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
                    );
                    if (response.status === 200) {
                        const childrenData = (response.data.data || []).map(child => ({ ...child, lastLevel: true }));
                        return { divId, childrenData };
                    }
                } catch (e) { }
                return null;
            });
            const results = await Promise.all(promises);
            results.forEach(res => {
                if (res) {
                    const idx = currentTree.findIndex(n => n.id === res.divId);
                    if (idx !== -1) currentTree[idx] = { ...currentTree[idx], children: res.childrenData };
                }
            });
            setParentTree(currentTree);
            setExpandedParentIds(prev => {
                const next = new Set(prev);
                parentsToExpand.forEach(id => next.add(id));
                return next;
            });
            return;
        }

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
                        `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${effectiveProjectId}/${parentId}`,
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
                    const data = await searchBoq(effectiveProjectId, debouncedSearchQuery);
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
    }, [debouncedSearchQuery, effectiveProjectId]);
    const findUom = (uomId) => {
        const uom = uoms.find((uom) => uom.id === uomId);
        return uom?.uomCode;
    }
    const fetchBoqTotals = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoqTotals/${effectiveProjectId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });
            if (res.status === 200) {
                setBoqTotalsMap(res.data || {});
            }
        } catch (err) {
            console.error('Error fetching BOQ totals:', err);
        }
    };

    const refreshParentBoqData = async (page = 0) => {
        fetchBoqTotals();
        try {
            if (groupingMode === 'division') {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getDivisions/${effectiveProjectId}`, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (res.status === 200) {
                    const divisions = res.data || [];
                    if (!divisions.includes("Non-Categorized")) {
                        divisions.push("Non-Categorized");
                    }
                    const divisionNodes = divisions.map((div) => ({
                        id: `div_${div}`,
                        isDivision: true,
                        divisionName: div,
                        boqCode: div,
                        boqName: '',
                        children: null,
                        lastLevel: false,
                        level: 0
                    }));
                    setParentBoq(divisionNodes);
                    handleParentBoqTree(divisionNodes);
                    setBoqCurrentPage(0);
                    setBoqTotalPages(1);
                    setBoqTotalItems(divisionNodes.length);
                }
                return;
            }

            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${effectiveProjectId}`, {
                params: { page, size: boqPageSize },
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
            console.error('Error fetching parent BOQ:', err);
            setParentBoq([]);
            setBoqTotalPages(0);
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

    const toggleSelection = (boqId) => {
        setSelectedNodes(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(boqId)) {
                newSet.delete(boqId);
            } else {
                newSet.add(boqId);
            }
            return newSet;
        });
    };

    const toggleAllChildrenSelection = (children, selectAll) => {
        if (!Array.isArray(children)) return;

        setSelectedNodes(prevSet => {
            const newSet = new Set(prevSet);
            children.forEach(child => {
                if (child.lastLevel === true) {
                    if (selectAll) {
                        newSet.add(child.id);
                    } else {
                        newSet.delete(child.id);
                    }
                }
            });
            return newSet;
        });
    };

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
            if (parentNode && parentNode.isDivision) {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/project/getParentBoqByDivision/${effectiveProjectId}/${encodeURIComponent(parentNode.divisionName)}`,
                    { params: { page: 0, size: 1000 }, headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
                );
                if (response.status === 200) {
                    const childrenData = (response.data.data || []).map(child => ({ ...child, lastLevel: true }));
                    setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: childrenData }));
                } else {
                    setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
                }
                return;
            }

            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${effectiveProjectId}/${parentId}`,
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
                    parentBoqId: parentId,
                    children: (child.lastLevel === false) ? null : []
                }));
                setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: childrenData }));
            } else {
                console.error('Failed to fetch children BOQ data:', response.status);
                setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
            }
        } catch (err) {
            console.error('Error fetching children BOQ data:', err);
            setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
        }
    };
    const deleteBoqs = async (projectId, selectedCodes) => {
        let success = false;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/project/deleteBOQ/${effectiveProjectId}`,
                {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                    data: selectedCodes
                }
            ).then(res => {
                if (res.status === 200) {
                    toast.success("Selected BOQs deleted successfully");
                    success = true;
                }
            }).catch(err => {
                if (err?.response?.status === 409) {
                    toast.warn(err?.response?.data);
                } else {
                    toast.error(err?.response?.data || "An error occurred during deletion.");
                }
            });
        } catch (err) {
            console.error("Failed to delete BOQs", err);
            toast.error("Failed to delete BOQs");
        }
        return success;
    };
    const handleDeleteClick = () => {
        if (selectedNodes.size === 0) {
            toast.warn("No BOQ items selected for deletion");
            return;
        }
        setShowConfirmDialog(true);
    };
    const confirmDelete = async () => {
        setShowConfirmDialog(false);
        const selectedCodes = Array.from(selectedNodes);
        const success = await deleteBoqs(projectId, selectedCodes);
        setSelectedNodes(new Set());
        if (success) {
            await refreshParentBoqData();
            setExpandedParentIds(new Set());
        }
    };
    const cancelDelete = () => {
        setShowConfirmDialog(false);
    };
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${effectiveProjectId}`, {
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
    }, [effectiveProjectId, navigate]);
    useEffect(() => {
        refreshParentBoqData(0);
        fetchTotalBOQ();
        
        const fetchInvalidBoqs = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBoqDetails?projectId=${effectiveProjectId}`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
                });
                if (res.status === 200 && Array.isArray(res.data)) {
                    const allBoqs = res.data;
                    const invalidIds = new Set();
                    const parentMap = new Map();
                    allBoqs.forEach(b => {
                        parentMap.set(b.id, b.parentBoqId || (b.parentBOQ ? b.parentBOQ.id : null));
                        if (b.lastLevel === true && (!b.boqCode || !String(b.boqCode).trim() || !b.boqName || !String(b.boqName).trim())) {
                            invalidIds.add(b.id);
                        }
                    });
                    const invalidHierarchyIds = new Set(invalidIds);
                    const markParents = (id) => {
                        const pid = parentMap.get(id);
                        if (pid && !invalidHierarchyIds.has(pid)) {
                            invalidHierarchyIds.add(pid);
                            markParents(pid);
                        }
                    };
                    invalidIds.forEach(id => markParents(id));
                    setInitialInvalidNodes(invalidHierarchyIds);
                }
            } catch (e) {
                console.error("Error fetching all boqs for invalid check", e);
            }
        };
        fetchInvalidBoqs();
    }, [effectiveProjectId, navigate, boqPageSize, groupingMode]);
    const fetchTotalBOQ = async () => {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBOQCount/${effectiveProjectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setTotalBOQ(res.data.totalBOQCount);
            } else {
                console.error('Failed to fetch total BOQ:', res.status);
            }
        }).catch(err => {
            console.error('Error fetching total BOQ:', err);
        });
    }

    const handleHierarchySave = async () => {
        if (Object.keys(hierarchyUpdates).length === 0) {
            toast.warn("No changes to save.");
            return;
        }

        try {
            if (groupingMode === 'division') {
                const response = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/update-boq-division/${effectiveProjectId}`,
                    hierarchyUpdates,
                    { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` } }
                );
                toast.success(response.data || "Division updated successfully");
            } else {
                const response = await updateBOQHierarchy(effectiveProjectId, hierarchyUpdates);
                toast.success(response || "Hierarchy updated successfully");
            }
            setHierarchyUpdates({});
            setIsHierarchyMode(false);
            refreshParentBoqData();
        } catch (error) {
            console.error("Error updating structure:", error);
            toast.error(error?.response?.data || "Failed to update structure");
        }
    };

    const handleMoveNode = (childId, parentId) => {
        setHierarchyUpdates(prev => ({
            ...prev,
            [childId]: parentId
        }));
        setShowHierarchyModal(false);
        setSelectedBoqForMove(null);
        toast.info("Change staged. Save to apply.");
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
    const exportExcel = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/project/Boq/excel/${effectiveProjectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    responseType: "blob",
                }
            );
            if (response.status === 204) {
                toast.warn("No BOQ data available to export to Excel.");
                return;
            }

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BOQ_${project?.projectName || 'project'}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("BOQ Excel file exported successfully.");
        } catch (err) {
            console.error("Export Excel Failed:", err);
            toast.error("Failed to export Excel file.");
        }
    };

    const exportPdf = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/project/Boq/pdf/${effectiveProjectId}`,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    responseType: "blob",
                }
            );
            if (response.status === 204) {
                toast.warn("No BOQ data available to export to PDF.");
                return;
            }

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BOQ_${project?.projectName || 'project'}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("BOQ PDF file exported successfully.");
        } catch (err) {
            console.error("Export PDF Failed:", err);
            toast.error("Failed to export PDF file.");
        }
    };

    const checkInvalidity = (node) => {
        if (node.lastLevel === true) {
            return !node.boqCode || !String(node.boqCode).trim() || !node.boqName || !String(node.boqName).trim();
        }
        if (Array.isArray(node.children)) {
            return node.children.some(child => checkInvalidity(child));
        }
        return false;
    };

    const BOQNode = ({ boq, level = 0 }) => {
        const canExpand = boq.lastLevel === false;
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
        const allLeafChildrenIds = hasLeafChildren ? leafChildren.map(child => child.id) : [];
        const isAllLeafChildrenSelected = allLeafChildrenIds.length > 0 && allLeafChildrenIds.every(id => selectedNodes.has(id));
        const BoqIcon = isExpanded ? ChevronDown : ChevronRight;
        const boqNameDisplay = boq.boqName && boq.boqName.length > 80
            ? boq.boqName.substring(0, 80) + '...'
            : boq.boqName;
        const indentation = level * 10;
        if (boq.lastLevel === true) {
            const isInvalid = !boq.boqCode || !String(boq.boqCode).trim() || !boq.boqName || !String(boq.boqName).trim();
            const rowBgColor = highlightedNodes.has(boq.id) ? '#EFF6FF' : 'white';
            const leafBgColor = highlightedNodes.has(boq.id) ? '#EFF6FF' : 'inherit';

            return (
                <tr className="boq-leaf-row" style={{ borderBottom: '1px solid #eee', backgroundColor: rowBgColor }}>
                    <td className="px-2" style={{ paddingLeft: `${indentation + 8}px`, backgroundColor: leafBgColor }}>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ borderColor: '#005197' }}
                            checked={selectedNodes.has(boq.id)}
                            onChange={() => toggleSelection(boq.id)}
                        />
                    </td>
                    <td className="px-2">
                        {(!boq.boqCode || !String(boq.boqCode).trim()) ? 
                            <span className="text-danger fw-bold bg-white px-1 rounded border border-danger">Missing</span> : boq.boqCode}
                    </td>
                    <td className="px-2" title="Click to view full BOQ Name" onClick={(e) => { e.stopPropagation(); setSelectedBoqForModal(boq); }} style={{ cursor: 'pointer' }}>
                        {(!boq.boqName || !String(boq.boqName).trim()) ? 
                            <span className="text-danger fw-bold bg-white px-1 rounded border border-danger">Missing Name</span> : boqNameDisplay}
                        {hierarchyUpdates[boq.id] && <span className="badge bg-warning ms-2">Moved</span>}
                    </td>
                    <td className="px-2">{boq?.uom?.uomCode || boq.uomCode || '-'}</td>
                    <td className="px-2">{boq.quantity?.toFixed(3) || 0}</td>
                    <td className="px-2">{boq.pageNo || '-'}</td>
                    <td className="px-2">
                        <Edit
                            size={16}
                            style={{ cursor: 'pointer', color: '#005197', marginRight: '8px' }}
                            onClick={(e) => handleEditClick(e, boq)}
                            title="Edit BOQ"
                        />
                        {isHierarchyMode && (
                            <Move
                                size={16}
                                style={{ cursor: 'pointer', color: '#005197' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedBoqForMove(boq);
                                    setShowHierarchyModal(true);
                                }}
                            />
                        )}
                    </td>
                </tr>
            );
        }

        const isInvalidHierarchy = initialInvalidNodes.has(boq.id) || checkInvalidity(boq);
        return (
            <div
                className="boq-non-leaf-container rounded-3 ms-3 me-3"
                key={boq.id}
                style={{ marginLeft: `${indentation}px` }}
            >
                <div
                    className="parent-boq text-start p-3 rounded-2 d-flex flex-column mb-4"
                    style={{ 
                        cursor: canExpand ? 'pointer' : 'default', 
                        backgroundColor: highlightedNodes.has(boq.id) ? '#EFF6FF' : (isInvalidHierarchy ? '#FFEBEB' : (boq.level === 2 && 'white')), 
                        borderLeft: `${isExpanded ? '0.5px solid #0051973D' : (isInvalidHierarchy ? '3px solid #dc3545' : 'none')}` 
                    }}
                >
                    <div className="d-flex"
                        onClick={(e) => {
                            if (boq.level > 0) e.stopPropagation();
                            if (canExpand) handleToggle(boq.id);
                        }}
                    >
                        {canExpand ? <BoqIcon size={18} /> : <span style={{ width: 20, marginRight: 4 }}></span>}
                        <span className="ms-2 fw-bold">{boq.boqCode}</span>
                        <span className="ms-3" title="Click to view full BOQ Name" onClick={(e) => { e.stopPropagation(); setSelectedBoqForModal(boq); }} style={{ cursor: 'pointer' }}>
                            {boqNameDisplay}
                            {hierarchyUpdates[boq.id] && <span className="badge bg-warning ms-2">Moved</span>}
                        </span>

                        <div className="ms-auto d-flex align-items-center gap-3">
                            {boqTotalsMap[boq.id] !== undefined && (
                                <span className="fw-bold me-3" style={{ color: '#005197' }}>
                                    <IndianRupee size={14} className="me-1 mb-1" />
                                    {boqTotalsMap[boq.id]?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            )}
                            <PlusCircle
                                size={16}
                                style={{ cursor: 'pointer', color: '#28a745' }}
                                onClick={(e) => handleAddChildClick(e, boq)}
                                title="Add Child BOQ"
                            />
                            {boq.level !== 0 && (
                                <Edit
                                    size={16}
                                    style={{ cursor: 'pointer', color: '#005197' }}
                                    onClick={(e) => handleEditClick(e, boq)}
                                    title="Edit BOQ"
                                />
                            )}
                            {isHierarchyMode && (
                                <Move
                                    size={16}
                                    style={{ cursor: 'pointer', color: '#005197' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedBoqForMove(boq);
                                        setShowHierarchyModal(true);
                                    }}
                                />
                            )}
                            {(boq.childCount === 0 || hasNoChildren) && (
                                <DeleteIcon
                                    style={{
                                        cursor: 'pointer',
                                        width: '16px',
                                        height: '16px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedNodes(new Set([boq.id]));
                                        setShowConfirmDialog(true);
                                    }}
                                    title="Delete this empty BOQ"
                                />
                            )}
                        </div>
                    </div>

                    {isExpanded && canExpand && (
                        <div
                            className="children-section mt-3"
                        >
                            {isLoading && (
                                <div className="text-muted p-2">Loading items...</div>
                            )}

                            {hasFetchedChildren && (
                                <div className="children-content">
                                    {hasLeafChildren && (
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr style={{ borderBottom: '0.5px solid #0051973D', color: '#005197' }}>

                                                        <th className="px-2" style={{ paddingLeft: `${indentation + 10 + 8}px` }}>
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                style={{ borderColor: '#005197' }}
                                                                checked={isAllLeafChildrenSelected}
                                                                onChange={(e) => toggleAllChildrenSelection(leafChildren, e.target.checked)}
                                                            />
                                                        </th>
                                                        <th className="px-2">BOQ Code</th>
                                                        <th className="px-2">BOQ Name</th>
                                                        <th className="px-2">UOM</th>
                                                        <th className="px-2">Quantity</th>
                                                        <th className="px-2">Page No</th>
                                                        <th className="px-2">Actions</th>
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
                                <div className="no-items-message text-muted p-2 text-center mt-2">
                                    No items found.
                                    {/* <button type="button" className="btn btn-danger" onClick={() => {toggleSelection(boq.id); handleDeleteClick();}}>
                                        Delete
                                    </button> */}
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
        uploadScreen ? (
            <BOQUpload projectId={effectiveProjectId} projectName={displayProjectName} setUploadScreen={setUploadScreen} />
        ) : (
            <div className="container-fluid p-2 min-vh-100">
                <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-1 mt-1 mb-3">
                    <div className="ms-3">
                        <ArrowLeft size={20} onClick={() => window.history.back()} />
                        <span className='ms-2'>BOQ Definition</span>
                        <span>-</span>
                        <span>{displayProjectName}</span>
                    </div>
                    <div className="me-3">
                        <button className="btn export-button me-2" onClick={() => setShowExportModal(true)}>
                            <span className="me-2"><Export /></span>Export File
                        </button>
                        <button className="btn import-button ms-2" onClick={() => {
                            if (location.pathname.startsWith('/external')) {
                                navigate(`/external/boq-upload/${effectiveProjectId}/${token}${location.search}`);
                            } else {
                                setUploadScreen(true);
                            }
                        }}>
                            <span className="me-2"><Import /></span>Import File
                        </button>
                        <button className="btn action-button ms-2" onClick={() => setShowCreateModal(true)}>
                            <span className="me-2">+</span>Create BOQ
                        </button>
                        {showExportModal && (
                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
                                <div className="modal-dialog modal-md modal-dialog-centered">
                                    <div className="modal-content shadow">
                                        <div className="modal-header border-bottom-0" style={{ backgroundColor: '#005197', color: 'white' }}>
                                            <h5 className="modal-title fw-medium fs-6">Select Export Format</h5>
                                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowExportModal(false)}></button>
                                        </div>
                                        <div className="modal-body d-flex flex-column gap-3 p-4">
                                            <button className="btn action-button py-2" onClick={() => { exportPdf(); setShowExportModal(false); }}>
                                                Export as PDF
                                            </button>
                                            <button className="btn action-button py-2" onClick={() => { exportExcel(); setShowExportModal(false); }}>
                                                Export as Excel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {showCreateModal && (
                            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}>
                                <div className="modal-dialog modal-xl modal-dialog-centered">
                                    <div className="modal-content shadow">
                                        <div className="modal-header border-bottom-0" style={{ backgroundColor: '#005197', color: 'white' }}>
                                            <h5 className="modal-title fw-medium fs-6">{editBoqId ? "Edit BOQ" : "Create Single BOQ"}</h5>
                                            <button type="button" className="btn-close btn-close-white" onClick={() => { setShowCreateModal(false); setEditBoqId(null); }}></button>
                                        </div>
                                        <div className="modal-body p-4">
                                            <div className="d-flex justify-content-end gap-4 mb-3">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="rateOnly" name="rateOnly" checked={newBoqData.rateOnly} onChange={handleCreateBoqChange} />
                                                    <label className="form-check-label" htmlFor="rateOnly">Rate Only</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="provisionalSum" name="provisionalSum" checked={newBoqData.provisionalSum} onChange={handleCreateBoqChange} />
                                                    <label className="form-check-label" htmlFor="provisionalSum">Provisional Sum</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="notQuotedBoq" name="notQuotedBoq" checked={newBoqData.notQuotedBoq} onChange={handleCreateBoqChange} />
                                                    <label className="form-check-label" htmlFor="notQuotedBoq">Not Quoted BOQ</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="pricedBoq" name="pricedBoq" checked={newBoqData.pricedBoq} onChange={handleCreateBoqChange} />
                                                    <label className="form-check-label" htmlFor="pricedBoq">Priced BOQ</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" id="lastLevel" name="lastLevel" checked={newBoqData.lastLevel} onChange={handleCreateBoqChange} />
                                                    <label className="form-check-label" htmlFor="lastLevel">Last Level</label>
                                                </div>
                                            </div>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label text-start d-block">BOQ Name <span className="text-danger">*</span></label>
                                                    <textarea className="form-input w-100" name="boqName" value={newBoqData.boqName} onChange={handleCreateBoqChange} placeholder="Enter BOQ Name" rows="3"></textarea>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-start d-block">Description</label>
                                                    <textarea className="form-input w-100" name="description" value={newBoqData.description} onChange={handleCreateBoqChange} placeholder="Description" rows="3"></textarea>
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">BOQ Code <span className="text-danger">*</span></label>
                                                    <input type="text" className="form-input w-100" name="boqCode" value={newBoqData.boqCode} onChange={handleCreateBoqChange} placeholder="Enter BOQ Code" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Quantity</label>
                                                    <input type="number" step="0.001" className="form-input w-100" name="quantity" value={newBoqData.quantity} onChange={handleCreateBoqChange} onKeyDown={handleDecimalInput} placeholder="Enter Quantity" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">UOM</label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        options={uoms.map((uom) => ({ value: uom.uomCode, label: `${uom.uomCode} - ${uom.uomName}` }))}
                                                        value={uoms.map(u => ({ value: u.uomCode, label: `${u.uomCode} - ${u.uomName}` })).find(o => o.value === newBoqData.uomCode) || null}
                                                        onChange={handleUomChange}
                                                        placeholder="Select UOM"
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Level <span className="text-danger">*</span></label>
                                                    <input type="number" min="1" className="form-input w-100" name="level" value={newBoqData.level} onChange={handleLevelChange} onKeyDown={handleIntegerInput} placeholder="Enter Level" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Parent BOQ {newBoqData.level > 1 && <span className="text-danger">*</span>}</label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        options={parentBoqOptions.map(p => ({ value: p.id, label: `${p.boqCode} - ${p.boqName}` }))}
                                                        value={parentBoqOptions.map(p => ({ value: p.id, label: `${p.boqCode} - ${p.boqName}` })).find(o => o.value === newBoqData.parentBoqId) || null}
                                                        onChange={handleParentChange}
                                                        isDisabled={!newBoqData.level || newBoqData.level <= 1}
                                                        placeholder={(!newBoqData.level || newBoqData.level <= 1) ? "No Parent Needed" : "Select Parent BOQ"}
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Division</label>
                                                    <input type="text" className="form-input w-100" name="division" value={newBoqData.division} onChange={handleCreateBoqChange} placeholder="e.g. Civil, Mechanical" />
                                                </div>



                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Page No</label>
                                                    <input type="number" className="form-input w-100" name="pageNo" value={newBoqData.pageNo} onChange={handleCreateBoqChange} placeholder="Inherits from parent or enter manually" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Enq Sl No</label>
                                                    <input type="number" step="0.01" className="form-input w-100" name="enqSlNo" value={newBoqData.enqSlNo} onChange={handleCreateBoqChange} placeholder="Enter Enq Sl No" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Version</label>
                                                    <input type="number" className="form-input w-100" name="version" value={newBoqData.version} readOnly placeholder="Version" style={{ backgroundColor: '#f8f9fa' }} />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">Client BOQ Code</label>
                                                    <input type="text" className="form-input w-100" name="clientBoqCode" value={newBoqData.clientBoqCode} onChange={handleCreateBoqChange} placeholder="Client BOQ Code" />
                                                </div>
                                                <div className="col-md-4">
                                                    <label className="form-label text-start d-block">BOQ Short Name</label>
                                                    <input type="text" className="form-input w-100" name="boqShortName" value={newBoqData.boqShortName} onChange={handleCreateBoqChange} placeholder="BOQ Short Name" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer border-top-0 pt-0">
                                            <button type="button" className="btn btn-secondary px-4" onClick={() => { setShowCreateModal(false); setEditBoqId(null); }}>Cancel</button>
                                            <button type="button" className="btn action-button px-4" onClick={submitCreateBoq} disabled={isCreatingBoq}>
                                                {isCreatingBoq ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Saving...
                                                    </>
                                                ) : "Save BOQ"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* <div className="bg-white rounded-3 ms-3 me-3 mt-2 p-2" style={{ border: '0.5px solid #0051973D' }}>
                    <p className="fw-bold text-start mt-2 ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</p>
                    <div className="row justify-content-between ms-3">
                        {BOQStats.map((stats, index) => (
                            <div className="col-lg-4 col-md-4 col-sm-12" key={index}>
                                <div className="p-2 rounded-3 mb-3" style={{ backgroundColor: stats.bgColor, color: stats.color, width: '90%' }}>
                                    <p className="fw-bold text-start ms-2 mt-1">{stats.label}</p>
                                    <p className="mt-2 fw-bold text-start text-black ms-2">{stats.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}

                <div className="bg-white rounded-3 ms-3 me-3 mt-4 p-2 d-flex flex-column" style={{ border: '0.5px solid #0051973D', maxHeight: '80vh' }}>
                    <div className="d-flex justify-content-between mb-3 sticky-top bg-white p-2" style={{ top: 0, zIndex: 10, borderBottom: '1px solid #f0f0f0' }}>
                        <div className="fw-bold text-start mt-2 ms-1 d-flex align-items-center gap-3">
                            <span>BOQ Structure</span>
                        </div>
                        <div className="me-3 d-flex align-items-center gap-3">
                            <div className="btn-group me-2" role="group">
                                <input type="radio" className="btn-check" name="groupingOptions" id="groupLevel" autoComplete="off" checked={groupingMode === 'level'} onChange={() => { setGroupingMode('level'); setExpandedParentIds(new Set()); }} />
                                <label className="btn btn-outline-primary d-flex align-items-center justify-content-center px-3" style={{ height: '38px' }} htmlFor="groupLevel">Level Wise</label>

                                <input type="radio" className="btn-check" name="groupingOptions" id="groupDivision" autoComplete="off" checked={groupingMode === 'division'} onChange={() => { setGroupingMode('division'); setExpandedParentIds(new Set()); }} />
                                <label className="btn btn-outline-primary d-flex align-items-center justify-content-center px-3" style={{ height: '38px' }} htmlFor="groupDivision">Division Wise</label>
                            </div>
                            <div className="position-relative" style={{ width: '300px' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search BOQ..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ height: '38px', paddingRight: '30px' }}
                                />
                            </div>

                            <button
                                className={`btn ${isHierarchyMode ? 'btn-warning' : ''} me-2 d-flex align-items-center justify-content-center gap-2`}
                                style={Object.assign({ height: '38px' }, !isHierarchyMode ? { borderColor: '#005197', color: '#005197' } : {})}
                                onClick={() => setIsHierarchyMode(!isHierarchyMode)}
                                title={isHierarchyMode ? "Exit Hierarchy Mode" : "Edit BOQ Hierarchy"}
                            >
                                <Move size={18} />
                                <span className="d-none d-lg-inline">Edit Hierarchy</span>
                            </button>
                            {isHierarchyMode && Object.keys(hierarchyUpdates).length > 0 && (
                                <button
                                    className="btn btn-success me-2 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleHierarchySave}
                                    title="Save hierarchy changes"
                                    style={{ height: '38px' }}
                                >
                                    <Save size={18} />
                                    <span className="d-none d-lg-inline">Save Changes</span>
                                </button>
                            )}
                            <button
                                className="btn p-0 me-2 d-flex align-items-center justify-content-center"
                                style={{
                                    height: '38px',
                                    cursor: isExpanding ? 'wait' : 'pointer',
                                    color: '#005197',
                                    opacity: isExpanding ? 0.6 : 1
                                }}
                                onClick={handleExpandCollapseAll}
                                disabled={isExpanding}
                                title={isAllExpanded ? "Collapse All" : "Expand All"}
                            >
                                {isExpanding ? (
                                    <div className="spinner-border spinner-border-sm" style={{ color: '#005197' }} role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    isAllExpanded ? <CollapseIcon /> : <ExpandIcon />
                                )}
                            </button>
                            <div className="d-flex align-items-center justify-content-center" style={{ height: '38px' }}>
                                <DeleteIcon
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleDeleteClick}
                                    title="Delete selected items"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="boq-structure-list mt-3 flex-grow-1 overflow-y-auto px-2" style={{ scrollbarWidth: 'thin' }}>
                        {(() => {
                            const leafItems = visibleTree.filter(boq => boq.lastLevel === true);
                            const nonLeafItems = visibleTree.filter(boq => boq.lastLevel !== true);

                            return (
                                <>
                                    {leafItems.length > 0 && (
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr style={{ borderBottom: '0.5px solid #0051973D', color: '#005197' }}>
                                                        <th className="px-2">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                style={{ borderColor: '#005197' }}
                                                                checked={leafItems.length > 0 && leafItems.every(item => selectedNodes.has(item.id))}
                                                                onChange={(e) => toggleAllChildrenSelection(leafItems, e.target.checked)}
                                                            />
                                                        </th>
                                                        <th className="px-2">BOQ Code</th>
                                                        <th className="px-2">BOQ Name</th>
                                                        <th className="px-2">UOM</th>
                                                        <th className="px-2">Quantity</th>
                                                        <th className="px-2">Page No</th>
                                                        {isHierarchyMode && <th className="px-2">Move</th>}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {leafItems.map((boq) => (
                                                        <BOQNode key={boq.id} boq={boq} level={0} />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    {nonLeafItems.map((boq) => (
                                        <BOQNode key={boq.id} boq={boq} level={0} />
                                    ))}
                                </>
                            );
                        })()}
                    </div>
                    {parentBoq.length > 0 && (
                        <div className='d-flex justify-content-between align-items-center mt-3 p-3 border-top bg-white sticky-bottom' style={{ bottom: 0, zIndex: 10 }}>
                            <div className="d-flex align-items-center gap-3">
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: 'auto', fontSize: '12px' }}
                                    value={boqPageSize}
                                    onChange={(e) => setBoqPageSize(parseInt(e.target.value))}
                                >
                                    <option value={10}>10 per page</option>
                                    <option value={15}>15 per page</option>
                                    <option value={25}>25 per page</option>
                                    <option value={50}>50 per page</option>
                                    <option value={100}>100 per page</option>
                                </select>
                                <span className="text-muted small">
                                    Showing {(boqCurrentPage * boqPageSize) + 1} - {Math.min((boqCurrentPage + 1) * boqPageSize, boqTotalItems)} of {boqTotalItems} Items
                                </span>
                            </div>
                            <div className='d-flex align-items-center gap-2'>
                                <button
                                    className="btn pagination-btn"
                                    onClick={() => refreshParentBoqData(boqCurrentPage - 1)}
                                    disabled={boqCurrentPage === 0}
                                    style={{ padding: '4px 8px', border: '1px solid #dee2e6', backgroundColor: boqCurrentPage === 0 ? '#f8f9fa' : 'white' }}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="px-3 py-1 rounded bg-light border small fw-medium">
                                    Page {boqCurrentPage + 1} of {boqTotalPages || 1}
                                </div>
                                <button
                                    className="btn pagination-btn"
                                    onClick={() => refreshParentBoqData(boqCurrentPage + 1)}
                                    disabled={boqCurrentPage >= boqTotalPages - 1}
                                    style={{ padding: '4px 8px', border: '1px solid #dee2e6', backgroundColor: boqCurrentPage >= boqTotalPages - 1 ? '#f8f9fa' : 'white' }}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
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

                <ConfirmationDialog
                    isOpen={showConfirmDialog}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    message={`Are you sure you want to delete ${selectedNodes.size} selected BOQ item(s)?`}
                />

                {showHierarchyModal && (
                    <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1100 }}>
                        <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header text-white" style={{ backgroundColor: '#005197' }}>
                                    <h5 className="modal-title">Select New Parent</h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowHierarchyModal(false)}></button>
                                </div>
                                <div className="modal-body text-start" style={{ maxHeight: '60vh' }}>
                                    <p className="mb-3 text-muted small">Moving: <strong>{selectedBoqForMove?.boqCode}</strong></p>
                                    <div
                                        className="p-2 mb-3 rounded border fw-bold"
                                        style={{ cursor: 'pointer', backgroundColor: '#f8f9fa', color: '#005197', borderColor: '#005197' }}
                                        onClick={() => handleMoveNode(selectedBoqForMove.id, "ROOT")}
                                    >
                                        Move to Root (No Parent)
                                    </div>
                                    <div className="hierarchy-tree">
                                        {parentTree.map(node => (
                                            <HierarchySelectionNode
                                                key={node.id}
                                                boq={node}
                                                onSelect={(parentId) => handleMoveNode(selectedBoqForMove.id, parentId)}
                                                selectedBoqForMove={selectedBoqForMove}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowHierarchyModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    );
}

export default BOQOverview;