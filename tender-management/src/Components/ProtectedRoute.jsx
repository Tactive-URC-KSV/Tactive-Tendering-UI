import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { decodeToken } from "../config/Jwt";

function ProtectedRoute({ children, roles }) {
  const [redirect, setRedirect] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Session expired. Please login again.");
      setRedirect(true);
      return;
    }
    const decoded = decodeToken(token);
    if (!decoded) {
      toast.error("Invalid session. Please login again.");
      setRedirect(true);
      return;
    }

    // Token expired
    if (decoded.exp * 1000 < Date.now()) {
      toast.error("Session expired. Please login again.");
      sessionStorage.clear();
      setRedirect(true);
      return;
    }

    // Role check
    if (roles && !roles.includes(decoded.role)) {
      toast.error("You are not authorized to access this page.");
    }
  }, [token, roles]);

  if (redirect) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
