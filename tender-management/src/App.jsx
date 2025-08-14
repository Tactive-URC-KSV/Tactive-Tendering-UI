import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import { RegionsProvider } from './Context/RegionsContext';
import { SectorsProvider } from './Context/SectorsContext';
import { ScopeProvider } from './Context/ScopeContext';
import { UomProvider } from './Context/UomContext';
import  Logo from './assest/logo.svg';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import { ProjectStatusProvider } from './Context/ProjectStatusContext';

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
        autoClose={2000}
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
    )
    


  );
}

export default App;
