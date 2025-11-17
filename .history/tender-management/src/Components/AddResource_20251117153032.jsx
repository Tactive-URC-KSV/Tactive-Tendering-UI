import React from "react";
import { ArrowLeft, Clipboard } from "lucide-react"; // Clipboard icon is used for the BOQ icon
import { useNavigate } from "react-router-dom";

function AddResource() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); 
  };

  // Keep these empty so only the labels show
  const dummyUOM = ""; 
  const dummyTotalQuantity = "";

  return (
    <div className="container-fluid min-vh-100">
      
      {/* Header with back arrow and page title */}
      <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold text-start">
          <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
          <span className="ms-2">Add New Resource</span>
        </div>
      </div>

      {/* BOQ Summary Bar with Exact Color (#005197) */}
      <div 
        className="text-white p-3 rounded-top-3 d-flex justify-content-between align-items-center mx-3" 
        style={{ 
            maxWidth: '98%', 
            // 👇 Explicitly set the background color to match the design
            backgroundColor: '#005197' 
        }} 
      >
        {/* Left Side: Icon and Title */}
        <div className="d-flex align-items-center">
          <Clipboard size={20} className="me-2" /> 
          <span>BOQ Summary</span>
        </div>
        
        {/* Right Side: UOM and Quantity Headers (without values) */}
        <div className="d-flex">
          <span className="me-3">Unit of Measurement {dummyUOM}</span> 
          <span>Total Quantity {dummyTotalQuantity}</span>
        </div>
      </div>

      {/* Placeholder for the white content box */}
      <div 
        className="bg-white rounded-bottom-3 ms-3 me-3 p-4 border border-top-0" 
        style={{ borderColor: '#0051973D', maxWidth: '98%', minHeight: '500px' }}
      >
        {/* Form content goes here */}
      </div>

      {/* Action Button (Add Resource) */}
      <div className="d-flex justify-content-end mx-3 mt-4">
          <button className="btn btn-primary">Add Resource</button>
      </div>

    </div>
  );
}

export default AddResource;