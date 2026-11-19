import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw, Eye, Calendar, Save } from "lucide-react";
import { toast } from "react-toastify";
import Select from 'react-select';

export function TaxType() {
    const [taxTypes, setTaxTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [taxType, setTaxType] = useState({
        id: null,
        taxType: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");
    const fetchTaxTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/taxType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setTaxTypes(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load tax types"));
    };

    useEffect(() => {
        fetchTaxTypes();
    }, []);

    const filteredTaxTypes = taxTypes.filter((t) =>
        t.taxType?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setTaxType({
            id: null,
            taxType: "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (t) => {
        setIsEdit(true);
        setTaxType({ ...t });
        setOpenModal(true);
    };
    const handleDelete = (t) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/taxType/edit`,
                { ...t, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchTaxTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate tax type"
                )
            );
    };
    const handleReactivate = (t) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/taxType/edit`,
                { ...t, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchTaxTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate tax type"
                )
            );
    };
    const handleSave = () => {
        if (!taxType.taxType.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/taxType/edit`,
                    taxType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchTaxTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/taxType/add`,
                    taxType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchTaxTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
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
                            {isEdit ? "Edit Tax Type" : "Add Tax Type"}
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
                            Tax Type <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter tax type"
                            value={taxType.taxType}
                            onChange={(e) =>
                                setTaxType((prev) => ({
                                    ...prev,
                                    taxType: e.target.value,
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
                            disabled={!taxType.taxType.trim()}
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
                    <span className="ms-2">Tax Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Tax Type</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Tax Types</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Tax Type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredTaxTypes.length} of {taxTypes.length} Tax Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredTaxTypes.map((t, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(t)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {t.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(t)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(t)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{t.taxType}</span>
                                        <span
                                            className={
                                                t.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {t.active ? "Active" : "Inactive"}
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
export function TerritoryType() {
    const [territoryTypes, setTerritoryTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [territoryType, setTerritoryType] = useState({
        id: null,
        territoryType: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");

    /* 🔹 Fetch */
    const fetchTerritoryTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/territoryType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setTerritoryTypes(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load territory types"));
    };

    useEffect(() => {
        fetchTerritoryTypes();
    }, []);

    /* 🔍 Search */
    const filteredTerritoryTypes = territoryTypes.filter((t) =>
        t.territoryType?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setTerritoryType({
            id: null,
            territoryType: "",
            active: true,
        });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (t) => {
        setIsEdit(true);
        setTerritoryType({ ...t });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (t) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/territoryType/edit`,
                { ...t, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchTerritoryTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate territory type"
                )
            );
    };

    /* 🔄 Reactivate */
    const handleReactivate = (t) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/territoryType/edit`,
                { ...t, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchTerritoryTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate territory type"
                )
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!territoryType.territoryType.trim()) return;
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/territoryType/edit`,
                    territoryType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchTerritoryTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/territoryType/add`,
                    territoryType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchTerritoryTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };

    /* 🪟 Modal */
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
                            {isEdit ? "Edit Territory Type" : "Add Territory Type"}
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
                            Territory Type <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter territory type"
                            value={territoryType.territoryType}
                            onChange={(e) =>
                                setTerritoryType((prev) => ({
                                    ...prev,
                                    territoryType: e.target.value,
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
                            disabled={!territoryType.territoryType.trim()}
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
                    <span className="ms-2">Territory Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Territory Type</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Territory Types</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Territory Type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredTerritoryTypes.length} of {territoryTypes.length} Territory Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredTerritoryTypes.map((t, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(t)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {t.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(t)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(t)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{t.territoryType}</span>
                                        <span
                                            className={
                                                t.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {t.active ? "Active" : "Inactive"}
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
export function IdentityType() {
    const [identityTypes, setIdentityTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [identityType, setIdentityType] = useState({
        id: null,
        idType: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");

    /* 🔹 Fetch */
    const fetchIdentityTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/identityType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setIdentityTypes(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load identity types"));
    };

    useEffect(() => {
        fetchIdentityTypes();
    }, []);

    /* 🔍 Search */
    const filteredIdentityTypes = identityTypes.filter((i) =>
        i.idType?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setIdentityType({
            id: null,
            idType: "",
            active: true,
        });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (i) => {
        setIsEdit(true);
        setIdentityType({ ...i });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (i) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/identityType/edit`,
                { ...i, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchIdentityTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate identity type"
                )
            );
    };

    /* 🔄 Reactivate */
    const handleReactivate = (i) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/identityType/edit`,
                { ...i, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchIdentityTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate identity type"
                )
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!identityType.idType.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/identityType/edit`,
                    identityType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchIdentityTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/identityType/add`,
                    identityType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchIdentityTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };

    /* 🪟 Modal */
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
                            {isEdit ? "Edit Identity Type" : "Add Identity Type"}
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
                            Identity Type <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter identity type"
                            value={identityType.idType}
                            onChange={(e) =>
                                setIdentityType((prev) => ({
                                    ...prev,
                                    idType: e.target.value,
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
                            disabled={!identityType.idType.trim()}
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
                    <span className="ms-2">Identity Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Identity Type</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Identity Types</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Identity Type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredIdentityTypes.length} of {identityTypes.length} Identity Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredIdentityTypes.map((i, idx) => (
                        <div className="col-lg-4 mb-3" key={idx}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(i)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {i.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(i)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(i)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{i.idType}</span>
                                        <span
                                            className={
                                                i.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {i.active ? "Active" : "Inactive"}
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

export function Currency() {
    const [currencies, setCurrencies] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [openConversionModal, setOpenConversionModal] = useState(false);
    const [selectedBaseCurrency, setSelectedBaseCurrency] = useState(null);
    const [conversionRates, setConversionRates] = useState([]);
    const [conversionLoading, setConversionLoading] = useState(false);
    const [openAddConversionModal, setOpenAddConversionModal] = useState(false);

    const [currency, setCurrency] = useState({
        id: null,
        currencyName: "",
        currencyCode: "",
        symbol: "",
        active: true,
    });

    // New Conversion Rate form state
    const [newConversion, setNewConversion] = useState({
        conversionCurrencyId: "",
        rate: "",
        effectiveDate: new Date().toISOString().split('T')[0]
    });

    const token = sessionStorage.getItem("token");

    const fetchCurrencies = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/project/currency`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCurrencies(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load currencies"));
    };

    const fetchConversions = (baseId) => {
        setConversionLoading(true);
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/currency-conversion/base`, {
                params: { baseCurrencyId: baseId },
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                setConversionRates(r.data || []);
            })
            .catch(() => toast.error("Failed to load conversion rates"))
            .finally(() => setConversionLoading(false));
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const filteredCurrencies = currencies.filter(
        (c) =>
            c.currencyName?.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol?.toLowerCase().includes(search.toLowerCase()) ||
            c.currencyCode?.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        setIsEdit(false);
        setCurrency({
            id: null,
            currencyName: "",
            currencyCode: "",
            symbol: "",
            active: true,
        });
        setOpenModal(true);
    };

    const handleEdit = (c) => {
        setIsEdit(true);
        setCurrency({ ...c });
        setOpenModal(true);
    };

    const handleViewConversion = (c) => {
        setSelectedBaseCurrency(c);
        fetchConversions(c.id);
        setOpenConversionModal(true);
    };

    const handleSaveCurrency = () => {
        if (!currency.currencyName.trim() || !currency.symbol.trim()) return;

        const url = isEdit
            ? `${import.meta.env.VITE_API_BASE_URL}/currency/edit`
            : `${import.meta.env.VITE_API_BASE_URL}/currency/add`;

        const method = isEdit ? "put" : "post";

        axios[method](url, currency, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => {
                toast.success(r.data);
                fetchCurrencies();
                setOpenModal(false);
            })
            .catch((e) => toast.error(e?.response?.data || "Operation failed"));
    };

    const handleSaveConversion = () => {
        if (!newConversion.conversionCurrencyId || !newConversion.rate || !newConversion.effectiveDate) {
            toast.warn("Please fill all required fields");
            return;
        }

        const params = new URLSearchParams();
        params.append("baseCurrencyId", selectedBaseCurrency.id);
        params.append("conversionCurrencyId", newConversion.conversionCurrencyId);
        params.append("rate", newConversion.rate);
        params.append("effectiveDate", newConversion.effectiveDate);

        axios
            .post(`${import.meta.env.VITE_API_BASE_URL}/currency-conversion`, null, {
                params: params,
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                toast.success(r.data || "Conversion saved successfully");
                fetchConversions(selectedBaseCurrency.id);
                setNewConversion({
                    conversionCurrencyId: "",
                    rate: "",
                    effectiveDate: new Date().toISOString().split('T')[0]
                });
                setOpenAddConversionModal(false);
            })
            .catch((e) => toast.error(e?.response?.data || "Failed to save conversion"));
    };

    const handleDeleteCurrency = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/currency/edit`,
                { ...c, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCurrencies();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate currency"
                )
            );
    };

    const handleReactivateCurrency = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/currency/edit`,
                { ...c, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCurrencies();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate currency"
                )
            );
    };

    const currencyModal = () => (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setOpenModal(false)}>
            <div className="modal-dialog modal-md modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-3 border-0 shadow">
                    <div className="modal-header d-flex justify-content-between p-3" style={{ borderBottom: '1px solid #0051973D' }}>
                        <p className="fw-bold mb-0">{isEdit ? "Edit Currency" : "Add Currency"}</p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}><X /></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="projectform-select text-start d-block mb-1">Currency Name <span className="text-danger">*</span></label>
                            <input className="form-input w-100" placeholder="Enter currency name" value={currency.currencyName} onChange={(e) => setCurrency({ ...currency, currencyName: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="projectform-select text-start d-block mb-1">Currency Code</label>
                            <input className="form-input w-100" placeholder="Enter code (e.g. USD)" value={currency.currencyCode} onChange={(e) => setCurrency({ ...currency, currencyCode: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label className="projectform-select text-start d-block mb-1">Symbol <span className="text-danger">*</span></label>
                            <input className="form-input w-100" placeholder="Enter symbol (₹, $, €)" value={currency.symbol} onChange={(e) => setCurrency({ ...currency, symbol: e.target.value })} />
                        </div>
                    </div>
                    <div className="modal-footer p-3" style={{ borderTop: '1px solid #0051973D' }}>
                        <button className="btn btn-secondary px-4 me-2" onClick={() => setOpenModal(false)}>Cancel</button>
                        <button className="btn btn-primary px-4" onClick={handleSaveCurrency} disabled={!currency.currencyName.trim() || !currency.symbol.trim()}>
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const addConversionModal = () => (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1060 }} onClick={() => setOpenAddConversionModal(false)}>
            <div className="modal-dialog modal-md modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-3 border-0 shadow">
                    <div className="modal-header d-flex justify-content-between p-3" style={{ borderBottom: '1px solid #0051973D' }}>
                        <p className="fw-bold mb-0">Add Conversion Rate</p>
                        <button className="modal-close-btn" onClick={() => setOpenAddConversionModal(false)}><X /></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="mb-3">
                            <label className="projectform-select text-start d-block mb-1">Conversion Currency <span className="text-danger">*</span></label>
                            <Select
                                options={currencies
                                    .filter(c => c.id !== selectedBaseCurrency?.id && c.active)
                                    .map(c => ({ value: c.id, label: `${c.currencyName} (${c.symbol})` }))}
                                value={
                                    newConversion.conversionCurrencyId
                                        ? currencies
                                            .filter(c => c.id !== selectedBaseCurrency?.id && c.active)
                                            .map(c => ({ value: c.id, label: `${c.currencyName} (${c.symbol})` }))
                                            .find(opt => opt.value === newConversion.conversionCurrencyId) || null
                                        : null
                                }
                                onChange={(selected) => setNewConversion({...newConversion, conversionCurrencyId: selected ? selected.value : ""})}
                                placeholder="Select Currency"
                                classNamePrefix={"select"}
                                isClearable
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="projectform-select text-start d-block mb-1">Conversion Rate <span className="text-danger">*</span></label>
                            <input 
                                type="number" 
                                className="form-input w-100" 
                                placeholder="Enter rate"
                                value={newConversion.rate}
                                onChange={(e) => setNewConversion({...newConversion, rate: e.target.value})}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="projectform-select text-start d-block mb-1">Effective Date <span className="text-danger">*</span></label>
                            <input 
                                type="date" 
                                className="form-input w-100"
                                value={newConversion.effectiveDate}
                                min={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Restricted to 30 days
                                onChange={(e) => setNewConversion({...newConversion, effectiveDate: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="modal-footer p-3" style={{ borderTop: '1px solid #0051973D' }}>
                        <button className="btn btn-secondary px-4 me-2" onClick={() => setOpenAddConversionModal(false)}>Cancel</button>
                        <button className="btn btn-primary px-4" onClick={handleSaveConversion} disabled={!newConversion.conversionCurrencyId || !newConversion.rate}>
                            Save Rate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const conversionModal = () => (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setOpenConversionModal(false)}>
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-3 border-0 shadow">
                    <div className="modal-header d-flex justify-content-between p-3" style={{ backgroundColor: '#005197', color: 'white' }}>
                        <div>
                            <p className="fw-bold mb-0">Currency Conversion Management</p>
                            <small className="text-white-50">Base Currency: {selectedBaseCurrency?.currencyName} ({selectedBaseCurrency?.symbol})</small>
                        </div>
                        <button className="modal-close-btn text-white" onClick={() => setOpenConversionModal(false)}><X /></button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold mb-0">Conversion History</h6>
                            <button className="btn btn-primary btn-sm d-flex align-items-center gap-2" onClick={() => setOpenAddConversionModal(true)}>
                                <Plus size={16} /> Add New Rate
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="table align-middle table-hover">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="small fw-bold">Converted To</th>
                                        <th className="small fw-bold">Rate</th>
                                        <th className="small fw-bold">Effective Date</th>
                                        <th className="small fw-bold text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {conversionLoading ? (
                                        <tr><td colSpan="4" className="text-center py-4">Loading rates...</td></tr>
                                    ) : conversionRates.length > 0 ? (
                                        conversionRates.map((cr, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-medium">{cr.conversionCurrency?.currencyName}</span>
                                                        <small className="text-muted">{cr.conversionCurrency?.currencyCode}</small>
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-primary">{cr.conversionRate}</td>
                                                <td>{new Date(cr.effectiveDate).toLocaleDateString()}</td>
                                                <td className="text-center"><span className="badge bg-success-subtle text-success">Latest</span></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="text-center py-4 text-muted">No conversion rates found</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid p-4 mt-3">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => window.history.back()}>
                    <ArrowLeft size={20} className="me-2 text-primary" />
                    <span className="fs-5">Currency Management</span>
                </div>

                <button className="btn btn-primary px-4 d-flex align-items-center gap-2 shadow-sm" style={{ backgroundColor: '#005197' }} onClick={handleAdd}>
                    <Plus size={18} />
                    <span>Add New Currency</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5 shadow-sm" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info">
                    <span className="ms-2">Master Currencies</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by name, code or symbol"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCurrencies.length} of {currencies.length} Currencies
                    </div>
                </div>

                {/* Table */}
                <div className="row ms-1 me-1 mt-3">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-header-primary">
                                <tr>
                                    <th>S.No</th>
                                    <th>Currency Name</th>
                                    <th>Code</th>
                                    <th className="text-center">Symbol</th>
                                    <th className="text-center">Conversion</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCurrencies.length > 0 ? (
                                    filteredCurrencies.map((c, i) => (
                                        <tr key={c.id || i}>
                                            <td>{i + 1}</td>
                                            <td className="fw-bold">{c.currencyName}</td>
                                            <td><span className="badge bg-light text-dark">{c.currencyCode || 'N/A'}</span></td>
                                            <td className="text-center fs-5">{c.symbol}</td>
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm view-conversion-btn"
                                                    onClick={() => handleViewConversion(c)}
                                                >
                                                    <Eye size={16} className="me-1" /> View Conversion
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <Edit
                                                    size={18}
                                                    className="me-3 text-primary cursor-pointer"
                                                    onClick={() => handleEdit(c)}
                                                />
                                                {c.active ? (
                                                    <Trash2
                                                        size={18}
                                                        className="text-danger cursor-pointer"
                                                        onClick={() => handleDeleteCurrency(c)}
                                                    />
                                                ) : (
                                                    <RotateCcw
                                                        size={18}
                                                        onClick={() => handleReactivateCurrency(c)}
                                                        className="text-primary cursor-pointer"
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">No currencies found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {openModal && currencyModal()}
                {openConversionModal && conversionModal()}
                {openAddConversionModal && addConversionModal()}
            </div>
        </div>
    );
}