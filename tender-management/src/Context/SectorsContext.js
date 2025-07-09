import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const SectorsContext = createContext([]);

export const useSectors = () => useContext(SectorsContext);

export const SectorsProvider = ({ children }) => {
    const [sectors, setSectors] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}sectors`)
            .then(response => {
                setSectors(response.data);
            })
            .catch(error => {
                console.error('Error fetching sectors:', error);
            });
    }, []);

    return (
        <SectorsContext.Provider value={sectors}>
            {children}
        </SectorsContext.Provider>
    );
};
