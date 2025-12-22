import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import Select from 'react-select'
export function EntityType() {
    const [entityTypes, setEntityTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [entityType, setEntityType] = useState({
        id: null,
        entityType: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchEntityTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/entityType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setEntityTypes(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load entity types"));
    };
    useEffect(() => {
        fetchEntityTypes();
    }, []);
    const filteredEntityTypes = entityTypes.filter((e) =>
        e.entityType?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setEntityType({
            id: null,
            entityType: "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (e) => {
        setIsEdit(true);
        setEntityType({ ...e });
        setOpenModal(true);
    };
    const handleDelete = (e) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/entityType/edit`,
                { ...e, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchEntityTypes();
            })
            .catch((err) =>
                toast.error(
                    err?.response?.data || "Failed to deactivate entity type"
                )
            );
    };
    const handleReactivate = (e) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/entityType/edit`,
                { ...e, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchEntityTypes();
            })
            .catch((err) =>
                toast.error(
                    err?.response?.data || "Failed to reactivate entity type"
                )
            );
    };
    const handleSave = () => {
        if (!entityType.entityType.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/entityType/edit`,
                    entityType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchEntityTypes();
                    setOpenModal(false);
                })
                .catch((err) =>
                    toast.error(err?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/entityType`,
                    entityType,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchEntityTypes();
                    setOpenModal(false);
                })
                .catch((err) =>
                    toast.error(err?.response?.data || "Save failed")
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
                            {isEdit ? "Edit Entity Type" : "Add Entity Type"}
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
                            Entity Type <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter entity type"
                            value={entityType.entityType}
                            onChange={(e) =>
                                setEntityType((prev) => ({
                                    ...prev,
                                    entityType: e.target.value,
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
                            disabled={!entityType.entityType.trim()}
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
                    <span className="ms-2">Entity Type</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Entity Type</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Entity Types</span>
                </div>
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
                        {filteredEntityTypes.length} of {entityTypes.length} Entity Types
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredEntityTypes.map((e, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(e)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {e.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(e)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(e)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{e.entityType}</span>
                                        <span
                                            className={
                                                e.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {e.active ? "Active" : "Inactive"}
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
export function ContractorGrade() {
    const [grades, setGrades] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [grade, setGrade] = useState({
        id: null,
        grade: "",
        active: true,
    });

    const token = sessionStorage.getItem("token");

    /* 🔹 Fetch */
    const fetchGrades = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/contractorGrade`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setGrades(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load contractor grades"));
    };

    useEffect(() => {
        fetchGrades();
    }, []);

    /* 🔍 Search */
    const filteredGrades = grades.filter((g) =>
        g.grade?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setGrade({
            id: null,
            grade: "",
            active: true,
        });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (g) => {
        setIsEdit(true);
        setGrade({ ...g });
        setOpenModal(true);
    };

    /* 🗑️ Deactivate */
    const handleDelete = (g) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/contractorGrade/edit`,
                { ...g, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchGrades();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate grade"
                )
            );
    };

    /* 🔄 Reactivate */
    const handleReactivate = (g) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/contractorGrade/edit`,
                { ...g, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchGrades();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate grade"
                )
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!grade.grade.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/contractorGrade/edit`,
                    grade,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchGrades();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/contractorGrade`,
                    grade,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data);
                    fetchGrades();
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
                            {isEdit ? "Edit Contractor Grade" : "Add Contractor Grade"}
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
                            Grade <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter contractor grade"
                            value={grade.grade}
                            onChange={(e) =>
                                setGrade((prev) => ({
                                    ...prev,
                                    grade: e.target.value,
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
                            disabled={!grade.grade.trim()}
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
                    <span className="ms-2">Contractor Grade</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Contractor Grade</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Contractor Grades</span>
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
                        {filteredGrades.length} of {grades.length} Grades
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredGrades.map((g, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(g)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {g.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(g)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(g)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{g.grade}</span>
                                        <span
                                            className={
                                                g.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {g.active ? "Active" : "Inactive"}
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
export function NatureOfBusiness() {
    const [natures, setNatures] = useState([]);
    const [entityTypes, setEntityTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [nature, setNature] = useState({
        id: null,
        natureOfBusiness: "",
        entityTypeId: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchNatures = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/natureOfBusiness`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) setNatures(r.data || []);
            })
            .catch(() => toast.error("Failed to load Nature of Business"));
    };
    const fetchEntityTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/entityType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) setEntityTypes(r.data || []);
            })
            .catch(() => toast.error("Failed to load Entity Types"));
    };
    useEffect(() => {
        fetchNatures();
        fetchEntityTypes();
    }, []);
    const filteredNatures = natures.filter((n) =>
        n.natureOfBusiness?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setNature({
            id: null,
            natureOfBusiness: "",
            entityTypeId: "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (n) => {
        setIsEdit(true);
        setNature({
            id: n.id,
            natureOfBusiness: n.natureOfBusiness,
            entityTypeId: n.entityType.id,
            active: n.active,
        });
        setOpenModal(true);
    };
    const handleDelete = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/natureOfBusiness/edit`,
                { ...n, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchNatures();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate"
                )
            );
    };
    const handleReactivate = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/natureOfBusiness/edit`,
                { ...n, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data);
                fetchNatures();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate"
                )
            );
    };
    const handleSave = () => {
        if (!nature.natureOfBusiness.trim() || !nature.entityTypeId) return;
        const payload = {
            id: nature.id,
            natureOfBusiness: nature.natureOfBusiness,
            active: nature.active,
            entityType: { id: nature.entityTypeId },
        };
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/natureOfBusiness/edit`,
                    payload,
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
                    `${import.meta.env.VITE_API_BASE_URL}/natureOfBusiness`,
                    payload,
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
                            {isEdit ? "Edit Nature of Business" : "Add Nature of Business"}
                        </p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>
                            <X />
                        </button>
                    </div>

                    <div className="modal-body">
                        <label className="projectform-select d-block">
                            Entity Type <span className="text-danger">*</span>
                        </label>
                        <select
                            className="form-input w-100 mb-3"
                            value={nature.entityTypeId}
                            onChange={(e) =>
                                setNature((p) => ({
                                    ...p,
                                    entityTypeId: e.target.value,
                                }))
                            }
                        >
                            <option value="">Select Entity Type</option>
                            {entityTypes.map((e) => (
                                <option key={e.id} value={e.id}>
                                    {e.entityType}
                                </option>
                            ))}
                        </select>
                        <label className="projectform d-block">
                            Nature of Business <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter nature of business"
                            value={nature.natureOfBusiness}
                            onChange={(e) =>
                                setNature((p) => ({
                                    ...p,
                                    natureOfBusiness: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>
                            Cancel
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={
                                !nature.natureOfBusiness.trim() ||
                                !nature.entityTypeId
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
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Nature of Business</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Nature of Business</span>
                </button>
            </div>
            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info">
                    <span className="ms-2">Nature of Business</span>
                </div>
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
                                                onClick={() => handleReactivate(n)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{n.natureOfBusiness}</span>
                                        <span className={n.active ? "text-success" : "text-muted"}>
                                            {n.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    <div className="text-muted small">
                                        {n.entityType?.entityType}
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