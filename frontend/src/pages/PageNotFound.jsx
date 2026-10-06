import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PageNotFound = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    const role = user?.role?.toLowerCase();

    const handleGoBack = () => {
        if (role === "owner") {
            navigate("/owner/dashboard");
            return;
        }


        if (role === "admin") {
            navigate("/admin/dashboard");
            return;
        }

        navigate("/");


    };

    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center"> <p className="text-gray-600">
            Loading... </p> </div>
        );
    }

    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4"> <div className="text-center">


        <p className="text-8xl font-bold text-blue-600">
            404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Page Not Found
        </h1>

        <p className="mt-3 text-gray-600">
            Sorry, the page you are looking for does not exist.
        </p>

        <button
            type="button"
            onClick={handleGoBack}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
            {role === "owner" || role === "admin"
                ? "Go to Dashboard"
                : "Go to Home"}
        </button>

    </div>
    </div>


    );
};

export default PageNotFound;