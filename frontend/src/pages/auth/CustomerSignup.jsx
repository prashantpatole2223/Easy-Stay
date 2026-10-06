import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";

const CustomerSignup = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from;

    const handleChange = (e) => {
        const { name, value } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));


    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const { confirmPassword, ...customerData } = formData;

            const response = await api.post(
                "/auth/signup/customer",
                customerData
            );

            console.log(response.data);

            navigate("/login", {
                replace: true,
                state: {
                    from
                }
            });
        } catch (error) {
            const errors = error.response?.data?.errors;

            if (errors?.length) {
                setError(errors[0].message);
            } else {
                setError(
                    error.response?.data?.message ||
                    "Something went wrong"
                );
            }
        } finally {
            setLoading(false);
        }


    };

    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10"> <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-8">


        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
                Create Your Account
            </h1>

            <p className="mt-2 text-gray-600">
                Create a customer account to start booking your stay.
            </p>
        </div>

        {/* Error */}
        {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                </label>

                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                </label>

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                </label>

                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Creating Account..." : "Create Account"}
            </button>

        </form>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
                to="/login"
                state={{ from }}
                className="font-semibold text-blue-600 hover:underline"
            >
                Login
            </Link>
        </p>

    </div>
    </div>


    );
};

export default CustomerSignup;