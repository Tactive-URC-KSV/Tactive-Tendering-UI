import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assest/logo.svg';
import { FaBars , FaSignOutAlt , FaBell , FaUserCircle} from 'react-icons/fa';
import '../CSS/Sidebar.css';
function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();           
  const navigate = useNavigate();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const sections = [
  { label: 'Project Worklist', path: 'ProjectWorklist' },
  { label: 'Project Creation', path: 'ProjectCreation' },
  { label: 'BOQ Definition', path: 'BOQdefinition' },
  { label: 'Cost Code Mapping', path: 'CostCodeMapping' },
  { label: 'Tender Estimation', path: 'TenderEstimation' },
  { label: 'Tender Floating', path: 'TenderFloating' },
  { label: 'Tender Tracking', path: 'TenderTracking' },
  { label: 'Receiving Offers', path: 'ReceivingOffers' },
  { label: 'Tender Comparison', path: 'TenderComparison' },
  { label: 'Contractor Onboarding', path: 'ContractorOnboarding' },
];
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    navigate('/'); 
  }

  return (
    <div className='container-fluid'>
        <div className="header row ">
            <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
               <div className='col-lg-2 col-sm-4 col-md-3'>
                  <button onClick={toggleSidebar} className="btn toggle-btn">
                  <FaBars size={20} />
                  </button>
                  <img src={logo} alt="logo" className='logo w-50 ms-2' />
               </div>
                <div className='col-lg-2 col-sm-4 col-md-3 d-flex justify-content-end align-items-center'>
                    <button onClick={handleLogout} className="btn toggle-btn">
                    <FaBell size={24} />
                    </button>
                    <button onClick={handleLogout} className="btn toggle-btn">
                    <FaUserCircle size={24} />
                    </button>
                    <button onClick={handleLogout} className="btn toggle-btn">
                    <FaSignOutAlt size={24} />
                    </button>                  
               </div>
            </div>
        </div>
        <div className="row">
          {isSidebarOpen && (<div className="sidebar-container col-lg-2 col-md-3 col-sm-4">
            <div className="sidebar fixed-left">
                <nav>
                    <ul className='list-unstyled'>
                    {sections.map((section, index) => (
                        <li key={index} className='mt-3'>
                        <button className={`btn nav-btn ${location.pathname === section.path ? 'active' : ''}`} onClick={() => navigate(section.path)}>
                          {section.label}
                        </button>
                        </li>
                    ))}
                    </ul>
                </nav>
            </div>
            </div>)}
            
        </div>
    </div>
    
  );
}

export default Sidebar;
