import React, { useState, useEffect, useCallback, useMemo } from "react";
import Select from "react-select";
import { ArrowLeft, BookOpenText, ChevronDown, AlignLeft, DollarSign, Calculator, Settings } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useUom } from "../Context/UomContext";

function AddResource() {
    const navigate = useNavigate();

    const darkBlue = '#005197';
    const vibrantBlue = '#007BFF';
    const containerBgColor = '#EFF6FF'; 
    const containerBorderColor = '#dee2e6'; 
    const boqUOM = ""; 
    const boqTotalQuantity = ""; 

    const [resourceTypes, setResourceTypes] = useState([]);
    const [resources, setResources] = useState([]);
    const [resourceNature, setResourceNature] = useState([]);
    const [selectedResourceType, setSelectedResourceType] = useState(null);
    const [quantityType, setQuantityType] = useState([]); 
    const [currency, setCurrency] = useState([]);
    const [selectedUom, setSelectedUom] = useState(null);

    // Resource data state
    const [resourceData, setResourceData] = useState({
        docNumber: "",
        coEfficient: 0,
        calculatedQuantity: 0,
        wastePercentage: 0,
        wasteQuantity: 0,
        netQuantity: 0,
        rate: 0,
        additionalRate: 0,
        shippingPrice: 0,
        costUnitRate: 0,
        resourceTotalCost: 0,
        rateLock: false,
        exchangeRate: 1,
        totalCostCompanyCurrency: 0,
        resourceTypeId: "",
        quantityTypeId: "",
        resourceNatureId: "",
        uomId: "",
        currencyId: "",
        resourceId: "",
        boqId: "",
        projectId: ""
    });

    const uomOptions = useMemo(() => 
      useUom().map(uom => ({ value: uom.id, label: uom.uomName })),
      [useUom()]
    );

    // API fetch functions
    const fetchResourceTypes = useCallback(() => {
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
          })
          .then((res) => { if (res.status === 200) setResourceTypes(res.data); })
          .catch((err) => { toast.error('Failed to fetch resource types.'); });
    }, []);

    useEffect(() => { fetchResourceTypes(); }, [fetchResourceTypes]);

    const fetchResourceNature = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setResourceNature(res.data); })
        .catch((err) => { toast.error('Failed to fetch resource natures.'); });
    }, []);
    useEffect(() => { fetchResourceNature(); }, [fetchResourceNature]);

    const fetchResources = useCallback((resTypeId) => {
      if (!resTypeId) return;
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/resources/${resTypeId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setResources(res.data); })
        .catch((err) => { toast.error('Failed to fetch resources.'); });
    }, []);

    const fetchQuantityType = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setQuantityType(res.data); })
        .catch((err) => { toast.error('Failed to fetch quantity types.'); });
    }, []);
    useEffect(() => { fetchQuantityType(); }, [fetchQuantityType]);

    const fetchCurrency = useCallback(() => {
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        })
        .then((res) => { if (res.status === 200) setCurrency(res.data); })
        .catch((err) => { toast.error('Failed to fetch currencies.'); });
    }, []);
    useEffect(() => { fetchCurrency(); }, [fetchCurrency]);

    // Options for selects
    const resourceTypeOptions = useMemo(() => resourceTypes.map(item => ({ value: item.id, label: item.resourceTypeName })), [resourceTypes]);
    const resourceOption = useMemo(() => resources.map(item => ({ value: item.id, label: `${item.resourceCode}-${item.resourceName}` })), [resources]);
    const resourceNatureOption = useMemo(() => resourceNature.map(item => ({ value: item.id, label: item.nature })), [resourceNature]);
    const quantityTypeOption = useMemo(() => quantityType.map(item => ({ value: item.id, label: item.quantityType })), [quantityType]);
    const currencyOptions = useMemo(() => currency.map(item => ({ value: item.id, label: item.currencyName })), [currency]);

    const handleBack = () => navigate(-1);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderRadius: '0.5rem',
            borderColor: state.isFocused ? darkBlue : provided.borderColor, 
            boxShadow: state.isFocused ? `0 0 0 0.25rem rgba(0, 81, 151, 0.25)` : provided.boxShadow, 
            minHeight: '38px', 
            width: '100%',
        }),
        placeholder: (provided) => ({ ...provided, color: '#adb5bd' }),
        singleValue: (provided) => ({ ...provided, color: '#212529' }),
        dropdownIndicator: (provided) => ({ ...provided, color: '#000000' }),
        indicatorSeparator: () => ({ display: 'none' }),
    };

    // Calculation function
    const handleCalculations = (updatedData) => {
        const data = { ...resourceData, ...updatedData };
        const coEfficient = parseFloat(data.coEfficient) || 1;
        const wastePercentage = parseFloat(data.wastePercentage) || 0;
        const rate = parseFloat(data.rate) || 0;
        const additionalRate = parseFloat(data.additionalRate) || 0;
        const shippingPrice = parseFloat(data.shippingPrice) || 0;
        const exchangeRate = parseFloat(data.exchangeRate) || 1;

        const calculatedQuantity = (boqTotalQuantity || 0) * coEfficient;
        const wasteQuantity = calculatedQuantity * (wastePercentage / 100);
        const netQuantity = calculatedQuantity + wasteQuantity;
        const unitRate = netQuantity > 0 ? rate + additionalRate + (shippingPrice / netQuantity) : 0;
        const totalCostCompanyCurrency = unitRate * netQuantity;
        const resourceTotalCost = totalCostCompanyCurrency * exchangeRate;

        setResourceData((prev) => ({
          ...prev,
          ...data,
          calculatedQuantity,
          wasteQuantity,
          netQuantity,
          costUnitRate: unitRate,
          resourceTotalCost: resourceTotalCost,
          totalCostCompanyCurrency: totalCostCompanyCurrency,
        }));
    };

    // Submit API
    const handleAddResource = () => {
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/tenderEstimation/addResources`, resourceData, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}`, 'Content-Type': 'application/json' }
        })
        .then(res => {
            toast.success("Resource added successfully!");
            navigate(-1);
        })
        .catch(err => {
            toast.error(err?.response?.data || "Failed to add resource.");
        });
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
                <div className="d-flex align-items-center">{icon}<span className="ms-2 text-primary fw-bold" style={{ fontSize: '1rem' }}>{title}</span></div>
                {!isStatic && <ChevronDown size={20} style={{ color: vibrantBlue, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />} 
            </div>
        );
        return (
            <div className="mx-3 mb-4">
                <div style={headerStyle} onClick={() => { if (!isStatic) setIsOpen(!isOpen); }}>{HeaderContent}</div>
                {isOpen && <div style={contentStyle}>{children}</div>}
            </div>
        );
    };

    return (
        <div className="container-fluid min-vh-100">
            {/* === Entire existing JSX remains unchanged === */}
            {/* AddResource button wired to handleAddResource */}
            <div className="d-flex justify-content-end pt-3 me-3"> 
                <button 
                    className="btn" 
                    style={{ backgroundColor: darkBlue, color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '0.5rem' }}
                    onClick={handleAddResource}
                >
                    Add Resource
                </button>
            </div>
        </div>
    );
}

export default AddResource;
