import { ArrowLeft, Edit, Plus, Trash2, X, Ban, RotateCcw, Eye } from "lucide-react";
import { useRegions } from "../Context/RegionsContext";
import { useCallback, useEffect, useState } from "react";
import { useSectors } from "../Context/SectorsContext";
import { useScope } from "../Context/ScopeContext";
import { useUom } from "../Context/UomContext";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function Region() {
    const [regions, setRegions] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [region, setRegion] = useState({
        id: null,
        regionName: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchRegion = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/regions`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setRegions(Array.isArray(res.data) ? res.data : res.data.data || []);
        });
    }, []);
    useEffect(() => {
        fetchRegion();
    }, [fetchRegion])
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
                window.location.reload();
            })
            .catch((e) => toast.error(e?.response?.data));
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
                window.location.reload();
            })
            .catch((e) => toast.error(e?.response?.data));
    };
    const handleSave = () => {
        if (!region.regionName.trim()) return;

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        if (isEdit) {
            axios
                .put(`${import.meta.env.VITE_API_BASE_URL}/region/edit`, region, config)
                .then((res) => {
                    toast.success(res.data || "Region updated");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) => toast.error(e?.response?.data || "Update failed"));
        } else {
            axios
                .post(`${import.meta.env.VITE_API_BASE_URL}/addRegion`, region, config)
                .then((res) => {
                    toast.success(res.data || "Region created");
                    setOpenModal(false);
                    window.location.reload();
                })
                .catch((e) => toast.error(e?.response?.data || "Save failed"));
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
                            placeholder="Search Region"
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
    const [sectors, setSectors] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [sector, setSector] = useState({
        id: null,
        sectorName: "",
        active: true,
    });
    const [showFieldsModal, setShowFieldsModal] = useState(false);
    const [showAddFieldsModal, setShowAddFieldsModal] = useState(false);
    const [selectedSector, setSelectedSector] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectorFields, setSectorFields] = useState([]);
    const [fieldData, setFieldData] = useState({
        id: null,
        fieldName: "",
        fieldType: null,
        mandatory: false,
        active: true,
        fieldSection: null
    });
    const [fieldTypeOptions, setFieldTypeOptions] = useState([]);
    const [fieldSectionOptions, setFieldSectionOptions] = useState([]);
    const token = sessionStorage.getItem("token");
    const fetchSector = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/sectors`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setSectors(Array.isArray(res.data) ? res.data : res.data.data || []);
        });
    }, []);

    const fetchFieldTypes = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/fieldType`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            const types = Array.isArray(res.data) ? res.data : res.data.data || [];
            const options = types.map(t => {
                if (t.code && t.label) return { value: t.code, label: t.label };
                const val = typeof t === 'string' ? t : (t.name || t.type || t);
                return { value: val, label: val };
            });
            setFieldTypeOptions(options);
        }).catch(err => console.error("Error fetching field types:", err));
    }, [token]);

    const fetchFieldSections = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/fieldSection`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            const sections = Array.isArray(res.data) ? res.data : res.data.data || [];
            const options = sections.map(s => {
                if (s.code && s.label) return { value: s.code, label: s.label };
                const val = typeof s === 'string' ? s : (s.name || s.type || s);
                return { value: val, label: val };
            });
            setFieldSectionOptions(options);
        }).catch(err => console.error("Error fetching field sections:", err));
    }, [token]);

    useEffect(() => {
        fetchSector();
        fetchFieldTypes();
        fetchFieldSections();
    }, [fetchSector, fetchFieldTypes, fetchFieldSections]);
    const filteredSectors = sectors.filter((sec) =>
        sec.sectorName?.toLowerCase().includes(search.toLowerCase())
    );
    const handleAdd = () => {
        setIsEdit(false);
        setSector({ id: null, sectorName: "", active: true });
        setOpenModal(true);
    };
    const handleViewFields = (sec, sectionCode) => {
        setSelectedSector(sec);
        setSelectedSection(sectionCode);
        setSectorFields([]);
        setShowFieldsModal(true);
        fetchSectorFields(sec.id);
    };

    const fetchSectorFields = (sectorId) => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/sector/fields/${sectorId}`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            const fields = Array.isArray(res.data) ? res.data : res.data.data || [];
            setSectorFields(fields);
        }).catch(err => console.error("Error fetching sector fields:", err));
    };

    const handleEditField = (field) => {
        setFieldData({
            id: field.id,
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            mandatory: field.mandatory,
            active: field.active !== undefined ? field.active : true,
            fieldSection: field.fieldSection
        });
        setShowAddFieldsModal(true);
    };

    const handleAddFieldSave = () => {
        if (!fieldData.fieldName.trim() || (selectedSection !== 'DOCUMENTS' && !fieldData.fieldType)) return;

        const payload = {
            id: fieldData.id || null,
            fieldName: fieldData.fieldName,
            fieldType: selectedSection === 'DOCUMENTS' ? 'FILE' : fieldData.fieldType,
            mandatory: fieldData.mandatory || false,
            active: fieldData.active !== undefined ? fieldData.active : true,
            sectorId: selectedSector.id,
            fieldSection: selectedSection
        };

        axios
            .post(
                `${import.meta.env.VITE_API_BASE_URL}/sector/fields`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(typeof res.data === 'string' ? res.data : (fieldData.id ? "Field updated successfully" : "Field added successfully"));
                setShowAddFieldsModal(false);
                fetchSectorFields(selectedSector.id);
            })
            .catch((e) => toast.error(e?.response?.data || "Failed to save field"));
    };

    const handleToggleFieldActive = (field, isActive) => {
        const payload = {
            id: field.id,
            fieldName: field.fieldName,
            fieldType: field.fieldType,
            mandatory: field.mandatory,
            active: isActive,
            sectorId: selectedSector.id,
            fieldSection: field.fieldSection
        };

        axios
            .post(
                `${import.meta.env.VITE_API_BASE_URL}/sector/fields`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
                toast.success(isActive ? "Field reactivated" : "Field deactivated");
                fetchSectorFields(selectedSector.id);
            })
            .catch((e) => toast.error(e?.response?.data || "Failed to update field status"));
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
                    `${import.meta.env.VITE_API_BASE_URL}/sector`,
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
                            placeholder="Search Sector"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        {filteredSectors.length} of {sectors.length} Sectors
                    </div>
                </div>

                {/* Table */}
                <div className="row ms-1 me-1 mt-3">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-header-primary">
                                <tr>
                                    <th>S.No</th>
                                    <th>Sector</th>
                                    <th>Tech fields</th>
                                    <th>ROI</th>
                                    <th>Documents</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSectors.map((sec, i) => (
                                    <tr key={sec.id || i}>
                                        <td>{i + 1}</td>
                                        <td>{sec.sectorName}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm view-conversion-btn"
                                                onClick={() => handleViewFields(sec, 'TECH')}
                                            >
                                                <Eye size={16} className="me-1" /> View Fields
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm view-conversion-btn"
                                                onClick={() => handleViewFields(sec, 'ROI')}
                                            >
                                                <Eye size={16} className="me-1" /> View Fields
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm view-conversion-btn"
                                                onClick={() => handleViewFields(sec, 'DOCUMENTS')}
                                            >
                                                <Eye size={16} className="me-1" /> View Fields
                                            </button>
                                        </td>
                                        <td>
                                            <Edit
                                                size={18}
                                                className="me-3 text-primary cursor-pointer"
                                                onClick={() => handleEdit(sec)}
                                            />
                                            {sec.active ? (
                                                <Trash2
                                                    size={18}
                                                    className="text-danger cursor-pointer"
                                                    onClick={() => handleDelete(sec)}
                                                />
                                            ) : (
                                                <RotateCcw
                                                    size={18}
                                                    onClick={() => handleReactivate(sec)}
                                                    className="text-primary cursor-pointer"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredSectors.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No sectors found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {openModal && sectorForm()}

                {showFieldsModal && (
                    <div
                        className="modal fade show d-block modal-overlay-primary"
                        onClick={() => setShowFieldsModal(false)}
                    >
                        <div
                            className="modal-dialog modal-lg modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content rounded-3">
                                <div className="modal-header d-flex justify-content-between">
                                    <p className="fw-bold mb-0">
                                        {fieldSectionOptions.find(o => o.value === selectedSection)?.label || selectedSection} Fields for {selectedSector?.sectorName || ""}
                                    </p>
                                    <button
                                        className="modal-close-btn"
                                        onClick={() => setShowFieldsModal(false)}
                                    >
                                        <X />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex justify-content-end mb-3">
                                        <button
                                            className="btn action-button d-flex align-items-center"
                                            onClick={() => {
                                                setFieldData({ id: null, fieldName: "", fieldType: null, mandatory: false, active: true, fieldSection: selectedSection });
                                                setShowAddFieldsModal(true);
                                            }}
                                        >
                                            <Plus size={16} className="me-1" /> Add fields
                                        </button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="table-header-primary">
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>{selectedSection === 'DOCUMENTS' ? 'Document Name' : 'Field Name'}</th>
                                                    {selectedSection !== 'DOCUMENTS' && <th>Field Type</th>}
                                                    <th>Mandatory</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(sectorFields.filter(f => f.fieldSection === selectedSection)?.length > 0) ? (
                                                    sectorFields.filter(f => f.fieldSection === selectedSection).map((field, index) => (
                                                        <tr key={field.id || index}>
                                                            <td>{index + 1}</td>
                                                            <td>{field.fieldName}</td>
                                                            {selectedSection !== 'DOCUMENTS' && <td>{field.fieldType}</td>}
                                                            <td>{field.mandatory ? 'Yes' : 'No'}</td>
                                                            <td className={field.active === false ? "text-danger" : "text-success"}>
                                                                {field.active === false ? 'Inactive' : 'Active'}
                                                            </td>
                                                            <td>
                                                                <Edit
                                                                    size={18}
                                                                    className="me-3 text-primary cursor-pointer"
                                                                    onClick={() => handleEditField(field)}
                                                                />
                                                                {field.active !== false ? (
                                                                    <Trash2
                                                                        size={18}
                                                                        className="text-danger cursor-pointer"
                                                                        onClick={() => handleToggleFieldActive(field, false)}
                                                                    />
                                                                ) : (
                                                                    <RotateCcw
                                                                        size={18}
                                                                        className="text-primary cursor-pointer"
                                                                        onClick={() => handleToggleFieldActive(field, true)}
                                                                    />
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center text-muted">No matching fields found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showAddFieldsModal && (
                    <div
                        className="modal fade show d-block modal-overlay-secondary"
                        onClick={() => setShowAddFieldsModal(false)}
                    >
                        <div
                            className="modal-dialog modal-md modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content rounded-3">
                                <div className="modal-header d-flex justify-content-between">
                                    <p className="fw-bold mb-0">{fieldData.id ? "Edit Field" : "Add Field"}</p>
                                    <button
                                        className="modal-close-btn"
                                        onClick={() => setShowAddFieldsModal(false)}
                                    >
                                        <X />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="projectform d-block mb-1">Sector</label>
                                        <input
                                            type="text"
                                            className="form-input w-100 bg-light"
                                            value={selectedSector?.sectorName || ""}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="projectform d-block mb-1">
                                            {selectedSection === 'DOCUMENTS' ? 'Document Name' : 'Field Name'} <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-input w-100"
                                            value={fieldData.fieldName}
                                            placeholder={selectedSection === 'DOCUMENTS' ? 'Enter Document Name' : 'Enter Field Name'}
                                            onChange={(e) => setFieldData({ ...fieldData, fieldName: e.target.value })}
                                        />
                                    </div>
                                    {selectedSection !== 'DOCUMENTS' && (
                                        <div className="mb-3">
                                            <label className="projectform-select d-block mb-1">
                                                Field Type <span className="text-danger">*</span>
                                            </label>
                                            <Select
                                                classNamePrefix="select"
                                                options={fieldTypeOptions}
                                                value={fieldTypeOptions.find(opt => opt.value === fieldData.fieldType) || null}
                                                onChange={(opt) => setFieldData({ ...fieldData, fieldType: opt ? opt.value : null })}
                                                placeholder="Select Type"
                                                isClearable
                                            />
                                        </div>
                                    )}
                                    <div className="mb-2 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2 mt-0"
                                            id="mandatoryCheck"
                                            checked={fieldData.mandatory}
                                            onChange={(e) => setFieldData({ ...fieldData, mandatory: e.target.checked })}
                                        />
                                        <label className="projectform mb-0" htmlFor="mandatoryCheck">
                                            Mandatory Field
                                        </label>
                                    </div>
                                    <div className="mb-2 d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            className="form-check-input me-2 mt-0"
                                            id="activeCheck"
                                            checked={fieldData.active !== undefined ? fieldData.active : true}
                                            onChange={(e) => setFieldData({ ...fieldData, active: e.target.checked })}
                                        />
                                        <label className="projectform mb-0" htmlFor="activeCheck">
                                            Active
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn cancel-button"
                                        onClick={() => setShowAddFieldsModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn action-button"
                                        onClick={handleAddFieldSave}
                                        disabled={!fieldData.fieldName.trim() || (selectedSection !== 'DOCUMENTS' && !fieldData.fieldType)}
                                    >
                                        {fieldData.id ? "Update" : "Save"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export function Scopes() {
    const [scopes, setScopes] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [scopeData, setScopeData] = useState({
        id: null,
        scope: "",
        active: true,
    });
    const token = sessionStorage.getItem("token");
    const fetchScope = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/scopes`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setScopes(Array.isArray(res.data) ? res.data : res.data.data || []);
        });
    }, []);
    useEffect(() => {
        fetchScope();
    }, [fetchScope])
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
                    `${import.meta.env.VITE_API_BASE_URL}/scope`,
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
                            placeholder="Search Scope"
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
    const [uoms, setUoms] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [uomData, setUomData] = useState({
        id: null,
        uomName: "",
        uomCode: "",
        active: true,
    });
    const [showConversionModal, setShowConversionModal] = useState(false);
    const [showAddConversionModal, setShowAddConversionModal] = useState(false);
    const [selectedConversionUom, setSelectedConversionUom] = useState(null);
    const [conversions, setConversions] = useState([]);
    const [conversionData, setConversionData] = useState({
        id: null,
        convertTo: null,
        formula: ""
    });
    const token = sessionStorage.getItem("token");
    const fetchUom = useCallback(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/uoms`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setUoms(Array.isArray(res.data) ? res.data : res.data.data || []);
        });
    }, [token]);

    useEffect(() => {
        fetchUom();
    }, [fetchUom]);
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
    const handleViewConversion = (uom) => {
        setSelectedConversionUom(uom);
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/uom/conversion/${uom.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            const data = res.data || [];
            const mapped = data.map(c => ({
                ...c,
                base: c.baseUom?.uomName || uom.uomName,
                convertTo: c.conversionUom?.uomName || uoms.find(u => u.id === c.conversionUomId)?.uomName || "Unknown",
                rawFormula: c.formula,
                formula: `x ${c.formula}`
            }));
            setConversions(mapped);
            setShowConversionModal(true);
        }).catch(() => {
            setConversions([]);
            setShowConversionModal(true);
        });
    };
    const handleEditConversion = (conv) => {
        setConversionData({
            id: conv.id,
            convertTo: conv.conversionUom?.id || conv.conversionUomId,
            formula: conv.rawFormula
        });
        setShowAddConversionModal(true);
    };
    const handleAddConversionSave = () => {
        if (!conversionData.convertTo || !conversionData.formula.trim()) return;
        const payload = {
            id: conversionData.id || null,
            baseUomId: selectedConversionUom.id,
            conversionUomId: conversionData.convertTo,
            formula: conversionData.formula
        };
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/uom/conversion/add`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((res) => {
            toast.success(res.data || (conversionData.id ? "Conversion updated successfully" : "Conversion added successfully"));
            setConversions([...conversions.filter(c => c.id !== conversionData.id), {
                ...res.data,
                id: res.data?.id || conversionData.id || Date.now(),
                conversionUomId: conversionData.convertTo,
                base: selectedConversionUom.uomName,
                rawFormula: conversionData.formula,
                convertTo: uoms.find(u => u.id === conversionData.convertTo)?.uomName || "Unknown",
                formula: `x ${conversionData.formula}`
            }]);
            setShowAddConversionModal(false);
            setConversionData({ id: null, convertTo: null, formula: "" });
        }).catch((err) => {
            toast.error(err?.response?.data || "Failed to add conversion");
        });
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
                className="bg-white rounded-3 mt-5 uom-container"
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
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead className="table-header-primary">
                                <tr>
                                    <th>S.No</th>
                                    <th>UOM Code</th>
                                    <th>UOM Name</th>
                                    <th>Conversion</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnits.map((uom, i) => (
                                    <tr key={uom.id || i}>
                                        <td>{i + 1}</td>
                                        <td>{uom.uomCode}</td>
                                        <td>{uom.uomName}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm view-conversion-btn"
                                                onClick={() => handleViewConversion(uom)}
                                            >
                                                <Eye size={16} className="me-1" /> View Conversion
                                            </button>
                                        </td>
                                        <td>
                                            <Edit
                                                size={18}
                                                className="me-3 text-primary cursor-pointer"
                                                onClick={() => handleEdit(uom)}
                                            />
                                            {uom.active ? (
                                                <Trash2
                                                    size={18}
                                                    className="text-danger cursor-pointer"
                                                    onClick={() => handleDelete(uom)}
                                                />
                                            ) : (
                                                <RotateCcw
                                                    size={18}
                                                    onClick={() => handleReactivate(uom)}
                                                    className="text-primary cursor-pointer"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUnits.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No units found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {openModal && uomForm()}
                {showConversionModal && (
                    <div
                        className="modal fade show d-block modal-overlay-primary"
                        onClick={() => setShowConversionModal(false)}
                    >
                        <div
                            className="modal-dialog modal-lg modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content rounded-3">
                                <div className="modal-header d-flex justify-content-between">
                                    <p className="fw-bold mb-0">
                                        Conversions for {selectedConversionUom?.uomName || ""}
                                    </p>
                                    <button
                                        className="modal-close-btn"
                                        onClick={() => setShowConversionModal(false)}
                                    >
                                        <X />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="d-flex justify-content-end mb-3">
                                        <button
                                            className="btn action-button d-flex align-items-center"
                                            onClick={() => {
                                                setConversionData({ id: null, convertTo: null, formula: "" });
                                                setShowAddConversionModal(true);
                                            }}
                                        >
                                            <Plus size={16} className="me-1" /> Add conversion
                                        </button>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead className="table-header-primary">
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Base</th>
                                                    <th>Convert To</th>
                                                    <th>Conversion Formula</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {conversions.length > 0 ? (
                                                    conversions.map((conv, i) => (
                                                        <tr key={conv.id || i}>
                                                            <td>{i + 1}</td>
                                                            <td>{conv.base}</td>
                                                            <td>{conv.convertTo}</td>
                                                            <td>{conv.formula}</td>
                                                            <td>
                                                                <Edit size={16} className="me-3 text-primary cursor-pointer" onClick={() => handleEditConversion(conv)} />
                                                                <Trash2 size={16} className="text-danger cursor-pointer" />
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center text-muted">No conversions found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showAddConversionModal && (
                    <div
                        className="modal fade show d-block modal-overlay-secondary"
                        onClick={() => setShowAddConversionModal(false)}
                    >
                        <div
                            className="modal-dialog modal-md modal-dialog-centered"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-content rounded-3">
                                <div className="modal-header d-flex justify-content-between">
                                    <p className="fw-bold mb-0">{conversionData.id ? "Edit conversion" : "Add conversion"}</p>
                                    <button
                                        className="modal-close-btn"
                                        onClick={() => setShowAddConversionModal(false)}
                                    >
                                        <X />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="projectform d-block">Base Unit</label>
                                        <input
                                            className="form-input w-100 bg-light"
                                            value={selectedConversionUom?.uomName || ""}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="projectform-select d-block">
                                            Convert To <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            options={uoms.filter(u => u.id !== selectedConversionUom?.id).map(u => ({ value: u.id, label: u.uomName }))}
                                            placeholder="Select unit"
                                            classNamePrefix="select"
                                            isClearable
                                            value={uoms.filter(u => u.id !== selectedConversionUom?.id).map(u => ({ value: u.id, label: u.uomName })).find(o => o.value === conversionData.convertTo) || null}
                                            onChange={(opt) => setConversionData(p => ({ ...p, convertTo: opt ? opt.value : null }))}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="projectform d-block">Formula <span className="text-danger">*</span></label>
                                        <div className="d-flex align-items-center">
                                            <span
                                                className="fw-bold me-2"
                                            >
                                                x
                                            </span>
                                            <input
                                                className="form-input w-100"
                                                placeholder="Enter formula multiplier/expression"
                                                value={conversionData.formula}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/[a-zA-Z]/.test(val)) {
                                                        toast.warning("Alphabets are not allowed in the formula field");
                                                        return;
                                                    }
                                                    setConversionData(p => ({ ...p, formula: val }));
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        className="btn cancel-button"
                                        onClick={() => setShowAddConversionModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn action-button"
                                        onClick={handleAddConversionSave}
                                        disabled={!conversionData.convertTo || !conversionData.formula.trim()}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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

        const payload = {
            id: a.id,
            activityCode: a.activityCode,
            activityName: a.activityName,
            // Extract the ID from the object if it exists, otherwise use the field
            costCodeTypeId: a.costCodeType?.id || a.costCodeTypeId,
            active: false
        };

        axios
            .put(`${import.meta.env.VITE_API_BASE_URL}/activityGroup/edit`, payload, {
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
            .put(`${import.meta.env.VITE_API_BASE_URL}/activityGroup/edit`, payload, {
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

        const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/activityGroup`;

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
