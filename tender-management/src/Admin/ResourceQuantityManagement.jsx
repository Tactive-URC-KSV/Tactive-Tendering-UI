import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';

export function ResourceNature() {
    const [resourceNature, setResourceNature] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [nature, setNature] = useState({
        id: null,
        nature: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const handleUnauthorized = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };
    const fetchResourceNature = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status === 200) setResourceNature(res.data || []);
            })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch resource natures");
            });
    }, [token]);

    useEffect(() => {
        fetchResourceNature();
    }, [fetchResourceNature]);
    const filteredList = resourceNature.filter((n) =>
        n.nature?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setNature({ id: null, nature: "", active: true });
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
                `${import.meta.env.VITE_API_BASE_URL}/resourceNature/edit`,
                { ...n, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Resource nature deactivated");
                fetchResourceNature();
            })
            .catch((e) => {
                if (e?.response?.status === 401) handleUnauthorized();
                else toast.error(e?.response?.data || "Deactivate failed");
            });
    };
    const handleReactivate = (n) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/resourceNature/edit`,
                { ...n, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Resource nature reactivated");
                fetchResourceNature();
            })
            .catch((e) => {
                toast.error(e?.response?.data || "Reactivation failed");
            });
    };
    const handleSave = () => {
        if (!nature.nature.trim()) return;

        const apiCall = isEdit
            ? axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/resourceNature/edit`,
                nature,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            : axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/resourceNature/add`,
                nature,
                { headers: { Authorization: `Bearer ${token}` } }
            );

        apiCall
            .then((res) => {
                toast.success(res.data || "Resource nature saved");
                setOpenModal(false);
                fetchResourceNature();
            })
            .catch((e) => {
                if (e?.response?.status === 401) handleUnauthorized();
                else toast.error(e?.response?.data || "Save failed");
            });
    };
    const modalForm = () => (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                            Nature Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter nature name"
                            value={nature.nature}
                            onChange={(e) =>
                                setNature((p) => ({
                                    ...p,
                                    nature: e.target.value,
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
                            disabled={!nature.nature.trim()}
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
                    <span className="ms-2">Resource Nature</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Resource Nature</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info">
                    <span className="ms-2">Resource Natures</span>
                </div>

                {/* Search */}
                <div className="row mt-3 p-4">
                    <div className="col-md-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                        {filteredList.length} of {resourceNature.length}
                    </div>
                </div>

                <div className="row p-4">
                    {filteredList.map((n, i) => (
                        <div className="col-md-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleEdit(n)}
                                        />
                                        {n.active ? (
                                            <Trash2
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDelete(n)}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleReactivate(n)}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{n.nature}</span>
                                        <span
                                            className={
                                                n.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {n.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {openModal && modalForm()}
            </div>
        </div>
    );
}
export function ResourceType() {
    const navigate = useNavigate();
    const [resourceTypes, setResourceTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [resourceType, setResourceType] = useState({
        id: null,
        resourceTypeName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const handleUnauthorized = () => {
        sessionStorage.clear();
        navigate("/login");
    };
    const fetchResourceTypes = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status === 200) setResourceTypes(res.data || []);
            })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch resource types");
            });
    }, [token, navigate]);
    useEffect(() => {
        fetchResourceTypes();
    }, [fetchResourceTypes]);
    const filteredResourceTypes = resourceTypes.filter((rt) =>
        rt.resourceTypeName?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setResourceType({ id: null, resourceTypeName: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (rt) => {
        setIsEdit(true);
        setResourceType({ ...rt });
        setOpenModal(true);
    };
    const handleDelete = (rt) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/resourceType/edit`,
                { ...rt, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Resource type deactivated");
                fetchResourceTypes();
            })
            .catch((e) => {
                if (e?.response?.status === 401) handleUnauthorized();
                else toast.error(e?.response?.data || "Deactivate failed");
            });
    };
    const handleReactivate = (rt) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/resourceType/edit`,
                { ...rt, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Resource type reactivated");
                fetchResourceTypes();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Reactivation failed")
            );
    };
    const handleSave = () => {
        if (!resourceType.resourceTypeName.trim()) return;

        const apiCall = isEdit
            ? axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/resourceType/edit`,
                resourceType,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            : axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/resourceType`,
                resourceType,
                { headers: { Authorization: `Bearer ${token}` } }
            );

        apiCall
            .then((res) => {
                toast.success(res.data || "Resource type saved");
                setOpenModal(false);
                fetchResourceTypes();
            })
            .catch((e) => {
                if (e?.response?.status === 401) handleUnauthorized();
                else toast.error(e?.response?.data || "Save failed");
            });
    };
    const resourceTypeForm = () => (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                            Resource Type Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter resource type"
                            value={resourceType.resourceTypeName}
                            onChange={(e) =>
                                setResourceType((p) => ({
                                    ...p,
                                    resourceTypeName: e.target.value,
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
                            disabled={!resourceType.resourceTypeName.trim()}
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
                    <span className="ms-2">Resource Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Resource Type</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info">
                    <span className="ms-2">Resource Types</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by resource type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredResourceTypes.length} of {resourceTypes.length} Resource Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredResourceTypes.map((rt, index) => (
                        <div className="col-lg-4 mb-3" key={index}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleEdit(rt)}
                                        />
                                        {rt.active ? (
                                            <Trash2
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDelete(rt)}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleReactivate(rt)}
                                            />
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <span>{rt.resourceTypeName}</span>
                                        <span
                                            className={
                                                rt.active ? "text-success" : "text-muted"
                                            }
                                        >
                                            {rt.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {openModal && resourceTypeForm()}
            </div>
        </div>
    );
}

export function QuantityType() {
    const navigate = useNavigate();

    const [quantityTypes, setQuantityTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [quantity, setQuantity] = useState({
        id: null,
        quantityType: "",
        active: true,
    });

    /* 🔐 Unauthorized handler */
    const handleUnauthorized = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    /* 📥 Fetch Quantity Types */
    const fetchQuantityTypes = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then(res => {
                if (res.status === 200) {
                    setQuantityTypes(res.data || []);
                }
            })
            .catch(err => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch quantity types");
            });
    }, [navigate]);

    useEffect(() => {
        fetchQuantityTypes();
    }, [fetchQuantityTypes]);

    /* 🔍 Filter */
    const filteredList = quantityTypes.filter(q =>
        q.quantityType?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setQuantity({ id: null, quantityType: "", active: true });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (q) => {
        setIsEdit(true);
        setQuantity({
            id: q.id,
            quantityType: q.quantityType,
            active: q.active,
        });
        setOpenModal(true);
    };

    /* 🗑️ Soft delete */
    const handleDelete = (q) => {
        const payload = { ...q, active: false };

        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}/quantityType/edit`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then(() => {
                toast.info("Quantity type marked as inactive");
                fetchQuantityTypes();
            })
            .catch(err => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to deactivate quantity type");
            });
    };

    /* ♻️ Reactivate */
    const handleReactivate = (q) => {
        const payload = { ...q, active: true };

        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}/quantityType/edit`, payload, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then(() => {
                toast.success("Quantity type reactivated");
                fetchQuantityTypes();
            })
            .catch(err => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to reactivate quantity type");
            });
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!quantity.quantityType.trim()) return;

        const apiCall = isEdit
            ? axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/quantityType/edit`,
                quantity,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            )
            : axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/quantityType`,
                quantity,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            );

        apiCall
            .then(() => {
                toast.success(isEdit ? "Quantity type updated" : "Quantity type created");
                setOpenModal(false);
                fetchQuantityTypes();
            })
            .catch(err => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Save failed");
            });
    };

    /* 🪟 Modal */
    const quantityForm = () => (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div className="modal-dialog modal-md modal-dialog-centered" onClick={e => e.stopPropagation()}>
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
                            Quantity Type <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter quantity type"
                            value={quantity.quantityType}
                            onChange={(e) =>
                                setQuantity(prev => ({
                                    ...prev,
                                    quantityType: e.target.value,
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
                            disabled={!quantity.quantityType.trim()}
                        >
                            {isEdit ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    /* 🧩 UI */
    return (
        <div className="container-fluid p-4 mt-3">
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Quantity Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Quantity Type</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info">
                    <span className="ms-2">Quantity Types</span>
                </div>

                {/* Search */}
                <div className="row p-4">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search quantity type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredList.length} of {quantityTypes.length} Quantity Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row p-4">
                    {filteredList.map((q, index) => (
                        <div className="col-lg-4 mb-3" key={index}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit size={18} style={{ cursor: "pointer" }} onClick={() => handleEdit(q)} />
                                        {q.active ? (
                                            <Trash2 size={18} style={{ cursor: "pointer" }} onClick={() => handleDelete(q)} />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleReactivate(q)}
                                            />
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <span>{q.quantityType}</span>
                                        <span className={q.active ? "text-success" : "text-muted"}>
                                            {q.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {openModal && quantityForm()}
            </div>
        </div>
    );
}

export function Resources() {
    const navigate = useNavigate();

    const [resourceTypes, setResourceTypes] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [quantityTypes, setQuantityTypes] = useState([]);
    const [allResources, setAllResources] = useState([]);
    const [selectedResType, setSelectedResType] = useState(null);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [resourceForm, setResourceForm] = useState({
        resourceCode: "",
        resourceName: "",
        unitRate: "",
        resourceType: null,
        uom: null,
        quantityType: null
    });

    const handleUnauthorized = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const fetchInitialData = useCallback(() => {
        axios
            .all([
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/resources`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                })
            ])
            .then(
                axios.spread((typeRes, resData) => {
                    setResourceTypes(
                        typeRes.data.map(rt => ({
                            value: rt.id,
                            label: rt.resourceTypeName
                        }))
                    );
                    setAllResources(resData.data || []);
                })
            )
            .catch(err => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to load resources");
            });
    }, [navigate]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const fetchDropdownMasters = () => {
    axios
        .all([
            axios.get(`http://localhost:8080/tactive/uoms`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            }),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            }),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            })
        ])
        .then(
            axios.spread((uomRes, qtyRes, typeRes) => {
                setUoms(uomRes.data.map(u => ({ 
                    value: u.id, 
                    label: u.uomName || u.uomCode 
                })));
                
                setQuantityTypes(qtyRes.data.map(q => ({ value: q.id, label: q.quantityType })));
                setResourceTypes(typeRes.data.map(t => ({ value: t.id, label: t.resourceTypeName })));
            })
        )
        .catch(() => toast.error("Failed to load dropdowns"));
};
    const handleAdd = () => {
        fetchDropdownMasters();
        setIsEdit(false);
        setEditingId(null);
        setResourceForm({
            resourceCode: "",
            resourceName: "",
            unitRate: "",
            resourceType: null,
            uom: null,
            quantityType: null
        });
        setOpenModal(true);
    };
    const handleEdit = (r) => {
        fetchDropdownMasters();
        setIsEdit(true);
        setEditingId(r.id);

        setResourceForm({
            resourceCode: r.resourceCode,
            resourceName: r.resourceName,
            unitRate: r.unitRate,
            resourceType: { value: r.resourceType.id, label: r.resourceType.resourceTypeName },
            uom: { value: r.uom.id, label: r.uom.uomName },
            quantityType: { value: r.quantityType.id, label: r.quantityType.quantityType }
        });

        setOpenModal(true);
    };
