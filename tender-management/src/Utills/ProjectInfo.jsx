import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import '../CSS/custom-flatpickr.css';
import { useRegions } from "../Context/RegionsContext";
import { useSectors } from "../Context/SectorsContext";
import { useScope } from "../Context/ScopeContext";
import { useUom } from "../Context/UomContext";
import { useNavigate } from 'react-router-dom';


function ProjectInfo({ project, handleSubmit, region, scopePack, sector, setProject, setRegion, setSector, setScopePack, setUom, uom, loading }) {

    const navigate = useNavigate();

    const regionOptions = useRegions().map(region => ({
        value: region.id,
        label: region.country
    }));
    const uomOptions = useUom().map(uom => ({
        value: uom.id,
        label: uom.uomName
    }));
    const sectorOptions = useSectors().map(sector => ({
        value: sector.id,
        label: sector.sectorName,
    }));
    const scopeOptions = useScope().map(scopes => ({
        value: scopes.id,
        label: scopes.scope,
    }));

    
    return (
        <div className="project-info-input">
            <div className="mt-3 mb-4 pb-5 bg-white">
                <div className="row px-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">General Information</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mb-4">
                        <label className=" projectform   text-start d-block">
                            Project Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Project Code"
                            value={project.projectName}
                            onChange={(e) => setProject({ ...project, projectName: e.target.value })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">
                            Project Code <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Project Code"
                            value={project.projectCode}
                            onChange={(e) => setProject({ ...project, projectCode: e.target.value })}
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">
                            Short Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Short Name"
                            value={project.shortName}
                            onChange={(e) => setProject({ ...project, shortName: e.target.value })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Agreement date</label>
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select Agreement date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.agreementDate}
                            onChange={([date]) => setProject({ ...project, agreementDate: date })}
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Agreement number </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Agreement number"
                            value={project.agreementNumber}
                            onChange={(e) => setProject({ ...project, agreementNumber: e.target.value })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block"> Start date </label>
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select Start date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.startDate}
                            onChange={([date]) => setProject({ ...project, startDate: date })}
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">End date</label>
                        <Flatpickr
                            className="form-input w-100"
                            placeholder="Select End date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.endDate}
                            onChange={([date]) => setProject({ ...project, endDate: date })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block"> City </label>
                        <input type="text" className="form-input w-100" placeholder="Enter City"
                            value={project.city}
                            onChange={(e) => setProject({ ...project, city: e.target.value })}
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Address</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Address"
                            value={project.address}
                            onChange={(e) => setProject({ ...project, address: e.target.value })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 position-relative mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">
                            Region <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select
                            options={regionOptions}
                            placeholder="Select Region"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                            value={regionOptions.find((option) => option.value === region)}
                            onChange={(option) => setRegion(option ? option.value : null)}
                             
                            menuPlacement="top"
                        />
                    </div>

                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">
                            Sector <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select options={sectorOptions} placeholder="Select Sector" className="w-100" classNamePrefix="select"
                            value={sectorOptions.find((option) => option.value === sector)}
                            onChange={(option) => setSector(option ? option.value : null)}
                             
                            menuPlacement="top"
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3">
                        <label className="projectform-select text-start d-block">
                            Scope of Packages <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select options={scopeOptions} placeholder="Select Scope of Packages" isMulti className="w-100" classNamePrefix="select"
                            value={scopeOptions.filter(opt => scopePack.includes(opt.value))}
                            onChange={(option) =>
                                setScopePack(option ? option.map(o => o.value) : [])
                            }
                             
                            menuPlacement="top"
                        />
                    </div>
                </div>
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Technical Information</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mb-4">
                        <label className="projectform text-start d-block">No. of. Floors</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Number of Floors"
                            value={project.numberOfFloors}
                            onChange={(e) => setProject({ ...project, numberOfFloors: parseInt(e.target.value) })}
                             
                        />
                    </div>
                    <div className="col-md-6 mb-4">
                        <label className="projectform   text-start d-block">Car Parking Floors</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Car Parking Floors"
                            value={project.carParkingFloors}
                            onChange={(e) => setProject({ ...project, carParkingFloors: parseInt(e.target.value) })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Above Ground</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Above Ground"
                            value={project.numberOfAboveGround}
                            onChange={(e) => setProject({ ...project, numberOfAboveGround: parseInt(e.target.value) })}
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Below Ground</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Below Ground"
                            value={project.numberOfBelowGround}
                            onChange={(e) => setProject({ ...project, numberOfBelowGround: parseInt(e.target.value) })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">
                            UOM <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Select options={uomOptions} placeholder="Select Unit of Measurements" className="w-100" classNamePrefix="select" isClearable
                            value={uomOptions.find((option) => option.value === uom)}
                            onChange={(option) => setUom(option ? option.value : null)}
                            menuPlacement="top"
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Total Area</label>
                        <input type="number" step="any" className="form-input w-100" placeholder="Enter Total Area"
                            value={project.buildingArea}
                            onChange={(e) => setProject({ ...project, buildingArea: parseFloat(e.target.value) })}
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Other Amenities</label>
                        <input type="text"  className="form-input w-100" placeholder="Enter Other Amenities"
                            value={
                                Array.isArray(project.otherAmenities) ? project.otherAmenities.join(', ') : project.otherAmenities
                            }
                            onChange={(e) => setProject({ ...project, otherAmenities: e.target.value })}
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Rate Per Units</label>
                        <input type="number" step="any" className="form-input w-100" placeholder="Enter Rate Per Units"
                            value={project.ratePerUnit}
                            onChange={(e) => setProject({ ...project, ratePerUnit: parseFloat(e.target.value) })}
                             
                        />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <button className="btn action-button mt-2 me-4 text-black bg-white" onClick={() => { window.location.reload(); navigate(-1);}} disabled={loading}>Cancel</button>
                <button className="btn action-button mt-2 me-4" onClick={handleSubmit} >{loading ? (<span className="spinner-border spinner-border-sm text-white"></span>) : 'Submit'}</button>
            </div>
        </div>
    );
}
export default ProjectInfo;
