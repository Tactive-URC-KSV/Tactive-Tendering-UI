import React, { useState, useRef } from 'react';
// Assuming icon imports from a popular library like 'lucide-react'
import { ArrowLeft, ArrowRight, Info, User2, Paperclip, X, Plus } from 'lucide-react';
// Assuming Flatpickr and react-select are installed and imported
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
// Assuming the calendar icon is from 'react-icons/fa'
import { FaCalendarAlt } from 'react-icons/fa';

// =========================================================================
// MOCK DATA AND UTILITY FUNCTIONS (NECESSARY FOR YOUR EXISTING CODE TO RUN)
// =========================================================================
const project = { projectName: 'Green Heights', projectCode: 'GH001' };

const scopeOptions = [
    { value: 'Scope A', label: 'Scope A' },
    { value: 'Scope B', label: 'Scope B' },
    { value: 'Scope C', label: 'Scope C' },
];

const getSelectedLeafBoqs = (tree) => [
    // Mocking selected BOQs to satisfy the render logic
    { id: 1, boqCode: 'B001', boqName: 'Upto 1.5m depth foundation work', uom: { uomCode: 'M3' }, quantity: 150.000 },
    { id: 2, boqCode: 'B002', boqName: 'From 1.5m to 3m depth excavation', uom: { uomCode: 'M3' }, quantity: 200.500 },
    { id: 3, boqCode: 'B003', boqName: 'From 3.1m to 4.5m depth wall construction', uom: { uomCode: 'SQM' }, quantity: 100.000 },
    { id: 4, boqCode: 'B004', boqName: 'From 4.6m to 6.0m depth piping', uom: { uomCode: 'LM' }, quantity: 50.000 },
];
const parentTree = {}; // Mock object for tree structure

// Mock handler functions used in your JSX
const handleRemoveSelectedBoqs = () => console.log('Removing selected BOQs');
const toggleRemovalSelection = (id) => console.log(`Toggling removal for BOQ ID: ${id}`);
const toggleSelection = (id) => console.log(`Toggling BOQ selection for ID: ${id}`);
const boqSelection = () => <div>BOQ Selection UI placeholder</div>;

// Mock Icon for BoxesIcon
const BoxesIcon = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>;

// Mock CSS classes for a basic visual representation
const customStyles = `
    .container-fluid { background-color: #f0f4f8; }
    .action-button { background-color: #005197; color: white; border: none; padding: 10px 20px; border-radius: 8px; }
    .cancel-button { background-color: transparent; color: #005197; border: 1px solid #005197; padding: 10px 20px; border-radius: 8px; }
    .form-input { border: 1px solid #ccc; padding: 8px; border-radius: 4px; box-sizing: border-box; }
    .calender-icon { position: absolute; right: 20px; top: 50%; transform: translateY(-50%); cursor: pointer; }
    .projectform { font-size: 14px; font-weight: 500; margin-bottom: 5px; }
    .projectform-select { font-size: 14px; font-weight: 500; margin-bottom: 5px; }
    .table-borderless td, .table-borderless th { border-bottom: 1px solid #e0e0e0; }
`;

// =========================================================================
// REUSABLE ATTACHMENT CARD COMPONENT
// =========================================================================

const AttachmentCard = ({ title, attachmentKey, currentAttachment, onChange }) => {
    const fileInputRef = useRef(null);
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            onChange(attachmentKey, 'file', file);
        }
    };
    
    // Icon for upload arrow, rotated from ArrowLeft
    const UploadIcon = (props) => <ArrowLeft {...props} style={{ transform: 'rotate(90deg)' }} />;

    return (
        <div className="col-md-6 col-lg-6 mb-4">
            <div className="p-4 rounded-3 d-flex flex-column align-items-center"
                 style={{ border: '2px dashed #0051973D', backgroundColor: '#F9FAFB' }}>
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                <div className="d-flex flex-column align-items-center mb-3" 
                     onClick={() => fileInputRef.current.click()} 
                     style={{ cursor: 'pointer', width: '100%' }}>

                    <div className="text-center rounded-circle p-2 mb-2" style={{ backgroundColor: '#DBEAFE' }}>
                        <UploadIcon size={20} color="#005197" />
                    </div>
                    <span className="fw-bold mb-1" style={{ color: '#005197' }}>{title}</span>
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                        Click to upload or drag and drop
                    </span>
                    {currentAttachment.file && (
                         <div className="mt-2 p-1 px-3 rounded-pill bg-success-subtle text-success" style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%' }}>
                            {currentAttachment.file.name}
                        </div>
                    )}
                </div>

                <div className="w-100 mt-2">
                    <textarea
                        className="form-control"
                        placeholder={`Additional notes for ${title.toLowerCase()}`}
                        rows="2"
                        value={currentAttachment.notes}
                        onChange={(e) => onChange(attachmentKey, 'notes', e.target.value)}
                        style={{ border: '1px solid #0051973D', fontSize: '14px' }}
                    />
                </div>
            </div>
        </div>
    );
}