const toggleStatus = (r) => {
    const nextStatus = !r.active; 

    axios
        .put(
            `${import.meta.env.VITE_API_BASE_URL}/resource/edit`,
            {
                id: r.id,
                resourceCode: r.resourceCode,
                resourceName: r.resourceName,
                unitRate: r.unitRate,
                resourceTypeId: r.resourceType.id,
                uomId: r.uom.id,
                quantityTypeId: r.quantityType.id,
                active: nextStatus 
            },
            { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
        )
        .then(() => {
            toast.success(nextStatus ? "Resource Activated" : "Resource Deactivated");
            fetchInitialData();
        })
        .catch(e => toast.error(e?.response?.data || "Update failed"));
};
    const handleSaveResource = () => {
        const { resourceCode, resourceName, unitRate, resourceType, uom, quantityType } = resourceForm;

        if (!resourceCode || !resourceName || !unitRate || !resourceType || !uom || !quantityType) {
            toast.warning("All fields are required");
            return;
        }

       const payload = {
        id: isEdit ? editingId : null,
        resourceCode,
        resourceName,
        unitRate: Number(unitRate),
        resourceTypeId: resourceType.value,
        uomId: uom.value,
        quantityTypeId: quantityType?.value || null,
        active: isEdit ? allResources.find(res => res.id === editingId)?.active : true
    };

        const api = isEdit
            ? axios.put(`${import.meta.env.VITE_API_BASE_URL}/resource/edit`, payload, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            })
            : axios.post(`${import.meta.env.VITE_API_BASE_URL}/resource/add`, payload, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            });

        api
            .then(() => {
                toast.success(isEdit ? "Resource updated" : "Resource added");
                setOpenModal(false);
                setIsEdit(false);
                setEditingId(null);
                fetchInitialData();
            })
            .catch(e => toast.error(e?.response?.data || "Save failed"));
    };

    const displayData = allResources.filter(r => {
        const matchSearch = r.resourceName?.toLowerCase().includes(search.toLowerCase());
        const matchType = selectedResType ? r.resourceType.id === selectedResType.value : true;
        return matchSearch && matchType;
    });
    
    return (
        <div className="container-fluid p-4 mt-3">
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Resource</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add resources</span>
                </button>
            </div>

            <div className="bg-white mt-5">
                <div className="tab-info">
                    <span className="ms-2">Resources</span>
                </div>

                <div className="p-4 row g-3">
                    <div className="col-lg-6">
                        <label className="small fw-bold text-muted">Resource Type</label>
                        <Select
                            options={resourceTypes}
                            value={selectedResType}
                            onChange={setSelectedResType}
                            classNamePrefix={"select"}
                            isClearable
                        />
                    </div>
                    <div className="col-lg-6">
                        <label className="small fw-bold text-muted">Search</label>
                        <input
                            className="form-input w-100"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Sno</th>
                                <th>Type</th>
                                <th>Code</th>
                                <th>Name</th>
                                <th>UOM</th>
                                <th>Rate</th>
                                <th>Status</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
     {displayData.map((r, i) => (
    <tr key={r.id}>
        <td>{i + 1}</td>
        <td>{r.resourceType.resourceTypeName}</td>
        <td>{r.resourceCode}</td>
        <td>{r.resourceName}</td>
        <td>{r.uom.uomCode}</td>
        <td>{r.unitRate}</td>

        <td>
            <span className={r.active ? "text-success" : ""}>
                {r.active ? "Active" : "Inactive"}
            </span>
        </td>

        <td className="text-end">
            <Edit 
                size={18} 
                className="cursor-pointer text-muted me-2" 
                onClick={() => handleEdit(r)} 
            />
            {r.active ? (
                <Trash2 
                    size={18} 
                    className="cursor-pointer text-dark" 
                    onClick={() => toggleStatus(r)} 
                />
            ) : (
                <RotateCcw 
                    size={18} 
                    className="cursor-pointer" 
                    style={{ color: '#0d6efd' }} 
                    onClick={() => toggleStatus(r)} 
                />
            )}
        </td>
    </tr>
))}
                        </tbody>
                    </table>
                </div>
            </div>

            {openModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
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

      <div className="modal-body row g-3">
    {/* 1. Code */}
    <div className="col-md-6">
        <label className="projectform d-block">Code<span className="text-danger">*</span></label>
        <input className="form-input w-100" placeholder="Code"
            value={resourceForm.resourceCode}
            onChange={e => setResourceForm(p => ({ ...p, resourceCode: e.target.value }))} />
    </div>

    {/* 2. Name */}
    <div className="col-md-6">
        <label className="projectform d-block">Name<span className="text-danger">*</span></label>
        <input className="form-input w-100" placeholder="Name"
            value={resourceForm.resourceName}
            onChange={e => setResourceForm(p => ({ ...p, resourceName: e.target.value }))} />
    </div>

    {/* 3. Rate */}
    <div className="col-md-6">
        <label className="projectform d-block">Rate<span className="text-danger">*</span></label>
        <input type="number" className="form-input w-100" placeholder="Rate"
            value={resourceForm.unitRate}
            onChange={e => setResourceForm(p => ({ ...p, unitRate: e.target.value }))} />
    </div>

    <div className="col-md-6">
        <label className="projectform-select d-block">UOM<span className="text-danger">*</span></label>
        <Select 
            options={uoms} 
            classNamePrefix="select"
            value={resourceForm.uom}
            placeholder="Select UOM"
            onChange={opt => setResourceForm(p => ({ ...p, uom: opt }))} 
        />
    </div>

    <div className="col-md-6">
        <label className="projectform-select d-block">Resource Type<span className="text-danger">*</span></label>
        <Select 
            options={resourceTypes}
            classNamePrefix="select" 
            value={resourceForm.resourceType}
            placeholder="Select Type"
            onChange={opt => setResourceForm(p => ({ ...p, resourceType: opt }))} 
        />
    </div>

    <div className="col-md-6">
        <label className="projectform-select d-block">Quantity Type</label>
        <Select 
            options={quantityTypes}
            classNamePrefix="select" 
            value={resourceForm.quantityType}
            placeholder="Select Quantity Type"
            onChange={opt => setResourceForm(p => ({ ...p, quantityType: opt }))} 
        />
    </div>
</div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary"onClick={() => setOpenModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSaveResource}
                                disabled={
        !resourceForm.resourceCode.trim() ||
        !resourceForm.resourceName.trim() ||
        !resourceForm.unitRate ||
        !resourceForm.uom ||
        !resourceForm.resourceType 
    } >
                                    {isEdit ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}