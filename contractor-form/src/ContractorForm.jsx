import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Select from 'react-select';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function ContractorForm() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [inviteStatus, setInviteStatus] = useState('loading');
  const [authToken, setAuthToken] = useState(sessionStorage.getItem("token"));
  const [showReview, setShowReview] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState(new Date());
  const [entityTypeOptions, setEntityTypeOptions] = useState([]);
  const [natureOfBusinessOptions, setNatureOfBusinessOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);
  const [addressTypeOptions, setAddressTypeOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [taxTypeOptions, setTaxTypeOptions] = useState([]);
  const [territoryTypeOptions, setTerritoryTypeOptions] = useState([]);
  const [territoryOptions, setTerritoryOptions] = useState([]);
  const [additionalInfoTypeOptions, setAdditionalInfoTypeOptions] = useState([]);

  const [basicInfo, setBasicInfo] = useState({ entityCode: "", entityName: "", effectiveDate: "", entityType: "", natureOfBusiness: "", grade: "" });
  const [addressDetails, setAddressDetails] = useState({ phoneNo: "", emailId: "", addressType: "", address1: "", address2: "", country: "", city: "", zipCode: "" });
  const [contactDetails, setContactDetails] = useState({ name: "", position: "", phoneNo: "", emailId: "" });
  const [taxDetails, setTaxDetails] = useState({ taxType: "", territoryType: "", territory: "", taxRegNo: "", taxRegDate: "", address1: "", address2: "", city: "", zipCode: "", emailId: "" });
  const [bankDetails, setBankDetails] = useState({ accountHolderName: "", accountNo: "", bankName: "", branchName: "", bankAddress: "" });
  const [additionalInfo, setAdditionalInfo] = useState({ type: "", registrationNo: "" });

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
        setContactDetails(prev => ({ ...prev, emailId: response.data.contractor.email }));
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
      setTaxTypeOptions(list.map(item => ({ value: item.id, label: item.taxType })));
    });

    axios.get(`${baseUrl}/territoryType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setTerritoryTypeOptions(list.map(item => ({ value: item.code, label: item.label })));
    });

    axios.get(`${baseUrl}/identityType`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setAdditionalInfoTypeOptions(list.map(item => ({ value: item.id, label: item.idType })));
    });

    axios.get(`${baseUrl}/cities`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setCityOptions(list.map(item => ({ value: item.id, label: item.city })));
    });

  }, [authToken, inviteStatus, baseUrl]);

  const fetchNatureOfBusiness = (entityTypeId) => {
    axios.get(`${baseUrl}/contractorNature/${entityTypeId}`, { headers }).then(r => {
      const list = r.data?.data ?? r.data ?? [];
      setNatureOfBusinessOptions(list.map(item => ({ value: item.id, label: item.nature })));
    });
  };

  const fetchTerritory = async (territoryTypeId) => {
    if (!territoryTypeId) {
      setTerritoryOptions([]);
      setTaxDetails(prev => ({ ...prev, territory: null }));
      return;
    }
    try {
      let url = '';
      if (territoryTypeId === 'COUNTRY') url = `${baseUrl}/countries`;
      else if (territoryTypeId === 'STATE') url = `${baseUrl}/states`;
      else if (territoryTypeId === 'CITY') url = `${baseUrl}/cities`;

      if (url) {
        const response = await axios.get(url, { headers });
        const labelKey = territoryTypeId === 'COUNTRY' ? 'country' : territoryTypeId === 'STATE' ? 'state' : 'city';
        setTerritoryOptions(response.data.map(item => ({ value: item.id, label: item[labelKey] })));
      }
    } catch (error) {
      console.error("Error fetching territory:", error);
      setTerritoryOptions([]);
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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleTaxChange = (e) => {
    const { name, value } = e.target;
    setTaxDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleAdditionalInfoChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitFinal = async () => {
    const data = new FormData();

    const inputDto = {
      id: id,
      entityCode: basicInfo.entityCode,
      entityName: basicInfo.entityName,
      effectiveDate: formatDateForBackend(basicInfo.effectiveDate || effectiveDate),
      contractorTypeId: basicInfo.entityType,
      contractorGradeId: basicInfo.grade,
      contractorNatureId: [basicInfo.natureOfBusiness],
      subbmissionMode: "EMAIL",
      taxTypeId: taxDetails.taxType,
      addressTypeId: addressDetails.addressType,
      idTypeId: additionalInfo.type,
      territoryTypeId: taxDetails.territoryType
    };
    data.append("contractorInputDto", new Blob([JSON.stringify(inputDto)], { type: "application/json" }));

    const addressObj = {
      addressType: { id: addressDetails.addressType },
      address1: addressDetails.address1,
      address2: addressDetails.address2,
      country: addressDetails.country,
      city: addressDetails.city,
      zipCode: addressDetails.zipCode,
      phoneNumber: addressDetails.phoneNo,
      email: addressDetails.emailId
    };
    data.append("contractorAddress", new Blob([JSON.stringify(addressObj)], { type: "application/json" }));

    const contactsObj = {
      name: contactDetails.name,
      designation: contactDetails.position,
      phoneNumber: contactDetails.phoneNo,
      email: contactDetails.emailId
    };
    data.append("contractorContacts", new Blob([JSON.stringify(contactsObj)], { type: "application/json" }));

    const taxObj = {
      taxType: { id: taxDetails.taxType },
      territoryType: taxDetails.territoryType,
      territory: taxDetails.territory,
      taxRegNumber: taxDetails.taxRegNo,
      taxRegDate: formatDateForBackend(taxDetails.taxRegDate),
      address1: taxDetails.address1,
      address2: taxDetails.address2,
      city: taxDetails.city,
      pinCode: taxDetails.zipCode,
      email: taxDetails.emailId
    };
    data.append("contractorTaxDetails", new Blob([JSON.stringify(taxObj)], { type: "application/json" }));

    const bankObj = {
      accHolderName: bankDetails.accountHolderName,
      accNumber: bankDetails.accountNo,
      bankName: bankDetails.bankName,
      branch: bankDetails.branchName,
      bankAddress: bankDetails.bankAddress
    };
    data.append("contractorBankDetails", new Blob([JSON.stringify(bankObj)], { type: "application/json" }));

    const addInfoObj = {
      identityType: { id: additionalInfo.type },
      regNo: additionalInfo.registrationNo
    };
    data.append("contractorAddInfo", new Blob([JSON.stringify(addInfoObj)], { type: "application/json" }));

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

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '48px',
      borderRadius: '6px',
      border: state.isFocused ? '1.5px solid #005bb7' : '1.5px solid #a3c4f3',
      boxShadow: 'none',
      '&:hover': { border: '1.5px solid #005bb7' },
      backgroundColor: 'white'
    }),
    placeholder: (base) => ({ ...base, color: '#6c757d', fontSize: '0.9rem' }),
    indicatorSeparator: () => ({ display: 'none' }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 })
    
  };

  const renderReviewForm = () => (
    <Container fluid className="bg-white p-4 min-vh-100" style={{ fontFamily: '"Inter", sans-serif' }}>
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
              <p className="text-secondary mb-0 fs-6">Registered company address</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Phone No</div>
                <div className="fw-bold text-dark fs-6">{addressDetails.phoneNo || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Email ID</div>
                <div className="fw-bold text-dark fs-6 text-break">{addressDetails.emailId || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Address Type</div>
                <div className="fw-bold text-dark fs-6">{getLabel(addressDetails.addressType, addressTypeOptions) || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Address 1</div>
                <div className="fw-bold text-dark fs-6 text-break">{addressDetails.address1 || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Address 2</div>
                <div className="fw-bold text-dark fs-6 text-break">{addressDetails.address2 || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Country</div>
                <div className="fw-bold text-dark fs-6">{getLabel(addressDetails.country, countryOptions) || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">City</div>
                <div className="fw-bold text-dark fs-6">{getLabel(addressDetails.city, cityOptions) || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Zip/Postal Code</div>
                <div className="fw-bold text-dark fs-6">{addressDetails.zipCode || ""}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-person-badge text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Contact Details</h5>
              <p className="text-secondary mb-0 fs-6">Primary point of contact</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Name</div>
                <div className="fw-bold text-dark fs-6">{contactDetails.name || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Position</div>
                <div className="fw-bold text-dark fs-6">{contactDetails.position || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Phone No</div>
                <div className="fw-bold text-dark fs-6">{contactDetails.phoneNo || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Email ID</div>
                <div className="fw-bold text-dark fs-6 text-break">{contactDetails.emailId || ""}</div>
              </Col>
            </Row>
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
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Territory Type</div>
                <div className="fw-bold text-dark fs-6">{getLabel(taxDetails.territoryType, territoryTypeOptions) || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Territory</div>
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
            </Row>
          </Col>
        </Row>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-bank text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Bank Accounts</h5>
              <p className="text-secondary mb-0 fs-6">Financial transaction details</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Account Holder Name</div>
                <div className="fw-bold text-dark fs-6">{bankDetails.accountHolderName || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Account No</div>
                <div className="fw-bold text-dark fs-6">{bankDetails.accountNo || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Bank Name</div>
                <div className="fw-bold text-dark fs-6">{bankDetails.bankName || ""}</div>
              </Col>
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Branch Name</div>
                <div className="fw-bold text-dark fs-6">{bankDetails.branchName || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Bank Address</div>
                <div className="fw-bold text-dark fs-6 text-break">{bankDetails.bankAddress || ""}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mb-5 pb-5 align-items-start" style={{ borderBottom: '1px solid #0051973D' }}>
          <Col md={3} className="d-flex align-items-start border-end border-light px-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <i className="bi bi-info-circle text-primary fs-4"></i>
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-dark">Additional Info</h5>
              <p className="text-secondary mb-0 fs-6">Other relevant registrations</p>
            </div>
          </Col>
          <Col md={9} className="ps-md-5">
            <Row className="gy-5">
              <Col md={4}>
                <div className="text-muted mb-1 fs-6">Type</div>
                <div className="fw-bold text-dark fs-6">{getLabel(additionalInfo.type, additionalInfoTypeOptions) || ""}</div>
              </Col>
              <Col md={8}>
                <div className="text-muted mb-1 fs-6">Registration No</div>
                <div className="fw-bold text-dark fs-6">{additionalInfo.registrationNo || ""}</div>
              </Col>
            </Row>
          </Col>
        </Row>
        <div className="d-flex justify-content-end gap-3 mt-4">
          <Button variant="outline-primary" className="px-5 py-2 border-2 fw-bold fs-6" style={{ borderRadius: '8px' }} onClick={() => setShowReview(false)}>Edit</Button>
          <Button variant="primary" className="px-5 py-2 shadow-sm fw-bold border-0 fs-6" style={{ borderRadius: '8px', backgroundColor: '#0066ff' }} onClick={handleSubmitFinal}>Submit</Button>
        </div>
      </Card>
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

  return (
    <>
      {showReview ? (
        renderReviewForm()
      ) : (
        <Container fluid className="main-container p-4">
          <Card className="form-card shadow-sm">
            <div className="form-header"><i className="bi bi-file-earmark-text"></i> Basic Information</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Entity Code <span className="text-danger">*</span></label>
                  <Form.Control name="entityCode" value={basicInfo.entityCode} onChange={handleBasicInfoChange} className="outline-input" placeholder="Enter entity code" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Entity Name <span className="text-danger">*</span></label>
                  <Form.Control name="entityName" value={basicInfo.entityName} onChange={handleBasicInfoChange} className="outline-input" placeholder="Enter entity name" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Effective Date <span className="text-danger">*</span></label>
                  <div className="position-relative">
                    <Flatpickr
                      ref={fpEffective}
                      value={effectiveDate}
                      onChange={([date]) => {
                        setEffectiveDate(date);
                        setBasicInfo(prev => ({ ...prev, effectiveDate: date }));
                      }}
                      className="form-control outline-input"
                      placeholder="mm/dd/yyyy"
                      options={{ dateFormat: "m/d/Y" }}
                    />
                    <i className="bi bi-calendar3 position-absolute" style={{ right: '15px', top: '12px', color: '#005bb7', cursor: 'pointer', zIndex: 10 }} onClick={() => fpEffective.current.flatpickr.open()}></i>
                  </div>
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Entity Type <span className="text-danger">*</span></label>
                  <Select
                    options={entityTypeOptions}
                    placeholder="Select entity type"
                    value={entityTypeOptions.find(opt => opt.value === basicInfo.entityType)}
                    onChange={(opt) => {
                      setBasicInfo(prev => ({ ...prev, entityType: opt.value }));
                      fetchNatureOfBusiness(opt.value);
                    }}
                    styles={customSelectStyles}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Nature of Business</label>
                  <Select
                    options={natureOfBusinessOptions}
                    styles={customSelectStyles}
                    placeholder="Select Nature of Business"
                    menuPortalTarget={document.body}
                    value={natureOfBusinessOptions.find(opt => opt.value === basicInfo.natureOfBusiness)}
                    onChange={(selectedOption) => setBasicInfo((prev) => ({ ...prev, natureOfBusiness: selectedOption.value }))}
                  />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Grade</label>
                  <Select
                    options={gradeOptions}
                    styles={customSelectStyles}
                    placeholder="Select Grade"
                    menuPortalTarget={document.body}
                    value={gradeOptions.find(opt => opt.value === basicInfo.grade)}
                    onChange={(selectedOption) => setBasicInfo((prev) => ({ ...prev, grade: selectedOption.value }))}
                  />
                </Col>
              </Row>
              <div className="mt-2">
                <h6 className="attachment-title">Attachment (Certificates/Licenses)</h6>
                <div className="upload-section" onClick={() => document.getElementById('hiddenFileInput').click()}>
                  <input type="file" id="hiddenFileInput" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                  <div className="upload-instructions">
                    <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '2.5rem', color: '#7ba2d5' }}></i>
                    <p className="mb-0 fw-bold mt-2" style={{ color: '#005bb7' }}>Click to upload or drag and drop</p>
                    <small className="text-muted">PDF, DOCX up to 10MB</small>
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="file-list-horizontal mt-3">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="file-badge" onClick={(e) => e.stopPropagation()}>
                          <span className="file-name-text">{file.name}</span>
                          <i className="bi bi-x ms-2 remove-file-icon" onClick={() => removeFile(index)}></i>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
          <Card className="form-card shadow-sm">
            <div className="form-header"><i className="bi bi-geo-alt"></i> Address Details</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Phone No</label>
                  <Form.Control name="phoneNo" value={addressDetails.phoneNo} onChange={handleAddressChange} className="outline-input" placeholder="Enter phone no" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Email ID</label><Form.Control type="email" name="emailId" value={addressDetails.emailId} onChange={handleAddressChange} className="outline-input" placeholder="Enter email id" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Address Type <span className="text-danger">*</span></label>
                  <Select
                    options={addressTypeOptions}
                    styles={customSelectStyles}
                    placeholder="Select Address Type"
                    menuPortalTarget={document.body}
                    value={addressTypeOptions.find(opt => opt.value === addressDetails.addressType)}
                    onChange={(selectedOption) => setAddressDetails((prev) => ({ ...prev, addressType: selectedOption.value }))}
                  />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Address 1</label>
                  <Form.Control name="address1" value={addressDetails.address1} onChange={handleAddressChange} className="outline-textarea" placeholder="Enter address 1" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Address 2</label>
                  <Form.Control name="address2" value={addressDetails.address2} onChange={handleAddressChange} className="outline-textarea" placeholder="Enter address 2" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Country <span className="text-danger">*</span></label>
                  <Select
                    options={countryOptions}
                    styles={customSelectStyles}
                    placeholder="Select Country"
                    menuPortalTarget={document.body}
                    value={countryOptions.find(opt => opt.value === addressDetails.country)}
                    onChange={(opt) => setAddressDetails(prev => ({ ...prev, country: opt.value }))}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">City <span className="text-danger">*</span></label>
                  <Select
                    name="city"
                    options={cityOptions}
                    styles={customSelectStyles}
                    placeholder="Select City"
                    menuPortalTarget={document.body}
                    value={cityOptions.find(opt => opt.value === addressDetails.city)}
                    onChange={(selectedOption) => setAddressDetails((prev) => ({ ...prev, city: selectedOption.value }))}
                  />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Zip/Postal Code</label>
                  <Form.Control name="zipCode" value={addressDetails.zipCode} onChange={handleAddressChange} className="outline-input" placeholder="Enter Zip/Postal Code" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="form-card shadow-sm">
            <div className="form-header"><i className="bi bi-person-badge"></i> Contact Details</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Name <span className="text-danger">*</span></label>
                  <Form.Control name="name" value={contactDetails.name} onChange={handleContactChange} className="outline-input" placeholder="Enter contact name" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Position <span className="text-danger">*</span></label>
                  <Form.Control name="position" value={contactDetails.position} onChange={handleContactChange} className="outline-input" placeholder="Enter position" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Phone No</label>
                  <Form.Control name="phoneNo" value={contactDetails.phoneNo} onChange={handleContactChange} className="outline-input" placeholder="Enter phone no" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Email ID</label>
                  <Form.Control type="email" name="emailId" value={contactDetails.emailId} onChange={handleContactChange} className="outline-input" placeholder="Enter email id" disabled={true} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="form-card shadow-sm">
            <div className="form-header"><i className="bi bi-coin"></i> Tax Details</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Tax Type <span className="text-danger">*</span></label>
                  <Select
                    name="taxType"
                    options={taxTypeOptions}
                    styles={customSelectStyles}
                    placeholder="Select Tax Type"
                    menuPortalTarget={document.body}
                    value={taxTypeOptions.find(opt => opt.value === taxDetails.taxType)}
                    onChange={(selectedOption) => setTaxDetails((prev) => ({ ...prev, taxType: selectedOption.value }))}
                  />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Territory Type <span className="text-danger">*</span></label>
                  <Select
                    name="territoryType"
                    options={territoryTypeOptions}
                    styles={customSelectStyles}
                    placeholder="Select Territory Type"
                    menuPortalTarget={document.body}
                    value={territoryTypeOptions.find(opt => opt.value === taxDetails.territoryType)}
                    onChange={(selectedOption) => {
                      setTaxDetails(prev => ({ ...prev, territoryType: selectedOption.value }));
                      fetchTerritory(selectedOption.value);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Territory <span className="text-danger">*</span></label>
                  <Select
                    name="territory"
                    options={territoryOptions}
                    styles={customSelectStyles}
                    placeholder="Select territory"
                    menuPortalTarget={document.body}
                    value={territoryOptions.find(opt => opt.value === taxDetails.territory)}
                    onChange={(selectedOption) => setTaxDetails(prev => ({ ...prev, territory: selectedOption.value }))}
                  />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Tax Reg. No <span className="text-danger">*</span></label>
                  <Form.Control name="taxRegNo" value={taxDetails.taxRegNo} onChange={handleTaxChange} className="outline-input" placeholder="Enter tax registration no" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Tax Reg. Date <span className="text-danger">*</span></label>
                  <div className="position-relative">
                    <Flatpickr
                      ref={fpTaxReg}
                      value={taxDetails.taxRegDate || ''}
                      onChange={([date]) => setTaxDetails(prev => ({ ...prev, taxRegDate: date }))}
                      className="form-control outline-input"
                      placeholder="mm/dd/yyyy"
                      options={{ dateFormat: "m/d/Y", allowInput: true }}
                    />
                    <i className="bi bi-calendar3 position-absolute" style={{ right: '15px', top: '12px', color: '#005bb7', cursor: 'pointer', zIndex: 10 }} onClick={() => fpTaxReg.current.flatpickr.open()}></i>
                  </div>
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Address 1</label>
                  <Form.Control name="address1" value={taxDetails.address1} onChange={handleTaxChange} className="outline-textarea" placeholder="Enter address 1" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Address 2</label>
                  <Form.Control name="address2" value={taxDetails.address2} onChange={handleTaxChange} className="outline-textarea" placeholder="Enter address 2" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">City <span className="text-danger">*</span></label>
                  <Select
                    styles={customSelectStyles}
                    placeholder="Select City"
                    menuPortalTarget={document.body}
                    options={cityOptions}
                    value={cityOptions.find(opt => opt.value === taxDetails.city)}
                    onChange={(opt) => setTaxDetails(prev => ({ ...prev, city: opt.value }))}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Zip/Postal Code</label>
                  <Form.Control name="zipCode" value={taxDetails.zipCode} onChange={handleTaxChange} className="outline-input" placeholder="Enter Zip/Postal Code" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Email ID</label>
                  <Form.Control type="email" name="emailId" value={taxDetails.emailId} onChange={handleTaxChange} className="outline-input" placeholder="Enter email id" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="form-card shadow-sm">
            <div className="form-header"><i className="bi bi-bank"></i> Bank Accounts</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Account Holder Name <span className="text-danger">*</span></label>
                  <Form.Control name="accountHolderName" value={bankDetails.accountHolderName} onChange={handleBankChange} className="outline-input" placeholder="Enter account holder name" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Account No <span className="text-danger">*</span></label>
                  <Form.Control name="accountNo" value={bankDetails.accountNo} onChange={handleBankChange} className="outline-input" placeholder="Enter account no" />
                </Col>
              </Row>
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Bank Name <span className="text-danger">*</span></label>
                  <Form.Control name="bankName" value={bankDetails.bankName} onChange={handleBankChange} className="outline-input" placeholder="Enter bank name" />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Branch Name <span className="text-danger">*</span></label>
                  <Form.Control name="branchName" value={bankDetails.branchName} onChange={handleBankChange} className="outline-input" placeholder="Enter branch name" />
                </Col>
              </Row>
              <Row>
                <Col md={12} className="outline-group">
                  <label className="outline-label">Bank Address</label>
                  <Form.Control as="textarea" name="bankAddress" value={bankDetails.bankAddress} onChange={handleBankChange} className="outline-textarea" placeholder="Enter bank address" style={{ minHeight: '60px' }} rows={3} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className="form-card shadow-sm">
            <div className="form-header"><i className="bi bi-info-circle"></i> Additional Info</div>
            <Card.Body className="p-4">
              <Row>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Type <span className="text-danger">*</span></label>
                  <Select
                    name="type"
                    options={additionalInfoTypeOptions}
                    styles={customSelectStyles}
                    placeholder="Select Type"
                    menuPortalTarget={document.body}
                    value={additionalInfoTypeOptions.find(opt => opt.value === additionalInfo.type)}
                    onChange={(selectedOption) => setAdditionalInfo(prev => ({ ...prev, type: selectedOption.value }))}
                  />
                </Col>
                <Col md={6} className="outline-group">
                  <label className="outline-label">Registration No <span className="text-danger">*</span></label>
                  <Form.Control name="registrationNo" value={additionalInfo.registrationNo} onChange={handleAdditionalInfoChange} className="outline-input" placeholder="Enter registration no" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <div className="footer-btns">
            <span className="btn-cancel">Cancel</span>
            <Button className="btn-submit" onClick={() => setShowReview(true)}>Review & Submit <i className="bi bi-arrow-right ms-2"></i></Button>
          </div>
        </Container>
      )}
    </>
  );
}

export default ContractorForm;