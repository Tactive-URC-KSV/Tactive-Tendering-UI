import axios from "axios";

export const searchBoq = async (projectId, searchQuery) => {
    try {
        const token = sessionStorage.getItem('token');
        console.log("Search BOQ - ProjectId:", projectId, "Query:", searchQuery);
        console.log("Token present:", !!token);

        if (!token) {
            console.error("No token found in sessionStorage");
            throw new Error("No authentication token found");
        }

        const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/searchBoq/${projectId}?searchQuery=${encodeURIComponent(searchQuery)}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
