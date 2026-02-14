import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select, { components } from 'react-select';

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
    const [attributeGroups, setAttributeGroups] = useState([]);
    const [allAttributes, setAllAttributes] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [allResources, setAllResources] = useState([]);
    const [selectedResType, setSelectedResType] = useState(null);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeTab, setActiveTab] = useState('general');
    const [viewAttributeModal, setViewAttributeModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const [groupAttributes, setGroupAttributes] = useState([]);
    const [resourceForm, setResourceForm] = useState({
        resourceCode: "",
        resourceName: "",
        unitRate: "",
        resourceTypeId: null,
        uomId: null,
        active: true,
        attributes: []
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
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/uoms`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/attributeGroup`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/attribute`, {
                    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                })
            ])
            .then(
                axios.spread((uomRes, typeRes, groupRes, attrRes) => {
                    setUoms(uomRes.data.map(u => ({
                        value: u.id,
                        label: u.uomName || u.uomCode
                    })));
                    setResourceTypes(typeRes.data.map(t => ({ value: t.id, label: t.resourceTypeName })));
                    setAttributeGroups(groupRes.data.map(g => ({ value: g.id, label: g.groupName })));
                    setAllAttributes(attrRes.data || []);
                })
            )
            .catch(() => toast.error("Failed to load dropdowns"));
    };

    const generateRandomResourceCode = (existingResources) => {
        let code;
        let isUnique = false;
        const maxAttempts = 100;
        let attempts = 0;

        while (!isUnique && attempts < maxAttempts) {
            // Generate random 6 digit number
            code = Math.floor(100000 + Math.random() * 900000).toString();
            // Check if exists
            const exists = existingResources.some(r => r.resourceCode === code);
            if (!exists) {
                isUnique = true;
            }
            attempts++;
        }
        return isUnique ? code : "";
    };

    const handleAdd = () => {
        fetchDropdownMasters();
        setIsEdit(false);
        setEditingId(null);
        const newCode = generateRandomResourceCode(allResources);
        setResourceForm({
            resourceCode: newCode,
            resourceName: "",
            unitRate: "",
            resourceTypeId: null,
            uomId: null,
            active: true,
            attributes: [{ id: null, attributeGroupId: null, isMandatory: false }]
        });
        setActiveTab('general');
        setOpenModal(true);
    };

    const handleEdit = (r) => {
        fetchDropdownMasters();
        setIsEdit(true);
        setEditingId(r.id);

        // Fetch Resource Attribute Details
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-by-resource/${r.id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
            .then(res => {
                const attrData = res.data || [];
                const attributes = attrData.map(a => ({
                    id: a.id,
                    attributeGroupId: a.attributeGroup?.id || null,
                    isMandatory: a.mandatory
                }));

                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    unitRate: r.unitRate,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: attributes.length > 0 ? attributes : [{ id: null, attributeGroupId: null, isMandatory: false }]
                });
                setActiveTab('general');
                setOpenModal(true);
            })
            .catch(err => {
                console.error(err);
                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    unitRate: r.unitRate,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: [{ id: null, attributeGroupId: null, isMandatory: false }]
                });
                setActiveTab('general');
                setOpenModal(true);
            });
    };

    const handleAddAttribute = (r) => {
        fetchDropdownMasters();
        setIsEdit(true);
        setEditingId(r.id);

        axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-by-resource/${r.id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
            .then(res => {
                const attrData = res.data || [];
                const attributes = attrData.map(a => ({
                    id: a.id,
                    attributeGroupId: a.attributeGroup?.id || null,
                    isMandatory: a.mandatory
                }));

                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    unitRate: r.unitRate,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: attributes.length > 0 ? attributes : [{ id: null, attributeGroupId: null, isMandatory: false }]
                });
                setActiveTab('attributes');
                setOpenModal(true);
            })
            .catch(err => {
                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    unitRate: r.unitRate,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: [{ id: null, attributeGroupId: null, isMandatory: false }]
                });
                setActiveTab('attributes');
                setOpenModal(true);
            });
    };

    const handleViewAttributes = (r) => {
        // Fetch all assigned attribute groups for this resource
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-by-resource/${r.id}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
            .then(res => {
                const assignments = res.data || [];

                if (assignments.length === 0) {
                    setSelectedResource(r);
                    setGroupAttributes([]);
                    setViewAttributeModal(true);
                    return;
                }

                // Fetch attributes for each assigned group
                const groupFetches = assignments.map(assignment => {
                    if (!assignment.attributeGroup?.id) return Promise.resolve([]);

                    return axios.get(`${import.meta.env.VITE_API_BASE_URL}/get-by-group/${assignment.attributeGroup.id}`, {
                        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                    })
                        .then(gRes => {
                            const attrs = gRes.data || [];
                            // Attach group metadata to each attribute
                            return attrs.map(attr => ({
                                ...attr,
                                groupName: assignment.attributeGroup.groupName,
                                isMandatory: assignment.mandatory,
                                assignmentId: assignment.id // Keep track of the assignment ID if needed
                            }));
                        })
                        .catch(() => []); // If one group fails, just return empty for that one
                });

                Promise.all(groupFetches)
                    .then(results => {
                        // Flatten the array of arrays
                        const allAttrs = results.flat();
                        setGroupAttributes(allAttrs);
                        setSelectedResource(r);
                        setViewAttributeModal(true);
                    })
                    .catch(err => {
                        console.error(err);
                        toast.error("Failed to fetch group attributes");
                    });
            })
            .catch(err => {
                toast.error("Failed to fetch attribute details");
            });
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

    // Helper functions for attribute rows
    const addNewAttributeRow = () => {
        setResourceForm(prev => ({
            ...prev,
            attributes: [...prev.attributes, { id: null, attributeGroupId: null, isMandatory: false }]
        }));
    };

    const removeAttributeRow = (index) => {
        setResourceForm(prev => {
            const newAttributes = [...prev.attributes];
            const removedAttr = newAttributes[index];
            newAttributes.splice(index, 1);

            // If deleting an existing attribute assignment, attempt DELETE API call
            // NOTE: Assuming backend has a DELETE endpoint for resource attributes or handles it.
            // If specific endpoint is not confirmed, this is UI-only removal until confirmed.
            // Based on typical patterns, if an ID exists, we might need to delete it.
            if (removedAttr.id) {
                // DELETE logic placeholder - uncomment if endpoint confirmed
                // axios.delete(`${import.meta.env.VITE_API_BASE_URL}/resourceAttribute/delete/${removedAttr.id}`, {
                //    headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                // }).catch(err => console.log("Failed to delete attribute assignment", err));
            }

            return { ...prev, attributes: newAttributes };
        });
    };

    const updateAttributeRow = (index, field, value) => {
        setResourceForm(prev => {
            const newAttributes = [...prev.attributes];
            newAttributes[index] = { ...newAttributes[index], [field]: value };
            return { ...prev, attributes: newAttributes };
        });
    };
    const handleSaveResource = () => {
        const { resourceCode, resourceName, unitRate, resourceTypeId, uomId, active, attributes } = resourceForm;

        if (!resourceCode || !resourceName || !unitRate || !resourceTypeId || !uomId) {
            toast.warning("All fields are required");
            return;
        }

        // Duplicate Check
        const isDuplicate = allResources.some(r => r.resourceCode === resourceCode && r.id !== editingId);
        if (isDuplicate) {
            toast.warning("Resource Code already exists. Please generate a new one.");
            return;
        }

        const payload = {
            resourceCode,
            resourceName,
            unitRate,

            resourceTypeId,
            uomId,
            active
        };

        const api = isEdit
            ? axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/resource/edit`,
                { id: editingId, ...payload },
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            )
            : axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/resource/add`,
                payload,
                { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
            );

        api
            .then((res) => {
                const savedResourceId = isEdit ? editingId : (res.data && res.data.id ? res.data.id : null);
                if (savedResourceId) {
                    // Process attributes
                    const attributePromises = attributes
                        .filter(attr => attr.attributeGroupId) // Filter out empty rows
                        .map(attr => {
                            const attrPayload = {
                                id: attr.id, // Include ID if editing/existing
                                resourceId: savedResourceId,
                                attributeGroupId: attr.attributeGroupId,
                                mandatory: attr.isMandatory
                            };
                            return axios.post(`${import.meta.env.VITE_API_BASE_URL}/addResourceAttribute`, attrPayload, {
                                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                            });
                        });

                    Promise.all(attributePromises)
                        .then(() => {
                            toast.success(isEdit ? "Resource updated" : "Resource added");
                            setOpenModal(false);
                            setIsEdit(false);
                            setEditingId(null);
                            fetchInitialData();
                        })
                        .catch(err => {
                            console.error(err);
                            toast.warning("Resource saved but failed to update attributes");
                            setOpenModal(false);
                            fetchInitialData();
                        });
                } else {
                    toast.success(isEdit ? "Resource updated" : "Resource added");
                    setOpenModal(false);
                    fetchInitialData();
                }
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
                                <th>Attribute</th>
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

                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-info"
                                            onClick={() => handleViewAttributes(r)}
                                            title="View Attributes"
                                        >
                                            <Eye size={14} /> View
                                        </button>
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

            {viewAttributeModal && selectedResource && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <p className="fw-bold mb-0">Attributes - {selectedResource.resourceName}</p>
                                <button className="modal-close-btn" onClick={() => setViewAttributeModal(false)}>
                                    <X />
                                </button>
                            </div>
                            <div className="modal-body">
                                <p className="mb-3"><strong>Total Attributes:</strong> {groupAttributes.length}</p>
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '50px' }}>S.No</th>
                                                <th>Attribute Group</th>
                                                <th>Attribute Name</th>
                                                <th>Mandatory</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {groupAttributes.map((attr, idx) => (
                                                <tr key={attr.id || idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{attr.groupName || "-"}</td>
                                                    <td>{attr.attributeName}</td>
                                                    <td>{attr.isMandatory ? "Yes" : "No"}</td>
                                                    <td>
                                                        <span className={attr.active ? "text-success" : "text-danger"}>
                                                            {attr.active ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {groupAttributes.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center text-muted">No attributes found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setViewAttributeModal(false);
                                        handleAddAttribute(selectedResource);
                                    }}
                                >
                                    Add
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => {
                                        setViewAttributeModal(false);
                                        handleAddAttribute(selectedResource);
                                    }}
                                >
                                    Update
                                </button>
                                <button className="btn btn-secondary" onClick={() => setViewAttributeModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {openModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between">
                                <p className="fw-bold mb-0">
                                    {isEdit ? "Edit Resource" : "Add Resource"} - {activeTab === 'general' ? 'General' : 'Attributes'}
                                </p>
                                <button
                                    className="modal-close-btn"
                                    onClick={() => setOpenModal(false)}
                                >
                                    <X />
                                </button>
                            </div>

                            <div className="modal-body">
                                <ul className="nav nav-tabs mb-3">
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                                            style={{ color: activeTab === 'general' ? '#005197' : 'black' }}
                                            onClick={() => setActiveTab('general')}
                                        >
                                            General
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button
                                            className={`nav-link ${activeTab === 'attributes' ? 'active' : ''}`}
                                            style={{ color: activeTab === 'attributes' ? '#005197' : 'black' }}
                                            onClick={() => setActiveTab('attributes')}
                                        >
                                            Attributes
                                        </button>
                                    </li>
                                </ul>

                                {activeTab === 'general' ? (
                                    <div className="row g-3">
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
                                                placeholder="Select UOM"
                                                value={uoms.find(u => u.value === resourceForm.uomId) || null}
                                                onChange={opt =>
                                                    setResourceForm(p => ({ ...p, uomId: opt?.value || null }))
                                                }
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="projectform-select d-block">Resource Type<span className="text-danger">*</span></label>
                                            <Select
                                                options={resourceTypes}
                                                classNamePrefix="select"
                                                placeholder="Select Type"
                                                value={resourceTypes.find(t => t.value === resourceForm.resourceTypeId) || null}
                                                onChange={opt =>
                                                    setResourceForm(p => ({ ...p, resourceTypeId: opt?.value || null }))
                                                }
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Attribute Group</th>
                                                        <th style={{ width: '150px' }}>Mandatory</th>
                                                        <th style={{ width: '80px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {resourceForm.attributes.map((attr, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <Select
                                                                    options={attributeGroups}
                                                                    classNamePrefix="select"
                                                                    placeholder="Select Attribute Group"
                                                                    value={attributeGroups.find(g => g.value === attr.attributeGroupId) || null}
                                                                    onChange={opt => updateAttributeRow(idx, 'attributeGroupId', opt?.value || null)}
                                                                />
                                                            </td>
                                                            <td className="text-center align-middle">
                                                                <div className="form-check d-flex justify-content-center">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        checked={attr.isMandatory}
                                                                        onChange={e => updateAttributeRow(idx, 'isMandatory', e.target.checked)}
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="text-center align-middle">
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => removeAttributeRow(idx)}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col-md-12">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={addNewAttributeRow}
                                            >
                                                <Plus size={14} className="me-1" /> Add Attribute Group
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSaveResource}
                                    disabled={
                                        !resourceForm.resourceCode.trim() ||
                                        !resourceForm.resourceName.trim() ||
                                        !resourceForm.unitRate ||
                                        !resourceForm.uomId ||
                                        !resourceForm.resourceTypeId
                                    }
                                >
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

const CustomOption = (props) => {
    return (
        <components.Option {...props}>
            <input
                type="checkbox"
                checked={props.isSelected}
                onChange={() => null}
                style={{ marginRight: 10, accentColor: '#005197' }}
            />
            {props.label}
        </components.Option>
    );
};

const CustomMultiValueContainer = () => null;

export function Attributes() {
    const [attributeGroups, setAttributeGroups] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // View State
    const [viewMode, setViewMode] = useState("group"); // 'group' | 'attribute'

    // Modal & Form State
    const [openModal, setOpenModal] = useState(false);
    const [modalTab, setModalTab] = useState("attribute"); // 'attribute' | 'group'
    const [isEdit, setIsEdit] = useState(false);

    // Forms
    const [attributeForm, setAttributeForm] = useState({
        id: null,
        attributeName: "",
        active: true
    });

    const [groupForm, setGroupForm] = useState({
        id: null,
        groupName: "",
        active: true,
        selectedAttributes: []
    });
    const token = sessionStorage.getItem("token");
    const handleUnauthorized = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };
    const fetchData = useCallback(() => {
        setLoading(true);
        axios
            .all([
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/attributeGroup`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/attribute`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ])
            .then(
                axios.spread((groupsRes, attrsRes) => {
                    if (groupsRes.status === 200) setAttributeGroups(groupsRes.data || []);
                    if (attrsRes.status === 200) setAttributes(attrsRes.data || []);
                })
            )
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch attributes data");
            })
            .finally(() => setLoading(false));
    }, [token]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };
    const filteredGroups = attributeGroups.filter(g =>
        g.groupName?.toLowerCase().includes(search.toLowerCase())
    );
    const getAttributesForGroup = (groupId) => {
        return attributes.filter(attr =>
            attr.attributeGroup?.some(g => g.id === groupId)
        );
    };
    const handleAdd = () => {
        setIsEdit(false);
        setModalTab(viewMode === 'group' ? 'group' : 'attribute');
        setAttributeForm({ id: null, attributeName: "", active: true });
        setGroupForm({ id: null, groupName: "", active: true, selectedAttributes: [] });
        setOpenModal(true);
    };

    const handleEditGroup = (e, group) => {
        e.stopPropagation();
        setIsEdit(true);
        setModalTab("group");
        const currentGroupAttrs = getAttributesForGroup(group.id);
        const selectedOptions = currentGroupAttrs.map(attr => ({
            value: attr.id,
            label: attr.attributeName
        }));

        setGroupForm({
            id: group.id,
            groupName: group.groupName,
            active: group.active,
            selectedAttributes: selectedOptions
        });
        setOpenModal(true);
    };

    const handleEditAttribute = (attr) => {
        setIsEdit(true);
        setModalTab("attribute");
        setAttributeForm({
            id: attr.id,
            attributeName: attr.attributeName,
            active: attr.active
        });
        setOpenModal(true);
    };

    const handleAttributeStatus = (attr) => {
        const payload = { ...attr, active: !attr.active };
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/attribute`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                toast.success(`Attribute ${attr.active ? "Deactivated" : "Reactivated"}`);
                fetchData();
            })
            .catch(err => toast.error("Failed to update status"));
    };

    const handleGroupStatus = (group) => {
        const currentAttributes = getAttributesForGroup(group.id);
        const attributeIds = currentAttributes.map(a => a.id);

        const payload = {
            id: group.id,
            groupName: group.groupName,
            active: !group.active
        };

        axios.post(`${import.meta.env.VITE_API_BASE_URL}/attributeGroup`, payload, {
            headers: { Authorization: `Bearer ${token}` },
            params: { attributeIds: attributeIds.join(',') }
        })
            .then(() => {
                toast.success(`Group ${group.active ? "Deactivated" : "Reactivated"}`);
                fetchData();
            })
            .catch(err => toast.error("Failed to update group status"));
    };

    const handleSave = () => {
        if (modalTab === "attribute") {
            // Validate
            if (!attributeForm.attributeName.trim()) {
                toast.warning("Attribute Name is required");
                return;
            }

            const payload = {
                attributeName: attributeForm.attributeName,
                active: attributeForm.active
            };
            if (isEdit) payload.id = attributeForm.id;

            const method = 'post';
            const endpoint = `${import.meta.env.VITE_API_BASE_URL}/attribute`;

            axios[method](endpoint, payload, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    toast.success(`Attribute ${isEdit ? "Updated" : "Added"} Successfully`);
                    fetchData();
                    setOpenModal(false);
                })
                .catch(err => toast.error(err?.response?.data || "Failed to save attribute"));

        } else {
            if (!groupForm.groupName.trim()) {
                toast.warning("Group Name is required");
                return;
            }

            const attributeIds = groupForm.selectedAttributes.map(o => o.value);

            const groupPayload = {
                groupName: groupForm.groupName,
                active: groupForm.active
            };
            if (isEdit) groupPayload.id = groupForm.id;

            const combinedPayload = {
                ...groupPayload,
                attributeIds: attributeIds
            };

            const apiCall = isEdit
                ? axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/attributeGroup`,
                    groupPayload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { attributeIds: attributeIds.join(',') }
                    }
                )
                : axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/attributeGroup`,
                    groupPayload,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        params: { attributeIds: attributeIds.join(',') }
                    }
                );

            apiCall
                .then(res => {
                    toast.success(res.data);
                    fetchData();
                    setOpenModal(false);
                })
                .catch(err => toast.error(err?.response?.data || "Failed to save group"));
        }
    };

    // Modal UI
    const renderModal = () => (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-md modal-dialog-centered">
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit" : "Add"} {modalTab === "attribute" ? "Attribute" : "Attribute Group"}
                        </p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>
                            <X />
                        </button>
                    </div>

                    <div className="modal-body">
                        <ul className="nav nav-tabs mb-3">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${modalTab === 'attribute' ? 'active' : ''}`}
                                    style={{ color: modalTab === 'attribute' ? '#005197' : 'black' }}
                                    onClick={() => setModalTab('attribute')}
                                    disabled={isEdit && modalTab !== 'attribute'}
                                >
                                    Attribute
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${modalTab === 'group' ? 'active' : ''}`}
                                    style={{ color: modalTab === 'group' ? '#005197' : 'black' }}
                                    onClick={() => setModalTab('group')}
                                    disabled={isEdit && modalTab !== 'group'}
                                >
                                    Attribute Group
                                </button>
                            </li>
                        </ul>

                        {modalTab === 'attribute' ? (
                            <div className="form-group">
                                <label className="projectform d-block">
                                    Attribute Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input w-100"
                                    value={attributeForm.attributeName}
                                    onChange={(e) => setAttributeForm(p => ({ ...p, attributeName: e.target.value }))}
                                    placeholder="Enter attribute name"
                                />
                            </div>
                        ) : (
                            <div className="form-group d-flex flex-column">
                                <div>
                                    <label className="projectform d-block">
                                        Group Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input w-100"
                                        value={groupForm.groupName}
                                        onChange={(e) => setGroupForm(p => ({ ...p, groupName: e.target.value }))}
                                        placeholder="Enter group name"
                                    />
                                </div>
                                <div className="mt-3">
                                    <label className="projectform-select d-block">
                                        Attributes
                                    </label>
                                    <Select
                                        isMulti
                                        options={attributes.map(a => ({ value: a.id, label: a.attributeName }))}
                                        value={groupForm.selectedAttributes}
                                        onChange={(selected) => setGroupForm(p => ({ ...p, selectedAttributes: selected || [] }))}
                                        classNamePrefix="select"
                                        placeholder="Select attributes..."
                                        closeMenuOnSelect={false}
                                        hideSelectedOptions={false}
                                        components={{
                                            Option: CustomOption,
                                            MultiValueContainer: CustomMultiValueContainer
                                        }}
                                        styles={{
                                            option: (base, state) => {
                                                let backgroundColor = 'white';
                                                if (state.isSelected) {
                                                    backgroundColor = '#DBEAFE';
                                                } else if (state.isFocused) {
                                                    backgroundColor = '#EFF6FF';
                                                }

                                                return {
                                                    ...base,
                                                    backgroundColor: backgroundColor,
                                                    color: state.isSelected ? '#005197' : 'black',
                                                    cursor: 'pointer',
                                                    '&:active': {
                                                        backgroundColor: '#DBEAFE'
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: state.isSelected ? '#DBEAFE' : '#EFF6FF'
                                                    }
                                                };
                                            },
                                            multiValue: () => ({ display: 'none' })
                                        }}
                                    />
                                    <div className="mt-2 d-flex flex-wrap gap-2">
                                        {groupForm.selectedAttributes.map((selectedOpt) => (
                                            <span key={selectedOpt.value} className="select__multi-value" style={{ backgroundColor: '#DBEAFE', borderRadius: '4px', padding: '2px 8px', display: 'flex', alignItems: 'center', color: '#005197' }}>
                                                <span className="select__multi-value__label" style={{ marginRight: '5px' }}>
                                                    {selectedOpt.label}
                                                </span>
                                                <span
                                                    className="select__multi-value__remove"
                                                    style={{ cursor: 'pointer', fontWeight: 'bold' }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setGroupForm(p => ({
                                                            ...p,
                                                            selectedAttributes: p.selectedAttributes.filter(attr => attr.value !== selectedOpt.value)
                                                        }));
                                                    }}
                                                >
                                                    &times;
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>
                            Cancel
                        </button>
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
                    <span className="ms-2">Attributes</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">{viewMode === 'group' ? "Add Attribute Group" : "Add Attribute"}</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info text-white p-3 rounded-top" style={{ backgroundColor: "#005197" }}>
                    <span className="ms-2 fw-bold">Attributes Management</span>
                </div>
                <div className="d-flex gap-4 border-bottom p-2 bg-light">
                    <span
                        className={`ms-2 py-2 cursor-pointer ${viewMode === 'group' ? 'text-primary fw-bold border-bottom border-primary border-2' : ''}`}
                        onClick={() => setViewMode('group')}
                    >
                        Attribute Groups
                    </span>
                    <span
                        className={`py-2 cursor-pointer ${viewMode === 'attribute' ? 'text-primary fw-bold border-bottom border-primary border-2' : ''}`}
                        onClick={() => setViewMode('attribute')}
                    >
                        Attributes
                    </span>
                </div>

                {viewMode === 'attribute' ? (
                    <div className="row p-4">
                        {loading ? (
                            <div className="text-center w-100">Loading...</div>
                        ) : (
                            <div className="row">
                                {attributes.filter(attr => !attr.attributeGroup || attr.attributeGroup.length === 0).length > 0 ? (
                                    attributes
                                        .filter(attr => !attr.attributeGroup || attr.attributeGroup.length === 0)
                                        .map(attr => (
                                            <div className="col-md-4 mb-3" key={attr.id}>
                                                <div className="card shadow-sm">
                                                    <div className="card-body d-flex justify-content-between align-items-center">
                                                        <span className="fw-bold">{attr.attributeName}</span>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <span className={`badge ${attr.active ? 'bg-success' : 'bg-secondary'} rounded-pill`} style={{ fontSize: '0.7rem' }}>
                                                                {attr.active ? 'Active' : 'Inactive'}
                                                            </span>
                                                            <Edit
                                                                size={16}
                                                                className="cursor-pointer text-muted"
                                                                onClick={() => handleEditAttribute(attr)}
                                                            />
                                                            {attr.active ? (
                                                                <Trash2
                                                                    size={16}
                                                                    className="cursor-pointer text-dark"
                                                                    onClick={() => handleAttributeStatus(attr)}
                                                                />
                                                            ) : (
                                                                <RotateCcw
                                                                    size={16}
                                                                    className="cursor-pointer text-primary"
                                                                    onClick={() => handleAttributeStatus(attr)}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                ) : (
                                    <div className="col-12 text-center text-muted">No independent attributes found.</div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="row mt-3 p-4">
                            <div className="col-md-8">
                                <label>Search</label>
                                <input
                                    className="form-input w-100"
                                    placeholder="Search attribute group"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-4 d-flex align-items-center justify-content-center">
                                {filteredGroups.length} of {attributeGroups.length} Groups
                            </div>
                        </div>

                        {/* Groups List */}
                        <div className="row p-4">
                            {loading ? (
                                <div className="text-center w-100">Loading...</div>
                            ) : (
                                filteredGroups.map((group) => (
                                    <div className="col-12 mb-3" key={group.id}>
                                        <div className="card shadow-sm">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-center cursor-pointer"
                                                    onClick={() => toggleGroup(group.id)}>
                                                    <div className="d-flex align-items-center gap-3">
                                                        {expandedGroups[group.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                        <h6 className="mb-0 fw-bold">{group.groupName}</h6>
                                                        <span className={`badge ${group.active ? 'bg-success' : 'bg-secondary'}`}>
                                                            {group.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <Edit
                                                            size={18}
                                                            className="text-muted cursor-pointer"
                                                            onClick={(e) => handleEditGroup(e, group)}
                                                        />
                                                        {group.active ? (
                                                            <Trash2
                                                                size={18}
                                                                className="cursor-pointer text-dark"
                                                                onClick={(e) => { e.stopPropagation(); handleGroupStatus(group); }}
                                                            />
                                                        ) : (
                                                            <RotateCcw
                                                                size={18}
                                                                className="cursor-pointer text-primary"
                                                                onClick={(e) => { e.stopPropagation(); handleGroupStatus(group); }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expanded Attributes List */}
                                                {expandedGroups[group.id] && (
                                                    <div className="mt-4 ps-4 border-start border-3 border-primary">
                                                        <h6 className="text-muted mb-3">Attributes in this group:</h6>
                                                        <div className="row">
                                                            {getAttributesForGroup(group.id).length > 0 ? (
                                                                getAttributesForGroup(group.id).map(attr => (
                                                                    <div className="col-md-4 mb-2" key={attr.id}>
                                                                        <div className="p-2 border rounded d-flex justify-content-between align-items-center bg-light">
                                                                            <span>{attr.attributeName}</span>
                                                                            <div className="d-flex align-items-center gap-2">
                                                                                <span className={`badge ${attr.active ? 'bg-success' : 'bg-secondary'} rounded-pill`} style={{ fontSize: '0.7rem' }}>
                                                                                    {attr.active ? 'Active' : 'Inactive'}
                                                                                </span>
                                                                                <Edit
                                                                                    size={14}
                                                                                    className="cursor-pointer text-muted"
                                                                                    onClick={() => handleEditAttribute(attr)}
                                                                                />
                                                                                {attr.active ? (
                                                                                    <Trash2
                                                                                        size={14}
                                                                                        className="cursor-pointer text-dark"
                                                                                        onClick={() => handleAttributeStatus(attr)}
                                                                                    />
                                                                                ) : (
                                                                                    <RotateCcw
                                                                                        size={14}
                                                                                        className="cursor-pointer text-primary"
                                                                                        onClick={() => handleAttributeStatus(attr)}
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-12 text-muted fst-italic">No attributes found for this group.</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {openModal && renderModal()}
        </div>
    );
}