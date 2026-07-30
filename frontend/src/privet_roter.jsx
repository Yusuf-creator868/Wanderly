import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

const PrivateRouter = ({ children, allowedRoles = [] }) => {
    const { Auth, loading, userinfo, infoLoading  } = useAuth();
    const location = useLocation();

    if (loading || infoLoading) return <p>Loading...</p>;   

    if (!Auth) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(userinfo?.role)
    ) {
        // Redirect users to the correct place based on their role
        if (userinfo?.role === "agency") {
            return <Navigate to="/overview" replace />;
        }

        if (userinfo?.role === "traveler") {
            return <Navigate to="/search" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateRouter;