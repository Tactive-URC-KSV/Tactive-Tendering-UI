import React from "react";
// Using BookOpenText as it resembles the BOQ icon in the image
import { ArrowLeft, BookOpenText } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1); 
  };

  // Keep these empty so only the labels show, matching the user's current requirement
  const dummyUOM = ""; 
  const dummyTotalQuantity = "";
    
  // --- Define gradient colors for consistency ---
  const darkBlue = '#005197';
  const vibrantBlue = '#007BFF';

  return (
    <div className="container-fluid min-vh-100">
      
      {/* Header with back arrow and page title */}
      <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold text-start">
          <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
          <span className="ms-2">Add New Resource</span>
        </div>
      </div>

      {/* 1. BOQ Summary Bar with Gradient Color and Exact Shape */}
      <div 
        className="text-white p-3 d-flex justify-content-between align-items-center mx-3" 
        style={{ 
            maxWidth: '98%', 
            // Gradient for the dark-to-light blue transition
            background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, 
            // Explicit border radius for the top-rounded, bottom-flat shape
            borderRadius: '0.5rem 0.5rem 0 0', // Using a larger radius (0.5rem) for a clearer curve
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' // Soft shadow for depth
        }} 
      >
        {/* Left Side: Icon and Title */}
        <div className="d-flex align-items-center">
          <BookOpenText size={20} className="me-2" /> 
          <span>BOQ Summary</span>
        </div>
        
        {/* Right Side: UOM and Quantity Headers (Labels only) */}
        <div className="d-flex">
          <span className="me-3">Unit of Measurement {dummyUOM}</span> 
          <span>Total Quantity {dummyTotalQuantity}</span>
        </div>
      </div>

      {/* 2. Placeholder for the white content box */}
      <div 
        className="bg-white ms-3 me-3 p-4 border border-top-0" 
        style={{ 
            borderColor: '#0051973D', 
            maxWidth: '98%', 
            minHeight: '500px',
            // Explicitly setting the bottom border radius to maintain the flush look
            borderRadius: '0 0 0.5rem 0.5rem',
            border: '1px solid #dee2e6' // Add a subtle border around the white content area
        }}
      >
        {/* Your form content will be placed here */}
        
        {/*
        NOTE: For the fields in the screenshot (Basic Information, Quantity, etc.), 
        you should place them here. 
        */}
      </div>

      {/* 3. Action Button (Add Resource) - Dark Blue Color */}
      <div className="d-flex justify-content-end mx-3 mt-4">
          <button 
                className="btn" 
                style={{ 
                    // Explicitly setting the dark blue color for the button
                    backgroundColor: darkBlue, 
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem' // Adjust padding to match the button size
                }}
            >
                Add Resource
            </button>
      </div>

    </div>
  );
}

export default AddResource;