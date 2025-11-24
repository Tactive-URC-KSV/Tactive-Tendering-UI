import React, { useState, useRef } from 'react';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import { 
    FaCalendarAlt, 
    FaUpload, 
    FaTrash, 
    FaDownload 
} from 'react-icons/fa';
import { 
    ArrowLeft, 
    ArrowRight, 
    Info, 
    Paperclip, 
    User2, 
    X, 
    Plus,
    FileText,
    Boxes as BoxesIcon // Renamed to avoid clash if 'Boxes' is a different component
} from 'lucide-react';
import "flatpickr/dist/themes/material_blue.css"; // Example Flatpickr style

// --- Mock Data and Helper Functions (MUST BE DEFINED for the code to run) ---

// 1. Mock Data/State (In a real app, these would come from Redux, Context, or hooks)
const mockProject = {
    projectName: 'Smart City Infrastructure',
    projectCode: 'SCI-001'
};

const mockTenderDetail = {
    bidOpeningDate: new Date().toISOString().split('T')[0], // Today's date
    offerSubmissionDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], // 7 days later
    contactPerson: 'Arun Singh',
    contactEmail: 'arun.singh@example.com',
    contactMobile: '+91 98765 43210'
};

const mockScopeOptions = [
    { value: 'civil', label: 'Civil Works' },
    { value: 'electrical', label: 'Electrical Installation' },
    { value: 'plumbing', label: 'Plumbing & Drainage' },
    { value: 'landscaping', label: 'Landscaping' },
];

const mockSelectedBoqArray = [
    { id: 1, boqCode: 'BOQ-001', boqName: 'Cement Supply (Grade 43)', uom: { uomCode: 'MT' }, quantity: 150.000 },
    { id: 2, boqCode: 'BOQ-002', boqName: 'Steel Rebar (12mm dia)', uom: { uomCode: 'KG' }, quantity: 5000.500 },
    { id: 3, boqCode: 'BOQ-003', boqName: 'Standard Brick Masonry (230mm)', uom: { uomCode: 'SQM' }, quantity: 875.000 },
];

const mockAttachments = [
    { id: 1, name: 'Tender_Document_Part_A.pdf', size: '1.2MB', status: 'uploaded' },
    { id: 2, name: 'Technical_Specification.zip', size: '5.5MB', status: 'uploaded' },
];


// 2. Mock Helper Functions (Required to run the copied code)
const getSelectedLeafBoqs = (tree) => mockSelectedBoqArray; // Returns mock data for Package Details

const useMockState = () => {
    // Mimic the state hooks used in the provided code
    const [currentTab, setCurrentTab] = useState('boq'); // 'boq', 'tender', 'review'
    const [tab, setTab] = useState('general'); // 'general', 'package', 'contractor', 'attachment'
    const [tenderDetail, setTenderDetail] = useState(mockTenderDetail);
    const [selectedBoq, setSelectedBoq] = useState(new Set(mockSelectedBoqArray.map(b => b.id))); // Mimics selection state
    const [boqForRemoval, setBoqForRemoval] = useState(new Set());
    const [selectedScopes, setSelectedScopes] = useState(mockScopeOptions.map(o => o.value).slice(0, 2)); // Pre-select a few
    const [attachments, setAttachments] = useState(mockAttachments);
    
    // Refs
    const datePickerRef = useRef(null);

    // Helper functions used in the JSX
    const openCalendar = (id) => {
        // In a real implementation, you'd find the correct ref based on the ID and open it.
        if (datePickerRef.current) {
            // datePickerRef.current.flatpickr.open(); 
            console.log(`Opening calendar for: ${id}`);
        }
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

    const handleRemoveSelectedBoqs = () => {
        console.log("Removing BOQs with IDs:", Array.from(boqForRemoval));
        // In a real app, this would filter the selectedBoqArray state
        setBoqForRemoval(new Set()); // Clear selection after mock removal
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newAttachment = {
                id: Date.now(),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
                status: 'uploaded',
                fileObject: file // Store the actual file object if needed for upload
            };
            setAttachments(prev => [...prev, newAttachment]);
            console.log("File uploaded:", file.name);
        }
    };

    const handleRemoveAttachment = (id) => {
        setAttachments(prev => prev.filter(att => att.id !== id));
        console.log("Attachment removed:", id);
    };

    return {
        // State
        currentTab, setCurrentTab,
        tab, setTab,
        tenderDetail, setTenderDetail,
        project: mockProject,
        parentTree: {}, // Mock
        selectedBoq, // Used for disabling main Next button
        boqForRemoval, setBoqForRemoval,
        scopeOptions: mockScopeOptions,
        selectedScopes, setSelectedScopes,
        attachments, setAttachments,

        // Handlers/Refs
        datePickerRef,
        openCalendar,
        toggleRemovalSelection,
        handleRemoveSelectedBoqs,
        handleFileUpload,
        handleRemoveAttachment
    };
}


