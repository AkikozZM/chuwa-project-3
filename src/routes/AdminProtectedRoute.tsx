import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsLogin, selectRole } from "../features/authenticate/authenticate";

const AdminProtectedRoute = () => {
    const isLogin = useSelector(selectIsLogin);
    const role = useSelector(selectRole);

    if (!isLogin) {
        return <Navigate to="/login" />;
    }

    if (role !== "Admin") {
        return <Navigate to="/error" />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
