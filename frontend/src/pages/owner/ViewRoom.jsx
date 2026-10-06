import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const ViewRoom = () => {
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/rooms/${roomId}`);

                setRoom(response.data.room);
                setHotel(response.data.hotel);
            } catch (error) {
                console.error("Failed to fetch room:", error);

                setError(
                    error.response?.data?.message ||
                        "Failed to load room details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [roomId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading room...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() =>
                            navigate(`/owner/hotels/${hotelId}/rooms`)
                        }
                        className="mb-6 text-blue-600 hover:underline"
                    >
                        ← Back to Rooms
                    </button>

                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Room not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <button
                            onClick={() =>
                                navigate(`/owner/hotels/${hotelId}/rooms`)
                            }
                            className="text-blue-600 hover:underline mb-2"
                        >
                            ← Back to Rooms
                        </button>

                        <h1 className="text-3xl font-bold text-gray-900">
                            {room.name}
                        </h1>

                        {hotel && (
                            <p className="text-gray-500 mt-1">
                                {hotel.name}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            navigate(
                                `/owner/hotels/${hotelId}/rooms/${roomId}/edit`
                            )
                        }
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700"
                    >
                        Edit Room
                    </button>
                </div>

                {/* Status */}
                <div className="mb-6">
                    <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            room.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-200 text-gray-700"
                        }`}
                    >
                        {room.status === "active"
                            ? "Active"
                            : "Inactive"}
                    </span>
                </div>

                {/* Images */}
                {room.images?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Room Images
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {room.images.map((image, index) => (
                                <div
                                    key={image.publicId || index}
                                    className="relative"
                                >
                                    <img
                                        src={image.url}
                                        alt={`${room.name} ${index + 1}`}
                                        className="w-full h-56 object-cover rounded-lg"
                                    />

                                    {index === 0 && (
                                        <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                            Main Image
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Basic Details */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-5">
                        Room Details
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">
                                Room Type
                            </p>
                            <p className="font-medium capitalize">
                                {room.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Bed Type
                            </p>
                            <p className="font-medium capitalize">
                                {room.bedType}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Capacity
                            </p>
                            <p className="font-medium">
                                {room.capacity} Guest
                                {room.capacity !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Price
                            </p>
                            <p className="font-medium">
                                ₹{room.price} / night
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Rooms
                            </p>
                            <p className="font-medium">
                                {room.totalRooms}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Check-in
                            </p>
                            <p className="font-medium">
                                {room.checkInTime}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Check-out
                            </p>
                            <p className="font-medium">
                                {room.checkOutTime}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Description
                    </h2>

                    <p className="text-gray-600 leading-7">
                        {room.description}
                    </p>
                </div>

                {/* Amenities */}
                {room.amenities?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-5">
                            Room Amenities
                        </h2>

                        <div className="space-y-5">
                            {room.amenities.map((amenity, index) => (
                                <div key={index}>
                                    <p className="font-medium text-gray-800">
                                        {amenity.amenityId?.name ||
                                            "Amenity"}
                                    </p>

                                    {amenity.subAmenities?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {amenity.subAmenities.map(
                                                (subAmenity, subIndex) => (
                                                    <span
                                                        key={subIndex}
                                                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {subAmenity}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Highlights */}
                {room.highlights?.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-5">
                            Highlights
                        </h2>

                        <ul className="space-y-2">
                            {room.highlights.map(
                                (highlight, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2 text-gray-700"
                                    >
                                        <span className="text-green-600">
                                            ✓
                                        </span>
                                        <span>{highlight}</span>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ViewRoom;