import { useState, useEffect } from 'react';
import PhoneInput from '../Utills/PhoneInput';
import { useLocation } from 'react-router-dom';
import { Building2, MapPin, Mail, Landmark, Users, UploadCloud, FileText, X, Handshake, Info, Languages, Calendar, Building, Briefcase, Plus, Trash2, ArrowLeft, RotateCcw, ArrowRight, Save, ClipboardCheck } from 'lucide-react';
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import '../CSS/custom-flatpickr.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function CompanyForm() {
    const bluePrimary = "#005197";

    const location = useLocation();
    const editCompanyId = location.state?.editCompanyId || null;

    const [activeTab, setActiveTab] = useState("overview");
    const [isSaving, setIsSaving] = useState(false);

    const tabs = [
        { id: "overview", label: "Overview", icon: <Building size={16} /> },
        { id: "address", label: "Address", icon: <MapPin size={16} /> },
        { id: "contact", label: "Contact", icon: <Mail size={16} /> },
        { id: "tax", label: "Tax Details", icon: <Landmark size={16} /> },
        { id: "director", label: "Directors", icon: <Users size={16} /> },
        { id: "jv", label: "Joint Venture", icon: <Handshake size={16} /> },
        { id: "profile", label: "Profile", icon: <FileText size={16} /> },
        { id: "additional", label: "Additional Info", icon: <Info size={16} /> },
        { id: "local", label: "Local Name", icon: <Languages size={16} /> },
        { id: "review", label: "Review", icon: <ClipboardCheck size={16} /> },
    ];

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
    const [designationOptions, setDesignationOptions] = useState([]);
    const [additionalInfoTypeOptions, setAdditionalInfoTypeOptions] = useState([]);
    const [currencyOptions, setCurrencyOptions] = useState([]);
    const [addressTypeOptions, setAddressTypeOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);
    const [citiesOption, setCitiesOption] = useState([]);
    const [territoryOptions, setTerritoryOptions] = useState([]);
    const [directorTypeOptions, setDirectorTypeOptions] = useState([]);
    const [isLoadingTerritory, setIsLoadingTerritory] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Tax Territory Filter States
    const [taxFilterCountry, setTaxFilterCountry] = useState(null);
    const [taxFilterState, setTaxFilterState] = useState(null);
    const [taxCountryOptions, setTaxCountryOptions] = useState([]);
    const [taxStateOptions, setTaxStateOptions] = useState([]);
    const toOptions = (data, labelKey) =>
        (data || [])
            .filter(item => item.active !== false)
            .map(item => ({
                value: item.id,
                label: item[labelKey]
            }));
    const getSelectedOption = (value, options) => {
        if (value === null || value === undefined) return null;
        return options.find(opt => String(opt.value) === String(value)) || null;
    };
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
            .then(r => setCompanyLevelOptions(
                (r.data?.data ?? r.data ?? []).map(item => ({
                    value: item.code,
                    label: item.label
                }))
            ));
        axios.get(`${baseUrl}/companyStatus`, { headers })
            .then(r => setCompanyStatusOptions(
                (r.data?.data ?? r.data ?? []).map(item => ({
                    value: item.code,
                    label: item.label
                }))
            ));
        axios.get(`${baseUrl}/companyNature`, { headers })
            .then(r => setCompanyNatureOptions(
                (r.data?.data ?? r.data ?? []).map(item => ({
                    value: item.code,
                    label: item.label
                }))
            ));
        axios.get(`${baseUrl}/companyConstitution`, { headers })
            .then(r => setConstitutionOptions(toOptions(r.data, "comConstitution")));
        axios.get(`${baseUrl}/businessNature`, { headers })
            .then(r => setNatureOfBusinessOptions(toOptions(r.data, "businessNature")));
        axios.get(`${baseUrl}/language`, { headers })
            .then(r => {
                const options = toOptions(r.data, "language");
                setLanguageOptions(options);
                const defaultOpt = options.find(o => o.label?.toLowerCase() === 'english');
                if (defaultOpt) {
                    setBasicInfo(prev => ({ ...prev, defaultLanguageId: defaultOpt.value }));
                }
            });
        axios.get(`${baseUrl}/territoryType`, { headers })
            .then(r => setTerritoryTypeOptions(r.data.map(item => ({ value: item.code, label: item.label }))));
        axios.get(`${baseUrl}/taxType`, { headers })
            .then(r => setTaxTypeOptions(
                (r.data?.data ?? r.data ?? []).map(item => ({
                    value: item.code,
                    label: item.label
                }))
            ));
        axios.get(`${baseUrl}/designation`, { headers })
            .then(r => setDesignationOptions(toOptions(r.data, "designationName")));
        axios.get(`${baseUrl}/identityType`, { headers })
            .then(r => setAdditionalInfoTypeOptions(toOptions(r.data, "idType")));
        axios.get(`${baseUrl}/project/currency`, { headers })
            .then(r => {
                const options = toOptions(r.data, "currencyName");
                setCurrencyOptions(options);
                const defaultOpt = options.find(o => o.label?.toLowerCase() === 'indian rupee' || o.label?.toLowerCase() === 'inr' || o.label?.toLowerCase().includes('rupee'));
                if (defaultOpt) {
                    setBasicInfo(prev => ({ ...prev, defaultCurrency: defaultOpt.value }));
                }
            });
        axios.get(`${baseUrl}/addressType`, { headers })
            .then(r => setAddressTypeOptions(toOptions(r.data, "addressType")))
        axios.get(`${baseUrl}/countries`, { headers })
            .then(r => setCountryOptions(toOptions(r.data, "country")))
        axios.get(`${baseUrl}/directorType`, { headers })
            .then(r => setDirectorTypeOptions(r.data.map(item => ({ value: item.code, label: item.label }))));
    }, []);

    useEffect(() => {
        if (!editCompanyId) return;

        const fetchEditData = async () => {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            try {
                const response = await axios.get(`${baseUrl}/companyDetails`, { headers });
                let data = response.data;
                if (data && !Array.isArray(data) && data.data && Array.isArray(data.data)) {
                    data = data.data;
                }
                const list = Array.isArray(data) ? data : [];
                const company = list.find(c => c.companyId === parseInt(editCompanyId) || c.id === parseInt(editCompanyId) || c.id === editCompanyId || c.companyId === editCompanyId);

                if (company) {
                    setBasicInfo(prev => ({
                        ...prev,
                        companyTypeId: company.comType?.id || company.comType || company.comTypeId || null,
                        companyLevelId: company.companyLevel?.id || company.companyLevel || company.comLevelId || null,
                        parentCompanyId: company.parentCompany?.id || company.parentCompanyId || null,
                        companyName: company.companyName || "",
                        shortName: company.shortName || "",
                        companyNatureId: company.companyNature?.id || company.companyNature || company.comNatureId || null,
                        natureOfBusinessId: company.businessNature?.id || company.businessNature || company.businessNatureId || null,
                        constitutionId: company.companyConstitution?.id || company.companyConstitution || company.companyConstitutionId || null,
                        companyStatusId: company.companyStatus?.id || company.companyStatus || company.statusId || null,
                        finStartMonth: company.finStartMonth || null,
                        defaultLanguageId: company.language?.id || company.language || company.languageId || null,
                        defaultCurrency: company.currency?.id || company.currency || company.currencyId || null,
                        bank: company.bank || ""
                    }));

                    if (company.addressDetails && company.addressDetails.length > 0) {
                        const first = company.addressDetails[0];

                        const getId = (obj, fallback) => {
                            if (obj && typeof obj === 'object') {
                                return obj.id || obj.countryId || obj.stateId || obj.cityId || fallback;
                            }
                            return obj || fallback || null;
                        };

                        const cId = getId(first.country, first.countryId);
                        const sId = getId(first.state, first.stateId);
                        const cityId = getId(first.city, first.cityId);

                        let _allCountries = null;
                        const resolveLocationIds = async (cVal, sVal, cityVal) => {
                            let resolvedCId = cVal;
                            let resolvedSId = sVal;
                            let resolvedCityId = cityVal;
                            let stOptions = [];
                            let ctyOptions = [];

                            if (cVal) {
                                if (!_allCountries) {
                                    try {
                                        const cRes = await axios.get(`${baseUrl}/countries`, { headers });
                                        _allCountries = cRes.data || [];
                                    } catch (e) { _allCountries = []; }
                                }
                                const obj = _allCountries.find(c => String(c.country).toLowerCase() === String(cVal).toLowerCase() || c.id === cVal);
                                if (obj) resolvedCId = obj.id;
                            }

                            if (resolvedCId) {
                                try {
                                    const sRes = await axios.get(`${baseUrl}/states/${resolvedCId}`, { headers });
                                    const states = sRes.data || [];
                                    stOptions = toOptions(states, "state");
                                    const obj = states.find(s => String(s.state).toLowerCase() === String(sVal).toLowerCase() || s.id === sVal);
                                    if (obj) resolvedSId = obj.id;
                                } catch (e) { }
                            }

                            if (resolvedSId) {
                                try {
                                    const cityRes = await axios.get(`${baseUrl}/cities/byState/${resolvedSId}`, { headers });
                                    const cities = cityRes.data || [];
                                    ctyOptions = toOptions(cities, "city");
                                    const obj = cities.find(c => String(c.city).toLowerCase() === String(cityVal).toLowerCase() || c.id === cityVal);
                                    if (obj) resolvedCityId = obj.id;
                                } catch (e) { }
                            }
                            return { resolvedCId, resolvedSId, resolvedCityId, stOptions, ctyOptions };
                        };

                        const firstLoc = await resolveLocationIds(cId, sId, cityId);

                        setAddressDetails(prev => ({
                            ...prev,
                            id: first.id || null,
                            addressTypeId: getId(first.addressType, first.addressTypeId),
                            address1: first.address1 || '',
                            address2: first.address2 || '',
                            countryId: firstLoc.resolvedCId,
                            stateId: firstLoc.resolvedSId,
                            cityId: firstLoc.resolvedCityId,
                            zipCode: first.zipcode || first.zipCode || '',
                            phoneNo: first.phone || first.phoneNo || '',
                            faxNo: first.faxNo || '',
                            email: first.email || '',
                            website: first.website || ''
                        }));
                        setIsPrimaryAddress(!!first.primaryAddress || !!first.isPrimary);

                        if (firstLoc.stOptions.length > 0) setStateOptions(firstLoc.stOptions);
                        if (firstLoc.ctyOptions.length > 0) setCityOptions(firstLoc.ctyOptions);

                        if (company.addressDetails.length > 1) {
                            const extraArr = company.addressDetails.slice(1);

                            const resolvedExtras = await Promise.all(extraArr.map(async (a) => {
                                const ecId = getId(a.country, a.countryId);
                                const esId = getId(a.state, a.stateId);
                                const ecityId = getId(a.city, a.cityId);
                                const loc = await resolveLocationIds(ecId, esId, ecityId);

                                return {
                                    id: a.id || null,
                                    addressTypeId: getId(a.addressType, a.addressTypeId),
                                    address1: a.address1 || '',
                                    address2: a.address2 || '',
                                    countryId: loc.resolvedCId,
                                    stateId: loc.resolvedSId,
                                    cityId: loc.resolvedCityId,
                                    zipCode: a.zipcode || a.zipCode || '',
                                    phoneNo: a.phone || a.phoneNo || '',
                                    faxNo: a.faxNo || '',
                                    email: a.email || '',
                                    website: a.website || '',
                                    isPrimary: !!a.primaryAddress || !!a.isPrimary,
                                    stateOptions: loc.stOptions,
                                    cityOptions: loc.ctyOptions
                                };
                            }));
                            setExtraAddresses(resolvedExtras);
                        }
                    }

                    if (company.contacts && company.contacts.length > 0) {
                        const first = company.contacts[0];
                        setContactDetails(prev => ({
                            ...prev,
                            position: first.designation?.id || first.position || '',
                            name: first.name || '',
                            phoneNo: first.phoneNo || '',
                            email: first.email || ''
                        }));
                        if (company.contacts.length > 1) {
                            setExtraContacts(company.contacts.slice(1).map(c => ({
                                position: c.designation?.id || c.position || '',
                                name: c.name || '',
                                phoneNo: c.phoneNo || '',
                                email: c.email || ''
                            })));
                        }
                    }

                    if (company.taxDetails && company.taxDetails.length > 0) {
                        const first = company.taxDetails[0];
                        setTaxDetails(prev => ({
                            ...prev,
                            taxTypeId: first.taxType?.id || first.taxType || first.taxTypeId || null,
                            territoryTypeId: first.territoryType?.id || first.territoryTypeId || null,
                            territory: first.territory?.id || first.territory || null,
                            taxRegNo: first.taxRegNo || '',
                            taxRegDate: first.taxRegDate || null,
                            effectiveFrom: first.effectiveFrom || null,
                            effectiveTo: first.effectiveTo || null
                        }));
                        if (company.taxDetails.length > 1) {
                            setExtraTaxes(company.taxDetails.slice(1).map(t => ({
                                taxTypeId: t.taxType?.id || t.taxType || t.taxTypeId || null,
                                territoryTypeId: t.territoryType?.id || t.territoryTypeId || null,
                                territory: t.territory?.id || t.territory || null,
                                taxRegNo: t.taxRegNo || '',
                                taxRegDate: t.taxRegDate || null,
                                effectiveFrom: t.effectiveFrom || null,
                                effectiveTo: t.effectiveTo || null
                            })));
                        }
                    }

                    if (company.directors && company.directors.length > 0) {
                        const first = company.directors[0];
                        setDirectorDetails(prev => ({
                            ...prev,
                            directorTypeId: first.directorType?.id || first.directorType || first.directorTypeId || null,
                            directorName: first.directorName || '',
                            noOfShares: first.noOfShares || '',
                            sharePercentage: first.sharePercentage || ''
                        }));
                        if (company.directors.length > 1) {
                            setExtraDirectors(company.directors.slice(1).map(d => ({
                                directorTypeId: d.directorType?.id || d.directorType || d.directorTypeId || null,
                                directorName: d.directorName || '',
                                noOfShares: d.noOfShares || '',
                                sharePercentage: d.sharePercentage || ''
                            })));
                        }
                    }

                    if (company.jointVentures && company.jointVentures.length > 0) {
                        const first = company.jointVentures[0];
                        setJointVenture(prev => ({
                            ...prev,
                            partnerId: first.partner?.id || first.partnerId || '',
                            sharePercentage: first.sharePercentage || ''
                        }));
                        if (company.jointVentures.length > 1) {
                            setExtraJvs(company.jointVentures.slice(1).map(j => ({
                                partnerId: j.partner?.id || j.partnerId || '',
                                sharePercentage: j.sharePercentage || ''
                            })));
                        }
                    }

                    if (company.profile && company.profile.length > 0) {
                        const first = company.profile[0];
                        setCompanyProfile(prev => ({
                            ...prev,
                            orderNo: first.orderNo || '',
                            description: first.description || '',
                            remarks: first.remarks || ''
                        }));
                    }

                    if (company.additionalInfos && company.additionalInfos.length > 0) {
                        const first = company.additionalInfos[0];
                        setAdditionalInfo(prev => ({
                            ...prev,
                            idTypeId: first.identityType?.id || first.idType || first.idTypeId || null,
                            registrationNo: first.registrationNo || ''
                        }));
                        if (company.additionalInfos.length > 1) {
                            setExtraAdditionalInfos(company.additionalInfos.slice(1).map(a => ({
                                idTypeId: a.identityType?.id || a.idType || a.idTypeId || null,
                                registrationNo: a.registrationNo || ''
                            })));
                        }
                    }

                    if (company.localNames && company.localNames.length > 0) {
                        const first = company.localNames[0];
                        setLocalName(prev => ({
                            ...prev,
                            languageId: first.language?.id || first.language || first.languageId || null,
                            name: first.name || ''
                        }));
                        if (company.localNames.length > 1) {
                            setExtraLocalNames(company.localNames.slice(1).map(l => ({
                                languageId: l.language?.id || l.language || l.languageId || null,
                                name: l.name || ''
                            })));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching company details for edit:", error);
            }
        };

        fetchEditData();
    }, [editCompanyId]);
    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        setAttachments(prev => [...prev, ...files]);
    };
    const removeFile = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };
    const fetchTerritory = async (territoryTypeId) => {
        setTerritoryOptions([]);
        setTaxDetails(prev => ({ ...prev, territory: null }));
        setTaxFilterCountry(null);
        setTaxFilterState(null);
        setTaxStateOptions([]);

        if (!territoryTypeId) return;

        setIsLoadingTerritory(true);
        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            if (territoryTypeId === 'COUNTRY') {
                const response = await axios.get(`${baseUrl}/countries`, { headers });
                setTerritoryOptions(toOptions(response.data, "country"));
            } else if (territoryTypeId === 'STATE' || territoryTypeId === 'CITY') {
                const response = await axios.get(`${baseUrl}/countries`, { headers });
                setTaxCountryOptions(toOptions(response.data, "country"));
            }
        } catch (error) {
            console.error("Error fetching territory:", error);
            setTerritoryOptions([]);
        } finally {
            setIsLoadingTerritory(false);
        }
    };

    const handleTaxCountryFilterChange = async (selectedOption) => {
        setTaxFilterCountry(selectedOption);
        setTaxFilterState(null);
        setTaxStateOptions([]);
        setTerritoryOptions([]);
        setTaxDetails(prev => ({ ...prev, territory: null }));

        if (!selectedOption) return;

        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            if (taxDetails.territoryTypeId === 'STATE') {
                const response = await axios.get(`${baseUrl}/states/${selectedOption.value}`, { headers });
                setTerritoryOptions(toOptions(response.data, "state"));
            } else if (taxDetails.territoryTypeId === 'CITY') {
                const response = await axios.get(`${baseUrl}/states/${selectedOption.value}`, { headers });
                setTaxStateOptions(toOptions(response.data, "state"));
            }
        } catch (error) {
            console.error("Error fetching states for filter:", error);
        }
    };

    const handleTaxStateFilterChange = async (selectedOption) => {
        setTaxFilterState(selectedOption);
        setTerritoryOptions([]);
        setTaxDetails(prev => ({ ...prev, territory: null }));

        if (!selectedOption || taxDetails.territoryTypeId !== 'CITY') return;

        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await axios.get(`${baseUrl}/cities/byState/${selectedOption.value}`, { headers });
            setTerritoryOptions(toOptions(response.data, "city"));
        } catch (error) {
            console.error("Error fetching cities for filter:", error);
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
        defaultCurrency: null
    });
    const [addressDetails, setAddressDetails] = useState({
        addressTypeId: null,
        address1: '',
        address2: '',
        countryId: null,
        stateId: null,
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
        email: ''
    });
    const [isPrimaryAddress, setIsPrimaryAddress] = useState(false);
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

    const [extraAddresses, setExtraAddresses] = useState([]);

    const emptyAddress = {
        addressTypeId: null,
        address1: '',
        address2: '',
        countryId: null,
        stateId: null,
        cityId: null,
        zipCode: '',
        phoneNo: '',
        faxNo: '',
        email: '',
        website: '',
        isPrimary: false,
        stateOptions: [],
        cityOptions: []
    };

    const handleAddMoreAddress = () => {
        if (!validateCurrentTab()) return;
        setExtraAddresses(prev => [...prev, { ...emptyAddress }]);
    };

    const handleRemoveExtraAddress = (index) => {
        setExtraAddresses(prev => prev.filter((_, i) => i !== index));
    };

    const handleExtraAddressChange = (index, field, value) => {
        let finalValue = value;
        if (field === 'phoneNo') {
            finalValue = value; // managed by PhoneInput component
        } else if (field === 'zipCode') {
            finalValue = value.replace(/\D/g, '').substring(0, 6);
        } else if (field === 'faxNo') {
            finalValue = value.replace(/\D/g, '').substring(0, 15);
        } else if (field === 'website') {
            finalValue = value.substring(0, 200);
        } else if (field === 'address1' || field === 'address2') {
            finalValue = value.substring(0, 100);
        }
        setExtraAddresses(prev => prev.map((addr, i) => {
            if (i !== index) return addr;
            return { ...addr, [field]: finalValue };
        }));
    };

    const fetchExtraStates = async (index, countryId) => {
        handleExtraAddressChange(index, 'stateId', null);
        handleExtraAddressChange(index, 'cityId', null);
        handleExtraAddressChange(index, 'stateOptions', []);
        handleExtraAddressChange(index, 'cityOptions', []);
        if (!countryId) return;
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const r = await axios.get(`${baseUrl}/states/${countryId}`, { headers });
            handleExtraAddressChange(index, 'stateOptions', toOptions(r.data, "state"));
        } catch { /* empty */ }
    };

    const fetchExtraCities = async (index, stateId) => {
        handleExtraAddressChange(index, 'cityId', null);
        handleExtraAddressChange(index, 'cityOptions', []);
        if (!stateId) return;
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;
            const r = await axios.get(`${baseUrl}/cities/byState/${stateId}`, { headers });
            handleExtraAddressChange(index, 'cityOptions', toOptions(r.data, "city"));
        } catch { /* empty */ }
    };

    // Extra sections state for all tabs
    const [extraContacts, setExtraContacts] = useState([]);
    const [extraTaxes, setExtraTaxes] = useState([]);
    const [extraDirectors, setExtraDirectors] = useState([]);
    const [extraJvs, setExtraJvs] = useState([]);
    const [extraAdditionalInfos, setExtraAdditionalInfos] = useState([]);
    const [extraLocalNames, setExtraLocalNames] = useState([]);

    const emptyContact = { position: '', name: '', phoneNo: '', email: '' };
    const emptyTax = {
        effectiveFrom: '', effectiveTo: '', taxTypeId: null, territoryTypeId: null, territory: '',
        taxRegNo: '', taxRegDate: '', address1: '', address2: '', city: '', pinCode: '', email: '',
        taxFilterCountry: null, taxFilterState: null, taxCountryOptions: [], taxStateOptions: [], territoryOptions: [], isLoadingTerritory: false
    };
    const emptyDirector = { directorTypeId: null, directorName: '', sharePercentage: '', noOfShares: '' };
    const emptyJv = { partnerId: '', sharePercentage: '' };
    const emptyAdditionalInfo = { idTypeId: null, registrationNo: '' };
    const emptyLocalName = { languageId: null, name: '' };

    // Generic helpers for extra sections
    const handleAddMoreSection = (setter, emptyObj) => () => {
        if (!validateCurrentTab()) return;
        setter(prev => [...prev, { ...emptyObj }]);
    };
    const handleRemoveSection = (setter) => (index) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };
    const handleSectionChange = (setter) => (index, field, value) => {
        let finalValue = value;
        if (field === 'phoneNo') {
            finalValue = value; // managed by PhoneInput component
        } else if (field === 'directorName' || field === 'name' || field === 'partnerId') {
            finalValue = value.replace(/[^A-Za-z ]/g, '').substring(0, 50);
        } else if (field === 'sharePercentage') {
            let sanitized = value.replace(/[^0-9.]/g, '');
            const parts = sanitized.split('.');
            if (parts.length > 2) {
                sanitized = parts[0] + '.' + parts.slice(1).join('');
            }
            finalValue = sanitized;
        } else if (field === 'noOfShares') {
            finalValue = value.replace(/\D/g, '');
        } else if (field === 'taxRegNo' || field === 'registrationNo') {
            finalValue = value.replace(/[^A-Za-z0-9]/g, '').substring(0, 50);
        } else if (field === 'address1' || field === 'address2') {
            finalValue = value.substring(0, 100);
        } else if (field === 'pinCode') {
            finalValue = value.replace(/\D/g, '').substring(0, 6);
        } else if (field === 'email') {
            finalValue = value.replace(/[^a-zA-Z0-9@\._-]/g, '').substring(0, 100);
        }
        setter(prev => prev.map((item, i) => i !== index ? item : { ...item, [field]: finalValue }));
    };

    const fetchExtraTaxTerritory = async (index, territoryTypeId) => {
        handleSectionChange(setExtraTaxes)(index, 'territoryOptions', []);
        handleSectionChange(setExtraTaxes)(index, 'territory', null);
        handleSectionChange(setExtraTaxes)(index, 'taxFilterCountry', null);
        handleSectionChange(setExtraTaxes)(index, 'taxFilterState', null);
        handleSectionChange(setExtraTaxes)(index, 'taxStateOptions', []);

        if (!territoryTypeId) return;

        handleSectionChange(setExtraTaxes)(index, 'isLoadingTerritory', true);
        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            if (territoryTypeId === 'COUNTRY') {
                const response = await axios.get(`${baseUrl}/countries`, { headers });
                handleSectionChange(setExtraTaxes)(index, 'territoryOptions', toOptions(response.data, "country"));
            } else if (territoryTypeId === 'STATE' || territoryTypeId === 'CITY') {
                const response = await axios.get(`${baseUrl}/countries`, { headers });
                handleSectionChange(setExtraTaxes)(index, 'taxCountryOptions', toOptions(response.data, "country"));
            }
        } catch (error) {
            console.error("Error fetching extra territory:", error);
            handleSectionChange(setExtraTaxes)(index, 'territoryOptions', []);
        } finally {
            handleSectionChange(setExtraTaxes)(index, 'isLoadingTerritory', false);
        }
    };

    const handleExtraTaxCountryFilterChange = async (index, selectedOption, territoryTypeId) => {
        handleSectionChange(setExtraTaxes)(index, 'taxFilterCountry', selectedOption);
        handleSectionChange(setExtraTaxes)(index, 'taxFilterState', null);
        handleSectionChange(setExtraTaxes)(index, 'taxStateOptions', []);
        handleSectionChange(setExtraTaxes)(index, 'territoryOptions', []);
        handleSectionChange(setExtraTaxes)(index, 'territory', null);

        if (!selectedOption) return;

        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            if (territoryTypeId === 'STATE') {
                const response = await axios.get(`${baseUrl}/states/${selectedOption.value}`, { headers });
                handleSectionChange(setExtraTaxes)(index, 'territoryOptions', toOptions(response.data, "state"));
            } else if (territoryTypeId === 'CITY') {
                const response = await axios.get(`${baseUrl}/states/${selectedOption.value}`, { headers });
                handleSectionChange(setExtraTaxes)(index, 'taxStateOptions', toOptions(response.data, "state"));
            }
        } catch (error) {
            console.error("Error fetching states for extra filter:", error);
        }
    };

    const handleExtraTaxStateFilterChange = async (index, selectedOption, territoryTypeId) => {
        handleSectionChange(setExtraTaxes)(index, 'taxFilterState', selectedOption);
        handleSectionChange(setExtraTaxes)(index, 'territoryOptions', []);
        handleSectionChange(setExtraTaxes)(index, 'territory', null);

        if (!selectedOption || territoryTypeId !== 'CITY') return;

        try {
            const token = sessionStorage.getItem("token");
            const headers = { Authorization: `Bearer ${token}` };
            const baseUrl = import.meta.env.VITE_API_BASE_URL;

            const response = await axios.get(`${baseUrl}/cities/byState/${selectedOption.value}`, { headers });
            handleSectionChange(setExtraTaxes)(index, 'territoryOptions', toOptions(response.data, "city"));
        } catch (error) {
            console.error("Error fetching cities for extra filter:", error);
        }
    };


    const [addressList, setAddressList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [taxList, setTaxList] = useState([]);
    const [directorList, setDirectorList] = useState([]);
    const [jvList, setJvList] = useState([]);
    const [additionalInfoList, setAdditionalInfoList] = useState([]);
    const [localNameList, setLocalNameList] = useState([]);

    const fetchStates = (countryId) => {
        setStateOptions([]);
        setCityOptions([]);
        if (!countryId) return;
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        axios.get(`${baseUrl}/states/${countryId}`, { headers })
            .then(r => setStateOptions(toOptions(r.data, "state")))
            .catch(() => setStateOptions([]));
    }

    const fetchCities = (stateId) => {
        setCityOptions([]);
        if (!stateId) return;
        const headers = { Authorization: `Bearer ${token}` };
        const baseUrl = import.meta.env.VITE_API_BASE_URL;
        axios.get(`${baseUrl}/cities/byState/${stateId}`, { headers })
            .then(r => setCityOptions(toOptions(r.data, "city")))
            .catch(() => setCityOptions([]));
    }

    const handleInputChange = (setter) => (e) => {
        let { name, value, type, checked } = e.target;
        if (type !== 'checkbox') {
            if (name === 'companyName') {
                value = value.replace(/[^A-Za-z ]/g, '').substring(0, 100);
            } else if (name === 'shortName') {
                value = value.replace(/[^A-Za-z ]/g, '').substring(0, 50);
            } else if (name === 'phoneNo') {
                // phone value is now managed by PhoneInput component; pass through
            } else if (name === 'zipCode' || name === 'pinCode') {
                value = value.replace(/\D/g, '').substring(0, 6);
            } else if (name === 'faxNo') {
                value = value.replace(/\D/g, '').substring(0, 15);
            } else if (name === 'website') {
                value = value.substring(0, 200);
            } else if (name === 'address1' || name === 'address2') {
                value = value.substring(0, 100);
            } else if (name === 'directorName' || name === 'name' || name === 'partnerId') {
                value = value.replace(/[^A-Za-z ]/g, '').substring(0, 50);
            } else if (name === 'sharePercentage') {
                let sanitized = value.replace(/[^0-9.]/g, '');
                const parts = sanitized.split('.');
                if (parts.length > 2) {
                    sanitized = parts[0] + '.' + parts.slice(1).join('');
                }
                value = sanitized;
            } else if (name === 'noOfShares') {
                value = value.replace(/\D/g, '');
            } else if (name === 'taxRegNo' || name === 'registrationNo') {
                value = value.replace(/[^A-Za-z0-9]/g, '').substring(0, 50);
            } else if (name === 'email') {
                value = value.replace(/[^a-zA-Z0-9@\._-]/g, '').substring(0, 100);
            }
        }
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
    const [parentCompanyOptions, setParentCompanyOptions] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const selectedCompanyType = companyTypeOptions.find(opt => opt.value === basicInfo.companyTypeId);
    const isCompany = selectedCompanyType?.value === 'GROUP';
    const showDetails = isGroup;

    useEffect(() => {
        if (!showDetails && activeTab !== "overview") {
            setActiveTab("overview");
        }
    }, [showDetails, activeTab]);

    useEffect(() => {
        const selectedType = companyTypeOptions.find(opt => opt.value === basicInfo.companyTypeId);
        const isGroupType = selectedType?.label?.toLowerCase() === 'company' || selectedType?.value === 'COMPANY';
        const isCompanyType = selectedType?.label?.toLowerCase() === 'group' || selectedType?.value === 'GROUP';
        setIsGroup(isGroupType);

        if (isGroupType && companyLevelOptions.length > 0) {
            setBasicInfo(prev => ({ ...prev, companyLevelId: companyLevelOptions[0].value }));
        } else if (isCompanyType && companyLevelOptions.length > 1) {
            setBasicInfo(prev => ({ ...prev, companyLevelId: companyLevelOptions[1].value }));
        } else {
            setBasicInfo(prev => ({ ...prev, companyLevelId: null }));
        }

        if (isCompanyType) {
            const fetchParentCompanies = async () => {
                try {
                    const headers = { Authorization: `Bearer ${token}` };
                    const baseUrl = import.meta.env.VITE_API_BASE_URL;
                    const response = await axios.get(`${baseUrl}/company`, { headers });

                    let data = response.data;
                    // Handle potential wrapped data or non-array response
                    if (data && !Array.isArray(data) && data.data && Array.isArray(data.data)) {
                        data = data.data;
                    }

                    let options = [];
                    if (Array.isArray(data)) {
                        options = data.map(item => {
                            // If item is { "v243": "Name" }, key="v243", value="Name"
                            const key = Object.keys(item)[0];
                            return {
                                value: key,
                                label: item[key]
                            };
                        });
                    } else if (data && typeof data === 'object') {
                        options = Object.keys(data).map(key => ({
                            value: key,
                            label: data[key]
                        }));
                    }

                    setParentCompanyOptions(options);
                } catch (error) {
                    console.error("Error fetching parent companies:", error);
                    toast.error("Failed to load parent companies");
                }
            };
            fetchParentCompanies();
        } else {
            setParentCompanyOptions([]);
            setBasicInfo(prev => ({ ...prev, parentCompanyId: null }));
        }
    }, [basicInfo.companyTypeId, companyTypeOptions, companyLevelOptions]);

    const handleAddAddress = () => {
        if (!addressDetails.addressTypeId || !addressDetails.countryId || !addressDetails.stateId || !addressDetails.cityId) {
            toast.warn("Please enter required address details (Type, Country, State, City)");
            return;
        }
        const allAddresses = [{ ...addressDetails, isPrimary: isPrimaryAddress }];
        extraAddresses.forEach(addr => {
            allAddresses.push({
                addressTypeId: addr.addressTypeId,
                address1: addr.address1,
                address2: addr.address2,
                countryId: addr.countryId,
                stateId: addr.stateId,
                cityId: addr.cityId,
                zipCode: addr.zipCode,
                phoneNo: addr.phoneNo,
                faxNo: addr.faxNo,
                email: addr.email,
                website: addr.website,
                isPrimary: addr.isPrimary
            });
        });
        setAddressList(prev => [...prev, ...allAddresses]);
        setAddressDetails({
            addressTypeId: null, address1: '', address2: '', countryId: null, stateId: null, cityId: null,
            zipCode: '', phoneNo: '', faxNo: '', email: '', website: ''
        });
        setIsPrimaryAddress(false);
        setExtraAddresses([]);
    };

    const handleAddContact = () => {
        if (!contactDetails.name || !contactDetails.position) {
            toast.warn("Please enter required contact details (Name, Position)");
            return;
        }
        if (!contactDetails.phoneNo || !contactDetails.email) {
            toast.warn("Please enter required contact details (Phone No, Email ID)");
            return;
        }
        const allContacts = [contactDetails, ...extraContacts];
        setContactList(prev => [...prev, ...allContacts]);
        setContactDetails({ position: '', name: '', phoneNo: '', email: '' });
        setExtraContacts([]);
    };

    const handleAddTax = () => {
        if (!taxDetails.taxTypeId) {
            toast.warn("Please select a Tax Type");
            return;
        }
        if (taxDetails.taxTypeId !== 'GST_UNREGISTER') {
            if (!taxDetails.territoryTypeId || !taxDetails.taxRegNo || !taxDetails.taxRegDate || !taxDetails.effectiveFrom) {
                toast.warn("Please enter required tax details");
                return;
            }
        }
        const allTaxes = [taxDetails, ...extraTaxes];
        setTaxList(prev => [...prev, ...allTaxes]);
        setTaxDetails({ effectiveFrom: '', effectiveTo: '', taxTypeId: null, territoryTypeId: null, territory: '', taxRegNo: '', taxRegDate: '', address1: '', address2: '', city: '', pinCode: '', email: '' });
        setExtraTaxes([]);
    };

    const handleAddDirector = () => {
        if (!directorDetails.directorName || !directorDetails.directorTypeId) {
            toast.warn("Please enter required director details");
            return;
        }
        const allDirectors = [directorDetails, ...extraDirectors];
        setDirectorList(prev => [...prev, ...allDirectors]);
        setDirectorDetails({ directorTypeId: null, directorName: '', sharePercentage: '', noOfShares: '' });
        setExtraDirectors([]);
    };

    const handleAddJv = () => {
        if (!jointVenture.partnerId || !jointVenture.sharePercentage) {
            toast.warn("Please enter required joint venture details");
            return;
        }
        const allJvs = [jointVenture, ...extraJvs];
        setJvList(prev => [...prev, ...allJvs]);
        setJointVenture({ partnerId: '', sharePercentage: '' });
        setExtraJvs([]);
    };

    const handleAddAdditionalInfo = () => {
        if (!additionalInfo.idTypeId) {
            toast.warn("Please select Additional Info Type");
            return;
        }
        const allAdditional = [additionalInfo, ...extraAdditionalInfos];
        setAdditionalInfoList(prev => [...prev, ...allAdditional]);
        setAdditionalInfo({ idTypeId: null, registrationNo: '' });
        setExtraAdditionalInfos([]);
    };

    const handleAddLocalName = () => {
        if (!localName.languageId || !localName.name) {
            toast.warn("Please enter required local name details");
            return;
        }
        const allLocal = [localName, ...extraLocalNames];
        setLocalNameList(prev => [...prev, ...allLocal]);
        setLocalName({ languageId: null, name: '' });
        setExtraLocalNames([]);
    };

    const handleRemoveItem = (setter, index) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        const defaultLangOpt = languageOptions.find(o => o.label?.toLowerCase() === 'english');
        const defaultCurrOpt = currencyOptions.find(o => o.label?.toLowerCase() === 'indian rupee' || o.label?.toLowerCase() === 'inr' || o.label?.toLowerCase().includes('rupee'));

        setBasicInfo({
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
            defaultLanguageId: defaultLangOpt ? defaultLangOpt.value : null,
            defaultCurrency: defaultCurrOpt ? defaultCurrOpt.value : null,
            bank: ""
        });
        setAddressDetails({
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
        setContactDetails({
            position: '',
            name: '',
            phoneNo: '',
            email: ''
        });
        setTaxDetails({
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
            email: ''
        });
        setIsPrimaryAddress(false);
        setDirectorDetails({
            directorTypeId: null,
            directorName: '',
            sharePercentage: '',
            noOfShares: ''
        });
        setJointVenture({
            partnerId: '',
            sharePercentage: ''
        });
        setCompanyProfile({
            orderNo: '',
            description: '',
            remarks: ''
        });
        setAdditionalInfo({
            idTypeId: null,
            registrationNo: ''
        });
        setLocalName({
            languageId: null,
            name: ''
        });
        setAddressList([]);
        setExtraAddresses([]);
        setContactList([]);
        setExtraContacts([]);
        setTaxList([]);
        setExtraTaxes([]);
        setDirectorList([]);
        setExtraDirectors([]);
        setJvList([]);
        setExtraJvs([]);
        setAdditionalInfoList([]);
        setExtraAdditionalInfos([]);
        setLocalNameList([]);
        setExtraLocalNames([]);
        setAttachments([]);
        setCitiesOption([]);
        setTerritoryOptions([]);
        setParentCompanyOptions([]);
    };

    const validateCurrentTab = () => {
        let missingFields = [];

        if (activeTab === "overview") {
            if (!basicInfo.companyTypeId) missingFields.push("Company Type");
            if (!basicInfo.companyLevelId) missingFields.push("Company Level");
            if (isCompany && !basicInfo.parentCompanyId) missingFields.push("Parent Company");
            if (!basicInfo.companyName) missingFields.push("Company Name");
            if (!basicInfo.shortName) missingFields.push("Short Name");

            if (showDetails) {
                if (!basicInfo.companyNatureId) missingFields.push("Company Nature");
                if (!basicInfo.companyStatusId) missingFields.push("Company Status");
                if (!basicInfo.finStartMonth) missingFields.push("Fin. Start Month");
                if (!basicInfo.defaultLanguageId) missingFields.push("Default Language");
                if (!basicInfo.defaultCurrency) missingFields.push("Default Currency");
            }
        } else if (activeTab === "address") {
            if (!addressDetails.addressTypeId) missingFields.push("Address Type");
            if (!addressDetails.countryId) missingFields.push("Country");
            if (!addressDetails.stateId) missingFields.push("State");
            if (!addressDetails.cityId) missingFields.push("City");

            extraAddresses.forEach((extra, idx) => {
                if (!extra.addressTypeId) missingFields.push(`Address ${idx + 2} Type`);
                if (!extra.countryId) missingFields.push(`Address ${idx + 2} Country`);
                if (!extra.stateId) missingFields.push(`Address ${idx + 2} State`);
                if (!extra.cityId) missingFields.push(`Address ${idx + 2} City`);
            });
        } else if (activeTab === "contact") {
            if (!contactDetails.position) missingFields.push("Position");
            if (!contactDetails.name) missingFields.push("Name");
            if (!contactDetails.phoneNo) missingFields.push("Phone No");
            if (!contactDetails.email) missingFields.push("Email ID");

            extraContacts.forEach((extra, idx) => {
                if (!extra.position) missingFields.push(`Contact ${idx + 2} Position`);
                if (!extra.name) missingFields.push(`Contact ${idx + 2} Name`);
                if (!extra.phoneNo) missingFields.push(`Contact ${idx + 2} Phone No`);
                if (!extra.email) missingFields.push(`Contact ${idx + 2} Email ID`);
            });
        } else if (activeTab === "tax") {
            if (!taxDetails.taxTypeId) missingFields.push("Tax Type");
            if (taxDetails.taxTypeId !== 'GST_UNREGISTER') {
                if (!taxDetails.territoryTypeId) missingFields.push("Territory Type");
                if (['STATE', 'CITY'].includes(taxDetails.territoryTypeId)) {
                    if (!taxFilterCountry) missingFields.push("Filter Country");
                    if (taxDetails.territoryTypeId === 'CITY' && !taxFilterState) missingFields.push("Filter State");
                }
                if (!taxDetails.territory) missingFields.push("Territory");
                if (!taxDetails.taxRegNo) missingFields.push("Tax Reg. No");
                if (!taxDetails.taxRegDate) missingFields.push("Tax Reg. Date");
                if (!taxDetails.effectiveFrom) missingFields.push("Effective From");
            }

            extraTaxes.forEach((extra, idx) => {
                if (!extra.taxTypeId) missingFields.push(`Tax ${idx + 2} Type`);
                if (extra.taxTypeId !== 'GST_UNREGISTER') {
                    if (!extra.territoryTypeId) missingFields.push(`Tax ${idx + 2} Territory Type`);
                    if (['STATE', 'CITY'].includes(extra.territoryTypeId)) {
                        if (!extra.taxFilterCountry) missingFields.push(`Tax ${idx + 2} Filter Country`);
                        if (extra.territoryTypeId === 'CITY' && !extra.taxFilterState) missingFields.push(`Tax ${idx + 2} Filter State`);
                    }
                    if (!extra.territory) missingFields.push(`Tax ${idx + 2} Territory`);
                    if (!extra.taxRegNo) missingFields.push(`Tax ${idx + 2} Reg. No`);
                    if (!extra.taxRegDate) missingFields.push(`Tax ${idx + 2} Reg. Date`);
                    if (!extra.effectiveFrom) missingFields.push(`Tax ${idx + 2} Effective From`);
                }
            });
        } else if (activeTab === "director") {
            if (!directorDetails.directorTypeId) missingFields.push("Director Type");
            if (!directorDetails.directorName) missingFields.push("Director Name");

            extraDirectors.forEach((extra, idx) => {
                if (!extra.directorTypeId) missingFields.push(`Director ${idx + 2} Type`);
                if (!extra.directorName) missingFields.push(`Director ${idx + 2} Name`);
            });
        } else if (activeTab === "jv") {
            if (!jointVenture.partnerId) missingFields.push("Partner Name");
            if (!jointVenture.sharePercentage) missingFields.push("Share %");

            extraJvs.forEach((extra, idx) => {
                if (!extra.partnerId) missingFields.push(`JV ${idx + 2} Partner Name`);
                if (!extra.sharePercentage) missingFields.push(`JV ${idx + 2} Share %`);
            });
        } else if (activeTab === "profile") {
            if (!companyProfile.orderNo) missingFields.push("Order No");
            if (!companyProfile.description) missingFields.push("Description");
        } else if (activeTab === "additional") {
            if (!additionalInfo.idTypeId) missingFields.push("Type");

            extraAdditionalInfos.forEach((extra, idx) => {
                if (!extra.idTypeId) missingFields.push(`Additional Info ${idx + 2} Type`);
            });
        } else if (activeTab === "local") {
            if (!localName.languageId) missingFields.push("Language");
            if (!localName.name) missingFields.push("Name");

            extraLocalNames.forEach((extra, idx) => {
                if (!extra.languageId) missingFields.push(`Local Name ${idx + 2} Language`);
                if (!extra.name) missingFields.push(`Local Name ${idx + 2} Name`);
            });
        } else if (activeTab === "review") {
            // Final comprehensive check for all mandatory fields
            if (!basicInfo.companyTypeId) missingFields.push("Company Type");
            if (!basicInfo.companyName) missingFields.push("Company Name");
            if (!basicInfo.shortName) missingFields.push("Short Name");
            if (showDetails) {
                if (!addressDetails.addressTypeId || !addressDetails.countryId || !addressDetails.cityId) missingFields.push("Primary Address");
                if (!contactDetails.name || !contactDetails.phoneNo) missingFields.push("Primary Contact");
            }
        }

        if (missingFields.length > 0) {
            toast.warn(`Please enter required details (${missingFields.join(", ")})`);
            return false;
        }

        // Validate Email & Phone Formats
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6789]\d{9}$/;
        const zipRegex = /^\d{6}$/;

        const invalidEmails = [];
        const invalidPhones = [];
        const invalidZips = [];
        const invalidShares = [];

        // Check primary address phone, email, zip
        if (addressDetails.email && !emailRegex.test(addressDetails.email)) invalidEmails.push("Primary Address Email");
        if (addressDetails.phoneNo && !phoneRegex.test(addressDetails.phoneNo)) invalidPhones.push("Primary Address Phone No (must be exactly 10 digits and start with 6, 7, 8, or 9)");
        if (addressDetails.zipCode && !zipRegex.test(addressDetails.zipCode)) invalidZips.push("Primary Address Zip Code (must be exactly 6 digits)");

        // Check extra addresses phone, email, zip
        extraAddresses.forEach((addr, idx) => {
            if (addr.email && !emailRegex.test(addr.email)) invalidEmails.push(`Address ${idx + 2} Email`);
            if (addr.phoneNo && !phoneRegex.test(addr.phoneNo)) invalidPhones.push(`Address ${idx + 2} Phone No (must be exactly 10 digits and start with 6, 7, 8, or 9)`);
            if (addr.zipCode && !zipRegex.test(addr.zipCode)) invalidZips.push(`Address ${idx + 2} Zip Code (must be exactly 6 digits)`);
        });

        // Check primary contact phone & email
        if (contactDetails.email && !emailRegex.test(contactDetails.email)) invalidEmails.push("Primary Contact Email");
        if (contactDetails.phoneNo && !phoneRegex.test(contactDetails.phoneNo)) invalidPhones.push("Primary Contact Phone No (must be exactly 10 digits and start with 6, 7, 8, or 9)");

        // Check extra contacts phone & email
        extraContacts.forEach((contact, idx) => {
            if (contact.email && !emailRegex.test(contact.email)) invalidEmails.push(`Contact ${idx + 2} Email`);
            if (contact.phoneNo && !phoneRegex.test(contact.phoneNo)) invalidPhones.push(`Contact ${idx + 2} Phone No (must be exactly 10 digits and start with 6, 7, 8, or 9)`);
        });

        // Check tax details email, pinCode
        if (taxDetails.email && !emailRegex.test(taxDetails.email)) invalidEmails.push("Tax Details Email");
        if (taxDetails.pinCode && !zipRegex.test(taxDetails.pinCode)) invalidZips.push("Tax Details Pin Code (must be exactly 6 digits)");
        extraTaxes.forEach((tax, idx) => {
            if (tax.email && !emailRegex.test(tax.email)) invalidEmails.push(`Tax ${idx + 2} Email`);
            if (tax.pinCode && !zipRegex.test(tax.pinCode)) invalidZips.push(`Tax ${idx + 2} Pin Code (must be exactly 6 digits)`);
        });

        // Validate Share Percentages (0 to 100)
        if (directorDetails.sharePercentage !== "" && directorDetails.sharePercentage !== null) {
            const val = parseFloat(directorDetails.sharePercentage);
            if (isNaN(val) || val < 0 || val > 100) invalidShares.push("Director Share %");
        }
        extraDirectors.forEach((dir, idx) => {
            if (dir.sharePercentage !== "" && dir.sharePercentage !== null && dir.sharePercentage !== undefined) {
                const val = parseFloat(dir.sharePercentage);
                if (isNaN(val) || val < 0 || val > 100) invalidShares.push(`Director ${idx + 2} Share %`);
            }
        });
        if (jointVenture.sharePercentage !== "" && jointVenture.sharePercentage !== null) {
            const val = parseFloat(jointVenture.sharePercentage);
            if (isNaN(val) || val < 0 || val > 100) invalidShares.push("JV Partner Share %");
        }
        extraJvs.forEach((jv, idx) => {
            if (jv.sharePercentage !== "" && jv.sharePercentage !== null && jv.sharePercentage !== undefined) {
                const val = parseFloat(jv.sharePercentage);
                if (isNaN(val) || val < 0 || val > 100) invalidShares.push(`JV ${idx + 2} Partner Share %`);
            }
        });

        if (invalidEmails.length > 0) {
            toast.warn(`Please enter valid Email ID format for: ${invalidEmails.join(", ")}`);
            return false;
        }

        if (invalidPhones.length > 0) {
            toast.warn(`Invalid Phone No: ${invalidPhones[0]}`);
            return false;
        }

        if (invalidZips.length > 0) {
            toast.warn(`Invalid Zip/Pin Code: ${invalidZips[0]}`);
            return false;
        }

        if (invalidShares.length > 0) {
            toast.warn(`Share percentage must be between 0 and 100 for: ${invalidShares.join(", ")}`);
            return false;
        }

        return true;
    };

    const handleSaveDraft = () => {
        const draftData = {
            basicInfo,
            addressDetails,
            contactDetails,
            taxDetails,
            isPrimaryAddress,
            directorDetails,
            jointVenture,
            companyProfile,
            additionalInfo,
            localName,
            addressList,
            contactList,
            taxList,
            directorList,
            jvList,
            additionalInfoList,
            localNameList,
            extraAddresses,
            extraContacts,
            extraTaxes,
            extraDirectors,
            extraJvs,
            extraAdditionalInfos,
            extraLocalNames,
            showDetails
        };
        localStorage.setItem('company_form_draft', JSON.stringify(draftData));
        toast.success("Draft saved to cache successfully");
        setActiveTab("review");
    };

    const handleSave = async () => {
        if (isSaving) return;

        if (!basicInfo.companyName || !basicInfo.shortName || !basicInfo.companyTypeId) {
            toast.warn("Please fill all required fields in Basic Information");
            return;
        }

        if (isCompany && !basicInfo.parentCompanyId) { // Validation for Parent Company
            toast.warn("Please select a Parent Company");
            return;
        }

        const toastId = toast.loading(editCompanyId ? "Updating company..." : "Saving company...");
        try {
            const formData = new FormData();
            const companyDTO = {
                companyId: editCompanyId || null,
                companyName: basicInfo.companyName.trim(),
                shortName: basicInfo.shortName.trim(),
                parentCompanyId: isCompany ? (basicInfo.parentCompanyId || null) : null,
                comTypeId: basicInfo.companyTypeId,
                comLevelId: basicInfo.companyLevelId,
                comNatureId: basicInfo.companyNatureId,
                businessNatureId: showDetails ? basicInfo.natureOfBusinessId : null,
                companyConstitutionId: showDetails ? basicInfo.constitutionId : null,
                statusId: showDetails ? basicInfo.companyStatusId : null,
                finStartMonth: showDetails ? basicInfo.finStartMonth : null,
                languageId: showDetails ? basicInfo.defaultLanguageId : null,
                currencyId: showDetails ? basicInfo.defaultCurrency : null,
                address: showDetails ? [
                    { ...addressDetails, isPrimary: isPrimaryAddress, stateOptions, cityOptions },
                    ...extraAddresses
                ].filter(a => a.addressTypeId).map(a => ({
                    id: a.id || null,
                    addressTypeId: a.addressTypeId,
                    address1: (a.address1 || "").trim(),
                    address2: (a.address2 || "").trim(),
                    country: getSelectedOption(a.countryId, countryOptions)?.label || null,
                    state: getSelectedOption(a.stateId, a.stateOptions || stateOptions)?.label || null,
                    city: getSelectedOption(a.cityId, a.cityOptions || cityOptions)?.label || null,
                    zipcode: (a.zipCode || "").trim(),
                    phone: (a.phoneNo || "").trim(),
                    faxNo: (a.faxNo || "").trim(),
                    email: (a.email || "").trim(),
                    website: (a.website || "").trim(),
                    isPrimary: !!a.isPrimary
                })) : [],
                profile: showDetails && (companyProfile.orderNo || companyProfile.description) ? [{
                    orderNo: companyProfile.orderNo,
                    description: (companyProfile.description || "").trim(),
                    remarks: (companyProfile.remarks || "").trim()
                }] : [],
                contacts: showDetails ? [
                    contactDetails,
                    ...extraContacts
                ].filter(c => c.name || c.position).map(c => ({
                    position: c.position || null,
                    name: (c.name || "").trim(),
                    phoneNo: (c.phoneNo || "").trim(),
                    email: (c.email || "").trim()
                })) : [],
                taxDetails: showDetails ? [
                    taxDetails,
                    ...extraTaxes
                ].filter(t => t.taxTypeId).map(t => ({
                    effectiveFrom: t.effectiveFrom ? new Date(t.effectiveFrom).toISOString().split('T')[0] : null,
                    effectiveTo: t.effectiveTo ? new Date(t.effectiveTo).toISOString().split('T')[0] : null,
                    taxTypeId: t.taxTypeId,
                    territoryTypeId: t.territoryTypeId,
                    territory: t.territory || null,
                    taxRegNo: (t.taxRegNo || "").trim(),
                    taxRegDate: t.taxRegDate ? new Date(t.taxRegDate).toISOString().split('T')[0] : null,
                    city: t.city || null,
                    address1: (t.address1 || "").trim(),
                    address2: (t.address2 || "").trim(),
                    pinCode: (t.pinCode || "").trim(),
                    email: (t.email || "").trim()
                })) : [],
                directors: showDetails ? [
                    directorDetails,
                    ...extraDirectors
                ].filter(d => d.directorName).map(d => ({
                    directorTypeId: d.directorTypeId,
                    directorName: (d.directorName || "").trim(),
                    sharePercentage: d.sharePercentage ? parseFloat(d.sharePercentage) : null,
                    noOfShares: d.noOfShares ? parseInt(d.noOfShares) : null
                })) : [],
                jointVentures: showDetails ? [
                    jointVenture,
                    ...extraJvs
                ].filter(j => j.partnerId).map(j => ({
                    partnerId: (j.partnerId || "").trim(),
                    sharePercentage: j.sharePercentage ? parseFloat(j.sharePercentage) : null
                })) : [],
                additionalInfos: showDetails ? [
                    additionalInfo,
                    ...extraAdditionalInfos
                ].filter(a => a.idTypeId).map(a => ({
                    idTypeId: a.idTypeId,
                    registrationNo: (a.registrationNo || "").trim()
                })) : [],
                localNames: showDetails ? [
                    localName,
                    ...extraLocalNames
                ].filter(l => l.name || l.languageId).map(l => ({
                    languageId: l.languageId,
                    name: (l.name || "").trim()
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
            if (response.status === 200 || response.status === 201) {
                toast.update(toastId, { render: editCompanyId ? "Company updated successfully" : "Company saved successfully", type: "success", isLoading: false, autoClose: 3000 });
                handleReset();
            }
        } catch (error) {
            console.error("Error saving company:", error);
            const msg = error.response?.data?.message || error.response?.data || error.message || "Failed to save company";
            toast.update(toastId, { render: msg, type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light p-4 mt-2">
            <div className="d-flex align-items-center mb-4 ps-2">
                <h2 className="mb-0 fs-5 fw-bold" style={{ color: bluePrimary }}>Company Details Form</h2>
            </div>

            <div className="bg-white rounded-3 shadow-sm mb-4 overflow-hidden">
                <div 
                    className={`d-flex tabs-scroll-container ${showDetails ? "justify-content-start" : "justify-content-center"} border-bottom overflow-x-auto`} 
                    style={{ 
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    <style>
                        {`
                            .tabs-scroll-container::-webkit-scrollbar {
                                height: 3px;
                            }
                            .tabs-scroll-container::-webkit-scrollbar-track {
                                background: #f1f1f1;
                                border-radius: 10px;
                            }
                            .tabs-scroll-container::-webkit-scrollbar-thumb {
                                background: #005197;
                                border-radius: 10px;
                            }
                            .tabs-scroll-container::-webkit-scrollbar-thumb:hover {
                                background: #005197CC;
                            }
                        `}
                    </style>
                    {tabs.filter(tab => showDetails || tab.id === "overview").map((tab) => (
                        <button
                            key={tab.id}
                            className={`custom-tab d-flex align-items-center px-4 py-3 text-nowrap ${activeTab === tab.id
                                ? "active"
                                : ""
                                }`}
                            onClick={() => {
                                if (activeTab === tab.id) return;
                                if (validateCurrentTab()) {
                                    setActiveTab(tab.id);
                                }
                            }}
                        >
                            <span className="me-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    {activeTab === "overview" && (
                        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px" }}>
                            <div className="card-body p-4 bg-white">
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

                                    {isCompany && (
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">Parent Company <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select Parent Company"
                                                value={getSelectedOption(basicInfo.parentCompanyId, parentCompanyOptions)}
                                                onChange={handleSelectChange(setBasicInfo, 'parentCompanyId')}
                                                options={parentCompanyOptions}
                                                isClearable
                                            />
                                        </div>
                                    )}

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
                                        <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                            {(basicInfo.companyName || "").length}/100
                                        </div>
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
                                        <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                            {(basicInfo.shortName || "").length}/50
                                        </div>
                                    </div>
                                    {showDetails && (
                                        <>
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
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {showDetails && (
                        <>
                            {activeTab === "address" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">                                        <div className="row mt-2">
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
                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                {(addressDetails.address1 || "").length}/100
                                            </div>
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
                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                {(addressDetails.address2 || "").length}/100
                                            </div>
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
                                                        stateId: null,
                                                        cityId: null
                                                    }));
                                                    if (selectedOption) {
                                                        fetchStates(selectedOption.value);
                                                    } else {
                                                        setStateOptions([]);
                                                        setCityOptions([]);
                                                    }
                                                }}
                                                options={countryOptions}
                                                isClearable
                                            />
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform-select d-block">State <span style={{ color: "red" }}>*</span></label>
                                            <Select
                                                classNamePrefix="select"
                                                placeholder="Select State"
                                                value={getSelectedOption(addressDetails.stateId, stateOptions)}
                                                onChange={(selectedOption) => {
                                                    setAddressDetails(prev => ({
                                                        ...prev,
                                                        stateId: selectedOption ? selectedOption.value : null,
                                                        cityId: null
                                                    }));
                                                    if (selectedOption) {
                                                        fetchCities(selectedOption.value);
                                                    } else {
                                                        setCityOptions([]);
                                                    }
                                                }}
                                                options={stateOptions}
                                                isClearable
                                                isDisabled={!addressDetails.countryId}
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
                                                isDisabled={!addressDetails.stateId}
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
                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                {(addressDetails.zipCode || "").length}/6
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4 position-relative">
                                            <label className="projectform d-block">Phone No</label>
                                            <PhoneInput
                                                value={addressDetails.phoneNo}
                                                onChange={(full) => setAddressDetails(prev => ({ ...prev, phoneNo: full }))}
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
                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                {(addressDetails.faxNo || "").length}/15
                                            </div>
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
                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                {(addressDetails.email || "").length}/100
                                            </div>
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
                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                {(addressDetails.website || "").length}/200
                                            </div>
                                        </div>
                                        <div className="col-md-12 mb-4">
                                            <div className="form-check form-switch custom-switch d-flex justify-content-end align-items-center w-100">
                                                <label className="form-check-label me-5 fw-bold" style={{ color: bluePrimary }}>
                                                    Is Primary <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={isPrimaryAddress}
                                                    onChange={(e) => setIsPrimaryAddress(e.target.checked)}
                                                    style={{ cursor: 'pointer', width: '45px', height: '22px' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </div>

                                    {/* Extra Address Sections */}
                                    {extraAddresses.map((extra, idx) => (
                                        <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                    <MapPin size={18} className="me-2" />
                                                    Address {idx + 2}
                                                </h6>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                    onClick={() => handleRemoveExtraAddress(idx)}
                                                    title="Remove this address section"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">Address Type <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select Address Type"
                                                        value={getSelectedOption(extra.addressTypeId, addressTypeOptions)}
                                                        onChange={(opt) => handleExtraAddressChange(idx, 'addressTypeId', opt ? opt.value : null)}
                                                        options={addressTypeOptions}
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Address 1</label>
                                                    <input
                                                        type="text"
                                                        value={extra.address1}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'address1', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Address 1"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.address1 || "").length}/100
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Address 2</label>
                                                    <input
                                                        type="text"
                                                        value={extra.address2}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'address2', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Address 2"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.address2 || "").length}/100
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">Country <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select Country"
                                                        value={getSelectedOption(extra.countryId, countryOptions)}
                                                        onChange={(opt) => {
                                                            handleExtraAddressChange(idx, 'countryId', opt ? opt.value : null);
                                                            if (opt) {
                                                                fetchExtraStates(idx, opt.value);
                                                            } else {
                                                                handleExtraAddressChange(idx, 'stateOptions', []);
                                                                handleExtraAddressChange(idx, 'cityOptions', []);
                                                                handleExtraAddressChange(idx, 'stateId', null);
                                                                handleExtraAddressChange(idx, 'cityId', null);
                                                            }
                                                        }}
                                                        options={countryOptions}
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">State <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select State"
                                                        value={getSelectedOption(extra.stateId, extra.stateOptions || [])}
                                                        onChange={(opt) => {
                                                            handleExtraAddressChange(idx, 'stateId', opt ? opt.value : null);
                                                            if (opt) {
                                                                fetchExtraCities(idx, opt.value);
                                                            } else {
                                                                handleExtraAddressChange(idx, 'cityOptions', []);
                                                                handleExtraAddressChange(idx, 'cityId', null);
                                                            }
                                                        }}
                                                        options={extra.stateOptions || []}
                                                        isClearable
                                                        isDisabled={!extra.countryId}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">City <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select City"
                                                        value={getSelectedOption(extra.cityId, extra.cityOptions || [])}
                                                        onChange={(opt) => handleExtraAddressChange(idx, 'cityId', opt ? opt.value : null)}
                                                        options={extra.cityOptions || []}
                                                        isClearable
                                                        isDisabled={!extra.stateId}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Zip Code</label>
                                                    <input
                                                        type="text"
                                                        value={extra.zipCode}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'zipCode', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Zip Code"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.zipCode || "").length}/6
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Phone No</label>
                                                    <PhoneInput
                                                        value={extra.phoneNo}
                                                        onChange={(full) => handleExtraAddressChange(idx, 'phoneNo', full)}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Fax No</label>
                                                    <input
                                                        type="text"
                                                        value={extra.faxNo}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'faxNo', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Fax No"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.faxNo || "").length}/15
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Email ID</label>
                                                    <input
                                                        type="email"
                                                        value={extra.email}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'email', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Email ID"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.email || "").length}/100
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Website</label>
                                                    <input
                                                        type="text"
                                                        value={extra.website}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'website', e.target.value.slice(0, 200))}
                                                        className="form-input w-100"
                                                        placeholder="Enter Website"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.website || "").length}/200
                                                    </div>
                                                </div>
                                                <div className="col-md-12 mb-4">
                                                    <div className="form-check form-switch custom-switch d-flex justify-content-end align-items-center w-100">
                                                        <label className="form-check-label me-5 fw-bold" style={{ color: bluePrimary }}>
                                                            Is Primary
                                                        </label>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={extra.isPrimary}
                                                            onChange={(e) => handleExtraAddressChange(idx, 'isPrimary', e.target.checked)}
                                                            style={{ cursor: 'pointer', width: '45px', height: '22px' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add One More Address Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreAddress}
                                        >
                                            <Plus size={18} />
                                            Add One More Address
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === "contact" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
                                        <div className="row mt-2">
                                            <div className="col-md-6 mb-4 position-relative">
                                                <label className="projectform-select d-block">Position <span style={{ color: "red" }}>*</span></label>
                                                <Select
                                                    options={designationOptions}
                                                    placeholder="Select designation"
                                                    className="w-100"
                                                    classNamePrefix="select"
                                                    isClearable
                                                    value={designationOptions.find(o => o.value === contactDetails.position) || null}
                                                    onChange={(opt) => setContactDetails(prev => ({ ...prev, position: opt ? opt.value : "" }))}
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
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(contactDetails.name || "").length}/50
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4 position-relative">
                                                <label className="projectform d-block">Phone No <span style={{ color: "red" }}>*</span></label>
                                                <PhoneInput
                                                    value={contactDetails.phoneNo}
                                                    onChange={(full) => setContactDetails(prev => ({ ...prev, phoneNo: full }))}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-4 position-relative">
                                                <label className="projectform d-block">Email ID <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={contactDetails.email}
                                                    onChange={handleInputChange(setContactDetails)}
                                                    className="form-input w-100"
                                                    placeholder="Enter Email ID"
                                                />
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(contactDetails.email || "").length}/100
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Extra Contact Sections */}
                                    {extraContacts.map((extra, idx) => (
                                        <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                    <Mail size={18} className="me-2" />
                                                    Contact {idx + 2}
                                                </h6>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                    onClick={() => handleRemoveSection(setExtraContacts)(idx)}
                                                    title="Remove this contact section"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">Position <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        options={designationOptions}
                                                        placeholder="Select designation"
                                                        className="w-100"
                                                        classNamePrefix="select"
                                                        isClearable
                                                        value={designationOptions.find(o => o.value === extra.position) || null}
                                                        onChange={(opt) => handleSectionChange(setExtraContacts)(idx, 'position', opt ? opt.value : "")}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Name <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        value={extra.name}
                                                        onChange={(e) => handleSectionChange(setExtraContacts)(idx, 'name', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Name"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.name || "").length}/50
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Phone No <span style={{ color: "red" }}>*</span></label>
                                                    <PhoneInput
                                                        value={extra.phoneNo}
                                                        onChange={(full) => handleSectionChange(setExtraContacts)(idx, 'phoneNo', full)}
                                                        required
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Email ID <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="email"
                                                        value={extra.email}
                                                        onChange={(e) => handleSectionChange(setExtraContacts)(idx, 'email', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Email ID"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.email || "").length}/100
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add One More Contact Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreSection(setExtraContacts, emptyContact)}
                                        >
                                            <Plus size={18} />
                                            Add One More Contact
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === "tax" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
                                        <div className="row mt-2">
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
                                            {taxDetails.taxTypeId !== 'GST_UNREGISTER' && (
                                                <>
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
                                                    {['STATE', 'CITY'].includes(taxDetails.territoryTypeId) && (
                                                        <>
                                                            <div className={`${taxDetails.territoryTypeId === 'CITY' ? 'col-md-4' : 'col-md-6'} mb-4 position-relative`}>
                                                                <label className="projectform-select d-block">Filter Country <span style={{ color: "red" }}>*</span></label>
                                                                <Select
                                                                    classNamePrefix="select"
                                                                    placeholder="Select Country"
                                                                    value={taxFilterCountry}
                                                                    onChange={handleTaxCountryFilterChange}
                                                                    options={taxCountryOptions}
                                                                    isClearable
                                                                />
                                                            </div>
                                                            {taxDetails.territoryTypeId === 'CITY' && (
                                                                <div className="col-md-4 mb-4 position-relative">
                                                                    <label className="projectform-select d-block">Filter State <span style={{ color: "red" }}>*</span></label>
                                                                    <Select
                                                                        classNamePrefix="select"
                                                                        placeholder="Select State"
                                                                        value={taxFilterState}
                                                                        onChange={handleTaxStateFilterChange}
                                                                        options={taxStateOptions}
                                                                        isDisabled={!taxFilterCountry}
                                                                        isClearable
                                                                    />
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                    <div className={`${taxDetails.territoryTypeId === 'CITY' ? 'col-md-4' : 'col-md-6'} mb-4 position-relative`}>
                                                        <label className="projectform-select d-block">Territory <span style={{ color: "red" }}>*</span></label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            placeholder="Select Territory"
                                                            value={getSelectedOption(taxDetails.territory, territoryOptions)}
                                                            onChange={handleSelectChange(setTaxDetails, 'territory')}
                                                            options={territoryOptions}
                                                            isDisabled={
                                                                (taxDetails.territoryTypeId === 'STATE' && !taxFilterCountry) ||
                                                                (taxDetails.territoryTypeId === 'CITY' && !taxFilterState)
                                                            }
                                                            isClearable
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
                                                        <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                            {(taxDetails.taxRegNo || "").length}/50
                                                        </div>
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
                                                        <label className="projectform d-block">Address 1</label>
                                                        <input
                                                            type="text"
                                                            name="address1"
                                                            value={taxDetails.address1}
                                                            onChange={handleInputChange(setTaxDetails)}
                                                            className="form-input w-100"
                                                            placeholder="Enter Address 1"
                                                        />
                                                        <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                            {(taxDetails.address1 || "").length}/100
                                                        </div>
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
                                                        <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                            {(taxDetails.address2 || "").length}/100
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Extra Tax Sections */}
                                    {extraTaxes.map((extra, idx) => (
                                        <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                    <Landmark size={18} className="me-2" />
                                                    Tax Details {idx + 2}
                                                </h6>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                    onClick={() => handleRemoveSection(setExtraTaxes)(idx)}
                                                    title="Remove this tax section"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">Tax Type <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select Tax Type"
                                                        value={getSelectedOption(extra.taxTypeId, taxTypeOptions)}
                                                        onChange={(opt) => handleSectionChange(setExtraTaxes)(idx, 'taxTypeId', opt ? opt.value : null)}
                                                        options={taxTypeOptions}
                                                        isClearable
                                                    />
                                                </div>
                                                {extra.taxTypeId !== 'GST_UNREGISTER' && (
                                                    <>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform-select d-block">Territory Type <span style={{ color: "red" }}>*</span></label>
                                                            <Select
                                                                classNamePrefix="select"
                                                                placeholder="Select Territory Type"
                                                                value={getSelectedOption(extra.territoryTypeId, territoryTypeOptions)}
                                                                onChange={(opt) => {
                                                                    const newTerritoryTypeId = opt ? opt.value : null;
                                                                    handleSectionChange(setExtraTaxes)(idx, 'territoryTypeId', newTerritoryTypeId);
                                                                    if (newTerritoryTypeId) {
                                                                        fetchExtraTaxTerritory(idx, newTerritoryTypeId);
                                                                    } else {
                                                                        handleSectionChange(setExtraTaxes)(idx, 'territoryOptions', []);
                                                                        handleSectionChange(setExtraTaxes)(idx, 'territory', null);
                                                                        handleSectionChange(setExtraTaxes)(idx, 'taxCountryOptions', []);
                                                                        handleSectionChange(setExtraTaxes)(idx, 'taxFilterCountry', null);
                                                                        handleSectionChange(setExtraTaxes)(idx, 'taxStateOptions', []);
                                                                        handleSectionChange(setExtraTaxes)(idx, 'taxFilterState', null);
                                                                    }
                                                                }}
                                                                options={territoryTypeOptions}
                                                                isClearable
                                                            />
                                                        </div>
                                                        {['STATE', 'CITY'].includes(extra.territoryTypeId) && (
                                                            <>
                                                                <div className={`${extra.territoryTypeId === 'CITY' ? 'col-md-4' : 'col-md-6'} mb-4 position-relative`}>
                                                                    <label className="projectform-select d-block">Filter Country <span style={{ color: "red" }}>*</span></label>
                                                                    <Select
                                                                        classNamePrefix="select"
                                                                        placeholder="Select Country"
                                                                        value={extra.taxFilterCountry}
                                                                        onChange={(opt) => handleExtraTaxCountryFilterChange(idx, opt, extra.territoryTypeId)}
                                                                        options={extra.taxCountryOptions || []}
                                                                        isClearable
                                                                    />
                                                                </div>
                                                                {extra.territoryTypeId === 'CITY' && (
                                                                    <div className="col-md-4 mb-4 position-relative">
                                                                        <label className="projectform-select d-block">Filter State <span style={{ color: "red" }}>*</span></label>
                                                                        <Select
                                                                            classNamePrefix="select"
                                                                            placeholder="Select State"
                                                                            value={extra.taxFilterState}
                                                                            onChange={(opt) => handleExtraTaxStateFilterChange(idx, opt, extra.territoryTypeId)}
                                                                            options={extra.taxStateOptions || []}
                                                                            isDisabled={!extra.taxFilterCountry}
                                                                            isClearable
                                                                        />
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                        <div className={`${extra.territoryTypeId === 'CITY' ? 'col-md-4' : 'col-md-6'} mb-4 position-relative`}>
                                                            <label className="projectform-select d-block">Territory <span style={{ color: "red" }}>*</span></label>
                                                            <Select
                                                                classNamePrefix="select"
                                                                placeholder="Select Territory"
                                                                value={getSelectedOption(extra.territory, extra.territoryOptions || [])}
                                                                onChange={(opt) => handleSectionChange(setExtraTaxes)(idx, 'territory', opt ? opt.value : null)}
                                                                options={extra.territoryOptions || []}
                                                                isDisabled={
                                                                    (extra.territoryTypeId === 'STATE' && !extra.taxFilterCountry) ||
                                                                    (extra.territoryTypeId === 'CITY' && !extra.taxFilterState)
                                                                }
                                                                isClearable
                                                            />
                                                        </div>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform d-block">Tax Reg. No <span style={{ color: "red" }}>*</span></label>
                                                            <input
                                                                type="text"
                                                                value={extra.taxRegNo}
                                                                onChange={(e) => handleSectionChange(setExtraTaxes)(idx, 'taxRegNo', e.target.value)}
                                                                className="form-input w-100"
                                                                placeholder="Enter Tax Reg. No"
                                                            />
                                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                                {(extra.taxRegNo || "").length}/50
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform d-block">Tax Reg. Date <span style={{ color: "red" }}>*</span></label>
                                                            <Flatpickr
                                                                className="form-input w-100"
                                                                placeholder="Select Date"
                                                                value={extra.taxRegDate}
                                                                onChange={(date) => handleSectionChange(setExtraTaxes)(idx, 'taxRegDate', date[0])}
                                                                options={{ dateFormat: "d-M-Y" }}
                                                            />
                                                            <CalendarIcon className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: "none" }} />
                                                        </div>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform d-block">Effective From <span style={{ color: "red" }}>*</span></label>
                                                            <Flatpickr
                                                                className="form-input w-100"
                                                                placeholder="Select Date"
                                                                value={extra.effectiveFrom}
                                                                onChange={(date) => handleSectionChange(setExtraTaxes)(idx, 'effectiveFrom', date[0])}
                                                                options={{ dateFormat: "d-M-Y" }}
                                                            />
                                                            <CalendarIcon className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: "none" }} />
                                                        </div>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform d-block">Effective To</label>
                                                            <Flatpickr
                                                                className="form-input w-100"
                                                                placeholder="Select Date"
                                                                value={extra.effectiveTo}
                                                                onChange={(date) => handleSectionChange(setExtraTaxes)(idx, 'effectiveTo', date[0])}
                                                                options={{ dateFormat: "d-M-Y" }}
                                                            />
                                                            <CalendarIcon className="position-absolute end-0 top-50 translate-middle-y me-3" style={{ pointerEvents: "none" }} />
                                                        </div>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform d-block">Address 1</label>
                                                            <input
                                                                type="text"
                                                                value={extra.address1}
                                                                onChange={(e) => handleSectionChange(setExtraTaxes)(idx, 'address1', e.target.value)}
                                                                className="form-input w-100"
                                                                placeholder="Enter Address 1"
                                                            />
                                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                                {(extra.address1 || "").length}/100
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 mb-4 position-relative">
                                                            <label className="projectform d-block">Address 2</label>
                                                            <input
                                                                type="text"
                                                                value={extra.address2}
                                                                onChange={(e) => handleSectionChange(setExtraTaxes)(idx, 'address2', e.target.value)}
                                                                className="form-input w-100"
                                                                placeholder="Enter Address 2"
                                                            />
                                                            <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                                {(extra.address2 || "").length}/100
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add One More Tax Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreSection(setExtraTaxes, emptyTax)}
                                        >
                                            <Plus size={18} />
                                            Add One More Tax Detail
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === "director" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
                                        <div className="row mt-2">
                                            <div className="col-md-6 mb-4 position-relative">
                                                <label className="projectform-select d-block">Director Type <span style={{ color: "red" }}>*</span></label>
                                                <Select
                                                    classNamePrefix="select"
                                                    placeholder="Select Director Type"
                                                    value={getSelectedOption(directorDetails.directorTypeId, directorTypeOptions)}
                                                    onChange={handleSelectChange(setDirectorDetails, 'directorTypeId')}
                                                    options={directorTypeOptions}
                                                    isClearable
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
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(directorDetails.directorName || "").length}/50
                                                </div>
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

                                    {/* Extra Director Sections */}
                                    {extraDirectors.map((extra, idx) => (
                                        <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                    <Users size={18} className="me-2" />
                                                    Director {idx + 2}
                                                </h6>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                    onClick={() => handleRemoveSection(setExtraDirectors)(idx)}
                                                    title="Remove this director section"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">Director Type <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select Director Type"
                                                        value={getSelectedOption(extra.directorTypeId, directorTypeOptions)}
                                                        onChange={(opt) => handleSectionChange(setExtraDirectors)(idx, 'directorTypeId', opt ? opt.value : null)}
                                                        options={directorTypeOptions}
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Director Name <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        value={extra.directorName}
                                                        onChange={(e) => handleSectionChange(setExtraDirectors)(idx, 'directorName', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Director Name"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.directorName || "").length}/50
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Share %</label>
                                                    <input
                                                        type="number"
                                                        value={extra.sharePercentage}
                                                        onChange={(e) => handleSectionChange(setExtraDirectors)(idx, 'sharePercentage', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">No of Shares</label>
                                                    <input
                                                        type="number"
                                                        value={extra.noOfShares}
                                                        onChange={(e) => handleSectionChange(setExtraDirectors)(idx, 'noOfShares', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter No of Shares"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add One More Director Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreSection(setExtraDirectors, emptyDirector)}
                                        >
                                            <Plus size={18} />
                                            Add One More Director
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === "jv" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
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
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(jointVenture.partnerId || "").length}/50
                                                </div>
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

                                    {/* Extra JV Sections */}
                                    {extraJvs.map((extra, idx) => (
                                        <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                    <Handshake size={18} className="me-2" />
                                                    Joint Venture {idx + 2}
                                                </h6>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                    onClick={() => handleRemoveSection(setExtraJvs)(idx)}
                                                    title="Remove this joint venture section"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Partner Name <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        value={extra.partnerId}
                                                        onChange={(e) => handleSectionChange(setExtraJvs)(idx, 'partnerId', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Partner Name"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.partnerId || "").length}/50
                                                    </div>
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Share % <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="number"
                                                        value={extra.sharePercentage}
                                                        onChange={(e) => handleSectionChange(setExtraJvs)(idx, 'sharePercentage', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add One More JV Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreSection(setExtraJvs, emptyJv)}
                                        >
                                            <Plus size={18} />
                                            Add One More Joint Venture
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === "profile" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
                                        <div className="row mb-4">
                                            <div className="col-md-6 position-relative">
                                                <label className="projectform d-block">Order No <span style={{ color: "red" }}>*</span></label>
                                                <input
                                                    type="number"
                                                    value={companyProfile.orderNo}
                                                    min={1}
                                                    max={2147483647}
                                                    onChange={(e) => {
                                                        const raw = e.target.value.replace(/\D/g, '');
                                                        const num = parseInt(raw, 10);
                                                        if (raw === '' || (!isNaN(num) && num >= 1 && num <= 2147483647)) {
                                                            setCompanyProfile(prev => ({ ...prev, orderNo: raw === '' ? '' : num }));
                                                        }
                                                    }}
                                                    className="form-input w-100"
                                                    placeholder="Enter Order No (1 - 2147483647)"
                                                />
                                            </div>
                                            <div className="col-md-6 position-relative">
                                                <label className="projectform d-block">Remarks</label>
                                                <input
                                                    type="text"
                                                    value={companyProfile.remarks}
                                                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, remarks: e.target.value.substring(0, 100) }))}
                                                    className="form-input w-100"
                                                    placeholder="Enter Remarks"
                                                />
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(companyProfile.remarks || "").length}/100
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-4">
                                            <div className="col-12 position-relative">
                                                <label className="projectform d-block">Description <span style={{ color: "red" }}>*</span></label>
                                                <textarea
                                                    rows="4"
                                                    value={companyProfile.description}
                                                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, description: e.target.value.substring(0, 255) }))}
                                                    className="form-input w-100"
                                                    placeholder="Enter Description"
                                                    style={{ height: 'auto', minHeight: '80px', resize: 'vertical', paddingTop: '15px' }}
                                                />
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(companyProfile.description || "").length}/255
                                                </div>
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
                            )}
                            {activeTab === "additional" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
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
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(additionalInfo.registrationNo || "").length}/50
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Extra Additional Info Sections */}
                                    {extraAdditionalInfos.map((extra, idx) => (
                                        <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                    <Info size={18} className="me-2" />
                                                    Additional Info {idx + 2}
                                                </h6>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                    onClick={() => handleRemoveSection(setExtraAdditionalInfos)(idx)}
                                                    title="Remove this additional info section"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            </div>
                                            <div className="row mt-2">
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform-select d-block">Type <span style={{ color: "red" }}>*</span></label>
                                                    <Select
                                                        classNamePrefix="select"
                                                        placeholder="Select Type"
                                                        value={getSelectedOption(extra.idTypeId, additionalInfoTypeOptions)}
                                                        onChange={(opt) => handleSectionChange(setExtraAdditionalInfos)(idx, 'idTypeId', opt ? opt.value : null)}
                                                        options={additionalInfoTypeOptions}
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Registration No</label>
                                                    <input
                                                        type="text"
                                                        value={extra.registrationNo}
                                                        onChange={(e) => handleSectionChange(setExtraAdditionalInfos)(idx, 'registrationNo', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Registration No"
                                                    />
                                                    <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                        {(extra.registrationNo || "").length}/50
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add One More Additional Info Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreSection(setExtraAdditionalInfos, emptyAdditionalInfo)}
                                        >
                                            <Plus size={18} />
                                            Add One More Additional Info
                                        </button>
                                    </div>
                                </div>
                            )}
                            {activeTab === "local" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
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
                                                <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                    {(localName.name || "").length}/50
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Extra Local Name Sections */}
                                    {extraLocalNames.map((extra, idx) => {
                                        return (
                                            <div key={idx} className="card-body p-4 bg-white" style={{ borderTop: `2px solid ${bluePrimary}` }}>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h6 className="mb-0 fw-bold" style={{ color: bluePrimary }}>
                                                        <Languages size={18} className="me-2" />
                                                        Local Name {idx + 2}
                                                    </h6>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                                        onClick={() => handleRemoveSection(setExtraLocalNames)(idx)}
                                                        title="Remove this local name section"
                                                    >
                                                        <Trash2 size={16} />
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="row mt-2">
                                                    <div className="col-md-6 mb-4 position-relative">
                                                        <label className="projectform-select d-block">Language <span style={{ color: "red" }}>*</span></label>
                                                        <Select
                                                            classNamePrefix="select"
                                                            placeholder="Select Language"
                                                            value={getSelectedOption(extra.languageId, languageOptions)}
                                                            onChange={(opt) => handleSectionChange(setExtraLocalNames)(idx, 'languageId', opt ? opt.value : null)}
                                                            options={languageOptions}
                                                            isClearable
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-4 position-relative">
                                                        <label className="projectform d-block">Name <span style={{ color: "red" }}>*</span></label>
                                                        <input
                                                            type="text"
                                                            value={extra.name}
                                                            onChange={(e) => handleSectionChange(setExtraLocalNames)(idx, 'name', e.target.value)}
                                                            className="form-input w-100"
                                                            placeholder="Enter Local Name"
                                                        />
                                                        <div className="text-end text-muted" style={{ fontSize: '10px', marginTop: '2px' }}>
                                                            {(extra.name || "").length}/50
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Add One More Local Name Button */}
                                    <div className="card-body px-4 pb-4 pt-3 bg-white">
                                        <button
                                            type="button"
                                            className="btn d-flex align-items-center gap-2 fw-bold"
                                            style={{
                                                color: bluePrimary,
                                                border: `1.5px dashed ${bluePrimary}`,
                                                borderRadius: '8px',
                                                padding: '10px 20px'
                                            }}
                                            onClick={handleAddMoreSection(setExtraLocalNames, emptyLocalName)}
                                        >
                                            <Plus size={18} />
                                            Add One More Local Name
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "review" && (
                                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "8px", }}>
                                    <div className="card-body p-4 bg-white">
                                        <h5 className="fw-bold mb-4" style={{ color: bluePrimary }}>Review All Details</h5>
                                        
                                        <div className="review-section mb-4">
                                            <h6 className="fw-bold border-bottom pb-2 mb-3" style={{ color: bluePrimary }}>Basic Information</h6>
                                            <div className="row g-3">
                                                <div className="col-md-4"><strong>Company Name:</strong> {basicInfo.companyName}</div>
                                                <div className="col-md-4"><strong>Short Name:</strong> {basicInfo.shortName}</div>
                                                <div className="col-md-4"><strong>Type:</strong> {getSelectedOption(basicInfo.companyTypeId, companyTypeOptions)?.label}</div>
                                                <div className="col-md-4"><strong>Level:</strong> {getSelectedOption(basicInfo.companyLevelId, companyLevelOptions)?.label}</div>
                                                {isCompany && <div className="col-md-4"><strong>Parent Company:</strong> {getSelectedOption(basicInfo.parentCompanyId, parentCompanyOptions)?.label}</div>}
                                                {showDetails && (
                                                    <>
                                                        <div className="col-md-4"><strong>Status:</strong> {getSelectedOption(basicInfo.companyStatusId, companyStatusOptions)?.label}</div>
                                                        <div className="col-md-4"><strong>Fin. Start Month:</strong> {basicInfo.finStartMonth}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="review-section mb-4">
                                            <h6 className="fw-bold border-bottom pb-2 mb-3" style={{ color: bluePrimary }}>Address Details</h6>
                                            <div className="mb-3">
                                                <div className="badge bg-primary mb-2">Primary Address</div>
                                                <div className="ps-3 border-start">
                                                    <div>{addressDetails.address1} {addressDetails.address2}</div>
                                                    <div>{getSelectedOption(addressDetails.cityId, cityOptions)?.label}, {getSelectedOption(addressDetails.stateId, stateOptions)?.label}, {getSelectedOption(addressDetails.countryId, countryOptions)?.label}</div>
                                                    <div>Zip: {addressDetails.zipCode} | Phone: {addressDetails.phoneNo}</div>
                                                </div>
                                            </div>
                                            {extraAddresses.map((addr, idx) => {
                                                return (
                                                    <div key={idx} className="mb-3">
                                                        <div className="badge bg-secondary mb-2">Additional Address {idx + 2}</div>
                                                        <div className="ps-3 border-start">
                                                            <div>{addr.address1} {addr.address2}</div>
                                                            <div>{getSelectedOption(addr.cityId, cityOptions)?.label}, {getSelectedOption(addr.stateId, stateOptions)?.label}, {getSelectedOption(addr.countryId, countryOptions)?.label}</div>
                                                            <div>Zip: {addr.zipCode} | Phone: {addr.phoneNo}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="review-section mb-4">
                                            <h6 className="fw-bold border-bottom pb-2 mb-3" style={{ color: bluePrimary }}>Contacts</h6>
                                            <div className="table-responsive">
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Position</th>
                                                            <th>Phone</th>
                                                            <th>Email</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{contactDetails.name}</td>
                                                            <td>{getSelectedOption(contactDetails.position, designationOptions)?.label || contactDetails.position}</td>
                                                            <td>{contactDetails.phoneNo}</td>
                                                            <td>{contactDetails.email}</td>
                                                        </tr>
                                                        {extraContacts.map((c, idx) => {
                                                            return (
                                                                <tr key={idx}>
                                                                    <td>{c.name}</td>
                                                                    <td>{getSelectedOption(c.position, designationOptions)?.label || c.position}</td>
                                                                    <td>{c.phoneNo}</td>
                                                                    <td>{c.email}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Simplified summary for other sections to save space */}
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <h6 className="fw-bold border-bottom pb-2 mb-2" style={{ color: bluePrimary }}>Tax Details</h6>
                                                <div>{taxList.length + 1 + extraTaxes.length} Records entered</div>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <h6 className="fw-bold border-bottom pb-2 mb-2" style={{ color: bluePrimary }}>Directors</h6>
                                                <div>{directorList.length + 1 + extraDirectors.length} Records entered</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4 pb-5">
                <div>
                    {activeTab !== "overview" && (
                        <button className="btn px-4 fw-bold d-flex align-items-center gap-2" style={{ color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '8px' }} onClick={() => {
                            const visibleTabs = tabs.filter(tab => showDetails || tab.id === "overview");
                            const currentIdx = visibleTabs.findIndex(t => t.id === activeTab);
                            if (currentIdx > 0) setActiveTab(visibleTabs[currentIdx - 1].id);
                        }}>
                            <ArrowLeft size={18} />
                            Previous
                        </button>
                    )}
                </div>
                <div className="d-flex gap-3">
                    <button className="btn px-4 fw-bold d-flex align-items-center gap-2" style={{ color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '8px' }} onClick={handleSaveDraft}>
                        <Save size={18} />
                        Save as Draft
                    </button>
                    <button className="btn px-4 fw-bold d-flex align-items-center gap-2" style={{ color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '8px' }} onClick={handleReset}>
                        <RotateCcw size={18} />
                        Reset
                    </button>
                    {(activeTab === "review" || (!showDetails && activeTab === "overview")) ? (
                        <button
                            className="btn px-4 fw-bold text-white d-flex align-items-center gap-2"
                            style={{ backgroundColor: bluePrimary, borderRadius: '8px' }}
                            onClick={() => {
                                if (validateCurrentTab()) {
                                    handleSave();
                                }
                            }}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Saving...
                                </>
                            ) : (
                                "Save Details"
                            )}
                        </button>
                    ) : (
                        <button className="btn px-4 fw-bold text-white d-flex align-items-center gap-2" style={{ backgroundColor: bluePrimary, borderRadius: '8px' }} onClick={() => {
                            if (validateCurrentTab()) {
                                const visibleTabs = tabs.filter(tab => showDetails || tab.id === "overview");
                                const currentIdx = visibleTabs.findIndex(t => t.id === activeTab);
                                if (currentIdx < visibleTabs.length - 1) setActiveTab(visibleTabs[currentIdx + 1].id);
                            }
                        }}>
                            Next
                            <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompanyForm;