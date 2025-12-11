import { Filter, List, Plus, Search } from "lucide-react"; 
import '../CSS/Styles.css';
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Option Definitions
const entityTypeOptions = [
    { value: 'contractor', label: 'Contractor' },
    { value: 'design_consultant', label: 'Design Consultant' },
    { value: 'pmc_consultant', label: 'PMC Consultant' },
];

// Options for the custom "Sort by"/Filter structure (Status and Grade)
const sortOptions = [
    { value: 'verified', label: 'Verified', group: 'Status' },
    { value: 'pending', label: 'Pending', group: 'Status' },
    { value: 'a_grade', label: 'A Grade', group: 'Grade' },
    { value: 'b_grade', label: 'B Grade', group: 'Grade' },
];

// Grouping the options for a clean visual structure (Status and Grade headers)
const groupedSortOptions = [
    {
        label: 'Status',
        options: sortOptions.filter(o => o.group === 'Status'),
    },
    {
        label: 'Grade',
        options: sortOptions.filter(o => o.group === 'Grade'),
    },
];


function Contractor() {
    const [isListView, setIsListView] = useState(true);
    const navigate = useNavigate();
    
    // States for filter management
    const [selectedEntityType, setSelectedEntityType] = useState(null);
    const [selectedSortBy, setSelectedSortBy] = useState([]); 

    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };

    const handleSortByChange = (selectedOptions) => {
        // Allows multiple selection to mimic a checklist filter
        setSelectedSortBy(selectedOptions);
    };

    // Custom formatting for React-Select to use groups (Status, Grade) as bold headers
    const formatGroupLabel = (data) => (
        <div style={{ fontWeight: 'bold', color: '#333', padding: '5px 0' }}>
            {data.label}
        </div>
    );
    
    // Custom styling for the Sort by Select component to match the light blue button in the screenshot
    const customStyles = {
        control: (base, state) => ({
            ...base,
            height: '40px',
            minHeight: '40px',
            backgroundColor: '#E8F5FF', // Light blue background for the button
            borderColor: state.isFocused ? '#005197' : '#E8F5FF', // Blue border on focus
            boxShadow: 'none',
            borderRadius: '6px',
        }),
        placeholder: (base) => ({
            ...base,
            color: '#005197', // Blue text color
            fontWeight: '600',
        }),
        singleValue: (base) => ({
            ...base,
            color: '#005197', 
            fontWeight: '600',
        }),
        multiValue: (base) => ({
             ...base,
             backgroundColor: '#005197',
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: 'white',
        }),
    };


    return (
        <div className="container-fluid min-vh-100">
            {/* Header and Add Button */}
            <div className="ms-3 me-3 d-flex justify-content-between align-items-center">
                <div className="text-start fw-bold fs-5">Contractor</div>
                <button
                    className="btn action-button"
                    onClick={() => navigate("/contractor-overview")}
                    style={{ backgroundColor: '#005197', color: 'white' }} 
                >
                    <Plus color="#FFFFFF" size={18} />
                    <span className="ms-2">Add New Contractor</span>
                </button>
            </div>
            
            {/* Filters & Search Section */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-5 p-2" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold fs-6 ms-2 mt-2">
                    <Filter color="#005197" size={16} />
                    <span className="ms-2">Filter & Search</span>
                </div>

                <div className="row g-3 ms-2 mt-2 mb-4 me-2 d-flex justify-content-between">
                    
                    {/* 1. Search Entity Input (Simple, as requested) */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">Search Entity</label>
                        <input type="text" className="form-input w-100" placeholder="Search by entity name" />
                    </div>
                    
                    {/* 2. Entity Type Dropdown */}
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
                    
                    {/* 3. Sort by / Status / Grade Filter (Styled to match image) */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">Sort by</label>
                        <Select
                            options={groupedSortOptions} 
                            onChange={handleSortByChange}
                            value={selectedSortBy}
                            placeholder="Sort by"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            isMulti // Allows multiple selections (like a checklist)
                            styles={customStyles}
                            formatGroupLabel={formatGroupLabel} // Shows Status and Grade headers
                        />
                    </div>

                </div>
            </div>
            
            {/* Contractor List Section */}
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
                            Grid View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contractor;