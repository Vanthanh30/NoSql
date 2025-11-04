import { Navigate, Outlet } from "react-router-dom";
const AdminPrivateRoute = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user && user.role_Id === "Admin";
    return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminPrivateRoute;