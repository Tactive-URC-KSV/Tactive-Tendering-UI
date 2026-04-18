import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft, Plus, X, Edit, Trash2, RotateCcw, ChevronDown, ChevronUp, Eye, Search } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select, { components } from 'react-select';
import AsyncSelect from 'react-select/async';

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
    const fetchResourceTypes = useCallback(() => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                if (res.status === 200) setResourceTypes(res.data || []);
            })
            .catch((err) => {
                toast.error("Failed to fetch resource types");
            });
    }, [token]);
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
                toast.error(e?.response?.data || "Deactivate failed");
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
                toast.error(e?.response?.data || "Save failed");
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
                                        <span>{rt.label || rt.resourceTypeName}</span>
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
export function Resources() {
    const navigate = useNavigate();

    const [resourceTypes, setResourceTypes] = useState([]);
    const [groupAttributesMap, setGroupAttributesMap] = useState({});
    const [uoms, setUoms] = useState([]);
    const [allResources, setAllResources] = useState([]);
    const [selectedResType, setSelectedResType] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
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

    // Pagination state
    const [page, setPage] = useState(0);
    const [pageSize] = useState(30);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchInitialData = useCallback(() => {
        if (!selectedResType && !debouncedSearch) return;
        setLoading(true);
        const endpoint = debouncedSearch ? "/resources/search" : "/resources";
        const params = {
            page,
            size: pageSize,
            ...(debouncedSearch ? { search: debouncedSearch } : { resourceType: selectedResType?.value || null })
        };
        axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            params
        })
            .then(resData => {
                const data = resData.data;
                if (data?.content) {
                    setAllResources(data.content);
                    setTotalPages(data.totalPages || 0);
                    setTotalElements(data.totalElements || 0);
                } else {
                    setAllResources(data || []);
                }
            })
            .catch(err => {
                toast.error("Failed to load resources");
            })
            .finally(() => setLoading(false));
    }, [navigate, page, pageSize, selectedResType, debouncedSearch, resourceTypes.length]);

    // Debounce search logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 200);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(0);
    }, [selectedResType, debouncedSearch]);

    useEffect(() => {
        // Fetch Master Data once
        setLoading(true);
        axios.all([
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/resourceType`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            }),
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/uoms`, {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            })
        ]).then(axios.spread((typeRes, uomRes) => {
            const types = typeRes.data.map(rt => ({
                value: rt.code || rt.id,
                label: rt.label || rt.resourceTypeName
            }));
            const mappedUoms = uomRes.data.map(u => ({
                value: u.id,
                label: u.uomName && u.uomCode ? `${u.uomName} - ${u.uomCode}` : (u.uomName || u.uomCode)
            }));

            setResourceTypes(types);
            setUoms(mappedUoms);

            if (types.length > 0) {
                setSelectedResType(types[0]);
            }
        })).catch(err => {
            console.error("Failed to fetch master data", err);
        }).finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setPage(0);
    }, [selectedResType]);

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
                })
            ])
            .then(
                axios.spread((uomRes, typeRes) => {
                    setUoms(uomRes.data.map(u => ({
                        value: u.id,
                        label: u.uomName && u.uomCode ? `${u.uomName} - ${u.uomCode}` : (u.uomName || u.uomCode)
                    })));
                    setResourceTypes(typeRes.data.map(t => ({ value: t.code || t.id, label: t.label || t.resourceTypeName })));
                })
            )
            .catch(() => toast.error("Failed to load dropdowns"));
    };

    const loadAttributeGroups = (inputValue) => {
        return axios.get(`${import.meta.env.VITE_API_BASE_URL}/attributeGroup`, {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
            params: { search: inputValue || "", page: 0, size: 50 }
        }).then(res => {
            const data = res.data.content || res.data || [];
            return data.map(g => ({ 
                value: g.id, 
                label: g.groupName, 
                attributes: (g.attributes || []).map(a => ({ value: a.id, label: a.attributeName }))
            }));
        }).catch(() => []);
    };

    const handleAdd = () => {
        fetchDropdownMasters();
        setIsEdit(false);
        setEditingId(null);
        setResourceForm({
            resourceCode: "",
            resourceName: "",
            resourceTypeId: null,
            uomId: null,
            active: true,
            attributes: [{ id: null, attributeGroupId: null, groupLabel: "", isMandatory: false, orderNo: '', selectedAttributes: [] }]
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
                const initialMap = { ...groupAttributesMap };
                const attributes = attrData.map(a => {
                    const groupId = a.attributeGroup?.id;
                    if (groupId && a.attributeGroup.attributes) {
                        initialMap[groupId] = a.attributeGroup.attributes.map(attr => ({ value: attr.id, label: attr.attributeName }));
                    }
                    return {
                        id: a.id,
                        attributeGroupId: groupId || null,
                        groupLabel: a.attributeGroup?.groupName || "",
                        isMandatory: a.mandatory,
                        orderNo: a.orderNo,
                        selectedAttributes: (a.attributes || []).map(sa => sa.id)
                    };
                });
                setGroupAttributesMap(initialMap);

                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: attributes.length > 0 ? attributes : [{ id: null, attributeGroupId: null, groupLabel: "", isMandatory: false, orderNo: '', selectedAttributes: [] }]
                });
                setActiveTab('general');
                setOpenModal(true);
            })
            .catch(err => {
                console.error(err);
                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: [{ id: null, attributeGroupId: null, groupLabel: "", isMandatory: false, orderNo: '', selectedAttributes: [] }]
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
                const initialMap = { ...groupAttributesMap };
                const attributes = attrData.map(a => {
                    const groupId = a.attributeGroup?.id;
                    if (groupId && a.attributeGroup.attributes) {
                        initialMap[groupId] = a.attributeGroup.attributes.map(attr => ({ value: attr.id, label: attr.attributeName }));
                    }
                    return {
                        id: a.id,
                        attributeGroupId: groupId || null,
                        groupLabel: a.attributeGroup?.groupName || "",
                        isMandatory: a.mandatory,
                        orderNo: a.orderNo,
                        selectedAttributes: (a.attributes || []).map(sa => sa.id)
                    };
                });
                setGroupAttributesMap(initialMap);

                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: attributes.length > 0 ? attributes : [{ id: null, attributeGroupId: null, groupLabel: "", isMandatory: false, orderNo: '', selectedAttributes: [] }]
                });
                setActiveTab('attributes');
                setOpenModal(true);
            })
            .catch(err => {
                setResourceForm({
                    resourceCode: r.resourceCode,
                    resourceName: r.resourceName,
                    resourceTypeId: r.resourceType?.id || null,
                    uomId: r.uom?.id || null,
                    active: r.active,
                    attributes: [{ id: null, attributeGroupId: null, groupLabel: "", isMandatory: false, orderNo: '', selectedAttributes: [] }]
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

                // Extract attributes from each assigned group directly from the response
                const allAttrs = assignments.map(assignment => {
                    const group = assignment.attributeGroup;
                    const assignedAttributes = assignment.attributes;
                    const attributesList = assignedAttributes && assignedAttributes.length > 0 
                        ? assignedAttributes.map(attr => attr.attributeName).join(", ") 
                        : "-";

                    return {
                        id: assignment.id,
                        groupName: group ? group.groupName : "-",
                        attributeName: attributesList,
                        isMandatory: assignment.mandatory,
                        assignmentId: assignment.id, // Keep track of the assignment ID if needed
                        orderNo: assignment.orderNo,
                        active: group ? group.active : true
                    };
                });

                setGroupAttributes(allAttrs);
                setSelectedResource(r);
                setViewAttributeModal(true);
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
            attributes: [...prev.attributes, { id: null, attributeGroupId: null, groupLabel: "", isMandatory: false, orderNo: '', selectedAttributes: [] }]
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
        const { resourceCode, resourceName, resourceTypeId, uomId, active, attributes } = resourceForm;

        if (!resourceCode || !resourceName || !resourceTypeId || !uomId) {
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
                                mandatory: attr.isMandatory,
                                orderNo: attr.orderNo || 0
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


    const displayData = allResources;

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

            <div className="bg-white rounded-3 mt-5" style={{ border: "1px solid #0051973D" }}>
                <div className="tab-info text-white p-3 rounded-top" style={{ backgroundColor: "#005197" }}>
                    <span className="ms-2 fw-bold">Resources Management</span>
                </div>

                <div className="row align-items-center mt-3 px-4">
                    <div className="col-lg-4">
                        <label className="small fw-bold text-muted">Resource Type</label>
                        <Select
                            options={resourceTypes}
                            value={selectedResType}
                            onChange={setSelectedResType}
                            classNamePrefix={"select"}
                            isClearable
                            placeholder="All Types"
                        />
                    </div>
                    <div className="col-lg-4">
                        <label className="small fw-bold text-muted">Search</label>
                        <input
                            className="form-input w-100"
                            placeholder="Search Resources"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="col-lg-2 d-flex align-items-center justify-content-center">
                        <span className="fw-bold" style={{ color: '#005197' }}>Total Pages: {totalPages}</span>
                    </div>
                    <div className="col-lg-2 d-flex align-items-center justify-content-center gap-2 pt-3">
                        <button
                            className="btn btn-sm"
                            style={{ border: '1px solid #005197', color: '#005197' }}
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        <span className="btn btn-sm" style={{ backgroundColor: '#005197', color: '#fff' }}>{page + 1}</span>
                        <button
                            className="btn btn-sm"
                            style={{ border: '1px solid #005197', color: '#005197' }}
                            disabled={page >= totalPages - 1}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="px-4 pb-4 pt-3">
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle table-hover">
                            <thead className="table-header-primary">
                                <tr>
                                    <th style={{ width: '60px' }}>S.No</th>
                                    <th>Type</th>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>UOM</th>
                                    <th className="text-center">Status</th>
                                    <th className="text-center">Attribute</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="9" className="text-center py-4">Loading...</td></tr>
                                ) : displayData.length > 0 ? (
                                    displayData.map((r, i) => (
                                        <tr key={r.id}>
                                            <td>{page * pageSize + i + 1}</td>
                                            <td>
                                                {r.resourceType?.label ||
                                                    r.resourceType?.resourceTypeName ||
                                                    resourceTypes.find(t => t.value === r.resourceTypeId)?.label ||
                                                    r.resourceTypeId || "-"}
                                            </td>
                                            <td>{r.resourceCode || "N/A"}</td>
                                            <td>{r.resourceName}</td>
                                            <td>
                                                {r.uom?.uomCode ||
                                                    uoms.find(u => u.value === r.uomId)?.label ||
                                                    r.uomId || "-"}
                                            </td>

                                            <td className="text-center">
                                                <span className={`badge ${r.active ? 'bg-success' : 'bg-secondary'}`}>
                                                    {r.active ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="text-center">
                                                <button
                                                    className="btn btn-sm d-inline-flex align-items-center gap-1"
                                                    style={{ color: '#005197', border: '1px solid #005197' }}
                                                    onClick={() => handleViewAttributes(r)}
                                                    title="View Attributes"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </td>

                                            <td className="text-center">
                                                <Edit
                                                    size={18}
                                                    className="me-2 text-primary cursor-pointer"
                                                    onClick={() => handleEdit(r)}
                                                />
                                                {r.active ? (
                                                    <Trash2
                                                        size={18}
                                                        className="cursor-pointer text-danger"
                                                        onClick={() => toggleStatus(r)}
                                                    />
                                                ) : (
                                                    <RotateCcw
                                                        size={18}
                                                        className="cursor-pointer text-primary"
                                                        onClick={() => toggleStatus(r)}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="9" className="text-center py-4 text-muted">No resources found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Bottom Pagination */}
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                            <button
                                className="btn btn-sm"
                                style={{ border: '1px solid #005197', color: '#005197' }}
                                disabled={page === 0}
                                onClick={() => setPage(prev => prev - 1)}
                            >
                                Previous
                            </button>
                            <span className="btn btn-sm" style={{ backgroundColor: '#005197', color: '#fff' }}>{page + 1}</span>
                            <button
                                className="btn btn-sm"
                                style={{ border: '1px solid #005197', color: '#005197' }}
                                disabled={page >= totalPages - 1}
                                onClick={() => setPage(prev => prev + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
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
                                                <th>Order No</th>
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
                                                    <td>{attr.orderNo || "-"}</td>
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
                                                    <td colSpan="6" className="text-center text-muted">No attributes found.</td>
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
                    <div className="modal-dialog modal-xl modal-dialog-centered">
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
                                        <div className="col-md-3">
                                            <label className="projectform d-block">Code<span className="text-danger">*</span></label>
                                            <input className="form-input w-100" placeholder="Code"
                                                value={resourceForm.resourceCode}
                                                onChange={e => setResourceForm(p => ({ ...p, resourceCode: e.target.value }))} />
                                        </div>

                                        {/* 2. Name */}
                                        <div className="col-md-3">
                                            <label className="projectform d-block">Name<span className="text-danger">*</span></label>
                                            <input className="form-input w-100" placeholder="Name"
                                                value={resourceForm.resourceName}
                                                onChange={e => setResourceForm(p => ({ ...p, resourceName: e.target.value }))} />
                                        </div>

                                        <div className="col-md-3">
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

                                        <div className="col-md-3">
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
                                                        <th>Attributes</th>
                                                        <th style={{ width: '150px' }}>Order No</th>
                                                        <th style={{ width: '150px' }}>Mandatory</th>
                                                        <th style={{ width: '80px' }}>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {resourceForm.attributes.map((attr, idx) => {
                                                        const options = attr.attributeGroupId ? (groupAttributesMap[attr.attributeGroupId] || []) : [];
                                                        const selectedValue = options.filter(opt => (attr.selectedAttributes || []).includes(opt.value));
                                                        return (
                                                        <tr key={idx}>
                                                            <td>
                                                                <AsyncSelect
                                                                    cacheOptions
                                                                    defaultOptions
                                                                    loadOptions={loadAttributeGroups}
                                                                    classNamePrefix="select"
                                                                    placeholder="Select Attribute Group"
                                                                    value={attr.attributeGroupId ? { value: attr.attributeGroupId, label: attr.groupLabel || "Select" } : null}
                                                                    onChange={opt => {
                                                                        const groupId = opt?.value || null;
                                                                        updateAttributeRow(idx, 'attributeGroupId', groupId);
                                                                        updateAttributeRow(idx, 'groupLabel', opt?.label || "");
                                                                        updateAttributeRow(idx, 'selectedAttributes', []);
                                                                        
                                                                        if (groupId && opt?.attributes) {
                                                                            setGroupAttributesMap(prev => ({ ...prev, [groupId]: opt.attributes }));
                                                                        } else if (groupId && !groupAttributesMap[groupId]) {
                                                                            axios.get(`${import.meta.env.VITE_API_BASE_URL}/attribute/by-group/${groupId}`, {
                                                                                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
                                                                            }).then(res => {
                                                                                setGroupAttributesMap(prev => ({ ...prev, [groupId]: (res.data || []).map(a => ({ value: a.id, label: a.attributeName })) }));
                                                                            });
                                                                        }
                                                                    }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <Select
                                                                    isMulti
                                                                    options={options}
                                                                    classNamePrefix="select"
                                                                    placeholder="Select Attributes"
                                                                    value={selectedValue}
                                                                    onChange={selectedOptions => updateAttributeRow(idx, 'selectedAttributes', (selectedOptions || []).map(opt => opt.value))}
                                                                />
                                                            </td>
                                                            <td className="text-center align-middle">
                                                                <input
                                                                    type="number"
                                                                    className="form-control form-control-sm text-center"
                                                                    value={attr.orderNo || ''}
                                                                    onChange={e => updateAttributeRow(idx, 'orderNo', e.target.value ? Number(e.target.value) : '')}
                                                                    placeholder="1"
                                                                    min="0"
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
                                                    )})}
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
    const [groupAttributes, setGroupAttributes] = useState({});
    const [viewAttributesModal, setViewAttributesModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [modalSearch, setModalSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // Pagination state for attribute groups
    const [page, setPage] = useState(0);
    const [pageSize] = useState(30);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

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
    const fetchData = useCallback(() => {
        setLoading(true);
        const endpoint = debouncedSearch ? "/attributeGroup/search" : "/attributeGroup";
        const params = {
            page,
            size: pageSize,
            ...(debouncedSearch ? { search: debouncedSearch } : {})
        };

        axios.get(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
            params
        })
            .then((groupsRes) => {
                if (groupsRes.status === 200) {
                    const data = groupsRes.data;
                    if (data?.content) {
                        setAttributeGroups(data.content);
                        setTotalPages(data.totalPages || 0);
                        setTotalElements(data.totalElements || 0);
                    } else {
                        setAttributeGroups(data || []);
                    }
                }
            })
            .catch((err) => {
                toast.error("Failed to fetch attribute groups");
            })
            .finally(() => setLoading(false));
    }, [token, page, pageSize, debouncedSearch]);

    // Debounce search logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 200);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        setPage(0);
    }, [debouncedSearch]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const toggleGroup = (groupId, group) => {
        setSelectedGroup(group);
        setViewAttributesModal(true);

        // Load only once
        if (!groupAttributes[groupId]) {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/attribute/by-group/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    setGroupAttributes(prev => ({
                        ...prev,
                        [groupId]: res.data || []
                    }));
                })
                .catch(err => {
                    toast.error("Failed to load attributes");
                });
        }
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

        const openEditModal = (attrs) => {
            const selectedOptions = (attrs || []).map(attr => ({
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

        if (groupAttributes[group.id]) {
            openEditModal(groupAttributes[group.id]);
        } else {
            axios.get(`${import.meta.env.VITE_API_BASE_URL}/attribute/by-group/${group.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    const attrs = res.data || [];
                    setGroupAttributes(prev => ({ ...prev, [group.id]: attrs }));
                    openEditModal(attrs);
                })
                .catch(err => {
                    toast.error("Failed to load group attributes");
                });
        }
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
        const currentAttributes = groupAttributes[group.id] || [];
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
            <div className="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content rounded-3" style={{ maxHeight: '80vh' }}>
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
                        <div className="row align-items-center mt-3 px-4">
                            <div className="col-md-6">
                                <label>Search</label>
                                <input
                                    className="form-input w-100"
                                    placeholder="Search attribute group"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 d-flex align-items-center justify-content-center">
                                <span className="fw-bold" style={{ color: '#005197' }}>Total Pages: {totalPages}</span>
                            </div>
                            <div className="col-md-3 d-flex align-items-center justify-content-center gap-2">
                                <button
                                    className="btn btn-sm"
                                    style={{ border: '1px solid #005197', color: '#005197' }}
                                    disabled={page === 0}
                                    onClick={() => setPage(prev => prev - 1)}
                                >
                                    Previous
                                </button>
                                <span className="btn btn-sm" style={{ backgroundColor: '#005197', color: '#fff' }}>{page + 1}</span>
                                <button
                                    className="btn btn-sm"
                                    style={{ border: '1px solid #005197', color: '#005197' }}
                                    disabled={page >= totalPages - 1}
                                    onClick={() => setPage(prev => prev + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* Groups Table */}
                        <div className="px-4 pb-4 pt-3">

                            <div className="table-responsive">
                                <table className="table table-bordered align-middle">
                                    <thead className="table-header-primary">
                                        <tr>
                                            <th style={{ width: '60px' }}>S.No</th>
                                            <th>Group Code</th>
                                            <th>Group Name</th>
                                            <th>Attributes</th>
                                            <th className="text-center">Status</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                                        ) : attributeGroups.length > 0 ? (
                                            attributeGroups.map((group, idx) => (
                                                <tr key={group.id}>
                                                    <td>{page * pageSize + idx + 1}</td>
                                                    <td><span className="badge bg-light text-dark">{group.groupCode || 'N/A'}</span></td>
                                                    <td className="fw-bold">{group.groupName}</td>
                                                    <td className="text-center">
                                                        <button
                                                            className="btn btn-sm d-inline-flex align-items-center gap-1 mx-auto"
                                                            style={{ color: '#005197', border: '1px solid #005197' }}
                                                            onClick={() => toggleGroup(group.id, group)}
                                                        >
                                                            <Eye size={14} />
                                                            Show More
                                                        </button>
                                                    </td>
                                                    <td className="text-center">
                                                        <span className={`badge ${group.active ? 'bg-success' : 'bg-secondary'}`}>
                                                            {group.active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <Edit
                                                            size={18}
                                                            className="me-2 text-primary cursor-pointer"
                                                            onClick={(e) => handleEditGroup(e, group)}
                                                        />
                                                        {group.active ? (
                                                            <Trash2
                                                                size={18}
                                                                className="cursor-pointer text-danger"
                                                                onClick={() => handleGroupStatus(group)}
                                                            />
                                                        ) : (
                                                            <RotateCcw
                                                                size={18}
                                                                className="cursor-pointer text-primary"
                                                                onClick={() => handleGroupStatus(group)}
                                                            />
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="6" className="text-center py-4 text-muted">No attribute groups found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Bottom Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                                    <button
                                        className="btn btn-sm"
                                        style={{ border: '1px solid #005197', color: '#005197' }}
                                        disabled={page === 0}
                                        onClick={() => setPage(prev => prev - 1)}
                                    >
                                        Previous
                                    </button>
                                    <span className="btn btn-sm" style={{ backgroundColor: '#005197', color: '#fff' }}>{page + 1}</span>
                                    <button
                                        className="btn btn-sm"
                                        style={{ border: '1px solid #005197', color: '#005197' }}
                                        disabled={page >= totalPages - 1}
                                        onClick={() => setPage(prev => prev + 1)}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {viewAttributesModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow" style={{ maxHeight: '80vh' }}>
                            <div className="modal-header d-flex justify-content-between align-items-center" style={{ backgroundColor: '#005197', color: 'white' }}>
                                <h6 className="mb-0 fw-bold">
                                    Attributes in Group: {selectedGroup?.groupName}
                                </h6>
                                <button className="btn-close btn-close-white" onClick={() => {
                                    setViewAttributesModal(false);
                                    setModalSearch("");
                                }}></button>
                            </div>
                            <div className="modal-body p-0 d-flex flex-column" style={{ overflow: 'hidden' }}>
                                <div className="p-3 border-bottom bg-light sticky-top">
                                    <div className="position-relative" style={{ width: '300px' }}>
                                        <Search
                                            className="position-absolute"
                                            style={{ right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', zIndex: 1 }}
                                            size={18}
                                        />
                                        <input
                                            type="text"
                                            className="form-input w-100"
                                            placeholder="Search attributes in this group..."
                                            value={modalSearch}
                                            onChange={(e) => setModalSearch(e.target.value)}
                                            style={{ paddingRight: '30px' }}
                                            autoFocus
                                        />
                                        {modalSearch && (
                                            <button 
                                                className="btn position-absolute border-0" 
                                                style={{ right: '35px', top: '50%', transform: 'translateY(-50%)', background: 'transparent' }}
                                                onClick={() => setModalSearch("")}
                                                type="button"
                                            >
                                                <X size={16} className="text-muted" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Scrollable List */}
                                <div className="p-4 flex-grow-1" style={{ overflowY: 'auto' }}>
                                    <div className="row">
                                        {(() => {
                                            const attrs = groupAttributes[selectedGroup?.id] || [];
                                            const filtered = attrs.filter(a => 
                                                a.attributeName?.toLowerCase().includes(modalSearch.toLowerCase())
                                            );
                                            
                                            if (filtered.length > 0) {
                                                return filtered.map(attr => (
                                                    <div className="col-12 mb-2" key={attr.id}>
                                                        <div className="p-2 px-3 border rounded shadow-sm bg-white d-flex justify-content-between align-items-center hover-shadow-sm transition-all">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <div className="fw-bold text-dark">{attr.attributeName}</div>
                                                                <span className={`badge ${attr.active ? 'bg-success-subtle text-success border border-success' : 'bg-secondary-subtle text-muted border border-secondary'} rounded-pill`} style={{ fontSize: '0.7rem' }}>
                                                                    {attr.active ? 'Active' : 'Inactive'}
                                                                </span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Edit
                                                                    size={16}
                                                                    className="cursor-pointer text-muted"
                                                                    onClick={() => {
                                                                        handleEditAttribute(attr);
                                                                        setViewAttributesModal(false);
                                                                        setModalSearch("");
                                                                    }}
                                                                />
                                                                {attr.active ? (
                                                                    <Trash2
                                                                        size={16}
                                                                        className="cursor-pointer text-danger"
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
                                                ));
                                            } else {
                                                return (
                                                    <div className="col-12 text-center py-5">
                                                        <div className="text-muted fst-italic">
                                                            {modalSearch ? `No attributes matching "${modalSearch}"` : "No attributes found for this group."}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light">
                                <button className="btn btn-secondary px-4" onClick={() => {
                                    setViewAttributesModal(false);
                                    setModalSearch("");
                                }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {openModal && renderModal()}
        </div>
    );
}