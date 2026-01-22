import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BoxesIcon, ChevronDown, ChevronRight, Folder, Info, Paperclip, Plus, User2, X, Download, Edit, Send, File as FileIcon, Building, Dot, Eye } from 'lucide-react';
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import Select from "react-select";
import { useScope } from "../Context/ScopeContext";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";

function TFProcess({ projectId: propProjectId }) {
    const navigate = useNavigate();
    const { projectId: paramProjectId, tenderId } = useParams();
    const projectId = propProjectId || paramProjectId;
    const datePickerRef = useRef();
    const [project, setProject] = useState('');
    const [currentTab, setCurrentTab] = useState('boq');
    const [tab, setTab] = useState('general');
    const [selectedBoq, setSelectedBoq] = useState(new Set());
    const [boqForRemoval, setBoqForRemoval] = useState(new Set());
    const [parentBoq, setParentBoq] = useState([]);
    const [parentTree, setParentTree] = useState([]);
    const [expandedParentIds, setExpandedParentIds] = useState(new Set());
    const [contractorInfo, setContractorInfo] = useState([]);
    const [contractorTypeOptions, setContractorTypeOptions] = useState([]);
    const [contractorGradeOptions, setContractorGradeOptions] = useState([]);
    const [offerSubmissionOptions, setOfferSubmissionOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const generateTenderNumber = () => {
        const year = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 999999) + 1;
        const padded = String(randomNum).padStart(6, '0');
        return `TF-${year}-${padded}`;
    };

    const CustomMultiValueContainer = () => null;
    const CustomDropdownIndicator = () => null;
    const CustomIndicatorSeparator = () => null;
    const CustomClearIndicator = () => null;

    const handleRemoveScope = (idToRemove) => {
        setSelectedScopes(prevScopes => prevScopes.filter(id => id !== idToRemove));
    };

    const getCurrentDate = () => {
        const today = new Date();
        const offset = today.getTimezoneOffset();
        const localDate = new Date(today.getTime() - (offset * 60 * 1000));
        return localDate.toISOString().split("T")[0];
    }

    const [tenderDetail, setTenderDetail] = useState({
        tenderFloatingNo: generateTenderNumber(),
        tenderFloatingDate: getCurrentDate(),
        tenderName: '',
        projectId: projectId,
        offerSubmissionMode: '',
        submissionLastDate: '',
        bidOpeningDate: '',
        contactPerson: '',
        contactEmail: '',
        contactMobile: '',
        scopeOfPackage: [],
        preBidMeeting: false,
        preBidMeetingDate: '',
        siteInvestigation: false,
        siteInvestigationDate: '',
        boqIds: Array.from(selectedBoq),
        contractorIds: []
    });

    const [attachments, setAttachments] = useState({
        technical: { files: [], notes: '' },
        drawings: { files: [], notes: '' },
        commercial: { files: [], notes: '' },
        others: { files: [], notes: '' },
    });

    const scopes = useScope() || [];
    const scopeOptions = scopes.map(s => ({ value: s.id, label: s.scope }));
    const [selectedScopes, setSelectedScopes] = useState([]);
    const [openNodes, setOpenNodes] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedContractor, setSelectedContractor] = useState([]);

    const booleanOptions = [
        { value: true, label: 'Yes' },
        { value: false, label: 'No' }
    ];

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
                if (!tenderId) {
                    getLoggedInUser();
                }
                fetchContractorDetails();
                fetchFilterOptions();
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            }
        });
    }, [projectId]);

    const getFileNameFromUrl = (url) => {
        if (!url) return "file";
        try {
            return url.substring(url.lastIndexOf('/') + 1);
        } catch (e) {
            return "file";
        }
    };

    const convertUrlToFile = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = getFileNameFromUrl(url);
            return new File([blob], fileName, { type: blob.type });
        } catch (error) {
            console.error("Error converting file:", error);
            return null;
        }
    };

    useEffect(() => {
        if (tenderId) {
            fetchTenderDetailsForEdit();
        }
    }, [tenderId]);

    const fetchTenderDetailsForEdit = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderDetails/${tenderId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });

            if (res.status === 200) {
                const data = res.data;

                setTenderDetail(prev => ({
                    ...prev,
                    tenderFloatingNo: data.tenderNumber,
                    tenderFloatingDate: data.floatedOn ? data.floatedOn.split('T')[0] : '',
                    tenderName: data.tenderName,
                    offerSubmissionMode: data.submissionMode || data.offerSubmissionMode,
                    submissionLastDate: data.lastDate,
                    bidOpeningDate: data.bidOpeningdate,
                    contactPerson: data.contactName,
                    contactEmail: data.contactEmail,
                    contactMobile: data.contactNumber,
                    preBidMeeting: data.preBidding,
                    preBidMeetingDate: data.preBiddingDate,
                    siteInvestigation: data.siteInvestigation,
                    siteInvestigationDate: data.siteInvestigationDate,
                }));

                if (data.boq) {
                    const boqIds = new Set(data.boq.map(b => b.id));
                    setSelectedBoq(boqIds);
                    const parentsToExpand = new Set();
                    
                    const collectParents = (boqItem) => {
                        const parent = boqItem.parentBOQ || boqItem.parentBoq || boqItem.parentId;
                        if (parent) {
                            if (typeof parent === 'object' && parent.id) {
                                parentsToExpand.add(parent.id);
                                collectParents(parent);
                            } else if (typeof parent !== 'object') {
                                parentsToExpand.add(parent);
                            }
                        }
                    };

                    data.boq.forEach(b => {
                        collectParents(b);
                    });

                    if (parentsToExpand.size > 0) {
                        setExpandedParentIds(prev => {
                            const newSet = new Set([...prev, ...parentsToExpand]);
                            return newSet;
                        });
                        parentsToExpand.forEach(id => fetchChildrenBoq(id));
                    }
                }

                if (data.scopeOfPackages) {
                    const scopeIds = data.scopeOfPackages.map(s => s.id);
                    setSelectedScopes(scopeIds);
                }

                if (data.contractor) {
                    const contractorIds = data.contractor.map(c => c.id);
                    setSelectedContractor(contractorIds);
                }

                fetchAttachmentDetailsForEdit();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAttachmentDetailsForEdit = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/tenderAttachments/${tenderId}`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
            });

            if (res.status === 200) {
                const data = res.data;
                const newAttachments = { ...attachments };

                const mapFiles = async (urls, key, notes) => {
                    if (urls && urls.length > 0) {
                        const files = await Promise.all(urls.map(url => convertUrlToFile(url)));
                        newAttachments[key] = {
                            files: files.filter(f => f !== null),
                            notes: notes || ''
                        };
                    } else {
                        newAttachments[key] = { files: [], notes: notes || '' };
                    }
                };

                await Promise.all([
                    mapFiles(data.technicalTermsUrl, 'technical', data.technicalTerms),
                    mapFiles(data.drawingUrl, 'drawings', data.drawings),
                    mapFiles(data.commercialTermsUrl, 'commercial', data.commercialTerms),
                    mapFiles(data.otherUrl, 'others', data.others)
                ]);

                setAttachments(newAttachments);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getLoggedInUser = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/loggedin-user`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                const user = res.data;
                setTenderDetail(prev => ({
                    ...prev,
                    contactPerson: user?.name ?? "",
                    contactEmail: user?.email ?? "",
                    contactMobile: user?.phoneNumber ?? ""
                }));
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            }
        })
    }

    const fetchFilterOptions = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/contractorType`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setContractorTypeOptions(res?.data?.map(item => ({
                    value: item.id,
                    label: item.type
                })));
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            }
        });
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/contractorGrade`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setContractorGradeOptions(res?.data?.map(item => ({
                    value: item.id,
                    label: item.gradeName
                })));
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            }
        });
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/offerSubmissionMode`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setOfferSubmissionOptions(res?.data?.map(item => ({
                    value: item.code,
                    label: item.label
                })));
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            }
        });
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
                handleUnauthorized();
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

    useEffect(() => {
        setTenderDetail(prev => ({ ...prev, scopeOfPackage: Array.isArray(selectedScopes) ? selectedScopes : [] }));
    }, [selectedScopes]);

    const handleFloatTender = async () => {
        setIsLoading(true);
        const formData = new FormData();
        const formatDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            const offset = d.getTimezoneOffset();
            const localDate = new Date(d.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split("T")[0];
        };
        const tenderInputDto = {
            id: tenderId || null,
            tenderFloatingNo: tenderDetail.tenderFloatingNo,
            tenderFloatingDate: tenderDetail.tenderFloatingDate,
            tenderName: tenderDetail.tenderName,
            contactName: tenderDetail.contactPerson,
            contactNumber: tenderDetail.contactMobile,
            contactEmail: tenderDetail.contactEmail,
            floatedBy: tenderDetail.contactPerson,
            bidOpeningDate: formatDate(tenderDetail.bidOpeningDate),
            lastDate: formatDate(tenderDetail.submissionLastDate),
            siteInvestigation: tenderDetail.siteInvestigation === true,
            preBidMeeting: tenderDetail.preBidMeeting === true,
            siteInvestigationDate: formatDate(tenderDetail.siteInvestigationDate),
            preBidMeetingDate: formatDate(tenderDetail.preBidMeetingDate),
            scopeId: Array.isArray(selectedScopes) && Array.from(selectedScopes),
            contractorId: selectedContractor,
            boqId: Array.from(selectedBoq),
            projectId: projectId,
            submissionMode: tenderDetail.offerSubmissionMode
        };
        formData.append("tenderInputDto", new Blob([JSON.stringify(tenderInputDto)], {
            type: "application/json"
        }));
        const fileMapping = {
            technical: "technicalTerms",
            commercial: "commercialTerms",
            drawings: "drawings",
            others: "others"
        };
        Object.keys(attachments).forEach(key => {
            const backendKey = fileMapping[key];
            const attachmentData = attachments[key];
            if (backendKey && attachmentData.files && attachmentData.files.length > 0) {
                attachmentData.files.forEach(file => {
                    formData.append(backendKey, file);
                });

                if (attachmentData.notes) {
                    formData.append(`${backendKey}Notes`, attachmentData.notes);
                }
            }
        });
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/project/tender`, formData, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                }
            });

            if (response.status === 200 || response.status === 201) {
                toast.success(tenderId ? "Tender Updated Successfully!" : "Tender Floated Successfully!");
                navigate(`/tendertracking/${projectId}`);
            }
        } catch (error) {
            console.error("Error floating tender:", error);
            if (error.response?.status === 401) {
                handleUnauthorized();
            } else {
                toast.error(tenderId ? "Failed to update tender." : "Failed to float tender.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fetchContractorDetails = () => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/contractor`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setContractorInfo(res.data);
            }
        }).catch(err => {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            }
        })
    }

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
            <>
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
                <div className="d-flex justify-content-end mt-4 me-3">
                    <button className="btn btn-lg action-button" disabled={selectedBoq.size === 0} onClick={handleNextTabChange}><span className="fw-bold me-2">Confirm & Proceed</span><ArrowRight size={18} /></button>
                </div>
            </>
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
                    <span className="ms-2 text-muted"><span className="fw-bold text-dark">General Details - </span>{tenderDetail.tenderFloatingNo || ''}</span>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Tender Name <span className="text-danger">*</span></ label>
                        <input
                            type="text"
                            className="form-input w-100"
                            value={tenderDetail.tenderName || ''}
                            placeholder="Enter Tender Name"
                            onChange={(e) => {
                                setTenderDetail({ ...tenderDetail, tenderName: e.target.value });
                            }}
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Tender Floating Date </label>
                        <input type="text" className="form-input w-100"
                            value={tenderDetail.tenderFloatingDate || ''}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform-select text-start d-block">Offer Submission Mode</label>
                        <Select
                            options={offerSubmissionOptions}
                            placeholder="Select Mode"
                            className="w-100"
                            classNamePrefix="select"
                            value={offerSubmissionOptions.find(option => option.value === tenderDetail.offerSubmissionMode)}
                            onChange={(selected) =>
                                setTenderDetail({
                                    ...tenderDetail,
                                    offerSubmissionMode: selected?.value
                                })
                            }
                            isClearable
                        />
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Bid Opening Date <span className="text-danger">*</span></label>
                        <Flatpickr
                            id="bidOpeningDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.bidOpeningDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, bidOpeningDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon'
                            onClick={() => openCalendar('bidOpeningDate')}>
                            <FaCalendarAlt size={18} color='#005197' />
                        </span>
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Submission Last Date <span className="text-danger">*</span></label>
                        <Flatpickr
                            id="submissionLastDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.submissionLastDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, submissionLastDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon'
                            onClick={() => openCalendar('submissionLastDate')}>
                            <FaCalendarAlt size={18} color='#005197' />
                        </span>
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Person</label>
                        <input type="text" className="form-input w-100"
                            value={tenderDetail.contactPerson || ''}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Contact Email</label>
                        <input type="text" className="form-input w-100"
                            value={tenderDetail.contactEmail || ''}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Number</label>
                        <input type="text" className="form-input w-100"
                            value={tenderDetail.contactMobile || ''}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform-select text-start d-block">Pre Bid Meeting</label>
                        <Select
                            classNamePrefix="select"
                            options={booleanOptions}
                            className="w-100"
                            placeholder="Select..."
                            value={booleanOptions.find(option => option.value === tenderDetail.preBidMeeting)}
                            onChange={(selectedOption) => setTenderDetail({ ...tenderDetail, preBidMeeting: selectedOption?.value })}
                        />
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Pre Bid Meeting Date</label>
                        <Flatpickr
                            id="preBidMeetingDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.preBidMeetingDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, preBidMeetingDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon'
                            onClick={() => openCalendar('preBidMeetingDate')}>
                            <FaCalendarAlt size={18} color='#005197' />
                        </span>
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform-select text-start d-block">Site Investigation</label>
                        <Select
                            classNamePrefix="select"
                            className="w-100"
                            options={booleanOptions}
                            placeholder="Select..."
                            value={booleanOptions.find(option => option.value === tenderDetail.siteInvestigation)}
                            onChange={(option) => setTenderDetail({ ...tenderDetail, siteInvestigation: option?.value })}
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Site Investigation Date</label>
                        <Flatpickr
                            id="siteInvestigationDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.siteInvestigationDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, siteInvestigationDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon'
                            onClick={() => openCalendar('siteInvestigationDate')}>
                            <FaCalendarAlt size={18} color='#005197' />
                        </span>
                    </div>
                </div>
                <div className="row align-items-center ms-1 mt-5">
                    <div className="col-md-12 col-lg-12 ">
                        <label className="projectform-select text-start d-block">Scope of Package</label>
                        <Select options={scopeOptions} isMulti placeholder="Select Scope of Package" className="w-100" classNamePrefix="select"
                            value={scopeOptions.filter(opt => selectedScopes.includes(opt.value))}
                            onChange={(selected) => setSelectedScopes(selected ? selected.map(s => s.value) : [])}
                            components={{
                                MultiValueContainer: CustomMultiValueContainer,
                                IndicatorSeparator: CustomIndicatorSeparator,
                                DropdownIndicator: CustomDropdownIndicator,
                                ClearIndicator: CustomClearIndicator,
                            }}
                        />
                        <div className="mt-2 d-flex flex-wrap gap-2">
                            {scopeOptions.filter(opt => selectedScopes.includes(opt.value))
                                .map(selectedOpt => (
                                    <span key={selectedOpt.value} className="select__multi-value">
                                        <span className="select__multi-value__label">
                                            {selectedOpt.label}
                                        </span>
                                        <span
                                            className="select__multi-value__remove"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleRemoveScope(selectedOpt.value);
                                            }}
                                        >
                                            &times;
                                        </span>
                                    </span>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const packageDetails = (selectedBoqArray) => {
        const toggleNode = (id) => {
            setOpenNodes((prev) => {
                const updated = new Set(prev);
                updated.has(id) ? updated.delete(id) : updated.add(id);
                return updated;
            });
        };
        const buildBoqTree = (selected) => {
            const nodes = new Map();
            const ensureNode = (boq) => {
                if (!boq) return null;
                const parentProp = boq.parentBOQ ?? boq.parentBoq ?? null;
                if (nodes.has(boq.id)) return nodes.get(boq.id);
                const node = { ...boq, children: [] };
                nodes.set(boq.id, node);
                const parent = parentProp ? ensureNode(parentProp) : null;
                if (parent) {
                    parent.children.push(node);
                    node._parent = parent;
                }
                return node;
            };
            selected.forEach(boq => ensureNode(boq));
            const roots = [...nodes.values()].filter(n => !n._parent);
            return roots;
        };
        const boqStructure = buildBoqTree(selectedBoqArray);
        const buildParentChildMap = (boqStructure) => {
            const map = new Map();

            const build = (nodes) => {
                nodes.forEach(node => {
                    if (node.children?.length) {
                        map.set(
                            node.id,
                            node.children
                                .filter(child => child.lastLevel === true)
                                .map(child => child.id)
                        );

                        build(node.children.filter(child => !child.lastLevel));
                    }
                });
            };

            build(boqStructure);
            return map;
        };
        const parentChildMap = buildParentChildMap(boqStructure);
        const boqNameDisplay = (boqName) => {
            return boqName && boqName.length > 20
                ? boqName.substring(0, 20) + '...'
                : boqName;
        };
        const getImmediateLastLevelChildren = (node) => {
            return node.children?.filter(child => child.lastLevel === true) || [];
        };
        const collectLastLevel = (node, isVisible) => {
            let result = [];
            const isOpen = openNodes.has(node.id);
            if (node.lastLevel && isVisible) {
                result.push(node);
            }
            if (node.children?.length && isOpen) {
                node.children.forEach(child => {
                    result.push(...collectLastLevel(child, isVisible && isOpen));
                });
            }
            return result;
        };
        const renderParentSections = (nodes, depth = 0) => {
            return nodes.map(node => {
                if (node.lastLevel) return null;
                const isOpen = openNodes.has(node.id);
                const lastLevelChildren = getImmediateLastLevelChildren(node);
                return (
                    <div key={node.id} style={{ marginLeft: depth * 20 }}>
                        <div
                            className="d-flex align-items-center py-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleNode(node.id)}
                        >
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <Folder size={18} color="#005197" className="mx-2" />
                            <strong>{node.boqCode}</strong>
                            <span className="ms-2 text-muted">{node.boqName}</span>
                        </div>
                        {isOpen && lastLevelChildren.length > 0 && (
                            <div className="table table-responsive mt-2 ms-4">
                                <table className="table table-borderless">
                                    <tbody>
                                        {lastLevelChildren.map(child => (
                                            <tr key={child.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        style={{ borderColor: '#005197' }}
                                                        checked={boqForRemoval.has(child.id)}
                                                        onChange={() => toggleRemovalSelection(child.id)}
                                                    />

                                                </td>
                                                <td>{child.boqCode}</td>
                                                <td title={child.boqName}>
                                                    {boqNameDisplay(child.boqName)}
                                                </td>
                                                <td>{child.uom?.uomCode || '-'}</td>
                                                <td>{child.quantity?.toFixed(3) || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {isOpen && node.children?.length > 0 &&
                            renderParentSections(
                                node.children.filter(c => !c.lastLevel),
                                depth + 1
                            )
                        }
                    </div>
                );
            });
        };
        const toggleRemovalSelection = (boqId) => {
            setBoqForRemoval(prev => {
                const updated = new Set(prev);
                if (updated.has(boqId)) {
                    updated.delete(boqId);
                } else {
                    updated.add(boqId);
                }
                parentChildMap.forEach((children, parentId) => {
                    const hasAnyChild = children.some(childId => updated.has(childId));

                    if (!hasAnyChild) {
                        updated.delete(parentId);
                    }
                });
                return updated;
            });
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
                {selectedBoqArray.length > 0 && (
                    <div className="mt-3">
                        {renderParentSections(boqStructure)}
                    </div>
                )}
            </div>
        );
    };

    const contractorDetails = () => {
        const filteredContractors = contractorInfo.filter((con) => {
            const matchesSearch = searchTerm === '' ||
                con?.contractor?.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                con?.contractor?.entityCode?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === null ||
                con?.contractor?.contractorType?.id === selectedType.value;
            const matchesGrade = selectedGrade === null ||
                con?.contractor?.contractorGrade?.id === selectedGrade.value;
            return matchesSearch && matchesType && matchesGrade;
        });
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <User2 size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">Contractor Details</span>
                    <div className="text-muted mt-2 ms-4">Select Multiple contractors from the list</div>
                </div>
                <div className="row d-flex mt-4 justify-content-between ms-3 me-3">
                    <div className="col-md-4 mb-4">
                        <label className="projectform text-start d-block"> Search </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Contractor"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <label className="projectform-select text-start d-block">
                            Contractor Type
                        </label>
                        <Select
                            placeholder="Select Contractor Type"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            options={contractorTypeOptions}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>
                    <div className="col-md-4 mb-4">
                        <label className="projectform-select text-start d-block">
                            Contractor Grade
                        </label>
                        <Select
                            placeholder="Select Contractor Grade"
                            className="w-100"
                            classNamePrefix="select"
                            options={contractorGradeOptions}
                            isClearable
                            value={selectedGrade}
                            onChange={setSelectedGrade}
                        />
                    </div>
                </div>
                {filteredContractors.length > 0 ? (
                    filteredContractors.map((con, index) => (
                        <div className="contractor-card ms-3 me-3 mb-3 p-3 border-1" key={index}>
                            <div className="d-flex justify-content-between">
                                <div className="fw-bold text-dark">
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        style={{ borderColor: '#005197' }}
                                        checked={selectedContractor.includes(con?.contractor?.id)}
                                        onChange={() => {
                                            const id = con?.contractor?.id;
                                            if (selectedContractor.includes(id)) {
                                                setSelectedContractor(selectedContractor.filter(item => item !== id));
                                            } else {
                                                setSelectedContractor([...selectedContractor, id]);
                                            }
                                        }}
                                    />
                                    {con?.contractor?.entityName}
                                </div>
                                <div className="badge badge-md me-2 rounded-pill py-2 px-3" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                                    {con?.contractor?.contractorType?.type}
                                </div>
                            </div>
                            <div className="d-flex justify-content-between mt-2" style={{ fontSize: '13px' }}>
                                <span className="text-muted">Entity Code: <span className="text-dark"> {con?.contractor?.entityCode || '-'}</span></span>
                                <span className="text-muted">Name: <span className="text-dark">{con?.contact?.name || '-'}</span></span>
                                <span className="text-muted">Mobile: <span className="text-dark">{con?.contact?.phoneNumber || '-'}</span></span>
                                <span className="text-muted">E-mail: <span className="text-dark">{con?.contact?.email || '-'}</span></span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-4 text-muted">
                        No contractors found matching your criteria.
                    </div>
                )}
            </div>
        );
    }

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
                if (!tenderDetail.tenderName || !tenderDetail.bidOpeningDate || !tenderDetail.submissionLastDate) {
                    toast.error("Enter all mandatory feilds")
                    return
                }
                setTab('package');
            }
            else if (tab === 'package') {
                setTab('contractor');
            }
            else if (tab === 'contractor') {
                if (selectedContractor.length === 0) {
                    toast.error("Select atleast one contractor")
                    return
                }
                setTab('attachment');
            }
            else if (tab === 'attachment') {
                setCurrentTab('review');
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
            else if (tab === 'general') {
                setCurrentTab('boq');
            }
        }

        return (
            <>
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
                </div>
                <div className="d-flex justify-content-between align-items-center ms-3 me-3 mt-4 mb-4">
                    <button className="btn cancel-button" onClick={handlePrevious}><ArrowLeft size={18} /><span className="ms-2">Previous</span></button>
                    <button className="btn btn-lg action-button" onClick={handleNext}><span className="fw-bold me-2">{tab === 'attachment' ? 'Confirm & Proceed' : 'Next'}</span><ArrowRight size={18} /></button>
                </div>
            </>
        );
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const getFriendlyFileType = (mimeType) => {
        if (!mimeType) return 'File';

        if (mimeType.includes('image/')) {
            return mimeType.split('/')[1].toUpperCase() || 'Image';
        }
        if (mimeType.includes('pdf')) {
            return 'PDF';
        }
        if (mimeType.includes('word')) {
            return 'Word';
        }
        if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
            return 'Excel';
        }
        if (mimeType.includes('zip') || mimeType.includes('rar')) {
            return 'Archive';
        }

    }

    const reviewTender = () => {
        const boqArray = getSelectedLeafBoqs(parentTree);
        const contractorsList = contractorInfo.filter(con => selectedContractor.includes(con.contractor.id));

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

        const handleViewFile = (file) => {
            if (file) {
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            }
        };

        const handleRemoveFile = (key, index) => {
            setAttachments(prev => ({
                ...prev,
                [key]: {
                    ...prev[key],
                    files: prev[key].files.filter((_, i) => i !== index)
                }
            }));
        };

        return (
            <div className="p-4">
                <div className="p-4 bg-white rounded-3" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
                    <div className="text-start ms-1 mt-2 mb-4">
                        <h5 className="fw-bold mb-1" style={{ color: '#333' }}>{tenderId ? 'Review & Update Tender' : 'Review & Float Tender'}</h5>
                        <p className="text-muted" style={{ fontSize: '14px' }}>Review tender details and float to selected contractors</p>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div className="text-start">
                            <span className="text-muted d-block" style={{ fontSize: '14px' }}>Tender Floating No</span>
                            <span className="fw-medium" style={{ fontSize: '16px' }}>{tenderDetail.tenderFloatingNo || 'N/A'}</span>
                        </div>
                        <div className="text-end">
                            <span className="text-muted d-block" style={{ fontSize: '14px' }}>Floating Date</span>
                            <span className="fw-medium" style={{ fontSize: '16px' }}>
                                {tenderDetail.tenderFloatingDate
                                    ? new Date(tenderDetail.tenderFloatingDate).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })
                                    : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 mt-5 bg-white rounded-3" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
                    <div className="text-start ms-1 mt-2 mb-3">
                        <Info size={20} color="#2BA95A" />
                        <span className="ms-2 fw-bold" style={{ color: '#2BA95A' }}>General Details</span>
                    </div>
                    <div className="row g-4 ms-1">
                        <div className="col-md-4 text-start">
                            <span className="text-muted d-block">Tender Name</span>
                            <span className="fw-medium">{tenderDetail.tenderName || 'N/A'}</span>
                        </div>
                        <div className="col-md-4 text-start">
                            <span className="text-muted d-block">Offer Submission Mode</span>
                            <span className="fw-medium">{tenderDetail.offerSubmissionMode}</span>
                        </div>
                        <div className="col-md-4 text-start">
                            <span className="text-muted d-block">Submission Last Date</span>
                            <span className="fw-medium" style={{ color: '#dc3545' }}>
                                {tenderDetail.submissionLastDate
                                    ? new Date(tenderDetail.submissionLastDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="col-md-4 text-start">
                            <span className="text-muted d-block">Bid Opening</span>
                            <span className="fw-medium">
                                {tenderDetail.bidOpeningDate
                                    ? new Date(tenderDetail.bidOpeningDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'N/A'}
                            </span>
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
                        <div className="col-md-4 text-start">
                            <span className="text-muted d-block">Site Investigation date</span>
                            <span className="fw-medium">
                                {tenderDetail.siteInvestigationDate
                                    ? new Date(tenderDetail.siteInvestigationDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="col-md-4 text-start">
                            <span className="text-muted d-block">Pre-bid Meeting date</span>
                            <span className="fw-medium">
                                {tenderDetail.preBidMeetingDate
                                    ? new Date(tenderDetail.preBidMeetingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className="col-md-12 text-start">
                            <span className="text-muted d-block">Scope of Packages</span>
                            <div className="d-flex flex-wrap gap-2 mt-1">
                                {Array.isArray(tenderDetail.scopeOfPackage) && tenderDetail.scopeOfPackage.length > 0 ? (
                                    tenderDetail.scopeOfPackage.map((scopeId, index) => {
                                        const scopeObj = scopeOptions.find(opt => opt.value === scopeId);
                                        return (
                                            <span key={index} className="badge p-2"
                                                style={{ backgroundColor: '#EAF2FE', color: '#2563EBCC', fontSize: '11px', borderRadius: '15px' }}>
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
                </div>

                <div className="p-4 mt-5 bg-white rounded-3" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
                    <div className="text-start ms-1 mb-3">
                        <BoxesIcon size={20} color="#2BA95A" />
                        <span className="ms-2 fw-bold" style={{ color: '#2BA95A' }}>Package Details </span>
                    </div>
                    <div className="table-responsive ms-1 me-1">
                        <table className="table table-borderless">
                            <thead style={{ color: '#005197', borderBottom: '2px solid #0051973D' }}>
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
                </div>

                <div className="p-4 mt-5 bg-white rounded-3" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
                    <div className="text-start ms-1 mb-3">
                        <User2 size={20} color="#dc3545" />
                        <span className="ms-2 fw-bold" style={{ color: '#dc3545' }}>Contractor Details</span>
                        <p className="text-muted mt-1" style={{ fontSize: '14px' }}>{contractorsList.length} contractors selected for tender invitation</p>
                    </div>
                    <div className="d-flex flex-wrap gap-3 ms-1">
                        {contractorsList.map((con, index) => (
                            <div key={index} className="col-md-4 p-3" style={{ border: '1px solid #ccc', borderRadius: '8px', minWidth: '300px' }}>
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex">
                                        <div className="d-flex me-2 px-3 align-items-center h-100 py-2 rounded-2" style={{ background: '#EAF2FE' }}>
                                            <Building style={{ color: '#2563EB' }} size={26} />
                                        </div>
                                        <div className="text-start">
                                            <p className="fw-bold mb-0" style={{ color: '#333' }}>{con?.contractor?.entityName}</p>
                                            <p className="text-muted mb-0" style={{ fontSize: '13px' }}>{con?.contact?.name}<Dot size={24} /><span>{con?.contact?.email}</span></p>
                                        </div>
                                    </div>
                                    <span style={{ color: '#dc3545', cursor: 'pointer' }}>
                                        <X size={16} onClick={() => {
                                            setSelectedContractor(prev => prev.filter(id => id !== con?.contractor?.id));
                                        }} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 mt-5 bg-white rounded-3" style={{ border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,.05)' }}>
                    <div className="text-start ms-1 mb-3">
                        <Paperclip size={20} color="#005197" />
                        <span className="ms-2 fw-bold" style={{ color: '#005197' }}>Attachments</span>
                    </div>

                    <div className="ms-1 me-1">
                        {Object.keys(attachments).map((key) => {
                            const attachmentData = attachments[key];
                            const title = getAttachmentTitle(key);
                            const files = attachmentData.files || [];
                            const notes = attachmentData.notes || '';

                            return (
                                <div
                                    key={key}
                                    className="p-3 rounded-3 mb-3"
                                    style={{
                                        backgroundColor: '#FAFAFA',
                                        border: '1px solid #eee'
                                    }}
                                >
                                    <div className="d-flex flex-column text-start">
                                        <div className="mb-2">
                                            <span className="fw-bold d-block" style={{ color: '#333' }}>{title}</span>
                                            {notes && (
                                                <span className="text-muted d-block small mt-1">
                                                    Note: {notes}
                                                </span>
                                            )}
                                        </div>

                                        {files.length > 0 ? (
                                            <div className="d-flex flex-column gap-2 mt-2">
                                                {files.map((file, idx) => (
                                                    <div key={idx} className="d-flex justify-content-between align-items-center bg-white p-2 rounded border">
                                                        <div className="d-flex flex-column">
                                                            <span className="small fw-medium text-truncate" style={{ maxWidth: '300px' }}>
                                                                {file.name}
                                                            </span>
                                                            <span className="text-muted" style={{ fontSize: '11px' }}>
                                                                {getFriendlyFileType(file.type)} • {formatFileSize(file.size)}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm btn-light border-0"
                                                                style={{ color: '#005197' }}
                                                                onClick={() => handleViewFile(file)}
                                                                title="View File"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-light border-0"
                                                                style={{ color: '#dc3545' }}
                                                                onClick={() => handleRemoveFile(key, idx)}
                                                                title="Remove File"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted small fst-italic">No files attached</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-5 mb-5">
                    <div
                        className="p-4 d-flex flex-column rounded-3"
                        style={{
                            backgroundColor: '#EAF2FE',
                            border: '1px solid #C0D9FF',
                        }}
                    >
                        <div className="mb-3 fw-bold text-start" style={{ color: '#005197' }}>
                            Tender Summary
                        </div>
                        <div className="d-flex flex-column" style={{ color: '#005197', fontSize: '14px' }}>
                            <div className="d-flex mb-2">
                                <div className="d-flex justify-content-between pe-2 me-4" style={{ width: '50%', borderRight: '1px solid #D2E3F4' }}>
                                    <span>Total Packages</span> <span style={{ color: '#005197' }}>{boqArray.length > 0 ? 1 : 0}</span>
                                </div>
                                <div className="d-flex justify-content-between ps-4" style={{ width: '50%' }}>
                                    <span>Selected Contractors</span> <span style={{ color: '#005197' }}>{contractorsList.length}</span>
                                </div>
                            </div>

                            <div className="d-flex">
                                <div className="d-flex justify-content-between pe-2 me-4" style={{ width: '50%', borderRight: '1px solid #D2E3F4' }}>
                                    <span>Attachments</span>
                                    <span style={{ color: '#005197' }}>
                                        {Object.values(attachments).reduce((acc, curr) => acc + (curr.files ? curr.files.length : 0), 0)}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between ps-4" style={{ width: '50%' }}>
                                    <span>Submission Deadline</span>
                                    <span style={{ color: '#dc3545' }}>
                                        {tenderDetail.submissionLastDate
                                            ? new Date(tenderDetail.submissionLastDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                            : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-3">
                    <button className="btn cancel-button" onClick={() => setCurrentTab('tender')}>
                        <Edit size={18} color="#005197" /> <span className="ms-2">Edit Details</span>
                    </button>
                    <button className="btn btn-lg action-button" onClick={handleFloatTender} disabled={isLoading}>
                        <Send size={20} color="#FFFFFF" /><span className="ms-2">{tenderId ? 'Update Tender' : 'Float Tender'}</span>
                    </button>
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
    return (
        <div className='container-fluid p-3 min-vh-100 overflow-y-hidden'>
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
                <div>
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
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000052'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000052'}`, borderRadius: '30px' }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000052'}` }}>Tender details</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : '#00000052'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : '#00000052'}`, borderRadius: '30px' }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : '#00000052'}` }}>Review & Float</span>
                    </div>
                </div>
            </div>
            {renderContent()}
        </div>
    );
}
export default TFProcess;