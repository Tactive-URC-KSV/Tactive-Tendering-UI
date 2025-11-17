import React from "react";
import { ArrowLeft, Clipboard } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); 
  };

  const dummyUOM = ""; 
  const dummyTotalQuantity = "";

  return (
    <div className="container-fluid min-vh-100">

      <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold text-start">
          <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
          <span className="ms-2">Add New Resource</span>
        </div>
      </div>

      {/* BOQ Summary Box */}
      <div 
        className="bg-primary text-white p-4 rounded-3 d-flex justify-content-between align-items-center mx-3" 
        style={{ maxWidth: '98%', background: 'linear-gradient(to right, #005197, #007BFF)' }} 
      >
        <div className="d-flex align-items-center">
          <Clipboard size={20} className="me-2" /> 
          <span className="fw-bold">BOQ Summary</span>
        </div>
        <div className="d-flex">
          <span className="me-3" style={{ fontSize: '0.85rem' }}>
            Unit of Measurement <strong>{dummyUOM}</strong>
          </span> 
          <span style={{ fontSize: '0.85rem' }}>
            Total Quantity <strong>{dummyTotalQuantity}</strong>
          </span>
        </div>
      </div>

      {/* Content Box */}
      <div 
        className="bg-white rounded-bottom-3 ms-3 me-3 p-4 border border-top-0" 
        style={{ borderColor: '#0051973D', maxWidth: '98%', minHeight: '500px' }}
      >
        {/* You can add your form or content here */}
      </div>

      {/* Add Resource Button */}
      <div className="d-flex justify-content-end mx-3 mt-4">
        <button className="btn btn-primary">Add Resource</button>
      </div>

    </div>
  );
}

export default AddResource;
