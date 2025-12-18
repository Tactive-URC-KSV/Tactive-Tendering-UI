import "../CSS/Styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

function MasterDataController({children}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/").pop();

  const [openSections, setOpenSections] = useState({
    master: true,
    location: false,
    resource: false,
    company: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const masterData = [
    { label: "Region", path: "region" },
    { label: "Sector", path: "sector" },
    { label: "Scope of Packages", path: "scopes" },
    { label: "UOM", path: "uom" },
    { label: "List of Approvals", path: "approvals" },
    { label: "Cost Code Type", path: "costcodetype" },
    { label: "Cost Code Activity", path: "costcodeactivity" },
  ];

  const locationData = [
    { label: "Country", path: "country" },
    { label: "State", path: "state" },
    { label: "City", path: "city" },
    { label: "Address Type", path: "addresstype" },
  ];

  const resourceData = [
    { label: "Resource Nature", path: "resourcenature" },
    { label: "Resource Type", path: "resourcetype" },
    { label: "Quantity Type", path: "quantitytype" },
    { label: "Resources", path: "resources" },
  ];

  const companyData = [
    { label: "Company Type", path: "companytype" },
    { label: "Company Level", path: "companylevel" },
    { label: "Company Status", path: "companystatus" },
    { label: "Company Constitution", path: "companyconstitution" },
  ];

  const renderSection = (key, title, data) => (
    <>
      <li
        className="menu-heading mt-3 text-primary fw-bold d-flex align-items-center justify-content-between cursor-pointer"
        onClick={() => toggleSection(key)}
      >
        <span>{title}</span>
        {openSections[key] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </li>
      {openSections[key] &&
        data.map((item, index) => (
          <li key={index} className="mt-2">
            <button
              className={`btn admin-nav-btn ${
                currentPath === item.path ? "active" : ""
              } ms-2 w-100 text-start`}
              onClick={() =>
                navigate(`/adminportal/${item.path}`)
              }
            >
              {item.label}
            </button>
          </li>
        ))}
    </>
  );
  return (
      <div className="row">
      <div className="col-lg-auto col-md-auto text-start admin-sidebar p-3">
        <nav>
          <ul className="list-unstyled">
            {renderSection("master", "Master Data", masterData)}
            {renderSection("location", "Location & Geography", locationData)}
            {renderSection("resource", "Resource & Quantity", resourceData)}
            {renderSection("company", "Company & Contractor", companyData)}
          </ul>
        </nav>
      </div>
      <div className="col-auto">
        {children}
      </div>
    </div>
  );
}

export default MasterDataController;
