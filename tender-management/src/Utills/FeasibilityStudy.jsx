import Select from 'react-select';
import { ArrowLeft } from 'lucide-react';
import { ReactComponent as Floors } from '../assest/Floors.svg';
import { ReactComponent as Area } from '../assest/Area.svg';
import { ReactComponent as Cost } from '../assest/Cost.svg';
import { ReactComponent as TotalCost } from '../assest/TotalCost.svg';
import { ReactComponent as Amenities } from '../assest/Amenities.svg';

function FeasibilityStudy({ project, setActiveTab, handleSubmit }) {
    return (
        <div className="project-feasibility">
            <div className="mt-3 mb-4 bg-white pb-4 rounded">
                <div className="row">
                    <p className="mt-3 text-start ms-3 fs-6 fw-bold mb-3">
                        Project Estimation Overview
                    </p>
                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mt-3 mb-3">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Floors /></span>Number 0f Floors</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{project.numberOfFloors}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Area /></span>Total Building Area</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{project.buildingArea}</p>
                        </div>
                    </div>

                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mb-3">
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Cost /></span>Rate per Units</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{project.ratePerUnit}</p>
                        </div>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><TotalCost /></span>Estimated Cost</p><br />
                            <p className='value fw-bold fs-6 ms-2'>$ {project.estimatedValue}</p>
                        </div>
                    </div>
                </div>
                <div className="row d-flex justify-content-around ms-4 me-4 mb-3">
                    <div className="col-12">
                        <div className="estimation-container text-start w-100 p-1 px-1">
                            <p className='report-feild fw-bold mb-2 mt-2 ms-2'><span className="me-2"><Amenities /></span>Other Amenities</p><br />
                            <p className='value fw-bold fs-6 ms-2'>{Array.isArray(project.otherAmenities) ? project.otherAmenities.join(', ') : project.otherAmenities}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Technical Feasibility</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">List of Approvals</label>
                        <Select options={project} placeholder="Select Unit of Measurements" className="w-100" classNamePrefix="select" isClearable
                            menuPlacement="top"
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-3">
                        <label className="projectform-select   text-start d-block">Execution Capabilities</label>
                        <Select options={project} placeholder="Select Unit of Measurements" className="w-100" classNamePrefix="select" isClearable
                            menuPlacement="top"
                             
                        />
                    </div>
                </div>
            </div>
            <div className="mb-3 pb-5 bg-white">
                <div className="row px-3 mt-3 mb-5" style={{ height: '33px' }}>
                    <div className="tab-info col-12 h-100 pt-1">Financial Feasibility</div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">Market Availability</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Market Availability"
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-12 mt-3 mb-4">
                        <label className="projectform-select   text-start d-block">Financial Backup</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Financial Backup"
                             
                        />
                    </div>
                </div>
                <div className="row">
                    <span className="text-start fs-6 fw-bold mb-3" style={{ marginLeft: '40px' }}>
                        Return of Investment (ROI)
                    </span>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform  text-start d-block">Selling Cost</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Selling Cost"
                             
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform   text-start d-block">Rental Cost</label>
                        <input type="text" className="form-input w-100" placeholder="Enter Rental Cost"
                             
                        />
                    </div>
                </div>
                <div className="row align-items-center ms-4 me-4">
                    <div className="col-md-6 mt-3 mb-3">
                        <label className="projectform  text-start d-block">ROI in Years</label>
                        <input type="text" className="form-input w-100" placeholder="Years"
                        />
                    </div>
                    <div className="col-md-6 mt-3 mb-3">
                        <label className="projectform   text-start d-block">Estimated Profit Percentage</label>
                        <input type="text" className="form-input w-100" placeholder="%"
                             
                        />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-between">
                <button className="btn action-button mt-2 ms-4 text-black bg-white" onClick={() => { setActiveTab('info') }}><span className="me-2"><ArrowLeft size={18} /></span>Previous</button>
                <button className="btn action-button mt-2 me-4" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );

}
export default FeasibilityStudy;