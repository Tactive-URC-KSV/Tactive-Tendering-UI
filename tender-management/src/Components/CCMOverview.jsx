import axios from "axios";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SaveMappingIcon from '../assest/SaveMapping.svg?react';

const CCMOverview = () => {
    const [project, setProject] = useState();
    const { projectId } = useParams();

    const [selectedMappingType, setSelectedMappingType] = useState("1 : M");


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

    const boqData = [
        {
            id: "A", name: "Site Construction", amount: 7320000, children: [
                {
                    id: "A.1", name: "Earth Work", children: [
                        { id: "A.1.1", name: "Earth Work Excavation in Loose soil" },
                        { id: "A.1.2", name: "Earth Work Excavation in Soft Rock" },
                        { id: "A.1.3", name: "Earth Work Excavation in Hard Rock" }
                    ]
                }
            ]
        },
        { id: "B", name: "Concrete", amount: 600000 },
        { id: "C", name: "Reinforcement Concrete", amount: 74060000 },
        { id: "D", name: "Metals", amount: 1200000 },
        { id: "E", name: "Finishes", amount: 2400000 }
    ];

    const activityData = [
        { id: "direct", name: "Object Cost" },
        { id: "indirect", name: "In-direct Cost" }
    ];

    useEffect(() => {
        console.log(projectId);

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

    const handleSaveMapping = () => {
        alert("Mapping saved successfully!");
    };

    const handleReset = () => {
        setSelectedMappingType("1 : M");
    };

    const renderBOQTree = (items, level = 0) => {
        return items.map(item => (
            <div key={item.id} style={{ marginLeft: `${level * 20}px` }}>
                <div className="d-flex justify-content-between align-items-center py-2">
                    <div>
                        <span className="fw-bold me-2">{item.id}</span>
                        <span>{item.name}</span>
                    </div>
                    {item.amount && <span className="text-muted">$ {item.amount.toLocaleString()}</span>}
                </div>
                {item.children && renderBOQTree(item.children, level + 1)}
            </div>
        ));
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
                <div className="ms-3">
                    <ArrowLeft size={20} onClick={() => window.history.back()} /><span className='ms-2'>Cost Code Mapping</span>
                    <span className='ms-2'>-</span>
                    <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
                </div>
            </div>

            <div className="row bg-white border rounded-3 ms-4 me-4 py-4 ps-4 mt-3 pe-4 mb-4 ">
                <h5 className="card-title text-start fs-6 ms-1 mb-3">Select Mapping Type</h5>
                {mappingTypes.map((type) => (
                    <div className="col-md-6 col-lg-4 mb-3" key={type.key}>
                        <div
                            className={`p-3 m-2 border rounded h-100 d-flex flex-column ${selectedMappingType === type.key
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border"
                                }`}
                            style={{
                                cursor: "pointer",
                                minWidth: "200px",
                                transition: "all 0.2s ease",
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
                <div className="col-md-5 bg-white border rounded-3">
                    <div className="card border-0 bg-transparent">
                        <div className="card-header d-flex justify-content-between align-items-center border-0 bg-transparent">
                            <h5 className="mb-0">BOQ Details</h5>
                        </div>
                    </div>
                </div>

                <div className="col-md-2 d-flex justify-content-center align-items-center ">
                    <div className="card text-center border-0 bg-transparent">

                        <div className="d-flex justify-content-center mb-2">
                            <ArrowRight
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow"
                                style={{ width: "60px", height: "60px" }}
                            />
                        </div>

                        <small className="text-nowrap mt-2 mb-1 ">Selected Type:</small>
                        <div className="fs-6 text-nowrap mb-2 text-primary">{selectedMappingType} Mapping</div>


                        <div className="d-flex justify-content-center">
                            <ArrowLeft
                                size={28}
                                className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary shadow "
                                style={{ width: "60px", height: "60px" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-5">
                    <div className="card">
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

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card border-0 bg-light">
                        <div className="card-body">
                            <div className="d-flex justify-content-end gap-2">
                                <button className="bg-transparent border-0" style={{ color: "#3273AB" }} onClick={handleReset}>
                                    Reset
                                </button>
                                <button className = "border-0 text-white p-2 rounded" style={{backgroundColor:"#3273AB"}} onClick={handleSaveMapping}><SaveMappingIcon className="ms-2"/><span className="ps-2">Save Mapping</span>  
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