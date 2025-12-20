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
import MasterDataController from './Admin/MasterDataController';
import { CostCodeActivity, CostCodeType, ListOfApprovals, Region, Scopes, Sectors, UOM } from './Admin/MasterDataManagement';
import { Addresstype, Cities, Countries, States } from './Admin/LocationDataManagement';
import { CompanyConstitution, CompanyLanguage, CompanyLevel, CompanyNature, CompanyNatureOfBusiness, CompanyStatus, CompanyType } from './Admin/CompanyDataManagement';
import { ContractorGrade, EntityType, NatureOfBusiness } from './Admin/ContractorDataMangement';
import { Currency, IdentityType, TaxType, TerritoryType } from './Admin/TaxManagement';
import {ResourceNature,ResourceType,QuantityType,Resources} from './Admin/ResourceQuantityManagement';


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
            <ProtectedRoute roles={["ADMIN","USER"]}>
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
                            <Route path="/tenderestimation/:projectId/resourceadding/:boqId" element={<TenderResource />} caseSensitive={false} />                            {/* <Route path="/tenderestimation/resourceadding/:activityGroupId" element={<ResourceAdding />} caseSensitive={false} /> */}
                            <Route path="/tenderfloating" element={<TenderFloating />} caseSensitive={false} />
                            <Route path="/tenderfloating/:projectId" element={<TenderFloating />} caseSensitive={false} />
                            <Route path="/TenderTracking" element={<h1>Tender Tracking</h1>} />
                            <Route path="/ReceivingOffers" element={<h1>Receiving Offers</h1>} />
                            <Route path="/TenderComparison" element={<h1>Tender Comparison</h1>} />
                            <Route path="/ContractorOnboarding" element={<Contractor />} caseSensitive={false} />
                            <Route path="ContractorOnboarding/review-submissions" element={<ContractorReview />} caseSensitive={false} />
                            <Route path="/add-resource/:projectId/:boqId" element={<AddResource />} caseSensitive={false} />
                            <Route path="/add-resource/:projectId/:boqId/:tenderEstimationId" element={<AddResource />} caseSensitive={false} />
                            <Route path="ContractorOnboarding/contractor-overview" element={<ContractorOverview />} caseSensitive={false} />
                          </Routes>
                        </Sidebar>
                      </ProjectStatusProvider>
                    </UomProvider>
                  </ScopeProvider>
                </SectorsProvider>
              </RegionsProvider>
            </ProtectedRoute>
          } />
          <Route path='/adminportal/*' element={
            <ProtectedRoute roles={["ADMIN"]}>
              <RegionsProvider>
                <SectorsProvider>
                  <ScopeProvider>
                    <UomProvider>
                      <ProjectStatusProvider>
                        <Sidebar>
                            <MasterDataController>
                              <Routes>
                                <Route path='region' element={<Region />} caseSensitive={false} />
                                <Route path='sector' element={<Sectors />} caseSensitive={false} />
                                <Route path='scopes' element={<Scopes />} caseSensitive={false} />
                                <Route path='uom' element={<UOM />} caseSensitive={false} />
                                <Route path='approvals' element={<ListOfApprovals />} caseSensitive={false} />
                                <Route path='costcodetype' element={<CostCodeType />} caseSensitive={false} />
                                <Route path='costcodeactivity' element={<CostCodeActivity />} caseSensitive={false} />
                                <Route path='country' element={<Countries />} caseSensitive={false} />
                                <Route path='state' element={<States />} caseSensitive={false} />
                                <Route path='city' element={<Cities />} caseSensitive={false} />
                                <Route path='addresstype' element={<Addresstype />} caseSensitive={false} />
                                <Route path='companylevel' element={<CompanyLevel />} caseSensitive={false} />
                                <Route path='companytype' element={<CompanyType />} caseSensitive={false} />
                                <Route path='companystatus' element={<CompanyStatus />} caseSensitive={false} />
                                <Route path='companyconstitution' element={<CompanyConstitution />} caseSensitive={false} />
                                <Route path='companynature' element={<CompanyNature />} caseSensitive={false} />
                                <Route path='companynatureofbusiness' element={<CompanyNatureOfBusiness />} caseSensitive={false} />
                                <Route path='companylanguage' element={<CompanyLanguage />} caseSensitive={false} />
                                <Route path='contractortype' element={<EntityType />} caseSensitive={false} />
                                <Route path='contractornatureofbusiness' element={<NatureOfBusiness />} caseSensitive={false} />
                                <Route path='contractorgrade' element={<ContractorGrade />} caseSensitive={false} />
                                <Route path='taxtype' element={<TaxType />} caseSensitive={false} />
                                <Route path='territorytype' element={<TerritoryType />} caseSensitive={false} />
                                <Route path='identitytype' element={<IdentityType />} caseSensitive={false} />
                                <Route path='currency' element={<Currency />} caseSensitive={false} />
                                  <Route path="resourcenature" element={<ResourceNature />} />
  <Route path="resourcetype" element={<ResourceType />} />
  <Route path="quantitytype" element={<QuantityType />} />
  <Route path="resources" element={<Resources />} />
                              </Routes>
                            </MasterDataController>
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






