import { Filter, List, Plus, Grid } from "lucide-react"; 
import '../CSS/Styles.css';
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the primary color (assuming it's defined in your styles or globally)
const bluePrimary = "#005197"; 

// 1. Define entityTypeOptions
const entityTypeOptions = [
    { value: 'contractor', label: 'Contractor' },
    { value: 'design_consultant', label: 'Design Consultant' },
    { value: 'pmc_consultant', label: 'PMC Consultant' },
];

function Contractor() {
    const [isListView, setIsListView] = useState(true);
    const navigate = useNavigate();
    
    // State to manage the selected Entity Type filter
    const [selectedEntityType, setSelectedEntityType] = useState(null);

    // === NEW STATE FOR SORT/FILTER DROPDOWN ===
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    
    // State to manage the selected sort/filter options
    const [selectedFilters, setSelectedFilters] = useState({
        status: { Verified: false, Pending: false },
        grade: { 'A Grade': false, 'B Grade': false },
    });

    // Toggle the visibility of the custom dropdown
    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(prev => !prev);
    };

    // Handler for the checkbox filters
    const handleFilterChange = (category, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [value]: !prev[category][value],
            }
        }));
    };
    // === END OF NEW STATE FOR SORT/FILTER DROPDOWN ===


    // Handler for the Entity Type Select component
    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };
    
    // Helper component for rendering a single checkbox filter item
    const CheckboxFilterItem = ({ category, label }) => (
        <div 
            className="dropdown-item d-flex align-items-center py-2 px-3" 
            onClick={() => handleFilterChange(category, label)}
            style={{ cursor: 'pointer' }}
        >
            <input
                type="checkbox"
                checked={selectedFilters[category][label]}
                // Read-only on the input; click handler is on the parent div
                onChange={() => {}} 
                style={{ cursor: 'pointer', marginRight: '8px' }}
            />
            {label}
        </div>
    );


    return (
        <div className="container-fluid min-vh-100 p-0">

            <div className="ms-3 me-3 pt-3 d-flex justify-content-between align-items-center">
                <div className="text-start fw-bold fs-5">Contractor</div>
                <button
                    className="btn action-button d-flex align-items-center"
                    onClick={() => navigate("/contractor-overview")}
                    style={{ backgroundColor: bluePrimary, color: "white" }} 
                >
                    <Plus color="#FFFFFF" size={18} />
                    <span className="ms-2">Add New Contractor</span>
                </button>
            </div>
            
            {/* Filter & Search Section */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-4 p-4" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold fs-6 mb-3">
                    <Filter color={bluePrimary} size={16} />
                    <span className="ms-2">Filter & Search</span>
                </div>

                <div className="row g-3 d-flex justify-content-between">
                    {/* Search Entity Input */}
                    <div className="col-lg-4 col-md-4">
                        <label className="text-start d-block form-label-small">Search Entity</label>
                        <input type="text" className="form-input w-100 form-control" placeholder="Search by entity name" />
                    </div>
                    
                    {/* Entity Type Select */}
                    <div className="col-lg-4 col-md-4">
                        <label className="text-start d-block form-label-small">Entity Type</label>
                        <Select
                            options={entityTypeOptions} 
                            onChange={handleEntityTypeChange}
                            value={selectedEntityType}
                            placeholder="All entity type"
                            className="w-100 custom-select" 
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>
                    
                    {/* === SORT BY DROPDOWN === */}
                    <div className="col-lg-4 col-md-4 position-relative"> 
                        <label className="text-start d-block form-label-small" style={{ visibility: 'hidden' }}>Sort</label> 
                        <div className="dropdown w-100">
                            <button
                                className="btn btn-outline-secondary w-100 d-flex justify-content-between align-items-center"
                                type="button"
                                onClick={toggleSortDropdown}
                                style={{
                                    height: '38px',
                                    borderColor: '#ced4da', 
                                    boxShadow: 'none', 
                                    color: '#495057'
                                }}
                            >
                                Sort by 
                                <span className="ms-2 dropdown-toggle"></span>
                            </button>
                            
                            {isSortDropdownOpen && (
                                <div 
                                    className="dropdown-menu show" 
                                    style={{ 
                                        position: 'absolute', 
                                        top: '100%', 
                                        right: '0', 
                                        left: 'auto',
                                        minWidth: '180px', 
                                        zIndex: 1000 
                                    }}
                                >
                                    <h6 className="dropdown-header text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Status</h6>
                                    <CheckboxFilterItem category="status" label="Verified" />
                                    <CheckboxFilterItem category="status" label="Pending" />
                                    
                                    <div className="dropdown-divider"></div>
                                    
                                    <h6 className="dropdown-header text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Grade</h6>
                                    <CheckboxFilterItem category="grade" label="A Grade" />
                                    <CheckboxFilterItem category="grade" label="B Grade" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* === END OF SORT BY DROPDOWN === */}
                </div>
            </div>
            
            {/* Contractor List Section */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-4 p-3" style={{ border: '1px solid #0051973D' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="text-start fw-bold fs-6">Contractor List</div>
                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                        
                        {/* List View Button */}
                        <button
                            className={`change-view d-flex align-items-center px-3 py-1 fw-bold ${isListView ? "active" : "bg-light text-muted"}`}
                            onClick={() => setIsListView(true)}
                        >
                            <List size={18} className="me-1" /> List View
                        </button>

                        {/* Grid View Button */}
                        <button
                            className={`change-view d-flex align-items-center px-3 py-1 fw-bold ${!isListView ? "active" : "bg-light text-muted"}`}
                            onClick={() => setIsListView(false)}
                        >
                            <Grid size={18} className="me-1" /> Grid View 
                        </button>
                    </div>
                </div>
                
                {/* Conditional Rendering based on view */}
                {isListView ? (
                    <div className="p-3 text-center text-muted border rounded">
                        List View Content Goes Here
                    </div>
                ) : (
                    <div className="p-3 text-center text-muted border rounded">
                        Grid View Content Goes Here
                    </div>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default Contractor;