import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";

export function CompanyType() {
    const [companyTypes, setCompanyTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [companyType, setCompanyType] = useState({
        id: null,
        type: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchCompanyTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/companyType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    const normalized = (r.data || []).map(c => ({
                        ...c,
                        active: c.active
                    }));
                    setCompanyTypes(normalized);
                }
            })
            .catch(() => toast.error("Failed to load company types"));
    };

    useEffect(() => {
        fetchCompanyTypes();
    }, []);
    const filteredCompanyTypes = companyTypes.filter((c) =>
        c.type?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setCompanyType({ id: null, type: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (c) => {
        setIsEdit(true);
        setCompanyType({ ...c });
        setOpenModal(true);
    };
    const handleDelete = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyType/edit`,
                {
                    id: c.id,
                    type: c.type,
                    active: false   // 🔥 backend field
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyTypes();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to deactivate company type")
            );
    };

    const handleReactivate = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyType/edit`,
                {
                    id: c.id,
                    type: c.type,
                    active: true
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyTypes();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to reactivate company type")
            );
    };
    const handleSave = () => {
        if (!companyType.type.trim()) return;
        const payload = {
            id: companyType.id,
            type: companyType.type,
            active: companyType.active
        };
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/companyType/edit`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/companyType/add`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyTypes();
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
                            {isEdit ? "Edit Company Type" : "Add Company Type"}
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
                            Company Type <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter company type"
                            value={companyType.type}
                            onChange={(e) =>
                                setCompanyType((prev) => ({
                                    ...prev,
                                    type: e.target.value,
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
                            disabled={!companyType.type.trim()}
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
                    <span className="ms-2">Company Type</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Company Type</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Types</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Company Type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCompanyTypes.length} of {companyTypes.length} Company Types
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredCompanyTypes.map((c, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            title="Edit"
                                            onClick={() => handleEdit(c)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {c.active ? (
                                            <Trash2
                                                size={18}
                                                title="Deactivate"
                                                onClick={() => handleDelete(c)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                title="Re-activate"
                                                onClick={() => handleReactivate(c)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{c.type}</span>
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
export function CompanyStatus() {
    const [companyStatuses, setCompanyStatuses] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [companyStatus, setCompanyStatus] = useState({
        id: null,
        comStatus: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");

    const fetchCompanyStatuses = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/companyStatus`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCompanyStatuses(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load company statuses"));
    };

    useEffect(() => {
        fetchCompanyStatuses();
    }, []);

    /* 🔍 Search */
    const filteredCompanyStatuses = companyStatuses.filter((s) =>
        s.comStatus?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setCompanyStatus({ id: null, comStatus: "", active: true });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (s) => {
        setIsEdit(true);
        setCompanyStatus({ ...s });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (s) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyStatus/edit`,
                { ...s, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyStatuses();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to deactivate company status")
            );
    };

    /* 🔄 Reactivate */
    const handleReactivate = (s) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyStatus/edit`,
                { ...s, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyStatuses();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to reactivate company status")
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!companyStatus.comStatus.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/companyStatus/edit`,
                    companyStatus,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyStatuses();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/companyStatus/add`,
                    companyStatus,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyStatuses();
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
                            {isEdit ? "Edit Company Status" : "Add Company Status"}
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
                            Company Status <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter company status"
                            value={companyStatus.comStatus}
                            onChange={(e) =>
                                setCompanyStatus((prev) => ({
                                    ...prev,
                                    comStatus: e.target.value,
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
                            disabled={!companyStatus.comStatus.trim()}
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
                    <span className="ms-2">Company Status</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Company Status</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Status</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Company Status"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCompanyStatuses.length} of {companyStatuses.length} Statuses
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredCompanyStatuses.map((s, i) => (
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
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{s.comStatus}</span>
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
                    ))}
                </div>

                {openModal && modal()}
            </div>
        </div>
    );
}
export function CompanyLevel() {
    const [companyLevels, setCompanyLevels] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [companyLevel, setCompanyLevel] = useState({
        id: null,
        level: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchCompanyLevels = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/companyLevel`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCompanyLevels(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load company levels"));
    };
    useEffect(() => {
        fetchCompanyLevels();
    }, []);
    const filteredCompanyLevels = companyLevels.filter((l) =>
        l.level?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setCompanyLevel({ id: null, level: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (l) => {
        setIsEdit(true);
        setCompanyLevel({ ...l });
        setOpenModal(true);
    };
    const handleDelete = (l) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyLevel/edit`,
                { ...l, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyLevels();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to deactivate company level")
            );
    };
    const handleReactivate = (l) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyLevel/edit`,
                { ...l, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyLevels();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to reactivate company level")
            );
    };
    const handleSave = () => {
        if (!companyLevel.level.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/companyLevel/edit`,
                    companyLevel,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyLevels();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/companyLevel/add`,
                    companyLevel,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyLevels();
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
                            {isEdit ? "Edit Company Level" : "Add Company Level"}
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
                            Company Level <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter company level"
                            value={companyLevel.level}
                            onChange={(e) =>
                                setCompanyLevel((prev) => ({
                                    ...prev,
                                    level: e.target.value,
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
                            disabled={!companyLevel.level.trim()}
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
                    <span className="ms-2">Company Level</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Company Level</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Levels</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Company Level"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCompanyLevels.length} of {companyLevels.length} Company Levels
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredCompanyLevels.map((l, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            title="Edit"
                                            onClick={() => handleEdit(l)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {l.active ? (
                                            <Trash2
                                                size={18}
                                                title="Deactivate"
                                                onClick={() => handleDelete(l)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                title="Re-activate"
                                                onClick={() => handleReactivate(l)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{l.level}</span>
                                        <span
                                            className={
                                                l.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {l.active ? "Active" : "Inactive"}
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
export function CompanyConstitution() {
    const [companyConstitutions, setCompanyConstitutions] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [companyConstitution, setCompanyConstitution] = useState({
        id: null,
        comConstitution: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");

    /* 🔹 Fetch */
    const fetchCompanyConstitutions = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/companyConstitution`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCompanyConstitutions(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load company constitutions"));
    };

    useEffect(() => {
        fetchCompanyConstitutions();
    }, []);

    /* 🔍 Search */
    const filteredCompanyConstitutions = companyConstitutions.filter((c) =>
        c.comConstitution?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setCompanyConstitution({
            id: null,
            comConstitution: "",
            active: true,
        });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (c) => {
        setIsEdit(true);
        setCompanyConstitution({ ...c });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyConstitution/edit`,
                { ...c, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyConstitutions();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data ||
                    "Failed to deactivate company constitution"
                )
            );
    };

    /* 🔄 Reactivate */
    const handleReactivate = (c) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyConstitution/edit`,
                { ...c, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyConstitutions();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data ||
                    "Failed to reactivate company constitution"
                )
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!companyConstitution.comConstitution.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/companyConstitution/edit`,
                    companyConstitution,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyConstitutions();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/companyConstitution/add`,
                    companyConstitution,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyConstitutions();
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
                            {isEdit
                                ? "Edit Company Constitution"
                                : "Add Company Constitution"}
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
                            Company Constitution{" "}
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter company constitution"
                            value={companyConstitution.comConstitution}
                            onChange={(e) =>
                                setCompanyConstitution((prev) => ({
                                    ...prev,
                                    comConstitution: e.target.value,
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
                                !companyConstitution.comConstitution.trim()
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
                    <span className="ms-2">Company Constitution</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Company Constitution</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Constitutions</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Company Constitution"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCompanyConstitutions.length} of{" "}
                        {companyConstitutions.length} Constitutions
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredCompanyConstitutions.map((c, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            title="Edit"
                                            onClick={() => handleEdit(c)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {c.active ? (
                                            <Trash2
                                                size={18}
                                                title="Deactivate"
                                                onClick={() => handleDelete(c)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                title="Re-activate"
                                                onClick={() =>
                                                    handleReactivate(c)
                                                }
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{c.comConstitution}</span>
                                        <span
                                            className={
                                                c.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {c.active
                                                ? "Active"
                                                : "Inactive"}
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
export function CompanyNature() {
    const [companyNatures, setCompanyNatures] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [companyNature, setCompanyNature] = useState({
        id: null,
        comNature: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchCompanyNatures = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/companyNature`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCompanyNatures(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load company natures"));
    };

    useEffect(() => {
        fetchCompanyNatures();
    }, []);
    const filteredCompanyNatures = companyNatures.filter((n) =>
        n.comNature?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setCompanyNature({
            id: null,
            comNature: "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (n) => {
        setIsEdit(true);
        setCompanyNature({ ...n });
        setOpenModal(true);
    };
    const handleDelete = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyNature/edit`,
                { ...n, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyNatures();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate company nature"
                )
            );
    };
    const handleReactivate = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/companyNature/edit`,
                { ...n, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchCompanyNatures();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate company nature"
                )
            );
    };
    const handleSave = () => {
        if (!companyNature.comNature.trim()) return;
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/companyNature/edit`,
                    companyNature,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyNatures();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/companyNature/add`,
                    companyNature,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchCompanyNatures();
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
                            {isEdit
                                ? "Edit Company Nature"
                                : "Add Company Nature"}
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
                            Company Nature{" "}
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter company nature"
                            value={companyNature.comNature}
                            onChange={(e) =>
                                setCompanyNature((prev) => ({
                                    ...prev,
                                    comNature: e.target.value,
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
                            disabled={!companyNature.comNature.trim()}
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
                    <span className="ms-2">Company Nature</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Company Nature</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Natures</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Company Nature"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredCompanyNatures.length} of{" "}
                        {companyNatures.length} Natures
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredCompanyNatures.map((n, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            title="Edit"
                                            onClick={() => handleEdit(n)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {n.active ? (
                                            <Trash2
                                                size={18}
                                                title="Deactivate"
                                                onClick={() => handleDelete(n)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                title="Re-activate"
                                                onClick={() =>
                                                    handleReactivate(n)
                                                }
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{n.comNature}</span>
                                        <span
                                            className={
                                                n.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {n.active
                                                ? "Active"
                                                : "Inactive"}
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
export function CompanyNatureOfBusiness() {
    const [natures, setNatures] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [nature, setNature] = useState({
        id: null,
        businessNature: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchNatures = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/businessNature`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setNatures(r.data || []);
                }
            })
            .catch(() =>
                toast.error("Failed to load company nature of business")
            );
    };
    useEffect(() => {
        fetchNatures();
    }, []);
    const filteredNatures = natures.filter((n) =>
        n.businessNature?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setNature({
            id: null,
            businessNature: "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (n) => {
        setIsEdit(true);
        setNature({ ...n });
        setOpenModal(true);
    };
    const handleDelete = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/businessNature/edit`,
                { ...n, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchNatures();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data ||
                    "Failed to deactivate nature of business"
                )
            );
    };
    const handleReactivate = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/businessNature/edit`,
                { ...n, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchNatures();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data ||
                    "Failed to reactivate nature of business"
                )
            );
    };
    const handleSave = () => {
        if (!nature.businessNature.trim()) return;
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/businessNature/edit`,
                    nature,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchNatures();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/businessNature/add`,
                    nature,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchNatures();
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
                            {isEdit
                                ? "Edit Nature of Business"
                                : "Add Nature of Business"}
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
                            Nature of Business{" "}
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter nature of business"
                            value={nature.businessNature}
                            onChange={(e) =>
                                setNature((prev) => ({
                                    ...prev,
                                    businessNature: e.target.value,
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
                            disabled={!nature.businessNature.trim()}
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
                    <span className="ms-2">Company Nature of Business</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Nature of Business</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Nature of Business</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Nature of Business"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredNatures.length} of {natures.length} Records
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredNatures.map((n, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(n)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {n.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(n)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() =>
                                                    handleReactivate(n)
                                                }
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{n.businessNature}</span>
                                        <span
                                            className={
                                                n.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {n.active
                                                ? "Active"
                                                : "Inactive"}
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
export function CompanyLanguage() {
    const [languages, setLanguages] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [language, setLanguage] = useState({
        id: null,
        language: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");

    /* 🔹 Fetch */
    const fetchLanguages = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/language`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setLanguages(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load languages"));
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    /* 🔍 Search */
    const filteredLanguages = languages.filter(
        (l) =>
            l.language?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setLanguage({
            id: null,
            language: "",
            active: true,
        });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (l) => {
        setIsEdit(true);
        setLanguage({ ...l });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (l) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/language/edit`,
                { ...l, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchLanguages();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate language"
                )
            );
    };

    /* 🔄 Reactivate */
    const handleReactivate = (l) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/language/edit`,
                { ...l, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchLanguages();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate language"
                )
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!language.language.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/language/edit`,
                    language,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchLanguages();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/language/add`,
                    language,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchLanguages();
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
                            {isEdit ? "Edit Language" : "Add Language"}
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
                            Language <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100 mb-3"
                            placeholder="Enter language"
                            value={language.language}
                            onChange={(e) =>
                                setLanguage((prev) => ({
                                    ...prev,
                                    language: e.target.value,
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
                                !language.language.trim()
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
                    <span className="ms-2">Company Language</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Language</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Company Languages</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search the languages"
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredLanguages.length} of {languages.length} Languages
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredLanguages.map((l, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(l)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {l.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(l)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() =>
                                                    handleReactivate(l)
                                                }
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>
                                            {l.language}
                                        </span>
                                        <span
                                            className={
                                                l.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {l.active
                                                ? "Active"
                                                : "Inactive"}
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