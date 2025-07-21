import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios'; 

const RegionsContext = createContext([]);

export const useRegions = () => useContext(RegionsContext);

export const RegionsProvider = ({ children }) => {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/regions`, {
      headers: {
        'Authorization' : `Bearer ${sessionStorage.getItem("token")}`,
      },
    }) 
      .then(response => {
        if(response.status === 200){
          setRegions(response.data); 
        }
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
