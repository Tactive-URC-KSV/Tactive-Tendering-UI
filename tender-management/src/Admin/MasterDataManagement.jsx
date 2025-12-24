import { ArrowLeft, Edit, Plus, Trash2, X, Ban, RotateCcw } from "lucide-react";
import { useRegions } from "../Context/RegionsContext";
import { useEffect, useState } from "react";
import { useSectors } from "../Context/SectorsContext";
import { useScope } from "../Context/ScopeContext";
import { useUom } from "../Context/UomContext";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";

export function Region() {
    const regions = useRegions(); 
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [region, setRegion] = useState({
        id: null,
        regionName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const filteredRegions = regions.filter((r) =>
        r.regionName?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setRegion({ id: null, regionName: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (r) => {
        setIsEdit(true);
        setRegion({ ...r });
        setOpenModal(true);
    };
    const handleDelete = (r) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/region/edit`,
                { ...r, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Region deactivated");
                useRegions();
            })
            .catch((e) =>
                toast.error(e?.response?.data)
            );
    };
    const handleReactivate = (r) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/region/edit`,
                { ...r, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Region reactivated");
                useRegions();
            })
            .catch((e) =>
                toast.error(e?.response?.data)
            );
    };
    const handleSave = () => {
        if (!region.regionName.trim()) return;
        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/region/edit`,
                    region,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Region updated");
                    setOpenModal(false);
                    useRegions();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/addRegion`,
                    region,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Region created");
                    setOpenModal(false);
                    useRegions();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };
    const regionForm = () => (
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
                            {isEdit ? "Edit Region" : "Add Region"}
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
                            Region Name <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            placeholder="Enter region name"
                            value={region.regionName}
                            onChange={(e) =>
                                setRegion((prev) => ({
                                    ...prev,
                                    regionName: e.target.value,
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
                            disabled={!region.regionName.trim()}
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
                    <span className="ms-2">Region</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new Region</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Regions</span>
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
                        {filteredRegions.length} of {regions.length} Regions
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredRegions.map((r, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(r)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {r.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(r)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(r)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{r.regionName}</span>
                                        <span
                                            className={
                                                r.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {r.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {openModal && regionForm()}
            </div>
        </div>
    );
}
export function Sectors() {
    const sectors = useSectors();
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [sector, setSector] = useState({
        id: null,
        sectorName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const filteredSectors = sectors.filter((sec) =>
        sec.sectorName?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setSector({ id: null, sectorName: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (sec) => {
        setIsEdit(true);
        setSector({ ...sec });
        setOpenModal(true);
    };
    const handleDelete = (sec) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/sector/edit`,
                { ...sec, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Sector deactivated");
                window.location.reload();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to deactivate sector")
            );
    };
    const handleReactivate = (sec) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/sector/edit`,
                { ...sec, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Sector reactivated");
                window.location.reload();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to reactivate sector")
            );
    };
    const handleSave = () => {
        if (!sector.sectorName.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/sector/edit`,
                    sector,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Sector updated");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/addSector`,
                    sector,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Sector created");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };
    const sectorForm = () => (
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
                            {isEdit ? "Edit Sector" : "Add Sector"}
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
                            Sector Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter sector name"
                            value={sector.sectorName}
                            onChange={(e) =>
                                setSector((prev) => ({
                                    ...prev,
                                    sectorName: e.target.value,
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
                            disabled={!sector.sectorName.trim()}
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
                    <span className="ms-2">Sector</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new sector</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Sectors</span>
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
                        {filteredSectors.length} of {sectors.length} Sectors
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredSectors.map((sec, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(sec)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {sec.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(sec)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(sec)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{sec.sectorName}</span>
                                        <span
                                            className={
                                                sec.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {sec.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {openModal && sectorForm()}
            </div>
        </div>
    );
}
export function Scopes() {
    const scopes = useScope();
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [scopeData, setScopeData] = useState({
        id: null,
        scope: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const filteredScopes = scopes.filter((s) =>
        s.scope?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setScopeData({ id: null, scope: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (s) => {
        setIsEdit(true);
        setScopeData({ ...s });
        setOpenModal(true);
    };
    const handleDelete = (s) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/scope/edit`,
                { ...s, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Scope deactivated");
                window.location.reload();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to deactivate scope")
            );
    };
    const handleReactivate = (s) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/scope/edit`,
                { ...s, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Scope reactivated");
                window.location.reload();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to reactivate scope")
            );
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!scopeData.scope.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/scope/edit`,
                    scopeData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Scope updated");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/addScope`,
                    scopeData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Scope created");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };
    const scopeForm = () => (
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
                            {isEdit ? "Edit Scope" : "Add Scope"}
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
                            Scope Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter scope name"
                            value={scopeData.scope}
                            onChange={(e) =>
                                setScopeData((prev) => ({
                                    ...prev,
                                    scope: e.target.value,
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
                            disabled={!scopeData.scope.trim()}
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
                    <span className="ms-2">Scope of Packages</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new scope</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Scope of Packages</span>
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
                        {filteredScopes.length} of {scopes.length} Scope of packages
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredScopes.map((s, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(s)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {s.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(s)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(s)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{s.scope}</span>
                                        <span
                                            className={
                                                s.active
                                                    ? "text-success"
                                                    : "text-muted"
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

                {openModal && scopeForm()}
            </div>
        </div>
    );
}
export function UOM() {
    const uoms = useUom();
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [uomData, setUomData] = useState({
        id: null,
        uomName: "",
        uomCode: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const filteredUnits = uoms.filter(
        (uom) =>
            uom.uomName?.toLowerCase().includes(search.toLowerCase()) ||
            uom.uomCode?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setUomData({ id: null, uomName: "", uomCode: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (uom) => {
        setIsEdit(true);
        setUomData({ ...uom });
        setOpenModal(true);
    };
    const handleDelete = (uom) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/uom/edit`,
                { ...uom, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "UOM deactivated");
                window.location.reload();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to deactivate UOM")
            );
    };
    const handleReactivate = (uom) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/uom/edit`,
                { ...uom, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "UOM reactivated");
                window.location.reload();
            })
            .catch((e) =>
                toast.error(e?.response?.data || "Failed to reactivate UOM")
            );
    };
    const handleSave = () => {
        if (!uomData.uomName.trim() || !uomData.uomCode.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/uom/edit`,
                    uomData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "UOM updated");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/addUom`,
                    uomData,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "UOM created");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };
    const uomForm = () => (
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
                            {isEdit ? "Edit UOM" : "Add UOM"}
                        </p>
                        <button
                            className="modal-close-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="projectform d-block">
                                UOM Name <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-input w-100"
                                placeholder="Enter UOM name"
                                value={uomData.uomName}
                                onChange={(e) =>
                                    setUomData((prev) => ({
                                        ...prev,
                                        uomName: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="mb-3">
                            <label className="projectform d-block">
                                UOM Code <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-input w-100"
                                placeholder="Enter UOM code"
                                value={uomData.uomCode}
                                onChange={(e) =>
                                    setUomData((prev) => ({
                                        ...prev,
                                        uomCode: e.target.value.toUpperCase(),
                                    }))
                                }
                            />
                        </div>
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
                                !uomData.uomName.trim() ||
                                !uomData.uomCode.trim()
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
                    <span className="ms-2">Unit of Measurements</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new Unit</span>
                </button>
            </div>
            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Unit of Measurements</span>
                </div>
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by UOM Name or Code"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredUnits.length} of {uoms.length} UOM&apos;s
                    </div>
                </div>
                <div className="row ms-1 me-1 mt-3">
                    {filteredUnits.map((uom, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(uom)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {uom.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(uom)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(uom)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>
                                            {uom.uomName} ({uom.uomCode})
                                        </span>
                                        <span
                                            className={
                                                uom.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {uom.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {openModal && uomForm()}
            </div>
        </div>
    );
}
export function ListOfApprovals() {
    const [listOfApprovals, setListOfApprovals] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [approval, setApproval] = useState({
        id: null,
        documentName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchApprovals = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/listOfApprovals`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) setListOfApprovals(r.data || []);
            })
            .catch(() => toast.error("Failed to load approval documents"));
    };
    useEffect(() => {
        fetchApprovals();
    }, []);
    const filteredDoc = listOfApprovals.filter((d) =>
        d.documentName?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setApproval({ id: null, documentName: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (doc) => {
        setIsEdit(true);
        setApproval({ ...doc });
        setOpenModal(true);
    };
    const handleDelete = (doc) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/approvalDocuments/edit`,
                { ...doc, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data || "Approval document deactivated");
                fetchApprovals();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate approval"
                )
            );
    };
    const handleReactivate = (doc) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/approvalDocuments/edit`,
                { ...doc, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((r) => {
                toast.success(r.data || "Approval document reactivated");
                fetchApprovals();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate approval"
                )
            );
    };
    const handleSave = () => {
        if (!approval.documentName.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/approvalDocuments/edit`,
                    approval,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data || "Approval updated");
                    fetchApprovals();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/approvalDocuments/add`,
                    approval,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((r) => {
                    toast.success(r.data || "Approval created");
                    fetchApprovals();
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
                            {isEdit ? "Edit Approval" : "Add Approval"}
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
                            Document Name <span className="text-danger">*</span>
                        </label>
                        <input
                            className="form-input w-100"
                            value={approval.documentName}
                            onChange={(e) =>
                                setApproval((p) => ({
                                    ...p,
                                    documentName: e.target.value,
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
                            disabled={!approval.documentName.trim()}
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
                    <span className="ms-2">List Of Approvals</span>
                </div>
                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} /> Add new approval doc
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">List of Approval Documents</span>
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
                        {filteredDoc.length} of {listOfApprovals.length} documents
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredDoc.map((doc, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(doc)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {doc.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(doc)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(doc)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{doc.documentName}</span>
                                        <span
                                            className={
                                                doc.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {doc.active ? "Active" : "Inactive"}
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
export function CostCodeType() {
    const [costCodeTypes, setCostCodeTypes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [type, setType] = useState({
        id: null,
        costCodeName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchCostCodeTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCostCodeTypes(r.data || []);
                }
            })
            .catch(() => toast.error("Failed to load cost code types"));
    };

    useEffect(() => {
        fetchCostCodeTypes();
    }, []);
    const filteredTypes = costCodeTypes.filter((t) =>
        t.costCodeName?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setType({ id: null, costCodeName: "", active: true });
        setOpenModal(true);
    };
    const handleEdit = (t) => {
        setIsEdit(true);
        setType({ ...t });
        setOpenModal(true);
    };
    const handleDelete = (t) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/costCodeType/edit`,
                { ...t, active: false },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Cost code type deactivated");
                fetchCostCodeTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to deactivate cost code type"
                )
            );
    };
    const handleReactivate = (t) => {
        axios
            .put(
                `${import.meta.env.VITE_API_BASE_URL}/costCodeType/edit`,
                { ...t, active: true },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(res.data || "Cost code type reactivated");
                fetchCostCodeTypes();
            })
            .catch((e) =>
                toast.error(
                    e?.response?.data || "Failed to reactivate cost code type"
                )
            );
    };
    const handleSave = () => {
        if (!type.costCodeName.trim()) return;

        if (isEdit) {
            axios
                .put(
                    `${import.meta.env.VITE_API_BASE_URL}/costCodeType/edit`,
                    type,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Cost code type updated");
                    fetchCostCodeTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Update failed")
                );
        } else {
            axios
                .post(
                    `${import.meta.env.VITE_API_BASE_URL}/costCodeType/add`,
                    type,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                    toast.success(res.data || "Cost code type created");
                    fetchCostCodeTypes();
                    setOpenModal(false);
                })
                .catch((e) =>
                    toast.error(e?.response?.data || "Save failed")
                );
        }
    };
    const typeForm = () => (
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
                            {isEdit
                                ? "Edit Cost Code Type"
                                : "Add Cost Code Type"}
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
                            Cost Code Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter cost code type name"
                            value={type.costCodeName}
                            onChange={(e) =>
                                setType((prev) => ({
                                    ...prev,
                                    costCodeName: e.target.value,
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
                            disabled={!type.costCodeName.trim()}
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
                    <span className="ms-2">Cost Code Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new cost code type</span>
                </button>
            </div>

            <div
                className="bg-white rounded-3 mt-5"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="tab-info">
                    <span className="ms-2">Cost Code Type</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by Cost Code Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredTypes.length} of {costCodeTypes.length} Cost Code Types
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredTypes.map((t, i) => (
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
                                        <span>{t.costCodeName}</span>
                                        <span
                                            className={
                                                t.active
                                                    ? "text-success"
                                                    : "text-muted"
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

                {openModal && typeForm()}
            </div>
        </div>
    );
}
export function CostCodeActivity() {
    const [activityGroups, setActivityGroups] = useState([]);
    const [costCodeTypes, setCostCodeTypes] = useState([]);

    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [activity, setActivity] = useState({
        id: null,
        costCodeTypeId: "",
        activityCode: "",
        activityName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchActivities = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/activityGroups`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) setActivityGroups(r.data || []);
            })
            .catch(() => toast.error("Failed to load cost code activities"));
    };
    const fetchCostCodeTypes = () => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((r) => {
                if (r.status === 200) setCostCodeTypes(r.data || []);
            })
            .catch(() => toast.error("Failed to load cost code types"));
    };
    useEffect(() => {
        fetchActivities();
        fetchCostCodeTypes();
    }, []);
    const filteredActivity = activityGroups.filter(
        (a) =>
            a.activityName?.toLowerCase().includes(search.toLowerCase()) ||
            a.activityCode?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setActivity({
            id: null,
            costCodeTypeId: "",
            activityCode: "",
            activityName: "",
            active: true,
        });
        setOpenModal(true);
    };
    const handleEdit = (a) => {
    setIsEdit(true);
    setActivity({
        id: a.id, // MUST NOT BE NULL
        costCodeTypeId: a.costCodeType?.id || a.costCodeTypeId,
        activityCode: a.activityCode,
        activityName: a.activityName,
        active: a.active,
    });
    setOpenModal(true);
};
const handleDelete = (a) => {
    const currentToken = sessionStorage.getItem("token");
    
    // We create a clean payload so we don't send nested objects
    const payload = {
        id: a.id,
        activityCode: a.activityCode,
        activityName: a.activityName,
        // Extract the ID from the object if it exists, otherwise use the field
        costCodeTypeId: a.costCodeType?.id || a.costCodeTypeId, 
        active: false 
    };

    axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/activityGroups/edit`, payload, {
            headers: { Authorization: `Bearer ${currentToken}` }
        })
        .then(() => {
            toast.success("Activity deactivated");
            fetchActivities();
        })
        .catch((e) => toast.error(e?.response?.data || "Failed to deactivate"));
};

const handleReactivate = (a) => {
    const currentToken = sessionStorage.getItem("token");
    
    const payload = {
        id: a.id,
        activityCode: a.activityCode,
        activityName: a.activityName,
        costCodeTypeId: a.costCodeType?.id || a.costCodeTypeId,
        active: true 
    };

    axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/activityGroups/edit`, payload, {
            headers: { Authorization: `Bearer ${currentToken}` }
        })
        .then(() => {
            toast.success("Activity reactivated");
            fetchActivities();
        })
        .catch((e) => toast.error(e?.response?.data || "Failed to reactivate"));
};

const handleSave = () => {
    // 1. ALWAYS get a fresh token inside the function to avoid using a stale one
    const currentToken = sessionStorage.getItem("token"); 

    if (!currentToken) {
        toast.error("Session expired. Please log in again.");
        return;
    }

    // 2. Simple Validation
    if (!activity.costCodeTypeId || !activity.activityCode.trim() || !activity.activityName.trim()) {
        toast.warning("Please fill in all required fields.");
        return;
    }

    // 3. CLEAN PAYLOAD: Do not spread the whole object. Only send these fields.
    const payload = {
        id: activity.id, 
        activityCode: activity.activityCode,
        activityName: activity.activityName,
        costCodeTypeId: activity.costCodeTypeId,
        active: activity.active
    };

    // 4. Correct Header Config
    const config = {
        headers: { Authorization: `Bearer ${currentToken}` }
    };

    const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/activityGroups`;

    if (isEdit) {
        // Use the PUT endpoint
        axios
            .put(`${baseUrl}/edit`, payload, config)
            .then((res) => {
                toast.success("Activity updated successfully");
                fetchActivities(); // Refresh the list
                setOpenModal(false);
            })
            .catch((e) => {
                console.error("Full Error Response:", e.response);
                // This will tell you if it's a token issue or a permission issue
                const errorMsg = e?.response?.data?.message || e?.response?.data || "Unauthorized Update";
                toast.error(errorMsg);
            });
    } else {
        // Use the POST endpoint for new entries
        axios
            .post(baseUrl, payload, config)
            .then((res) => {
                toast.success("Activity created successfully");
                fetchActivities();
                setOpenModal(false);
            })
            .catch((e) => toast.error("Save failed"));
    }
};
    const costCodeTypeOptions = costCodeTypes.map((t) => ({
        value: t.id,
        label: t.costCodeName,
    }));
    const activityForm = () => (
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
                            {isEdit
                                ? "Edit Cost Code Activity"
                                : "Add Cost Code Activity"}
                        </p>
                        <button
                            className="modal-close-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="projectform-select d-block">
                                Cost Code Type <span className="text-danger">*</span>
                            </label>
                            <Select
                                options={costCodeTypeOptions}
                                placeholder="Select Cost Code Type"
                                classNamePrefix="select"
                                isClearable
                                isDisabled={isEdit}
                                value={costCodeTypeOptions.find(
                                    (o) => o.value === activity.costCodeTypeId
                                )}
                                onChange={(opt) =>
                                    setActivity((p) => ({
                                        ...p,
                                        costCodeTypeId: opt ? opt.value : "",
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="projectform d-block">
                                Activity Code <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-input w-100"
                                value={activity.activityCode}
                                onChange={(e) =>
                                    setActivity((p) => ({
                                        ...p,
                                        activityCode: e.target.value.toUpperCase(),
                                    }))
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label className="projectform d-block">
                                Activity Name <span className="text-danger">*</span>
                            </label>
                            <input
                                className="form-input w-100"
                                value={activity.activityName}
                                onChange={(e) =>
                                    setActivity((p) => ({
                                        ...p,
                                        activityName: e.target.value,
                                    }))
                                }
                            />
                        </div>
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
                                !activity.costCodeTypeId ||
                                !activity.activityCode.trim() ||
                                !activity.activityName.trim()
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
                    <span className="ms-2">Cost Code Activity</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new cost code</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info">
                    <span className="ms-2">Cost Code Activity</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by Activity Name or Code"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredActivity.length} of {activityGroups.length} Activities
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredActivity.map((a) => (
                        <div className="col-lg-4 mb-3" key={a.id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            onClick={() => handleEdit(a)}
                                            style={{ cursor: "pointer" }}
                                        />
                                        {a.active ? (
                                            <Trash2
                                                size={18}
                                                onClick={() => handleDelete(a)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ) : (
                                            <RotateCcw
                                                size={18}
                                                onClick={() => handleReactivate(a)}
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                            />
                                        )}
                                    </div>

                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>
                                            ({a.activityCode}) {a.activityName}
                                        </span>
                                        <span
                                            className={
                                                a.active
                                                    ? "text-success"
                                                    : "text-muted"
                                            }
                                        >
                                            {a.active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {openModal && activityForm()}
            </div>
        </div>
    );
}