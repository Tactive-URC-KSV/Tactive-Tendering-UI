import "../CSS/Styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

function MasterDataController({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/").pop();

  const [openSections, setOpenSections] = useState({
    general_master: false,
    process_master: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => {
      const updated = {};

      Object.keys(prev).forEach(k => {
        updated[k] = k === key ? !prev[k] : false;
      });

      return updated;
    });
  };

  const generalMasterData = [
    // { label: "Resource Type", path: "resourcetype" },
    { label: "Address Type", path: "addresstype" },
    // { label: "Company Level", path: "companylevel" },
    // { label: "Company Status", path: "companystatus" },
    { label: "Company Constitution", path: "companyconstitution" },
    // { label: "Comapny Nature", path: "companynature" },
    { label: "Nature Of Business", path: "companynatureofbusiness" },
    { label: "Language", path: "companylanguage" },
    { label: "Entity Type", path: "contractortype" },
    { label: "Nature Of Business", path: "contractornatureofbusiness" },
    { label: "Contractor Grade", path: "contractorgrade" },
    // { label: "Tax Type", path: "taxtype" },
    { label: "Identity Type", path: "identitytype" },
    { label: "Country", path: "country" },
    { label: "State", path: "state" },
    { label: "City", path: "city" },
    { label: "Currency", path: "currency" },
    { label: "Designation", path: "designation" }
  ];
  const processMasterData = [
    { label: "Region", path: "region" },
    { label: "Sector", path: "sector" },
    { label: "Scope of Packages", path: "scopes" },
    { label: "UOM", path: "uom" },
    // { label: "Approval Documents", path: "approvals" },
    { label: "Attributes", path: "attributes" },
    { label: "Resources", path: "resources" },
    { label: "Cost Code Activity", path: "costcodeactivity" },

  ];
  const renderSection = (key, title, data) => (
    <>
      <li
        className={`menu-heading mt-3 fw-bold d-flex align-items-center justify-content-between cursor-pointer ${openSections[key] ? "text-primary" : ""}`}
        onClick={() => toggleSection(key)}
      >
        <span>{title}</span>
        {openSections[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </li>
      {openSections[key] &&
        data.map((item, index) => (
          <li key={index} className="mt-2">
            <button
              className={`btn admin-nav-btn ${currentPath === item.path ? "active" : ""
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
    <div className="row min-vh-100">
      <div className="admin-sidebar p-3">
        <nav>
          <ul className="list-unstyled">
            {renderSection("process_master", "Process Master", processMasterData)}
            {renderSection("general_master", "General Master", generalMasterData)}

          </ul>
        </nav>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  );
}

export default MasterDataController;
