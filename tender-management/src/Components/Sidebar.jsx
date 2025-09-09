import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../assest/logo.svg?react";
import LogoutIcon from "../assest/Logout.svg?react";
import UserIcon from "../assest/User.svg?react";
import NotifyIcon from "../assest/Notify.svg?react";
import {
  FaClipboardList,
  FaPlus,
  FaListAlt,
  FaMapSigns,
  FaCalculator,
  FaPaperPlane,
  FaSearch,
  FaInbox,
  FaChartBar,
  FaUserPlus,
} from "react-icons/fa";
import "../CSS/Styles.css";

function Sidebar({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/")[1];

  const sections = [
    { label: "Dashboard", path: "dashboard", icon: <FaClipboardList /> },
    { label: "Project Management", path: "projectmanagement", icon: <FaPlus /> },
    { label: "BOQ Definition", path: "boqdefinition", icon: <FaListAlt /> },
    { label: "Cost Code Mapping", path: "costcodemapping", icon: <FaMapSigns /> },
    { label: "Tender Estimation", path: "tenderestimation", icon: <FaCalculator /> },
    { label: "Tender Floating", path: "TenderFloating", icon: <FaPaperPlane /> },
    { label: "Tender Tracking", path: "TenderTracking", icon: <FaSearch /> },
    { label: "Receiving Offers", path: "ReceivingOffers", icon: <FaInbox /> },
    { label: "Tender Comparison", path: "TenderComparison", icon: <FaChartBar /> },
    { label: "Contractor Onboarding", path: "ContractorOnboarding", icon: <FaUserPlus /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/Login");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="header col-12 d-flex justify-content-between align-items-center">
          
          <div className="col-lg-2 col-sm-4 col-md-3 d-flex justify-content-start align-items-center">
            <Logo className="logo w-50" />
          </div>

          
          <div className="col-lg-2 col-sm-4 col-md-3 d-flex justify-content-end align-items-center">
            <button className="btn toggle-btn">
              <NotifyIcon width={24} height={24} />
            </button>
            <button className="btn toggle-btn">
              <UserIcon width={24} height={24} />
            </button>
            <span className="user-profile">Admin</span>
            <button onClick={handleLogout} className="btn toggle-btn">
              <LogoutIcon width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

     
      <div className="row main-container d-flex">
        
        <div
          className={`sidebar-container ${isSidebarOpen ? "expanded" : "collapsed"}`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className="sidebar">
            <nav>
              <ul className="list-unstyled">
                {sections.map((section, index) => (
                  <li key={index} className="mt-3">
                    <button
                      className={`btn nav-btn ${currentPath === section.path ? "active" : ""}`}
                      onClick={() => navigate(`/${section.path}`)}
                    >
                      {section.icon}
                      {isSidebarOpen && <span className="ms-3">{section.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
        <div className={`content-container ${isSidebarOpen ? "expanded" : "collapsed"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
