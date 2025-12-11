import { Filter, List, Plus, Grid } from "lucide-react"; 
import '../CSS/Styles.css';
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Define the primary color (assuming it's used elsewhere for styling)
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

    // === ADDED: SORT BY STATE AND HANDLERS ===
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
    // === END OF ADDED STATE AND HANDLERS ===


    // Handler for the Entity Type Select component
    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };
    
    // === ADDED: HELPER COMPONENT FOR CHECKBOX ITEMS ===
    // This handles the blue text and checkbox coloring when selected
    const CheckboxFilterItem = ({ category, label }) => (
        <div 
            className="dropdown-item d-flex align-items-center py-1 px-3" 
            onClick={() => handleFilterChange(category, label)}
            style={{ cursor: 'pointer' }}
        >
            <input
                type="checkbox"
                checked={selectedFilters[category][label]}
                onChange={() => {}} 
                style={{ cursor: 'pointer', marginRight: '8px', accentColor: bluePrimary }}
            />
            <span style={{ color: selectedFilters[category][label] ? bluePrimary : 'inherit' }}>
                {label}
            </span>
        </div>
    );
    // === END OF ADDED HELPER COMPONENT ===


    return (
        <div className="container-fluid min-vh-100">
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
                    
                    {/* === REPLACED: SORT BY DROPDOWN (Replaces Location Select) === */}
                    <div className="col-lg-4 col-md-6 position-relative">
                        <label className="text-start d-block" style={{ visibility: 'hidden' }}>Sort</label>
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
                                        zIndex: 1000,
                                        padding: '8px 0',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <h6 className="dropdown-header text-uppercase fw-bold pt-0 pb-1 px-3" style={{ fontSize: '0.75rem', color: '#6c757d' }}>Status</h6>
                                    <CheckboxFilterItem category="status" label="Verified" />
                                    <CheckboxFilterItem category="status" label="Pending" />
                                    
                                    <div className="dropdown-divider my-1"></div>
                                    
                                    <h6 className="dropdown-header text-uppercase fw-bold pt-1 pb-1 px-3" style={{ fontSize: '0.75rem', color: '#6c757d' }}>Grade</h6>
                                    <CheckboxFilterItem category="grade" label="A Grade" />
                                    <CheckboxFilterItem category="grade" label="B Grade" />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* === END OF REPLACED BLOCK === */}
                </div>
            </div>
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
                            <Grid size={18} /> Grid View {/* Note: Added Grid import */}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contractor;