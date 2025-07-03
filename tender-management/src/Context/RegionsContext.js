import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; 

const RegionsContext = createContext([]);

export const useRegions = () => useContext(RegionsContext);

export const RegionsProvider = ({ children }) => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/tactive/regions') 
      .then(response => {
        setRegions(response.data); 
      })
      .catch(error => {
        console.error('Error fetching sectors:', error);
      });
    }, []);

  return (
    <RegionsContext.Provider value={regions}>
      {children}
    </RegionsContext.Provider>
  );
};
