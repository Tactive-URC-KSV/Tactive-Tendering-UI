import { Filter, List, Plus, Grid, Eye, Building } from "lucide-react";
import "../CSS/Styles.css";
import Select, { components } from "react-select";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const bluePrimary = "#005197";

function CompanyDetails() {
    const [isListView, setIsListView] = useState(true);
    const navigate = useNavigate();

    const [companyTypeOptions, setCompanyTypeOptions] = useState([]);
    const [companyLevelOptions, setCompanyLevelOptions] = useState([]);

    const [companyList, setCompanyList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCompanyType, setSelectedCompanyType] = useState(null);
    const [selectedCompanyLevel, setSelectedCompanyLevel] = useState(null);
    const [selectedSortBy, setSelectedSortBy] = useState({ value: 'nameAsc', label: 'Name (A-Z)' });
    const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);

    const toggleSortByDropdown = () => {
        setIsSortByDropdownOpen(!isSortByDropdownOpen);
    };

    const handleSortBySelect = (option) => {
        setSelectedSortBy(option);
        setIsSortByDropdownOpen(false);
    };

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const typeRes = await axios.get(`${baseUrl}/companyType`, { headers });
                const typeList = typeRes.data?.data ?? typeRes.data ?? [];
                setCompanyTypeOptions(
                    typeList.map((item) => ({ value: item.code, label: item.label }))
                );

                const levelRes = await axios.get(`${baseUrl}/companyLevel`, { headers });
                const levelList = levelRes.data || [];
                setCompanyLevelOptions(levelList);

            } catch (error) {
                console.error("Error fetching master data:", error);
            }
        };

        fetchData();
    }, [token, baseUrl]);

    useEffect(() => {
        if (!token) return;
        setIsLoading(true);
        axios.get(`${baseUrl}/companyDetails`, { headers })
            .then(response => {
                let data = response.data;
                if (data && !Array.isArray(data) && data.data && Array.isArray(data.data)) {
                    data = data.data;
                }
                setCompanyList(Array.isArray(data) ? data : []);
            })
            .catch(error => {
                console.error("Error fetching company list:", error);
                setCompanyList([]);
            })
            .finally(() => setIsLoading(false));
    }, [token, baseUrl]);


    const processedCompanyList = useMemo(() => {
        // 1. Filter
        let filtered = companyList.filter((item) => {
            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const name = item.companyName || "";
                const shortName = item.shortName || "";
                if (!name.toLowerCase().includes(query) && !shortName.toLowerCase().includes(query)) {
                    return false;
                }
            }

            // Company Type Filter
            if (selectedCompanyType) {
                if (item.comType !== selectedCompanyType.value) return false;
            }

            // Company Level Filter
            if (selectedCompanyLevel) {
                const levelId = item.companyLevel?.id;
                if (levelId !== selectedCompanyLevel.value) return false;
            }

            return true;
        });

        // 2. Sort
        return filtered.sort((a, b) => {
            if (!selectedSortBy) return 0;
            const { value } = selectedSortBy;

            switch (value) {
                case 'nameAsc':
                    return (a.companyName || "").localeCompare(b.companyName || "");
                case 'nameDesc':
                    return (b.companyName || "").localeCompare(a.companyName || "");
                case 'dateNewest':
                    const dateA = new Date(a.createdOn || a.createdAt || 0);
                    const dateB = new Date(b.createdOn || b.createdAt || 0);
                    return dateB - dateA;
                default:
                    return 0;
            }
        });

    }, [companyList, searchQuery, selectedCompanyType, selectedCompanyLevel, selectedSortBy]);

    const CardRow = ({ label, value }) => (
        <div className="d-flex justify-content-between mb-2">
            <span className="fw-bold" style={{ fontSize: "0.9rem", color: "#333" }}>{label} :</span>
            <span className="text-end" style={{ fontSize: "0.9rem", color: "#555" }}>{value || "-"}</span>
        </div>
    );

    const sortOptions = [
        { value: 'nameAsc', label: 'Name (A-Z)' },
        { value: 'nameDesc', label: 'Name (Z-A)' },
        { value: 'dateNewest', label: 'Created Date' },
    ];

    return (
        <div className="container-fluid mt-3 p-4 min-vh-100">
            <div className="ms-3 me-3 d-flex justify-content-between align-items-center">
                <div className="text-start fw-bold fs-5">Company Details</div>

                <div className="d-flex">
                    <button
                        className="btn action-button"
                        onClick={() => navigate("/company-form")}
                        style={{ backgroundColor: bluePrimary, color: "white" }}
                    >
                        <Plus color="#FFFFFF" size={18} />
                        <span className="ms-2">Add New Company</span>
                    </button>
                </div>
            </div>

            <div
                className="ms-3 me-3 bg-white rounded-3 mt-5 p-2"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="text-start fw-bold fs-6 ms-2 mt-2">
                    <Filter color="#005197" size={16} />
                    <span className="ms-2">Filter & Search</span>
                </div>

                <div className="row g-3 ms-2 mt-2 mb-4 me-2 d-flex justify-content-between">
                    <div className="col-lg-4 col-md-4">
                        <label className="projectform-select text-start d-block">Search Company</label>
                        <input
                            type="text"
                            className="form-input w-100"
                            placeholder="Search by company name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="col-lg-4 col-md-4">
                        <label className="projectform-select text-start d-block">Company Type</label>
                        <Select
                            options={companyTypeOptions}
                            onChange={setSelectedCompanyType}
                            value={selectedCompanyType}
                            placeholder="All company types"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>

                    <div className="col-lg-4 col-md-4 position-relative">
                        <label className="projectform-select text-start d-block">Company Level</label>
                        <Select
                            options={companyLevelOptions.map(l => ({ value: l.id, label: l.level }))}
                            onChange={setSelectedCompanyLevel}
                            value={selectedCompanyLevel}
                            placeholder="All company levels"
                            className="w-100"
                            classNamePrefix="select"
                            isClearable
                        />
                    </div>
                </div>
            </div>

            <div
                className="ms-3 me-3 bg-white rounded-3 mt-5 p-3"
                style={{ border: "1px solid #0051973D" }}
            >
                <div className="d-flex justify-content-between mb-3 align-items-center">
                    <div className="text-start fw-bold fs-6">Company List</div>

                    <div className="d-flex align-items-center">
                        <div className="me-3" style={{ color: '#005197', fontSize: '0.9rem' }}>
                            {processedCompanyList.length} Companies
                        </div>
                        <div className="me-3 position-relative" style={{ width: 'auto' }}>
                            <label style={{ fontSize: '0.85rem', marginRight: '5px', color: '#555' }}>Sort by: </label>
                            <button
                                className="change-view bg-light text-nowrap px-3 py-1 rounded-2 d-inline-flex align-items-center justify-content-between"
                                onClick={toggleSortByDropdown}
                                style={{ minWidth: '130px', cursor: 'pointer', border: 'none' }}
                            >
                                <span>{selectedSortBy.label}</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-chevron-down ms-2"
                                >
                                    <path d="m6 9 6 6 6-6"></path>
                                </svg>
                            </button>

                            {isSortByDropdownOpen && (
                                <div
                                    className="dropdown-menu show"
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        right: "0",
                                        left: "auto",
                                        minWidth: "140px",
                                        zIndex: 1000,
                                        padding: "4px 0",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    {sortOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            className="dropdown-item"
                                            onClick={() => handleSortBySelect(opt)}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: selectedSortBy.value === opt.value ? "#DBEAFE" : "white",
                                                color: selectedSortBy.value === opt.value ? bluePrimary : "black",
                                                cursor: "pointer",
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            className={`change-view ${isListView ? "active" : "bg-light"
                                } text-nowrap px-3 py-1 rounded-2`}
                            onClick={() => setIsListView(true)}
                        >
                            <List size={18} /> List View
                        </button>

                        <button
                            className={`change-view ${!isListView ? "active" : "bg-light"
                                } text-nowrap px-3 py-1 rounded-2 ms-2`}
                            onClick={() => setIsListView(false)}
                        >
                            <Grid size={18} /> Grid View
                        </button>
                    </div>
                </div>

                {isListView ? (
                    <div className="table-responsive mt-5 ms-3 me-3">
                        <table className="table align-middle">
                            <thead style={{ backgroundColor: bluePrimary, color: "white" }}>
                                <tr>
                                    <th scope="col" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "8px 0 0 0" }}>S.No</th>
                                    <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Company Name</th>
                                    <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Short Name</th>
                                    <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Type</th>
                                    <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Level</th>
                                    <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                                ) : processedCompanyList.length > 0 ? (
                                    processedCompanyList.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td>{index + 1}</td>
                                            <td>{item.companyName || "-"}</td>
                                            <td>{item.shortName || "-"}</td>
                                            <td>{item.comType || "-"}</td>
                                            <td>{item.companyLevel?.level || "-"}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm"
                                                    style={{ border: 'none', background: 'transparent', color: bluePrimary }}
                                                    onClick={() => navigate(`/companydetails/${item.id}`)}
                                                >
                                                    <Eye size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" className="text-center py-4">No companies found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="row g-4 mt-2">
                        {isLoading ? (
                            <div className="col-12 text-center py-5">Loading...</div>
                        ) : processedCompanyList.length > 0 ? (
                            processedCompanyList.map((item, index) => (
                                <div className="col-12 col-md-6 col-lg-4" key={item.id || index}>
                                    <div className="card h-100 shadow-sm border-0 position-relative" style={{ border: `1px solid ${bluePrimary}3D`, borderRadius: '12px' }}>
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-start mb-4">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                                                    style={{ width: '56px', height: '56px', backgroundColor: bluePrimary, color: 'white' }}
                                                >
                                                    <Building size={24} />
                                                </div>
                                                <div className="mt-1">
                                                    <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>
                                                        {item.companyName || "Unknown Company"}
                                                    </h6>
                                                    <div className="fw-bold" style={{ color: bluePrimary, fontSize: '0.9rem' }}>
                                                        {item.shortName || "-"}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <CardRow label="Company Type" value={item.comType} />
                                                <CardRow label="Company Level" value={item.companyLevel?.level} />
                                                <CardRow label="Contact Name" value={item.contacts?.[0]?.name} />
                                                <CardRow label="Phone" value={item.contacts?.[0]?.phoneNo} />
                                            </div>
                                            <div className="text-end mt-4">
                                                <button
                                                    className="btn btn-link text-decoration-none p-0 fw-bold d-inline-flex align-items-center"
                                                    style={{ color: bluePrimary, fontSize: '0.95rem' }}
                                                    onClick={() => navigate(`/companydetails/${item.id}`)}
                                                >
                                                    <Eye size={18} className="me-2" /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-12 text-center py-5">No companies found.</div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default CompanyDetails;