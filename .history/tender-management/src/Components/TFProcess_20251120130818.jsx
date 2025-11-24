import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Info, Package, Users, Paperclip } from 'react-feather';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// New Imports for Scope Selection
import Select from 'react-select'; 
import { useScope } from "../Context/ScopeContext"; 
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt, FaCloudUploadAlt, FaTimes } from 'react-icons/fa'; // Added icon imports
import '../CSS/custom-flatpickr.css'; // Assuming custom styles are needed

// Assuming the API base URL is defined elsewhere, or you'll define it here
// const API_BASE_URL = 'YOUR_API_BASE_URL';

// Placeholder components for the main steps
const BOQSelection = ({ selectedBoq, toggleBoqSelection }) => <div>BOQ Selection Component (Tree/List logic here)</div>;
const ReviewTender = ({ tenderDetail, selectedBoq }) => <div>Review & Float Component (Summary display here)</div>;


// Main Component
function TFProcess() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState('boq'); // 'boq', 'tender', 'review'
    const [selectedBoq, setSelectedBoq] = useState(new Set()); // Placeholder for selected BOQ IDs
    const [tab, setTab] = useState('general'); // 'general', 'package', 'contractor', 'attachment'
    const [isLoading, setIsLoading] = useState(false);
    
    // Placeholder state for Tender Details, matching fields from the image
    const [tenderDetail, setTenderDetail] = useState({
        tenderFloatingNo: 'TF-2025-431559', // Example Auto-generated
        tenderFloatingDate: new Date().toISOString().split('T')[0],
        projectName: 'Green Heights', // Example pre-filled
        offerSubmissionMode: '',
        bidOpeningDate: '',
        submissionLastDate: '',
        contactPerson: 'admin', // Example pre-filled
        contactNumber: '9876543210', // Example pre-filled
        contactEmail: 'admin@gmail.com', // Example pre-filled
        scopeOfWork: '',
        // THIS IS THE NEW STATE PROPERTY TO HOLD SELECTED SCOPE IDS
        scopeOfPackage: [], // Array of IDs for multi-select
        uploadedFiles: [], // For the attachment step
    });

    // Data and Options for Scope of Packages (from Context)
    const scopeOptions = useScope().map(scopes => ({
        value: scopes.id,
        label: scopes.scope,
    }));


    // --- Navigation Handlers for Main Steps (Progress Bar) ---
    const handleNextTabChange = () => {
        if (currentTab === 'boq' && selectedBoq.size > 0) {
            setCurrentTab('tender');
            setTab('general'); // Reset sub-tab
        } else if (currentTab === 'tender') {
            // Note: Add validation logic here before proceeding to review
            setCurrentTab('review');
        } else if (currentTab === 'review') {
            // Final submission logic goes here
            // floatTender();
        }
    };

    const handlePreviousTabChange = () => {
        if (currentTab === 'tender') {
            setCurrentTab('boq');
        } else if (currentTab === 'review') {
            setCurrentTab('tender');
            setTab('attachment'); // Go back to the last sub-tab of tender details
        }
    };

    // --- Navigation Handlers for Tender Details Sub-Tabs ---
    const handleNext = () => {
        if (tab === 'general') setTab('package');
        else if (tab === 'package') setTab('contractor');
        else if (tab === 'contractor') setTab('attachment');
        // If 'attachment', the main 'Confirm & Proceed' button handles moving to 'review'
    };

    const handlePrevious = () => {
        if (tab === 'package') setTab('general');
        else if (tab === 'contractor') setTab('package');
        else if (tab === 'attachment') setTab('contractor');
    };

    // Placeholder function for BOQ selection (if using the list/tree approach)
    const toggleBoqSelection = (boqId) => {
        setSelectedBoq(prev => {
            const newSet = new Set(prev);
            if (newSet.has(boqId)) {
                newSet.delete(boqId);
            } else {
                newSet.add(boqId);
            }
            return newSet;
        });
    };

    // Placeholder functions for Calendar
    const openCalendar = (id) => {
        const input = document.querySelector(`#${id}`);
        if (input && input._flatpickr) {
            input._flatpickr.open();
        }
    };

    // --- Content Renderers ---

    const generalDetails = () => {
        return (
            <div className="p-4">
                <div className="row align-items-center mb-4">
                    <span className="tab-info col-12 h-100 p-0 mb-3">General Details</span>
                </div>
                
                {/* Row 1: Tender No, Date, Project Name */}
                <div className="row align-items-center">
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Tender Floating No</label>
                        <input type="text" className="form-input w-100" value={tenderDetail.tenderFloatingNo} readOnly />
                    </div>
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Tender Floating Date</label>
                        <input type="text" className="form-input w-100" value={tenderDetail.tenderFloatingDate} readOnly />
                    </div>
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Project Name</label>
                        <input type="text" className="form-input w-100" value={tenderDetail.projectName} readOnly />
                    </div>
                </div>

                {/* Row 2: Submission Mode, Bid Opening, Submission Last Date */}
                <div className="row align-items-center">
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Offer Submission Mode</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Tender Floating No" 
                             value={tenderDetail.offerSubmissionMode}
                             onChange={(e) => setTenderDetail({...tenderDetail, offerSubmissionMode: e.target.value})}
                        />
                    </div>
                    <div className="col-md-4 mt-3 mb-4 position-relative">
                        <label className="projectform text-start d-block">Bid Opening Date</label>
                        <Flatpickr
                            id="bidOpeningDate"
                            className="form-input w-100"
                            placeholder="Select Bid opening date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.bidOpeningDate}
                            onChange={([date]) => setTenderDetail({...tenderDetail, bidOpeningDate: date})}
                        />
                        <span className='calender-icon' style={{ position: 'absolute', right: '15px', top: '70%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => openCalendar('bidOpeningDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                    <div className="col-md-4 mt-3 mb-4 position-relative">
                        <label className="projectform text-start d-block">Submission Last Date</label>
                        <Flatpickr
                            id="submissionLastDate"
                            className="form-input w-100"
                            placeholder="Select Submission Last date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={tenderDetail.submissionLastDate}
                            onChange={([date]) => setTenderDetail({...tenderDetail, submissionLastDate: date})}
                        />
                         <span className='calender-icon' style={{ position: 'absolute', right: '15px', top: '70%', transform: 'translateY(-50%)', cursor: 'pointer' }} onClick={() => openCalendar('submissionLastDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                </div>

                {/* Row 3: Contact Person, Email, Number */}
                <div className="row align-items-center">
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Contact Person</label>
                        <input type="text" className="form-input w-100" value={tenderDetail.contactPerson} readOnly />
                    </div>
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Contact Email</label>
                        <input type="text" className="form-input w-100" value={tenderDetail.contactEmail} readOnly />
                    </div>
                    <div className="col-md-4 mt-3 mb-4">
                        <label className="projectform text-start d-block">Contact Number</label>
                        <input type="text" className="form-input w-100" value={tenderDetail.contactNumber} readOnly />
                    </div>
                </div>

                {/* Row 4: Scope of Work, Scope of Package (New React-Select Field) */}
                <div className="row align-items-center">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform text-start d-block">Scope of Work</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Scope of Work" 
                             value={tenderDetail.scopeOfWork}
                             onChange={(e) => setTenderDetail({...tenderDetail, scopeOfWork: e.target.value})}
                        />
                    </div>
                    
                    {/* SCOPE OF PACKAGES INTEGRATION */}
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select text-start d-block">
                            Scope of Packages
                        </label>
                        <Select
                            options={scopeOptions}
                            placeholder="Select Scope of Packages"
                            isMulti
                            className="w-100"
                            classNamePrefix="select"
                            value={scopeOptions.filter(opt => 
                                tenderDetail.scopeOfPackage?.includes(opt.value)
                            )}
                            onChange={(option) =>
                                setTenderDetail({
                                    ...tenderDetail,
                                    scopeOfPackage: option ? option.map(o => o.value) : []
                                })
                            }
                        />
                    </div>
                    {/* END SCOPE OF PACKAGES INTEGRATION */}
                </div>

                {/* Internal Navigation Button */}
                <div className="d-flex justify-content-end align-items-center mt-5">
                    <button className="btn action-button" onClick={handleNext}>
                        <span className="fw-bold me-2">Next</span><ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const packageDetails = () => (
        <div className="p-4">
            <span className="tab-info col-12 h-100 p-0 mb-4">Package Details</span>
            {/* Placeholder for selected BOQs table */}
            <div className="alert alert-info">Summary of {selectedBoq.size} selected BOQ items will be displayed here.</div>
            <div className="d-flex justify-content-between align-items-center mt-5">
                <button className="btn cancel-button" onClick={handlePrevious}>Previous</button>
                <button className="btn action-button" onClick={handleNext}>
                    <span className="fw-bold me-2">Next</span><ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const contractorDetails = () => (
        <div className="p-4">
            <span className="tab-info col-12 h-100 p-0 mb-4">Contractor Details</span>
            <div className="alert alert-info">Contractor Selection logic goes here.</div>
            <div className="d-flex justify-content-between align-items-center mt-5">
                <button className="btn cancel-button" onClick={handlePrevious}>Previous</button>
                <button className="btn action-button" onClick={handleNext}>
                    <span className="fw-bold me-2">Next</span><ArrowRight size={18} />
                </button>
            </div>
        </div>
    );

    const attachmentDetails = () => (
        <div className="p-4">
            <span className="tab-info col-12 h-100 p-0 mb-4">Attachments</span>
            <div className="alert alert-info">Document upload and management goes here.</div>
            <div className="d-flex justify-content-start align-items-center mt-5">
                <button className="btn cancel-button" onClick={handlePrevious}>Previous</button>
            </div>
        </div>
    );


    const tenderDetails = () => {
        // Render sub-tabs based on 'tab' state
        const renderTabContent = () => {
            switch (tab) {
                case 'general': return generalDetails();
                case 'package': return packageDetails();
                case 'contractor': return contractorDetails();
                case 'attachment': return attachmentDetails();
                default: return generalDetails();
            }
        };

        return (
            <div className="mt-3 bg-white rounded-3" style={{ border: '0.5px solid #0051973D' }}>
                {/* SUB-TABS NAVIGATION */}
                <div className="d-flex justify-content-start align-items-center ms-2 me-2 fw-bold" style={{ marginBottom: '-1px' }}> {/* Adjusted to remove borderBottom, allowing active tab border to stand out */}
                    {/* General Details Tab */}
                    <div className="h-100 p-2 me-4 cursor-pointer" 
                         style={{ color: `${tab === 'general' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'general' ? '2px solid #005197' : 'none'}`, cursor: 'pointer' }} 
                         onClick={() => setTab('general')}>
                        <Info size={18} /> <span className="ms-1">General Details</span>
                    </div>

                    {/* Package Details Tab */}
                    <div className="h-100 p-2 me-4 cursor-pointer" 
                         style={{ color: `${tab === 'package' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'package' ? '2px solid #005197' : 'none'}`, cursor: 'pointer' }} 
                         onClick={() => setTab('package')}>
                        <Package size={18} /> <span className="ms-1">Package Details</span>
                    </div>

                    {/* Contractor Details Tab */}
                    <div className="h-100 p-2 me-4 cursor-pointer" 
                         style={{ color: `${tab === 'contractor' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'contractor' ? '2px solid #005197' : 'none'}`, cursor: 'pointer' }} 
                         onClick={() => setTab('contractor')}>
                        <Users size={18} /> <span className="ms-1">Contractor Details</span>
                    </div>

                    {/* Attachments Tab */}
                    <div className="h-100 p-2 me-4 cursor-pointer" 
                         style={{ color: `${tab === 'attachment' ? '#005197' : '#00000080'}`, borderBottom: `${tab === 'attachment' ? '2px solid #005197' : 'none'}`, cursor: 'pointer' }} 
                         onClick={() => setTab('attachment')}>
                        <Paperclip size={18} /> <span className="ms-1">Attachments</span>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid #0051973D' }}>
                    {renderTabContent()}
                </div>
            </div>
        );
    };


    const renderContent = () => {
        switch (currentTab) {
            case 'boq':
                return <BOQSelection selectedBoq={selectedBoq} toggleBoqSelection={toggleBoqSelection} />;
            case 'tender':
                return tenderDetails();
            case 'review':
                return <ReviewTender tenderDetail={tenderDetail} selectedBoq={selectedBoq} />;
            default:
                return <BOQSelection selectedBoq={selectedBoq} toggleBoqSelection={toggleBoqSelection} />;
        }
    };


    return (
        <div className="container-fluid">
            <div className="bg-white rounded p-4 mb-4">
                <h3 style={{ color: '#005197' }}>Tender Floating</h3>
                <p>Project: {tenderDetail.projectName}</p>
                <div className="Tender Floating Process mt-3 p-3 d-flex justify-content-between align-items-center">
                    {/* Step 1: Select BOQ's */}
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: '#005197', borderRadius: '30px', color: 'white' }}>1</span>
                        <span className="ms-2 fw-bold" style={{ color: '#005197' }}>Select BOQ's</span>
                    </div>
                    
                    {/* Connector 1 */}
                    <div className="rounded" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#C0C0C0'}`, height: '5px', width: '15%' }}></div>
                    
                    {/* Step 2: Tender details */}
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#C0C0C0'}`, borderRadius: '30px', color: 'white' }}>2</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'tender' || currentTab === 'review' ? '#005197' : '#C0C0C0'}` }}>Tender details</span>
                    </div>
                    
                    {/* Connector 2 */}
                    <div className="rounded" style={{ background: `${currentTab === 'review' ? '#005197' : '#C0C0C0'}`, height: '5px', width: '15%' }}></div>
                    
                    {/* Step 3: Review & Float */}
                    <div className="text-white">
                        <span className="py-2 px-3" style={{ background: `${currentTab === 'review' ? '#005197' : '#C0C0C0'}`, borderRadius: '30px', color: 'white' }}>3</span>
                        <span className="ms-2 fw-bold" style={{ color: `${currentTab === 'review' ? '#005197' : '#C0C0C0'}` }}>Review & Float</span>
                    </div>
                </div>
            </div>

            {renderContent()}

            {/* Global Footer Buttons */}
            <div className={`d-flex justify-content-${currentTab === 'boq' ? 'end' : 'between'} align-items-center mt-5 me-3 ms-3 mb-4`}>
                {currentTab !== 'boq' && currentTab !== 'review' && tab === 'general' && <button className="btn cancel-button" onClick={handlePreviousTabChange}>Previous</button>}
                {currentTab === 'review' && <button className="btn cancel-button" onClick={handlePreviousTabChange}>Previous</button>}
                
                {/* 'Confirm & Proceed' button logic */}
                {currentTab === 'boq' && (
                    <button className="btn action-button" disabled={selectedBoq.size === 0} onClick={handleNextTabChange}>
                        <span className="fw-bold me-2">Confirm & Proceed</span><ArrowRight size={18} />
                    </button>
                )}
                {currentTab === 'tender' && tab === 'attachment' && (
                    <button className="btn action-button" onClick={handleNextTabChange}>
                        <span className="fw-bold me-2">Confirm & Proceed</span><ArrowRight size={18} />
                    </button>
                )}
                {currentTab === 'review' && (
                    <button className="btn action-button" onClick={() => toast.success("Tender Floated Successfully!")}>
                        <span className="fw-bold me-2">Float Tender</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default TFProcess;