import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Select from 'react-select';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Logo from "./assets/logo.svg?react";
import UserIcon from "./assets/User.svg?react";

function ContractorForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [inviteStatus, setInviteStatus] = useState('idle');
  const [contractorName, setContractorName] = useState('Contractor');
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token"));
  const [showReview, setShowReview] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const tabs = [
    { id: 'basic', label: 'Basic' },
    { id: 'address', label: 'Address' },
    { id: 'contact', label: 'Contact' },
    { id: 'tax', label: 'Tax' },
    { id: 'bank', label: 'Bank' },
    { id: 'additional', label: 'Additional' }
  ];
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [entityTypeOptions, setEntityTypeOptions] = useState([]);
  const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [addressTypeOptions, setAddressTypeOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const [territoryTypeOptions, setTerritoryTypeOptions] = useState([]);
  const [territoryOptions, setTerritoryOptions] = useState([]);
  const [additionalInfoTypeOptions, setAdditionalInfoTypeOptions] = useState([]);
  const [basicInfo, setBasicInfo] = useState({ 
    id: null,
    entityCode: `CON-${Math.floor(100 + Math.random() * 900)}`, 
    entityName: "", 
    effectiveDate: "", 
    entityType: "", 
    natureOfBusiness: "", 
    grade: "" 
  });
  const [addressList, setAddressList] = useState([{ 
    phoneNo: "", emailId: "", addressType: "", address1: "", address2: "", 
    country: "", state: "", city: "", zipCode: "",
    stateOptions: [], cityOptions: [] 
  }]);
  const [contactList, setContactList] = useState([{ 
    name: "", position: "", phoneNo: "", emailId: "" 
  }]);
  const [taxDetails, setTaxDetails] = useState({ 
    taxType: "", territoryType: "", territory: "", taxRegNo: "", 
    taxRegDate: "", address1: "", address2: "", zipCode: "", emailId: "" 
  });
  const [bankDetailsList, setBankDetailsList] = useState([{ accountHolderName: "", accountNo: "", bankName: "", branchName: "", bankAddress: "" }]);
  const [additionalInfoList, setAdditionalInfoList] = useState([{ type: "", registrationNo: "" }]);
  const [taxFilterCountry, setTaxFilterCountry] = useState(null);
  const [taxFilterState, setTaxFilterState] = useState(null);
  const [taxCountryOptions, setTaxCountryOptions] = useState([]);
  const [taxStateOptions, setTaxStateOptions] = useState([]);
  const fpEffective = useRef(null);
  const fpTaxReg = useRef(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const headers = { Authorization: `Bearer ${authToken}` };
  const formatDateForBackend = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  };

  const getLabel = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  useEffect(() => {
    if (!id) {
      setInviteStatus('invalid');
      return;
    }

    axios.get(`${baseUrl}/validateInvite?id=${id}`)
      .then(response => {
        const token = response.data.token;
        sessionStorage.setItem("token", token);
        setAuthToken(token);
        setInviteStatus('valid');
        setContractorName(response.data.contractor?.name || 'Contractor');
        setContactList(prev => prev.map((c, i) => i === 0 ? { ...c, emailId: response.data.contractor?.email } : c));
      })
      .catch(error => {
        if (error.response && error.response.status === 409) {
          setInviteStatus('submitted');
        } else {
          setInviteStatus('invalid');
        }
      });
  }, [id, baseUrl]);


  useEffect(() => {
    if (!authToken || inviteStatus !== 'valid') return;

    axios.get(`${baseUrl}/contractorType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setEntityTypeOptions(list.map(item => ({ value: item.id, label: item.type })));
    });

    axios.get(`${baseUrl}/contractorGrade`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setGradeOptions(list.map(item => ({ value: item.id, label: item.gradeName })));
    });

    axios.get(`${baseUrl}/addressType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setAddressTypeOptions(list.map(item => ({ value: item.id, label: item.addressType })));
    });

    axios.get(`${baseUrl}/countries`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setCountryOptions(list.map(item => ({ value: item.id, label: item.country })));
    });

    axios.get(`${baseUrl}/taxType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setTaxTypeOptions(list.map(item => ({ value: item.code, label: item.label })));
    });

    axios.get(`${baseUrl}/territoryType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setTerritoryTypeOptions(list.map(item => ({ value: item.code, label: item.label })));
    });

    axios.get(`${baseUrl}/identityType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setAdditionalInfoTypeOptions(list.map(item => ({ value: item.id, label: item.idType })));
    });

  }, [authToken, inviteStatus, baseUrl]);

  const fetchNatureOfBusiness = (entityTypeId) => {
    axios.get(`${baseUrl}/contractorNature/${entityTypeId}`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setNatureOfBusinessOptions(list.map(item => ({ value: item.id, label: item.nature })));
    });
  };

  const fetchTerritory = async (territoryTypeId) => {
    setTerritoryOptions([]);
    setTaxDetails(prev => ({ ...prev, territory: null }));
    setTaxFilterCountry(null);
    setTaxFilterState(null);
    setTaxStateOptions([]);

    if (!territoryTypeId) return;

    try {
      if (territoryTypeId === 'COUNTRY') {
        const response = await axios.get(`${baseUrl}/countries`, { headers });
        setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item.country })));
      } else if (territoryTypeId === 'STATE' || territoryTypeId === 'CITY') {
        // Load Countries for Filter
        const response = await axios.get(`${baseUrl}/countries`, { headers });
        setTaxCountryOptions(response.data.map(item => ({ value: item.id, label: item.country })));
      }
    } catch (error) {
      console.error("Error fetching territory:", error);
      setTerritoryOptions([]);
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
      if (taxDetails.territoryType === 'STATE') {
        // If Type is State, fetching states populates the Territory Options directly
        const response = await axios.get(`${baseUrl}/states/${selectedOption.value}`, { headers });
        setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item.state })));
      } else if (taxDetails.territoryType === 'CITY') {
        // If Type is City, fetching states populates the State Filter Options
        const response = await axios.get(`${baseUrl}/states/${selectedOption.value}`, { headers });
        setTaxStateOptions(response.data.map(item => ({ value: item.id, label: item.state })));
      }
    } catch (error) {
      console.error("Error fetching states for filter:", error);
    }
  };

  const handleTaxStateFilterChange = async (selectedOption) => {
    setTaxFilterState(selectedOption);
    setTerritoryOptions([]);
    setTaxDetails(prev => ({ ...prev, territory: null }));

    if (!selectedOption || taxDetails.territoryType !== 'CITY') return;

    try {
      const response = await axios.get(`${baseUrl}/cities/byState/${selectedOption.value}`, { headers });
      setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item.city })));
    } catch (error) {
      console.error("Error fetching cities for filter:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prevFiles) => {
      const newFiles = files.filter(
        (file) => !prevFiles.some((prev) => prev.name === file.name && prev.size === file.size)
      );
      return [...prevFiles, ...newFiles];
    });
    e.target.value = null;
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleViewFile = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
      setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
    }
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    setAddressList(prev => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
  };

  const addAddress = () => {
    setAddressList(prev => [...prev, { 
      phoneNo: "", emailId: "", addressType: "", address1: "", address2: "", 
      country: "", state: "", city: "", zipCode: "",
      stateOptions: [], cityOptions: []
    }]);
  };

  const removeAddress = (index) => {
    if (addressList.length > 1) {
      setAddressList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    setContactList(prev => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
  };

  const addContact = () => {
    setContactList(prev => [...prev, { name: "", position: "", phoneNo: "", emailId: "" }]);
  };

  const removeContact = (index) => {
    if (contactList.length > 1) {
      setContactList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (index, e) => {
    const { name, value } = e.target;
    setBankDetailsList(prev => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
  };
  const addBankDetails = () => {
    setBankDetailsList(prev => [...prev, { accountHolderName: "", accountNo: "", bankName: "", branchName: "", bankAddress: "" }]);
  };
  const removeBankDetails = (index) => {
    if (bankDetailsList.length > 1) {
      setBankDetailsList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleAdditionalInfoChange = (index, e) => {
    const { name, value } = e.target;
    setAdditionalInfoList(prev => prev.map((item, i) => i === index ? { ...item, [name]: value } : item));
  };
  const addAdditionalInfo = () => {
    setAdditionalInfoList(prev => [...prev, { type: "", registrationNo: "" }]);
  };
  const removeAdditionalInfo = (index) => {
    if (additionalInfoList.length > 1) {
      setAdditionalInfoList(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmitFinal = async () => {
    // Validation
    const requiredErrors = [];
    if (!basicInfo.entityCode) requiredErrors.push("Entity Code");
    if (!basicInfo.entityName) requiredErrors.push("Entity Name");
    if (!basicInfo.effectiveDate && !effectiveDate) requiredErrors.push("Effective Date");
    if (!basicInfo.entityType) requiredErrors.push("Entity Type");

    addressList.forEach((addr, idx) => {
      const prefix = `Address ${idx + 1}`;
      if (!addr.addressType) requiredErrors.push(`${prefix} Type`);
      if (!addr.country) requiredErrors.push(`${prefix} Country`);
      if (!addr.city) requiredErrors.push(`${prefix} City`);
      if (!addr.zipCode) requiredErrors.push(`${prefix} Zip/Postal Code`);
    });

    contactList.forEach((contact, idx) => {
      const prefix = `Contact ${idx + 1}`;
      if (!contact.name) requiredErrors.push(`${prefix} Name`);
      if (!contact.position) requiredErrors.push(`${prefix} Position`);
      if (!contact.phoneNo) requiredErrors.push(`${prefix} Phone No`);
      if (!contact.emailId) requiredErrors.push(`${prefix} Email ID`);
    });

    if (!taxDetails.taxType) {
      requiredErrors.push("Tax Type");
    } else if (taxDetails.taxType !== 'GST_UNREGISTER') {
      if (!taxDetails.territoryType) requiredErrors.push("Tax Territory Type");
      if (!taxDetails.territory) requiredErrors.push("Tax Territory");
      if (!taxDetails.taxRegNo) requiredErrors.push("Tax Reg No");
      if (!taxDetails.taxRegDate) requiredErrors.push("Tax Reg Date");
    }

    bankDetailsList.forEach((bank, idx) => {
      const prefix = `Bank ${idx + 1}`;
      if (!bank.accountHolderName) requiredErrors.push(`${prefix} Account Holder Name`);
      if (!bank.accountNo) requiredErrors.push(`${prefix} Account No`);
      if (!bank.bankName) requiredErrors.push(`${prefix} Bank Name`);
      if (!bank.branchName) requiredErrors.push(`${prefix} Branch Name`);
    });

    additionalInfoList.forEach((info, idx) => {
      const prefix = `Additional Info ${idx + 1}`;
      if (!info.type) requiredErrors.push(`${prefix} Type`);
      if (!info.registrationNo) requiredErrors.push(`${prefix} Registration No`);
    });

    if (requiredErrors.length > 0) {
      alert(`Please fill in the following mandatory fields:\n${requiredErrors.join(", ")}`);
      return;
    }

    const contractorDTO = {
      id: basicInfo.id || null,
      inviteId: id,
      entityCode: basicInfo.entityCode,
      entityName: basicInfo.entityName,
      effectiveDate: formatDateForBackend(basicInfo.effectiveDate || effectiveDate),
      contractorTypeId: basicInfo.entityType,
      contractorGradeId: basicInfo.grade,
      contractorNatureIds: basicInfo.natureOfBusiness ? [basicInfo.natureOfBusiness] : [],
      submissionMode: "EMAIL",
      attachmentUrls: [],
      contacts: contactList.map(c => ({
        id: c.id || null,
        name: c.name,
        position: c.position,
        phoneNo: c.phoneNo,
        email: c.emailId
      })),
      addresses: addressList.map(a => ({
        id: a.id || null,
        addressTypeId: a.addressType,
        address1: a.address1,
        address2: a.address2,
        zipcode: a.zipCode,
        email: a.emailId,
        phone: a.phoneNo,
        countryId: a.country,
        stateId: a.state,
        cityId: a.city
      })),
      taxDetails: [{
        id: taxDetails.id || null,
        taxTypeId: taxDetails.taxType,
        territoryTypeId: taxDetails.territoryType,
        territory: taxDetails.territory,
        taxRegNo: taxDetails.taxRegNo,
        taxRegDate: formatDateForBackend(taxDetails.taxRegDate),
        address1: taxDetails.address1,
        address2: taxDetails.address2,
        city: "",
        pinCode: taxDetails.zipCode,
        email: taxDetails.emailId
      }],
      bankDetails: bankDetailsList.map(bank => ({
        id: bank.id || null,
        accHolderName: bank.accountHolderName,
        accNumber: bank.accountNo,
        bankName: bank.bankName,
        branch: bank.branchName,
        bankAddress: bank.bankAddress
      })),
      additionalInfo: additionalInfoList.map(info => ({
        id: info.id || null,
        identityTypeId: info.type,
        regNo: info.registrationNo
      }))
    };

    const data = new FormData();
    data.append("contractor", new Blob([JSON.stringify(contractorDTO)], { type: "application/json" }));

    if (selectedFiles) {
      selectedFiles.forEach(file => {
        data.append("files", file);
      });
    }

    try {
      await axios.post(`${baseUrl}/addContractor`, data, {
        headers: { ...headers, "Content-Type": "multipart/form-data" }
      });
      alert("Contractor submitted successfully!");
      setInviteStatus('submitted');
      setShowReview(false);
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to submit contractor details.");
    }
  };


  const Header = () => (
    <div className="header w-100 d-flex justify-content-between align-items-center">
      <div className="d-flex justify-content-start align-items-center">
        <Logo className="logo" style={{ width: '150px' }} />
      </div>
      <div className="d-flex justify-content-end align-items-center gap-3">
        <button className="toggle-btn">
          <UserIcon />
        </button>
        <span className="user-profile">{contractorName}</span>
      </div>
    </div>
  );

  const renderReviewForm = () => (
    <Container fluid className="p-0 bg-white min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
      <Header />
      <div className="p-4 pt-0">
        <Card className="border-0 p-4">
        <div className="mb-4">
          <h4 className="fw-bold mb-1" style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}>Review & Submit</h4>
          <p className="text-muted mb-0 fs-6">Please verify all the information below is correct before submitting.</p>
          <hr style={{ borderColor: '#0051973D', opacity: 1, borderTop: '1px solid #0051973D' }} className="my-4" />
        </div>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-file-earmark-text text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0" style={{ color: '#1a1a1a' }}>Basic Information</h5>
              <p className="text-secondary mb-0 fs-6">Core details of the entity</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-2 fs-6">Entity Code</div>
                <div className="fw-bold text-dark fs-6">{basicInfo.entityCode || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-2 fs-6">Entity Name</div>
                <div className="fw-bold text-dark fs-6">{basicInfo.entityName || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-2 fs-6">Effective Date</div>
                <div className="fw-bold text-dark fs-6">
                  {basicInfo.effectiveDate ? new Date(basicInfo.effectiveDate).toISOString().split('T')[0] : ""}
                </div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-2 fs-6">Entity Type</div>
                <div className="fw-bold text-dark fs-6">{getLabel(basicInfo.entityType, entityTypeOptions) || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-2 fs-6">Nature of Business</div>
                <div className="fw-bold text-dark fs-6">{getLabel(basicInfo.natureOfBusiness, natureOfBusinessOptions) || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-2 fs-6">Grade</div>
                <div className="fw-bold text-dark fs-6">{getLabel(basicInfo.grade, gradeOptions) || ""}</div>
              </Col>
            </Row>

            <div className="mt-5">
              <div className="text-muted mb-2 fs-6">Attachments (Certificates/Licenses)</div>
              {selectedFiles.length > 0 ? (
                <Row className="g-3">
                  {selectedFiles.map((file, index) => (
                    <Col md={12} key={`${file.name}-${index}`} className="mb-2">
                      <div className="d-flex align-items-center justify-content-between p-3 border border-light rounded-3 bg-light bg-opacity-25 shadow-sm">
                        <div className="d-flex align-items-center overflow-hidden">
                          <div className="bg-white p-2 rounded shadow-sm me-3 d-flex align-items-center justify-content-center">
                            <i className={`bi ${file.type.includes('pdf') ? 'bi-file-earmark-pdf-fill text-danger' : 'bi-file-earmark-word-fill text-primary'} fs-3`}></i>
                          </div>
                          <div className="overflow-hidden">
                            <div className="fw-bold text-dark text-truncate fs-6" style={{ maxWidth: '400px' }}>
                              {file.name}
                            </div>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </small>
                          </div>
                        </div>
                        <Button variant="link" className="text-primary fw-bold text-decoration-none fs-6" onClick={() => handleViewFile(file)}>View</Button>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="p-3 border rounded text-muted bg-light bg-opacity-50" style={{ fontSize: '0.8rem' }}>No files uploaded</div>
              )}
            </div>
          </Col>
        </Row>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-geo-alt text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Address Details</h5>
              <p className="text-secondary mb-0 fs-6">Registered company addresses</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            {addressList.map((addr, idx) => (
              <div key={idx} className={idx > 0 ? "mt-5 pt-4 border-top" : ""}>
                <h6 className="fw-bold text-primary mb-4">Address {idx + 1}</h6>
                <Row className="gy-5">
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Phone No</div>
                    <div className="fw-bold text-dark fs-6">{addr.phoneNo || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Email ID</div>
                    <div className="fw-bold text-dark fs-6 text-break">{addr.emailId || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Address Type</div>
                    <div className="fw-bold text-dark fs-6">{getLabel(addr.addressType, addressTypeOptions) || ""}</div>
                  </Col>
                  <Col md={8}>
                    <div className="text-muted mb-1 fs-6">Address 1</div>
                    <div className="fw-bold text-dark fs-6 text-break">{addr.address1 || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Address 2</div>
                    <div className="fw-bold text-dark fs-6 text-break">{addr.address2 || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Country</div>
                    <div className="fw-bold text-dark fs-6">{getLabel(addr.country, countryOptions) || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">State</div>
                    <div className="fw-bold text-dark fs-6">{getLabel(addr.state, addr.stateOptions || []) || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">City</div>
                    <div className="fw-bold text-dark fs-6">{getLabel(addr.city, addr.cityOptions || []) || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Zip/Postal Code</div>
                    <div className="fw-bold text-dark fs-6">{addr.zipCode || ""}</div>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>
        </Row>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-person-badge text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Contact Details</h5>
              <p className="text-secondary mb-0 fs-6">Primary points of contact</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            {contactList.map((contact, idx) => (
              <div key={idx} className={idx > 0 ? "mt-5 pt-4 border-top" : ""}>
                <h6 className="fw-bold text-primary mb-4">Contact {idx + 1}</h6>
                <Row className="gy-5">
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Name</div>
                    <div className="fw-bold text-dark fs-6">{contact.name || ""}</div>
                  </Col>
                  <Col md={8}>
                    <div className="text-muted mb-1 fs-6">Position</div>
                    <div className="fw-bold text-dark fs-6">{contact.position || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Phone No</div>
                    <div className="fw-bold text-dark fs-6">{contact.phoneNo || ""}</div>
                  </Col>
                  <Col md={8}>
                    <div className="text-muted mb-1 fs-6">Email ID</div>
                    <div className="fw-bold text-dark fs-6 text-break">{contact.emailId || ""}</div>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>
        </Row>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-receipt text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Tax Details</h5>
              <p className="text-secondary mb-0 fs-6">Tax registration information</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Tax Type</div>
                <div className="fw-bold text-dark fs-6">{getLabel(taxDetails.taxType, taxTypeOptions) || ""}</div>
              </Col>
              {taxDetails.taxType !== 'GST_UNREGISTER' && (
                <>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Territory Type</div>
                    <div className="fw-bold text-dark fs-6">{getLabel(taxDetails.territoryType, territoryTypeOptions) || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Territory</div>
                    {['STATE', 'CITY'].includes(taxDetails.territoryType) && (
                      <div className="mb-2">
                        <small className="text-muted d-block">Country Filter:</small>
                        <div className="fw-bold text-dark fs-6">{taxFilterCountry ? taxFilterCountry.label : '-'}</div>
                      </div>
                    )}
                    {taxDetails.territoryType === 'CITY' && (
                      <div className="mb-2">
                        <small className="text-muted d-block">State Filter:</small>
                        <div className="fw-bold text-dark fs-6">{taxFilterState ? taxFilterState.label : '-'}</div>
                      </div>
                    )}
                    <div className="fw-bold text-dark fs-6">{getLabel(taxDetails.territory, territoryOptions) || ""}</div>
                  </Col>
                  <Col md={4}>
                    <div className="text-muted mb-1 fs-6">Tax Reg. No</div>
                    <div className="fw-bold text-dark fs-6">{taxDetails.taxRegNo || ""}</div>
                  </Col>
                  <Col md={8}>
                    <div className="text-muted mb-1 fs-6">Tax Reg. Date</div>
                    <div className="fw-bold text-dark fs-6">
                      {taxDetails.taxRegDate ? new Date(taxDetails.taxRegDate).toLocaleDateString('en-US') : ""}
                    </div>
                  </Col>
                </>
              )}
            </Row>
          </Col>
        </Row>
        {bankDetailsList.map((bank, idx) => (
        <Row key={idx} className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-bank text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Bank Accounts {bankDetailsList.length > 1 ? `(${idx + 1})` : ''}</h5>
              <p className="text-secondary mb-0 fs-6">Financial transaction details</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Account Holder Name</div>
                <div className="fw-bold text-dark fs-6">{bank.accountHolderName || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Account No</div>
                <div className="fw-bold text-dark fs-6">{bank.accountNo || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Bank Name</div>
                <div className="fw-bold text-dark fs-6">{bank.bankName || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Branch Name</div>
                <div className="fw-bold text-dark fs-6">{bank.branchName || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Bank Address</div>
                <div className="fw-bold text-dark fs-6 text-break">{bank.bankAddress || ""}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        ))}
        {additionalInfoList.map((info, idx) => (
        <Row key={idx} className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-info-circle text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Additional Info {additionalInfoList.length > 1 ? `(${idx + 1})` : ''}</h5>
              <p className="text-secondary mb-0 fs-6">Other relevant registrations</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Type</div>
                <div className="fw-bold text-dark fs-6">{getLabel(info.type, additionalInfoTypeOptions) || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Registration No</div>
                <div className="fw-bold text-dark fs-6">{info.registrationNo || ""}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        ))}
        <div className="d-flex justify-content-end gap-3 mt-4">
          <Button variant="outline-primary" className="px-5 py-2 border-2 fw-bold fs-6" style={{ borderRadius: '8px' }} onClick={() => setShowReview(false)}>Edit</Button>
          <Button variant="primary" className="px-5 py-2 shadow-sm fw-bold border-0 fs-6" style={{ borderRadius: '8px', backgroundColor: '#0066ff' }} onClick={handleSubmitFinal}>Submit</Button>
        </div>
      </Card>
    </div>
  </Container>
);

  if (inviteStatus === 'loading') {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3">Validating Invitation...</span>
      </Container>
    );
  }

  if (inviteStatus === 'submitted') {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="text-center p-5 shadow-sm" style={{ maxWidth: '500px' }}>
          <div className="mb-3">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
          </div>
          <h3 className="fw-bold">Already Submitted</h3>
          <p className="text-muted">The response for this invitation has already been recorded. You cannot submit it again.</p>
        </Card>
      </Container>
    );
  }

  if (inviteStatus === 'invalid') {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="text-center p-5 shadow-sm" style={{ maxWidth: '500px' }}>
          <div className="mb-3">
            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
          </div>
          <h3 className="fw-bold">Invalid Invitation</h3>
          <p className="text-muted">The invitation link is invalid or has expired.</p>
        </Card>
      </Container>
    );
  }

  const fetchStates = (index, countryId) => {
    if (!countryId) {
      setAddressList(prev => prev.map((item, i) => i === index ? { ...item, stateOptions: [], cityOptions: [] } : item));
      return;
    }
    axios.get(`${baseUrl}/states/${countryId}`, { headers }).then(r => {
      const list = r.data || [];
      const options = list.map(item => ({ value: item.id, label: item.state }));
      setAddressList(prev => prev.map((item, i) => i === index ? { ...item, stateOptions: options } : item));
    }).catch(() => {
      setAddressList(prev => prev.map((item, i) => i === index ? { ...item, stateOptions: [], cityOptions: [] } : item));
    });
  };

  const fetchCities = (index, stateId) => {
    if (!stateId) {
      setAddressList(prev => prev.map((item, i) => i === index ? { ...item, cityOptions: [] } : item));
      return;
    }
    axios.get(`${baseUrl}/cities/byState/${stateId}`, { headers }).then(r => {
      const list = r.data || [];
      const options = list.map(item => ({ value: item.id, label: item.city }));
      setAddressList(prev => prev.map((item, i) => i === index ? { ...item, cityOptions: options } : item));
    }).catch(() => {
      setAddressList(prev => prev.map((item, i) => i === index ? { ...item, cityOptions: [] } : item));
    });
  };

  return (
    <>
      {showReview ? (
        renderReviewForm()
      ) : (
        <div className="p-0 bg-white min-vh-100">
          <Header />
          <div className="px-4 pt-4 pb-0">
            <h5 className="fw-bold mb-0" style={{ color: '#005197' }}>Enter your details</h5>
          </div>
          <div className="container-fluid p-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
              {/* Tab Navigation */}
              <div className="d-flex gap-2 mb-4 border-bottom pb-2 overflow-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`custom-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="row g-3">
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Entity Code <span className="text-danger">*</span></label>
                    <input name="entityCode" value={basicInfo.entityCode} readOnly className="form-control form-input bg-light" placeholder="Entity code" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Entity Name <span className="text-danger">*</span></label>
                    <input name="entityName" value={basicInfo.entityName} onChange={handleBasicInfoChange} className="form-control form-input" placeholder="Enter entity name" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Effective Date <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <Flatpickr
                        ref={fpEffective}
                        value={effectiveDate}
                        onChange={([date]) => {
                          setEffectiveDate(date);
                          setBasicInfo(prev => ({ ...prev, effectiveDate: date }));
                        }}
                        className="form-control form-input"
                        placeholder="mm/dd/yyyy"
                        options={{ dateFormat: "m/d/Y" }}
                      />
                      <i className="bi bi-calendar3 position-absolute" style={{ right: '15px', top: '12px', color: '#005bb7', cursor: 'pointer', zIndex: 10 }} onClick={() => fpEffective.current.flatpickr.open()}></i>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Entity Type <span className="text-danger">*</span></label>
                    <Select
                      options={entityTypeOptions}
                      placeholder="Select entity type"
                      value={entityTypeOptions.find(opt => opt.value === basicInfo.entityType)}
                      onChange={(opt) => {
                        setBasicInfo(prev => ({ ...prev, entityType: opt.value }));
                        fetchNatureOfBusiness(opt.value);
                      }}
                      classNamePrefix="select"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Nature of Business</label>
                    <Select
                      options={natureOfBusinessOptions}
                      classNamePrefix="select"
                      placeholder="Select Nature of Business"
                      menuPortalTarget={document.body}
                      value={natureOfBusinessOptions.find(opt => opt.value === basicInfo.natureOfBusiness)}
                      onChange={(selectedOption) => setBasicInfo((prev) => ({ ...prev, natureOfBusiness: selectedOption.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Grade</label>
                    <Select
                      options={gradeOptions}
                      classNamePrefix="select"
                      placeholder="Select Grade"
                      menuPortalTarget={document.body}
                      value={gradeOptions.find(opt => opt.value === basicInfo.grade)}
                      onChange={(selectedOption) => setBasicInfo((prev) => ({ ...prev, grade: selectedOption.value }))}
                    />
                  </div>
                  <div className="col-12 mt-4">
                    <h6 className="projectform mb-3">Attachment (Certificates/Licenses)</h6>
                    <div className="upload-section p-4 text-center border rounded-3" style={{ cursor: 'pointer', borderStyle: 'dashed !important' }} onClick={() => document.getElementById('hiddenFileInput').click()}>
                      <input type="file" id="hiddenFileInput" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                      <div className="upload-instructions">
                        <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '2.5rem', color: '#7ba2d5' }}></i>
                        <p className="mb-0 fw-bold mt-2" style={{ color: '#005bb7' }}>Click to upload or drag and drop</p>
                        <small className="text-muted">PDF, DOCX up to 10MB</small>
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="badge bg-light text-dark p-2 border d-flex align-items-center" onClick={(e) => e.stopPropagation()}>
                              <span className="text-truncate" style={{ maxWidth: '150px' }}>{file.name}</span>
                              <i className="bi bi-x ms-2 cursor-pointer" onClick={() => removeFile(index)}></i>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Address Details Tab */}
              {activeTab === 'address' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Address Details</h5>
                    <Button variant="outline-primary" size="sm" onClick={addAddress} className="d-flex align-items-center gap-2">
                      <i className="bi bi-plus-lg"></i> Add Address
                    </Button>
                  </div>
                  {addressList.map((address, index) => (
                    <div key={index} className="mb-5 p-3 border rounded-3 bg-light bg-opacity-10">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0" style={{ color: '#005197' }}>Address {addressList.length > 1 ? `(${index + 1})` : ''}</h6>
                        {addressList.length > 1 && (
                          <button 
                            className="btn btn-sm text-danger" 
                            onClick={() => removeAddress(index)}
                          >
                            <i className="bi bi-trash3 fs-5"></i>
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Phone No</label>
                          <input name="phoneNo" value={address.phoneNo} onChange={(e) => handleAddressChange(index, e)} className="form-control form-input" placeholder="Enter phone no" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Email ID</label>
                          <input type="email" name="emailId" value={address.emailId} onChange={(e) => handleAddressChange(index, e)} className="form-control form-input" placeholder="Enter email id" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Address Type <span className="text-danger">*</span></label>
                          <Select
                            options={addressTypeOptions}
                            classNamePrefix="select"
                            placeholder="Select Address Type"
                            menuPortalTarget={document.body}
                            value={addressTypeOptions.find(opt => opt.value === address.addressType)}
                            onChange={(opt) => handleAddressChange(index, { target: { name: 'addressType', value: opt.value } })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Zip/Postal Code <span className="text-danger">*</span></label>
                          <input name="zipCode" value={address.zipCode} onChange={(e) => handleAddressChange(index, e)} className="form-control form-input" placeholder="Enter zip code" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Address 1</label>
                          <textarea name="address1" value={address.address1} onChange={(e) => handleAddressChange(index, e)} className="form-control form-input" placeholder="Enter address 1" rows={2} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Address 2</label>
                          <textarea name="address2" value={address.address2} onChange={(e) => handleAddressChange(index, e)} className="form-control form-input" placeholder="Enter address 2" rows={2} />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="projectform">Country <span className="text-danger">*</span></label>
                          <Select
                            options={countryOptions}
                            classNamePrefix="select"
                            placeholder="Select Country"
                            menuPortalTarget={document.body}
                            value={countryOptions.find(opt => opt.value === address.country)}
                            onChange={(opt) => {
                              handleAddressChange(index, { target: { name: 'country', value: opt.value } });
                              fetchStates(index, opt.value);
                            }}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="projectform">State</label>
                          <Select
                            options={address.stateOptions || []}
                            classNamePrefix="select"
                            placeholder="Select State"
                            menuPortalTarget={document.body}
                            value={(address.stateOptions || []).find(opt => opt.value === address.state)}
                            onChange={(opt) => {
                              handleAddressChange(index, { target: { name: 'state', value: opt.value } });
                              fetchCities(index, opt.value);
                            }}
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label className="projectform">City <span className="text-danger">*</span></label>
                          <Select
                            options={address.cityOptions || []}
                            classNamePrefix="select"
                            placeholder="Select City"
                            menuPortalTarget={document.body}
                            value={(address.cityOptions || []).find(opt => opt.value === address.city)}
                            onChange={(opt) => handleAddressChange(index, { target: { name: 'city', value: opt.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Contact Details Tab */}
              {activeTab === 'contact' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Contact Details</h5>
                    <Button variant="outline-primary" size="sm" onClick={addContact} className="d-flex align-items-center gap-2">
                      <i className="bi bi-plus-lg"></i> Add Contact
                    </Button>
                  </div>
                  {contactList.map((contact, index) => (
                    <div key={index} className="mb-4 p-3 border rounded-3 position-relative bg-light bg-opacity-10">
                      {contactList.length > 1 && (
                        <button 
                          className="btn btn-sm text-danger position-absolute" 
                          style={{ top: '10px', right: '10px', zIndex: 10 }}
                          onClick={() => removeContact(index)}
                        >
                          <i className="bi bi-trash3 fs-5"></i>
                        </button>
                      )}
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Name <span className="text-danger">*</span></label>
                          <input name="name" value={contact.name} onChange={(e) => handleContactChange(index, e)} className="form-control form-input" placeholder="Enter contact name" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Position <span className="text-danger">*</span></label>
                          <input name="position" value={contact.position} onChange={(e) => handleContactChange(index, e)} className="form-control form-input" placeholder="Enter position" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Phone No <span className="text-danger">*</span></label>
                          <input name="phoneNo" value={contact.phoneNo} onChange={(e) => handleContactChange(index, e)} className="form-control form-input" placeholder="Enter phone no" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Email ID <span className="text-danger">*</span></label>
                          <input type="email" name="emailId" value={contact.emailId} onChange={(e) => handleContactChange(index, e)} className="form-control form-input" placeholder="Enter email id" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tax Details Tab */}
              {activeTab === 'tax' && (
                <div className="row g-3">
                  <div className="col-md-6 mb-3">
                    <label className="projectform">Tax Type <span className="text-danger">*</span></label>
                    <Select
                      name="taxType"
                      options={taxTypeOptions}
                      classNamePrefix="select"
                      placeholder="Select Tax Type"
                      menuPortalTarget={document.body}
                      value={taxTypeOptions.find(opt => opt.value === taxDetails.taxType)}
                      onChange={(selectedOption) => {
                        const isUnregistered = selectedOption.value === 'GST_UNREGISTER';
                        setTaxDetails(prev => ({
                          ...prev,
                          taxType: selectedOption.value,
                          ...(isUnregistered ? {
                            territoryType: "", territory: "", taxRegNo: "", 
                            taxRegDate: "", address1: "", address2: "", 
                            zipCode: "", emailId: ""
                          } : {})
                        }));
                        if (isUnregistered) {
                          setTaxFilterCountry(null);
                          setTaxFilterState(null);
                          setTerritoryOptions([]);
                        }
                      }}
                    />
                  </div>

                  {taxDetails.taxType !== 'GST_UNREGISTER' && (
                    <>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Territory Type <span className="text-danger">*</span></label>
                        <Select
                          options={territoryTypeOptions}
                          classNamePrefix="select"
                          placeholder="Select Territory Type"
                          menuPortalTarget={document.body}
                          value={territoryTypeOptions.find(opt => opt.value === taxDetails.territoryType)}
                          onChange={(selectedOption) => {
                            setTaxDetails(prev => ({ ...prev, territoryType: selectedOption.value }));
                            fetchTerritory(selectedOption.value);
                          }}
                        />
                      </div>
                      {['STATE', 'CITY'].includes(taxDetails.territoryType) && (
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Filter Country <span className="text-danger">*</span></label>
                          <Select
                            options={taxCountryOptions}
                            placeholder="Select Country"
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            value={taxFilterCountry}
                            onChange={handleTaxCountryFilterChange}
                          />
                        </div>
                      )}
                      {taxDetails.territoryType === 'CITY' && (
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Filter State <span className="text-danger">*</span></label>
                          <Select
                            options={taxStateOptions}
                            placeholder="Select State"
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            value={taxFilterState}
                            onChange={handleTaxStateFilterChange}
                            isDisabled={!taxFilterCountry}
                          />
                        </div>
                      )}
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Territory <span className="text-danger">*</span></label>
                        <Select
                          name="territory"
                          options={territoryOptions}
                          classNamePrefix="select"
                          placeholder="Select territory"
                          menuPortalTarget={document.body}
                          value={territoryOptions.find(opt => opt.value === taxDetails.territory)}
                          onChange={(selectedOption) => setTaxDetails(prev => ({ ...prev, territory: selectedOption.value }))}
                          isDisabled={
                            (taxDetails.territoryType === 'STATE' && !taxFilterCountry) ||
                            (taxDetails.territoryType === 'CITY' && !taxFilterState)
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Tax Reg. No <span className="text-danger">*</span></label>
                        <input 
                          name="taxRegNo" 
                          value={taxDetails.taxRegNo} 
                          onChange={handleTaxChange} 
                          className="form-control form-input" 
                          placeholder="Enter tax registration no" 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Tax Reg. Date <span className="text-danger">*</span></label>
                        <div className="position-relative">
                          <Flatpickr
                            ref={fpTaxReg}
                            value={taxDetails.taxRegDate || ''}
                            onChange={([date]) => setTaxDetails(prev => ({ ...prev, taxRegDate: date }))}
                            className="form-control form-input"
                            placeholder="mm/dd/yyyy"
                            options={{ dateFormat: "m/d/Y", allowInput: true }}
                          />
                          <i 
                            className="bi bi-calendar3 position-absolute" 
                            style={{ right: '15px', top: '12px', color: '#005bb7', cursor: 'pointer', zIndex: 10 }} 
                            onClick={() => fpTaxReg.current.flatpickr.open()}
                          ></i>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Address 1</label>
                        <textarea 
                          name="address1" 
                          value={taxDetails.address1} 
                          onChange={handleTaxChange} 
                          className="form-control form-input" 
                          placeholder="Enter address 1" 
                          rows={1} 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Address 2</label>
                        <textarea 
                          name="address2" 
                          value={taxDetails.address2} 
                          onChange={handleTaxChange} 
                          className="form-control form-input" 
                          placeholder="Enter address 2" 
                          rows={1} 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Zip/Postal Code</label>
                        <input 
                          name="zipCode" 
                          value={taxDetails.zipCode} 
                          onChange={handleTaxChange} 
                          className="form-control form-input" 
                          placeholder="Enter zip code" 
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="projectform">Email ID</label>
                        <input 
                          type="email" 
                          name="emailId" 
                          value={taxDetails.emailId} 
                          onChange={handleTaxChange} 
                          className="form-control form-input" 
                          placeholder="Enter email id" 
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bank Details Tab */}
              {activeTab === 'bank' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Bank Details</h5>
                    <Button variant="outline-primary" size="sm" onClick={addBankDetails} className="d-flex align-items-center gap-2">
                      <i className="bi bi-plus-lg"></i> Add Bank
                    </Button>
                  </div>
                  {bankDetailsList.map((bank, index) => (
                    <div key={index} className="mb-5 p-3 border rounded-3 bg-light bg-opacity-10">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0" style={{ color: '#005197' }}>Bank {bankDetailsList.length > 1 ? `(${index + 1})` : ''}</h6>
                        {bankDetailsList.length > 1 && (
                          <button className="btn btn-sm text-danger" onClick={() => removeBankDetails(index)}>
                            <i className="bi bi-trash3 fs-5"></i>
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Account Holder Name <span className="text-danger">*</span></label>
                          <input name="accountHolderName" value={bank.accountHolderName} onChange={(e) => handleBankChange(index, e)} className="form-control form-input" placeholder="Enter account holder name" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Account No <span className="text-danger">*</span></label>
                          <input name="accountNo" value={bank.accountNo} onChange={(e) => handleBankChange(index, e)} className="form-control form-input" placeholder="Enter account no" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Bank Name <span className="text-danger">*</span></label>
                          <input name="bankName" value={bank.bankName} onChange={(e) => handleBankChange(index, e)} className="form-control form-input" placeholder="Enter bank name" />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Branch Name <span className="text-danger">*</span></label>
                          <input name="branchName" value={bank.branchName} onChange={(e) => handleBankChange(index, e)} className="form-control form-input" placeholder="Enter branch name" />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="projectform">Bank Address</label>
                          <textarea name="bankAddress" value={bank.bankAddress} onChange={(e) => handleBankChange(index, e)} className="form-control form-input" placeholder="Enter bank address" rows={3} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Additional Info Tab */}
              {activeTab === 'additional' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Additional Info</h5>
                    <Button variant="outline-primary" size="sm" onClick={addAdditionalInfo} className="d-flex align-items-center gap-2">
                      <i className="bi bi-plus-lg"></i> Add Info
                    </Button>
                  </div>
                  {additionalInfoList.map((info, index) => (
                    <div key={index} className="mb-5 p-3 border rounded-3 bg-light bg-opacity-10">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0" style={{ color: '#005197' }}>Info {additionalInfoList.length > 1 ? `(${index + 1})` : ''}</h6>
                        {additionalInfoList.length > 1 && (
                          <button className="btn btn-sm text-danger" onClick={() => removeAdditionalInfo(index)}>
                            <i className="bi bi-trash3 fs-5"></i>
                          </button>
                        )}
                      </div>
                      <div className="row g-3">
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Type <span className="text-danger">*</span></label>
                          <Select
                            name="type"
                            options={additionalInfoTypeOptions}
                            classNamePrefix="select"
                            placeholder="Select Type"
                            menuPortalTarget={document.body}
                            value={additionalInfoTypeOptions.find(opt => opt.value === info.type)}
                            onChange={(selectedOption) => {
                              setAdditionalInfoList(prev => prev.map((item, i) => i === index ? { ...item, type: selectedOption.value } : item));
                            }}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="projectform">Registration No <span className="text-danger">*</span></label>
                          <input name="registrationNo" value={info.registrationNo} onChange={(e) => handleAdditionalInfoChange(index, e)} className="form-control form-input" placeholder="Enter registration no" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Footer Buttons */}
              <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                <button 
                  className="btn btn-outline-secondary px-4 py-2" 
                  onClick={() => {
                    const currentIndex = tabs.findIndex(t => t.id === activeTab);
                    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
                  }}
                  disabled={activeTab === tabs[0].id}
                >
                  Previous
                </button>
                <div className="d-flex gap-2">
                  <button className="btn btn-light px-4 py-2 border">Cancel</button>
                  {activeTab !== tabs[tabs.length - 1].id ? (
                    <button 
                      className="btn btn-primary px-4 py-2" 
                      onClick={() => {
                        const currentIndex = tabs.findIndex(t => t.id === activeTab);
                        if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
                      }}
                    >
                      Next
                    </button>
                  ) : (
                    <button className="btn btn-primary px-4 py-2" onClick={() => setShowReview(true)}>
                      Review & Submit <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default ContractorForm;