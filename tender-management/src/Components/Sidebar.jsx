import { useState } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';
import Logo from '../assest/logo.svg?react';
import LogoutIcon from '../assest/Logout.svg?react';
import UserIcon from '../assest/User.svg?react';
import NotifyIcon from '../assest/Notify.svg?react';
import {
  FaClipboardList, FaPlus, FaListAlt, FaMapSigns, FaCalculator,
  FaPaperPlane, FaSearch, FaInbox, FaChartBar, FaUserPlus
} from 'react-icons/fa';
import '../CSS/Styles.css';
import Dashboard from './Dashboard';
import ProjectManagement from './ProjectManagement';
import ProjectInfo from './ProjectOverview';
import BOQDefinition from './BOQDefinition';
import CostCodeMapping from './CostCodeMapping';
import CCMOverview from './CCMOverview';
import TenderEstimation from './TenderEstimation';


function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname.split('/')[1];

  const sections = [
    { label: 'Dashboard', path: 'Dashboard', icon: <FaClipboardList /> },
    { label: 'Project Management', path: 'ProjectManagement', icon: <FaPlus /> },
    { label: 'BOQ Definition', path: 'BOQdefinition', icon: <FaListAlt /> },
    { label: 'Cost Code Mapping', path: 'CostCodeMapping', icon: <FaMapSigns /> },
    { label: 'Tender Estimation', path: 'TenderEstimation', icon: <FaCalculator /> },
    { label: 'Tender Floating', path: 'TenderFloating', icon: <FaPaperPlane /> },
    { label: 'Tender Tracking', path: 'TenderTracking', icon: <FaSearch /> },
    { label: 'Receiving Offers', path: 'ReceivingOffers', icon: <FaInbox /> },
    { label: 'Tender Comparison', path: 'TenderComparison', icon: <FaChartBar /> },
    { label: 'Contractor Onboarding', path: 'ContractorOnboarding', icon: <FaUserPlus /> },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    window.location.href = '/Login';
  };

  return (
    <div className='container-fluid'>
      {/* Header */}
      <div className="row">
        <div className="header col-12 d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className='col-lg-2 col-sm-4 col-md-3 d-flex justify-content-start align-items-center'>
            <Logo className="logo w-50" />
          </div>

          {/* User actions */}
          <div className='col-lg-2 col-sm-4 col-md-3 d-flex justify-content-end align-items-center'>
            <button className="btn toggle-btn">
              <NotifyIcon width={24} height={24} />
            </button>
            <button className="btn toggle-btn">
              <UserIcon width={24} height={24} />
            </button>
            <span className='user-profile'>Shanmugam</span>
            <button onClick={handleLogout} className="btn toggle-btn">
              <LogoutIcon width={24} height={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="row main-container d-flex">
        {/* Sidebar */}
        <div
          className={`sidebar-container ${isSidebarOpen ? 'expanded' : 'collapsed'}`}
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
        >
          <div className="sidebar">
            <nav>
              <ul className='list-unstyled'>
                {sections.map((section, index) => (
                  <li key={index} className='mt-3'>
                    <button
                      className={`btn nav-btn ${currentPath === section.path ? 'active' : ''}`}
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

        {/* Content area */}
        <div className={`content-container ${isSidebarOpen ? 'expanded' : 'collapsed'}`}>
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/ProjectManagement" element={<ProjectManagement />} />
            <Route path="/Dashboard/project/:projectId" element={<ProjectInfo />} />
            <Route path="/ProjectManagement/project/:projectId" element={<ProjectManagement />} />
            <Route path="/BOQdefinition" element={<BOQDefinition />} />
            <Route path="/BOQdefinition/:projectId" element={<BOQDefinition />} />
            <Route path="/CostCodeMapping" element={<CostCodeMapping/>} />
            <Route path="/CostCodeMapping/:projectId" element={<CCMOverview />} />
            <Route path="/TenderEstimation" element={<TenderEstimation />} />
            <Route path="/TenderFloating" element={<h1>Tender Floating</h1>} />
            <Route path="/TenderTracking" element={<h1>Tender Tracking</h1>} />
            <Route path="/ReceivingOffers" element={<h1>Receiving Offers</h1>} />
            <Route path="/TenderComparison" element={<h1>Tender Comparison</h1>} />
            <Route path="/ContractorOnboarding" element={<h1>Contractor Onboarding</h1>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
