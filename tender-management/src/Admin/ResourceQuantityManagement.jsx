import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Edit, Trash2, Ban, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";


export function ResourceNature() {
    const [resourceNature, setResourceNature] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [nature, setNature] = useState({
        id: null,
        natureName: "",
        active: true
    });

    const handleUnauthorized = () => {
        sessionStorage.clear();
        window.location.href = "/login";
    };

    const fetchResourceNature = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceNature`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            .then(res => {
                if (res.status === 200) setResourceNature(res.data);
            })
            .catch(err => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch resource natures.");
            });
    }, []);

    useEffect(() => {
        fetchResourceNature();
    }, [fetchResourceNature]);

    const filteredList = resourceNature.filter(n =>
        n.natureName?.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        setIsEdit(false);
        setNature({ id: null, natureName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (n) => {
        setIsEdit(true);
        setNature({ ...n });
        setOpenModal(true);
    };

    const handleDelete = (n) => {
        n.active = false;
        toast.info("Marked as inactive");
    };

    const handleSave = () => {
        if (!nature.natureName.trim()) return;

        if (isEdit) {
            console.log("Update Resource Nature:", nature);
        } else {
            console.log("Create Resource Nature:", nature);
        }

        setOpenModal(false);
    };

    const modalForm = () => (
        <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div className="modal-dialog modal-md" onClick={e => e.stopPropagation()}>
                <div className="modal-content rounded-3">
                    <div className="modal-header">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Resource Nature" : "Add Resource Nature"}
                        </p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>
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
                            value={nature.natureName}
                            onChange={(e) =>
                                setNature(prev => ({
                                    ...prev,
                                    natureName: e.target.value
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
                            disabled={!nature.natureName.trim()}
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
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Resource Natures</span>
                </div>

                <div className="row mt-3 p-4">
                    <div className="col-md-8">
                        <label>Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search by name"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-center justify-content-center">
                        {filteredList.length} of {resourceNature.length}
                    </div>
                </div>

                <div className="row p-4">
                    {filteredList.map((n, i) => (
                        <div className="col-md-4 mb-3" key={i}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit size={18} onClick={() => handleEdit(n)} />
                                        {n.active ? (
                                            <Trash2 size={18} onClick={() => handleDelete(n)} />
                                        ) : (
                                            <Ban size={18} className="text-muted" />
                                        )}
                                    </div>
                                    <div className="mt-2 d-flex justify-content-between">
                                        <span>{n.natureName}</span>
                                        <span className={`badge ${n.active ? "text-success" : "text-muted"}`}>
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
        active: true
    });

    const handleUnauthorized = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const fetchResourceTypes = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                if (res.status === 200) setResourceTypes(res.data);
            })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch resource types.");
            });
    }, [navigate]);

    useEffect(() => {
        fetchResourceTypes();
    }, [fetchResourceTypes]);

    const filteredResourceTypes = resourceTypes.filter(rt =>
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
        rt.active = false;
        setResourceTypes([...resourceTypes]);
    };

    const handleSave = () => {
        if (!resourceType.resourceTypeName.trim()) return;

        if (isEdit) {
            console.log("Update resource type:", resourceType);
        } else {
            console.log("Create resource type:", resourceType);
        }

        setOpenModal(false);
        fetchResourceTypes();
    };

    const resourceTypeForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Resource Type" : "Add Resource Type"}
                        </p>
                        <button className="modal-close-btn" onClick={() => setOpenModal(false)}>
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
                                setResourceType(prev => ({
                                    ...prev,
                                    resourceTypeName: e.target.value
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
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Resource Types</span>
                </div>

                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by resource type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredResourceTypes.length} of {resourceTypes.length} Resource Types
                        </p>
                    </div>
                </div>

                <div className="row ms-1 me-1 mt-3">
                    {filteredResourceTypes.map((rt, index) => (
                        <div className="col-lg-4 mb-3" key={index}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit size={18} onClick={() => handleEdit(rt)} />
                                        {rt.active ? (
                                            <Trash2 size={18} onClick={() => handleDelete(rt)} />
                                        ) : (
                                            <Ban size={18} className="text-muted" />
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <span>{rt.resourceTypeName}</span>
                                        <span className={`badge ${rt.active ? "text-success" : "text-muted"}`}>
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

    const [quantityTypes, setQuantityType] = useState([]);
    const [search, setSearch] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [quantity, setQuantity] = useState({
        id: null,
        quantityTypeName: "",
        active: true
    });

    const handleUnauthorized = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const fetchQuantityType = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                }
            })
            .then((res) => {
                if (res.status === 200) setQuantityType(res.data);
            })
            .catch((err) => {
                if (err?.response?.status === 401) handleUnauthorized();
                else toast.error("Failed to fetch quantity types.");
            });
    }, []);

    useEffect(() => {
        fetchQuantityType();
    }, [fetchQuantityType]);

    const handleAdd = () => {
        setIsEdit(false);
        setQuantity({ id: null, quantityTypeName: "", active: true });
        setOpenModal(true);
    };

    const handleEdit = (q) => {
        setIsEdit(true);
        setQuantity({ ...q });
        setOpenModal(true);
    };

    const handleDelete = (q) => {
        q.active = false;
        toast.info("Marked as inactive");
    };

    const handleSave = () => {
        if (!quantity.quantityTypeName.trim()) return;

        if (isEdit) {
            console.log("Update Quantity Type:", quantity);
        } else {
            console.log("Create Quantity Type:", quantity);
        }

        setOpenModal(false);
        fetchQuantityType();
    };

    const filteredList = quantityTypes.filter(q =>
    q.quantityType?.toLowerCase().includes(search.toLowerCase())
);


    const quantityForm = () => (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpenModal(false)}
        >
            <div className="modal-dialog modal-md" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content rounded-3">
                    <div className="modal-header d-flex justify-content-between">
                        <p className="fw-bold mb-0">
                            {isEdit ? "Edit Quantity Type" : "Add Quantity Type"}
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
                            Quantity Type Name <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Enter quantity type"
                            value={quantity.quantityTypeName}
                            onChange={(e) =>
                                setQuantity(prev => ({
                                    ...prev,
                                    quantityTypeName: e.target.value
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
                            disabled={!quantity.quantityTypeName.trim()}
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
                    <span className="ms-2">Quantity Type</span>
                </div>

                <button className="btn action-button" onClick={handleAdd}>
                    <Plus size={16} />
                    <span className="ms-2">Add Quantity Type</span>
                </button>
            </div>

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info col-12 h-100">
                    <span className="ms-2">Quantity Types</span>
                </div>

                <div className="row ms-1 me-1 mt-3 bg-white p-4 rounded-3">
                    <div className="col-lg-8">
                        <label>Search</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search quantity type"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center">
                        <p className="mb-0">
                            {filteredList.length} of {quantityTypes.length} Quantity Types
                        </p>
                    </div>
                </div>

                <div className="row ms-1 me-1 mt-3">
                    {filteredList.map((q, index) => (
                        <div className="col-lg-4 col-md-4 mb-3" key={index}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <Edit size={18} onClick={() => handleEdit(q)} />
                                        {q.active ? (
                                            <Trash2 size={18} onClick={() => handleDelete(q)} />
                                        ) : (
                                            <Ban size={18} className="text-muted" />
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-2">
                                        <span>{q.quantityType}</span>

                                        <span className={`badge ${q.active ? "text-success" : "text-muted"}`}>
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

  const [resourceForm, setResourceForm] = useState({
    resourceCode: "",
    resourceName: "",
    unitRate: "",
    resourceType: null,
    uom: null,
    quantityType: null
  });

  const fetchInitialData = useCallback(async () => {
    const token = sessionStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    const headers = { 
        Authorization: `Bearer ${token}`, 
        "Content-Type": "application/json" 
    };

    try {
      const [typeRes, resData] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, { headers }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/resources`, { headers })
      ]);

      setResourceTypes(typeRes.data.map(rt => ({ value: rt.id, label: rt.resourceTypeName })));
      setAllResources(resData.data);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      toast.error("Failed to load initial data");
    }
  }, [navigate]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const fetchDropdownMasters = async () => {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
        toast.error("No security token found.");
        return;
    }

    const headers = { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    try {
      const [uomRes, qtyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/uom`, { headers }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/quantityType`, { headers })
      ]);

      setUoms(uomRes.data.map(u => ({ 
        value: u.id, 
        label: u.uomName 
      })));

      setQuantityTypes(qtyRes.data.map(q => ({ 
        value: q.id, 
        label: q.quantityType 
      })));

    } catch (err) {
      console.error("Dropdown Fetch Error:", err.response);
      toast.error("Failed to load dropdown options. Authentication error.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/resources/${id}`, { headers });
      toast.success("Deleted successfully");
      fetchInitialData(); 
    } catch (err) {
      toast.error("Delete failed. You may not have permission.");
    }
  };

  const displayData = allResources.filter(r => {
    const matchesSearch = (r.resourceName || "").toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedResType ? r.resourceType?.id === selectedResType.value : true;
    return matchesSearch && matchesType;
  });

  const handleSaveResource = async () => {
    const { resourceCode, resourceName, unitRate, resourceType, uom, quantityType } = resourceForm;
    if (!resourceCode || !resourceName || !unitRate || !resourceType || !uom || !quantityType) {
      toast.warning("All fields are required");
      return;
    }

    const payload = {
      resourceCode,
      resourceName,
      unitRate: Number(unitRate),
      active: true,
      resourceType: { id: resourceType.value },
      uom: { id: uom.value },
      quantityType: { id: quantityType.value }
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/resources`, payload, {
        headers: { 
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            "Content-Type": "application/json"
        }
      });
      toast.success("Saved successfully!");
      setOpenModal(false);
      setResourceForm({ resourceCode: "", resourceName: "", unitRate: "", resourceType: null, uom: null, quantityType: null });
      fetchInitialData();
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <div className="container-fluid p-4 mt-3">
      <div className="d-flex align-items-center mb-4">
        <button onClick={() => navigate(-1)} className="btn btn-link p-0 me-2 text-dark shadow-none">
          <ArrowLeft size={18} />
        </button>
        <h5 className="fw-bold mb-0">Resources</h5>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="p-4 border-bottom">
          <div className="row g-3 align-items-end">
            <div className="col-lg-3">
              <label className="small fw-bold mb-2 text-muted">Resource Type</label>
              <Select options={resourceTypes} value={selectedResType} onChange={setSelectedResType} isClearable placeholder="All Types" />
            </div>
            <div className="col-lg-6">
              <label className="small fw-bold mb-2 text-muted">Search Resources</label>
              <input className="form-control" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="col-lg-3">
              <button className="btn btn-primary w-100 fw-bold" onClick={() => { setOpenModal(true); fetchDropdownMasters(); }}>
                <Plus size={18} className="me-2" /> Add Resource
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">S.No</th>
                <th>Resource Name</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayData.length > 0 ? displayData.map((r, i) => (
                <tr key={r.id}>
                  <td className="ps-4 text-muted">{i + 1}</td>
                  <td className="fw-bold">{r.resourceName}</td>
                  <td>
                    <span className={`badge rounded-pill ${r.active ? "bg-success-subtle text-success" : "bg-secondary-subtle text-muted"}`}>
                        {r.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button className="btn btn-link text-danger p-0 shadow-none" onClick={() => handleDelete(r.id)}>
                        <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">No resources found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header border-bottom-0">
                <h6 className="fw-bold mb-0">Add New Resource</h6>
                <button className="btn-close shadow-none" onClick={() => setOpenModal(false)} />
              </div>
              <div className="modal-body p-4 pt-0">
                <div className="row g-3">
                  <div className="col-md-6"><label className="small fw-bold mb-1">Resource Code</label><input className="form-control" value={resourceForm.resourceCode} onChange={e => setResourceForm(p => ({ ...p, resourceCode: e.target.value }))} /></div>
                  <div className="col-md-6"><label className="small fw-bold mb-1">Resource Name</label><input className="form-control" value={resourceForm.resourceName} onChange={e => setResourceForm(p => ({ ...p, resourceName: e.target.value }))} /></div>
                  <div className="col-md-6"><label className="small fw-bold mb-1">Unit Rate</label><input type="number" className="form-control" value={resourceForm.unitRate} onChange={e => setResourceForm(p => ({ ...p, unitRate: e.target.value }))} /></div>
                  <div className="col-md-6"><label className="small fw-bold mb-1">Resource Type</label><Select options={resourceTypes} value={resourceForm.resourceType} onChange={opt => setResourceForm(p => ({ ...p, resourceType: opt }))} /></div>
                  <div className="col-md-6"><label className="small fw-bold mb-1">UOM</label><Select options={uoms} value={resourceForm.uom} onChange={opt => setResourceForm(p => ({ ...p, uom: opt }))} /></div>
                  <div className="col-md-6"><label className="small fw-bold mb-1">Quantity Type</label><Select options={quantityTypes} value={resourceForm.quantityType} onChange={opt => setResourceForm(p => ({ ...p, quantityType: opt }))} /></div>
                </div>
              </div>
              <div className="modal-footer border-top-0">
                <button className="btn btn-light px-4" onClick={() => setOpenModal(false)}>Cancel</button>
                <button className="btn btn-primary px-4 fw-bold" onClick={handleSaveResource}>Save Resource</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
