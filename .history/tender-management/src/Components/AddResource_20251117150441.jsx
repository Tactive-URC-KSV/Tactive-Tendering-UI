import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

function AddResource() {
  const { projectId, boqId } = useParams();
  const navigate = useNavigate();
  const [boqSummary, setBoqSummary] = useState(null); // State to hold BOQ summary data

  // State for form fields
  const [resourceType, setResourceType] = useState("");
  const [nature, setNature] = useState("");
  const [resourceName, setResourceName] = useState("");
  const [rate, setRate] = useState("");
  const [uom, setUom] = useState("");
  const [quantityType, setQuantityType] = useState("");
  const [coefficient, setCoefficient] = useState("");
  const [calculatedQuantity, setCalculatedQuantity] = useState("");
  // ... add more states for other form fields (wastage, pricing, cost summary, etc.)

  useEffect(() => {
    // Fetch BOQ details to populate the BOQ Summary header
    if (boqId) {
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/project/BOQ/${boqId}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.status === 200) {
          setBoqSummary(res.data);
        }
      }).catch(err => {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          console.error(err);
          toast.error('Failed to fetch BOQ summary information.');
        }
      });
    }
  }, [boqId, navigate]);

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (TenderResource)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to submit the new resource data
    console.log("Submitting new resource:", {
      resourceType,
      nature,
      resourceName,
      rate,
      uom,
      quantityType,
      coefficient,
      calculatedQuantity,
      // ... other fields
    });
    // Example: axios.post(...)
    toast.success("New Resource added (simulated)!");
    // navigate(`/tenderestimation/${projectId}/resourceadding/${boqId}`); // Redirect back after adding
  };

  return (
    <div className="container-fluid min-vh-100">
      {/* Header with back arrow and page title */}
      <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold text-start">
          <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
          <span className="ms-2">Add New Resource</span>
        </div>
      </div>

      {/* BOQ Summary Header (Blue Box) - matches the image */}
      <div className="bg-primary text-white p-3 rounded-top-3 d-flex justify-content-between align-items-center mx-3" style={{ maxWidth: '98%' }}>
        <div className="d-flex align-items-center">
          <span className="me-2">🗄️</span> {/* You can replace with a proper icon if available */}
          <span>BOQ Summary</span>
        </div>
        <div className="d-flex">
          <span className="me-3">Unit of Measurement: <strong>{boqSummary?.uom?.uomCode || 'N/A'}</strong></span>
          <span>Total Quantity: <strong>{boqSummary?.quantity?.toFixed(3) || '0.000'}</strong></span>
        </div>
      </div>

      {/* Main form content area */}
      <form onSubmit={handleSubmit} className="bg-white rounded-bottom-3 ms-3 me-3 p-4 border border-top-0" style={{ borderColor: '#0051973D', maxWidth: '98%' }}>

        {/* Basic Information Section */}
        <div className="mb-4">
          <details open>
            <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
              <span className="text-primary me-2" style={{ fontSize: '1.2em' }}>•</span> Basic Information
            </summary>
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label htmlFor="resourceType" className="form-label text-start d-block">Resource Type <span className="text-danger">*</span></label>
                <select id="resourceType" className="form-select" value={resourceType} onChange={(e) => setResourceType(e.target.value)} required>
                  <option value="">Select Resource Type</option>
                  <option value="Labor">Labor</option>
                  <option value="Material">Material</option>
                  <option value="Equipment">Equipment</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="nature" className="form-label text-start d-block">Nature <span className="text-danger">*</span></label>
                <select id="nature" className="form-select" value={nature} onChange={(e) => setNature(e.target.value)} required>
                  <option value="">Select Nature</option>
                  <option value="Simple">Simple</option>
                  <option value="Complex">Complex</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="resourceName" className="form-label text-start d-block">Resource Name <span className="text-danger">*</span></label>
                <select id="resourceName" className="form-select" value={resourceName} onChange={(e) => setResourceName(e.target.value)} required>
                  <option value="">Select resource</option>
                  {/* Populate with actual resource names */}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="rate" className="form-label text-start d-block">Rate <span className="text-danger">*</span></label>
                <input type="number" id="rate" className="form-control" placeholder="0.00" value={rate} onChange={(e) => setRate(e.target.value)} required />
              </div>
            </div>
          </details>
        </div>

        <hr className="my-3" />

        {/* Quantity & Measurements Section */}
        <div className="mb-4">
          <details open>
            <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
              <span className="text-primary me-2" style={{ fontSize: '1.2em' }}>•</span> Quantity & Measurements
            </summary>
            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <label htmlFor="uom" className="form-label text-start d-block">UOM <span className="text-danger">*</span></label>
                <select id="uom" className="form-select" value={uom} onChange={(e) => setUom(e.target.value)} required>
                  <option value="">kg</option>
                  <option value="ton">ton</option>
                  {/* Populate with actual UOMs */}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="quantityType" className="form-label text-start d-block">Quantity Type <span className="text-danger">*</span></label>
                <select id="quantityType" className="form-select" value={quantityType} onChange={(e) => setQuantityType(e.target.value)} required>
                  <option value="">Coefficient</option>
                  <option value="Direct">Direct</option>
                  {/* Add more options */}
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="coefficient" className="form-label text-start d-block">Coefficient <span className="text-danger">*</span></label>
                <input type="number" id="coefficient" className="form-control" placeholder="0.00" value={coefficient} onChange={(e) => setCoefficient(e.target.value)} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="calculatedQuantity" className="form-label text-start d-block">Calculated Quantity <span className="text-danger">*</span></label>
                <input type="text" id="calculatedQuantity" className="form-control" placeholder="0.00" value={calculatedQuantity} readOnly />
              </div>
            </div>
          </details>
        </div>

        <hr className="my-3" />

        {/* Wastage & Net Quantity Section (collapsed by default) */}
        <div className="mb-4">
          <details>
            <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
              <span className="text-primary me-2" style={{ fontSize: '1.2em' }}>•</span> Wastage & Net Quantity
            </summary>
            {/* Add inputs for wastage and net quantity here */}
            <div className="p-3 bg-light rounded mt-2">
              <p className="text-muted">Content for Wastage & Net Quantity will go here.</p>
            </div>
          </details>
        </div>

        <hr className="my-3" />

        {/* Pricing & Currency Section (collapsed by default) */}
        <div className="mb-4">
          <details>
            <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
              <span className="text-primary me-2" style={{ fontSize: '1.2em' }}>•</span> Pricing & Currency
            </summary>
            {/* Add inputs for pricing and currency here */}
            <div className="p-3 bg-light rounded mt-2">
              <p className="text-muted">Content for Pricing & Currency will go here.</p>
            </div>
          </details>
        </div>

        <hr className="my-3" />

        {/* Cost Summary Section */}
        <div className="mb-4">
          <details open>
            <summary className="fw-bold py-2 d-flex align-items-center" style={{ cursor: 'pointer', listStyle: 'none' }}>
              <span className="text-primary me-2" style={{ fontSize: '1.2em' }}>•</span> Cost Summary
            </summary>
            <div className="d-flex justify-content-end align-items-center mt-2">
              <span className="me-2">Rate Lock</span>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
              </div>
            </div>
            <div className="row g-3 mt-2 text-center">
              <div className="col-md-4">
                <div className="p-3 border rounded text-dark">
                  <div className="text-muted">Cost Unit Rate</div>
                  <div className="fw-bold">0.00</div>
                  <small className="text-muted">per CUM</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded text-dark" style={{ backgroundColor: '#e9f5ff' }}>
                  <div className="text-muted">Cost Unit Rate</div>
                  <div className="fw-bold">0.00</div>
                  <small className="text-muted">per CUM</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 border rounded text-dark" style={{ backgroundColor: '#e6ffe6' }}>
                  <div className="text-muted">Cost Unit Rate</div>
                  <div className="fw-bold">0.00</div>
                  <small className="text-muted">per CUM</small>
                </div>
              </div>
            </div>
          </details>
        </div>

        {/* Action Buttons at the bottom */}
        <div className="d-flex justify-content-end mt-5">
          {/* Example of other buttons you might have */}
          <button type="button" className="btn btn-outline-secondary me-2">Cancel</button>
          <button type="submit" className="btn btn-primary">Add Resource</button>
        </div>
      </form>
    </div>
  );
}

export default AddResource;