

            <FormSectionContainer title="Basic Information" icon={<span className="text-primary" style={{ fontSize: '1.2em' }}>•</span>} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Type <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select options={resourceTypeOptions} styles={customStyles} placeholder="Select Resource Type"className="w-100"classNamePrefix="select"
                                value={selectedResourceType}
                                onChange={(selected) => {
                                    setSelectedResourceType(selected);
                                    fetchResources(selected?.value);
                                }}
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Nature <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select options={resourceNatureOption} styles={customStyles} placeholder="Select Nature" className="w-100" classNamePrefix="select"/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Resource Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select 
                                options={resourceOption} 
                                styles={{
                                    ...customStyles,
                                    placeholder: (provided) => ({ ...provided, color: 'black', textAlign: 'left' }),
                                    singleValue: (provided) => ({ ...provided, color: 'black' }),
                                }}
                                placeholder="Select resource"className="w-100"classNamePrefix="select"
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Rate <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="number" style={{ borderRadius: '0.5rem' }} placeholder="0.00" className="form-input w-100"/>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            <FormSectionContainer title="Quantity & Measurements" icon={<AlignLeft size={20} className="text-primary" />} defaultOpen={true}>
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            UOM <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <Select  options={uomOptions}  value={selectedUom} onChange={setSelectedUom} 
                             styles={customStyles}  placeholder="Select UOM"  className="w-100" classNamePrefix="select" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Quantity Type <span style={{ color: "red" }}>*</span>
                            </label>
                            <Select options={quantityTypeOption} styles={customStyles} placeholder="Select Quantity Type" className="w-100"classNamePrefix="select"/>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label text-start w-100">
                            Coefficient <span style={{ color: "red" }}>*</span>
                        </label>
                        <div style={{ width: '80%' }}>
                            <input type="number"  style={{ borderRadius: '0.5rem' }} placeholder="0.00" className="form-input w-100" />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div style={{ width: '80%' }} className="ms-auto">
                            <label className="form-label text-start w-100">
                                Calculated Quantity <span style={{ color: "red" }}>*</span>
                            </label>
                            <input type="text"  style={{ borderRadius: '0.5rem' }} placeholder="" readOnly className="form-input w-100"/>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

            <FormSectionContainer title="Wastage & Net Quantity" icon={<Settings size={20} className="text-primary" />}>
    <div className="row g-3">

        <div className="col-md-4">
            <label className="form-label text-start w-100">
                Wastage % <span style={{ color: "red" }}></span>
            </label>
            <input 
                type="number" 
                placeholder="0.00"
                className="form-input w-100"
                style={{ borderRadius: "0.5rem" }}
            />
        </div>

        <div className="col-md-4">
            <label className="form-label text-start w-100">
                Wastage Quantity
            </label>
            <input 
                type="number" 
                className="form-input w-100"
                placeholder="0.00"
                style={{ borderRadius: "0.5rem" }}
            />
        </div>

        <div className="col-md-4">
            <label className="form-label text-start w-100">
                Net Quantity
            </label>
            <input 
                type="number" 
                className="form-input w-100"
                placeholder="0.00"
                style={{ borderRadius: "0.5rem" }}
            />
        </div>

    </div>
</FormSectionContainer>


         <FormSectionContainer title="Pricing & Currency" icon={<DollarSign size={20} className="text-primary" />}>
    <div className="row g-4">
        <div className="col-md-6">

            <div className="mb-3">
                <label className="form-label text-start w-100">Additional Rate</label>
                <input type="number" className="form-input w-100" placeholder="0.00"style={{ borderRadius: "0.5rem"  }} />
            </div>

            <div className="mb-3">
                <label className="form-label text-start w-100"> Currency <span style={{ color: "red" }}></span></label>
                <Select options={currencyOptions} styles={customStyles} placeholder="Select Currency" className="w-100" classNamePrefix="select" /> </div>
            </div>

        <div className="col-md-6">
            <div className="mb-3">
                <label className="form-label text-start w-100"> Shipping / Freight Price (+ / -) </label>
                <input type="number" className="form-input w-100" placeholder="0.00" style={{ borderRadius: "0.5rem" }} />
            </div>
            <div className="mb-3">
                <label className="form-label text-start w-100"> Exchange Rate </label>
                <input type="number" className="form-input w-100" placeholder="1.00000" style={{ borderRadius: "0.5rem"}} />
             </div>

        </div>

    </div>
</FormSectionContainer>


            <FormSectionContainer title="Cost Summary" icon={<Calculator size={20} className="text-primary" />}>
                <div className="d-flex justify-content-end align-items-center mb-3">
                    <span className="me-2">Rate Lock</span>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="rateLockSwitch" />
                    </div>
                </div>

                <div className="row g-3 text-center">
                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F9FAFB' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">0.00</div>
                            <small className="text-muted">per CUM</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#EFF6FF' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">0.00</div>
                            <small className="text-muted">per CUM</small>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="p-3" style={{ backgroundColor: '#F0FDF4' }}>
                            <div className="text-muted">Cost Unit Rate</div>
                            <div className="fw-bold">0.00</div>
                            <small className="text-muted">per CUM</small>
                        </div>
                    </div>
                </div>
            </FormSectionContainer>

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