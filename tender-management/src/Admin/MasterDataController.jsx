import "../CSS/Styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";

function MasterDataController({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/").pop();

  const [openSections, setOpenSections] = useState({
    gm: true,
    stam: false,
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
    { label: "Region", path: "region" },
    { label: "Sector", path: "sector" },
    { label: "Scope of Packages", path: "scopes" },
    { label: "List of Approvals", path: "approvals" },
    { label: "Cost Code Type", path: "costcodetype" },
    { label: "Address Type", path: "addresstype" },
    { label: "Resource Nature", path: "resourcenature" },
    { label: "Resource Type", path: "resourcetype" },
    //{ label: "Quantity Type", path: "quantitytype" },
    //{ label: "Company Type", path: "companytype" },
    { label: "Company Level", path: "companylevel" },
    { label: "Company Status", path: "companystatus" },
    { label: "Company Constitution", path: "companyconstitution" },
    { label: "Comapny Nature", path: "companynature"},
    { label: "Nature Of Business", path: "companynatureofbusiness"},
    { label: "Language", path: "companylanguage"},
    { label: "Entity Type", path: "contractortype"},
    { label: "Nature Of Business" , path: "contractornatureofbusiness"},
    { label: "Contractor Grade", path: "contractorgrade"},
    { label: "Tax Type", path: "taxtype"},
    // { label: "Territory Type", path: "territorytype"},
    { label: "Identity Type", path: "identitytype"},
  ];
  const staMasterData = [
    { label: "UOM", path: "uom" },
    { label: "Cost Code Activity", path: "costcodeactivity" },
    { label: "Country", path: "country" },
    { label: "State", path: "state" },
    { label: "City", path: "city" },
    { label: "Resources", path: "resources" },
    { label: "Attributes", path: "attributes"},
    { label: "Currency", path: "currency"},
  ];
  const renderSection = (key, title, data) => (
    <>
      <li
        className={`menu-heading mt-3 fw-medium d-flex align-items-center justify-content-between cursor-pointer ${openSections[key] ? "text-primary": "text-dark"}`}
        onClick={() => toggleSection(key)}
      >
        <span>{title}</span>
        {openSections[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
      <div className="row min-vh-100">
      <div className="admin-sidebar p-3">
        <nav>
          <ul className="list-unstyled">
            {renderSection("gm", "General Master", generalMasterData)}
            {renderSection("stam", "Standalone Master", staMasterData)}
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