const TFProcess = () => {
    // Destructure all the necessary state and handlers from the mock state hook
    const {
        currentTab, setCurrentTab,
        tab, setTab,
        tenderDetail, setTenderDetail,
        project,
        parentTree,
        selectedBoq,
        boqForRemoval, setBoqForRemoval,
        scopeOptions,
        selectedScopes, setSelectedScopes,
        attachments, setAttachments,
        datePickerRef,
        openCalendar,
        toggleRemovalSelection,
        handleRemoveSelectedBoqs,
        handleFileUpload,
        handleRemoveAttachment
    } = useMockState();


    // --- 1. General Details Tab Content ---
    const generalDetails = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <Info size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">General Details</span>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-4">
                    {/* Bid Opening Date */}
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
                    {/* Submission Last Date */}
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Submission Last Date</label>
                        <Flatpickr
                            id="submissionLastDate"
                            className="form-input w-100"
                            placeholder="dd - mm - yyyy"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.offerSubmissionDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, offerSubmissionDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon' onClick={() => openCalendar('submissionLastDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    {/* Contact Person */}
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Contact Person</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Contact Person Name"
                            value={tenderDetail.contactPerson}
                            readOnly
                        />
                    </div>
                    {/* Contact Email */}
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Email</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Contact Email"
                            value={tenderDetail.contactEmail}
                            readOnly
                        />
                    </div>
                    {/* Contact Number */}
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Number</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Contact Number"
                            value={tenderDetail.contactMobile}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-1 mt-5">
                    {/* Scope of Package */}
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
                    {/* Scope of Work */}
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Scope of Work</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Scope of Work description"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // --- 2. Package Details Tab Content (Provided by user) ---
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

    // --- 3. Contractor Details Tab Content (Provided by user) ---
    const contractorDetails = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <User2 size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">Contractor Details</span>
                </div>
                {/* Add actual Contractor Details form/table here */}
                <div className='ms-1 mt-4 text-muted'>[Form fields for contractor selection/details would go here]</div>
            </div>
        );
    }

    // --- 4. Attachment Tab Content (Reconstructed to be functional) ---
    const attachmentDetails = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <Paperclip size={20} color="#2BA95A" />
                        <span className="ms-2 fw-bold">Attachments</span>
                    </div>
                    {/* File Upload Button */}
                    <label htmlFor="file-upload" className="btn btn-sm" style={{ backgroundColor: '#005197', color: 'white', cursor: 'pointer' }}>
                        <FaUpload size={14} className="me-2" />
                        <span className="fw-medium">Upload Document</span>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            multiple={true}
                        />
                    </label>
                </div>

                {/* Attachments Table */}
                <div className="table table-responsive mt-4">
                    <table className="table table-striped">
                        <thead style={{ color: '#005197' }}>
                            <tr>
                                <th>#</th>
                                <th>File Name</th>
                                <th>Size</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attachments.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center text-muted py-4">No attachments uploaded.</td>
                                </tr>
                            ) : (
                                attachments.map((att, index) => (
                                    <tr key={att.id}>
                                        <td>{index + 1}</td>
                                        <td><FileText size={16} className="me-2" />{att.name}</td>
                                        <td>{att.size}</td>
                                        <td>
                                            <button className="btn btn-sm me-2" title="Download" style={{ color: '#005197' }}>
                                                <FaDownload size={14} />
                                            </button>
                                            <button className="btn btn-sm" title="Remove" onClick={() => handleRemoveAttachment(att.id)} style={{ color: '#dc3545' }}>
                                                <FaTrash size={14} />
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

    // --- Tender Details (Tab Logic - Provided by user) ---
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

                {/* Tabs Navigation */}
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

                {/* Tab Content */}
                {renderTab()}

                {/* Tab Navigation Buttons */}
                <div className="d-flex justify-content-between align-items-center ms-3 me-3 mt-4 mb-4">
                    <button className="btn cancel-button" disabled={tab === 'general'} onClick={handlePrevious}>Previous</button>
                    <button className="btn action-button" disabled={tab === 'attachment'} onClick={handleNext}><ArrowRight size={18} /><span className="fw-bold ms-2">Next</span></button>
                </div>
            </div>
        );
    }

    // --- Main Steps Content (Missing parts reconstructed) ---

    // 1. BOQ Selection Step
    const boqSelection = () => {
        return (
            <div className="bg-white ms-3 me-3 rounded-3 p-3 mt-5" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start ms-1 mt-3">
                    <BoxesIcon size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">BOQ Selection</span>
                </div>
                <div className='ms-1 mt-4 text-muted'>
                    [Component for rendering the BOQ selection tree/list and managing the 
                     <span className='fw-bold'> 'selectedBoq' </span> state would go here.]
                </div>
            </div>
        );
    }

    // 3. Review & Float Step
    const reviewTender = () => {
        return (
            <div className="bg-white ms-3 me-3 rounded-3 p-3 mt-5" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start ms-1 mt-3">
                    <Info size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">Review & Float Tender</span>
                </div>
                <div className='ms-1 mt-4 text-muted'>
                    [Summary of all collected details (General, Package, Contractor, Attachment) for final review and a 'Float Tender' button would go here.]
                </div>
            </div>
        );
    }


    // --- Main Logic (Provided by user) ---

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

    // --- Final Render (Provided by user) ---
    return (
        <div className='container-fluid min-vh-100'>
            {/* Header / Back Button */}
            <div className="d-flex justify-content-between align-items-center text-start fw-bold ms-3 mt-2 mb-3">
                <div className="ms-3">
                    <ArrowLeft size={20} onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <span className='ms-2'>Tender Floating</span>
                    <span className='ms-2'>-</span>
                    <span className="fw-bold text-start ms-2">{project?.projectName + '(' + project?.projectCode + ')' || 'No Project'}</span>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="bg-white rounded-3 ms-3 me-3 p-3 mt-4 mb-3" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold ms-2 mb-2">Tender Floating Process</div>
                <div className="d-flex align-items-center justify-content-between mt-3 p-3">
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: '#005197', borderRadius: '30px' }}>1</span>
                        <span className="ms-2 fw-bold" style={{ color: '#005197' }}>Select BOQ's</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#0051973D'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#0051973D'}`, borderRadius: '30px' }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#00000080'}` }}>Tender details</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : '#0051973D'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : '#0051973D'}`, borderRadius: '30px' }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : '#00000080'}` }}>Review & Float</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area (Based on currentTab) */}
            {renderContent()}

            {/* Main