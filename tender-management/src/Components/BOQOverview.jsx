import axios from "axios";
import { ArrowLeft, ChevronDown, ChevronRight, IndianRupee } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from "react";
import CollapseIcon from '../assest/Collapse.svg?react';
import DeleteIcon from '../assest/DeleteIcon.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import Export from '../assest/Export.svg?react';
import Import from '../assest/Import.svg?react';
import BOQUpload from "./BOQUpload";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useUom } from "../Context/UomContext";


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

function BOQOverview({ projectId }) {
    const navigate = useNavigate();
    const [parentBoq, setParentBoq] = useState([]);
    const [parentTree, setParentTree] = useState([]);
    const [project, setProject] = useState();
    const [uploadScreen, setUploadScreen] = useState(false);
    const [expandedParentIds, setExpandedParentIds] = useState(new Set());
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [totalBOQ, setTotalBOQ] = useState(0);
    const [lastLevelBOQ, setLastLevelBOQ] = useState(0);
    const uoms = useUom();
    const findUom = (uomId) => {
        const uom = uoms.find((uom) => uom.id === uomId);
        return uom?.uomCode;
    }
    const refreshParentBoqData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            if (res.status === 200) {
                setParentBoq(res.data || []);
                handleParentBoqTree(res.data || []);
            } else {
                console.error('Failed to fetch BOQ data:', res.status);
                setParentBoq([]);
            }
        } catch (err) {
            if (err?.response?.status === 401) {
                navigate('/login');
            }
            setParentBoq([]);
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
                navigate('/login');
            }
            console.error('Error fetching children BOQ data:', err);
            setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
        }
    };
    const deleteBoqs = async (projectId, selectedCodes) => {
        let success = false;
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/project/deleteBOQ/${projectId}`,
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
                if (err?.response?.status === 401) {
                    navigate('/login');
                }
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
    const BOQStats = [
        { label: 'Total BOQ', value: totalBOQ, bgColor: '#F0FDF4', color: '#2BA95A' },
        { label: 'Level 1 BOQ', value: parentBoq.length, bgColor: '#EFF6FF', color: '#2563EB' },
        { label: 'Last Level BOQ', value: lastLevelBOQ, bgColor: '#FFF7ED', color: '#EA580C' },
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
            if (err?.response?.status === 401) {
                navigate('/login');
            }
        });
    }, [projectId, navigate]);
    useEffect(() => {
        refreshParentBoqData();
        fetchTotalBOQ();
    }, [projectId, navigate]);
    const fetchTotalBOQ = async () => {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBOQCount/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setTotalBOQ(res.data.totalBOQCount);
                setLastLevelBOQ(res.data.lastLevelBOQCount);
            } else {
                console.error('Failed to fetch total BOQ:', res.status);
            }
        }).catch(err => {
            if (err?.response?.status === 401) {
                navigate('/login');
            }
            console.error('Error fetching total BOQ:', err);
        });
    }
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
                `${import.meta.env.VITE_API_BASE_URL}/project/Boq/excel/${projectId}`,
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
            if (err?.response?.status === 401) {
                navigate('/login');
            } else {
                console.error("Export Excel Failed:", err);
                toast.error("Failed to export Excel file.");
            }
        }
    };

    const exportPdf = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/project/Boq/pdf/${projectId}`,
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
            if (err?.response?.status === 401) {
                navigate('/login');
            } else {
                console.error("Export PDF Failed:", err);
                toast.error("Failed to export PDF file.");
            }
        }
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
            return (
                <tr className="boq-leaf-row bg-white" style={{ borderBottom: '1px solid #eee' }}>
                    <td className="px-2" style={{ paddingLeft: `${indentation + 8}px` }}>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            style={{ borderColor: '#005197' }}
                            checked={selectedNodes.has(boq.id)}
                            onChange={() => toggleSelection(boq.id)}
                        />
                    </td>
                    <td className="px-2">{boq.boqCode}</td>
                    <td className="px-2" title={boq.boqName}>{boqNameDisplay}</td>
                    <td className="px-2">{findUom(boq.uomId) || '-'}</td>
                    <td className="px-2">{boq.quantity?.toFixed(3) || 0}</td>
                </tr>
            );
        }

        return (
            <div
                className="boq-non-leaf-container rounded-3 ms-3 me-3"
                key={boq.id}
                style={{ marginLeft: `${indentation}px` }}
            >
                <div
                    className="parent-boq text-start p-3 rounded-2 d-flex flex-column mb-4"
                    style={{ cursor: canExpand ? 'pointer' : 'default', backgroundColor: `${boq.level === 2 && 'white'}`, borderLeft: `${isExpanded ? '0.5px solid #0051973D' : 'none'}` }}
                >
                    <div className="d-flex"
                        onClick={(e) => {
                            if (boq.level > 0) e.stopPropagation();
                            if (canExpand) handleToggle(boq.id);
                        }}
                    >
                        {canExpand ? <BoqIcon size={18} /> : <span style={{ width: 20, marginRight: 4 }}></span>}
                        <span className="ms-2 fw-bold">{boq.boqCode}</span>
                        <span className="ms-3 text-dark" title={boq.boqName}>{boqNameDisplay}</span>
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
    return (
        uploadScreen ? (
            <BOQUpload projectId={projectId} projectName={project?.projectName + '(' + project?.projectCode + ')'} setUploadScreen={setUploadScreen} />
        ) : (
            <div className="container-fluid min-vh-100">
                <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-1 mt-1 mb-3">
                    <div className="ms-3">
                        <ArrowLeft size={20} onClick={() => window.history.back()} />
                        <span className='ms-2'>BOQ Definition</span>
                    </div>
                    <div className="me-3">
                        <button className="btn export-button me-2" onMouseEnter={() => setShowPopover(true)}>
                            <span className="me-2"><Export /></span>Export File
                        </button>
                        <button className="btn import-button ms-2" onClick={() => setUploadScreen(true)}>
                            <span className="me-2"><Import /></span>Import File
                        </button>
                        {showPopover && (
                            <div className="popover bs-popover-bottom show position-absolute mt-1" onMouseLeave={() => setShowPopover(false)} style={{ zIndex: 10 }}>
                                <div className="popover-body d-flex flex-column">
                                    <button className="btn action-button mb-2" onClick={exportPdf}>PDF</button>
                                    <button className="btn action-button" onClick={exportExcel}>Excel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-3 ms-3 me-3 mt-2 p-2" style={{ border: '0.5px solid #0051973D' }}>
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
                </div>

                <div className="bg-white rounded-3 ms-3 me-3 mt-4 p-2" style={{ border: '0.5px solid #0051973D' }}>
                    <div className="d-flex justify-content-between mb-3">
                        <div className="fw-bold text-start mt-2 ms-1">
                            <span>BOQ Structure</span>
                        </div>
                        <div className="me-3 d-flex align-items-center">
                            {/* <button className="btn" style={{ cursor: 'pointer', color: '#005197' }} onClick={toggleAll}>
                                {isAllExpanded ? (
                                    <>
                                        <CollapseIcon /><span>Collapse All</span>
                                    </>
                                ) : (
                                    <>
                                        <ExpandIcon /><span>Expand All</span>
                                    </>
                                )}
                            </button> */}
                            <DeleteIcon
                                style={{ cursor: 'pointer' }}
                                onClick={handleDeleteClick}
                                title="Delete selected items"
                            />
                        </div>
                    </div>

                    <div className="boq-structure-list mt-3">
                        {parentTree.length > 0 && parentTree.every(boq => boq.lastLevel === true) ? (
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr style={{ borderBottom: '0.5px solid #0051973D', color: '#005197' }}>
                                            <th className="px-2"></th>
                                            <th className="px-2">BOQ Code</th>
                                            <th className="px-2">BOQ Name</th>
                                            <th className="px-2">UOM</th>
                                            <th className="px-2">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parentTree.map((boq) => (
                                            <BOQNode key={boq.id} boq={boq} level={0} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            parentTree.map((boq) => (
                                <BOQNode key={boq.id} boq={boq} level={0} />
                            ))
                        )}
                    </div>
                </div>

                <ConfirmationDialog
                    isOpen={showConfirmDialog}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    message={`Are you sure you want to delete ${selectedNodes.size} selected BOQ item(s)?`}
                />
            </div>
        )
    );
}

export default BOQOverview;