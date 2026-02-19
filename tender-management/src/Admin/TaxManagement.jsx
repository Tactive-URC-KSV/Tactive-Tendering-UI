import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

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

    const [currency, setCurrency] = useState({
        id: null,
        currencyName: "",
        currencyCode: "",
        symbol: "",
        active: true,
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

    useEffect(() => {
        fetchCurrencies();
    }, []);

    /* 🔍 Search */
    const filteredCurrencies = currencies.filter(
        (c) =>
            c.currencyName?.toLowerCase().includes(search.toLowerCase()) ||
            c.symbol?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
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

    /* ✏️ Edit */
    const handleEdit = (c) => {
        setIsEdit(true);
        setCurrency({ ...c });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (c) => {
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

    /* 🔄 Reactivate */
    const handleReactivate = (c) => {
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

    /* 💾 Save */
    const handleSave = () => {
        if (!currency.currencyName.trim() || !currency.symbol.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/currency/edit`,
                    currency,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCurrencies();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/currency/add`,
                    currency,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCurrencies();
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
                            {isEdit ? "Edit Currency" : "Add Currency"}
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
                            Currency Name <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100 mb-3"
                            placeholder="Enter currency name"
                            value={currency.currencyName}
                            onChange={(e) =>
                                setCurrency((prev) => ({
                                    ...prev,
                                    currencyName: e.target.value,
                                }))
                            }
                        />
                        <label className="projectform d-block">
                            Currency Code
                        </label>
                        <input
                            className="form-input w-100 mb-3"
                            placeholder="Enter currency Code"
                            value={currency.currencyCode}
                            onChange={(e) =>
                                setCurrency((prev) => ({
                                    ...prev,
                                    currencyCode: e.target.value,
                                }))
                            }
                        />
                        <label className="projectform d-block">
                            Symbol <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter symbol (₹, $, €)"
                            value={currency.symbol}
                            onChange={(e) =>
                                setCurrency((prev) => ({
                                    ...prev,
                                    symbol: e.target.value,
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
                            disabled={
                                !currency.currencyName.trim() ||
                                !currency.symbol.trim()
                            }
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
                    <span className="ms-2">Currency</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Currency</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Currencies</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Currency"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCurrencies.length} of {currencies.length} Currencies
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredCurrencies.map((c, i) => (
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
                                        <span>
                                            {c.currencyName} ({c.symbol}) ({c.currencyCode})
                                        </span>
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
                    ))}
                </div>

                {openModal && modal()}
            </div>
        </div>
    );
}