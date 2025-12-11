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

// Options for the custom "Sort by"/Filter structure
const sortOptions = [
    { value: 'verified', label: 'Verified', group: 'Status' },
    { value: 'pending', label: 'Pending', group: 'Status' },
    { value: 'a_grade', label: 'A Grade', group: 'Grade' },
    { value: 'b_grade', label: 'B Grade', group: 'Grade' },
];

// Grouping the options for a clean visual structure (used by React-Select)
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
    const [selectedSortBy, setSelectedSortBy] = useState([]); // Use array for multiple selections in a checklist

    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };

    const handleSortByChange = (selectedOptions) => {
        // Allows multiple selection to mimic a checklist filter
        setSelectedSortBy(selectedOptions);
    };

    // Custom formatting for React-Select to use groups (Status, Grade)
    const formatGroupLabel = (data) => (
        <div style={{ fontWeight: 'bold', color: '#333', padding: '5px 0' }}>
            {data.label}
        </div>
    );
    
    // Custom styling to match the light blue button in the screenshot
    const customStyles = {
        control: (base, state) => ({
            ...base,
            height: '40px',
            minHeight: '40px',
            backgroundColor: '#E8F5FF', // Light blue background
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
            
            <div className="ms-3 me-3 bg-white rounded-3 mt-5 p-2" style={{ border: '1px solid #0051973D', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="text-start fw-bold fs-6 ms-2 mt-2 py-2" style={{ color: '#005197' }}>
                    <Filter color="#005197" size={16} />
                    <span className="ms-2">Filter & Search</span>
                </div>

                <div className="row g-3 ms-2 mt-1 mb-4 me-2 d-flex align-items-end">
                    
                    {/* 1. Search Entity Input with Icon (Matching Screenshot) */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Search Entity</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white" style={{ borderRight: 'none', height: '40px', borderColor: '#D3D3D3', borderRadius: '6px 0 0 6px' }}>
                                <Search size={18} color="#6c757d" />
                            </span>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="Search by entity name" 
                                style={{ borderLeft: 'none', height: '40px', borderRadius: '0 6px 6px 0' }}
                            />
                        </div>
                    </div>
                    
                    {/* 2. Entity Type Dropdown (Matching Screenshot) */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Entity Type</label>
                        <Select
                            options={entityTypeOptions} 
                            onChange={handleEntityTypeChange}
                            value={selectedEntityType}
                            placeholder="All entity type"
                            className="w-100"
                            classNamePrefix="select"
                            styles={{ 
                                control: (base) => ({ 
                                    ...base, height: '40px', minHeight: '40px', borderColor: '#D3D3D3', 
                                    boxShadow: 'none', '&:hover': { borderColor: '#005197' } 
                                }) 
                            }}
                        />
                    </div>
                    
                    {/* 3. Sort by / Status / Grade Filter (Matching Screenshot Look) */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Sort by</label>
                        <Select
                            options={groupedSortOptions} 
                            onChange={handleSortByChange}
                            value={selectedSortBy}
                            placeholder="Sort by"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            isMulti // Enable multiple selections for checklist effect
                            styles={customStyles}
                            formatGroupLabel={formatGroupLabel}
                        />
                    </div>

                </div>
            </div>
            
            {/* Contractor List Section */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-4 p-3" style={{ border: '1px solid #0051973D', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-start fw-bold fs-6">Contractor List</div>
                    <div className="d-flex">
                        <button
                            className={`change-view btn btn-sm ${isListView ? "active" : "bg-light"} text-nowrap px-3 py-1 rounded-start`}
                            onClick={() => setIsListView(true)}
                            style={{ backgroundColor: isListView ? '#005197' : '#f8f9fa', color: isListView ? 'white' : '#005197', border: '1px solid #005197', borderRight: 'none' }}
                        >
                            <List size={18} className="me-1" /> List View
                        </button>

                        <button
                            className={`change-view btn btn-sm ${!isListView ? "active" : "bg-light"} text-nowrap px-3 py-1 rounded-end`}
                            onClick={() => setIsListView(false)}
                            style={{ backgroundColor: !isListView ? '#005197' : '#f8f9fa', color: !isListView ? 'white' : '#005197', border: '1px solid #005197' }}
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