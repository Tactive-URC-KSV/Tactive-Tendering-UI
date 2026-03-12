import { useState, useEffect } from 'react';
import { Building2, MapPin, Mail, Landmark, Users, UploadCloud, FileText, X, Handshake, Info, Languages, Calendar, Building, Briefcase, Plus, Trash2, ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import Select from 'react-select';
import Flatpickr from "react-flatpickr";
import '../CSS/custom-flatpickr.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function CompanyForm() {
    const bluePrimary = "#005197";

    const [activeTab, setActiveTab] = useState("overview");

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
            .then(r => setCompanyLevelOptions(
                (r.data?.data ?? r.data ?? []).map(item => ({
                    value: item.code,
                    label: item.label
                }))
            ));
        axios.get(`${baseUrl}/companyStatus`, { headers })
            .then(r => setCompanyStatusOptions(toOptions(r.data, "comStatus")));
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
            .then(r => setTaxTypeOptions(toOptions(r.data, "taxType")));
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
        defaultCurrency: null,
        bank: ""
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
        setExtraAddresses(prev => prev.map((addr, i) => {
            if (i !== index) return addr;
            return { ...addr, [field]: value };
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
        setter(prev => prev.map((item, i) => i !== index ? item : { ...item, [field]: value }));
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
    const [parentCompanyOptions, setParentCompanyOptions] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const selectedCompanyType = companyTypeOptions.find(opt => opt.value === basicInfo.companyTypeId);
    const isCompany = selectedCompanyType?.value === 'COMPANY';
    const showDetails = isGroup;

    useEffect(() => {
        if (!showDetails && activeTab !== "overview") {
            setActiveTab("overview");
        }
    }, [showDetails, activeTab]);

    useEffect(() => {
        const selectedType = companyTypeOptions.find(opt => opt.value === basicInfo.companyTypeId);
        const isGroupType = selectedType?.label?.toLowerCase() === 'group' || selectedType?.value === 'GROUP';
        const isCompanyType = selectedType?.label?.toLowerCase() === 'company' || selectedType?.value === 'COMPANY';
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
        if (!taxDetails.taxTypeId || !taxDetails.territoryTypeId || !taxDetails.taxRegNo || !taxDetails.taxRegDate || !taxDetails.effectiveFrom) {
            toast.warn("Please enter required tax details");
            return;
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
            if (!taxDetails.territoryTypeId) missingFields.push("Territory Type");
            if (['STATE', 'CITY'].includes(taxDetails.territoryTypeId)) {
                if (!taxFilterCountry) missingFields.push("Filter Country");
                if (taxDetails.territoryTypeId === 'CITY' && !taxFilterState) missingFields.push("Filter State");
            }
            if (!taxDetails.territory) missingFields.push("Territory");
            if (!taxDetails.taxRegNo) missingFields.push("Tax Reg. No");
            if (!taxDetails.taxRegDate) missingFields.push("Tax Reg. Date");
            if (!taxDetails.effectiveFrom) missingFields.push("Effective From");

            extraTaxes.forEach((extra, idx) => {
                if (!extra.taxTypeId) missingFields.push(`Tax ${idx + 2} Type`);
                if (!extra.territoryTypeId) missingFields.push(`Tax ${idx + 2} Territory Type`);
                if (['STATE', 'CITY'].includes(extra.territoryTypeId)) {
                    if (!extra.taxFilterCountry) missingFields.push(`Tax ${idx + 2} Filter Country`);
                    if (extra.territoryTypeId === 'CITY' && !extra.taxFilterState) missingFields.push(`Tax ${idx + 2} Filter State`);
                }
                if (!extra.territory) missingFields.push(`Tax ${idx + 2} Territory`);
                if (!extra.taxRegNo) missingFields.push(`Tax ${idx + 2} Reg. No`);
                if (!extra.taxRegDate) missingFields.push(`Tax ${idx + 2} Reg. Date`);
                if (!extra.effectiveFrom) missingFields.push(`Tax ${idx + 2} Effective From`);
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
        }

        if (missingFields.length > 0) {
            toast.warn(`Please enter required details (${missingFields.join(", ")})`);
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!basicInfo.companyName || !basicInfo.shortName || !basicInfo.companyTypeId) {
            toast.warn("Please fill all required fields in Basic Information");
            return;
        }

        if (isCompany && !basicInfo.parentCompanyId) { // Validation for Parent Company
            toast.warn("Please select a Parent Company");
            return;
        }

        try {
            const formData = new FormData();
            const companyDTO = {
                companyId: null,
                companyName: basicInfo.companyName.trim(),
                shortName: basicInfo.shortName.trim(),
                parentCompanyId: isCompany ? (basicInfo.parentCompanyId || null) : null,
                comTypeId: basicInfo.companyTypeId,
                comLevelId: basicInfo.companyLevelId,
                comNatureId: basicInfo.companyNatureId,
                businessNatureId: showDetails ? basicInfo.natureOfBusinessId : null,
                companyConstitutionId: showDetails ? basicInfo.constitutionId : null,
                statusId: showDetails ? basicInfo.companyStatusId : null,
                languageId: showDetails ? basicInfo.defaultLanguageId : null,
                currencyId: showDetails ? basicInfo.defaultCurrency : null,
                bank: showDetails ? basicInfo.bank.trim() : "",
                address: showDetails ? addressList.map(a => ({
                    addressTypeId: a.addressTypeId,
                    address1: a.address1.trim(),
                    address2: a.address2.trim(),
                    countryId: a.countryId,
                    stateId: a.stateId,
                    cityId: a.cityId,
                    zipCode: a.zipCode.trim(),
                    phoneNo: a.phoneNo.trim(),
                    faxNo: a.faxNo.trim(),
                    email: a.email.trim(),
                    website: a.website.trim(),
                    isPrimary: a.isPrimary
                })) : [],
                profile: showDetails ? {
                    orderNo: companyProfile.orderNo,
                    description: companyProfile.description.trim(),
                    remarks: companyProfile.remarks.trim()
                } : null,
                contacts: showDetails ? contactList.map(c => ({
                    position: c.position || null,
                    name: c.name.trim(),
                    phoneNo: c.phoneNo.trim(),
                    email: c.email.trim()
                })) : [],
                taxDetails: showDetails ? taxList.map(t => ({
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
                    email: t.email.trim()
                })) : [],
                directors: showDetails ? directorList.map(d => ({
                    directorTypeId: d.directorTypeId,
                    directorName: d.directorName.trim(),
                    sharePercentage: d.sharePercentage ? parseFloat(d.sharePercentage) : null,
                    noOfShares: d.noOfShares ? parseInt(d.noOfShares) : null
                })) : [],
                jointVentures: showDetails ? jvList.map(j => ({
                    partnerId: j.partnerId.trim(),
                    sharePercentage: j.sharePercentage ? parseFloat(j.sharePercentage) : null
                })) : [],
                additionalInfos: showDetails ? additionalInfoList.map(a => ({
                    idTypeId: a.idTypeId,
                    registrationNo: a.registrationNo.trim()
                })) : [],
                localNames: showDetails ? localNameList.map(l => ({
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
                handleReset();
            }
        } catch (error) {
            console.error("Error saving company:", error);
            const msg = error.response?.data || error.message || "Failed to save company";
            toast.error(msg);
        }
    };

    return (
        <div className="container-fluid min-vh-100 bg-light p-4 mt-2">
            <div className="d-flex align-items-center mb-4 ps-2">
                <h2 className="mb-0 fs-5 fw-bold" style={{ color: bluePrimary }}>Company Details Form</h2>
            </div>

            <div className="bg-white rounded-3 shadow-sm mb-4">
                <div className={`d-flex justify-content-${showDetails ? "between" : "center"} border-bottom overflow-auto`}>
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
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Phone No</label>
                                                    <input
                                                        type="text"
                                                        value={extra.phoneNo}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'phoneNo', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Phone No"
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
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Website</label>
                                                    <input
                                                        type="text"
                                                        value={extra.website}
                                                        onChange={(e) => handleExtraAddressChange(idx, 'website', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Website"
                                                    />
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
                                                <label className="projectform d-block">Phone No <span style={{ color: "red" }}>*</span></label>
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
                                                <label className="projectform d-block">Email ID <span style={{ color: "red" }}>*</span></label>
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
                                                    <input
                                                        type="text"
                                                        value={extra.position}
                                                        onChange={(e) => handleSectionChange(setExtraContacts)(idx, 'position', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter designation"
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
                                                </div>
                                                <div className="col-md-6 mb-4 position-relative">
                                                    <label className="projectform d-block">Phone No <span style={{ color: "red" }}>*</span></label>
                                                    <input
                                                        type="text"
                                                        value={extra.phoneNo}
                                                        onChange={(e) => handleSectionChange(setExtraContacts)(idx, 'phoneNo', e.target.value)}
                                                        className="form-input w-100"
                                                        placeholder="Enter Phone No"
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
                                                </div>
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
                                            </div>
                                        </div>
                                    </div>

                                    {/* Extra Local Name Sections */}
                                    {extraLocalNames.map((extra, idx) => (
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
                                                </div>
                                            </div>
                                        </div>
                                    ))}

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
                    <button className="btn px-4 fw-bold d-flex align-items-center gap-2" style={{ color: bluePrimary, border: `1px solid ${bluePrimary}`, borderRadius: '8px' }} onClick={handleReset}>
                        <RotateCcw size={18} />
                        Reset
                    </button>
                    {(!showDetails || activeTab === "local") ? (
                        <button className="btn px-4 fw-bold text-white" style={{ backgroundColor: bluePrimary, borderRadius: '8px' }} onClick={handleSave}>
                            Save Details
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