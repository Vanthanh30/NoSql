import { useRoutes } from "react-router-dom";
import { adminRoutes } from "../../routes/admin";
const AdminPrivateRoute = () => {
    const element = useRoutes(adminRoutes);
    return element;
}

export default AdminPrivateRoute;
