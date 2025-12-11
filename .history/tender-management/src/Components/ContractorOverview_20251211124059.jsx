function ContractorOverview() {
    const navigate = useNavigate();
    useLayoutEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        const scrollTimer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
        return () => {
            clearTimeout(scrollTimer);
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'auto';
            }
        };

    }, [])
    const handleGoBack = () => navigate(-1);
    const [selectedView, setSelectedView] = useState('manual');
    const handleViewChange = (view) => setSelectedView(view);

    // --- NEW VALIDATION STATE AND LOGIC ---
    const [errors, setErrors] = useState({});

    // List of ALL mandatory fields for Manual Entry mode
    const mandatoryFields = [
        'entityCode', 'entityName', 'effectiveDate', 'entityType',
        'addressType', 'address1', 'country', 'addresscity', 'zipCode',
        'contactName', 'contactPosition',
        'taxType', 'territoryType', 'territory', 'taxRegNo', 'taxRegDate',
        'taxAddress1', 'taxCity', 'taxZipCode',
        'accountHolderName', 'accountNo', 'bankName', 'branchName',
        'additionalInfoType', 'registrationNo'
    ];
    // List of mandatory fields for Email Invite mode
    const invitationFields = ['contractorEmailId'];

    const validateForm = () => {
        const newErrors = {};
        const fieldsToValidate = selectedView === 'manual' ? mandatoryFields : invitationFields;

        fieldsToValidate.forEach(field => {
            const value = formData[field];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                newErrors[field] = 'This field is required.';
            }
        });

        setErrors(newErrors);
        // Returns true if no errors were found, otherwise false
        return Object.keys(newErrors).length === 0;
    };
    // --- END NEW VALIDATION LOGIC ---


    const defaultFormData = {
        entityCode: '', entityName: '', effectiveDate: '', entityType: '',
        natureOfBusiness: '', grade: '',
        attachments: [],
        phoneNo: '', emailID: '',
        addressType: '', address1: '', address2: '', country: '', addresscity: '', zipCode: '',
        contactName: '', contactPosition: '', contactPhoneNo: '', contactEmailID: '',
        taxType: '', territoryType: '', territory: '', taxRegNo: '', taxRegDate: '',
        taxAddress1: '', taxAddress2: '', taxCity: '', taxZipCode: '', taxEmailID: '',
        accountHolderName: '', accountNo: '', bankName: '', branchName: '', bankAddress: '',
        additionalInfoType: '', registrationNo: '',
        contractorEmailId: '',
        contractorName: '',
        contractorMessage: '',
        attachmentMetadata: []
    };

    const loadFormData = () => {
        try {
            const savedData = sessionStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                return {
                    ...defaultFormData,
                    ...parsedData,
                    attachments: [],
                    attachmentMetadata: parsedData.attachmentMetadata || []
                };
            }
        } catch (error) {
            console.error("Could not load data from sessionStorage:", error);
        }
        return defaultFormData;
    };

    const [formData, setFormData] = useState(loadFormData());
    useEffect(() => {
        const serializableData = {
            ...formData,
            attachments: [],
            attachmentMetadata: formData.attachmentMetadata
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
    }, [formData]);

    // MODIFIED: Clears error for the field being edited
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // MODIFIED: Clears error for the select field being edited
    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setFormData(prev => ({ ...prev, [name]: selectedOption ? selectedOption.value : '' }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);

        e.target.value = null;
        const newMetadata = newFiles.map(file => ({
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
        }));

        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...newFiles],
            attachmentMetadata: [...prev.attachmentMetadata, ...newMetadata]
        }));
    };

    const handleRemoveFile = (fileNameToRemove) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter(file => file.name !== fileNameToRemove),
            attachmentMetadata: prev.attachmentMetadata.filter(meta => meta.name !== fileNameToRemove)
        }));
    };

    // MODIFIED: Submission checks validation before navigating
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form data ready for review:", formData);
            navigate('/contractor-review', { state: { formData } });
        } else {
            console.log("Validation failed. Errors:", errors);
            // Scroll to the first error field for better UX
            const firstErrorField = mandatoryFields.find(field => errors[field]);
            if (firstErrorField) {
                 document.getElementsByName(firstErrorField)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    // MODIFIED: Invitation checks validation before proceeding
    const handleSendInvitation = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Invitation Sent:", {
                contractorEmailId: formData.contractorEmailId,
                contractorName: formData.contractorName,
                message: formData.contractorMessage
            });
            // Add success/redirect logic here
        }
    };

    const handleCancel = () => {
        sessionStorage.removeItem(STORAGE_KEY);
        navigate('/ContractorOnboarding');
        console.log("Form Cancelled. Data cleared and navigating to /ContractorOnboarding.");
    };

    const isManualActive = selectedView === 'manual';
    const isEmailActive = selectedView === 'email';

    const buttonGroupStyle = {
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: (isManualActive || isEmailActive) ? `0 0 0 1px ${bluePrimary}` : 'none'
    };

    const manualButtonStyle = {
        paddingLeft: '20px',
        paddingRight: '20px',
        borderTopRightRadius: isManualActive ? 0 : '6px',
        borderBottomRightRadius: isManualActive ? 0 : '6px',
        backgroundColor: isManualActive ? bluePrimary : 'white',
        color: isManualActive ? 'white' : bluePrimary,
        transition: 'all 0.3s',
        border: 'none',
        outline: 'none'
    };

    const emailButtonStyle = {
        paddingLeft: '20px',
        paddingRight: '20px',
        borderTopLeftRadius: isEmailActive ? 0 : '6px',
        borderBottomLeftRadius: isEmailActive ? 0 : '6px',
        backgroundColor: isEmailActive ? bluePrimary : 'white',
        color: isEmailActive ? 'white' : bluePrimary,
        transition: 'all 0.3s',
        border: 'none',
        outline: 'none'
    };

    return (
        <div className="container-fluid min-vh-100 p-0">
            <div className="d-flex align-items-center py-3 px-4 mb-4">
                <ArrowLeft size={24} className="me-3" onClick={handleGoBack} style={{ cursor: 'pointer', color: bluePrimary }} />
                <h2 className="mb-0 fs-5 fw-bold">New Contractor</h2>
            </div>
            <div className="px-4 text-start">
                <div className="d-inline-flex mb-4" style={buttonGroupStyle}>
                    <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('manual')} style={manualButtonStyle}>
                        <Pencil size={20} className="me-2" /> Manual Entry
                    </button>
                    <button className="btn d-flex align-items-center fw-bold" onClick={() => handleViewChange('email')} style={emailButtonStyle}>
                        <Mail size={20} className="me-2" /> Email Invite
                    </button>
                </div>

                <form id="contractorForm" onSubmit={handleSubmit}>
                    <div className="card text-start border-0 shadow-sm" style={{ borderRadius: "8px", padding: selectedView === 'manual' ? "0 1.5rem 1.5rem 1.5rem" : "1.5rem" }}>
                        {selectedView === 'manual' ?
                            <ManualEntryForm
                                formData={formData}
                                setFormData={setFormData}
                                handleChange={handleChange}
                                handleSelectChange={handleSelectChange}
                                handleFileChange={handleFileChange}
                                handleRemoveFile={handleRemoveFile}
                                errors={errors} 
                            />
                            :
                            <EmailInviteForm
                                formData={formData}
                                setFormData={setFormData}
                                handleSendInvitation={handleSendInvitation}
                                errors={errors} 
                            />
                        }
                    </div>
                    {selectedView === 'manual' && <AddressDetailsContent formData={formData} setFormData={setFormData} handleSelectChange={handleSelectChange} errors={errors} />} 
                    {selectedView === 'manual' && <ContactDetailsContent formData={formData} setFormData={setFormData} handleSelectChange={handleSelectChange} errors={errors} />}
                    {selectedView === 'manual' && <TaxDetailsContent formData={formData} setFormData={setFormData} handleChange={handleChange} handleSelectChange={handleSelectChange} errors={errors} />}
                    {selectedView === 'manual' && <BankAccountsContent formData={formData} setFormData={setFormData} errors={errors} />}
                    {selectedView === 'manual' && <AdditionalInfoContent formData={formData} setFormData={setFormData} handleSelectChange={handleSelectChange} errors={errors} />}
                </form>

                {selectedView === 'manual' && (
                    <div className="d-flex justify-content-end mt-4">
                        <button type="button" onClick={handleCancel} className="fw-bold px-4" style={{ background: "none", border: "none", color: bluePrimary, cursor: "pointer" }}>Cancel</button>
                        <button type="submit" form="contractorForm" className="btn px-4 fw-bold" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "6px", borderColor: bluePrimary }}>Review & Submit<ArrowRight size={21} color="white" className="ms-2" /></button>
                    </div>
                )}
            </div>
            <div className="mb-5"></div>
        </div>
    );
}

export default ContractorOverview;