import React, { useState, useEffect, useCallback, useMemo } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AddResource() {
    const navigate = useNavigate();

    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 
    const boqUOM = ""; 
    const boqTotalQuantity = ""; 

    const handleUnauthorized = () => {
        toast.error('Unauthorized! Please login again.');
        navigate('/login');
    };

    // Resource Types
    const [resourceTypes, setResourceTypes] = useState([]);
    const fetchResourceTypes = useCallback(() => {
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            }
          })
          .then((res) => {
            if (res.status === 200) {
              setResourceTypes(res.data);
            }
          })
          .catch((err) => {
            if (err?.response?.status === 401) {
              handleUnauthorized();
            } else {
              toast.error('Failed to fetch resource types.');
            }
          });
    }, []);

    useEffect(() => {
        fetchResourceTypes();
    }, [fetchResourceTypes]);

    const resourceTypeOptions = useMemo(
        () => resourceTypes.map(item => ({
            value: item.id,
            label: item.resourceTypeName
        })),
        [resourceTypes]
    );

    // Quantity Types
    const [quantityType, setQuantityType] = useState([]);
    const fetchQuantityType = useCallback(() => {
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            if (res.status === 200) {
              setQuantityType(res.data);
            }
          })
          .catch((err) => {
            if (err?.response?.status === 401) {
              handleUnauthorized();
            } else {
              toast.error('Failed to fetch quantity types.');
            }
          });
    }, []);

    useEffect(() => {
        fetchQuantityType();
    }, [fetchQuantityType]);

    const quantityTypeOptions = useMemo(
        () =>
            quantityType.map((item) => ({
                value: item.id,
                label: item.quantityType,
            })),
        [quantityType]
    );

    const handleBack = () => {
        navigate(-1); 
    };

    const emptyOption = [{ value: '', label: '' }];

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? darkBlue : provided.borderColor, 
            boxShadow: state.isFocused ? `0 0 0 0.25rem rgba(0, 81, 151, 0.25)` : provided.boxShadow, 
            minHeight: '38px', 
            width: '100%',
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
            color: '#000000', 
        }),
        indicatorSeparator: () => ({
            display: 'none', 
        }),
    };

    const FormSectionContainer = ({ title, icon, defaultOpen = false, children }) => {
        const isStatic = ['Basic Information', 'Quantity & Measurements', 'Cost Summary'].includes(title);
        const [isOpen, setIsOpen] = useState(isStatic || defaultOpen); 
        
        const headerStyle = {
            cursor: isStatic ? 'default' : 'pointer',
            listStyle: 'none',
            backgroundColor: containerBgColor,
            border: `1px solid ${containerBorderColor}`,
            borderBottom: (isStatic || isOpen) ? 'none' : `1px solid ${containerBorderColor}`, 
            borderRadius: (isStatic || isOpen) ? '0.5rem 0.5rem 0 0' : '0.5rem',
            marginBottom: '0', 
        };

        const contentStyle = { 
            backgroundColor: 'white', 
            padding: '1rem 1.5rem', 
            borderLeft: `1px solid ${containerBorderColor}`, 
            borderRight: `1px solid ${containerBorderColor}`, 
            borderBottom: `1px solid ${containerBorderColor}`, 
            borderRadius: '0 0 0.5rem 0.5rem',
            marginTop: '0' 
        };

        const HeaderContent = (
            <div className="py-3 px-4 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    {icon}
                    <span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span>
                </div>
                {!isStatic && <ChevronDown size={20} style={{ color: vibrantBlue, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />} 
            </div>
        );

        return (
            <div className="mx-3 mb-4">
                <div 
                    style={headerStyle} 
                    onClick={() => { if (!isStatic) setIsOpen(!isOpen); }} 
                >
                    {HeaderContent}
                </div>
                {isOpen && <div style={contentStyle}>{children}</div>}
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
                className="text-white p-3 d-flex justify-content-between align-items-center mx-3 mb-4" 
                style={{ 
                    background: `linear-gradient(to right, ${darkBlue}, ${vibrantBlue})`, 
                    borderRadius: '0.5rem', 
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

            {/* Basic Information Section */}
            <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select 
                                options={resourceTypeOptions} 
                                styles={customStyles} 
                                placeholder="Select Resource Type"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Resource Name <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select options={emptyOption} styles={customStyles} placeholder="Select Resource Name"/>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            {/* Quantity & Measurements Section */}
            <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Quantity Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }} className="ms-auto">
                            <Select options={quantityTypeOptions} styles={customStyles} placeholder="Select Quantity Type"/>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

        </div>
    );
}

export default AddResource;
