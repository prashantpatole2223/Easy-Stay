import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const MyHotels = () => {
    const navigate = useNavigate();


    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/hotels/my");

            setHotels(response.data.hotels);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load your hotels"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (hotelId) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this hotel?"
        );

        if (!confirmed) return;

        try {
            await api.patch(`/hotels/${hotelId}/deactivate`);

            setHotels((prevHotels) =>
                prevHotels.map((hotel) =>
                    hotel._id === hotelId
                        ? { ...hotel, status: "inactive" }
                        : hotel
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to deactivate hotel"
            );
        }
    };

    const handleActivate = async (hotelId) => {
        const confirmed = window.confirm(
            "Are you sure you want to activate this hotel?"
        );

        if (!confirmed) return;

        try {
            await api.patch(`/hotels/${hotelId}/activate`);

            setHotels((prevHotels) =>
                prevHotels.map((hotel) =>
                    hotel._id === hotelId
                        ? { ...hotel, status: "active" }
                        : hotel
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to activate hotel"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">Loading your hotels...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Hotels
                        </h1>

                        <p className="text-gray-600 mt-1">
                            Manage the hotels you have listed on EasyStay.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/owner/hotels/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
                    >
                        + Add New Hotel
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {hotels.length === 0 && !error && (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">

                        <div className="text-5xl mb-4">
                            🏨
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900">
                            No hotels listed yet
                        </h2>

                        <p className="text-gray-600 mt-2 mb-6">
                            Start by adding your first hotel to EasyStay.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/owner/hotels/create")
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
                        >
                            Add Your First Hotel
                        </button>
                    </div>
                )}

                {/* Hotel Grid */}
                {hotels.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {hotels.map((hotel) => (
                            <div
                                key={hotel._id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
                            >

                                {/* Hotel Image */}
                                <div className="h-52 bg-gray-100">

                                    {hotel.images?.length > 0 ? (
                                        <img
                                            src={hotel.images[0].url}
                                            alt={hotel.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Hotel Info */}
                                <div className="p-5">

                                    <div className="flex items-start justify-between gap-3">

                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {hotel.name}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1">
                                                {hotel.location?.city},{" "}
                                                {hotel.location?.state}
                                            </p>
                                        </div>

                                        {/* Status */}
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${hotel.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {hotel.status === "active"
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                                        {hotel.description}
                                    </p>

                                    {/* Address */}
                                    <p className="text-gray-500 text-sm mt-3">
                                        📍 {hotel.address}
                                    </p>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2 mt-5">

                                        {/* View */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/owner/hotels/${hotel._id}`
                                                )
                                            }
                                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            View
                                        </button>

                                        {/* Edit */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/owner/hotels/${hotel._id}/edit`
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Edit
                                        </button>

                                        {/* Manage Rooms */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/owner/hotels/${hotel._id}/rooms`
                                                )
                                            }
                                            className="border border-blue-300 hover:bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Rooms
                                        </button>

                                        {/* Bookings */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/owner/hotels/${hotel._id}/bookings`
                                                )
                                            }
                                            className="border border-green-300 hover:bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Bookings
                                        </button>
                                    </div>

                                    {/* Activate / Deactivate */}
                                    {hotel.status === "active" ? (
                                        <button
                                            onClick={() =>
                                                handleDeactivate(
                                                    hotel._id
                                                )
                                            }
                                            className="w-full mt-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            Deactivate Hotel
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleActivate(
                                                    hotel._id
                                                )
                                            }
                                            className="w-full mt-2 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            Activate Hotel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );


};

export default MyHotels;