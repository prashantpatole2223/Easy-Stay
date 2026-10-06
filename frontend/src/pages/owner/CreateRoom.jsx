import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const CreateRoom = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();

    const [hotel, setHotel] = useState(null);
    const [availableAmenities, setAvailableAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [images, setImages] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        bedType: "",
        capacity: "",
        price: "",
        totalRooms: "",
        checkInTime: "",
        checkOutTime: ""
    });

    const [highlightInput, setHighlightInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, [hotelId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            console.log("before calling amenities api")
            const [hotelResponse, amenitiesResponse] = await Promise.all([
                api.get(`/rooms/hotel/${hotelId}`),
                api.get("/rooms/amenities")
            ]);

            setHotel(
                hotelResponse.data.hotel
            );

            setAvailableAmenities(
                amenitiesResponse.data.amenities
            );
            console.log("amenitiesResponse.data : ", amenitiesResponse.data);
            console.log("availableAmenities : ", availableAmenities)
        } catch (error) {
            console.log("after calling amenities api")
            setError(
                error.response?.data?.message ||
                "Failed to load room creation data"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleAmenity = (amenityId) => {
        setSelectedAmenities((prev) => {
            const exists = prev.some(
                (item) => item.amenityId === amenityId
            );

            if (exists) {
                return prev.filter(
                    (item) => item.amenityId !== amenityId
                );
            }

            return [
                ...prev,
                {
                    amenityId,
                    subAmenities: []
                }
            ];
        });
    };

    const addSubAmenity = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.map((item) =>
                item.amenityId === amenityId
                    ? {
                          ...item,
                          subAmenities: [
                              ...item.subAmenities,
                              ""
                          ]
                      }
                    : item
            )
        );
    };

    const updateSubAmenity = (
        amenityId,
        index,
        value
    ) => {
        setSelectedAmenities((prev) =>
            prev.map((item) => {
                if (item.amenityId !== amenityId) {
                    return item;
                }

                const updatedSubAmenities = [
                    ...item.subAmenities
                ];

                updatedSubAmenities[index] = value;

                return {
                    ...item,
                    subAmenities: updatedSubAmenities
                };
            })
        );
    };

    const removeSubAmenity = (
        amenityId,
        index
    ) => {
        setSelectedAmenities((prev) =>
            prev.map((item) => {
                if (item.amenityId !== amenityId) {
                    return item;
                }

                return {
                    ...item,
                    subAmenities:
                        item.subAmenities.filter(
                            (_, i) => i !== index
                        )
                };
            })
        );
    };

    const addHighlight = () => {
        const value = highlightInput.trim();

        if (!value) return;

        setHighlights((prev) => [
            ...prev,
            value
        ]);

        setHighlightInput("");
    };

    const removeHighlight = (index) => {
        setHighlights((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        setImages((prev) => [
            ...prev,
            ...files
        ]);

        e.target.value = "";
    };

    const removeImage = (index) => {
        setImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSubmitting(true);
            setError("");

            const data = new FormData();

            data.append("name", formData.name);
            data.append(
                "description",
                formData.description
            );
            data.append(
                "bedType",
                formData.bedType
            );
            data.append(
                "capacity",
                formData.capacity
            );
            data.append(
                "price",
                formData.price
            );
            data.append(
                "totalRooms",
                formData.totalRooms
            );
            data.append(
                "checkInTime",
                formData.checkInTime
            );
            data.append(
                "checkOutTime",
                formData.checkOutTime
            );

            data.append(
                "amenities",
                JSON.stringify(
                    selectedAmenities.map((item) => ({
                        ...item,
                        subAmenities:
                            item.subAmenities
                                .map((value) =>
                                    value.trim()
                                )
                                .filter(Boolean)
                    }))
                )
            );

            data.append(
                "highlights",
                JSON.stringify(highlights)
            );

            images.forEach((image) => {
                data.append("images", image);
            });

            await api.post(
                `/rooms/hotels/${hotelId}/create`,
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            navigate(
                `/owner/hotels/${hotelId}/rooms`
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create room"
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-6 py-8">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/owner/hotels/${hotelId}/rooms`
                            )
                        }
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3"
                    >
                        ← Back to Manage Rooms
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Add New Room
                    </h1>

                    {hotel && (
                        <p className="text-gray-600 mt-1">
                            Hotel: {hotel.name}
                        </p>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">

                        <h2 className="text-xl font-semibold text-gray-900 mb-5">
                            Basic Information
                        </h2>

                        <div className="space-y-5">

                            {/* Room Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Room Name / Type
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Deluxe Room"
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe this room..."
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Bed + Capacity */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bed Type
                                    </label>

                                    <select
                                        name="bedType"
                                        value={formData.bedType}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">
                                            Select bed type
                                        </option>

                                        <option value="single">
                                            Single
                                        </option>

                                        <option value="twin">
                                            Twin
                                        </option>

                                        <option value="double">
                                            Double
                                        </option>

                                        <option value="queen">
                                            Queen
                                        </option>

                                        <option value="king">
                                            King
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Maximum Capacity
                                    </label>

                                    <input
                                        type="number"
                                        name="capacity"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="e.g. 3"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Price + Total Rooms */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Per Night (₹)
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="e.g. 3500"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Rooms
                                    </label>

                                    <input
                                        type="number"
                                        name="totalRooms"
                                        value={formData.totalRooms}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="e.g. 10"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Check-in / Check-out */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Check-in & Check-out
                        </h2>

                        <p className="text-sm text-gray-500 mb-5">
                            Set the standard check-in and check-out times for this room.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-in Time
                                </label>

                                <input
                                    type="time"
                                    name="checkInTime"
                                    value={formData.checkInTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Check-out Time
                                </label>

                                <input
                                    type="time"
                                    name="checkOutTime"
                                    value={formData.checkOutTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Room Amenities
                        </h2>

                        <p className="text-sm text-gray-500 mb-5">
                            Select the amenities available in this room.
                        </p>

                        {availableAmenities.length === 0 ? (
                            <p className="text-gray-500">
                                No room amenities available.
                            </p>
                        ) : (
                            <div className="space-y-4">

                                {availableAmenities.map(
                                    (amenity) => {

                                        const selected =
                                            selectedAmenities.find(
                                                (item) =>
                                                    item.amenityId ===
                                                    amenity._id
                                            );

                                        return (
                                            <div
                                                key={amenity._id}
                                                className="border border-gray-200 rounded-lg p-4"
                                            >

                                                <label className="flex items-center gap-3 cursor-pointer">

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            !!selected
                                                        }
                                                        onChange={() =>
                                                            toggleAmenity(
                                                                amenity._id
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />

                                                    <span className="font-medium text-gray-900">
                                                        {amenity.name}
                                                    </span>

                                                </label>

                                                {selected && (
                                                    <div className="ml-7 mt-4">

                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            Sub-amenities
                                                        </p>

                                                        {selected.subAmenities.map(
                                                            (
                                                                value,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="flex gap-2 mb-2"
                                                                >

                                                                    <input
                                                                        type="text"
                                                                        value={
                                                                            value
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            updateSubAmenity(
                                                                                amenity._id,
                                                                                index,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        placeholder="e.g. Free, Private"
                                                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeSubAmenity(
                                                                                amenity._id,
                                                                                index
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:bg-red-50 px-3 rounded-lg"
                                                                    >
                                                                        ×
                                                                    </button>

                                                                </div>
                                                            )
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addSubAmenity(
                                                                    amenity._id
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                        >
                                                            + Add Sub-amenity
                                                        </button>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        )}
                    </div>

                    {/* Highlights */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Room Highlights
                        </h2>

                        <p className="text-sm text-gray-500 mb-5">
                            Add special selling points for this room.
                        </p>

                        <div className="flex gap-2">

                            <input
                                type="text"
                                value={highlightInput}
                                onChange={(e) =>
                                    setHighlightInput(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key === "Enter"
                                    ) {
                                        e.preventDefault();
                                        addHighlight();
                                    }
                                }}
                                placeholder="e.g. Mountain View"
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                            />

                            <button
                                type="button"
                                onClick={addHighlight}
                                className="bg-gray-800 hover:bg-gray-900 text-white px-5 rounded-lg font-medium"
                            >
                                Add
                            </button>

                        </div>

                        {highlights.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">

                                {highlights.map(
                                    (highlight, index) => (
                                        <div
                                            key={index}
                                            className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                                        >
                                            {highlight}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeHighlight(
                                                        index
                                                    )
                                                }
                                                className="text-blue-600 hover:text-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    )
                                )}

                            </div>
                        )}
                    </div>

                    {/* Images */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">

                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Room Images
                        </h2>

                        <p className="text-sm text-gray-500 mb-5">
                            Add photos of this room. The first image will be used as the main image.
                        </p>

                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple
                            onChange={handleImageChange}
                            className="w-full border border-gray-300 rounded-lg p-3"
                        />

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

                                {images.map(
                                    (image, index) => (
                                        <div
                                            key={index}
                                            className="relative"
                                        >

                                            <img
                                                src={URL.createObjectURL(
                                                    image
                                                )}
                                                alt={`Room ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />

                                            {index === 0 && (
                                                <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    Main
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeImage(
                                                        index
                                                    )
                                                }
                                                className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full"
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pb-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/owner/hotels/${hotelId}/rooms`
                                )
                            }
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            {submitting
                                ? "Creating..."
                                : "Create Room"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateRoom;