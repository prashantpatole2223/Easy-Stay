import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const EditRoom = () => {
    const { hotelId, roomId } = useParams();
    const navigate = useNavigate();

    const [room, setRoom] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [availableAmenities, setAvailableAmenities] = useState([]);

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

    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [highlightInput, setHighlightInput] = useState("");

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [roomResponse, amenitiesResponse] = await Promise.all([
                    api.get(`/rooms/${roomId}`),
                    api.get("/rooms/amenities")
                ]);

                const fetchedRoom = roomResponse.data.room;

                setRoom(fetchedRoom);
                setHotel(roomResponse.data.hotel);

                setAvailableAmenities(
                    amenitiesResponse.data.amenities || []
                );

                setFormData({
                    name: fetchedRoom.name || "",
                    description: fetchedRoom.description || "",
                    bedType: fetchedRoom.bedType || "",
                    capacity: fetchedRoom.capacity || "",
                    price: fetchedRoom.price || "",
                    totalRooms: fetchedRoom.totalRooms || "",
                    checkInTime: fetchedRoom.checkInTime || "",
                    checkOutTime: fetchedRoom.checkOutTime || ""
                });

                setSelectedAmenities(
                    (fetchedRoom.amenities || []).map((amenity) => ({
                        amenityId:
                            amenity.amenityId?._id ||
                            amenity.amenityId,
                        subAmenities: amenity.subAmenities || []
                    }))
                );

                setHighlights(fetchedRoom.highlights || []);
                setExistingImages(fetchedRoom.images || []);
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

        fetchData();
    }, [roomId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =========================
    // Amenities
    // =========================

    const isAmenitySelected = (amenityId) => {
        return selectedAmenities.some(
            (item) => item.amenityId === amenityId
        );
    };

    const getSelectedAmenity = (amenityId) => {
        return selectedAmenities.find(
            (item) => item.amenityId === amenityId
        );
    };

    const handleAmenityToggle = (amenityId) => {
        setSelectedAmenities((previous) => {
            const alreadySelected = previous.some(
                (item) => item.amenityId === amenityId
            );

            if (alreadySelected) {
                return previous.filter(
                    (item) => item.amenityId !== amenityId
                );
            }

            return [
                ...previous,
                {
                    amenityId,
                    subAmenities: []
                }
            ];
        });
    };

    const addSubAmenity = (amenityId) => {
        setSelectedAmenities((previous) =>
            previous.map((item) =>
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
        setSelectedAmenities((previous) =>
            previous.map((item) => {
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
        setSelectedAmenities((previous) =>
            previous.map((item) => {
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

    // =========================
    // Highlights
    // =========================

    const handleAddHighlight = () => {
        const value = highlightInput.trim();

        if (!value) {
            return;
        }

        setHighlights((previous) => [
            ...previous,
            value
        ]);

        setHighlightInput("");
    };

    const handleRemoveHighlight = (indexToRemove) => {
        setHighlights((previous) =>
            previous.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };

    // =========================
    // Images
    // =========================

    const handleNewImages = (event) => {
        const files = Array.from(
            event.target.files || []
        );

        setNewImages((previous) => [
            ...previous,
            ...files
        ]);

        event.target.value = "";
    };

    const handleRemoveNewImage = (indexToRemove) => {
        setNewImages((previous) =>
            previous.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };

    const handleRemoveExistingImage = (
        indexToRemove
    ) => {
        setExistingImages((previous) =>
            previous.filter(
                (_, index) => index !== indexToRemove
            )
        );
    };

    // =========================
    // Submit
    // =========================

    const handleSubmit = async (event) => {
        event.preventDefault();

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

            // Clean empty sub-amenities before sending
            data.append(
                "amenities",
                JSON.stringify(
                    selectedAmenities.map((item) => ({
                        amenityId: item.amenityId,
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

            data.append(
                "existingImages",
                JSON.stringify(existingImages)
            );

            newImages.forEach((image) => {
                data.append("images", image);
            });

            await api.patch(
                `/rooms/${roomId}`,
                data
            );

            navigate(
                `/owner/hotels/${hotelId}/rooms/${roomId}`
            );
        } catch (error) {
            console.error(
                "Failed to update room:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to update room."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">
                    Loading room...
                </p>
            </div>
        );
    }

    if (error && !room) {
        return (
            <div className="min-h-screen p-6">
                <div className="max-w-5xl mx-auto">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/owner/hotels/${hotelId}/rooms`
                            )
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/owner/hotels/${hotelId}/rooms/${roomId}`
                            )
                        }
                        className="text-blue-600 hover:underline mb-3"
                    >
                        ← Back to Room
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Edit Room
                    </h1>

                    {hotel && (
                        <p className="text-gray-500 mt-1">
                            {hotel.name}
                        </p>
                    )}
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-5">
                            Basic Information
                        </h2>

                        <div className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Room Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                    placeholder="e.g. Deluxe Room"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full border rounded-lg px-4 py-2.5"
                                    placeholder="Describe the room..."
                                />
                            </div>

                        </div>
                    </div>

                    {/* Room Details */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-5">
                            Room Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Bed Type
                                </label>

                                <select
                                    name="bedType"
                                    value={formData.bedType}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
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
                                <label className="block text-sm font-medium mb-2">
                                    Capacity
                                </label>

                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Price Per Night
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    min="0"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Total Rooms
                                </label>

                                <input
                                    type="number"
                                    name="totalRooms"
                                    min="1"
                                    value={formData.totalRooms}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Check-in Time
                                </label>

                                <input
                                    type="time"
                                    name="checkInTime"
                                    value={formData.checkInTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Check-out Time
                                </label>

                                <input
                                    type="time"
                                    name="checkOutTime"
                                    value={formData.checkOutTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-4 py-2.5"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Room Amenities
                        </h2>

                        <p className="text-sm text-gray-500 mb-5">
                            Select the amenities available in this room.
                        </p>

                        <div className="space-y-4">

                            {availableAmenities.length === 0 ? (
                                <p className="text-gray-500">
                                    No room amenities available.
                                </p>
                            ) : (
                                availableAmenities.map(
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
                                                className="border rounded-lg p-4"
                                            >

                                                {/* Amenity checkbox */}
                                                <label className="flex items-center gap-3 cursor-pointer">

                                                    <input
                                                        type="checkbox"
                                                        checked={!!selected}
                                                        onChange={() =>
                                                            handleAmenityToggle(
                                                                amenity._id
                                                            )
                                                        }
                                                        className="w-4 h-4"
                                                    />

                                                    <span className="font-medium">
                                                        {amenity.name}
                                                    </span>

                                                </label>

                                                {/* Sub amenities */}
                                                {selected && (
                                                    <div className="mt-3 ml-7">

                                                        <label className="block text-sm text-gray-600 mb-2">
                                                            Sub-amenities
                                                        </label>

                                                        {selected.subAmenities.map(
                                                            (
                                                                value,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex gap-2 mb-2"
                                                                >

                                                                    <input
                                                                        type="text"
                                                                        value={value}
                                                                        onChange={(
                                                                            event
                                                                        ) =>
                                                                            updateSubAmenity(
                                                                                amenity._id,
                                                                                index,
                                                                                event.target.value
                                                                            )
                                                                        }
                                                                        placeholder="e.g. Free, Private"
                                                                        className="flex-1 border rounded-lg px-3 py-2"
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
                                )
                            )}

                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-5">
                            Highlights
                        </h2>

                        <div className="flex gap-2">

                            <input
                                type="text"
                                value={highlightInput}
                                onChange={(event) =>
                                    setHighlightInput(
                                        event.target.value
                                    )
                                }
                                onKeyDown={(event) => {
                                    if (
                                        event.key === "Enter"
                                    ) {
                                        event.preventDefault();
                                        handleAddHighlight();
                                    }
                                }}
                                placeholder="e.g. Spacious room"
                                className="flex-1 border rounded-lg px-4 py-2.5"
                            />

                            <button
                                type="button"
                                onClick={handleAddHighlight}
                                className="bg-gray-800 text-white px-5 rounded-lg hover:bg-gray-900"
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
                                            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                                        >

                                            <span>
                                                {highlight}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveHighlight(
                                                        index
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    {/* Existing Images */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold mb-2">
                            Room Images
                        </h2>

                        <p className="text-sm text-gray-500 mb-5">
                            Remove existing images or add new ones.
                        </p>

                        {existingImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

                                {existingImages.map(
                                    (image, index) => (
                                        <div
                                            key={
                                                image.publicId ||
                                                index
                                            }
                                            className="relative"
                                        >

                                            <img
                                                src={image.url}
                                                alt={`${formData.name} ${
                                                    index + 1
                                                }`}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />

                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    Main Image
                                                </span>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveExistingImage(
                                                        index
                                                    )
                                                }
                                                className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700"
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                        <label className="inline-block cursor-pointer bg-gray-100 border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-200">
                            Add New Images

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleNewImages}
                                className="hidden"
                            />
                        </label>

                        {newImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

                                {newImages.map(
                                    (image, index) => (
                                        <div
                                            key={index}
                                            className="relative"
                                        >

                                            <img
                                                src={URL.createObjectURL(
                                                    image
                                                )}
                                                alt={`New ${
                                                    index + 1
                                                }`}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveNewImage(
                                                        index
                                                    )
                                                }
                                                className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full hover:bg-red-700"
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
                    <div className="flex flex-col sm:flex-row gap-3 justify-end pb-6">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/owner/hotels/${hotelId}/rooms/${roomId}`
                                )
                            }
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {submitting
                                ? "Updating..."
                                : "Update Room"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditRoom;