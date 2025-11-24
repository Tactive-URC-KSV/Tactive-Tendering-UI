import React, { useState, useRef } from 'react';
// Assuming you are using an icon library like lucide-react or react-icons/fa
// I'll use simple functional components for the icons for demonstration purity
const Info = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const FaCalendarAlt = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const BoxesIcon = Info; // Placeholder for BoxesIcon
const User2 = Info;     // Placeholder for User2
const Paperclip = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>;
const ArrowUp = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const ArrowRight = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const ArrowLeft = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>;
const Plus = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const X = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;


// Placeholder components for external libraries
const Select = (props) => {
    const selectedOption = Array.isArray(props.value) ? props.value : (props.value ? [props.value] : []);
    const placeholder = selectedOption.length > 0 ? selectedOption.map(o => o.label).join(', ') : props.placeholder;
    return (
        <div className="custom-select-placeholder" style={{ border: '1px solid #ccc', padding: '5px', borderRadius: '4px' }}>
            {placeholder}
        </div>
    );
};

const Flatpickr = ({ id, className, placeholder, value, onChange }) => (
    <input 
        id={id}
        type="text" 
        className={className} 
        placeholder={placeholder} 
        value={value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' - ') : ''} // Format dummy date
        readOnly
        onClick={() => alert(`Opening calendar for ${id}`)}
    />
);


