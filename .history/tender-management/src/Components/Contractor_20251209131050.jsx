import { Filter, List, Plus, Search } from "lucide-react"; // Import Search icon
import '../CSS/Styles.css';
import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    // Handler for the Select component
    const handleEntityTypeChange = (selectedOption) => {
        setSelectedEntityType(selectedOption);
    };

    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 me-3 d-flex justify-content-between align-items-center">
                <div className="text-start fw-bold fs-5">Contractor</div>
                <button
                    className="btn action-button"
                    onClick={() => navigate("/contractor-overview")}
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
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">Search Entity</label>
                        {/* MODIFIED: Added Search icon */}
                        <div className="input-group">
                            <span className="input-group-text bg-white" style={{ borderRight: 'none', height: '40px', borderColor: '#D3D3D3' }}>
                                <Search size={18} color="#6c757d" />
                            </span>
                            <input 
                                type="text" 
                                className="form-input w-100 form-control" // Use form-control for better integration with input-group
                                placeholder="Search by entity name" 
                                style={{ borderLeft: 'none', height: '40px' }}
                            />
                        </div>
                    </div>
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
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">Location</label>
                        <Select
                            placeholder="Select Location"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>
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
                            Grid View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contractor;