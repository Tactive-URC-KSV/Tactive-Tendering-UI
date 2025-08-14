import { useEffect, useState, createContext, useContext } from "react";
import { ArrowLeft } from 'lucide-react';
import BOQUpload from "./BOQUpload";
import axios from "axios";
import  Import   from '../assest/Import.svg?react';
import  Export   from '../assest/Export.svg?react';
import  ExpandIcon  from '../assest/Expand.svg?react';
import  CollapseIcon  from '../assest/Collapse.svg?react';
import  DropDown  from '../assest/DropDown.svg?react';
import  DeleteIcon  from '../assest/DeleteIcon.svg?react';


const BOQContext = createContext();

function BOQNode({ boq, level = 0 }) {
    const { expanded, toggleExpanded } = useContext(BOQContext); // Ensure this works
    const isExpanded = expanded.has(boq.boqCode);
    const hasChildren = boq.children && boq.children.length > 0;
    const total = boq.calculatedTotal || 0;
    const isLeaf = !hasChildren; // or boq.lastLevel if available

    if (isLeaf) {
        return (
            <tr>
                <td><input type="checkbox" className="form-check-input" style={{borderColor: '#005197'}} /></td>
                <td className="boq-data">{boq.boqName || 'No Name'}</td>
                <td className="boq-data">{boq.uom?.uomCode || 'Cum'}</td>
                <td className="boq-data">{boq.quantity || 0}</td>
                <td className="boq-data">{boq.totalRate || 0}</td>
                <td className="boq-data">{boq.totalAmount || 0}</td>
            </tr>
        );
    }

    const [allSelected, setAllSelected] = useState(false);
    const [rowSelected, setRowSelected] = useState(hasChildren ? new Array(boq.children.length).fill(false) : []);

    const handleAllChange = (e) => {
        const checked = e.target.checked;
        setAllSelected(checked);
        setRowSelected(new Array(boq.children.length).fill(checked));
    };

    const handleRowChange = (index) => (e) => {
        const newRow = [...rowSelected];
        newRow[index] = e.target.checked;
        setRowSelected(newRow);
        setAllSelected(newRow.every(s => s));
    };

    if (!boq) {
        return <div>Error: BOQ data is missing</div>;
    }

    return (
        <div className={`boq-node p-3 rounded-4 mb-3 text-start ${level === 0 ? 'bg-light-blue' : 'bg-light-blue'}`} style={{ marginLeft: level * 20, border: level === 0 ? '0.5px solid #0051973D' : 'none', background: 'rgba(239, 246, 255, 1)' }}>
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
                    <span className="fw-bold me-3" style={{ color: '#005197' }}>{`$ ${total.toFixed(2)}`}</span>
                    <DeleteIcon style={{ cursor: 'pointer' }} />
                </div>
            </div>
            {isExpanded && hasChildren && (
                <div className="mt-3">
                    {boq.children.every(child => !child.children || child.children.length === 0) ? (
                        <div className="table-responsive boq-table" style={{background: 'white', borderRadius: 9}}>
                            <table className="table table-borderless">
                                <thead>
                                    <tr style={{borderBottom: '1px solid rgba(0, 81, 151, 0.24)'}}>
                                        <th><input type="checkbox" className="form-check-input" style={{borderColor: '#005197'}} checked={allSelected} onChange={handleAllChange} /></th>
                                        <th className="boq-header">BOQ Name</th>
                                        <th className="boq-header">UOM</th>
                                        <th className="boq-header">Quantity</th>
                                        <th className="boq-header">Rate</th>
                                        <th className="boq-header">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boq.children.length > 0 ? boq.children.map((child, index) => (
                                        <tr key={index} style={{borderBottom: index === boq.children.length - 1 ? 'none' : '1px solid rgba(0, 81, 151, 0.24)'}}>
                                            <td><input type="checkbox" className="form-check-input" style={{borderColor: '#005197'}} checked={rowSelected[index]} onChange={handleRowChange(index)} /></td>
                                            <td className="boq-data">{child.boqName || 'No Name'}</td>
                                            <td className="boq-data">{child.uom?.uomCode || 'Cum'}</td>
                                            <td className="boq-data">{child.quantity || 0}</td>
                                            <td className="boq-data">{child.totalRate || 0}</td>
                                            <td className="boq-data">{child.totalAmount || 0}</td>
                                        </tr>
                                    )) : <tr><td colSpan="6">No child data available</td></tr>}
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

    const BOQStats = ([
        { label: 'Parent BOQ', value: boqTree.length, bgColor: '#EFF6FF', color: '#2563EB' },
        { label: 'Total BOQ', value: allBOQ.length, bgColor: '#F0FDF4', color: '#2BA95A' },
        { label: 'Total Value', value: `$ ${(totalAmount / 1000000).toFixed(2)} M` || 'N/A', bgColor: '#FFF7ED', color: '#EA580C' },
    ]);

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
        if (allBOQ.length > 0) {
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
                if (node.children.length === 0) {
                    node.calculatedTotal = node.totalAmount || 0;
                } else {
                    node.calculatedTotal = node.children.reduce((sum, child) => sum + calculateTotals(child), 0);
                }
                return node.calculatedTotal;
            };

            roots.forEach(calculateTotals);

            const collectNonLeaves = (node, set) => {
                if (node.children.length > 0) {
                    set.add(node.boqCode);
                    node.children.forEach(child => collectNonLeaves(child, set));
                }
            };

            const nonLeaves = new Set();
            roots.forEach(root => collectNonLeaves(root, nonLeaves));
            setNonLeafCodes(nonLeaves);

            setBoqTree(roots);
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

    return (
        uploadScreen ? (
            <BOQUpload projectId={projectId} projectName={project?.projectName + '(' + project?.projectCode + ')'} setUploadScreen={setUploadScreen} />
        ) : (<>
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-1 mt-1 mb-3">
                <div className="ms-3">
                    <ArrowLeft size={20} onClick={() => window.history.back()} /><span className='ms-2'>BOQ Definition</span>
                </div>
                <div className="me-3">
                    <button className="btn import-button me-2" onClick={() => setUploadScreen(true)}><span className="me-2" ><Import /></span>Import File</button>
                    <button className="btn action-button ms-2"><span className="me-2"><Export /></span>Export File</button>
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
                    <div className=" me-1">
                        <button className="btn" style={{ cursor: 'pointer', color: '#005197' }} onClick={toggleAll}>
                            {isAllExpanded ? <><CollapseIcon /><span>Collapse All</span></> : <><ExpandIcon /><span>Expand All</span></>}
                        </button>
                    </div>
                </div>
                <BOQContext.Provider value={{ expanded, toggleExpanded }}>
                    {boqTree.length > 0 ? (
                        boqTree.map((boq, index) => (
                            <BOQNode key={index} boq={boq} />
                        ))
                    ) : (
                        <div>No BOQ data available</div>
                    )}
                </BOQContext.Provider>
            </div>
        </>)
    );
}
export default BOQOverview;