import Select from 'react-select';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function FeasibilityStudy({ project, sectorId, setActiveTab }) {
    const [listOfApprovals, setListOfApprovals] = useState([]);
    const [selectedApprovals, setSelectedApprovals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [roiFields, setRoiFields] = useState([]);
    const [techFields, setTechFields] = useState([]);
    const [roiFieldValues, setRoiFieldValues] = useState({});
    const [financialData, setFinancialData] = useState({
        marketAvailability: '',
        financialBackup: '',
        expectedProfit: '',
        profitPercentage: '',
        roiYear: '',
        sellingCost: '',
        rentalCost: '',
    });
    const [technicalData, setTechnicalData] = useState({
        executionCapabilities: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const id = sectorId || project?.sectorId || project?.sector?.id;
        if (id) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/sector/fields/${id}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                }
            })
                .then(response => {
                    const fields = Array.isArray(response.data) ? response.data : response.data.data || [];

                    // Approvals (Documents Section)
                    const approvals = fields.filter(f => f.fieldSection === 'DOCUMENTS');
                    setListOfApprovals(approvals);

                    // ROI Fields
                    const roi = fields.filter(f => f.fieldSection === 'ROI');
                    setRoiFields(roi);

                    // Tech Fields (Project Estimation Overview)
                    const tech = fields.filter(f => f.fieldSection === 'TECH');
                    setTechFields(tech);

                    // Initialize ROI values if they exist in existing feasibility
                    // (Assuming we might want to pre-load them if editing, but for now just initialize)
                })
                .catch(error => {
                    console.error('Error fetching sector fields:', error);
                })
        }
    }, [sectorId, project?.sectorId, project?.sector?.id]);
    const approvalDocuments = listOfApprovals.map(approval => ({
        value: approval.id,
        label: approval.fieldName
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
        if (!financialData?.marketAvailability) {
            toast.error("Please enter market availability");
            return;
        }
        if (!financialData?.financialBackup) {
            toast.error("Please enter financial backup");
            return;
        }
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
                roiFields: roiFields.map(field => ({
                    roiFieldId: field.id,
                    value: roiFieldValues[field.id] || ""
                }))
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
                setTimeout(() => {
                    navigate(`/dashboard/project/${project.id}`), 2000
                })
            }
        } catch (error) {
            console.error(error);
            toast.error("Submission failed: " + (error?.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const isSubmitDisabled = () => {
        const isFinancialDataEmpty = Object.values(financialData).every(value => !value || value === '');
        const isRoiFieldsEmpty = Object.values(roiFieldValues).every(value => !value || value === '');
        const isTechnicalDataEmpty = Object.values(technicalData).every(value => !value || value === '');
        const isApprovalsEmpty = selectedApprovals.every(
            approval => !approval.comment && approval.isApproved === null && !approval.file
        );
        return isFinancialDataEmpty && isRoiFieldsEmpty && isTechnicalDataEmpty && isApprovalsEmpty;
    };

    return (
        <div className="project-feasibility">
            <div className="mt-3 mb-4 bg-white pb-4 rounded">
                <div className="row">
                    <p className="mt-3 text-start ms-3 fs-6 fw-bold mb-3">
                        Project Estimation Overview
                    </p>
                </div>
                {(() => {
                    // Build a lookup: fieldId -> value from project.techFields
                    const techValueMap = {};
                    if (Array.isArray(project.techFields)) {
                        project.techFields.forEach(tf => {
                            const fieldId = tf.techField?.id || tf.techFieldId;
                            if (fieldId) techValueMap[fieldId] = tf.value;
                        });
                    }

                    if (techFields.length === 0) {
                        return (
                            <div className="row ms-4 me-4 mb-3">
                                <div className="col-12 text-center text-muted py-3">
                                    No technical fields configured for this sector.
                                </div>
                            </div>
                        );
                    }

                    const rows = [];
                    for (let i = 0; i < techFields.length; i += 2) {
                        const left = techFields[i];
                        const right = techFields[i + 1];
                        rows.push(
                            <div className="row d-flex justify-content-around ms-4 me-4 mb-3" key={left.id}>
                                <div className="col-12 col-md-6 col-lg-6">
                                    <div className="estimation-container text-start w-100 p-1 px-1">
                                        <p className='report-feild fw-bold mb-2 mt-2 ms-2'>{left.fieldName}</p><br />
                                        <p className='value fw-bold fs-6 ms-2'>{techValueMap[left.id] ?? '—'}</p>
                                    </div>
                                </div>
                                {right && (
                                    <div className="col-12 col-md-6 col-lg-6">
                                        <div className="estimation-container text-start w-100 p-1 px-1">
                                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'>{right.fieldName}</p><br />
                                            <p className='value fw-bold fs-6 ms-2'>{techValueMap[right.id] ?? '—'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }
                    return rows;
                })()}
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Technical Feasibility</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">List of Approvals</label>
                        <Select
                            options={approvalDocuments}
                            placeholder="Select List of Approval Documents"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            isMulti
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
                            }}
                        />
                    </div>
                </div>
                {selectedApprovals.map((doc, index) => (
                    <div key={index}>
                        <div className='text-start fs-6 fw-bold mb-1' style={{ color: '#005197', marginLeft: '40px' }}>{doc.docName}</div>
                        <div className='row align-items-center ms-4 me-4 mb-3'>
                            <div className='col-lg-3 col-md-3 text-start d-flex align-items-center'>
                                <div>
                                    <button
                                        className='btn action-button btn-lg'
                                        onClick={() => { document.getElementById(`file-input-${index}`).click() }}
                                    >
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
                                    /> <label className='ms-2'>Approved</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        className='form-check-input'
                                        value={false}
                                        checked={doc.isApproved === false}
                                        onChange={() => handleApprovalChange(index, false)}
                                    /> <label className='ms-2'>Rejected</label>
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
                    </div>
                ))}
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-3">
                        <label className="projectform text-start d-block">Execution Capabilities</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter Execution capabilities"
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
                        <label className="projectform-select text-start d-block">Market Availability<span className='ms-1 text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter Market Availability"
                            value={Array.isArray(financialData.marketAvailability) ? financialData.marketAvailability.join(', ') : financialData.marketAvailability}
                            onChange={(e) => setFinancialData({ ...financialData, marketAvailability: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">Financial Backup<span className='ms-1 text-danger'>*</span></label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter Financial Backup"
                            value={financialData.financialBackup}
                            onChange={(e) => setFinancialData({ ...financialData, financialBackup: e.target.value })}
                        />
                    </div>
                </div>
                <div className="row">
                    <span className="text-start fs-6 fw-bold mb-3" style={{ marginLeft: '40px' }}>
                        Return on Investment (ROI)
                    </span>
                </div>
                {roiFields.length > 0 ? (
                    <div className="row align-items-center ms-4 me-4">
                        {roiFields.map((field, idx) => (
                            <div className="col-md-6 mt-3 mb-4" key={field.id}>
                                <label className="projectform text-start d-block">
                                    {field.fieldName}
                                    {field.mandatory && <span className="text-danger">*</span>}
                                </label>
                                <input
                                    type={field.fieldType === 'NUMBER' ? 'number' : 'text'}
                                    className="form-input w-100"
                                    placeholder={`Enter ${field.fieldName}`}
                                    value={roiFieldValues[field.id] || ""}
                                    onChange={(e) => setRoiFieldValues({ ...roiFieldValues, [field.id]: e.target.value })}
                                    onWheel={(e) => field.fieldType === 'NUMBER' && e.target.blur()}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="row align-items-center ms-4 me-4">
                        <div className="col-12 text-center text-muted py-3">
                            No ROI fields configured for this sector.
                        </div>
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn cancel-button mt-2 ms-4" onClick={() => { setActiveTab('info') }}>
                    <span className="me-2"><ArrowLeft size={18} /></span>Previous
                </button>
                <button
                    className="btn action-button mt-2 me-4"
                    onClick={handleSubmit}
                    disabled={isSubmitDisabled() || loading}
                >
                    {loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : 'Submit'}
                </button>
            </div>
        </div>
    );
}

export default FeasibilityStudy;