import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw } from "lucide-react";
import axios from "axios";
import Select from 'react-select';

export function Addresstype() {
    const [addressTypes, setAddressTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [addressType, setAddressType] = useState({
        id: null,
        addressType: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchAddressTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/addressType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setAddressTypes(r.data || []);
                }
            })
            .catch(() => {
                toast.error("Failed to load address types");
            });
    };
    useEffect(() => {
        fetchAddressTypes();
    }, []);
    const filteredAddressTypes = addressTypes.filter((a) =>
        a.addressType?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setAddressType({ id: null, addressType: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (a) => {
        setIsEdit(true);
        setAddressType({ ...a });
        setOpenModal(true);
    };
    const handleDelete = (a) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/addressType/edit`,
                { ...a, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                if (r.status === 200) {
                    toast.success(r.data);
                    fetchAddressTypes();
                }
            })
            .catch((e) => {
                toast.error(e?.response?.data || "Failed to deactivate address type");
            });
    };
    const handleReactivate = (a) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/addressType/edit`,
                { ...a, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                if (r.status === 200) {
                    toast.success(r.data);
                    fetchAddressTypes();
                }
            })
            .catch((e) => {
                toast.error(e?.response?.data || "Failed to re-activate address type");
            });
    };
    const handleSave = () => {
        if (!addressType.addressType.trim()) return;
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/addressType/edit`,
                    addressType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    if (r.status === 200) {
                        toast.success(r.data);
                        fetchAddressTypes();
                        setOpenModal(false);
                    }
                })
                .catch((e) => {
                    toast.error(e?.response?.data || "Failed to update address type");
                });
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/addressType`,
                    addressType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    if (r.status === 200) {
                        toast.success(r.data);
                        fetchAddressTypes();
                        setOpenModal(false);
                    }
                })
                .catch((e) => {
                    toast.error(e?.response?.data || "Failed to save address type");
                });
        }
    }
    const modal = () => (
        <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Address Type" : "Add Address Type"}
                        </p>
                        <button
                            className="modal-close-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="modal-body">
                        <label className="projectform d-block">
                            Address Type <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter address type"
                            value={addressType.addressType}
                            onChange={(e) =>
                                setAddressType((prev) => ({
                                    ...prev,
                                    addressType: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!addressType.addressType.trim()}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-4 mt-3">
            {/* Header */}
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Address Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new address type</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Address Types</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredAddressTypes.length} of {addressTypes.length} Address Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredAddressTypes.length > 0 ? (
                        filteredAddressTypes.map((a, i) => (
                            <div className="col-lg-4 mb-3" key={i}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <Edit
                                                size={18}
                                                title="Edit"
                                                onClick={() => handleEdit(a)}
                                                style={{ cursor: "pointer" }}
                                            />
                                            {a.active ? (
                                                <Trash2
                                                    size={18}
                                                    title="Deactivate"
                                                    onClick={() => handleDelete(a)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            ) : (
                                                <RotateCcw
                                                    size={18}
                                                    title="Re-activate"
                                                    onClick={() => handleReactivate(a)}
                                                    style={{ cursor: "pointer" }}
                                                    className="text-primary"
                                                />
                                            )}
                                        </div>

                                        <div className="mt-2 d-flex justify-content-between">
                                            <span>{a.addressType}</span>
                                            <span
                                                className={
                                                    a.active ? "text-success" : "text-muted"
                                                }
                                            >
                                                {a.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center text-muted">
                            No Address Types were found
                        </div>
                    )}
                </div>

                {openModal && modal()}
            </div>
        </div>
    );
}
export function Countries() {
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [country, setCountry] = useState({
        id: null,
        country: "",
        countryCode: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchCountries = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/countries`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => setCountries(r.data || []))
            .catch(() => toast.error("Failed to load countries"));
    };
    useEffect(() => {
        fetchCountries();
    }, []);
    const filteredCountries = countries.filter(c =>
        c.country?.toLowerCase().includes(search.toLowerCase()) ||
        c.countryCode?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setCountry({ id: null, country: "", countryCode: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (c) => {
        setIsEdit(true);
        setCountry({ ...c });
        setOpenModal(true);
    };
    const handleDelete = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/country/edit`,
                { ...c, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(r => {
                toast.success(r.data);
                fetchCountries();
            })
            .catch(e => toast.error(e?.response?.data || "Deactivate failed"));
    };
    const handleReactivate = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/country/edit`,
                { ...c, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(r => {
                toast.success(r.data);
                fetchCountries();
            })
            .catch(e => toast.error(e?.response?.data || "Reactivate failed"));
    };
    const handleSave = () => {
        if (!country.country.trim() || !country.countryCode.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/country/edit`,
                    country,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(r => {
                    toast.success(r.data);
                    fetchCountries();
                    setOpenModal(false);
                })
                .catch(e => toast.error(e?.response?.data || "Update failed"));
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/country`,
                    country,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(r => {
                    toast.success(r.data);
                    fetchCountries();
                    setOpenModal(false);
                })
                .catch(e => toast.error(e?.response?.data || "Save failed"));
        }
    };
    const modal = () => (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setOpenModal(false)}>
            <div className="modal-dialog modal-dialog-centered modal-md" onClick={e => e.stopPropagation()}>
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">{isEdit ? "Edit Country" : "Add Country"}</p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}><X /></button>
                    </div>

                    <div className="modal-body">
                        <label className="projectform d-block">Country *</label>
                        <input
                            className="form-input w-100 mb-3"
                            value={country.country}
                            onChange={e => setCountry(p => ({ ...p, country: e.target.value }))}
                        />

                        <label className="projectform d-block">Country Code *</label>
                        <input
                            className="form-input w-100"
                            value={country.countryCode}
                            onChange={e => setCountry(p => ({ ...p, countryCode: e.target.value.toUpperCase() }))}
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave}>
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="container-fluid p-4 mt-3">
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Countries</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} /> <span className="ms-2">Add Country</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info"><span className="ms-2">Countries</span></div>

                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input className="form-input w-100" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCountries.length} of {countries.length} Countries
                    </div>
                </div>

                <div className="row ms-1 me-1 mt-3">
                    {filteredCountries.map((c, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit size={18} onClick={() => handleEdit(c)} style={{ cursor: "pointer" }} />
                                        {c.active ? (
                                            <Trash2 size={18} onClick={() => handleDelete(c)} style={{ cursor: "pointer" }} />
                                        ) : (
                                            <RotateCcw size={18} onClick={() => handleReactivate(c)} className="text-primary" style={{ cursor: "pointer" }} />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{c.country} ({c.countryCode})</span>
                                        <span className={c.active ? "text-success" : "text-muted"}>
                                            {c.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {openModal && modal()}
            </div>
        </div>
    );
}
export function States() {
    const [states, setStates] = useState([]);
    const [countries, setCountries] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [state, setState] = useState({
        id: null,
        state: "",
        countryId: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");

    const fetchCountries = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/countries`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(r => {
                if (r.status === 200) {
                    const data = r.data || [];
                    setCountries(data);
                    if (data.length > 0 && !selectedCountry) {
                        setSelectedCountry({
                            value: data[0].id,
                            label: `${data[0].country} (${data[0].countryCode})`,
                        });
                    }
                }
            })
            .catch(() => toast.error("Failed to load countries"));
    };

    const fetchStates = (countryId) => {
        if (!countryId) {
            setStates([]);
            return;
        }
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/states/${countryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(r => {
                if (r.status === 200) setStates(r.data || []);
            })
            .catch(() => toast.error("Failed to load states"));
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            fetchStates(selectedCountry.value);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    const filteredStates = states.filter(s =>
        s.state?.toLowerCase().includes(search.toLowerCase())
    );
    const countryOptions = countries.map(c => ({
        value: c.id,
        label: `${c.country} (${c.countryCode})`,
    }));
    const handleAdd = () => {
        setIsEdit(false);
        setState({
            id: null,
            state: "",
            countryId: selectedCountry ? selectedCountry.value : "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (s) => {
        setIsEdit(true);
        setState({
            id: s.id,
            state: s.state,
            countryId: s.country.id,
            active: s.active,
        });
        setOpenModal(true);
    };
    const handleDelete = (s) => {
        axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/states/edit`,
            {
                id: s.id,
                state: s.state,
                countryId: s.country.id,
                active: false
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(r => {
                toast.success(r.data);
                if (selectedCountry) fetchStates(selectedCountry.value);
            })
            .catch(e =>
                toast.error(e?.response?.data || "Failed to deactivate state")
            );
    };

    const handleReactivate = (s) => {
        axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/states/edit`,
            {
                id: s.id,
                state: s.state,
                countryId: s.country.id,
                active: true
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(r => {
                toast.success(r.data);
                if (selectedCountry) fetchStates(selectedCountry.value);
            })
            .catch(e =>
                toast.error(e?.response?.data || "Failed to reactivate state")
            );
    };

    const handleSave = () => {
        if (!state.state.trim() || !state.countryId) return;
        const payload = {
            id: state.id,
            state: state.state,
            active: state.active,
            countryId: state.countryId
        };
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/states/edit`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(r => {
                    toast.success(r.data);
                    if (selectedCountry) fetchStates(selectedCountry.value);
                    setOpenModal(false);
                })
                .catch(e =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/states`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(r => {
                    toast.success(r.data);
                    if (selectedCountry) fetchStates(selectedCountry.value);
                    setOpenModal(false);
                })
                .catch(e =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };

    const modal = () => (
        <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit State" : "Add State"}
                        </p>
                        <button
                            className="modal-close-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>
                    <div className="modal-body">
                        <label className="projectform-select d-block">
                            Country <span className="text-danger">*</span>
                        </label>
                        <Select
                            options={countryOptions}
                            placeholder="Select Country"
                            className="mb-3"
                            classNamePrefix="select"
                            value={countryOptions.find(
                                o => o.value === state.countryId
                            )}
                            onChange={(opt) =>
                                setState(prev => ({
                                    ...prev,
                                    countryId: opt ? opt.value : "",
                                }))
                            }
                            isClearable
                            isDisabled={isEdit}
                        />
                        <label className="projectform d-block">
                            State Name <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter state name"
                            value={state.state}
                            onChange={(e) =>
                                setState(prev => ({
                                    ...prev,
                                    state: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!state.state.trim() || !state.countryId}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="container-fluid p-4 mt-3">
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">States</span>
                </div>
                {selectedCountry && (
                    <button className="btn action-button" onClick={handleAdd}>
                        <Plus size={16} />
                        <span className="ms-2">Add State</span>
                    </button>
                )}
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">States</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-6">
                        <label>Select Country</label>
                        <Select
                            options={countryOptions}
                            placeholder="Select Country"
                            classNamePrefix="select"
                            value={selectedCountry}
                            onChange={setSelectedCountry}
                            isClearable
                        />
                    </div>
                    <div className="col-lg-6">
                        <label>Search State</label>
                        <input
                            className="form-input w-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search in loaded states..."
                            disabled={!selectedCountry}
                        />
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredStates.length > 0 ? filteredStates.map((s, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            title="Edit"
                                            onClick={() => handleEdit(s)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {s.active ? (
                                            <Trash2
                                                size={18}
                                                title="Deactivate"
                                                onClick={() => handleDelete(s)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                title="Re-activate"
                                                onClick={() => handleReactivate(s)}
                                                style={{ cursor: "pointer" }}
                                                className="text-primary"
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{s.state}</span>
                                        <span
                                            className={
                                                s.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {s.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="d-flex justify-content-center text-muted p-4">
                            {selectedCountry ? "No states found." : "Please select a country to view states."}
                        </div>
                    )}
                </div>
                {openModal && modal()}
            </div>
        </div>
    );
}
export function Cities() {
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]); // For modal
    const [filterStates, setFilterStates] = useState([]); // For filter
    const [search, setSearch] = useState("");
    const [selectedCountryFilter, setSelectedCountryFilter] = useState(null);
    const [selectedStateFilter, setSelectedStateFilter] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [city, setCity] = useState({
        id: null,
        city: "",
        countryId: "",
        stateId: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");

    const fetchCountries = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/countries`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(r => {
                if (r.status === 200) {
                    const data = r.data || [];
                    setCountries(data);
                    if (data.length > 0 && !selectedCountryFilter) {
                        setSelectedCountryFilter({
                            value: data[0].id,
                            label: `${data[0].country} (${data[0].countryCode})`,
                        });
                    }
                }
            })
            .catch(() => toast.error("Failed to load countries"));
    };

    const fetchStatesByCountry = (countryId, isFilter = false) => {
        if (!countryId) {
            if (isFilter) setFilterStates([]);
            else setStates([]);
            return;
        }
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/states/${countryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(r => {
                const data = r.data || [];
                if (isFilter) {
                    setFilterStates(data);
                    if (data.length > 0) {
                        setSelectedStateFilter({
                            value: data[0].id,
                            label: data[0].state,
                        });
                    } else {
                        setSelectedStateFilter(null);
                    }
                }
                else setStates(data);
            })
            .catch(() => toast.error("Failed to load states"));
    };

    const fetchCities = (stateId) => {
        if (!stateId) {
            setCities([]);
            return;
        }
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/cities/byState/${stateId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(r => {
                if (r.status === 200) setCities(r.data || []);
            })
            .catch(() => toast.error("Failed to load cities"));
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    useEffect(() => {
        if (selectedCountryFilter) {
            fetchStatesByCountry(selectedCountryFilter.value, true);
            setSelectedStateFilter(null);
            setCities([]);
        } else {
            setFilterStates([]);
            setSelectedStateFilter(null);
            setCities([]);
        }
    }, [selectedCountryFilter]);

    useEffect(() => {
        if (selectedStateFilter) {
            fetchCities(selectedStateFilter.value);
        } else {
            setCities([]);
        }
    }, [selectedStateFilter]);

    const filteredCities = cities.filter(c =>
        c.city?.toLowerCase().includes(search.toLowerCase())
    );

    const countryOptions = countries.map(c => ({
        value: c.id,
        label: `${c.country} (${c.countryCode})`,
    }));

    // States for modal
    const stateOptions = states.map(s => ({
        value: s.id,
        label: s.state,
    }));

    // States for filter
    const filterStateOptions = filterStates.map(s => ({
        value: s.id,
        label: s.state,
    }));

    const handleAdd = () => {
        setIsEdit(false);
        setCity({
            id: null,
            city: "",
            countryId: selectedCountryFilter ? selectedCountryFilter.value : "",
            stateId: selectedStateFilter ? selectedStateFilter.value : "",
            active: true,
        });
        // If reusing filter selection for modal initialization:
        if (selectedCountryFilter) {
            setStates(filterStates);
        } else {
            setStates([]);
        }
        setOpenModal(true);
    };

    const handleEdit = (c) => {
        setIsEdit(true);
        setCity({
            id: c.id,
            city: c.city,
            countryId: c.country.id,
            stateId: c.states ? c.states.id : "",
            active: c.active,
        });
        fetchStatesByCountry(c.country.id, false);
        setOpenModal(true);
    };

    const handleDelete = (c) => {
        axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/cities/edit`,
            {
                id: c.id,
                city: c.city,
                countryId: c.country.id,
                stateId: c.states ? c.states.id : "",
                active: false
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(r => {
                toast.success(r.data);
                if (selectedStateFilter) fetchCities(selectedStateFilter.value);
            })
            .catch(e =>
                toast.error(e?.response?.data || "Failed to deactivate city")
            );
    };
    const handleReactivate = (c) => {
        axios.put(
            `${import.meta.env.VITE_API_BASE_URL}/cities/edit`,
            {
                id: c.id,
                city: c.city,
                countryId: c.country.id,
                stateId: c.states ? c.states.id : "",
                active: true
            },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(r => {
                toast.success(r.data);
                if (selectedStateFilter) fetchCities(selectedStateFilter.value);
            })
            .catch(e =>
                toast.error(e?.response?.data || "Failed to reactivate city")
            );
    };

    const handleSave = () => {
        if (!city.city.trim() || !city.countryId) return;

        const payload = {
            id: city.id,
            city: city.city,
            active: city.active,
            countryId: city.countryId,
            stateId: city.stateId || ""
        };

        if (isEdit) {
            axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/cities/edit`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(r => {
                    toast.success(r.data);
                    if (selectedStateFilter) fetchCities(selectedStateFilter.value);
                    setOpenModal(false);
                })
                .catch(e =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/cities`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(r => {
                    toast.success(r.data);
                    if (selectedStateFilter) fetchCities(selectedStateFilter.value);
                    setOpenModal(false);
                })
                .catch(e =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };
    const modal = () => (
        <div
            className="modal fade show d-block"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit City" : "Add City"}
                        </p>
                        <button
                            className="modal-close-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>
                    <div className="modal-body">
                        <label className="projectform-select d-block">
                            Country <span className="text-danger">*</span>
                        </label>
                        <Select
                            options={countryOptions}
                            placeholder="Select Country"
                            className="mb-3"
                            classNamePrefix="select"
                            value={countryOptions.find(
                                o => o.value === city.countryId
                            )}
                            onChange={(opt) => {
                                setCity(prev => ({
                                    ...prev,
                                    countryId: opt ? opt.value : "",
                                    stateId: "",
                                }));
                                fetchStatesByCountry(opt?.value, false);
                            }}
                            isClearable
                            isDisabled={isEdit}
                        />
                        <label className="projectform-select d-block">
                            State (Optional)
                        </label>
                        <Select
                            options={stateOptions}
                            placeholder="Select State"
                            className="mb-3"
                            classNamePrefix="select"
                            value={stateOptions.find(
                                o => o.value === city.stateId
                            )}
                            onChange={(opt) =>
                                setCity(prev => ({
                                    ...prev,
                                    stateId: opt ? opt.value : "",
                                }))
                            }
                            isClearable
                            isDisabled={!city.countryId}
                        />
                        <label className="projectform d-block">
                            City Name <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter city name"
                            value={city.city}
                            onChange={(e) =>
                                setCity(prev => ({
                                    ...prev,
                                    city: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={!city.city.trim() || !city.countryId}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    return (
        <div className="container-fluid p-4 mt-3">
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Cities</span>
                </div>
                {selectedStateFilter && (
                    <button className="btn action-button" onClick={handleAdd}>
                        <Plus size={16} />
                        <span className="ms-2">Add City</span>
                    </button>
                )}
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Cities</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-4">
                        <label>Select Country</label>
                        <Select
                            options={countryOptions}
                            placeholder="Select Country"
                            classNamePrefix="select"
                            value={selectedCountryFilter}
                            onChange={setSelectedCountryFilter}
                            isClearable
                        />
                    </div>
                    <div className="col-lg-4">
                        <label>Select State</label>
                        <Select
                            options={filterStateOptions}
                            placeholder="Select State"
                            classNamePrefix="select"
                            value={selectedStateFilter}
                            onChange={setSelectedStateFilter}
                            isClearable
                            isDisabled={!selectedCountryFilter}
                        />
                    </div>
                    <div className="col-lg-4">
                        <label>Search City</label>
                        <input
                            className="form-input w-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search in loaded cities..."
                            disabled={!selectedStateFilter}
                        />
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredCities.length > 0 ? filteredCities.map((c, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(c)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {c.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(c)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(c)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{c.city}</span>
                                        <span
                                            className={
                                                c.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {c.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="d-flex justify-content-center text-muted p-4">
                            {selectedStateFilter ? "No cities found." : "Please select Country and State to view cities."}
                        </div>
                    )}
                </div>
                {openModal && modal()}
            </div>
        </div>
    );
}