const TFProcess = () => {
    // === STATE AND REFS (Crucial additions) ===
    // 1. Top-level process flow
    const [currentTab, setCurrentTab] = useState('tender'); // Initialized to 'tender' to view nested tabs
    // 2. Nested tab flow inside 'tenderDetails'
    const [tab, setTab] = useState('attachment'); // Initialized to 'attachment' to show the target page
    
    // 3. Data State inferred from usage
    const [tenderDetail, setTenderDetail] = useState({ 
        tenderFloatingNo: 'TNDR-001', 
        tenderFloatingDate: '2025-11-20', 
        offerSubmissionMode: 'online', 
        bidOpeningDate: '2025-11-25', 
        offerSubmissionDate: '2025-11-24',
        contactPerson: 'Jane Doe',
        contactEmail: 'jane.doe@example.com',
        contactMobile: '555-1234'
    });
    const [project, setProject] = useState({ 
        projectName: 'Smart City Infrastructure', 
        projectCode: 'SCI-2025' 
    });
    const scopeOptions = [
        { value: 'civil', label: 'Civil Works' },
        { value: 'electrical', label: 'Electrical Installation' },
        { value: 'plumbing', label: 'Plumbing & Drainage' }
    ];
    const [selectedScopes, setSelectedScopes] = useState(['civil']);
    const [boqForRemoval, setBoqForRemoval] = useState(new Set()); // IDs to remove
    const [selectedBoq] = useState(new Set([1, 2])); // Main BOQ selection
    const datePickerRef = useRef(null);

    // === DUMMY DATA/FUNCTIONS (Needed for the existing code logic) ===
    const dummyBoqArray = [
        { id: 1, boqCode: 'C001', boqName: 'Concrete Paving Slab Installation', uom: { uomCode: 'SQM' }, quantity: 1200.50 },
        { id: 2, boqCode: 'E105', boqName: 'High Voltage Transformer Mounting and Wiring', uom: { uomCode: 'NO' }, quantity: 5 },
    ];
    
    // Dummy function to satisfy tenderDetails call
    const getSelectedLeafBoqs = (parentTree) => dummyBoqArray;
    
    // Dummy functions to satisfy packageDetails calls
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
        console.log("Removing BOQs:", Array.from(boqForRemoval));
        setBoqForRemoval(new Set());
    };
    const boqSelection = () => <div>BOQ Selection Component Here</div>; // Dummy component
    const reviewTender = () => <div>Review & Float Component Here</div>; // Dummy component

    // === EXISTING FUNCTION DEFINITIONS ===

    const openCalendar = (id) => {
        const input = document.querySelector(`#${id}`);
        // Note: In a real environment, you'd need the Flatpickr instance here.
        // Since we are mocking the environment, this is just to show the intent.
        if (input) {
             alert(`Calendar opened for ${id}`);
        }
    };

    const generalDetails = () => {
        // ... (General Details JSX) ...
        return (
            <div className="p-2">
                <div className="text-start ms-1 mt-4">
                    <Info size={20} color="#2BA95A" />
                    <span className="ms-2 fw-bold">General Details</span>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4 ">
                        <label className="projectform text-start d-block">Tender Floating No </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={tenderDetail.tenderFloatingNo}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Tender Floating Date </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={new Date(tenderDetail.tenderFloatingDate).toLocaleDateString('en-GB')}
                            readOnly
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Project Name </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No"
                            value={project.projectName}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row align-items-center justify-content-between ms-1 mt-5">
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform-select text-start d-block">Offer Submission Mode</label>
                        <Select
                            options={[
                                { value: 'online', label: 'Online' },
                                { value: 'offline', label: 'Offline' }
                            ]}
                            placeholder="Select Mode"
                            className="w-100"
                            classNamePrefix="select"
                            value={
                                tenderDetail.offerSubmissionMode
                                    ? [{ value: tenderDetail.offerSubmissionMode, label: tenderDetail.offerSubmissionMode.charAt(0).toUpperCase() + tenderDetail.offerSubmissionMode.slice(1) }]
                                    : null
                            }
                            onChange={(selected) =>
                                setTenderDetail({
                                    ...tenderDetail,
                                    offerSubmissionMode: selected ? selected.value : ''
                                })
                            }
                            isClearable
                        />
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Bid Opening Date</label>
                        <div style={{ position: 'relative' }}>
                            <Flatpickr
                                id="bidOpeningDate"
                                className="form-input w-100"
                                placeholder="dd - mm - yyyy"
                                options={{ dateFormat: "d-m-Y" }}
                                value={tenderDetail.bidOpeningDate}
                                onChange={([date]) => setTenderDetail({ ...tenderDetail, bidOpeningDate: date })}
                                ref={datePickerRef}
                            />
                            <span className='calender-icon' onClick={() => openCalendar('bidOpeningDate')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}><FaCalendarAlt size={18} color='#005197' /></span>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4">
                        <label className="projectform text-start d-block">Submission Last Date</label>
                        <div style={{ position: 'relative' }}>
                            <Flatpickr
                                id="submissionLastDate"
                                className="form-input w-100"
                                placeholder="dd - mm - yyyy"
                                options={{ dateFormat: "d-m-Y" }}
                                value={tenderDetail.offerSubmissionDate}
                                onChange={([date]) => setTenderDetail({ ...tenderDetail, offerSubmissionDate: date })}
                                ref={datePickerRef}
                            />
                            <span className='calender-icon' onClick={() => openCalendar('submissionLastDate')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}><FaCalendarAlt size={18} color='#005197' /></span>
                        </div>
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
                <div className="ms-2 mt-3 text-muted">Contractor Details Form content goes here...</div>
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

                {/* Attachment Upload Boxes Layout */}
                <div className="row justify-content-start ms-1 mt-4 gap-4">
                    
                    {/* Technical Specification */}
                    <div className="col-md-5 col-lg-5 p-3" style={{ border: '1px dotted #ccc', borderRadius: '8px' }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-4">
                            <ArrowUp size={30} color="#005197" />
                            <span className="fw-bold mt-2">Technical Specification</span>
                            <span className="text-muted mt-1" style={{ fontSize: '12px' }}>Click to upload or drag and drop</span>
                        </div>
                        <label className="projectform text-start d-block mt-3">Additional notes for technical specification</label>
                        <textarea rows="2" className="form-input w-100" style={{border: '1px solid #ccc', width: '100%', padding: '5px'}}></textarea>
                    </div>

                    {/* Drawings */}
                    <div className="col-md-5 col-lg-5 p-3" style={{ border: '1px dotted #ccc', borderRadius: '8px' }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-4">
                            <ArrowUp size={30} color="#005197" />
                            <span className="fw-bold mt-2">Drawings</span>
                            <span className="text-muted mt-1" style={{ fontSize: '12px' }}>Click to upload or drag and drop</span>
                        </div>
                        <label className="projectform text-start d-block mt-3">Additional notes for Drawings</label>
                        <textarea rows="2" className="form-input w-100" style={{border: '1px solid #ccc', width: '100%', padding: '5px'}}></textarea>
                    </div>
                </div>

                <div className="row justify-content-start ms-1 mt-4 gap-4">
                    
                    {/* Commercial Conditions */}
                    <div className="col-md-5 col-lg-5 p-3" style={{ border: '1px dotted #ccc', borderRadius: '8px' }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-4">
                            <ArrowUp size={30} color="#005197" />
                            <span className="fw-bold mt-2">Commercial Conditions</span>
                            <span className="text-muted mt-1" style={{ fontSize: '12px' }}>Click to upload or drag and drop</span>
                        </div>
                        <label className="projectform text-start d-block mt-3">Additional notes for Commercial Conditions</label>
                        <textarea rows="2" className="form-input w-100" style={{border: '1px solid #ccc', width: '100%', padding: '5px'}}></textarea>
                    </div>

                    {/* Others */}
                    <div className="col-md-5 col-lg-5 p-3" style={{ border: '1px dotted #ccc', borderRadius: '8px' }}>
                        <div className="d-flex flex-column align-items-center justify-content-center py-4">
                            <ArrowUp size={30} color="#005197" />
                            <span className="fw-bold mt-2">Others</span>
                            <span className="text-muted mt-1" style={{ fontSize: '12px' }}>Click to upload or drag and drop</span>
                        </div>
                        <label className="projectform text-start d-block mt-3">Additional notes for others</label>
                        <textarea rows="2" className="form-input w-100" style={{border: '1px solid #ccc', width: '100%', padding: '5px'}}></textarea>
                    </div>
                </div>
            </div>
        );
    }

    const tenderDetails = () => {
        const selectedBoqArray = getSelectedLeafBoqs(null); // passing null for dummy parentTree

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

        const tabIndicatorStyle = (tabName) => {
            return {
                borderBottom: `2px solid ${tab === tabName ? '#005197' : 'transparent'}`,
                paddingBottom: '5px',
                cursor: 'pointer',
                color: tab === tabName ? '#005197' : '#6c757d',
                fontWeight: tab === tabName ? 'bold' : 'normal'
            };
        };


        return (
            <div className="bg-white ms-3 me-3 rounded-3 p-3 mt-5" style={{ border: '1px solid #0051973D' }}>
                 {/* Tab Header Section (Added from context/assumption) */}
                <div className="d-flex justify-content-around p-3 border-bottom">
                    <span style={tabIndicatorStyle('general')} onClick={() => setTab('general')}>General Details</span>
                    <span style={tabIndicatorStyle('package')} onClick={() => setTab('package')}>Package Details</span>
                    <span style={tabIndicatorStyle('contractor')} onClick={() => setTab('contractor')}>Contractor Details</span>
                    <span style={tabIndicatorStyle('attachment')} onClick={() => setTab('attachment')}>Attachment</span>
                </div>
                
                {renderTab()}
                
                <div className="d-flex justify-content-between align-items-center ms-3 me-3 mt-4 mb-4">
                    <button className="btn cancel-button" disabled={tab === 'general'} onClick={handlePrevious} style={{padding: '8px 15px', border: '1px solid #005197', color: '#005197'}}>Previous</button>

                    {tab === 'attachment' ? (
                        // On the LAST nested tab ('attachment'), the 'Next' button becomes 'Review & Confirm'
                        // and should trigger the NEXT MAIN step.
                        <button 
                            className="btn action-button" 
                            onClick={handleNextTabChange} // This function moves currentTab to 'review'
                            style={{padding: '8px 15px', backgroundColor: '#005197', color: 'white'}}
                        >
                            <span className="fw-bold me-2">Review & Confirm</span>
                            <ArrowRight size={18} />
                        </button>
                    ) : (
                        // On all other nested tabs, the button is 'Next' and moves to the NEXT NESTED step.
                        <button 
                            className="btn action-button" 
                            onClick={handleNext} 
                            style={{padding: '8px 15px', backgroundColor: '#005197', color: 'white'}}
                        >
                            <ArrowRight size={18} />
                            <span className="fw-bold ms-2">Next</span>
                        </button>
                    )}
                </div>
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

    // === MAIN COMPONENT RENDER ===
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
                        <span className="py-2 px-3" style={{ background: '#005197', borderRadius: '30px' }}>1</span>
                        <span className="ms-2 fw-bold" style={{ color: '#005197' }}>Select BOQ's</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#ccc'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#ccc'}`, borderRadius: '30px', color: currentTab === 'tender' || currentTab === 'review' ? 'white' : 'black' }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#ccc'}` }}>Tender details</span>
                    </div>
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : '#ccc'}`, height: '5px', width: '15%' }}></div>
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : '#ccc'}`, borderRadius: '30px', color: currentTab === 'review' ? 'white' : 'black' }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : '#ccc'}` }}>Review & Float</span>
                    </div>
                </div>
            </div>
            {renderContent()}
            <div className={`d-flex justify-content-${currentTab === 'boq' ? 'end' : 'between'} align-items-center mt-5 me-3 ms-3 mb-4`}>
                {currentTab !== 'boq' && <button className="btn cancel-button" onClick={handlePreviousTabChange} style={{padding: '8px 15px', border: '1px solid #005197', color: '#005197'}}>Previous</button>}
                {/* Note: The main 'Confirm & Proceed' button logic needs adjustment based on your full application state, 
                   but the 'disabled' condition based on selectedBoq size is kept as is. */}
                <button 
                    className="btn action-button" 
                    disabled={selectedBoq.size === 0} 
                    onClick={handleNextTabChange}
                    style={{padding: '8px 15px', backgroundColor: '#005197', color: 'white'}}
                >
                    <span className="fw-bold me-2">Confirm & Proceed</span>
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>

    );
}
export default TFProcess;