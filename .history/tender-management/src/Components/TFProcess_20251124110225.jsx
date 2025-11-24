import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BoxesIcon, ChevronDown, ChevronRight, IndianRupee, Info, Paperclip, Plus, User2, X } from 'lucide-react'; 
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt,FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
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
        submissionLastDate:'',
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
                        <input type="text" className="form-input w-100" 
                            value={tenderDetail.tenderFloatingNo}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Tender Floating Date </label>
                        <input type="text" className="form-input w-100" 
                            value={tenderDetail.tenderFloatingDate}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Project Name </label>
                        <input type="text" className="form-input w-100" 
                            value={project.projectName}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform-select text-start d-block">Offer Submission Mode</label>
                        <Select
                            options={[
                                { value: 'online', label: 'Online' },
                                { value: 'offline', label: 'Offline' }
                            ]}
                            placeholder="Select Mode"
                            className="w-100"
                            classNamePrefix="select"
                            value={
                                tenderDetail.offerSubmissionMode
                                    ? [{ value: tenderDetail.offerSubmissionMode, label: tenderDetail.offerSubmissionMode.charAt(0).toUpperCase() + tenderDetail.offerSubmissionMode.slice(1) }]
                                    : null
                            }
                            onChange={(selected) =>
                                setTenderDetail({
                                    ...tenderDetail,
                                    offerSubmissionMode: selected ? selected.value : ''
                                })
                            }
                            isClearable
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Bid Opening Date</label>
                        <Flatpickr
                            id="bidOpeningDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.bidOpeningDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, bidOpeningDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon' onClick={() => openCalendar('bidOpeningDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Submission Last Date</label>
                        <Flatpickr
                            id="submissionLastDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.submissionLastDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, submissionLastDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon' onClick={() => openCalendar('submissionLastDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Contact Person</label>
                        <input type="text" className="form-input w-100" 
                            value={tenderDetail.contactPerson}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Email</label>
                        <input type="text" className="form-input w-100" 
                            value={tenderDetail.contactEmail}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Number</label>
                        <input type="text" className="form-input w-100"
                            value={tenderDetail.contactMobile}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform-select text-start d-block">Scope of Package</label>

                        <Select
                            options={scopeOptions}
                            isMulti
                            placeholder="Select Scope of Package"
                            className="w-100"
                            classNamePrefix="select"
                            value={scopeOptions.filter(opt => selectedScopes.includes(opt.value))}
                            onChange={(selected) => setSelectedScopes(selected ? selected.map(s => s.value) : [])}
                        />
                    </div>

                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Scope of Work</label>
                        <input 
    type="text"
    className="form-input w-100"
    placeholder="Enter Scope of Work"
    value={tenderDetail.scopeOfWork}
    onChange={(e) =>
        setTenderDetail({ ...tenderDetail, scopeOfWork: e.target.value })
    }
