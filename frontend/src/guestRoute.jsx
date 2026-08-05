import { useAuth } from "./useAuth";
import { Navigate, useLocation } from "react-router-dom";

function GuestRoute({ children }) {
    const { Auth, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (Auth) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default GuestRoute;