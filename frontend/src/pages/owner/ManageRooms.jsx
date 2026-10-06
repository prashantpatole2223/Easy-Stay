import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ManageRooms = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();

    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRooms();
    }, [hotelId]);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/rooms/hotel/${hotelId}`);

            setRooms(response.data.rooms);
            setHotel(response.data.hotel);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load rooms"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (roomId) => {
        const confirmed = window.confirm(
            "Are you sure you want to deactivate this room?"
        );

        if (!confirmed) return;

        try {
            await api.patch(`/rooms/${roomId}/deactivate`);

            setRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room._id === roomId
                        ? { ...room, status: "inactive" }
                        : room
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to deactivate room"
            );
        }
    };

    const handleActivate = async (roomId) => {
        const confirmed = window.confirm(
            "Are you sure you want to activate this room?"
        );

        if (!confirmed) return;

        try {
            await api.patch(`/rooms/${roomId}/activate`);

            setRooms((prevRooms) =>
                prevRooms.map((room) =>
                    room._id === roomId
                        ? { ...room, status: "active" }
                        : room
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to activate room"
            );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">
                    Loading rooms...
                </p>
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
                            Manage Rooms
                        </h1>

                        {hotel && (
                            <p className="text-gray-600 mt-1">
                                Hotel: {hotel.name}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                `/owner/hotels/${hotelId}/rooms/create`
                            )
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium transition"
                    >
                        + Add New Room
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {rooms.length === 0 && !error && (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">

                        <div className="text-5xl mb-4">
                            🛏️
                        </div>

                        <h2 className="text-xl font-semibold text-gray-900">
                            No rooms added yet
                        </h2>

                        <p className="text-gray-600 mt-2 mb-6">
                            Add your first room type for this hotel.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/owner/hotels/${hotelId}/rooms/create`
                                )
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium"
                        >
                            Add Your First Room
                        </button>
                    </div>
                )}

                {/* Room Grid */}
                {rooms.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {rooms.map((room) => (
                            <div
                                key={room._id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition"
                            >

                                {/* Room Image */}
                                <div className="h-52 bg-gray-100">

                                    {room.images?.length > 0 ? (
                                        <img
                                            src={room.images[0].url}
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Room Info */}
                                <div className="p-5">

                                    {/* Name + Status */}
                                    <div className="flex items-start justify-between gap-3">

                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {room.name}
                                            </h2>

                                            <p className="text-sm text-gray-500 mt-1 capitalize">
                                                {room.bedType} bed
                                            </p>
                                        </div>

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                room.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {room.status === "active"
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </div>

                                    {/* Room Details */}
                                    <div className="grid grid-cols-2 gap-3 mt-4">

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Capacity
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {room.capacity}{" "}
                                                {room.capacity === 1
                                                    ? "Person"
                                                    : "People"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Total Rooms
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {room.totalRooms}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Price / Night
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                ₹{room.price}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Check-in
                                            </p>

                                            <p className="text-sm font-medium text-gray-900">
                                                {room.checkInTime}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                                        {room.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="grid grid-cols-2 gap-2 mt-5">

                                        {/* View */}
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/owner/hotels/${hotelId}/rooms/${room._id}`
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
                                                    `/owner/hotels/${hotelId}/rooms/${room._id}/edit`
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                    </div>

                                    {/* Activate / Deactivate */}
                                    {room.status === "active" ? (
                                        <button
                                            onClick={() =>
                                                handleDeactivate(
                                                    room._id
                                                )
                                            }
                                            className="w-full mt-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            Deactivate Room
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleActivate(
                                                    room._id
                                                )
                                            }
                                            className="w-full mt-2 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg text-sm font-medium transition"
                                        >
                                            Activate Room
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

export default ManageRooms;