import { Filter, List, Plus, Grid } from "lucide-react"; 
import '../CSS/Styles.css';
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the primary color (matching the dark blue in your images)
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
    
    const [selectedEntityType, setSelectedEntityType] = useState(null);

    // === SORT BY STATE FOR SINGLE SELECTION (Radio logic) ===
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    
    // State stores the single selected value for each category
    const [selectedSortOptions, setSelectedSortOptions] = useState({
        status: null, 
        grade: null,  
    });

    const toggleSortDropdown = () => {
        setIsSortDropdownOpen(prev => !prev);
    };

    // Handler for single selection (radio behavior)
    const handleSortChange = (category, value) => {
        setSelectedSortOptions(prev => ({
            ...prev,
            [category]: prev[category] === value ? null : value, // Toggle logic
        }));
    };
    // === END OF SORT BY STATE AND HANDLERS ===


    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };
    
    // === HELPER COMPONENT: Checkbox visual (All Blue Styling) ===
    const CheckboxFilterItem = ({ category, label }) => {
        const isSelected = selectedSortOptions[category] === label;
        
        return (
            <div 
                className="d-flex align-items-center py-1" 
                onClick={() => handleSortChange(category, label)}
                style={{ 
                    cursor: 'pointer', 
                    paddingLeft: '1rem', 
                    paddingRight: '1rem',
                    // Light blue background only when selected
                    backgroundColor: isSelected ? '#4277a3ff' : 'white', 
                    transition: 'background-color 0.2s',
                    minHeight: '28px' 
                }}
            >
                <input
                    type="checkbox" 
                    checked={isSelected}
                    onChange={() => {}} 
                    style={{ 
                        cursor: 'pointer', 
                        marginRight: '8px', 
                        // The color of the checkmark/fill when selected is primary blue
                        accentColor: bluePrimary, 
                        transform: 'scale(1.05)',
                        // CRITICAL: Set the border color to bluePrimary (soft blue) even when NOT selected.
                        border: '1px solid #005197CC', 
                        borderRadius: '3px', 
                    }}
                />
                <span 
                    className="fw-normal"
                    style={{ 
                        // Text color is always dark blue
                        color: bluePrimary, 
                        fontSize: '0.9rem' 
                    }}
                >
                    {label}
                </span>
            </div>
        );
    };
    // === END OF HELPER COMPONENT ===


    return (
        <div className="container-fluid min-vh-100">
            {/* Header and Add New Contractor Button */}
            <div className="ms-3 me-3 d-flex justify-content-between align-items-center">
                <div className="text-start fw-bold fs-5">Contractor</div>
                <button
                    className="btn action-button"
                    onClick={() => navigate("/contractor-overview")}
                    style={{ backgroundColor: bluePrimary, color: "white" }} 
                >
                    <Plus color="#FFFFFF" size={18} />
                    <span className="ms-2">Add New Contractor</span>
                </button>
            </div>

            {/* Filter & Search Box */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-5 p-2" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold fs-6 ms-2 mt-2">
                    <Filter color="#005197" size={16} />
                    <span className="ms-2">Filter & Search</span>
                </div>

                <div className="row g-3 ms-2 mt-2 mb-4 me-2 d-flex justify-content-between">
                    {/* Search Entity Input */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">Search Entity</label>
                        <input type="text" className="form-input w-100" placeholder="Search by entity name" />
                    </div>
                    
                    {/* Entity Type Select */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">Entity Type</label>
                        <Select
                            options={entityTypeOptions} 
                            onChange={handleEntityTypeChange}
                            value={selectedEntityType}
                            placeholder="All entity type"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>
                    
                    {/* === SORT BY FIELD with Dropdown === */}
                    <div className="col-lg-2 col-md-4 position-relative mt-3"> 
                        <label className="text-start d-block" style={{ visibility: 'hidden' }}>Sort</label>
                        <div className="dropdown w-100">
                            <button
                                className="btn w-100 d-flex justify-content-between align-items-center"
                                type="button"
                                onClick={toggleSortDropdown}
                                style={{
                                    height: '38px',
                                    // Light blue button background 
                                    backgroundColor: '#E9F5FF', 
                                    // Darker blue text/arrow color
                                    color: bluePrimary, 
                                    boxShadow: 'none', 
                                    paddingLeft: '12px',
                                    paddingRight: '12px',
                                    border: `1px solid ${bluePrimary}33`, 
                                }}
                            >
                                Sort by 
                                {/* Custom Chevron Down Icon (Darker Blue) */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down ms-1" style={{ width: '18px', height: '18px', color: bluePrimary }}>
                                    <path d="m6 9 6 6 6-6"></path>
                                </svg>
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
                                        zIndex: 1000,
                                        padding: '4px 0',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {/* Status Section */}
                                    <h6 className="dropdown-header text-uppercase fw-normal pt-1 pb-1 px-3" style={{ fontSize: '0.8rem', color: '#005197CC' }}>Status</h6>
                                    <CheckboxFilterItem category="status" label="Verified" />
                                    <CheckboxFilterItem category="status" label="Pending" />
                                    
                                    <div className="dropdown-divider my-1"></div>
                                    
                                    {/* Grade Section */}
                                    <h6 className="dropdown-header text-uppercase fw-normal pt-1 pb-1 px-3" style={{ fontSize: '0.8rem', color: '#005197CC' }}>Grade</h6>
                                    <CheckboxFilterItem category="grade" label="A Grade" />
                                    <CheckboxFilterItem category="grade" label="B Grade" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* === END OF SORT BY FIELD === */}
                </div>
            </div>

            {/* Contractor List View Controls */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-5 p-3" style={{ border: '1px solid #0051973D' }}>
                <div className="d-flex justify-content-between">
                    <div className="text-start fw-bold fs-6">Contractor List</div>
                    <div className="d-flex">
                        <button
                            className={`change-view ${isListView ? "active" : "bg-light"} w-100 text-nowrap px-3 py-1 rounded-2`}
                            onClick={() => setIsListView(true)}
                        >
                            <List size={18} /> List View
                        </button>

                        <button
                            className={`change-view ${!isListView ? "active" : "bg-light"} w-100 text-nowrap px-3 py-1 rounded-2 ms-2`}
                            onClick={() => setIsListView(false)}
                        >
                            <Grid size={18} /> Grid View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contractor;