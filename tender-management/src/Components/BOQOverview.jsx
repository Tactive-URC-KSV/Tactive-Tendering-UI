import axios from "axios";
import { ArrowLeft } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from "react";
import CollapseIcon from '../assest/Collapse.svg?react';
import DeleteIcon from '../assest/DeleteIcon.svg?react';
import DropDown from '../assest/DropDown.svg?react';
import ExpandIcon from '../assest/Expand.svg?react';
import Export from '../assest/Export.svg?react';
import Import from '../assest/Import.svg?react';
import BOQUpload from "./BOQUpload";
import { toast } from 'react-toastify';

const BOQContext = createContext();

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

function BOQNode({ boq, level = 0 }) {
    const { expanded, toggleExpanded, projectId, refreshBOQData, selectedNodes, setSelectedNodes } = useContext(BOQContext);
    const isExpanded = expanded.has(boq.boqCode);
    const hasChildren = Array.isArray(boq.children) && boq.children.length > 0;
    const total = boq.calculatedTotal || 0;
    const isLeaf = !hasChildren;

    const hasTableChildren = hasChildren && boq.children.every(child =>
        !child.children || child.children.length === 0
    );

    const toggleSelection = (boqCode) => {
        setSelectedNodes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(boqCode)) {
                newSet.delete(boqCode);
            } else {
                newSet.add(boqCode);
            }
            return newSet;
        });
    };

    const toggleAllSelection = () => {
        if (!hasChildren) return;

        const allChildrenSelected = boq.children.every(child => selectedNodes.has(child.boqCode));

        setSelectedNodes(prev => {
            const newSet = new Set(prev);

            if (allChildrenSelected) {
                boq.children.forEach(child => {
                    newSet.delete(child.boqCode);
                });
            } else {
                boq.children.forEach(child => {
                    newSet.add(child.boqCode);
                });
            }

            return newSet;
        });
    };

    if (isLeaf) {
        return (
            <tr>
                <td>
                    <input
                        type="checkbox"
                        className="form-check-input"
                        style={{ borderColor: '#005197' }}
                        checked={selectedNodes.has(boq.boqCode)}
                        onChange={() => toggleSelection(boq.boqCode)}
                    />
                </td>
                <td className="boq-data">{boq.boqName || '-'}</td>
                <td className="boq-data">{boq.uom?.uomCode || '-'}</td>
                <td className="boq-data">{boq.quantity?.toFixed(3) || 0}</td>
                <td className="boq-data">{boq.totalRate?.toFixed(2) || 0}</td>
                <td className="boq-data">{boq.totalAmount?.toFixed(2) || 0}</td>
            </tr>
        );
    }

    if (!boq) {
        return <div>Error: BOQ data is missing</div>;
    }

    return (
        <>
            <div className={`boq-node p-2 rounded-4 mb-2 text-start ${level === 0 ? 'bg-light-blue' : 'bg-light-blue'}`} style={{ marginLeft: level * 20, border: level === 0 ? '0.5px solid #0051973D' : 'none', background: 'rgba(239, 246, 255, 1)' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        {hasChildren && (
                            <span style={{ cursor: 'pointer' }} onClick={() => toggleExpanded(boq.boqCode)}>
                                <DropDown />
                            </span>
                        )}
                        <span className="fw-bold ms-2">{boq.boqName || 'Unnamed BOQ'}</span>
                    </div>
                    <div className="d-flex align-items-center">
                        {boq.level === 1 && <span className="fw-bold me-3" style={{ color: '#005197' }}>{`$ ${total.toFixed(2)}`}</span>}
                    </div>
                </div>
                {isExpanded && hasChildren && (
                    <div className="mt-2">
                        {hasTableChildren ? (
                            <div className="table-responsive boq-table" style={{ background: 'white', borderRadius: 9 }}>
                                <table className="table table-borderless">
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(0, 81, 151, 0.24)' }}>
                                            <th>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    style={{ borderColor: '#005197' }}
                                                    checked={boq.children.every(child => selectedNodes.has(child.boqCode))}
                                                    onChange={toggleAllSelection}
                                                />
                                            </th>
                                            <th className="boq-header">BOQ Name</th>
                                            <th className="boq-header">UOM</th>
                                            <th className="boq-header">Quantity</th>
                                            <th className="boq-header">Rate</th>
                                            <th className="boq-header">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {boq.children.length > 0 ? boq.children.map((child, index) => (
                                            <tr key={index} style={{ borderBottom: index === boq.children.length - 1 ? 'none' : '1px solid rgba(0, 81, 151, 0.24)' }}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        style={{ borderColor: '#005197' }}
                                                        checked={selectedNodes.has(child.boqCode)}
                                                        onChange={() => toggleSelection(child.boqCode)}
                                                    />
                                                </td>
                                                <td className="boq-data">{child.boqName || 'No Name'}</td>
                                                <td className="boq-data">{child.uom?.uomCode || 'Cum'}</td>
                                                <td className="boq-data">{child.quantity?.toFixed(3) || 0}</td>
                                                <td className="boq-data">{child.totalRate?.toFixed(2) || 0}</td>
                                                <td className="boq-data">{child.totalAmount?.toFixed(2) || 0}</td>
                                            </tr>
                                        )) : <tr><td colSpan="6">No data available</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            boq.children.map((child, index) => (
                                <BOQNode key={index} boq={child} level={level + 1} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

function BOQOverview({ projectId }) {
    const [totalAmount, setTotalAmount] = useState();
    const [boqTree, setBoqTree] = useState([]);
    const [allBOQ, setAllBOQ] = useState([]);
    const [project, setProject] = useState();
    const [uploadScreen, setUploadScreen] = useState(false);
    const [expanded, setExpanded] = useState(new Set());
    const [nonLeafCodes, setNonLeafCodes] = useState(new Set());
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const toggleExpanded = (code) => {
        setExpanded(prev => {
            const newSet = new Set(prev);
            if (newSet.has(code)) {
                newSet.delete(code);
            } else {
                newSet.add(code);
            }
            return newSet;
        });
    };

    const refreshBOQData = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBOQ/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setAllBOQ(res.data || []);
            } else {
                console.error('Failed to fetch BOQ data:', res.status);
                setAllBOQ([]);
            }
        }).catch(err => {
            console.error('Error fetching BOQ data:', err);
            setAllBOQ([]);
        });
    };

    const deleteBoqs = async (projectId, selectedCodes) => {
        console.log(selectedCodes);
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_BASE_URL}/project/deleteBOQ/${projectId}`,
                {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
                    data: selectedCodes
                }
            ).then(res => {
                if (res.status === 200)
                    toast.success("Selected BOQs deleted successfully");
            }).catch(err => {
                if (err?.response?.status === 409) {
                    toast.warn(err?.response?.data);
                } else {
                    toast.error(err?.response?.data);
                }
            });

            refreshBOQData();

            axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBoqTotalValue/${projectId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status === 200) {
                    setTotalAmount(res.data);
                } else {
                    console.error('Failed to fetch total value:', res.status);
                    setTotalAmount(0);
                }
            }).catch(err => {
                console.error('Error fetching total value:', err);
                setTotalAmount(0);
            });
        } catch (err) {
            console.error("Failed to delete BOQs", err);
            toast.error("Failed to delete BOQs");
        }
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

        await deleteBoqs(projectId, selectedCodes);
        setSelectedNodes(new Set());
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
    };

    const contextValue = {
        expanded,
        toggleExpanded,
        projectId,
        refreshBOQData,
        selectedNodes,
        setSelectedNodes
    };


    const BOQStats = [
        { label: 'Parent BOQ', value: boqTree.length, bgColor: '#EFF6FF', color: '#2563EB' },
        { label: 'Total BOQ', value: allBOQ.length, bgColor: '#F0FDF4', color: '#2BA95A' },
        { label: 'Total Value', value: `$ ${(totalAmount / 1000000)?.toFixed(2)} M` || 'N/A', bgColor: '#FFF7ED', color: '#EA580C' },
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
    }, [projectId]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getAllBOQ/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setAllBOQ(res.data || []);
            } else {
                console.error('Failed to fetch BOQ data:', res.status);
                setAllBOQ([]);
            }
        }).catch(err => {
            console.error('Error fetching BOQ data:', err);
            setAllBOQ([]);
        });
    }, [projectId]);

    useEffect(() => {
        if (Array.isArray(allBOQ) && allBOQ.length > 0) {
            const codeToBOQ = new Map();
            allBOQ.forEach(b => {
                if (b && b.boqCode) {
                    codeToBOQ.set(b.boqCode, { ...b, children: [] });
                }
            });

            allBOQ.forEach(b => {
                if (b && b.parentBOQ && b.parentBOQ.boqCode) {
                    const parent = codeToBOQ.get(b.parentBOQ.boqCode);
                    if (parent) {
                        parent.children.push(codeToBOQ.get(b.boqCode));
                    }
                }
            });

            const roots = allBOQ.filter(b => !b.parentBOQ && b.boqCode).map(b => codeToBOQ.get(b.boqCode));

            const calculateTotals = (node) => {
                if (!node) return 0;
                if (!node.children || node.children.length === 0) {
                    node.calculatedTotal = node.totalAmount || 0;
                } else {
                    node.calculatedTotal = node.children.reduce((sum, child) => sum + calculateTotals(child), 0);
                }
                return node.calculatedTotal;
            };

            roots.forEach(calculateTotals);

            const collectNonLeaves = (node, set) => {
                if (node && node.children && node.children.length > 0) {
                    set.add(node.boqCode);
                    node.children.forEach(child => collectNonLeaves(child, set));
                }
            };

            const nonLeaves = new Set();
            roots.forEach(root => collectNonLeaves(root, nonLeaves));
            setNonLeafCodes(nonLeaves);

            setBoqTree(roots.filter(Boolean));
        } else {
            setBoqTree([]);
        }
    }, [allBOQ]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBoqTotalValue/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setTotalAmount(res.data);
            } else {
                console.error('Failed to fetch total value:', res.status);
                setTotalAmount(0);
            }
        }).catch(err => {
            console.error('Error fetching total value:', err);
            setTotalAmount(0);
        });
    }, [projectId]);

    const toggleAll = () => {
        if (isAllExpanded) {
            setExpanded(new Set());
        } else {
            setExpanded(new Set(nonLeafCodes));
        }
        setIsAllExpanded(!isAllExpanded);
    };

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
                toast.warn(response.data);
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
        } catch (err) {
            console.log(err);
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

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `BOQ_${project?.projectName || 'project'}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            toast.error(err.message);
            console.error(err.message);
        }
    };

    return (
        uploadScreen ? (
            <BOQUpload projectId={projectId} projectName={project?.projectName + '(' + project?.projectCode + ')'} setUploadScreen={setUploadScreen} />
        ) : (
            <>
                <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-1 mt-1 mb-3">
                    <div className="ms-3">
                        <ArrowLeft size={20} onClick={() => window.history.back()} />
                        <span className='ms-2'>BOQ Definition</span>
                    </div>
                    <div className="me-3">
                        <button className="btn export-button me-2" onMouseEnter={() => setShowPopover(!showPopover)}>
                            <span className="me-2"><Export /></span>Export File
                        </button>
                        <button className="btn import-button ms-2" onClick={() => setUploadScreen(true)}>
                            <span className="me-2"><Import /></span>Import File
                        </button>
                        {showPopover && (
                            <div className="popover bs-popover-bottom show position-absolute mt-1" onMouseLeave={() => setShowPopover(!showPopover)}>
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
                        <div className="me-1 d-flex align-items-center">
                            <button className="btn" style={{ cursor: 'pointer', color: '#005197' }} onClick={toggleAll}>
                                {isAllExpanded ? (
                                    <>
                                        <CollapseIcon /><span>Collapse All</span>
                                    </>
                                ) : (
                                    <>
                                        <ExpandIcon /><span>Expand All</span>
                                    </>
                                )}
                            </button>
                            <DeleteIcon
                                style={{ cursor: 'pointer', marginLeft: '15px' }}
                                onClick={handleDeleteClick}
                                title="Delete selected items"
                            />
                        </div>
                    </div>
                    <BOQContext.Provider value={contextValue}>
                        {boqTree.length > 0 ? (
                            boqTree.map((boq, index) => (
                                <BOQNode key={index} boq={boq} />
                            ))
                        ) : (
                            <div>No BOQ data available</div>
                        )}
                    </BOQContext.Provider>
                </div>

                <ConfirmationDialog
                    isOpen={showConfirmDialog}
                    onClose={cancelDelete}
                    onConfirm={confirmDelete}
                    message={`Are you sure you want to delete ${selectedNodes.size} selected BOQ item(s)?`}
                />
            </>
        )
    );
}

export default BOQOverview;