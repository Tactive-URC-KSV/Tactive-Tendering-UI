import React, { useState, useEffect } from 'react';
// Assuming the necessary imports for icons and components are here
// Example: import { Paperclip, BoxesIcon, User2, Info, Plus, X, ArrowRight, ArrowLeft } from 'lucide-react';
// Example: import Select from 'react-select';

const TFProcess = ({ tenderDetail, setTenderDetail, attachmentFiles, setAttachmentFiles, removeAttachment, ...props }) => {
    // --- State and Context variables assumed from original code ---
    // const [currentTab, setCurrentTab] = useState('boq');
    // const [tab, setTab] = useState('general');
    // const [selectedScopes, setSelectedScopes] = useState([]);
    // const [boqForRemoval, setBoqForRemoval] = useState(new Set());
    // ... other states like project, parentTree, selectedBoq, scopeOptions, etc.

    // Mock functions/data for completeness (replace with actual state/props)
    const [currentTab, setCurrentTab] = useState('boq');
    const [tab, setTab] = useState('general');
    const [selectedScopes, setSelectedScopes] = useState([]);
    const [boqForRemoval, setBoqForRemoval] = useState(new Set());
    const [selectedBoq, setSelectedBoq] = useState(new Set([1, 2])); // Mock selected BOQ
    const [parentTree, setParentTree] = useState([]); // Mock BOQ structure
    const [project, setProject] = useState({ projectName: 'Building Project', projectCode: 'BP-2025' });

    // Mock API/State data
    const [mockTenderDetail, setMockTenderDetail] = useState({
        contactEmail: 'contact@example.com',
        contactMobile: '1234567890',
    });
    const tenderDetailMock = tenderDetail || mockTenderDetail; // Use prop or mock
    const setTenderDetailMock = setTenderDetail || setMockTenderDetail;

    const [mockAttachmentFiles, setMockAttachmentFiles] = useState([
        { id: 1, name: 'Tender_Specs_2025.pdf', size: '1.2 MB' },
        { id: 2, name: 'Architectural_Drawings.zip', size: '15.5 MB' },
    ]);
    const attachmentFilesMock = attachmentFiles || mockAttachmentFiles;
    const setAttachmentFilesMock = setAttachmentFiles || setMockAttachmentFiles;

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newFiles = files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            file: file
        }));
        setAttachmentFilesMock(prev => [...prev, ...newFiles]);
    };

    const removeAttachmentMock = (id) => {
        setAttachmentFilesMock(prev => prev.filter(file => file.id !== id));
    };

    const getSelectedLeafBoqs = () => {
        // Mock function to return selected BOQs
        return [
            { id: 1, boqCode: 'B001', boqName: 'Concrete Slab Work', uom: { uomCode: 'M3' }, quantity: 150.5 },
            { id: 2, boqCode: 'B002', boqName: 'Steel Rebar Supply and Installation', uom: { uomCode: 'KG' }, quantity: 5000.0 },
        ].filter(boq => selectedBoq.has(boq.id));
    };

    const handleRemoveSelectedBoqs = () => {
        // Mock removal logic
        setSelectedBoq(prev => {
            const newSet = new Set(prev);
            boqForRemoval.forEach(id => newSet.delete(id));
            return newSet;
        });
        setBoqForRemoval(new Set());
    };

    const toggleRemovalSelection = (id) => {
        setBoqForRemoval(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // --- Component Logic ---

    const generalDetails = () => {
        // Assuming Select and other necessary props/options are defined
        const scopeOptions = [
            { value: 'civil', label: 'Civil Works' },
            { value: 'mech', label: 'Mechanical' },
            { value: 'elec', label: 'Electrical' },
        ];
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <Info size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">General Details</span>
                </div>
                <div className="row align-items-center ms-1 mt-4">
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Email</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={tenderDetailMock.contactEmail}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Number</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={tenderDetailMock.contactMobile}
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
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                        // Add onChange handler here if this field needs to update state
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
                {/* Contractor selection/list implementation goes here */}
            </div>
        );
    }

    const attachmentDetails = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <Paperclip size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">Attachment</span>
                </div>

                <div className="row align-items-center ms-1 mt-4">
                    <div className="col-12">
                        <label className="btn btn-sm" style={{ backgroundColor: '#005197', color: 'white', cursor: 'pointer' }}>
                            <Plus size={18} /> <span className="fw-medium ms-1">Upload File</span>
                            <input
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                multiple
                            />
                        </label>
                        <span className="ms-3 text-muted" style={{ fontSize: '14px' }}>
                            Supported formats: PDF, DOC, DOCX, ZIP, JPG, PNG. Max size: 20MB.
                        </span>
                    </div>
                </div>

                <div className="table table-responsive mt-4">
                    <table className="table table-borderless">
                        <thead style={{ color: '#005197' }}>
                            <tr>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attachmentFilesMock.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted py-4">No attachments uploaded.</td>
                                </tr>
                            ) : (
                                attachmentFilesMock.map((file) => (
                                    <tr key={file.id}>
                                        <td>{file.name}</td>
                                        <td>{file.size}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm"
                                                style={{ color: '#dc3545', border: 'none', padding: 0 }}
                                                onClick={() => removeAttachmentMock(file.id)}
                                            >
                                                <X size={16} /> Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

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

    const reviewTender = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <span className="ms-2 fw-bold">Review & Float</span>
                </div>
                {/* Review summary implementation goes here */}
            </div>
        );
    }

    // Assuming boqSelection function exists as provided in the context
    const boqSelection = () => {
        return (
            <div className="p-2">
                {/* BOQ selection tree component implementation goes here */}
            </div>
        );
    }

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
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'boq' ? '#005197' : '#00000080'}`, borderRadius: '30px' }}>1</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'boq' ? '#005197' : '#00000080'}` }}>Select BOQ's</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000080'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000080'}`, borderRadius: '30px' }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000080'}` }}>Tender details</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : '#00000080'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : '#00000080'}`, borderRadius: '30px' }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : '#00000080'}` }}>Review & Float</span>
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
// export default TFProcess; // Uncomment this line if this is a standalone file