/>

                    </div>
                </div>
            </div>
        );
    }

    const packageDetails = (selectedBoqArray) => {
        const boqNameDisplay = (boqName) => {
            return boqName && boqName.length > 20
                ? boqName.substring(0, 20) + '...'
                : boqName;
        }
        
        const isAllSelectedForRemoval = selectedBoqArray.length > 0 && selectedBoqArray.every(boq => boqForRemoval.has(boq.id));

        const toggleAllRemovalSelection = (checked) => {
            if (checked) {
                setBoqForRemoval(new Set(selectedBoqArray.map(boq => boq.id)));
            } else {
                setBoqForRemoval(new Set());
            }
        };

        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                        <div className="d-flex align-items-center">
                            <BoxesIcon size={20} color="#2BA95A" />
                            <span className="ms-2 fw-bold">Package Details</span>
                        </div>
                        <div className="text-start ms-1 mt-2 mb-3">
                            <span className="text-muted" style={{ fontSize: '14px' }}>
                                Auto-filled based on activity selection
                            </span>
                        </div>
                    </div>
                    <div className="d-flex gap-5">
                       <button
    className="btn btn-sm"
    style={{ border: '1px solid #dc3545', color: '#dc3545' }}
    onClick={handleRemoveSelectedBoqs}
    disabled={boqForRemoval.size === 0}  
>
    <X size={18} /> <span className="fw-medium ms-1">Remove</span>
</button>

                        <button
                            className="btn btn-sm"
                            style={{ backgroundColor: '#2BA95A', color: 'white' }}
                            onClick={() => setCurrentTab('boq')}
                        >
                            <Plus size={18} /> <span className="fw-medium ms-1">Add</span>
                        </button>
                    </div>
                </div>

                <div className="table table-responsive mt-4">
                    <table className="table table-borderless">
                        <thead style={{ color: '#005197' }}>
                            <tr>
                                <th style={{ width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        style={{ borderColor: '#005197' }}
                                        checked={isAllSelectedForRemoval}
                                        onChange={(e) => toggleAllRemovalSelection(e.target.checked)}
                                    />
                                </th>
                                <th>BOQ Code</th>
                                <th>BOQ Name</th>
                                <th>UOM</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedBoqArray.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">No BOQ items selected for this package.</td>
                                </tr>
                            ) : (
                                selectedBoqArray.map((boq) => (
                                    <tr key={boq.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                style={{ borderColor: '#005197' }}
                                                checked={boqForRemoval.has(boq.id)}
                                                onChange={() => toggleRemovalSelection(boq.id)}
                                            />
                                        </td>
                                        <td>{boq.boqCode}</td>
                                        <td title={boq.boqName}>{boqNameDisplay(boq.boqName) || '-'}</td>
                                        <td>{boq.uom?.uomCode || '-'}</td>
                                        <td>{boq.quantity?.toFixed(3) || 0}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const contractorDetails = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <User2 size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">Contractor Details</span>
                </div>
            </div>
        );
    }
    
const [attachments, setAttachments] = useState({
    technical: { files: [], notes: '' },
    drawings: { files: [], notes: '' },
    commercial: { files: [], notes: '' },
    others: { files: [], notes: '' },
});
const handleFileUpload = (e, key) => {
    const uploadedFiles = Array.from(e.target.files);

    setAttachments(prev => ({
        ...prev,
        [key]: {
            ...prev[key],
            files: [...prev[key].files, ...uploadedFiles]
        }
    }));
};

const handleNoteChange = (key, value) => {
    setAttachments(prev => ({
        ...prev,
        [key]: {
            ...prev[key],
            notes: value
        }
    }));
};

    const attachmentDetails = () => {
    const attachmentTypes = [
        { key: "technical", title: "Technical Specification", noteLabel: "Additional notes for technical specification" },
        { key: "drawings", title: "Drawings", noteLabel: "Additional notes for drawings" },
        { key: "commercial", title: "Commercial Conditions", noteLabel: "Additional notes for commercial conditions" },
        { key: "others", title: "Others", noteLabel: "Additional notes for others" }
    ];

    const handleRemoveFile = (fileKey, index) => {
        const updatedFiles = attachments[fileKey].files.filter((_, idx) => idx !== index);
        setAttachments(prevState => ({
            ...prevState,
            [fileKey]: { ...prevState[fileKey], files: updatedFiles }
        }));
    };

    return (
        <div className="p-4">
            <div className="text-start ms-1 mt-3 d-flex align-items-center">
                <Paperclip size={20} color="#005197" />
                <span className="ms-2 fw-bold" style={{ color: "#005197" }}>Attachments</span>
            </div>

            <p className="text-muted ms-1 mt-2" style={{ fontSize: "14px", textAlign: "left" }}>
                Upload required documents
            </p>

            <div className="outer-container" style={{
                borderRadius: "10px", 
                padding: "15px", 
            }}>
                <div className="row mt-4">
                    {attachmentTypes.map((item) => (
                        <div className="col-md-6 mb-4" key={item.key}>
                            <div className="attachment-container p-4" style={{
                                border: "2px solid #B0C4DE",  
                                borderRadius: "10px", 
                                backgroundColor: "transparent"  
                            }}>
                                <label
                                    className="w-100 d-flex flex-column justify-content-center align-items-center"
                                    style={{
                                        border: "2px dashed #B0C4DE",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        backgroundColor: "transparent", 
                                    }}
                                    onMouseEnter={(e) => e.target.style.borderColor = '#005197'}
                                    onMouseLeave={(e) => e.target.style.borderColor = '#B0C4DE'}
                                >
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        onChange={(e) => handleFileUpload(e, item.key)}
                                    />

                                    <div className="d-flex justify-content-center mb-3">
                                        <div
                                            className="rounded-circle d-flex justify-content-center align-items-center"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                            }}
                                        >
                                            <FaCloudUploadAlt size={38} color="#005197" />
                                        </div>
                                    </div>

                                    <h6 className="fw-bold" style={{ color: "#005197" }}>{item.title}</h6>
                                    <p className="text-muted" style={{ fontSize: "13px", color: "#005197CC" }}>
                                        Click to upload or drag and drop
                                    </p>
                                </label>

                                {attachments[item.key].files.length > 0 && (
                                    <ul className="mt-2" style={{ fontSize: "13px" }}>
                                        {attachments[item.key].files.map((file, index) => (
                                            <li key={index} className="d-flex align-items-center">
                                                📄 {file.name}
                                                <FaTimes
                                                    size={16}
                                                    color="#FF4F4F" 
                                                    style={{ cursor: "pointer", marginLeft: "8px" }}
                                                    onClick={() => handleRemoveFile(item.key, index)} 
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <textarea
                                    className="form-control mt-3"
                                    placeholder={item.noteLabel}
                                    rows="2"
                                    value={attachments[item.key].notes}
                                    onChange={(e) => handleNoteChange(item.key, e.target.value)}
                                    style={{
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        border: "1px solid #B0C4DE",
                                        padding: "10px",
                                        color: "#333",
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

    const tenderDetails = () => {
        const selectedBoqArray = getSelectedLeafBoqs(parentTree);

        const renderTab = () => {
            switch (tab) {
                case 'general':
                    return generalDetails();
                case 'package':
                    return packageDetails(selectedBoqArray);
                case 'contractor':
                    return contractorDetails();
                case 'attachment':
                    return attachmentDetails();
                default:
                    return null;
            }
        }

        const handleNext = () => {
            if (tab === 'general') {
                setTab('package');
            }
            else if (tab === 'package') {
                setTab('contractor');
            }
            else if (tab === 'contractor') {
                setTab('attachment');
            }
        }

        const handlePrevious = () => {
            if (tab === 'contractor') {
                setTab('package');
            }
            else if (tab === 'attachment') {
                setTab('contractor');
            }
            else if (tab === 'package') {
                setTab('general');
            }
        }

        return (
            <div className="bg-white ms-3 me-3 rounded-3 p-3 mt-5" style={{ border: '1px solid #0051973D' }}>

                <div className="d-flex justify-content-between align-items-center ms-2 me-2 fw-bold" style={{ borderBottom: '1px solid #0051973D' }}>
                    <div className="h-100 p-2" onClick={() => setTab('general')} style={{ cursor: 'pointer', color: `${tab === 'general' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'general' ? '1px solid #005197' : 'none'}` }}>
                        <Info size={18} /> <span className="ms-1">General Details</span>
                    </div>
                    <div className="h-100 p-2" onClick={() => setTab('package')} style={{ cursor: 'pointer', color: `${tab === 'package' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'package' ? '1px solid #005197' : 'none'}` }}>
                        <BoxesIcon size={18} /> <span className="ms-1">Package Details</span>
                    </div>
                    <div className="h-100 p-2" onClick={() => setTab('contractor')} style={{ cursor: 'pointer', color: `${tab === 'contractor' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'contractor' ? '1px solid #005197' : 'none'}` }}>
                        <User2 size={18} /> <span className="ms-1">Contractor Details</span>
                    </div>
                    <div className="h-100 p-2" onClick={() => setTab('attachment')} style={{ cursor: 'pointer', color: `${tab === 'attachment' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'attachment' ? '1px solid #005197' : 'none'}` }}>
                        <Paperclip size={18} /> <span className="ms-1">Attachments</span>
                    </div>
                </div>
                {renderTab()}
                <div className="d-flex justify-content-between align-items-center ms-3 me-3 mt-4 mb-4">
                    <button className="btn cancel-button" disabled={tab === 'general'} onClick={handlePrevious}>Previous</button>
                    <button className="btn action-button" disabled={tab === 'attachment'} onClick={handleNext}><ArrowRight size={18} /><span className="fw-bold ms-2">Next</span></button>
                </div>
            </div>
        );
    }
const AttachmentRow = ({ title, files, notes }) => (
    <div className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid #eee' }}>
        <div className="text-start">
            <span className="fw-medium" style={{ color: '#333' }}>{title}</span>
            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>
                {files.length > 0 ? `${files.length} file(s) attached.` : 'No files attached.'}
                {notes && ` (Notes: ${notes})`}
            </p>
        </div>
    </div>
);

  const reviewTender = () => {
        const boqArray = getSelectedLeafBoqs(parentTree);
        const contractorsList = []; 
        
        const getDisplayMode = (mode) => 
            mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '-';

        const getAttachmentTitle = (key) => {
            if (key === 'others') return 'Others';
            if (key === 'technical') return 'Technical Specifications';
            if (key === 'drawings') return 'Drawings';
            if (key === 'commercial') return 'Commercial Conditions';
            return key;
        };

        const boqNameDisplay = (boqName) => {
            return boqName && boqName.length > 20
                ? boqName.substring(0, 20) + '...'
                : boqName;
        }

        return (
            
                
                <div className="pt-4">
                    <div className="text-start ms-1 mt-4 mb-3">
                        <Info size={20} color="#2BA95A" />
                        <span className="ms-2 fw-bold" style={{ color: '#2BA95A' }}>General Details</span>
                    </div>
                    <div className="row g-4 ms-1">
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Project Name</span>
        <span className="fw-medium">{project?.projectName || 'N/A'}</span>
    </div>
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Offer Submission Mode</span>
        <span className="fw-medium">{getDisplayMode(tenderDetail.offerSubmissionMode)}</span>
    </div>
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Submission Last Date</span>
        <span 
            className="fw-medium" 
            style={{ color: '#dc3545' }} 
        >
            {tenderDetail.submissionLastDate
                ? new Date(tenderDetail.submissionLastDate).toLocaleDateString()
                : 'N/A'} 
        </span>
    </div>
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Bid Opening</span>
        <span className="fw-medium">{tenderDetail.bidOpeningDate 
            ? new Date(tenderDetail.bidOpeningDate).toLocaleDateString(): 'N/A'} </span>
    </div>
    
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Contact Person</span>
        <span className="fw-medium">{tenderDetail.contactPerson || 'N/A'}</span>
    </div>
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Contact Number</span>
        <span className="fw-medium">{tenderDetail.contactMobile || 'N/A'}</span>
    </div>
    <div className="col-md-4 text-start">
        <span className="text-muted d-block">Contact Email ID</span>
        <span className="fw-medium">{tenderDetail.contactEmail || 'N/A'}</span>
    </div>
    <div className="col-md-12 text-start">
        <span className="text-muted d-block">Scope of Work</span>
        <span className="fw-medium">{tenderDetail.scopeOfWork || 'N/A'}</span>
    </div>
    
    <div className="col-md-12 text-start">
        <span className="text-muted d-block">Scope of Packages</span>
        <div className="d-flex flex-wrap gap-2 mt-1">
           {Array.isArray(tenderDetail.scopeOfPackage) && tenderDetail.scopeOfPackage.length > 0 ? (
                tenderDetail.scopeOfPackage.map((scopeId, index) => {
                    const scopeObj = scopeOptions.find(opt => opt.value === scopeId);
                    return (
                        <span key={index} className="badge p-2"
                            style={{ backgroundColor: '#E0F0E0', color: '#2BA95A', fontSize: '12px' }}>
                            {scopeObj ? scopeObj.label : scopeId}
                        </span>
                    );
                })
            ) : (
                <span className="text-muted" style={{ fontSize: '14px' }}>No scopes selected</span>
            )}
        </div>
    </div>
</div>
                    <div className="text-start ms-1 mt-5 mb-3">
                        <BoxesIcon size={20} color="#2BA95A" />
                        <span className="ms-2 fw-bold" style={{ color: '#2BA95A' }}>Package Details ({boqArray.length})</span>
                    </div>
                    <div className="table-responsive ms-1 me-1">
                        <table className="table table-borderless table-striped">
                            <thead style={{ color: '#005197', borderBottom: '2px solid #005197' }}>
                                <tr>
                                    <th className="fw-bold">BOQ Code</th>
                                    <th className="fw-bold">BOQ Name</th>
                                    <th className="fw-bold">Unit</th>
                                    <th className="fw-bold text-end">Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boqArray.length > 0 ? (
                                    boqArray.map((boq) => (
                                        <tr key={boq.id}>
                                            <td>{boq.boqCode}</td>
                                            <td title={boq.boqName}>{boqNameDisplay(boq.boqName)}</td>
                                            <td>{boq.uom?.uomCode || '-'}</td>
                                            <td className="text-end">{boq.quantity?.toFixed(4) || 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="text-center text-muted">No BOQ items selected.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-start ms-1 mt-5 mb-3">
                        <User2 size={20} color="#dc3545" />
                        <span className="ms-2 fw-bold" style={{ color: '#dc3545' }}>Contractor Details</span>
                        <p className="text-muted mt-1" style={{ fontSize: '14px' }}>{contractorsList.length} contractors selected for tender invitation</p>
                    </div>
                    <div className="d-flex flex-wrap gap-3 ms-1">
                        {contractorsList.map((contractor, index) => (
                            <div key={index} className="p-3" style={{ border: '1px solid #ccc', borderRadius: '8px', minWidth: '300px' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <span className="fw-bold" style={{ color: '#333' }}>{contractor.name}</span>
                                    <span style={{ color: '#dc3545', cursor: 'pointer' }}>
                                        <X size={16} />
                                    </span>
                                </div>
                                <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{contractor.contact}</p>
                            </div>
                        ))}
                    </div>
                    <div className="text-start ms-1 mt-5 mb-3">
                        <Paperclip size={20} color="#005197" />
                        <span className="ms-2 fw-bold" style={{ color: '#005197' }}>Attachments</span>
                    </div>
                   
<div className="ms-1 me-1 p-3" style={{ border: '1px solid #eee', borderRadius: '8px' }}>
    {Object.keys(attachments).map((key) => (
        <AttachmentRow 
            key={key}
            title={getAttachmentTitle(key)} 
            files={attachments[key].files || []}
            notes={attachments[key].notes || ''} 
        />
    ))}
</div>
                    <div className="p-3 mt-5 mb-5 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#F0F8FF', border: '1px solid #B0C4DE', borderRadius: '8px' }}>
                        <div className="d-flex gap-5 fw-bold" style={{ color: '#005197' }}>
                            <div>Total Packages: <span style={{ color: '#333' }}>{boqArray.length > 0 ? 1 : 0}</span></div> 
                            <div>Selected Contractors: <span style={{ color: '#333' }}>{contractorsList.length}</span></div>
                            <div>Attachments: <span style={{ color: '#333' }}>{Object.keys(attachments).filter(key => attachments[key].files?.length > 0 || attachments[key].notes).length}</span></div>
                            <div>Submission Deadline: <span style={{ color: '#dc3545' }}>{tenderDetail.offerSubmissionDate || 'Not Set'}</span></div> 
                        </div>
                        <button 
                            className="btn fw-bold" 
                            style={{ backgroundColor: '#2BA95A', color: 'white', padding: '10px 20px' }}
                        >
                            Float Tender
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (currentTab) {
            case 'boq':
                return boqSelection();
            case 'tender':
                return tenderDetails();
            case 'review':
                return reviewTender();
            default:
                return null;
        }
    }

    const handleNextTabChange = () => {
        if (currentTab === 'boq') {
            setCurrentTab('tender');
        } else if (currentTab === 'tender') {
            setCurrentTab('review');
        }
    }

    const handlePreviousTabChange = () => {
        if (currentTab === 'tender') {
            setCurrentTab('boq');
        } else if (currentTab === 'review') {
            setCurrentTab('tender');
        }
    }

    return (
        <div className='container-fluid min-vh-100'>
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
                <div className="ms-3">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className='ms-2'>Tender Floating</span>
                    <span className='ms-2'>-</span>
                    <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
                </div>
            </div>
            <div className="bg-white rounded-3 ms-3 me-3 p-3 mt-4 mb-3" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold ms-2 mb-2">Tender Floating Process</div>
                <div className="d-flex align-items-center justify-content-between mt-3 p-3">
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: '#005197', borderRadius: '30px' }}>1</span>
                        <span className="ms-2 fw-bold" style={{ color: '#005197' }}>Select BOQ's</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : ''}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : ''}`, borderRadius: '30px' }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : ''}` }}>Tender details</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : ''}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : ''}`, borderRadius: '30px' }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : ''}` }}>Review & Float</span>
                    </div>
                </div>
            </div>
            {renderContent()}
            <div className={`d-flex justify-content-${currentTab === 'boq' ? 'end' : 'between'} align-items-center mt-5 me-3 ms-3 mb-4`}>
                {currentTab !== 'boq' && <button className="btn cancel-button" onClick={handlePreviousTabChange}>Previous</button>}
                <button className="btn action-button" disabled={selectedBoq.size === 0} onClick={handleNextTabChange}><span className="fw-bold me-2">Confirm & Proceed</span><ArrowRight size={18} /></button>
            </div>
        </div>

    );
}
export default TFProcess;