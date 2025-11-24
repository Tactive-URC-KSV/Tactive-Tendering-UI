import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BoxesIcon, ChevronDown, ChevronRight, Info, Paperclip, Plus, User2, X } from 'lucide-react'; 
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt } from 'react-icons/fa';
import Select from "react-select";
import { useScope } from "../Context/ScopeContext"; 

function TFProcess({ projectId }) {
    const datePickerRef = useRef();
    const [project, setProject] = useState('');
    const [currentTab, setCurrentTab] = useState('boq');
    const [tab, setTab] = useState('general');
    const [selectedBoq, setSelectedBoq] = useState(new Set());
    const [boqForRemoval, setBoqForRemoval] = useState(new Set()); 
    const [parentBoq, setParentBoq] = useState([]);
    const [parentTree, setParentTree] = useState([]);
    const [expandedParentIds, setExpandedParentIds] = useState(new Set());
    const [userData, setUserData] = useState();
    const scopes = useScope() || []; 
    const scopeOptions = scopes.map(s => ({ value: s.id, label: s.scope }));
    const [selectedScopes, setSelectedScopes] = useState([]);

    const generateTenderNumber = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 999999) + 1;
        const padded = String(randomNum).padStart(6, '0');
        return `TF-${year}-${padded}`;
    };

    const getCurrentDate = () => new Date().toISOString().split("T")[0];

    const [tenderDetail, setTenderDetail] = useState({
        tenderFloatingNo: generateTenderNumber(),
        tenderFloatingDate: getCurrentDate(),
        projectId: projectId,
        offerSubmissionMode: '',
        offerSubmissionDate: '',
        bidOpeningDate: '',
        contactPerson: userData?.name || 'admin',
        contactEmail: userData?.email || 'admin@gmail.com',
        contactMobile: userData?.phoneNumber || '9876543210',
        scopeOfPackage: '',
        scopeOfWork: '',
        boqIds: Array.from(selectedBoq),
        contractorIds: ''
    });

    const handleUnauthorized = () => console.error("Unauthorized access, attempting to redirect to login...");

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.status === 200) {
                setProject(res.data);
                fetchParentBoqData();
                getLoggedInUser();
            }
        }).catch(err => { if (err.response.status === 401) handleUnauthorized(); });
    }, [projectId]);

    const getLoggedInUser = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/loggedin-user`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        }).then(res => {
            if (res.status === 200) setUserData(res.data);
        }).catch(err => { if (err.response.status === 401) handleUnauthorized(); });
    }

    const fetchParentBoqData = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${projectId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
            });
            if (res.status === 200) {
                setParentBoq(res.data || []);
                handleParentBoqTree(res.data || []);
            } else setParentBoq([]);
        } catch (err) { setParentBoq([]); }
    };

    const handleParentBoqTree = (data = parentBoq) => {
        if (Array.isArray(data) && data.length > 0) {
            const parentTreeMap = new Map();
            data.forEach(parent => {
                if (!parentTreeMap.has(parent.id)) {
                    parentTreeMap.set(parent.id, { ...parent, children: (parent.lastLevel === false) ? null : [] });
                }
            });
            setParentTree(Array.from(parentTreeMap.values()));
        }
    }

    const handleToggle = (parentId) => {
        setExpandedParentIds(prevSet => {
            const newSet = new Set(prevSet);
            const isExpanded = newSet.has(parentId);
            if (isExpanded) newSet.delete(parentId);
            else { newSet.add(parentId); fetchChildrenBoq(parentId); }
            return newSet;
        });
    };

    const fetchChildrenBoq = async (parentId) => {
        const findNode = (tree) => {
            for (const node of tree) {
                if (node.id === parentId) return node;
                if (Array.isArray(node.children)) {
                    const found = findNode(node.children);
                    if (found) return found;
                }
            }
            return null;
        };

        const parentNode = findNode(parentTree);
        if (parentNode && parentNode.children !== null) return;
        setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: 'pending' }));

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/project/getChildBoq/${projectId}/${parentId}`,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
            );

            if (response.status === 200) {
                const childrenData = (response.data || []).map(child => ({ ...child, children: (child.lastLevel === false) ? null : [] }));
                setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: childrenData }));
            } else setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
        } catch (err) { setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] })); }
    };

    const updateNodeInTree = (tree, nodeId, newProps) => {
        return tree.map(node => {
            if (node.id === nodeId) return { ...node, ...newProps };
            if (Array.isArray(node.children)) return { ...node, children: updateNodeInTree(node.children, nodeId, newProps) };
            return node;
        });
    };

    const toggleSelection = (boqId) => {
        setSelectedBoq(prevSet => {
            const newSet = new Set(prevSet);
            if (newSet.has(boqId)) newSet.delete(boqId);
            else newSet.add(boqId);
            return newSet;
        });
    };

    const toggleAllChildrenSelection = (children, selectAll) => {
        if (!Array.isArray(children)) return;
        setSelectedBoq(prevSet => {
            const newSet = new Set(prevSet);
            children.forEach(child => {
                if (child.lastLevel === true) selectAll ? newSet.add(child.id) : newSet.delete(child.id);
            });
            return newSet;
        });
    };

    const getSelectedLeafBoqs = (tree) => {
        let result = [];
        if (!selectedBoq || selectedBoq.size === 0) return [];
        const traverse = (nodes) => {
            nodes.forEach(boq => {
                if (boq.lastLevel === true && selectedBoq.has(boq.id)) result.push(boq);
                else if (Array.isArray(boq.children)) traverse(boq.children);
            });
        };
        traverse(tree);
        return result;
    };

    const toggleRemovalSelection = (boqId) => {
        setBoqForRemoval(prevSet => {
            const newSet = new Set(prevSet);
            newSet.has(boqId) ? newSet.delete(boqId) : newSet.add(boqId);
            return newSet;
        });
    };

    const handleRemoveSelectedBoqs = () => {
        setSelectedBoq(prevSet => {
            const newSet = new Set(prevSet);
            boqForRemoval.forEach(id => newSet.delete(id));
            return newSet;
        });
        setBoqForRemoval(new Set()); 
    };

    useEffect(() => { setTenderDetail(prev => ({ ...prev, scopeOfPackage: Array.isArray(selectedScopes) ? selectedScopes : [] })); }, [selectedScopes]);
    useEffect(() => { if (Array.isArray(tenderDetail?.scopeOfPackage) && tenderDetail.scopeOfPackage.length > 0) setSelectedScopes(tenderDetail.scopeOfPackage); }, [tenderDetail?.scopeOfPackage]);

    const BOQNode = ({ boq, level = 0 }) => {
        const canExpand = boq.level === 1 || boq.level === 2;
        const isExpanded = expandedParentIds.has(boq.id);
        const childrenStatus = boq.children;
        const isLoading = isExpanded && childrenStatus === 'pending';
        const hasFetchedChildren = Array.isArray(childrenStatus) && childrenStatus.length > 0;
        const hasNoChildren = Array.isArray(childrenStatus) && childrenStatus.length === 0;

        let leafChildren = [], nonLeafChildren = [];
        if (hasFetchedChildren) {
            leafChildren = childrenStatus.filter(child => child.lastLevel === true);
            nonLeafChildren = childrenStatus.filter(child => child.lastLevel === false);
        }
        const allLeafChildrenIds = leafChildren.map(child => child.id);
        const isAllLeafChildrenSelected = allLeafChildrenIds.length > 0 && allLeafChildrenIds.every(id => selectedBoq.has(id));
        const BoqIcon = isExpanded ? ChevronDown : ChevronRight;
        const boqNameDisplay = boq.boqName && boq.boqName.length > 80 ? boq.boqName.substring(0, 80) + '...' : boq.boqName;
        const indentation = level * 10;

        if (boq.lastLevel === true) {
            return (
                <tr className="boq-leaf-row bg-white" style={{ borderBottom: '1px solid #eee' }}>
                    <td className="px-2" style={{ paddingLeft: `${indentation + 8}px` }}>
                        <input type="checkbox" className="form-check-input" style={{ borderColor: '#005197' }} checked={selectedBoq.has(boq.id)} onChange={() => toggleSelection(boq.id)} />
                    </td>
                    <td className="px-2">{boq.boqCode}</td>
                    <td className="px-2" title={boq.boqName}>{boqNameDisplay}</td>
                    <td className="px-2">{boq.uom?.uomCode || '-'}</td>
                    <td className="px-2">{boq.quantity?.toFixed(3) || 0}</td>
                </tr>
            );
        }

        return (
            <div className="boq-non-leaf-container rounded-3 ms-3 me-3" style={{ marginLeft: `${indentation}px` }}>
                <div className="parent-boq text-start p-3 rounded-2 d-flex flex-column mb-4"
                    style={{ cursor: canExpand ? 'pointer' : 'default', backgroundColor: `${boq.level === 2 && 'white'}`, borderLeft: `${isExpanded ? '0.5px solid #0051973D' : 'none'}` }}>
                    <div className="d-flex" onClick={(e) => { if (boq.level > 0) e.stopPropagation(); if (canExpand) handleToggle(boq.id); }}>
                        {canExpand ? <BoqIcon size={18} /> : <span style={{ width: 20, marginRight: 4 }}></span>}
                        <span className="ms-2 fw-bold">{boq.boqCode}</span>
                        <span className="ms-3 text-dark" title={boq.boqName}>{boqNameDisplay}</span>
                    </div>

                    {isExpanded && canExpand && (
                        <div className="children-section mt-3">
                            {isLoading && <div className="text-muted p-2">Loading items...</div>}
                            {hasFetchedChildren && (
                                <div className="children-content">
                                    {leafChildren.length > 0 && (
                                        <div className="table-responsive">
                                            <table className="table table-borderless">
                                                <thead>
                                                    <tr style={{ borderBottom: '0.5px solid #0051973D', color: '#005197' }}>
                                                        <th className="px-2" style={{ paddingLeft: `${indentation + 18}px` }}>
                                                            <input type="checkbox" className="form-check-input" style={{ borderColor: '#005197' }} checked={isAllLeafChildrenSelected} onChange={(e) => toggleAllChildrenSelection(leafChildren, e.target.checked)} />
                                                        </th>
                                                        <th className="px-2">BOQ Code</th>
                                                        <th className="px-2">BOQ Name</th>
                                                        <th className="px-2">UOM</th>
                                                        <th className="px-2">Quantity</th>
                                                    </tr>
                                                </thead>
                                                <tbody>{leafChildren.map(child => <BOQNode key={child.id} boq={child} level={level + 1} />)}</tbody>
                                            </table>
                                        </div>
                                    )}
                                    {nonLeafChildren.length > 0 && (<div className="p-0">{nonLeafChildren.map(child => <BOQNode key={child.id} boq={child} level={level + 1} />)}</div>)}
                                </div>
                            )}
                            {hasNoChildren && (<div className="no-items-message text-muted p-2 text-center mt-2">No items found.</div>)}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // … Continue with boqSelection, generalDetails, packageDetails, contractorDetails, attachmentDetails, tenderDetails, reviewTender, renderContent as in your original code

    return (
        <div className='container-fluid min-vh-100'>
            {/* Header */}
            {/* Progress bar */}
            {/* Content */}
            {/* Footer buttons */}
        </div>
    );
}

export default TFProcess;
