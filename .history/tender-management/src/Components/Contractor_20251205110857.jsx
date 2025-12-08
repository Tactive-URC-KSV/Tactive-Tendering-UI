import { Filter, List, Plus } from "lucide-react";
import '../CSS/Styles.css'
import Select from "react-select";
import { useState } from "react";
function Contractor() {
    const [isListView, setIsListView] = useState(true);
    return (
        <div className="container-fluid min-vh-100">
            <div className="ms-3 me-3 d-flex justify-content-between align-items-center">
                <div className="text-start fw-bold fs-5">Contractor</div>
                <button className="btn action-button"><Plus color="#FFFFFF" size={18} /><span className="ms-2">Add New Contractor</span></button>
            </div>
            <div className="ms-3 me-3 bg-white rounded-3 mt-5 p-2" style={{ border: '1px solid #0051973D' }}>
                <div className="text-start fw-bold fs-6 ms-2 mt-2"><Filter color="#005197" size={16} /><span className="ms-2">Filter & Sort</span></div>
                <div className="row g-3 ms-2 mt-2 mb-4 me-2 d-flex justify-content-between">
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">
                            Search by Contractor (or) Company
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Search by Contractor (or) Company" />
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">
                            Nature of Work
                        </label>
                        <Select
                            // options={regionOptions}
                            placeholder="Select Nature of Work"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                        // value={regionOptions.find((option) => option.value === region)}
                        // onChange={(option) => setRegion(option ? option.value : null)}
                        />
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <label className="text-start d-block">
                            Location
                        </label>
                        <Select
                            // options={regionOptions}
                            placeholder="Select Location"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                        // value={regionOptions.find((option) => option.value === region)}
                        // onChange={(option) => setRegion(option ? option.value : null)}
                        />
                    </div>
                </div>
            </div>
            <div className="ms-3 me-3 bg-white rounded-3 mt-5 p-3" style={{ border: '1px solid #0051973D' }}>
                <div className="d-flex justify-content-between">
                    <div className="text-start fw-bold fs-6">Contractor List</div>
                    <div className="d-flex">
                        <button className={`change-view ${isListView ? "active" : "bg-light"} w-100 text-nowrap px-3 py-1 rounded-2`} onClick={() => { setIsListView(true); }}>
                            <List size={18}/> List View
                        </button>
                        <button className={`change-view ${!isListView ? "active" : "bg-light"} w-100 text-nowrap px-3 py-1 rounded-2`} onClick={() => { setIsListView(false); }}>
                            Grid View 
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Contractor;