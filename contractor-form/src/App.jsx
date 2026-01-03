import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import ContractorForm from './ContractorForm'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ContractorForm />} />
        <Route path="/contractor-form" element={<ContractorForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;