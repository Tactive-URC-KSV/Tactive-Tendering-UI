import { useEffect, useState } from "react";
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
import { UserCog, Building2 } from "lucide-react";
import { getUserName, getUserRole } from "../config/Auth";
import { canAccessMenu } from "../config/Permission";

function Sidebar({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split("/")[1];
  const role = getUserRole();
  const userName = getUserName();
  const sections = [
   
    { label: "Dashboard", path: "dashboard", icon: <FaClipboardList />, key: "DASHBOARD" },
    { label: "Admin Portal", path:"adminportal", icon: <UserCog  size={20}/>, key: "ADMIN_PORTAL" },
    { label: "Company Details", path: "companydetails", icon: <Building2 size={20} />, key: "COMPANY_DETAILS" },
    { label: "Project Management", path: "projectmanagement", icon: <FaPlus />, key: "PROJECT_MANAGEMENT" },
    { label: "BOQ Definition", path: "boqdefinition", icon: <FaListAlt />, key: "BOQ_DEFINITION" },
    { label: "Tender Estimation", path: "tenderestimation", icon: <FaCalculator />, key: "TENDER_ESTIMATION" },
    { label: "Cost Code Mapping", path: "costcodemapping", icon: <FaMapSigns />, key: "COST_CODE_MAPPING" },
    { label: "Tender Floating", path: "tenderfloating", icon: <FaPaperPlane />, key: "TENDER_FLOATING" },
    { label: "Receiving Offers", path: "receivingoffers", icon: <FaInbox />, key: "RECEIVING_OFFERS" },
    { label: "Tender Tracking", path: "tendertracking", icon: <FaSearch />, key: "TENDER_TRACKING" },
    { label: "Contractor Onboarding", path: "contractoronboarding", icon: <FaUserPlus />, key: "CONTRACTOR_ONBOARDING" },
    
  ];
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
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
            <span className="user-profile">{userName}</span>
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
                {sections
                  .filter(section => canAccessMenu(role, section.key))
                  .map((section, index) => (
                    <li key={index} className="mt-4">
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