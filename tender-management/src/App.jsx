import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { RegionsProvider } from './Context/RegionsContext';
import { SectorsProvider } from './Context/SectorsContext';
import { ScopeProvider } from './Context/ScopeContext';
import { UomProvider } from './Context/UomContext';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import { ProjectStatusProvider } from './Context/ProjectStatusContext';

function App() {

  return (
    <div className="App">
      <ToastContainer
        transition={Slide}
        autoClose={3000}
        closeButton={false}
        transitionDuration={600}
        position="top-right" />

      {!sessionStorage.getItem('token') ? (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      ) : (
        <RegionsProvider>
          <SectorsProvider>
            <ScopeProvider>
              <UomProvider>
                <ProjectStatusProvider>
                  <Sidebar />
                </ProjectStatusProvider>
              </UomProvider>
            </ScopeProvider>
          </SectorsProvider>
        </RegionsProvider>
      )}
    </div>


  );
}

export default App;
