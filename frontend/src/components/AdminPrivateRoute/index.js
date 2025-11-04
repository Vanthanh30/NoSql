import { Navigate, Outlet } from "react-router-dom";
const AdminPrivateRoute = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user && user.role === "admin";
    return isAdmin ? <Outlet /> : <Navigate to="admin/login" />;

}

export default AdminPrivateRoute;
