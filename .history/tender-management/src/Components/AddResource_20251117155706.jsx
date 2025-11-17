import React from "react";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
 const navigate = useNavigate();
 
 const handleBack = () => {
navigate(-1); 
 };
  const darkBlue = '#005197';
 const vibrantBlue = '#007BFF';
 const containerBgColor = '#f8f9fa'; // Very light gray/blue for container background
 const containerBorderColor = '#dee2e6'; // Standard light border
 const boqUOM = "CUM"; 
  const boqTotalQuantity = "3922.494"; 
 const FormSectionContainer = ({ title, icon, defaultOpen, children }) => {
        return (
            <div className="mb-4">
                <details open={defaultOpen}>
                    <summary 
                        className="py-3 px-4 d-flex justify-content-between align-items-center"
                        style={{
                            cursor: 'pointer',
                            listStyle: 'none',
                            backgroundColor: containerBgColor,
                            border: `1px solid ${containerBorderColor}`,
                            borderRadius: '0.5rem',
                            marginBottom: '1rem',
                        }}
                    >
                        <div className="d-flex align-items-center">
                            {icon}
                            <span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span>
                        </div>
                        
                        <ChevronDown size={20} className="text-secondary" />
                    </summary>

                    <div className="p-4" style={{ 
                        borderLeft: `1px solid ${containerBorderColor}`, 
                        borderRight: `1px solid ${containerBorderColor}`, 
                        borderBottom: `1px solid ${containerBorderColor}`, 
                        borderRadius: '0 0 0.5rem 0.5rem',
                        marginTop: '-1rem' 
                    }}>
                        {children}
                    </div>
                </details>
            </div>
        );
    };

 return (
 <div className="container-fluid min-vh-100">

      {/* Page Header (Back Arrow and Title) */}
      <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold text-start">
          <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
          <span className="ms-2">Add New Resource</span>
        </div>
      </div>

      {/* BOQ Summary Header - Exact Gradient and Shape */}
      <div 
        className="text-white p-3 d-flex justify-content-between align-items-center mx-3" 
        style={{ 
          maxWidth: '98%', 
          background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, 
          borderRadius: '0.5rem 0.5rem 0 0', 
        }} 
      >
        <div className="d-flex align-items-center">
          <BookOpenText size={20} className="me-2" /> 
          <span>BOQ Summary</span>
        </div>
        <div className="d-flex">
          <span className="me-3" style={{ fontSize: '0.9rem' }}>
            Unit of Measurement <strong>{boqUOM}</strong>
          </span> 
          <span style={{ fontSize: '0.9rem' }}>
            Total Quantity <strong>{boqTotalQuantity}</strong>
          </span>
        </div>
      </div>

      {/* Main Form Content Container - White Box */}
      <div 
        className="bg-white ms-3 me-3 p-4" 
        style={{ 
          maxWidth: '98%', 
          borderRadius: '0 0 0.5rem 0.5rem',
          border: `1px solid ${containerBorderColor}`, 
          borderTop: 'none',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)' // Optional soft shadow
        }}
      >
        {/* --- 1. Basic Information --- */}
        <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen>
            <p className="text-muted">Content for Basic Information will go here...</p>
        </FormSectionContainer>

        {/* --- 2. Quantity & Measurements --- */}
        <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen>
            <p className="text-muted">Content for Quantity & Measurements will go here...</p>
        </FormSectionContainer>

        {/* --- 3. Wastage & Net Quantity --- */}
        <FormSectionContainer title="Wastage & Net Quantity" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>}>
            <p className="text-muted">Content for Wastage & Net Quantity will go here...</p>
        </FormSectionContainer>

        {/* --- 4. Pricing & Currency --- */}
        <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
            <p className="text-muted">Content for Pricing & Currency will go here...</p>
        </FormSectionContainer>

        {/* --- 5. Cost Summary --- */}
        <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
            <p className="text-muted">Content for Cost Summary will go here...</p>
        </FormSectionContainer>


        {/* Action Buttons at the bottom - Dark Blue Button */}
        <div className="d-flex justify-content-end pt-3">
            <button 
                className="btn" 
                style={{ 
                    backgroundColor: darkBlue, 
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1.5rem',
                    borderRadius: '0.5rem' // Rounded button edges
                }}
            >
                Add Resource
            </button>
        </div>

      </div>

    </div>
  );
}

export default AddResource;