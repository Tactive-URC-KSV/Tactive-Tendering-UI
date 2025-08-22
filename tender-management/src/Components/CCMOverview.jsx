import axios from "axios";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight, FileText, Search } from 'lucide-react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LargeFolder from '../assest/LargeFolder.svg?react';
import MediumFolder from '../assest/MediumFolder.svg?react';
import SaveMappingIcon from '../assest/SaveMapping.svg?react';
import SmallFolder from '../assest/SmallFolder.svg?react';

const CCMOverview = () => {
    const [project, setProject] = useState();
    const { projectId } = useParams();
    const [boqTree, setBoqTree] = useState([]);
    const [selectedBOQs, setSelectedBOQs] = useState(new Set());
    const [selectedMappingType, setSelectedMappingType] = useState("1 : M");
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFolders, setExpandedFolders] = useState(new Set());

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

    const activityData = [
        { id: "direct", name: "Object Cost" },
        { id: "indirect", name: "In-direct Cost" }
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

    const handleSaveMapping = () => {
        alert(`Mapping saved successfully for ${selectedBOQs.size} BOQ items!`);
    };

    const handleReset = () => {
        setSelectedMappingType("1 : M");
        setSelectedBOQs(new Set());
        setSearchQuery("");
        setExpandedFolders(new Set());
    };

    const BOQNode = ({ boq, level = 0 }) => {
        const hasChildren = boq.children && boq.children.length > 0;
        const isSelected = selectedBOQs.has(boq.boqCode);
        const total = boq.calculatedTotal || 0;
        const isExpanded = expandedFolders.has(boq.boqCode);

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
                <div className="mb-3">
                    <div
                        className="d-flex justify-content-between align-items-center cursor-pointer"
                        onClick={handleFolderToggle}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex align-items-center mb-2">
                            <span className="me-2">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                            <span>{getIcon()}</span>
                            <span className="fw-bold me-md-2 ms-2 text-nowrap" style={{ maxWidth: '80px' }}>{boq.boqCode}</span>
                            <span>-</span>
                            <span className="flex-start fw-bold ms-2 text-nowrap" style={{ maxWidth: '400px' }}>{boq.boqName}</span>
                        </div>
                        {!boq.parentBOQ && (
                            <span className="text-nowrap ms-2 pb-2 text-secondary" style={{ minWidth: '100px' }}>
                                $ {total.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {isExpanded && (
                        <div className="ms-4 mt-2">
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
                            className={`p-3 m-2  rounded h-100 d-flex flex-column ${selectedMappingType === type.key
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border"
                                }`}
                            style={{
                                cursor: "pointer",
                                minWidth: "200px",
                                transition: "all 0.2s ease", border: '0.5px solid #0051973D'
                            }}
                            onClick={() => setSelectedMappingType(type.key)}
                        >
                            <h6 className="text-start">{type.title}</h6>
                            <p className=" small text-start flex-grow-1 p-0 m-0">{type.desc}</p>
                            <div className="text-start">
                                <small className="text-muted">
                                    {type.key === "1 : M" ? (
                                        <span className="d-flex align-items-center">
                                            <span className="d-flex align-items-center me-2 ">
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                BOQ
                                            </span>
                                            <span className="me-2">→</span>
                                            <span className="d-flex align-items-center">
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                Activities
                                            </span>
                                        </span>
                                    ) : type.key === "1 : 1" ? (
                                        <span className="d-flex align-items-center">
                                            <span className="d-flex align-items-center me-2">
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                BOQ
                                            </span>
                                            <span className="me-2">→</span>
                                            <span className="d-flex align-items-center">
                                                <span className="bg-success  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                Activity
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="d-flex align-items-center">
                                            <span className="d-flex align-items-center me-2">
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
                                                <span className="bg-primary  me-1" style={{ width: '10px', height: '10px', borderRadius: "2px" }}></span>
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
                ))}
            </div>

            <div className="row ms-1 py-4 ps-4 mt-3 pe-4 mb-4">
                <div className="col-md-5 bg-white rounded-3 p-3" style={{ border: '0.5px solid #0051973D' }}>
                    <div className="card border-0 bg-transparent">
                        <div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent pb-3">
                            <h5 className="mb-0">BOQ Details</h5>
                        </div>

                        <div className="position-relative mb-3">
                            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
                            <input
                                type="text"
                                className="form-control ps-5 "
                                placeholder="Search BOQ items..." style={{ border: '0.5px solid #0051973D' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {boqTree.length > 0 ? (
                                boqTree.map((boq, index) => (
                                    <BOQNode key={index} boq={boq} />
                                ))
                            ) : (
                                <div className="text-center text-muted py-4">No BOQ data available</div>
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
                            />
                        </div>

                        <small className="text-nowrap mt-2 mb-1 ">Selected Type:</small>
                        <div className="fs-6 text-nowrap mb-2 text-primary">{selectedMappingType} Mapping</div>

                        <div className="d-flex justify-content-center">
                            <ArrowLeft
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow "
                                style={{ width: "60px", height: "60px", cursor: "pointer" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card border-0 bg-transparent h-100">
                        <div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent">
                            <h5 className="mb-0">Activity Details</h5>
                            <button className="border-0 bg-transparent"><small className="text-nowrap text-primary">+ Add Activity</small></button>
                        </div>

                        <div className="card-body">
                            {activityData.map(activity => (
                                <div key={activity.id} className="py-2 border-bottom">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id={activity.id} />
                                        <label className="form-check-label" htmlFor={activity.id}>
                                            {activity.name}
                                        </label>
                                    </div>
                                </div>
                            ))}
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