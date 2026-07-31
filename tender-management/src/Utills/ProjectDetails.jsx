import "flatpickr/dist/flatpickr.min.css";
import { useEffect, useRef, useState } from 'react';
import Flatpickr from "react-flatpickr";
import { FaCalendarAlt, FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import { FileText, Wrench, ArrowLeft, ArrowRight, Save, Edit2, XCircle, MapPin, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Select, { components } from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import '../CSS/custom-flatpickr.css';
import { useRegions } from "../Context/RegionsContext";
import { useScope } from "../Context/ScopeContext";
import { useSectors } from "../Context/SectorsContext";
import { useUom } from "../Context/UomContext";

function ProjectInfo({ project, feasbilityStudy, handleSubmit, region, scopePack, sector, setProject, setRegion, setSector, setScopePack, setUom, uom, loading, fileInputRef, uploadedFiles, setUploadedFiles, company, setCompany, addresses, setAddresses, techFieldValues, setTechFieldValues }) {

    const navigate = useNavigate();
    const datePickerRef = useRef();
    const [activeTab, setActiveTab] = useState('basic');
    const [techFields, setTechFields] = useState([]);
    const token = sessionStorage.getItem('token');
    const [companyOptions, setCompanyOptions] = useState([]);
    const [showFeasibilityModal, setShowFeasibilityModal] = useState(false);

    const emptyAddress = { country: null, state: null, city: null, address: '', phoneNo: '', email: '' };
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateMap, setStateMap] = useState({});
    const [cityMap, setCityMap] = useState({});

    const openCalendar = (id) => {
        const input = document.querySelector(`#${id}`);
        if (input && input._flatpickr) {
            input._flatpickr.open();
        }
    };
    const CustomMultiValueContainer = () => null;
    const CustomDropdownIndicator = () => null;
    const CustomIndicatorSeparator = () => null;
    const CustomClearIndicator = () => null;

    const regionOptions = (useRegions() || []).map(region => ({
        value: region.id,
        label: region.regionName
    }));
    const uomOptions = (useUom() || []).map(uom => ({
        value: uom.id,
        label: `${uom.uomCode} - ${uom.uomName}`
    }));
    const sectorOptions = (useSectors() || []).map(sector => ({
        value: sector.id,
        label: sector.sectorName,
    }));
    const scopeOptions = (useScope() || []).map(scopes => ({
        value: scopes.id,
        label: scopes.scope,
    }));

    // Fetch companies on mount
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/companyDetails`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(res => {
            const data = Array.isArray(res.data) ? res.data : [];
            setCompanyOptions(data.map(c => ({ value: c.id, label: c.companyName || c.name })));
        }).catch(err => console.error('Error fetching companies:', err));
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
    };

    const handleStartDateChange = (date) => {
        setProject({ ...project, startDate: date });
    };


    const handleEndDateChange = (date) => {
        if (project.startDate && date < project.startDate) {
            return;
        }
        setProject({ ...project, endDate: date });
    };

    // Fetch tech fields when sector changes
    useEffect(() => {
        if (sector) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/sector/fields/${sector}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                const fields = Array.isArray(res.data) ? res.data : res.data.data || [];
                const filtered = fields.filter(f => f.fieldSection === 'TECH');
                setTechFields(filtered);
            }).catch(err => console.error('Error fetching sector fields:', err));
        } else {
            setTechFields([]);
            setTechFieldValues({});
        }
    }, [sector]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/countries`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setCountryOptions(data.map(c => ({ value: c.id, label: c.country })));
        })
        .catch(err => console.error('Error fetching countries:', err));
    }, []);

    const fetchStates = (countryId) => {
        if (!countryId) return;
        setStateMap(prev => {
            if (prev[countryId]) return prev;
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/states/${countryId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setStateMap(curr => ({ ...curr, [countryId]: data.map(s => ({ value: s.id, label: s.state })) }));
            })
            .catch(err => console.error('Error fetching states:', err));
            return { ...prev, [countryId]: [] };
        });
    };

    const fetchCities = (stateId, addrIdx) => {
        if (!stateId) return;
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/cities/byState/${stateId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setCityMap(prev => ({ ...prev, [`${addrIdx}`]: data.map(c => ({ value: c.id, label: c.city })) }));
        })
        .catch(err => console.error('Error fetching cities:', err));
    };

    useEffect(() => {
        addresses.forEach((addr, idx) => {
            if (addr.country && !stateMap[addr.country]) {
                fetchStates(addr.country);
            }
            if (addr.state && (!cityMap[`${idx}`] || cityMap[`${idx}`].length === 0)) {
                fetchCities(addr.state, idx);
            }
        });
    }, [addresses]);

    const handleAddressChange = (index, key, value) => {
        let finalValue = value;
        if (key === 'phoneNo') {
            let sanitized = value.replace(/\D/g, '');
            if (sanitized.length > 0 && !/^[6789]/.test(sanitized)) {
                sanitized = '';
            }
            finalValue = sanitized.substring(0, 10);
        } else if (key === 'address') {
            finalValue = value.substring(0, 100);
        } else if (key === 'email') {
            finalValue = value.replace(/[^a-zA-Z0-9@\._-]/g, '').substring(0, 100);
        }
        setAddresses(prev => prev.map((addr, i) => i === index ? { ...addr, [key]: finalValue } : addr));
    };

    const addAddress = () => setAddresses(prev => [...prev, { ...emptyAddress }]);
    const removeAddress = (index) => setAddresses(prev => prev.filter((_, i) => i !== index));

    const handleTechFieldChange = (fieldId, key, value) => {
        setTechFieldValues(prev => ({
            ...prev,
            [fieldId]: {
                ...prev[fieldId],
                [key]: value
            }
        }));
    };

    const renderDynamicField = (field) => {
        const val = techFieldValues[field.id]?.value || '';
        const fieldUom = techFieldValues[field.id]?.uom || '';

        const inputProps = {
            className: 'form-input w-100',
            value: val,
            placeholder: `Enter ${field.fieldName}`,
            onChange: (e) => handleTechFieldChange(field.id, 'value', e.target.value),
        };

        switch (field.fieldType) {
            case 'NUMBER':
                return (
                    <input
                        type="number"
                        step="any"
                        {...inputProps}
                        onChange={(e) => handleTechFieldChange(field.id, 'value', e.target.value)}
                        onWheel={(e) => e.target.blur()}
                    />
                );
            case 'DATE':
                return (
                    <Flatpickr
                        className="form-input w-100"
                        placeholder={`Select ${field.fieldName}`}
                        options={{ dateFormat: 'd-m-Y' }}
                        value={val}
                        onChange={([date]) => handleTechFieldChange(field.id, 'value', date)}
                    />
                );
            default:
                return <input type="text" {...inputProps} />;
        }
    };

    // Function to handle removal of an external scope tag
    const handleScopeRemove = (idToRemove) => {
        setScopePack(scopePack.filter(id => id !== idToRemove));
    };

    return (
        <div className="project-info-input">
            <div className="bg-white rounded-3 shadow-sm mb-4 mt-3">
                <div className="d-flex justify-content-between border-bottom overflow-auto">
                    {[
                        { id: "basic", label: "Basic Details", icon: <FileText size={18} className="me-2" /> },
                        { id: "address", label: "Address", icon: <MapPin size={18} className="me-2" /> },
                        { id: "technical", label: "Technical Details", icon: <Wrench size={18} className="me-2" /> }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`custom-tab d-flex align-items-center justify-content-center px-4 py-3 text-nowrap w-100 h-100 ${activeTab === tab.id ? "active" : ""}`}
                            onClick={() => {
                                if (activeTab !== tab.id) setActiveTab(tab.id);
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'basic' && (
                <div className="mb-4 pb-5 pt-3 bg-white rounded-3 mt-4" style={{}}>
                    <div className="row align-items-center ms-4 me-4">
                        <div className="col-12 mt-3 mb-4">
                            <label className="projectform-select text-start d-block">
                                Company <span style={{ color: 'red' }}>*</span>
                            </label>
                            <Select
                                options={companyOptions}
                                placeholder="Select Company"
                                className="w-100"
                                classNamePrefix="select"
                                isClearable
                                value={companyOptions.find(o => o.value === company) || null}
                                onChange={(opt) => setCompany(opt ? opt.value : null)}
                            />
                        </div>
                    </div>
                    <div className="row align-items-center ms-4 me-4 ">
                        <div className="col-md-6 mt-3 mb-4">
                            <label className="projectform text-start d-block">
                                Project Name <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input type="text" className="form-input w-100" placeholder="Enter Project Name"
                                value={project.projectName}
                                onChange={(e) => setProject({ ...project, projectName: e.target.value.replace(/[^A-Za-z ]/g, '').substring(0, 100) })}
                            />
                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                {(project.projectName || "").length}/100
                            </div>
                        </div>
                        <div className="col-md-6 mt-3 mb-4">
                            <label className="projectform  text-start d-block">
                                Short Name <span style={{ color: 'red' }}>*</span>
                            </label>
                            <input type="text" className="form-input w-100" placeholder="Enter Short Name"
                                value={project.shortName}
                                onChange={(e) => setProject({ ...project, shortName: e.target.value.replace(/[^A-Za-z ]/g, '').substring(0, 50) })}
                            />
                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                {(project.shortName || "").length}/50
                            </div>
                        </div>
                    </div>
                    {/* <div className="row align-items-center ms-4 me-4 ">
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform  text-start d-block">Agreement date</label>
                        <Flatpickr
                            id="agreementDate"
                            className="form-input w-100"
                            placeholder="Select Agreement date"
                            options={{ dateFormat: "d-m-Y" }}
                            value={project.agreementDate}
                            onChange={([date]) => setProject({ ...project, agreementDate: date })}
                            ref={datePickerRef}
                        />
                        <span className='calender-icon' onClick={() => openCalendar('agreementDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                    </div>
                    <div className="col-md-6 mt-3 mb-4">
                        <label className="projectform  text-start d-block">Agreement number </label>
                        <input type="text" className="form-input w-100" placeholder="Enter Agreement number"
                            value={project.agreementNumber}
                            onChange={(e) => setProject({ ...project, agreementNumber: e.target.value })}

                        />
                    </div>
                </div> */}
                    <div className="row align-items-center ms-4 me-4 ">
                        <div className="col-md-6 mt-3 mb-4">
                            <label className="projectform text-start d-block"> Start date </label>
                            <Flatpickr
                                id="startDate"
                                className="form-input w-100"
                                placeholder="Select Start date"
                                options={{ dateFormat: "d-m-Y" }}
                                value={project.startDate}
                                onChange={([date]) => handleStartDateChange(date)}
                                ref={datePickerRef}
                            />
                            <span className='calender-icon' onClick={() => openCalendar('startDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                        </div>
                        <div className="col-md-6 mt-3 mb-4">
                            <label className="projectform text-start d-block">End date</label>
                            <Flatpickr
                                id="endDate"
                                className="form-input w-100"
                                placeholder="Select End date"
                                options={{ dateFormat: "d-m-Y", minDate: project.startDate, }}
                                value={project.endDate}
                                onChange={([date]) => handleEndDateChange(date)}
                                ref={datePickerRef}
                            />
                            <span className='calender-icon' onClick={() => openCalendar('endDate')}><FaCalendarAlt size={18} color='#005197' /></span>
                        </div>
                    </div>
                    <div className="row align-items-center ms-4 me-4">
                        <div className="col-md-6 position-relative mt-3 mb-4">
                            <label className="projectform-select text-start d-block">
                                Region
                            </label>
                            <Select
                                options={regionOptions}
                                placeholder="Select Region"
                                className="w-100"
                                classNamePrefix="select"
                                isClearable
                                value={regionOptions.find((option) => option.value === region)}
                                onChange={(option) => setRegion(option ? option.value : null)}
                            />
                        </div>

                        <div className="col-md-6 mt-3 mb-4">
                            <label className="projectform-select  text-start d-block">
                                Sector
                            </label>
                            <Select options={sectorOptions} placeholder="Select Sector" className="w-100" classNamePrefix="select"
                                isClearable
                                value={sectorOptions.find((option) => option.value === sector)}
                                onChange={(option) => setSector(option ? option.value : null)}
                            />
                        </div>
                    </div>
                    <div className="row align-items-center ms-4 me-4">
                        <div className="col-12 mt-3">
                            <label className="projectform-select text-start d-block">
                                Scope of Packages
                            </label>
                            <Select
                                options={[{ value: 'select-all', label: 'Select All' }, ...scopeOptions]}
                                isMulti
                                placeholder="Select Scope of Packages"
                                className="w-100"
                                classNamePrefix="select"
                                value={scopeOptions.filter(opt => scopePack.includes(opt.value))}
                                onChange={(selected, actionMeta) => {
                                    if (actionMeta.option?.value === 'select-all') {
                                        if (scopePack.length === scopeOptions.length) {
                                            setScopePack([]);
                                        } else {
                                            setScopePack(scopeOptions.map(o => o.value));
                                        }
                                    } else {
                                        setScopePack(selected ? selected.filter(s => s.value !== 'select-all').map(s => s.value) : []);
                                    }
                                }}
                                hideSelectedOptions={false}
                                closeMenuOnSelect={false}
                                components={{
                                    Option: ({ children, ...props }) => {
                                        const isSelectAll = props.data.value === 'select-all';
                                        const allSelected = scopePack.length === scopeOptions.length;
                                        return (
                                            <components.Option {...props}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelectAll ? allSelected : props.isSelected}
                                                    onChange={() => null}
                                                    style={{ marginRight: 10, accentColor: '#005197' }}
                                                />
                                                <span style={isSelectAll ? { fontWeight: 'bold', color: '#005197' } : {}}>
                                                    {children}
                                                </span>
                                            </components.Option>
                                        );
                                    },
                                    MultiValueContainer: CustomMultiValueContainer,
                                    IndicatorSeparator: CustomIndicatorSeparator,
                                    DropdownIndicator: CustomDropdownIndicator,
                                    ClearIndicator: CustomClearIndicator,
                                }}
                                styles={{
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.data?.value === 'select-all'
                                            ? (state.isFocused ? '#EFF6FF' : '#f8f9fa')
                                            : state.isSelected ? '#DBEAFE' : state.isFocused ? '#EFF6FF' : 'white',
                                        color: state.isSelected || state.data?.value === 'select-all' ? '#005197' : 'black',
                                        cursor: 'pointer',
                                        borderBottom: state.data?.value === 'select-all' ? '1px solid #e0e0e0' : 'none',
                                        '&:active': { backgroundColor: '#DBEAFE' },
                                        '&:hover': { backgroundColor: state.isSelected ? '#DBEAFE' : '#EFF6FF' }
                                    })
                                }}
                            />
                            <div className="mt-2 d-flex flex-wrap gap-2">
                                {scopeOptions.filter(opt => scopePack.includes(opt.value))
                                    .map(selectedOpt => (
                                        <span key={selectedOpt.value} className="select__multi-value">
                                            <span className="select__multi-value__label">
                                                {selectedOpt.label}
                                            </span>
                                            <span
                                                className="select__multi-value__remove"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleScopeRemove(selectedOpt.value);
                                                }}
                                            >
                                                &times;
                                            </span>
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'address' && (
                <div className="mb-4 pb-5 pt-3 bg-white rounded-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center ms-4 me-4 mt-3 mb-3">
                        <h6 className="fw-bold mb-0" style={{ color: '#005197' }}>Project Addresses</h6>
                        <button className="btn action-button d-flex align-items-center" onClick={addAddress}>
                            <Plus size={16} className="me-1" /> Add Address
                        </button>
                    </div>
                    {addresses.map((addr, idx) => (
                        <div key={idx} className="border rounded-3 mx-4 mb-4 p-3 position-relative" style={{ backgroundColor: 'white' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="fw-bold" style={{ color: '#005197' }}>Address {idx + 1}</span>
                                {addresses.length > 1 && (
                                    <button className="btn btn-sm" onClick={() => removeAddress(idx)}>
                                        <Trash2 size={16} className="text-danger" />
                                    </button>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="projectform-select text-start d-block">Country</label>
                                    <Select
                                        options={countryOptions}
                                        placeholder="Select Country"
                                        className="w-100"
                                        classNamePrefix="select"
                                        isClearable
                                        value={countryOptions.find(o => String(o.value) === String(addr.country) || String(o.label).toLowerCase() === String(addr.country).toLowerCase()) || null}
                                        onChange={(opt) => {
                                            handleAddressChange(idx, 'country', opt ? opt.value : null);
                                            handleAddressChange(idx, 'state', null);
                                            handleAddressChange(idx, 'city', null);
                                            setCityMap(prev => ({ ...prev, [`${idx}`]: [] }));
                                        }}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="projectform-select text-start d-block">State</label>
                                    <Select
                                        options={addr.country ? (stateMap[addr.country] || []) : []}
                                        placeholder="Select State"
                                        className="w-100"
                                        classNamePrefix="select"
                                        isClearable
                                        value={(stateMap[addr.country] || []).find(o => String(o.value) === String(addr.state) || String(o.label).toLowerCase() === String(addr.state).toLowerCase()) || null}
                                        onChange={(opt) => {
                                            handleAddressChange(idx, 'state', opt ? opt.value : null);
                                            handleAddressChange(idx, 'city', null);
                                            if (!opt) {
                                                setCityMap(prev => ({ ...prev, [`${idx}`]: [] }));
                                            }
                                        }}
                                        isDisabled={!addr.country}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="projectform-select text-start d-block">City</label>
                                    <Select
                                        options={cityMap[`${idx}`] || []}
                                        placeholder="Select City"
                                        className="w-100"
                                        classNamePrefix="select"
                                        isClearable
                                        value={(cityMap[`${idx}`] || []).find(o => String(o.value) === String(addr.city) || String(o.label).toLowerCase() === String(addr.city).toLowerCase()) || null}
                                        onChange={(opt) => handleAddressChange(idx, 'city', opt ? opt.value : null)}
                                        isDisabled={!addr.state}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="projectform text-start d-block">Address</label>
                                    <input type="text" className="form-input w-100" placeholder="Enter full address"
                                        value={addr.address}
                                        onChange={(e) => handleAddressChange(idx, 'address', e.target.value)}
                                    />
                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                        {(addr.address || "").length}/100
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="projectform text-start d-block">Phone No</label>
                                    <input type="text" className="form-input w-100" placeholder="Enter Phone Number"
                                        value={addr.phoneNo}
                                        onChange={(e) => handleAddressChange(idx, 'phoneNo', e.target.value)}
                                    />
                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                        {(addr.phoneNo || "").length}/10
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="projectform text-start d-block">Email</label>
                                    <input type="text" className="form-input w-100" placeholder="Enter email address"
                                        value={addr.email}
                                        onChange={(e) => handleAddressChange(idx, 'email', e.target.value)}
                                    />
                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                        {(addr.email || "").length}/100
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'technical' && (
                <>
                    <div className="mb-4 pb-4 pt-5 bg-white rounded-3 mt-4" style={{}}>
                        <div className="row align-items-center ms-4 me-4">
                            <div className="col-md-4 mt-3 mb-4">
                                <label className="projectform-select text-start d-block">
                                    UOM <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Select options={uomOptions} placeholder="Select Unit of Measurements" className="w-100" classNamePrefix="select" isClearable
                                    value={uomOptions.find((option) => option.value === uom)}
                                    onChange={(option) => setUom(option ? option.value : null)}
                                />
                            </div>
                            {techFields.length > 0 ? (
                                techFields.map((field) => (
                                    <div className="col-md-4 mt-3 mb-4" key={field.id}>
                                        <label className="projectform text-start d-block">
                                            {field.fieldName}
                                            {field.mandatory && <span style={{ color: 'red' }}> *</span>}
                                        </label>
                                        {renderDynamicField(field)}
                                    </div>
                                ))
                            ) : (
                                <div className="col-12 text-center text-muted py-4">
                                    {sector ? 'No technical fields configured for this sector' : 'Please select a sector in Basic Details to view technical fields'}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='mb-3 bg-white'>
                        <div className='upload-file row p-3 ms-auto me-auto'>
                            <div className='col-12 text-center'>
                                <FaCloudUploadAlt size={48} />
                            </div>
                            <div className='col-12 text-center mt-2'>
                                Optional Documents
                            </div>
                            <div className='col-12 text-center mt-2 py-2'>
                                <button className='btn action-button mt-2' onClick={() => { fileInputRef.current.click() }}>Choose File</button>
                                <input type="file" ref={fileInputRef} multiple style={{ display: 'none' }} onChange={handleFileChange} />
                            </div>
                            {uploadedFiles.length > 0 && (
                                <div className="mt-3 px-3 text-start">
                                    <div className="row g-3">
                                        {uploadedFiles.map((file, idx) => (
                                            <div key={idx} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                                <div className="border rounded p-2 position-relative bg-light">
                                                    <FaTimes
                                                        size={16}
                                                        className="position-absolute top-0 end-0 m-2 text-danger"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() =>
                                                            setUploadedFiles(prev => prev.filter((_, i) => i !== idx))
                                                        }
                                                    />
                                                    <div className="small text-truncate">{file.name}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </>
            )}

            <div className="d-flex justify-content-between mt-3 mb-3">
                <div className="d-flex gap-3 ms-4">
                    {activeTab === 'basic' ? (
                        <button type="button" className="btn cancel-button d-flex align-items-center" onClick={() => { navigate(-1); }} disabled={loading}>
                            <XCircle size={18} className="me-2" /> Cancel
                        </button>
                    ) : (
                        <button type="button" className="btn cancel-button d-flex align-items-center" onClick={() => {
                            if (activeTab === 'address') setActiveTab('basic');
                            else if (activeTab === 'technical') setActiveTab('address');
                        }} disabled={loading}>
                            <ArrowLeft size={18} className="me-2" /> Previous
                        </button>
                    )}
                </div>
                <div className="d-flex me-4">
                    {activeTab === 'technical' ? (
                        <button type="button" className="btn action-button d-flex align-items-center" onClick={() => {
                            const isFeasibilityConcluded = project.needFeasibility === false || (feasbilityStudy && (
                                feasbilityStudy.feasibilityApproved === true || 
                                feasbilityStudy.feasibilityApproved === false || 
                                feasbilityStudy.feasibilityStatus === 'APPROVED' || 
                                feasbilityStudy.feasibilityStatus === 'REJECTED' || 
                                feasbilityStudy.status === 'APPROVED' || 
                                feasbilityStudy.status === 'REJECTED'
                            ));
                            if (isFeasibilityConcluded) {
                                handleSubmit(project.needFeasibility);
                            } else {
                                setShowFeasibilityModal(true);
                            }
                        }} disabled={loading}>
                            {loading ? (<span className="spinner-border spinner-border-sm text-white me-2"></span>) : (project.id ? <><Edit2 size={18} className="me-2" /> Edit</> : <><Save size={18} className="me-2" /> Save</>)}
                        </button>
                    ) : (
                        <button type="button" className="btn action-button d-flex align-items-center" onClick={() => {
                            if (activeTab === 'basic') setActiveTab('address');
                            else if (activeTab === 'address') setActiveTab('technical');
                        }}>
                            Next <ArrowRight size={18} className="ms-2" />
                        </button>
                    )}
                </div>
            </div>

            {/* Feasibility Selection Modal */}
            {showFeasibilityModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title fw-bold" style={{ color: '#005197' }}>Feasibility Analysis</h5>
                                <button type="button" className="btn-close" onClick={() => setShowFeasibilityModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-0">Is Feasibility Analysis needed for this project?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => {
                                    setShowFeasibilityModal(false);
                                    handleSubmit(false);
                                }}>No</button>
                                <button type="button" className="btn action-button" onClick={() => {
                                    setShowFeasibilityModal(false);
                                    handleSubmit(true);
                                }}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default ProjectInfo;