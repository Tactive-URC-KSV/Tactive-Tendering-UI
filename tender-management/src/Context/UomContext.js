import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UomContext = createContext([]);

export const useUom = () => useContext(UomContext);

export const UomProvider = ({ children }) => {
    const [Uom, setUom] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}uoms`)
            .then(response => {
                setUom(response.data);
            })
            .catch(error => {
                console.error('Error fetching Uom:', error);
            });
    }, []);

    return (
        <UomContext.Provider value={Uom}>
            {children}
        </UomContext.Provider>
    );
};
