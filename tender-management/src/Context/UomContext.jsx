import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UomContext = createContext([]);

export const useUom = () => useContext(UomContext);

export const UomProvider = ({ children }) => {
    const [Uom, setUom] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/uoms`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        })
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
