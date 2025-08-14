import { useEffect, useState } from "react";
import { ArrowLeft } from 'lucide-react';
import BOQUpload from "./BOQUpload";
import axios from "axios";
import  Import   from '../assest/Import.svg?react';
import  Export   from '../assest/Export.svg?react';
import  ExpandIcon  from '../assest/Expand.svg?react';
import  CollapseIcon  from '../assest/Collapse.svg?react';
import  DropDown  from '../assest/DropDown.svg?react';
import  DeleteIcon  from '../assest/DeleteIcon.svg?react';


function BOQOverview({ projectId }) {

    const [totalAmount, setTotalAmount] = useState();
    const [parentBOQ, setParentBOQ] = useState([]);
    const [project, setProject] = useState();
    const [uploadScreen, setUploadScreen] = useState(false);
    const [expand, setExpand] = useState(false);
    const [collapse, setCollapse] = useState(true);
    const [parentTotalCache, setParentTotalCache] = useState({});

    const BOQStats = ([
        { label: 'Parent BOQ', value: parentBOQ.length, bgColor: '#EFF6FF', color: '#2563EB' },
        { label: 'Total BOQ', value: '21', bgColor: '#F0FDF4', color: '#2BA95A' },
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
            }
        }).catch(err => {
            console.log(err);
        })
    }, [projectId])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentBoq/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setParentBOQ(res.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [projectId])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getBoqTotalValue/${projectId}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                setTotalAmount(res.data);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [projectId])

    const parentTotalValue = (parentBoqCode) => {

        if (parentTotalCache[parentBoqCode] !== undefined) {
            return parentTotalCache[parentBoqCode];
        }
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/getParentTotalValue/${projectId}/${parentBoqCode}`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setParentTotalCache(prev => ({
                        ...prev,
                        [parentBoqCode]: res.data
                    }));
                }
            })
            .catch(err => {
                console.error(err);
            });

        return (<span className="spinner-border spinner-border-sm text-primary"></span>);

    }

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
                <p className="fw-bold text-start mt-2 ms-2">{project?.projectName + '(' + project?.projectCode + ')'}</p>
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
                        {expand && (<button className="btn" style={{ cursor: 'pointer', color: '#005197' }} onClick={() => { setExpand(false); setCollapse(true) }}><CollapseIcon /><span>Collapse All</span></button>)}
                        {collapse && (<button className="btn" style={{ cursor: 'pointer', color: '#005197' }} onClick={() => { setExpand(true); setCollapse(false) }}><ExpandIcon /><span>Expand All</span></button>)}
                    </div>
                </div>
                {parentBOQ.length > 0 ? (
                    <>
                        {parentBOQ.map((boq, index) =>
                        (<div className="col-12" key={index}>
                            <div className="parent-boq p-3 rounded-4 mb-4 text-start ms-2 me-2">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        {!boq.lastLevel && (<span><DropDown onClick={() => { expand ? setExpand(false) : setExpand(true) ; setCollapse(true); }} /></span>)}
                                        <span className="fw-bold ms-2">{boq.boqName}</span>
                                    </div>
                                    <div>
                                        <span className="fw-bold me-3" style={{ color: '#005197' }}>{`$ ${parentTotalValue(boq.boqCode)}`}</span>
                                        <DeleteIcon />
                                    </div>
                                </div>

                            </div>
                        </div>))}
                    </>
                ) :
                    (<>No Contents</>)}

            </div>

        </>)
    );
}
export default BOQOverview;