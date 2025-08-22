import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import  Floors  from '../assest/Floors.svg?react';
import  Area  from '../assest/Area.svg?react';
import  Cost  from '../assest/Cost.svg?react';
import  TotalCost  from '../assest/TotalCost.svg?react';
import  Amenities  from '../assest/Amenities.svg?react';
import axios from 'axios';
import { toast } from 'react-toastify';

function FeasibilityStudy({ project, setActiveTab }) {
    const [listOfApprovals, setListOfApprovals] = useState([]);
    const [selectedApprovals, setSelectedApprovals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [financialData, setFinancialData] = useState({
        marketAvailability: '',
        financialBackup: '',
        sellingCost: '',
        rentalCost: '',
        expectedProfit: '',
        profitPercentage: '',
        roiYear: '',
    });
    const [technicalData, setTechnicalData] = useState({
        executionCapabilities: '',
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/listOfApprovals`)
            .then(response => {
                if (response.status === 200) {
                    setListOfApprovals(response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            })
    }, []);
    const approvalDocuments = listOfApprovals.map(approval => ({
        value: approval.id,
        label: approval.documentName
    }));

    const handleCommentChange = (index, comment) => {
        const updated = [...selectedApprovals];
        updated[index].comment = comment;
        setSelectedApprovals(updated);
    };

    const handleApprovalChange = (index, isApproved) => {
        const updated = [...selectedApprovals];
        updated[index].isApproved = isApproved;
        setSelectedApprovals(updated);
    };

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const updated = [...selectedApprovals];
        updated[index].file = file;
        setSelectedApprovals(updated);
    };
    const handleRemoveFile = (index) => {
        const updated = [...selectedApprovals];
        updated[index].file = null;
        setSelectedApprovals(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();

            const normalizeArray = (input) =>
                Array.isArray(input) ? input : input?.split(',').map(item => item.trim()) || [];

            const normalizedTechData = {
                ...technicalData,
                executionCapabilities: normalizeArray(technicalData.executionCapabilities),
            };

            const normalizedFinancialData = {
                ...financialData,
                marketAvailability: normalizeArray(financialData.marketAvailability),
                financialBackup: normalizeArray(financialData.financialBackup),
            };
            formData.append(
                'techFeasibility',
                new Blob([JSON.stringify(normalizedTechData)], { type: 'application/json' })
            );

            formData.append(
                'financialFeasibility',
                new Blob([JSON.stringify(normalizedFinancialData)], { type: 'application/json' })
            );               
            
            const approvalDocDto = selectedApprovals.map(approval => ({
                docId: approval.value,
                documentName: approval.docName,
                approved: approval.isApproved,
                comment: approval.comment
            }));
            approvalDocDto.forEach(approval => {
                console.log(approval.isApproved);
            })
            formData.append(
                'approvalDocDTO',
                new Blob([JSON.stringify(approvalDocDto)], { type: 'application/json' })
            );


            selectedApprovals.forEach(approval => {
                if (approval.file) {
                    formData.append(`approvalDoc[${approval.docName}]`, approval.file);
                }
            });

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/feasibility/add/${project.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success(response.data);
                setTimeout(()=>{
                    navigate(`/Dashboard/project/${project.id}`),2000
                })
                
            }
        } catch (error) {
            console.error(error);
            toast.error("Submission failed: " + (error?.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="project-feasibility">
            <div className="mt-3 mb-4 bg-white pb-4 rounded">
                <div className="row">
                    <p className="mt-3 text-start ms-3 fs-6 fw-bold mb-3">
                        Project Estimation Overview
                    </p>
                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mt-3 mb-3">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Floors /></span>Number 0f Floors</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{project.numberOfFloors}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Area /></span>Total Building Area</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{project.buildingArea}</p>
                        </div>
                    </div>

                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mb-3">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Cost /></span>Rate per Units</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{project.ratePerUnit}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><TotalCost /></span>Estimated Cost</p><br />
                            <p className='value fw-bold fs-6 ms-2'>$ {(project.estimatedValue / 1000000).toFixed(2)} M</p>
                        </div>
                    </div>
                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mb-3">
                    <div className="col-12">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Amenities /></span>Other Amenities</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{Array.isArray(project.otherAmenities) ? project.otherAmenities.join(', ') : project.otherAmenities}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Technical Feasibility</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select  text-start d-block">List of Approvals</label>
                        <Select options={approvalDocuments} placeholder="Select Unit of Measurements" className="w-100" classNamePrefix="select" isClearable isMulti
                            onChange={(selectedOptions) => {
                                const updated = selectedOptions.map(option => {
                                    const existing = selectedApprovals.find(a => a.value === option.value);
                                    return existing ? existing : {
                                        value: option.value,
                                        docName: option.label,
                                        isApproved: null,
                                        comment: '',
                                        file: null,
                                    };
                                });
                                setSelectedApprovals(updated);
                            }} />
                    </div>
                </div>
                {selectedApprovals.map((doc, index) => (
                    <div className='row align-items-center ms-4 me-4 mb-3' key={index}>
                        <div className='col-lg-3 col-md-3 text-start d-flex justify-content-between align-items-center'>
                            <div className='text-start fs-6 fw-bold' style={{ color: '#005197' }}>{doc.docName}</div>
                            <div>
                                <button className='btn action-button me-5' onClick={() => { document.getElementById(`file-input-${index}`).click() }}>
                                    Choose File
                                </button>
                                <input
                                    type="file"
                                    id={`file-input-${index}`}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(index, e)}
                                />
                            </div>
                        </div>
                        <div className='col-lg-6 col-md-6'>
                            <input
                                type="text"
                                className="form-input w-100"
                                placeholder='Comments'
                                value={doc.comment}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                            />
                        </div>
                        <div className='col-lg-3 col-md-3 d-flex justify-content-around'>
                            <div>
                                <input
                                    type="radio"
                                    className='form-check-input'
                                    value={true}
                                    checked={doc.isApproved === true}
                                    onChange={() => handleApprovalChange(index, true)}
                                /> <label>Approved</label>
                            </div>
                            <div>
                                <input
                                    type="radio"
                                    className='form-check-input'
                                    value={false}
                                    checked={doc.isApproved === false}
                                    onChange={() => handleApprovalChange(index, false)}
                                /> <label>Rejected</label>
                            </div>
                        </div>
                        {doc.file && (
                            <div className="col-lg-4 col-md-6 col-sm-12 mt-3 mb-3">
                                <div className="border rounded p-2 position-relative">
                                    <FaTimes
                                        size={16}
                                        className="position-absolute top-0 end-0 m-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRemoveFile(index)}
                                        color='red'
                                    />
                                    <div className="small">{doc.file.name}</div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-3">
                        <label className="projectform text-start d-block">Execution Capabilities</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Execution capabilities"
                            value={Array.isArray(technicalData.executionCapabilities) ? technicalData.executionCapabilities.join(', ') : technicalData.executionCapabilities}
                            onChange={(e) => setTechnicalData({ ...technicalData, executionCapabilities: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Financial Feasibility</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">Market Availability</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Market Availability"
                            value={Array.isArray(financialData.marketAvailability) ? financialData.marketAvailability.join(', ') : financialData.marketAvailability}
                            onChange={(e) => setFinancialData({ ...financialData, marketAvailability: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">Financial Backup</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Financial Backup"
                            value={financialData.financialBackup}
                            onChange={(e) => setFinancialData({ ...financialData, financialBackup: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row">
                    <span className="text-start fs-6 fw-bold mb-3" style={{ marginLeft: '40px' }}>
                        Return of Investment (ROI)
                    </span>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform  text-start d-block">Selling Cost</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Selling Cost"
                            value={financialData.sellingCost}
                            onChange={(e) => setFinancialData({ ...financialData, sellingCost: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Rental Cost</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Rental Cost"
                            value={financialData.rentalCost}
                            onChange={(e) => setFinancialData({ ...financialData, rentalCost: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-3">
                        <label className="projectform  text-start d-block">ROI in Years</label>
                        <input type="text" className="form-input w-100" placeholder="Years"
                            value={financialData.roiYear}
                            onChange={(e) => setFinancialData({ ...financialData, roiYear: e.target.value })}
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-3">
                        <label className="projectform   text-start d-block">Estimated Profit Percentage</label>
                        <input type="text" className="form-input w-100" placeholder="%"
                            value={financialData.profitPercentage}
                            onChange={(e) => setFinancialData({ ...financialData, profitPercentage: e.target.value })}
                        />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn cancel-button mt-2 ms-4" onClick={() => { setActiveTab('info') }}><span className="me-2"><ArrowLeft size={18} /></span>Previous</button>
                <button className="btn action-button mt-2 me-4" onClick={handleSubmit}>{loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : 'Submit'}</button>
            </div>
        </div>
    );

}
export default FeasibilityStudy;