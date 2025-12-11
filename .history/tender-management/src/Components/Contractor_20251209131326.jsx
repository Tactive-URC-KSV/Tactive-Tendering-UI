import { Filter, List, Plus, Search } from "lucide-react";
import '../CSS/Styles.css'; // Assuming this contains your custom styles like .action-button and .change-view
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Entity Type Options as defined previously: Contractor, Design Consultant, PMC Consultant
const entityTypeOptions = [
    { value: 'contractor', label: 'Contractor' },
    { value: 'design_consultant', label: 'Design Consultant' },
    { value: 'pmc_consultant', label: 'PMC Consultant' },
];

// Note: The third filter in your screenshot is "Sort by", not "Location". 
// I will keep "Location" as a Select component placeholder for now, 
// but add the "Sort by" button style as seen in the close-up image for maximum fidelity.

const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'date_desc', label: 'Date Added (Newest)' },
];

function Contractor() {
    const [isListView, setIsListView] = useState(true);
    const navigate = useNavigate();
    
    const [selectedEntityType, setSelectedEntityType] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedSortBy, setSelectedSortBy] = useState(null); // State for the Sort By button/dropdown

    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };

    const handleLocationChange = (selectedOption) => {
        setSelectedLocation(selectedOption);
    };

    const handleSortByChange = (selectedOption) => {
        setSelectedSortBy(selectedOption);
    };

    return (
        <div className="container-fluid min-vh-100">
            {/* Header and Add Button */}
            <div className="ms-3 me-3 d-flex justify-content-between align-items-center py-3">
                <div className="text-start fw-bold fs-5">Contractor</div>
                <button
                    className="btn action-button" // Assuming .action-button has the blue background
                    onClick={() => navigate("/contractor-overview")}
                    style={{ backgroundColor: '#005197', color: 'white' }} 
                >
                    <Plus color="#FFFFFF" size={18} />
                    <span className="ms-2">Add New Contractor</span>
                </button>
            </div>
            
            {/* Filters & Search Section (Matching Image Layout) */}
            <div className="ms-3 me-3 bg-white rounded-3 mt-4 p-2" style={{ border: '1px solid #0051973D', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div className="text-start fw-bold fs-6 ms-2 mt-2 py-2" style={{ color: '#005197' }}>
                    <Filter color="#005197" size={16} />
                    <span className="ms-2">Filter & Search</span>
                </div>

                <div className="row g-3 ms-2 mt-1 mb-4 me-2 d-flex align-items-end">
                    
                    {/* 1. Search Entity Input with Icon */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Search Entity</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white" style={{ borderRight: 'none', height: '40px', borderColor: '#D3D3D3', borderRadius: '6px 0 0 6px' }}>
                                <Search size={18} color="#6c757d" />
                            </span>
                            <input 
                                type="text" 
                                className="form-control" // Using form-control for standard Bootstrap input look
                                placeholder="Search by entity name" 
                                style={{ borderLeft: 'none', height: '40px', borderRadius: '0 6px 6px 0' }}
                            />
                        </div>
                    </div>
                    
                    {/* 2. Entity Type Dropdown */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Entity Type</label>
                        <Select
                            options={entityTypeOptions} 
                            onChange={handleEntityTypeChange}
                            value={selectedEntityType}
                            placeholder="All entity type"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            styles={{ 
                                control: (base) => ({ 
                                    ...base, height: '40px', minHeight: '40px', borderColor: '#D3D3D3', 
                                    boxShadow: 'none', '&:hover': { borderColor: '#005197' } 
                                }) 
                            }}
                        />
                    </div>
                    
                    {/* 3. Sort By (or Location) - Using Sort By style from image af35bf.png */}
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block mb-1" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Sort by</label>
                         <Select
                            options={sortOptions} 
                            onChange={handleSortByChange}
                            value={selectedSortBy}
                            placeholder="Sort by"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            // Custom styling to mimic the light blue button shown in the close-up image
                            styles={{
                                control: (base, state) => ({
                                    ...base,
                                    height: '40px',
                                    minHeight: '40px',
                                    backgroundColor: state.isFocused || state.hasValue ? '#E8F5FF' : '#E8F5FF', // Light blue background
                                    borderColor: state.isFocused ? '#005197' : '#D3D3D3',
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
                            }}
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
                {/* Contractor table/grid content would go here */}
            </div>
        </div>
    );
}

export default Contractor;