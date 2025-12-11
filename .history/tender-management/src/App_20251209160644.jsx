import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { RegionsProvider } from './Context/RegionsContext';
import { SectorsProvider } from './Context/SectorsContext';
import { ScopeProvider } from './Context/ScopeContext';
import { UomProvider } from './Context/UomContext';
import Dashboard from './Components/Dashboard';
import ProjectManagement from './Components/ProjectManagement';
import ProjectInfo from './Components/ProjectOverview';
import BOQDefinition from './Components/BOQDefinition';
import CostCodeMapping from './Components/CostCodeMapping';
import CCMOverview from './Components/CCMOverview';
import TenderEstimation from './Components/TenderEstimation';
import TenderResource from './Components/TenderResource';
import Logo from './assest/logo.svg?react';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import { ProjectStatusProvider } from './Context/ProjectStatusContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Contractor from './Components/Contractor';
import ContractorOverview from './Components/ContractorOverview';
import AddResource from './Components/AddResource';
import TenderFloating from './Components/TenderFloating';
import ContractorReview from './Components/ContractorReview';

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 770);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  if (isSmallScreen) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        textAlign: "center",
        padding: "20px",
        color: "#005197"
      }}>
        <div className='mb-5'><Logo /></div>
        <div><h2>Screen width not supported</h2>
          <p>Please use a tablet or desktop for the best experience.</p></div>
      </div>
    );
  }


  return (
    !isSmallScreen && (
      <div className="App">
        <ToastContainer
          transition={Slide}
          autoClose={5000}
          closeButton={false}
          transitionDuration={700}
          position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path='/*' element={
            <ProtectedRoute>
              <RegionsProvider>
                <SectorsProvider>
                  <ScopeProvider>
                    <UomProvider>
                      <ProjectStatusProvider>
                        <Sidebar>
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} caseSensitive={false} />
                            <Route path="/projectmanagement" element={<ProjectManagement />} caseSensitive={false} />
                            <Route path="/dashboard/project/:projectId" element={<ProjectInfo />} caseSensitive={false} />
                            <Route path="/projectmanagement/project/:projectId" element={<ProjectManagement />} caseSensitive={false} />
                            <Route path="/boqdefinition" element={<BOQDefinition />} caseSensitive={false} />
                            <Route path="/boqdefinition/:projectId" element={<BOQDefinition />} caseSensitive={false} />
                            <Route path="/costcodemapping" element={<CostCodeMapping />} caseSensitive={false} />
                            <Route path="/costcodemapping/:projectId" element={<CCMOverview />} caseSensitive={false} />
                            <Route path="/tenderestimation" element={<TenderEstimation />} caseSensitive={false} />
                            <Route path="/tenderestimation/:projectId" element={<TenderEstimation />} caseSensitive={false} />
                            <Route path="/tenderestimation/:projectId/resourceadding/:boqId" element={<TenderResource />} caseSensitive={false} />
                            {/* <Route path="/tenderestimation/resourceadding/:activityGroupId" element={<ResourceAdding />} caseSensitive={false} /> */}
                            <Route path="/tenderfloating" element={<TenderFloating />} caseSensitive={false}/>
                            <Route path="/tenderfloating/:projectId" element={<TenderFloating />} caseSensitive={false}/>
                            <Route path="/TenderTracking" element={<h1>Tender Tracking</h1>} />
                            <Route path="/ReceivingOffers" element={<h1>Receiving Offers</h1>} />
                            <Route path="/TenderComparison" element={<h1>Tender Comparison</h1>} />
                            <Route path="/ContractorOnboarding" element={<Contractor />} caseSensitive={false}/>
                            <Route path="/add-resource/:projectId/:boqId" element={<AddResource />} caseSensitive={false} />
                            <Route path="/add-resource/:projectId/:boqId/:tenderEstimationId" element={<AddResource />} caseSensitive={false} />
                            <Route path="/contractor-overview" element={<ContractorOverview />} caseSensitive={false} />
                          </Routes>
                        </Sidebar>
                      </ProjectStatusProvider>
                    </UomProvider>
                  </ScopeProvider>
                </SectorsProvider>
              </RegionsProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    )



  );
}

export default App;
