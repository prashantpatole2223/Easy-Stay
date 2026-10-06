import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div
                role="status"
                aria-live="polite"
                className="flex min-h-[60vh] items-center justify-center bg-[#f2f2f2]"
            >
                <div className="flex flex-col items-center gap-3 text-[#4a4a4a]">
                    <Loader2
                        size={30}
                        className="animate-spin text-[#008cff]"
                        aria-hidden="true"
                    />

                    <p className="text-sm">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role?.toLowerCase())
    ) {
        if (user.role?.toLowerCase() === "owner") {
            return <Navigate to="/owner/dashboard" replace />;
        }

        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;