import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ScopeContext = createContext([]);

export const useScope = () => useContext(ScopeContext);

export const ScopeProvider = ({ children }) => {
    const [Scope, setScope] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/tactive/scopes')
            .then(response => {
                setScope(response.data);
            })
            .catch(error => {
                console.error('Error fetching Scope:', error);
            });
    }, []);

    return (
        <ScopeContext.Provider value={Scope}>
            {children}
        </ScopeContext.Provider>
    );
};
