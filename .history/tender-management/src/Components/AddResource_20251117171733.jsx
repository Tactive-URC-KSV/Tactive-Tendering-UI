import React, { useState } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function AddResource() {
    const navigate = useNavigate();
    
    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 
    const boqUOM = "CUM"; 
    const boqTotalQuantity = "3922.494"; 

    const handleBack = () => {
        navigate(-1); 
    };

    const resourceTypeOptions = [
        { value: 'labor', label: 'Labor' },
        { value: 'material', label: 'Material' },
        { value: 'equipment', label: 'Equipment' },
    ];
    const emptyOption = [{ value: '', label: '' }];
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? darkBlue : provided.borderColor, 
            boxShadow: state.isFocused ? `0 0 0 0.25rem rgba(0, 81, 151, 0.25)` : provided.boxShadow, 
            minHeight: '38px', 
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#adb5bd', 
        }),
        singleValue: (provided) => ({
            ...provided,
            color: '#212529', 
        }),
        dropdownIndicator: (provided) => ({
        ...provided,
        color: darkBlue, 
    }),
    };
    const FormSectionContainer = ({ title, icon, defaultOpen = false, children }) => {
        const isStatic = ['Basic Information', 'Quantity & Measurements', 'Cost Summary'].includes(title);
        
        const headerStyle = {
            cursor: isStatic ? 'default' : 'pointer',
            listStyle: 'none',
            backgroundColor: containerBgColor,
            border: `1px solid ${containerBorderColor}`,
            borderRadius: '0.5rem',
            marginBottom: '1rem',
        };

        const contentStyle = { 
            padding: '1rem 1.5rem', 
            borderLeft: `1px solid ${containerBorderColor}`, 
            borderRight: `1px solid ${containerBorderColor}`, 
            borderBottom: `1px solid ${containerBorderColor}`, 
            borderRadius: '0 0 0.5rem 0.5rem',
            marginTop: '-1rem' 
        };

        const HeaderContent = (
            <div className="py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    {icon}
                    <span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span>
                </div>
                {!isStatic && <ChevronDown size={20} className="text-secondary" />}
            </div>
        );

        if (isStatic) {
            return (
                <div className="mb-4">
                    <div style={headerStyle}>{HeaderContent}</div>
                    <div style={contentStyle}>{children}</div>
                </div>
            );
        }

        return (
            <div className="mb-4">
                <details open={defaultOpen}>
                    <summary style={headerStyle}>{HeaderContent}</summary>
                    <div style={contentStyle}>{children}</div>
                </details>
            </div>
        );
    };

    return (
        <div className="container-fluid min-vh-100">
            
            <div className="ms-3 d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-start">
                    <ArrowLeft size={20} onClick={handleBack} style={{ cursor: 'pointer' }} />
                    <span className="ms-2">Add New Resource</span>
                </div>
            </div>
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

            <div 
                className="bg-white ms-3 me-3 p-4" 
                style={{ 
                    maxWidth: '98%', 
                    borderRadius: '0 0 0.5rem 0.5rem',
                    border: `1px solid ${containerBorderColor}`, 
                    borderTop: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}
            >
                <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Resource Type</label>
                            <Select 
                                options={resourceTypeOptions} 
                                styles={customStyles} 
                                placeholder=""
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Nature</label>
                            <Select 
                                options={emptyOption} 
                                styles={customStyles} 
                                placeholder=""
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Resource Name</label>
                            <Select 
                                options={emptyOption} 
                                styles={customStyles} 
                                placeholder="Select resource"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Rate</label>
                            <input type="number" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" />
                        </div>
                    </div>
                </FormSectionContainer>
                <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">UOM</label>
                            <Select 
                                options={emptyOption} 
                                styles={customStyles} 
                                placeholder=""
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Quantity Type</label>
                            <Select 
                                options={emptyOption} 
                                styles={customStyles} 
                                placeholder=""
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Coefficient</label>
                            <input type="number" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Calculated Quantity</label>
                            <input type="text" className="form-control" style={{ borderRadius: '0.5rem' }} placeholder="0.00" readOnly />
                        </div>
                    </div>
                </FormSectionContainer>
                <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
                    <p className="text-muted">Fields for Wastage and Net Quantity will go here...</p>
                </FormSectionContainer>
                <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
                    <p className="text-muted">Fields for Pricing and Currency will go here...</p>
                </FormSectionContainer>
                <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                    <div className="d-flex justify-content-end align-items-center mb-3">
                        <span className="me-2">Rate Lock</span>
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
                        </div>
                    </div>
                    <div className="row g-3 text-center">
                        <div className="col-md-4"><div className="p-3 border rounded"><div className="text-muted">Cost Unit Rate</div><div className="fw-bold">0.00</div><small className="text-muted">per CUM</small></div></div>
                        <div className="col-md-4"><div className="p-3 border rounded" style={{ backgroundColor: '#e9f5ff' }}><div className="text-muted">Cost Unit Rate</div><div className="fw-bold">0.00</div><small className="text-muted">per CUM</small></div></div>
                        <div className="col-md-4"><div className="p-3 border rounded" style={{ backgroundColor: '#e6ffe6' }}><div className="text-muted">Cost Unit Rate</div><div className="fw-bold">0.00</div><small className="text-muted">per CUM</small></div></div>
                    </div>
                </FormSectionContainer>
                <div className="d-flex justify-content-end pt-3">
                    <button 
                        className="btn" 
                        style={{ 
                            backgroundColor: darkBlue, 
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '0.5rem' 
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