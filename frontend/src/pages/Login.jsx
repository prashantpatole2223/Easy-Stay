import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);

      const role = user.role?.toLowerCase();

      if (role === "owner") {
        navigate("/owner/dashboard", {
          replace: true
        });

        return;
      }

      if (role === "customer") {
        if (from) {
          navigate(
            {
              pathname: from.pathname,
              search: from.search,
              hash: from.hash
            },
            {
              replace: true,
              state: from.state
            }
          );
        } else {
          navigate("/", {
            replace: true
          });
        }

        return;
      }

      if (role === "admin") {
        navigate("/admin/dashboard", {
          replace: true
        });

        return;
      }

      setError("Invalid user role");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }


  };

  return (<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10"> <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">


    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome Back
      </h1>

      <p className="mt-2 text-gray-600">
        Login to continue to EasyStay.
      </p>
    </div>

    {/* Error */}
    {error && (
      <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

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
          placeholder="Enter your password"
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
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>

    {/* Signup */}
    <p className="mt-6 text-center text-sm text-gray-600">
      Don't have an account?{" "}
      <button
        type="button"
        onClick={() =>
          navigate("/signup/customer", {
            state: {
              from
            }
          })
        }
        className="font-semibold text-blue-600 hover:underline"
      >
        Sign Up
      </button>
    </p>

  </div>
  </div>


  );
};

export default Login;