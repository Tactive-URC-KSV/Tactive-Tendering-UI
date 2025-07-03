import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import { RegionsProvider } from './Context/RegionsContext';
import { SectorsProvider } from './Context/SectorsContext';
import { ScopeProvider } from './Context/ScopeContext';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/poppins";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import { UomProvider } from './Context/UomContext';
function App() {

  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
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
                <Sidebar />
              </UomProvider>
            </ScopeProvider>
          </SectorsProvider>
        </RegionsProvider>
      )}
    </div>


  );
}

export default App;
