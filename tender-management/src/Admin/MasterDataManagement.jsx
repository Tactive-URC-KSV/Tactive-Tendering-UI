import { ArrowLeft, Edit, Plus, Trash2, X, Ban } from "lucide-react";
import { useRegions } from "../Context/RegionsContext";
import { useEffect, useState } from "react";
import { useSectors } from "../Context/SectorsContext";
import { useScope } from "../Context/ScopeContext";
import { useUom } from "../Context/UomContext";
import axios from "axios";
import Select from "react-select";


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
    const filteredRegions = regions.filter(r =>
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

    /* 🗑️ Soft delete (Inactive) */
    const handleDelete = (r) => {
        // API call here → set active = false
        r.active = false;
        // trigger refresh if needed
    };

    const handleSave = () => {
        if (!region.regionName.trim()) return;

        if (isEdit) {
            console.log("Update region:", region);
        } else {
            console.log("Create region:", region);
        }

        setOpenModal(false);
    };

    const regionForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Region" : "Add Region"}
                        </p>

                        <button
                            type="button"
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
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter region name"
                            value={region.regionName}
                            onChange={(e) =>
                                setRegion(prev => ({
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

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Regions</span>
                </div>

                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8 col-md-8 col-sm-6">
                        <label className="fs-6 text-start">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Region Name"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredRegions.length} of {regions.length} Regions
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredRegions.map((r, index) => (
                        <div className="col-lg-4 col-md-4 mb-3" key={index}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit
                                            size={18}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleEdit(r)}
                                        />
                                        {r.active ? (
                                            <Trash2
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDelete(r)}
                                            />
                                        ) : (
                                            <Ban
                                                size={18}
                                                className="text-muted"
                                                title="Inactive"
                                            />
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <span>{r.regionName}</span>
                                        <span
                                            className={`badge ${r.active ? "text-success" : "text-muted"
                                                }`}
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

    /* 🔍 Filter */
    const filteredSectors = sectors.filter(sec =>
        sec.sectorName?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setSector({ id: null, sectorName: "", active: true });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (sec) => {
        setIsEdit(true);
        setSector({ ...sec });
        setOpenModal(true);
    };

    /* 🗑️ Soft delete → Inactive */
    const handleDelete = (sec) => {
        // API call → set active=false
        sec.active = false;
    };

    /* 💾 Save (Add / Edit) */
    const handleSave = () => {
        if (!sector.sectorName.trim()) return;

        if (isEdit) {
            console.log("Update sector:", sector);
        } else {
            console.log("Create sector:", sector);
        }

        setOpenModal(false);
    };

    /* 🪟 Modal */
    const sectorForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Sector" : "Add Sector"}
                        </p>
                        <button
                            type="button"
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
                                setSector(prev => ({
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

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Sectors</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8 col-md-8 col-sm-6">
                        <label className="fs-6">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Sector Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredSectors.length} of {sectors.length} Sectors
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredSectors.length > 0 ? (
                        filteredSectors.map((sec, index) => (
                            <div className="col-lg-4 col-md-4 mb-3" key={index}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <Edit
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(sec)}
                                            />

                                            {sec.active ? (
                                                <Trash2
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(sec)}
                                                />
                                            ) : (
                                                <Ban
                                                    size={18}
                                                    className="text-muted"
                                                    title="Inactive"
                                                />
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                            <span>{sec.sectorName}</span>
                                            <span
                                                className={`${sec.active ? "text-success" : "text-muted"
                                                    }`}
                                            >
                                                {sec.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center text-muted">
                            No sectors were found
                        </div>
                    )}
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

    /* 🔍 Filter */
    const filteredScopes = scopes.filter(s =>
        s.scope?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setScopeData({ id: null, scope: "", active: true });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (s) => {
        setIsEdit(true);
        setScopeData({ ...s });
        setOpenModal(true);
    };

    /* 🗑️ Soft delete (Inactive) */
    const handleDelete = (s) => {
        // API call → active=false
        s.active = false;
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!scopeData.scope.trim()) return;

        if (isEdit) {
            console.log("Update scope:", scopeData);
        } else {
            console.log("Create scope:", scopeData);
        }

        setOpenModal(false);
    };

    /* 🪟 Modal */
    const scopeForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Scope" : "Add Scope"}
                        </p>

                        <button
                            type="button"
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
                                setScopeData(prev => ({
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
            {/* Header */}
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Scope of packages</span>
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
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Scope of Packages</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8 col-md-8 col-sm-6">
                        <label className="fs-6">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Scope Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredScopes.length} of {scopes.length} Scope of packages
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredScopes.length > 0 ? (
                        filteredScopes.map((s, index) => (
                            <div className="col-lg-4 col-md-4 mb-3" key={index}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <Edit
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(s)}
                                            />

                                            {s.active ? (
                                                <Trash2
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(s)}
                                                />
                                            ) : (
                                                <Ban
                                                    size={18}
                                                    className="text-muted"
                                                    title="Inactive"
                                                />
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                            <span>{s.scope}</span>
                                            <span
                                                className={`${s.active ? "text-success" : "text-muted"
                                                    }`}
                                            >
                                                {s.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center text-muted">
                            No Scope of package were found
                        </div>
                    )}
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

    /* 🔍 Filter (Name OR Code) */
    const filteredUnits = uoms.filter(uom =>
        uom.uomName?.toLowerCase().includes(search.toLowerCase()) ||
        uom.uomCode?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setUomData({ id: null, uomName: "", uomCode: "", active: true });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (uom) => {
        setIsEdit(true);
        setUomData({ ...uom });
        setOpenModal(true);
    };

    /* 🗑️ Soft delete → Inactive */
    const handleDelete = (uom) => {
        // API call → active=false
        uom.active = false;
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!uomData.uomName.trim() || !uomData.uomCode.trim()) return;

        if (isEdit) {
            console.log("Update UOM:", uomData);
        } else {
            console.log("Create UOM:", uomData);
        }

        setOpenModal(false);
    };

    /* 🪟 Modal */
    const uomForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit UOM" : "Add UOM"}
                        </p>

                        <button
                            type="button"
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
                                type="text"
                                className="form-input w-100"
                                placeholder="Enter UOM name"
                                value={uomData.uomName}
                                onChange={(e) =>
                                    setUomData(prev => ({
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
                                type="text"
                                className="form-input w-100"
                                placeholder="Enter UOM code"
                                value={uomData.uomCode}
                                onChange={(e) =>
                                    setUomData(prev => ({
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
            {/* Header */}
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

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Unit of Measurements</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8 col-md-8 col-sm-6">
                        <label className="fs-6">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by UOM Name or Code"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredUnits.length} of {uoms.length} UOM&apos;s
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredUnits.length > 0 ? (
                        filteredUnits.map((uom, index) => (
                            <div className="col-lg-4 col-md-4 mb-3" key={index}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <Edit
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(uom)}
                                            />

                                            {uom.active ? (
                                                <Trash2
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(uom)}
                                                />
                                            ) : (
                                                <Ban
                                                    size={18}
                                                    className="text-muted"
                                                    title="Inactive"
                                                />
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                            <span>
                                                {uom.uomName} ({uom.uomCode})
                                            </span>
                                            <span
                                                className={`${uom.active ? "text-success" : "text-muted"
                                                    }`}
                                            >
                                                {uom.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center text-muted">
                            No Unit of Measurements were found
                        </div>
                    )}
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

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/listOfApprovals`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
        }).then(r => setListOfApprovals(r.data || []));
    }, []);

    const filteredDoc = listOfApprovals.filter(d =>
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
        doc.active = false; // API → active=false
    };

    const handleSave = () => {
        if (!approval.documentName.trim()) return;
        setOpenModal(false);
    };

    const modal = () => (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setOpenModal(false)}>
            <div className="modal-dialog modal-md" onClick={e => e.stopPropagation()}>
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">{isEdit ? "Edit Approval" : "Add Approval"}</p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}><X /></button>
                    </div>
                    <div className="modal-body">
                        <label className="projectform d-block">Document Name *</label>
                        <input
                            className="form-input w-100"
                            value={approval.documentName}
                            onChange={e => setApproval(p => ({ ...p, documentName: e.target.value }))}
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setOpenModal(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleSave} disabled={!approval.documentName.trim()}>
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
                <div className="fw-bold"><ArrowLeft size={16} /> <span className="ms-2">List Of Approvals</span></div>
                <button className="btn action-button" onClick={handleAdd}><Plus size={16} /> Add new approval doc</button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info"><span className="ms-2">List of Approval Documents</span></div>

                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input className="form-input w-100" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredDoc.length} of {listOfApprovals.length} documents
                    </div>
                </div>

                <div className="row ms-1 me-1 mt-3">
                    {filteredDoc.map((doc, i) => (
                        <div className="col-lg-4 mb-3" key={i}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit onClick={() => handleEdit(doc)} style={{ cursor: "pointer" }} />
                                        {doc.active
                                            ? <Trash2 onClick={() => handleDelete(doc)} style={{ cursor: "pointer" }} />
                                            : <Ban className="text-muted" />}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{doc.documentName}</span>
                                        <span className={doc.active ? "text-success" : "text-muted"}>
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

    /* 🔹 Fetch Cost Code Types */
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then((r) => {
                if (r.status === 200) {
                    setCostCodeTypes(r.data || []);
                }
            });
    }, []);

    /* 🔍 Search */
    const filteredTypes = costCodeTypes.filter((t) =>
        t.costCodeName?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
    const handleAdd = () => {
        setIsEdit(false);
        setType({ id: null, costCodeName: "", active: true });
        setOpenModal(true);
    };

    /* ✏️ Edit */
    const handleEdit = (t) => {
        setIsEdit(true);
        setType({ ...t });
        setOpenModal(true);
    };

    /* 🗑️ Soft delete → Inactive */
    const handleDelete = (t) => {
        // API call → active=false
        t.active = false;
        setCostCodeTypes([...costCodeTypes]); // force re-render
    };

    /* 💾 Save */
    const handleSave = () => {
        if (!type.costCodeName.trim()) return;

        if (isEdit) {
            console.log("Update Cost Code Type:", type);
            // PUT API
        } else {
            console.log("Create Cost Code Type:", type);
            // POST API
        }

        setOpenModal(false);
    };

    /* 🪟 Modal */
    const typeForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Cost Code Type" : "Add Cost Code Type"}
                        </p>

                        <button
                            type="button"
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
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Cost Code Type</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8 col-md-8 col-sm-6">
                        <label className="fs-6">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Cost Code Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredTypes.length} of {costCodeTypes.length} Cost Code Types
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredTypes.length > 0 ? (
                        filteredTypes.map((t, index) => (
                            <div className="col-lg-4 col-md-4 mb-3" key={index}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <Edit
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(t)}
                                            />

                                            {t.active ? (
                                                <Trash2
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(t)}
                                                />
                                            ) : (
                                                <Ban
                                                    size={18}
                                                    className="text-muted"
                                                    title="Inactive"
                                                />
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                            <span>{t.costCodeName}</span>
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
                        ))
                    ) : (
                        <div className="d-flex justify-content-center text-muted">
                            No Cost Code Types were found
                        </div>
                    )}
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

    /* 🔹 Fetch Cost Code Activities */
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/activityGroups`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then(r => {
                if (r.status === 200) {
                    setActivityGroups(r.data || []);
                }
            });
    }, []);

    /* 🔹 Fetch Cost Code Types (for dropdown) */
    useEffect(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/costCodeTypes`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            })
            .then(r => {
                if (r.status === 200) {
                    setCostCodeTypes(r.data || []);
                }
            });
    }, []);

    /* 🔍 Search */
    const filteredActivity = activityGroups.filter(a =>
        a.activityName?.toLowerCase().includes(search.toLowerCase()) ||
        a.activityCode?.toLowerCase().includes(search.toLowerCase())
    );

    /* ➕ Add */
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

    /* ✏️ Edit */
    const handleEdit = (a) => {
        setIsEdit(true);
        setActivity({
            id: a.id,
            costCodeTypeId: a.costCodeTypeId,
            activityCode: a.activityCode,
            activityName: a.activityName,
            active: a.active,
        });
        setOpenModal(true);
    };

    /* 🗑️ Soft Delete → Inactive */
    const handleDelete = (a) => {
        // API call → set active=false
        a.active = false;
        setActivityGroups([...activityGroups]);
    };

    /* 💾 Save */
    const handleSave = () => {
        if (
            !activity.costCodeTypeId ||
            !activity.activityCode.trim() ||
            !activity.activityName.trim()
        ) {
            return;
        }

        if (isEdit) {
            console.log("Update activity:", activity);
            // PUT API
        } else {
            console.log("Create activity:", activity);
            // POST API
        }

        setOpenModal(false);
    };
    const costCodeTypeOptions = costCodeTypes.map(type => ({
        value: type.id,
        label: type.costCodeName,
    }));


    /* 🪟 Modal */
    const activityForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div
                className="modal-dialog modal-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Cost Code Activity" : "Add Cost Code Activity"}
                        </p>

                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={() => setOpenModal(false)}
                        >
                            <X />
                        </button>
                    </div>

                    <div className="modal-body">

                        {/* Cost Code Type - React Select */}
                        <div className="position-relative mb-3">
                            <label className="projectform-select d-block">
                                Cost Code Type <span className="text-danger">*</span>
                            </label>
                            <Select
                                options={costCodeTypeOptions}
                                placeholder="Select Cost Code Type"
                                className="w-100"
                                classNamePrefix="select"
                                isClearable
                                isDisabled={isEdit}   // lock on edit
                                value={costCodeTypeOptions.find(
                                    opt => opt.value === activity.costCodeTypeId
                                )}
                                onChange={(option) =>
                                    setActivity(prev => ({
                                        ...prev,
                                        costCodeTypeId: option ? option.value : "",
                                    }))
                                }
                            />
                        </div>

                        {/* Activity Code */}
                        <div className="mb-3">
                            <label className="projectform d-block">
                                Activity Code <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input w-100"
                                placeholder="Enter activity code"
                                value={activity.activityCode}
                                onChange={(e) =>
                                    setActivity(prev => ({
                                        ...prev,
                                        activityCode: e.target.value.toUpperCase(),
                                    }))
                                }
                            />
                        </div>

                        {/* Activity Name */}
                        <div className="mb-3">
                            <label className="projectform d-block">
                                Activity Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input w-100"
                                placeholder="Enter activity name"
                                value={activity.activityName}
                                onChange={(e) =>
                                    setActivity(prev => ({
                                        ...prev,
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
            {/* Header */}
            <div className="d-flex justify-content-between">
                <div className="fw-bold">
                    <ArrowLeft size={16} />
                    <span className="ms-2">Cost code Activity</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add new cost code</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Cost Code Activity</span>
                </div>

                {/* Search */}
                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8 col-md-8 col-sm-6">
                        <label className="fs-6">Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by Activity Name or Code"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredActivity.length} of {activityGroups.length} Cost Code Activity
                        </p>
                    </div>
                </div>

                {/* Cards */}
                <div className="row ms-1 me-1 mt-3">
                    {filteredActivity.length > 0 ? (
                        filteredActivity.map((a, index) => (
                            <div className="col-lg-4 col-md-4 mb-3" key={index}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <Edit
                                                size={18}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEdit(a)}
                                            />
                                            {a.active ? (
                                                <Trash2
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => handleDelete(a)}
                                                />
                                            ) : (
                                                <Ban size={18} className="text-muted" />
                                            )}
                                        </div>

                                        <div className="d-flex justify-content-between mt-2">
                                            <span>
                                                ({a.activityCode}) - {a.activityName}
                                            </span>
                                            <span className={a.active ? "text-success" : "text-muted"}>
                                                {a.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="d-flex justify-content-center text-muted">
                            No Cost Code Activity were found
                        </div>
                    )}
                </div>

                {openModal && activityForm()}
            </div>
        </div>
    );
}