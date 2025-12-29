import { useState, useEffect } from 'react';
import { Building2, MapPin, Mail, Landmark, Users, UploadCloud, FileText, X, Handshake, Info, Languages, Calendar } from 'lucide-react';
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import '../CSS/custom-flatpickr.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function CompanyDetails() {
    const bluePrimary = "#005197";

    const CalendarIcon = (props) => (
        <Calendar {...props} size={18} stroke="#005197" />
    );
    const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
    const [companyLevelOptions, setCompanyLevelOptions] = useState([]);
    const [companyStatusOptions, setCompanyStatusOptions] = useState([]);
    const [companyNatureOptions, setCompanyNatureOptions] = useState([]);
    const [constitutionOptions, setConstitutionOptions] = useState([]);
    const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);
    const [languageOptions, setLanguageOptions] = useState([]);
    const [territoryTypeOptions, setTerritoryTypeOptions] = useState([]);
    const [taxTypeOptions, setTaxTypeOptions] = useState([]);
    const [additionalInfoTypeOptions, setAdditionalInfoTypeOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [addressTypeOptions, setAddressTypeOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [citiesOption, setCitiesOption] = useState([]);
    const [territoryOptions, setTerritoryOptions] = useState([]);
    const [isLoadingTerritory, setIsLoadingTerritory] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const toOptions = (data, labelKey) =>
        (data || [])
            .filter(item => item.active !== false)
            .map(item => ({
                value: item.id,
                label: item[labelKey]
            }));
    const getSelectedOption = (value, options) =>
        options.find(opt => opt.value === value) || null;
    const token = sessionStorage.getItem("token");
    useEffect(() => {
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        axios.get(`${baseUrl}/companyType`, { headers })
            .then(r => setCompanyTypeOptions(
                (r.data?.data ?? r.data ?? []).map(item => ({
                    value: item.code,
                    label: item.label
                }))
            ));
        axios.get(`${baseUrl}/companyLevel`, { headers })
            .then(r => setCompanyLevelOptions(toOptions(r.data, "level")));
        axios.get(`${baseUrl}/companyStatus`, { headers })
            .then(r => setCompanyStatusOptions(toOptions(r.data, "comStatus")));
        axios.get(`${baseUrl}/companyNature`, { headers })
            .then(r => setCompanyNatureOptions(toOptions(r.data, "comNature")));
        axios.get(`${baseUrl}/companyConstitution`, { headers })
            .then(r => setConstitutionOptions(toOptions(r.data, "comConstitution")));
        axios.get(`${baseUrl}/businessNature`, { headers })
            .then(r => setNatureOfBusinessOptions(toOptions(r.data, "businessNature")));
        axios.get(`${baseUrl}/language`, { headers })
            .then(r => setLanguageOptions(toOptions(r.data, "language")));
        axios.get(`${baseUrl}/territoryType`, { headers })
            .then(r => setTerritoryTypeOptions(r.data.map(item => ({ value: item.code, label: item.label }))));
        axios.get(`${baseUrl}/taxType`, { headers })
            .then(r => setTaxTypeOptions(toOptions(r.data, "taxType")));
        axios.get(`${baseUrl}/identityType`, { headers })
            .then(r => setAdditionalInfoTypeOptions(toOptions(r.data, "idType")));
        axios.get(`${baseUrl}/project/currency`, { headers })
            .then(r => setCurrencyOptions(toOptions(r.data, "currencyName")))
        axios.get(`${baseUrl}/addressType`, { headers })
            .then(r => setAddressTypeOptions(toOptions(r.data, "addressType")))
        axios.get(`${baseUrl}/countries`, { headers })
            .then(r => setCountryOptions(toOptions(r.data, "country")))
        axios.get(`${baseUrl}/cities`, { headers })
            .then(r => setCitiesOption(toOptions(r.data, "city")))
    }, []);
    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };
    const removeFile = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    const fetchTerritory = async (territoryTypeId) => {
        if (!territoryTypeId) {
            setTerritoryOptions([]);
            setTaxDetails(prev => ({ ...prev, territoryTypeId: null, territory: null }));
            return;
        }

        setIsLoadingTerritory(true);
        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            let url = '';
            let response = [];
            switch (territoryTypeId) {
                case 'COUNTRY':
                    url = `${import.meta.env.VITE_API_BASE_URL}/countries`;
                    response = await axios.get(url, { headers });
                    setTerritoryOptions(toOptions(response.data, "country"));
                    break;
                case 'STATE':
                    url = `${import.meta.env.VITE_API_BASE_URL}/states`;
                    response = await axios.get(url, { headers });
                    setTerritoryOptions(toOptions(response.data, "state"));
                    break;
                case 'CITY':
                    url = `${import.meta.env.VITE_API_BASE_URL}/cities`;
                    response = await axios.get(url, { headers });
                    setTerritoryOptions(toOptions(response.data, "city"));
                    break;
                default:
                    setTerritoryOptions([]);
                    return;
            }
        } catch (error) {
            console.error("Error fetching territory:", error);
            setTerritoryOptions([]);
        } finally {
            setIsLoadingTerritory(false);
        }
    };
    const [basicInfo, setBasicInfo] = useState({
        companyTypeId: null,
        companyLevelId: null,
        parentCompanyId: null,
        companyName: "",
        shortName: "",
        companyNatureId: null,
        natureOfBusinessId: null,
        constitutionId: null,
        companyStatusId: null,
        finStartMonth: null,
        defaultLanguageId: null,
        defaultCurrency: null,
        bank: ""
    });
    const [addressDetails, setAddressDetails] = useState({
        addressTypeId: null,
        address1: '',
        address2: '',
        countryId: null,
        cityId: null,
        zipCode: '',
        phoneNo: '',
        faxNo: '',
        email: '',
        website: ''
    });
    const [contactDetails, setContactDetails] = useState({
        position: '',
        name: '',
        phoneNo: '',
        email: ''
    });
    const [taxDetails, setTaxDetails] = useState({
        effectiveFrom: '',
        effectiveTo: '',
        taxTypeId: null,
        territoryTypeId: null,
        territory: '',
        taxRegNo: '',
        taxRegDate: '',
        address1: '',
        address2: '',
        city: '',
        pinCode: '',
        email: '',
        isPrimary: false
    });
    const [directorDetails, setDirectorDetails] = useState({
        directorTypeId: null,
        directorName: '',
        sharePercentage: '',
        noOfShares: ''
    });
    const [jointVenture, setJointVenture] = useState({
        partnerId: '',
        sharePercentage: ''
    });
    const [companyProfile, setCompanyProfile] = useState({
        orderNo: '',
        description: '',
        remarks: ''
    });
    const [additionalInfo, setAdditionalInfo] = useState({
        idTypeId: null,
        registrationNo: ''
    });
    const [localName, setLocalName] = useState({
        languageId: null,
        name: ''
    });
    const fetchCity = (id) => {
        setCityOptions([]);
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        axios.get(`${baseUrl}/cities/byCountry/${id}`, { headers })
            .then(r => setCityOptions(toOptions(r.data, "city")))
    }

    const handleInputChange = (setter) => (e) => {
        const { name, value, type, checked } = e.target;
        setter(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (setter, field) => (selectedOption) => {
        setter(prev => ({
            ...prev,
            [field]: selectedOption ? selectedOption.value : null
        }));
    };
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: new Date(0, i).toLocaleString('default', { month: 'long' }),
        label: new Date(0, i).toLocaleString('default', { month: 'long' })
    }));
    const selectedCompanyType = companyTypeOptions.find(opt => opt.value === basicInfo.companyTypeId);
    const isCompany = selectedCompanyType?.value === 'COMPANY';
    const handleSave = async () => {
        if (!basicInfo.companyName || !basicInfo.shortName || !basicInfo.companyTypeId) {
            toast.warn("Please fill all required fields in Basic Information");
            return;
        }
        if (isCompany && (!addressDetails.countryId || !addressDetails.cityId)) {
            toast.warn("Please select Country and City");
            return;
        }
        try {
            const formData = new FormData();
            const companyDTO = {
                companyId: null,
                companyName: basicInfo.companyName.trim(),
                shortName: basicInfo.shortName.trim(),
                parentCompanyId: basicInfo.parentCompanyId || null,
                comTypeId: basicInfo.companyTypeId,
                comLevelId: basicInfo.companyLevelId,
                comNatureId: basicInfo.companyNatureId,
                businessNatureId: isCompany ? basicInfo.natureOfBusinessId : null,
                companyConstitutionId: isCompany ? basicInfo.constitutionId : null,
                statusId: isCompany ? basicInfo.companyStatusId : null,
                languageId: isCompany ? basicInfo.defaultLanguageId : null,
                currencyId: isCompany ? basicInfo.defaultCurrency : null,
                bank: isCompany ? basicInfo.bank.trim() : "",
                address: isCompany ? {
                    addressTypeId: addressDetails.addressTypeId,
                    address1: addressDetails.address1.trim(),
                    address2: addressDetails.address2.trim(),
                    countryId: addressDetails.countryId,
                    cityId: addressDetails.cityId,
                    zipCode: addressDetails.zipCode.trim(),
                    phoneNo: addressDetails.phoneNo.trim(),
                    faxNo: addressDetails.faxNo.trim(),
                    email: addressDetails.email.trim(),
                    website: addressDetails.website.trim()
                } : null,
                profile: isCompany ? {
                    orderNo: companyProfile.orderNo,
                    description: companyProfile.description.trim(),
                    remarks: companyProfile.remarks.trim()
                } : null,
                contacts: isCompany && contactDetails.name ? [{
                    position: contactDetails.position || null,
                    name: contactDetails.name.trim(),
                    phoneNo: contactDetails.phoneNo.trim(),
                    email: contactDetails.email.trim()
                }] : [],
                taxDetails: isCompany ? [taxDetails].map(t => ({
                    effectiveFrom: t.effectiveFrom ? new Date(t.effectiveFrom).toISOString().split('T')[0] : null,
                    effectiveTo: t.effectiveTo ? new Date(t.effectiveTo).toISOString().split('T')[0] : null,
                    taxTypeId: t.taxTypeId,
                    territoryTypeId: t.territoryTypeId,
                    territory: t.territory || null,
                    taxRegNo: t.taxRegNo.trim(),
                    taxRegDate: t.taxRegDate ? new Date(t.taxRegDate).toISOString().split('T')[0] : null,
                    city: t.city || null,
                    address1: t.address1.trim(),
                    address2: t.address2.trim(),
                    pinCode: t.pinCode.trim(),
                    email: t.email.trim(),
                    isPrimary: t.isPrimary
                })) : [],
                directors: isCompany ? [directorDetails].filter(d => d.directorName).map(d => ({
                    directorTypeId: d.directorTypeId,
                    directorName: d.directorName.trim(),
                    sharePercentage: d.sharePercentage ? parseFloat(d.sharePercentage) : null,
                    noOfShares: d.noOfShares ? parseInt(d.noOfShares) : null
                })) : [],
                jointVentures: isCompany ? [jointVenture].filter(j => j.partnerId).map(j => ({
                    partnerId: j.partnerId.trim(),
                    sharePercentage: j.sharePercentage ? parseFloat(j.sharePercentage) : null
                })) : [],
                additionalInfos: isCompany ? [additionalInfo].filter(a => a.idTypeId).map(a => ({
                    idTypeId: a.idTypeId,
                    registrationNo: a.registrationNo.trim()
                })) : [],
                localNames: isCompany ? [localName].filter(l => l.languageId && l.name).map(l => ({
                    languageId: l.languageId,
                    name: l.name.trim()
                })) : []
            };
            formData.append(
                "companyDTO",
                new Blob([JSON.stringify(companyDTO)], { type: "application/json" })
            );
            attachments.forEach((file) => {
                formData.append("files", file);
            });
            const token = sessionStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/company/add`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            if (response.status === 200) {
                toast.success("Company saved Successfully");
            }
        } catch (error) {
            console.error("Error saving company:", error);
            const msg = error.response?.data || error.message || "Failed to save company";
            toast.error(msg);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light p-4">
            <div className="d-flex align-items-center mb-4 ps-2">
                <h2 className="mb-0 fs-5 fw-bold" style={{ color: bluePrimary }}>Company Details</h2>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px" }}>
                        <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                            <Building2 size={20} className="me-2" />
                            <strong>Basic Information</strong>
                        </div>
                        <div className="card-body p-5 bg-white">
                            <div className="row mt-2">
                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform-select d-block">Company Type <span style={{ color: "red" }}>*</span></label>
                                    <Select
                                        classNamePrefix="select"
                                        placeholder="Select Type"
                                        value={getSelectedOption(basicInfo.companyTypeId, companyTypeOptions)}
                                        onChange={handleSelectChange(setBasicInfo, 'companyTypeId')}
                                        options={companyTypeOptions}
                                    />
                                </div>

                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform-select d-block">Company Level <span style={{ color: "red" }}>*</span></label>
                                    <Select
                                        classNamePrefix="select"
                                        placeholder="Select Level"
                                        value={getSelectedOption(basicInfo.companyLevelId, companyLevelOptions)}
                                        onChange={handleSelectChange(setBasicInfo, 'companyLevelId')}
                                        options={companyLevelOptions}
                                    />
                                </div>

                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform-select d-block">Parent Company</label>
                                    <Select
                                        classNamePrefix="select"
                                        placeholder="Select Parent Company"
                                        value={getSelectedOption(basicInfo.parentCompanyId, [])}
                                        onChange={handleSelectChange(setBasicInfo, 'parentCompanyId')}
                                        options={[]}
                                        isClearable
                                    />
                                </div>

                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform d-block">Company Name <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={basicInfo.companyName}
                                        onChange={handleInputChange(setBasicInfo)}
                                        className="form-input w-100"
                                        placeholder="Enter Company Name"
                                    />
                                </div>

                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform d-block">Short Name <span style={{ color: "red" }}>*</span></label>
                                    <input
                                        type="text"
                                        name="shortName"
                                        value={basicInfo.shortName}
                                        onChange={handleInputChange(setBasicInfo)}
                                        className="form-input w-100"
                                        placeholder="Enter Short Name"
                                    />
                                </div>

                                <div className="col-md-6 mb-4 position-relative">
                                    <label className="projectform-select d-block">Company Nature <span style={{ color: "red" }}>*</span></label>
                                    <Select
                                        classNamePrefix="select"
                                        placeholder="Select Company Nature"
                                        value={getSelectedOption(basicInfo.companyNatureId, companyNatureOptions)}
                                        onChange={handleSelectChange(setBasicInfo, 'companyNatureId')}
                                        options={companyNatureOptions}
                                    />
                                </div>
                                {isCompany && (
                                    <>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Nature of Business</label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Nature of Business"
                                                value={getSelectedOption(basicInfo.natureOfBusinessId, natureOfBusinessOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'natureOfBusinessId')}
                                                options={natureOfBusinessOptions}
                                                isClearable
                                            />
                                        </div>

                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Constitution</label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Constitution"
                                                value={getSelectedOption(basicInfo.constitutionId, constitutionOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'constitutionId')}
                                                options={constitutionOptions}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Company Status <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Company Status"
                                                value={getSelectedOption(basicInfo.companyStatusId, companyStatusOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'companyStatusId')}
                                                options={companyStatusOptions}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Fin. Start Month <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Month"
                                                value={getSelectedOption(basicInfo.finStartMonth, monthOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'finStartMonth')}
                                                options={monthOptions}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Default Language <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Language"
                                                value={getSelectedOption(basicInfo.defaultLanguageId, languageOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'defaultLanguageId')}
                                                options={languageOptions}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Default Currency <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Currency"
                                                value={getSelectedOption(basicInfo.defaultCurrency, currencyOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'defaultCurrency')}
                                                options={currencyOptions}
                                            />
                                        </div>

                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Bank</label>
                                            <input
                                                type="text"
                                                name="bank"
                                                value={basicInfo.bank}
                                                onChange={handleInputChange(setBasicInfo)}
                                                className="form-input w-100"
                                                placeholder="Enter Bank Name"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    {isCompany && (
                        <>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <MapPin size={20} className="me-2" />
                                    <strong>Address Details</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Address Type <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Address Type"
                                                value={getSelectedOption(addressDetails.addressTypeId, addressTypeOptions)}
                                                onChange={handleSelectChange(setAddressDetails, 'addressTypeId')}
                                                options={addressTypeOptions}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Address 1</label>
                                            <input
                                                type="text"
                                                name="address1"
                                                value={addressDetails.address1}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Address 1"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Address 2</label>
                                            <input
                                                type="text"
                                                name="address2"
                                                value={addressDetails.address2}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Address 2"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Country <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Country"
                                                value={getSelectedOption(addressDetails.countryId, countryOptions)}
                                                onChange={(selectedOption) => {
                                                    setAddressDetails(prev => ({
                                                        ...prev,
                                                        countryId: selectedOption ? selectedOption.value : null,
                                                        cityId: null
                                                    }));
                                                    if (selectedOption) {
                                                        fetchCity(selectedOption.value);
                                                    } else {
                                                        setCityOptions([]);
                                                    }
                                                }}
                                                options={countryOptions}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">City <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select City"
                                                value={getSelectedOption(addressDetails.cityId, cityOptions)}
                                                onChange={handleSelectChange(setAddressDetails, 'cityId')}
                                                options={cityOptions}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Zip Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={addressDetails.zipCode}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Zip Code"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Phone No</label>
                                            <input
                                                type="text"
                                                name="phoneNo"
                                                value={addressDetails.phoneNo}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Phone No"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Fax No</label>
                                            <input
                                                type="text"
                                                name="faxNo"
                                                value={addressDetails.faxNo}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Fax No"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Email ID</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={addressDetails.email}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Email ID"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Website</label>
                                            <input
                                                type="text"
                                                name="website"
                                                value={addressDetails.website}
                                                onChange={handleInputChange(setAddressDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Website"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <Mail size={20} className="me-2" />
                                    <strong>Contact Details</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Position <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                name="position"
                                                value={contactDetails.position}
                                                onChange={handleInputChange(setContactDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter designation"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={contactDetails.name}
                                                onChange={handleInputChange(setContactDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Name"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Phone No</label>
                                            <input
                                                type="text"
                                                name="phoneNo"
                                                value={contactDetails.phoneNo}
                                                onChange={handleInputChange(setContactDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Phone No"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Email ID</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={contactDetails.email}
                                                onChange={handleInputChange(setContactDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Email ID"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <Landmark size={20} className="me-2" />
                                    <strong>Tax Details</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Effective From <span style={{ color: "red" }}>*</span></label>

                                            <Flatpickr
                                                className="form-input w-100"
                                                placeholder="Select Date"
                                                value={taxDetails.effectiveFrom}
                                                onChange={(date) => setTaxDetails(prev => ({ ...prev, effectiveFrom: date[0] }))}
                                                options={{ dateFormat: "d-M-Y" }}
                                            />
                                            <CalendarIcon className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: "none" }} />

                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Effective To</label>

                                            <Flatpickr
                                                className="form-input w-100"
                                                placeholder="Select Date"
                                                value={taxDetails.effectiveTo}
                                                onChange={(date) => setTaxDetails(prev => ({ ...prev, effectiveTo: date[0] }))}
                                                options={{ dateFormat: "d-M-Y" }}
                                            />
                                            <CalendarIcon className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: "none" }} />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Territory Type <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Territory Type"
                                                value={getSelectedOption(taxDetails.territoryTypeId, territoryTypeOptions)}
                                                onChange={(selectedOption) => {
                                                    const newTerritoryTypeId = selectedOption ? selectedOption.value : null;
                                                    setTaxDetails(prev => ({
                                                        ...prev,
                                                        territoryTypeId: newTerritoryTypeId,
                                                        territory: null
                                                    }));
                                                    if (selectedOption) {
                                                        fetchTerritory(selectedOption.value);
                                                    } else {
                                                        setTerritoryOptions([]);
                                                    }
                                                }}
                                                options={territoryTypeOptions}
                                                isClearable
                                                isSearchable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Territory <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Territory"
                                                value={getSelectedOption(taxDetails.territory, territoryOptions)}
                                                onChange={handleSelectChange(setTaxDetails, 'territory')}
                                                options={territoryOptions}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Tax Type <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Tax Type"
                                                value={getSelectedOption(taxDetails.taxTypeId, taxTypeOptions)}
                                                onChange={handleSelectChange(setTaxDetails, 'taxTypeId')}
                                                options={taxTypeOptions}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Tax Reg. No <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                name="taxRegNo"
                                                value={taxDetails.taxRegNo}
                                                onChange={handleInputChange(setTaxDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Tax Reg. No"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Tax Reg. Date <span style={{ color: "red" }}>*</span></label>

                                            <Flatpickr
                                                className="form-input w-100"
                                                placeholder="Select Date"
                                                value={taxDetails.taxRegDate}
                                                onChange={(date) => setTaxDetails(prev => ({ ...prev, taxRegDate: date[0] }))}
                                                options={{ dateFormat: "d-M-Y" }}
                                            />
                                            <CalendarIcon className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: "none" }} />

                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">City <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select City"
                                                value={getSelectedOption(taxDetails.city, citiesOption)}
                                                onChange={handleSelectChange(setTaxDetails, 'city')}
                                                options={citiesOption}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Address 1</label>
                                            <input
                                                type="text"
                                                name="address1"
                                                value={taxDetails.address1}
                                                onChange={handleInputChange(setTaxDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Address 1"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Address 2</label>
                                            <input
                                                type="text"
                                                name="address2"
                                                value={taxDetails.address2}
                                                onChange={handleInputChange(setTaxDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Address 2"
                                            />
                                        </div>
                                        <div className="col-md-12 mb-4">
                                            <div className="form-check form-switch custom-switch d-flex justify-content-end align-items-center w-100">
                                                <label className="form-check-label me-5 fw-bold" style={{ color: bluePrimary }}>
                                                    Is Primary <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={taxDetails.isPrimary}
                                                    onChange={(e) => setTaxDetails(prev => ({ ...prev, isPrimary: e.target.checked }))}
                                                    style={{ cursor: 'pointer', width: '45px', height: '22px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <Users size={20} className="me-2" />
                                    <strong>Director Details</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Director Type <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Director Type"
                                                value={getSelectedOption(directorDetails.directorTypeId, [])}
                                                onChange={handleSelectChange(setDirectorDetails, 'directorTypeId')}
                                                options={[
                                                    { value: 1, label: 'Full Time' },
                                                    { value: 2, label: 'Part Time' }
                                                ]}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Director Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                name="directorName"
                                                value={directorDetails.directorName}
                                                onChange={handleInputChange(setDirectorDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter Director Name"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Share %</label>
                                            <input
                                                type="number"
                                                name="sharePercentage"
                                                value={directorDetails.sharePercentage}
                                                onChange={handleInputChange(setDirectorDetails)}
                                                className="form-input w-100"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">No of Shares</label>
                                            <input
                                                type="number"
                                                name="noOfShares"
                                                value={directorDetails.noOfShares}
                                                onChange={handleInputChange(setDirectorDetails)}
                                                className="form-input w-100"
                                                placeholder="Enter No of Shares"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <Handshake size={20} className="me-2" />
                                    <strong>Joint Venture</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Partner Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                name="partnerId"
                                                value={jointVenture.partnerId}
                                                onChange={handleInputChange(setJointVenture)}
                                                className="form-input w-100"
                                                placeholder="Enter Partner Name"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Share % <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                name="sharePercentage"
                                                value={jointVenture.sharePercentage}
                                                onChange={handleInputChange(setJointVenture)}
                                                className="form-input w-100"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <FileText size={20} className="me-2" />
                                    <strong>Company Profile</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mb-4">
                                        <div className="col-md-6 position-relative">
                                            <label className="projectform d-block">Order No <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="number"
                                                value={companyProfile.orderNo}
                                                onChange={(e) => setCompanyProfile(prev => ({ ...prev, orderNo: e.target.value }))}
                                                className="form-input w-100"
                                                placeholder="Enter Order No"
                                            />
                                        </div>
                                        <div className="col-md-6 position-relative">
                                            <label className="projectform d-block">Remarks</label>
                                            <input
                                                type="text"
                                                value={companyProfile.remarks}
                                                onChange={(e) => setCompanyProfile(prev => ({ ...prev, remarks: e.target.value }))}
                                                className="form-input w-100"
                                                placeholder="Enter Remarks"
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-12 position-relative">
                                            <label className="projectform d-block">Description <span style={{ color: "red" }}>*</span></label>
                                            <textarea
                                                rows="4"
                                                value={companyProfile.description}
                                                onChange={(e) => setCompanyProfile(prev => ({ ...prev, description: e.target.value }))}
                                                className="form-input w-100"
                                                placeholder="Enter Description"
                                            />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 position-relative">
                                            <label className="projectform d-block">Attachments (Certificates / Licenses)</label>
                                            <div
                                                className="rounded-3 p-4 text-center"
                                                style={{ border: "2px dashed #005197", minHeight: "160px", cursor: "pointer" }}
                                                onClick={() => document.getElementById("attachmentInput").click()}
                                            >
                                                <input
                                                    type="file"
                                                    id="attachmentInput"
                                                    className="d-none"
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.png,.jpg"
                                                    onChange={handleFiles}
                                                />
                                                <UploadCloud size={34} className="mb-2" style={{ color: "#005197" }} />
                                                <div className="fw-semibold" style={{ color: "#005197" }}>
                                                    Click to upload or drag and drop
                                                </div>
                                                <small className="text-muted">PDF, DOCX, PNG, JPG up to 10MB</small>

                                                {attachments.length > 0 && (
                                                    <div className="d-flex justify-content-center flex-wrap gap-3 mt-4">
                                                        {attachments.map((file, index) => (
                                                            <div
                                                                key={index}
                                                                className="d-flex align-items-center gap-2 px-3 py-2 rounded shadow-sm"
                                                                style={{ backgroundColor: "#fff", border: "1px solid #E0E0E0", maxWidth: "260px" }}
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <FileText size={16} />
                                                                <span className="small text-truncate" title={file.name}>
                                                                    {file.name}
                                                                </span>
                                                                <X
                                                                    size={16}
                                                                    className="text-danger"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => removeFile(index)}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <Info size={20} className="me-2" />
                                    <strong>Additional Info</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Type <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Type"
                                                value={getSelectedOption(additionalInfo.idTypeId, additionalInfoTypeOptions)}
                                                onChange={handleSelectChange(setAdditionalInfo, 'idTypeId')}
                                                options={additionalInfoTypeOptions}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Registration No</label>
                                            <input
                                                type="text"
                                                name="registrationNo"
                                                value={additionalInfo.registrationNo}
                                                onChange={handleInputChange(setAdditionalInfo, 'regNo')}
                                                className="form-input w-100"
                                                placeholder="Enter Registration No"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                <div className="card-header text-white text-center py-3" style={{ backgroundColor: bluePrimary }}>
                                    <Languages size={20} className="me-2" />
                                    <strong>Local Name</strong>
                                </div>
                                <div className="card-body p-5 bg-white">
                                    <div className="row mt-2">
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Language <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Language"
                                                value={getSelectedOption(localName.languageId, languageOptions)}
                                                onChange={handleSelectChange(setLocalName, 'languageId')}
                                                options={languageOptions}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Name <span style={{ color: "red" }}>*</span></label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={localName.name}
                                                onChange={handleInputChange(setLocalName)}
                                                className="form-input w-100"
                                                placeholder="Enter Local Name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-end gap-3 mt-4 pb-5">
                <button className="btn px-4 fw-bold" style={{ color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '8px' }}>
                    Reset
                </button>
                <button className="btn px-4 fw-bold text-white" style={{ backgroundColor: bluePrimary, borderRadius: '8px' }} onClick={handleSave}>
                    Save Details
                </button>
            </div>
        </div>
    );
}
export default CompanyDetails;