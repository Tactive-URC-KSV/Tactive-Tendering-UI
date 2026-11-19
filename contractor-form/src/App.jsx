import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import ContractorForm from './ContractorForm'; 
import ContractorDetails from './ContractorDetails';

function App() {
  return (
      <Routes>
        <Route path="/" element={<ContractorForm />} />
        <Route path="/contractor-form" element={<ContractorForm />} />
        <Route path="/contractor-tender-quotation" element={<ContractorDetails />} />
      </Routes>
  );
}

export default App;