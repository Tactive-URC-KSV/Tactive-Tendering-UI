import React from "react";
// Using BookOpenText as it resembles the BOQ icon in your image
import { ArrowLeft, BookOpenText } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); 
  };

  // These are still empty as per your current requirement
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

      {/* BOQ Summary Bar with Gradient Color and Exact Shape */}
      <div 
        className="text-white p-3 d-flex justify-content-between align-items-center mx-3" 
        style={{ 
            maxWidth: '98%', 
            // Gradient for the vibrant blue effect
            background: 'linear-gradient(to right, #005197, #007BFF)', 
            // Explicit border radius for the top-rounded, bottom-flat shape
            borderRadius: '0.3rem 0.3rem 0 0', 
            // Optional: adding a shadow to lift it off the page, matching the polished look
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }} 
      >
        {/* Left Side: Icon and Title */}
        <div className="d-flex align-items-center">
          <BookOpenText size={20} className="me-2" /> 
          <span>BOQ Summary</span>
        </div>
        
        {/* Right Side: UOM and Quantity Headers (without values) */}
        <div className="d-flex">
          <span className="me-3">Unit of Measurement {dummyUOM}</span> 
          <span>Total Quantity {dummyTotalQuantity}</span>
        </div>
      </div>

      {/* Placeholder for the white content box - rounded-bottom-3 matches the bottom section of the rounded top */}
      <div 
        className="bg-white rounded-bottom-3 ms-3 me-3 p-4 border border-top-0" 
        style={{ borderColor: '#0051973D', maxWidth: '98%', minHeight: '500px' }}
      >
        {/* Form content goes here */}
      </div>

      {/* Action Button (Add Resource) - Dark Blue Color */}
      <div className="d-flex justify-content-end mx-3 mt-4">
          <button 
                className="btn" 
                style={{ 
                    // Explicitly setting the dark blue color
                    backgroundColor: '#005197', 
                    color: 'white',
                    border: 'none'
                }}
            >
                Add Resource
            </button>
      </div>

    </div>
  );
}

export default AddResource;