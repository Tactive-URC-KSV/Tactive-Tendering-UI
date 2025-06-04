import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import { Router, Routes , Route} from 'react-router-dom';
import { useState , Navigate } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fontsource/poppins"; 
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
     <div className="App">
        {!isLoggedIn ? (
          <Routes>
            <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/*" element={<Sidebar />}/>
          </Routes>
        )}
      </div>
    
      
  );
}

export default App;
