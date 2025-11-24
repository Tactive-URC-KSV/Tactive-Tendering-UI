import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BoxesIcon, ChevronDown, ChevronRight, IndianRupee, Info, Paperclip, Plus, User2, X } from 'lucide-react'; 
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

    const generateTenderNumber = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 999999) + 1;
        const padded = String(randomNum).padStart(6, '0');
        return `TF-${year}-${padded}`;
    };

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; 
    }

    const [userData, setUserData] = useState();
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

    const handleUnauthorized = () => {
        console.error("Unauthorized access, attempting to redirect to login...");
    }

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/viewProjectInfo/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(res => {
            if (res.status === 200) {
                setProject(res.data);
                fetchParentBoqData();
                getLoggedInUser();
            }
        }).catch(err => {
            if (err.response.status === 401) {
                handleUnauthorized();
            }
        });
    }, [projectId]);

    const getLoggedInUser = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/loggedin-user`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setUserData(res.data);
            }
        }).catch(err => {
            if (err.response.status === 401) {
                handleUnauthorized();
            }
        })
    }

    const fetchParentBoqData = async () => {
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
            }
            console.error('Error fetching children BOQ data:', err);
            setParentTree(prevTree => updateNodeInTree(prevTree, parentId, { children: [] }));
        }
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

    const toggleSelection = (boqId) => {
        setSelectedBoq(prevSet => {
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

        setSelectedBoq(prevSet => {
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

    const getSelectedLeafBoqs = (tree) => {
        let result = [];
        if (!selectedBoq || selectedBoq.size === 0) return [];

        const traverse = (nodes) => {
            nodes.forEach(boq => {
                if (boq.lastLevel === true && selectedBoq.has(boq.id)) {
                    result.push(boq);
                } else if (Array.isArray(boq.children)) {
                    traverse(boq.children);
                }
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
    
    const scopes = useScope() || []; 
    const scopeOptions = scopes.map(s => ({ value: s.id, label: s.scope }));

    const [selectedScopes, setSelectedScopes] = useState([]);

    useEffect(() => {
        setTenderDetail(prev => ({ ...prev, scopeOfPackage: Array.isArray(selectedScopes) ? selectedScopes : [] }));
    }, [selectedScopes]);

    useEffect(() => {
        if (Array.isArray(tenderDetail?.scopeOfPackage) && tenderDetail.scopeOfPackage.length > 0) {
            setSelectedScopes(tenderDetail.scopeOfPackage);
        }
    }, [tenderDetail?.scopeOfPackage]);

    const BOQNode = ({ boq, level = 0 }) => {
        const canExpand = boq.level === 1 || boq.level === 2;
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
        const isAllLeafChildrenSelected = allLeafChildrenIds.length > 0 && allLeafChildrenIds.every(id => selectedBoq.has(id));
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
                            checked={selectedBoq.has(boq.id)}
                            onChange={() => toggleSelection(boq.id)}
                        />
                    </td>
                    <td className="px-2">{boq.boqCode}</td>
                    <td className="px-2" title={boq.boqName}>{boqNameDisplay}</td>
                    <td className="px-2">{boq.uom?.uomCode || '-'}</td>
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
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const boqSelection = () => {
        return (
            <div className="bg-white rounded-3 ms-3 me-3 p-3 mt-5" style={{ border: '1px solid #0051973D' }}>
                <div className="ms-2 mb-2 d-flex justify-content-between align-items-center">
                    <div className="text-start d-flex flex-column">
                        <span className="fw-bold mb-2">Select BOQ's for tender floating</span>
                        <span className="text-muted" style={{ fontSize: '14px' }}>Choose one or more BOQ’s to include in your tender package</span>
                    </div>
                    <div className="me-3 px-3 py-1 rounded-5 fw-medium" style={{ backgroundColor: '#DBEAFE', color: '#005197', fontSize: '14px' }}>
                        {parentTree.length} BOQ
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
        );

    }

    const generalDetails = () => {
        const openCalendar = (id) => {
            const input = document.querySelector(`#${id}`);
            if (input && input._flatpickr) {
                input._flatpickr.open();
            }
        };

        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-4">
                    <Info size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">General Details</span>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Tender Floating No </label>
                        <input type="text" className="form-control form-control-sm rounded-2 mt-2" value={tenderDetail?.tenderFloatingNo} />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Tender Floating Date</label>
                        <div className="position-relative mt-2">
                            <Flatpickr
                                id="tenderFloatingDate"
                                ref={datePickerRef}
                                value={tenderDetail?.tenderFloatingDate}
                                onChange={(date) => setTenderDetail(prev => ({ ...prev, tenderFloatingDate: date[0] }))}
                                options={{ dateFormat: "Y-m-d" }}
                                className="form-control form-control-sm rounded-2"
                            />
                            <FaCalendarAlt onClick={() => openCalendar("tenderFloatingDate")} className="position-absolute top-50 end-0 translate-middle-y me-2 text-muted" style={{ cursor: "pointer" }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderContent = () => {
        if (currentTab === 'boq') return boqSelection();
        if (currentTab === 'general') return generalDetails();
        return <div>Other content</div>;
    }

    return (
        <div className='container-fluid min-vh-100'>
            <div className='mb-4'>
                <h4 className='fw-bold'>Tender Floating Process</h4>
            </div>
            {renderContent()}
        </div>
    );
}

export default TFProcess;
