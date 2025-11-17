import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AddResource() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); 
  };

  const dummyUOM = "";
  const dummyTotalQuantity = "";

  return (
     <div 
        className="bg-primary text-white p-3 rounded-top-3 d-flex justify-content-between align-items-center mx-3" 
        style={{ maxWidth: '98%' }}
      >
        <div className="d-flex align-items-center">
          <span className="me-2 fw-bold" style={{ fontSize: '1rem' }}>BOQ Summary</span>
        </div>
        <div className="d-flex">
          <span className="me-3" style={{ fontSize: '0.85rem' }}>
            Unit of Measurement: <strong>{dummyUOM}</strong>
          </span>
          <span style={{ fontSize: '0.85rem' }}>
            Total Quantity: <strong>{dummyTotalQuantity}</strong>
          </span>
        </div>
      <div className="d-flex justify-content-end mx-3 mt-4">
          <button className="btn btn-primary">Add Resource</button>
      </div>

    </div>
  );
}

export default AddResource;