import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute({ children }) {
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            toast.error("Session expired. Please login again.");
            const timer = setTimeout(() => {
                setShouldRedirect(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [token]);

    if (shouldRedirect) {
        return <Navigate to="/login" replace />;
    }

    if (!token) {
        return null;
    }

    return children;
}

export default ProtectedRoute;