import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const OwnerDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [stats, setStats] = useState({
        hotels: 0,
        activeHotels: 0,
        inactiveHotels: 0,
        rooms: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const response = await api.get("/hotels/my");

            const hotels = response.data.hotels || [];

            const activeHotels = hotels.filter(
                (hotel) => hotel.status === "active"
            );

            const inactiveHotels = hotels.filter(
                (hotel) => hotel.status === "inactive"
            );

            setStats({
                hotels: hotels.length,
                activeHotels: activeHotels.length,
                inactiveHotels: inactiveHotels.length,
                rooms: 0,
            });
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name || "Owner"} 👋
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage your hotels, rooms, and property listings
                        from your dashboard.
                    </p>
                </div>

                {/* Quick Action */}
                <div className="bg-blue-600 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                    <div>
                        <h2 className="text-xl font-semibold">
                            List your hotel
                        </h2>

                        <p className="text-blue-100 mt-1">
                            Add your property to EasyStay and start receiving
                            bookings.
                        </p>
                    </div>

                    <button
                        onClick={() =>
                            navigate("/owner/hotels/create")
                        }
                        className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-3 rounded-lg font-semibold transition"
                    >
                        + Add New Hotel
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

                    {/* Total Hotels */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Total Hotels
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? "—" : stats.hotels}
                        </p>
                    </div>

                    {/* Active Hotels */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Active Hotels
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? "—" : stats.activeHotels}
                        </p>
                    </div>

                    {/* Inactive Hotels */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Inactive Hotels
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? "—" : stats.inactiveHotels}
                        </p>
                    </div>

                    {/* Rooms */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <p className="text-sm text-gray-500">
                            Total Rooms
                        </p>

                        <p className="text-3xl font-bold text-gray-900 mt-2">
                            {loading ? "—" : stats.rooms}
                        </p>
                    </div>
                </div>

                {/* Management Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Manage Your Properties
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* My Hotels */}
                        <button
                            onClick={() =>
                                navigate("/owner/my-hotels")
                            }
                            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        My Hotels
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1">
                                        View and manage all your hotel
                                        listings.
                                    </p>
                                </div>

                                <span className="text-2xl group-hover:translate-x-1 transition">
                                    →
                                </span>
                            </div>
                        </button>

                        {/* Add Hotel */}
                        <button
                            onClick={() =>
                                navigate("/owner/hotels/create")
                            }
                            className="bg-white border border-gray-200 rounded-xl p-6 text-left hover:shadow-md transition group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Add New Hotel
                                    </h3>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Create a new property listing.
                                    </p>
                                </div>

                                <span className="text-2xl group-hover:translate-x-1 transition">
                                    +
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Getting Started */}
                {stats.hotels === 0 && !loading && (
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                        <div className="text-5xl mb-4">
                            🏨
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900">
                            Get started with EasyStay
                        </h2>

                        <p className="text-gray-600 mt-2 mb-6">
                            You haven't listed any hotels yet.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/owner/hotels/create")
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            List Your First Hotel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerDashboard;