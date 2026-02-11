import { Filter, List, Plus, Grid, ClipboardCheck, Eye, Building } from "lucide-react";
import "../CSS/Styles.css";
import Select, { components } from "react-select";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const bluePrimary = "#005197";

function Contractor() {
  const [isListView, setIsListView] = useState(true);
  const navigate = useNavigate();

  const [entityTypeOptions, setEntityTypeOptions] = useState([]);
  const [gradeOptions, setGradeOptions] = useState([]);

  const [contractorList, setContractorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedSortBy, setSelectedSortBy] = useState({ value: 'nameAsc', label: 'Name (A-Z)' });
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = sessionStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const typeRes = await axios.get(`${baseUrl}/contractorType`, { headers });
        const typeList = typeRes.data?.data ?? typeRes.data ?? [];
        setEntityTypeOptions(
          typeList.map((item) => ({ value: item.id, label: item.type }))
        );

        const gradeRes = await axios.get(`${baseUrl}/contractorGrade`, { headers });
        const gradeList = gradeRes.data?.data ?? gradeRes.data ?? [];
        setGradeOptions(gradeList);

      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };

    fetchData();
  }, [token, baseUrl]);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    axios.get(`${baseUrl}/contractor`, { headers })
      .then(response => {
        const list = Array.isArray(response.data) ? response.data : (response.data?.data ?? []);
        setContractorList(list);
      })
      .catch(error => {
        console.error("Error fetching contractor list:", error);
        setContractorList([]);
      })
      .finally(() => setIsLoading(false));
  }, [token, baseUrl]);

  // --- Filtering Logic ---
  const filteredContractorList = useMemo(() => {
    // 1. Filter
    let filtered = contractorList.filter((item) => {
      const contractor = item.contractor || {};

      // Search Filter (Entity Name or Entity Code)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = contractor.entityName?.toLowerCase().includes(query);
        const matchesCode = contractor.entityCode?.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) {
          return false;
        }
      }

      // Entity Type Filter
      if (selectedEntityType) {
        const typeId = contractor.contractorType?.id || contractor.contractorType;
        if (typeId !== selectedEntityType.value) {
          return false;
        }
      }

      // Grade Filter
      if (selectedGrade) {
        const gradeId = contractor.contractorGrade?.id || contractor.contractorGrade;
        if (gradeId !== selectedGrade.value) {
          return false;
        }
      }

      return true;
    });

    // 2. Sort
    return filtered.sort((a, b) => {
      if (!selectedSortBy) return 0;
      const { value } = selectedSortBy;

      switch (value) {
        case 'nameAsc':
          return (a.contractor?.entityName || "").localeCompare(b.contractor?.entityName || "");
        case 'nameDesc':
          return (b.contractor?.entityName || "").localeCompare(a.contractor?.entityName || "");
        case 'dateNewest':
          const dateA = new Date(a.contractor?.createdOn || a.contractor?.createdAt || 0);
          const dateB = new Date(b.contractor?.createdOn || b.contractor?.createdAt || 0);
          return dateB - dateA;
        default:
          return 0;
      }
    });

  }, [contractorList, searchQuery, selectedEntityType, selectedGrade, selectedSortBy]);


  const handleEntityTypeChange = (selectedOption) => {
    setSelectedEntityType(selectedOption);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const sortOptions = [
    { value: 'nameAsc', label: 'Name (A-Z)' },
    { value: 'nameDesc', label: 'Name (Z-A)' },
    { value: 'dateNewest', label: 'Created Date' },
  ];

  const toggleSortByDropdown = () => {
    setIsSortByDropdownOpen(!isSortByDropdownOpen);
  };

  const handleSortBySelect = (option) => {
    setSelectedSortBy(option);
    setIsSortByDropdownOpen(false);
  };

  const CardRow = ({ label, value }) => (
    <div className="d-flex justify-content-between mb-2">
      <span className="fw-bold" style={{ fontSize: "0.9rem", color: "#333" }}>{label} :</span>
      <span className="text-end" style={{ fontSize: "0.9rem", color: "#555" }}>{value || "-"}</span>
    </div>
  );

  const getStatusBadgeStyle = (statusCode) => {
    switch (statusCode) {
      case 'VERIFIED':
        return { bg: '#E8F5E9', color: '#2E7D32', label: 'Verified' };
      case 'PENDING':
        return { bg: '#FFF3E0', color: '#EF6C00', label: 'Pending' };
      case 'INVITED':
        return { bg: '#E3F2FD', color: '#1565C0', label: 'Invited' };
      default:
        return { bg: '#F5F5F5', color: '#616161', label: statusCode || 'Unknown' };
    }
  };

  return (
    <div className="container-fluid mt-3 p-4 min-vh-100">
      <div className="ms-3 me-3 d-flex justify-content-between align-items-center">
        <div className="text-start fw-bold fs-5">Contractor Onboarding</div>

        <div className="d-flex">
          <button
            className="action-button me-4"
            onClick={() => navigate("review-submissions")}
            style={{
              backgroundColor: "white",
              color: bluePrimary,
              border: `1px solid ${bluePrimary}`,
              boxShadow: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ClipboardCheck color={bluePrimary} size={18} />
            <span className="ms-2">Review Submissions</span>
          </button>

          <button
            className="btn action-button"
            onClick={() => navigate("contractor-overview")}
            style={{ backgroundColor: bluePrimary, color: "white" }}
          >
            <Plus color="#FFFFFF" size={18} />
            <span className="ms-2">Add New Contractor</span>
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
          <div className="col-lg-4 col-md-6">
            <label className="projectform-select text-start d-block">Search Entity</label>
            <input
              type="text"
              className="form-input w-100"
              placeholder="Search by entity name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-lg-4 col-md-6">
            <label className="projectform-select text-start d-block">Entity Type</label>
            <Select
              options={entityTypeOptions}
              onChange={handleEntityTypeChange}
              value={selectedEntityType}
              placeholder="All entity type"
              className="w-100"
              classNamePrefix="select"
              isClearable
            />
          </div>

          <div className="col-lg-2 col-md-4 position-relative">
            <label className="projectform-select text-start d-block">Grade</label>
            <Select
              options={gradeOptions.map(g => ({ value: g.id, label: g.gradeName || g.grade }))}
              onChange={setSelectedGrade}
              value={selectedGrade}
              placeholder="All grades"
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
        <div className="d-flex justify-content-between mb-3">
          <div className="text-start fw-bold fs-6">Contractor List</div>

          <div className="d-flex align-items-center">
            <div className="me-3" style={{ color: '#005197', fontSize: '0.9rem' }}>
              {filteredContractorList.length} Contractors
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
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Entity Code</th>
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Entity Name</th>
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Entity Type</th>
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Contact Name</th>
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Email</th>
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white" }}>Phone Number</th>
                  <th scope="col" style={{ backgroundColor: bluePrimary, color: "white", borderRadius: "0 8px 0 0" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">Loading...</td>
                  </tr>
                ) : filteredContractorList.length > 0 ? (
                  filteredContractorList.map((item, index) => (
                    <tr key={item.contractor?.id || index}>
                      <td>{index + 1}</td>
                      <td>{item.contractor?.entityCode || "-"}</td>
                      <td>{item.contractor?.entityName || "-"}</td>
                      <td>{item.contractor?.contractorType?.type || "-"}</td>
                      <td>{item.contact?.name || "-"}</td>
                      <td>{item.contact?.email || "-"}</td>
                      <td>{item.contact?.phoneNumber || "-"}</td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ border: 'none', background: 'transparent', color: bluePrimary }}
                          onClick={() => navigate(`/contractor/${item.contractor?.id || item.id}`)}
                        >
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">No contractors found matching filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="row g-4 mt-2">
            {isLoading ? (
              <div className="col-12 text-center py-5">Loading...</div>
            ) : filteredContractorList.length > 0 ? (
              filteredContractorList.map((item, index) => {
                const statusData = getStatusBadgeStyle(item.contractor?.status);
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={item.contractor?.id || index}>
                    <div className="card h-100 shadow-sm border-0 position-relative" style={{ border: `1px solid ${bluePrimary}3D`, borderRadius: '12px' }}>

                      <div
                        className="position-absolute top-0 end-0 px-3 py-1 fw-bold"
                        style={{
                          backgroundColor: statusData.bg,
                          color: statusData.color,
                          borderRadius: '0 12px 0 12px',
                          fontSize: '0.8rem'
                        }}
                      >
                        {statusData.label}
                      </div>

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
                              {item.contractor?.entityName || "Unknown Entity"}
                            </h6>
                            <div className="fw-bold" style={{ color: bluePrimary, fontSize: '0.9rem' }}>
                              {item.contractor?.entityCode || "-"}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <CardRow label="Entity Type" value={item.contractor?.contractorType?.type} />
                          <CardRow label="Contact Name" value={item.contact?.name} />
                          <CardRow label="Phone no" value={item.contact?.phoneNumber} />
                          <CardRow label="Email ID" value={item.contact?.email} />
                        </div>

                        <div className="text-end mt-4">
                          <button
                            className="btn btn-link text-decoration-none p-0 fw-bold d-inline-flex align-items-center"
                            style={{ color: bluePrimary, fontSize: '0.95rem' }}
                            onClick={() => navigate(`/contractor/${item.contractor?.id || item.id}`)}
                          >
                            <Eye size={18} className="me-2" /> View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-12 text-center py-5">No contractors found matching filters.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
export default Contractor;