// =========================================================================
// MAIN COMPONENT
// =========================================================================

const TFProcess = () => {
    // --- STATE INITIALIZATION (REQUIRED FOR YOUR CODE) ---
    const [currentTab, setCurrentTab] = useState('tender'); 
    const [tab, setTab] = useState('attachment'); // Set default to 'attachment' for visual check
    const [tenderDetail, setTenderDetail] = useState({
        bidOpeningDate: '',
        offerSubmissionDate: '',
        contactPerson: 'Raman',
        contactEmail: 'raman@tactived.com',
        contactMobile: '9876543210',
    });
    const [selectedBoq, setSelectedBoq] = useState(new Set(getSelectedLeafBoqs(parentTree).map(b => b.id)));
    const [boqForRemoval, setBoqForRemoval] = useState(new Set());
    const [selectedScopes, setSelectedScopes] = useState([]);
    const datePickerRef = useRef(null);

    // --- NEW ATTACHMENT STATE ---
    const [attachments, setAttachments] = useState({
        technicalSpecification: { file: null, notes: '' },
        drawings: { file: null, notes: '' },
        commercialConditions: { file: null, notes: '' },
        others: { file: null, notes: '' }
    });

    // --- HANDLERS ---
    const handleAttachmentChange = (key, type, value) => {
        setAttachments(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [type]: value
            }
        }));
    };

    const openCalendar = (id) => {
        if (datePickerRef.current && datePickerRef.current.flatpickr) {
            datePickerRef.current.flatpickr.open();
        }
    };
    
    // --- COMPONENT RENDER FUNCTIONS ---
    
    const generalDetails = () => {
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-3">
                    <Info size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">General Details</span>
                </div>
                <div className="row align-items-center ms-1 mt-4">
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
                            value={tenderDetail.offerSubmissionDate}
                            onChange={([date]) => setTenderDetail({ ...tenderDetail, offerSubmissionDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon' onClick={() => openCalendar('submissionLastDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Contact Person</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={tenderDetail.contactPerson}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Email</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={tenderDetail.contactEmail}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Contact Number</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
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
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
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
                 {/* Placeholder for Contractor Details UI */}
                <div className="py-5 text-center text-muted">Contractor Details Form Goes Here</div>
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
                
                <div className="row mt-5">
                    {/* Technical Specification Card */}
                    <AttachmentCard 
                        title="Technical Specification"
                        attachmentKey="technicalSpecification"
                        currentAttachment={attachments.technicalSpecification}
                        onChange={handleAttachmentChange}
                    />
                    
                    {/* Drawings Card */}
                    <AttachmentCard 
                        title="Drawings"
                        attachmentKey="drawings"
                        currentAttachment={attachments.drawings}
                        onChange={handleAttachmentChange}
                    />
                </div>
                
                <div className="row mt-3">
                    {/* Commercial Conditions Card */}
                    <AttachmentCard 
                        title="Commercial Conditions"
                        attachmentKey="commercialConditions"
                        currentAttachment={attachments.commercialConditions}
                        onChange={handleAttachmentChange}
                    />

                    {/* Others Card */}
                    <AttachmentCard 
                        title="Others"
                        attachmentKey="others"
                        currentAttachment={attachments.others}
                        onChange={handleAttachmentChange}
                    />
                </div>

                {/* "Previous" button - placed here as per the image for the last tab */}
                <div className="mt-5 text-start ms-1">
                    <button className="btn cancel-button" onClick={() => setTab('contractor')}>
                        <ArrowLeft size={18} /> <span className="ms-1">Previous</span>
                    </button>
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
                
                {/* Selected BOQ's Chips (Added to match the image structure) */}
                <div className="text-start ms-2 mb-4">
                    <span className="fw-bold d-block mb-2">Selected BOQ's</span>
                    <div className="d-flex flex-wrap gap-2">
                        {/* Mock BOQ chips to visually match the image */}
                        <div className="py-1 px-3 rounded-pill d-flex align-items-center" style={{ backgroundColor: '#DBEAFE', color: '#005197', fontSize: '14px' }}>
                            a - Upto 1.5m depth <X size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={() => {}} />
                        </div>
                        <div className="py-1 px-3 rounded-pill d-flex align-items-center" style={{ backgroundColor: '#DBEAFE', color: '#005197', fontSize: '14px' }}>
                            b - From 1.5m to 3m depth <X size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={() => {}} />
                        </div>
                        <div className="py-1 px-3 rounded-pill d-flex align-items-center" style={{ backgroundColor: '#DBEAFE', color: '#005197', fontSize: '14px' }}>
                            c - From 3.1m to 4.5m depth <X size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={() => {}} />
                        </div>
                        <div className="py-1 px-3 rounded-pill d-flex align-items-center" style={{ backgroundColor: '#DBEAFE', color: '#005197', fontSize: '14px' }}>
                            d - From 4.6m to 6.0m depth <X size={14} className="ms-2" style={{ cursor: 'pointer' }} onClick={() => {}} />
                        </div>
                    </div>
                </div>
                {/* End of Selected BOQ's Chips */}

                <div className="d-flex justify-content-start align-items-center ms-2 me-2 fw-bold" >
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
                <hr className='mt-0'/>

                {renderTab()}

                <div className="d-flex justify-content-end align-items-center ms-3 me-3 mt-4 mb-4">
                     {/* The next button is placed outside the component in the image's structure, 
                        but since you had the next button here previously, I'll update it to only show if not on 'attachment' 
                        to avoid conflict with the one at the very bottom, or if you need the navigation
                        handleNext button from the original code.

                        Since the image shows the 'Previous' button inside the attachment section, and 'Review & Confirm' outside, 
                        we should only show the 'Next' button here if it leads to the next *tab* within tenderDetails.
                    */}
                    {tab !== 'attachment' && (
                        <button className="btn action-button" onClick={handleNext}>
                            <ArrowRight size={18} /><span className="fw-bold ms-2">Next</span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const reviewTender = () => {
         return <div>Review and Float UI placeholder</div>;
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
             {/* Inject custom styles for appearance */}
            <style>{customStyles}</style>

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
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'boq' ? '#005197' : '#ccc'}`, borderRadius: '30px', color: `${currentTab === 'boq' ? 'white' : '#005197'}` }}>1</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'boq' ? '#005197' : '#ccc'}` }}>Select BOQ's</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#ccc'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#ccc'}`, borderRadius: '30px', color: `${currentTab === 'tender' || currentTab === 'review' ? 'white' : '#005197'}` }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#ccc'}` }}>Tender details</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : '#ccc'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : '#ccc'}`, borderRadius: '30px', color: `${currentTab === 'review' ? 'white' : '#005197'}` }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : '#ccc'}` }}>Review & Float</span>
                    </div>
                </div>
            </div>
            {renderContent()}
            <div className={`d-flex justify-content-${currentTab === 'boq' ? 'end' : 'between'} align-items-center mt-5 me-3 ms-3 mb-4`}>
                {currentTab !== 'boq' && <button className="btn cancel-button" onClick={handlePreviousTabChange}>Previous</button>}
                
                {currentTab === 'tender' && tab === 'attachment' ? (
                     <button className="btn action-button" onClick={handleNextTabChange}>
                        <span className="fw-bold me-2">Review & Confirm</span><ArrowRight size={18} />
                    </button>
                ) : (
                    <button className="btn action-button" disabled={selectedBoq.size === 0} onClick={handleNextTabChange}>
                        <span className="fw-bold me-2">Confirm & Proceed</span><ArrowRight size={18} />
                    </button>
                )}
               
            </div>
        </div>

    );
}
export default TFProcess;