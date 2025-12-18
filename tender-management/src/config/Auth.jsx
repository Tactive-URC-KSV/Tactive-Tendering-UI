import { decodeToken } from "./Jwt.jsx";

export function getUserRole() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded?.role || null;
}
export function getUserName() {
    const token = sessionStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeToken(token);
    return decoded?.name || null;
}
export function hasAuthority(authority) {
    const token = sessionStorage.getItem("token");
    if (!token) return false;

    const decoded = decodeToken(token);
    return decoded?.authorities?.includes(authority);
}
