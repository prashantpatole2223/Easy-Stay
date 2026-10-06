import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import {
    ArrowLeft,
    Upload,
    X,
    Plus,
    Trash2,
    MapPin,
    Wifi,
    Check,
} from "lucide-react";

const EditHotel = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [amenitiesLoading, setAmenitiesLoading] = useState(true);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [availableAmenities, setAvailableAmenities] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [highlights, setHighlights] = useState([]);

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        fetchData();
    }, [hotelId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [hotelResponse, amenitiesResponse] = await Promise.all([
                api.get(`/hotels/${hotelId}`),
                api.get("/hotels/amenities"),
            ]);

            const hotel = hotelResponse.data.hotel;
            const amenities = amenitiesResponse.data.amenities || [];

            setAvailableAmenities(amenities);

            setFormData({
                name: hotel?.name || "",
                description: hotel?.description || "",
                address: hotel?.address || "",
                city: hotel?.location?.city || "",
                state: hotel?.location?.state || "",
                country: hotel?.location?.country || "",
                latitude:
                    hotel?.location?.coordinates?.latitude !== undefined &&
                        hotel?.location?.coordinates?.latitude !== null
                        ? String(hotel.location.coordinates.latitude)
                        : "",
                longitude:
                    hotel?.location?.coordinates?.longitude !== undefined &&
                        hotel?.location?.coordinates?.longitude !== null
                        ? String(hotel.location.coordinates.longitude)
                        : "",
            });

            /*
             * IMPORTANT:
             *
             * Backend returns populated amenities like:
             *
             * {
             *   amenityId: {
             *     _id: "...",
             *     name: "WiFi",
             *     type: "hotel"
             *   },
             *   subAmenities: [...]
             * }
             *
             * But PATCH API expects:
             *
             * {
             *   amenityId: "...",
             *   subAmenities: [...]
             * }
             *
             * So normalize the populated object here.
             */
            const normalizedAmenities = Array.isArray(hotel?.amenities)
                ? hotel.amenities
                    .map((item) => ({
                        amenityId:
                            typeof item.amenityId === "object"
                                ? item.amenityId?._id
                                : item.amenityId,
                        subAmenities: Array.isArray(item.subAmenities)
                            ? item.subAmenities
                            : [],
                    }))
                    .filter((item) => item.amenityId)
                : [];

            setSelectedAmenities(normalizedAmenities);

            setHighlights(
                Array.isArray(hotel?.highlights) ? hotel.highlights : []
            );

            setExistingImages(
                Array.isArray(hotel?.images) ? hotel.images : []
            );
        } catch (error) {
            console.error("Failed to load hotel:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load hotel details."
            );
        } finally {
            setLoading(false);
            setAmenitiesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // --------------------------------------------------
    // Amenity selection
    // --------------------------------------------------

    const toggleAmenity = (amenityId) => {
        setSelectedAmenities((prev) => {
            const exists = prev.some(
                (item) => String(item.amenityId) === String(amenityId)
            );

            if (exists) {
                return prev.filter(
                    (item) =>
                        String(item.amenityId) !== String(amenityId)
                );
            }

            return [
                ...prev,
                {
                    amenityId,
                    subAmenities: [],
                },
            ];
        });
    };

    const isAmenitySelected = (amenityId) => {
        return selectedAmenities.some(
            (item) =>
                String(item.amenityId) === String(amenityId)
        );
    };

    const getSelectedAmenityData = (amenityId) => {
        return selectedAmenities.find(
            (item) =>
                String(item.amenityId) === String(amenityId)
        );
    };

    // --------------------------------------------------
    // Sub amenities
    // --------------------------------------------------

    const addSubAmenity = (amenityId) => {
        setSelectedAmenities((prev) =>
            prev.map((item) =>
                String(item.amenityId) === String(amenityId)
                    ? {
                        ...item,
                        subAmenities: [
                            ...(item.subAmenities || []),
                            "",
                        ],
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
                if (
                    String(item.amenityId) !==
                    String(amenityId)
                ) {
                    return item;
                }

                const updated = [
                    ...(item.subAmenities || []),
                ];

                updated[index] = value;

                return {
                    ...item,
                    subAmenities: updated,
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
                if (
                    String(item.amenityId) !==
                    String(amenityId)
                ) {
                    return item;
                }

                return {
                    ...item,
                    subAmenities: (
                        item.subAmenities || []
                    ).filter((_, i) => i !== index),
                };
            })
        );
    };

    // --------------------------------------------------
    // Highlights
    // --------------------------------------------------

    const addHighlight = () => {
        setHighlights((prev) => [
            ...prev,
            "",
        ]);
    };

    const updateHighlight = (
        index,
        value
    ) => {
        setHighlights((prev) => {
            const updated = [...prev];

            updated[index] = value;

            return updated;
        });
    };

    const removeHighlight = (index) => {
        setHighlights((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // --------------------------------------------------
    // Existing images
    // --------------------------------------------------

    const removeExistingImage = (index) => {
        setExistingImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // --------------------------------------------------
    // New images
    // --------------------------------------------------

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);

        setNewImages((prev) => [
            ...prev,
            ...files,
        ]);

        e.target.value = "";
    };

    const removeNewImage = (index) => {
        setNewImages((prev) =>
            prev.filter((_, i) => i !== index)
        );
    };

    // --------------------------------------------------
    // Submit
    // --------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const data = new FormData();

            // Basic information
            data.append(
                "name",
                formData.name
            );

            data.append(
                "description",
                formData.description
            );

            // Location
            data.append(
                "address",
                formData.address
            );

            data.append(
                "city",
                formData.city
            );

            data.append(
                "state",
                formData.state
            );

            data.append(
                "country",
                formData.country
            );

            // Coordinates
            if (formData.latitude !== "") {
                data.append(
                    "latitude",
                    formData.latitude
                );
            }

            if (formData.longitude !== "") {
                data.append(
                    "longitude",
                    formData.longitude
                );
            }

            // Amenities
            const cleanedAmenities =
                selectedAmenities.map((item) => ({
                    amenityId: item.amenityId,
                    subAmenities: (
                        item.subAmenities || []
                    )
                        .map((value) =>
                            value.trim()
                        )
                        .filter(
                            (value) => value !== ""
                        ),
                }));

            data.append(
                "amenities",
                JSON.stringify(cleanedAmenities)
            );

            // Highlights
            data.append(
                "highlights",
                JSON.stringify(
                    highlights
                        .map((highlight) =>
                            highlight.trim()
                        )
                        .filter(
                            (highlight) =>
                                highlight !== ""
                        )
                )
            );

            // New images
            newImages.forEach((image) => {
                data.append(
                    "images",
                    image
                );
            });

            const response = await api.patch(
                `/hotels/${hotelId}`,
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            console.log(
                "Hotel updated:",
                response.data
            );

            setSuccess(
                "Hotel updated successfully."
            );

            if (response.data.hotel) {
                setExistingImages(
                    response.data.hotel.images || []
                );
            }

            setNewImages([]);

            setTimeout(() => {
                navigate("/owner/my-hotels");
            }, 700);
        } catch (error) {
            console.error(
                "Update hotel error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update hotel."
            );
        } finally {
            setSaving(false);
        }
    };

    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-600">
                            Loading hotel details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-5xl">

                {/* Header */}

                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/owner/my-hotels")
                        }
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={18} />
                        Back to My Hotels
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Edit Hotel
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Update your property details and
                        keep your hotel information accurate.
                    </p>
                </div>

                {/* Error */}

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Success */}

                {success && (
                    <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >

                    {/* BASIC INFORMATION */}

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Basic Information
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update the information customers
                                see about your property.
                            </p>
                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Hotel Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. The Grand Palace"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe your hotel..."
                                    rows={6}
                                    required
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>
                    </section>

                    {/* LOCATION */}

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="mb-6 flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                <MapPin
                                    size={20}
                                    className="text-blue-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Location
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Update where your hotel is located.
                                </p>
                            </div>

                        </div>

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Full Address
                                </label>

                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter the complete hotel address"
                                    rows={3}
                                    required
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-3">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Mumbai"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Maharashtra"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Country
                                    </label>

                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="India"
                                        required
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                            </div>

                            <div>
                                <div className="mb-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        Coordinates
                                        <span className="ml-2 text-xs font-normal text-gray-400">
                                            Optional
                                        </span>
                                    </label>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Update these if you want to show
                                        the property accurately on a map.
                                    </p>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <input
                                        type="number"
                                        step="any"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        placeholder="Latitude"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <input
                                        type="number"
                                        step="any"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        placeholder="Longitude"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>
                            </div>

                        </div>
                    </section>

                    {/* AMENITIES */}

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="mb-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                    <Wifi
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Hotel Amenities
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Select, remove, or edit the
                                        facilities available at your hotel.
                                    </p>
                                </div>

                            </div>

                        </div>

                        {amenitiesLoading ? (
                            <div className="py-10 text-center text-sm text-gray-500">
                                Loading amenities...
                            </div>
                        ) : availableAmenities.length === 0 ? (
                            <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                No hotel amenities available.
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">

                                {availableAmenities.map((amenity) => {

                                    const selected =
                                        isAmenitySelected(
                                            amenity._id
                                        );

                                    const selectedData =
                                        getSelectedAmenityData(
                                            amenity._id
                                        );

                                    const subAmenities =
                                        selectedData?.subAmenities || [];

                                    return (
                                        <div
                                            key={amenity._id}
                                            className={`overflow-hidden rounded-xl border transition ${selected
                                                ? "border-blue-500 bg-blue-50/40"
                                                : "border-gray-200 bg-white"
                                                }`}
                                        >

                                            {/* Main Amenity */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleAmenity(
                                                        amenity._id
                                                    )
                                                }
                                                className="flex w-full items-center justify-between gap-3 p-4 text-left hover:bg-gray-50"
                                            >

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${selected
                                                            ? "border-blue-600 bg-blue-600"
                                                            : "border-gray-300 bg-white"
                                                            }`}
                                                    >
                                                        {selected && (
                                                            <Check
                                                                size={14}
                                                                className="text-white"
                                                            />
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="font-medium text-gray-800">
                                                            {amenity.name}
                                                        </p>

                                                        {selected && (
                                                            <p className="mt-0.5 text-xs text-blue-600">
                                                                Selected
                                                            </p>
                                                        )}
                                                    </div>

                                                </div>

                                                <span
                                                    className={`text-xs font-medium ${selected
                                                        ? "text-blue-600"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    {selected
                                                        ? "Added"
                                                        : "Add"}
                                                </span>

                                            </button>

                                            {/* Sub Amenities */}

                                            {selected && (
                                                <div className="border-t border-blue-100 px-4 pb-4 pt-4">

                                                    <div className="mb-3 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-700">
                                                                Details
                                                            </p>

                                                            <p className="text-xs text-gray-400">
                                                                Add extra details for this amenity
                                                            </p>
                                                        </div>

                                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                            {subAmenities.length}
                                                        </span>
                                                    </div>

                                                    {subAmenities.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {subAmenities.map(
                                                                (
                                                                    subAmenity,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={`${amenity._id}-${index}`}
                                                                        className="flex gap-2"
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subAmenity
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateSubAmenity(
                                                                                    amenity._id,
                                                                                    index,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="e.g. Outdoor pool"
                                                                            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                                        />

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                removeSubAmenity(
                                                                                    amenity._id,
                                                                                    index
                                                                                )
                                                                            }
                                                                            className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                                                            title="Remove detail"
                                                                        >
                                                                            <Trash2
                                                                                size={
                                                                                    17
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-3 py-3 text-xs text-gray-400">
                                                            No additional details added.
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            addSubAmenity(
                                                                amenity._id
                                                            )
                                                        }
                                                        className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                                                    >
                                                        <Plus size={15} />
                                                        Add detail
                                                    </button>

                                                </div>
                                            )}

                                        </div>
                                    );
                                })}

                            </div>
                        )}

                    </section>

                    {/* HIGHLIGHTS */}

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Special Highlights
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update special things about your
                                property that can attract customers.
                            </p>
                        </div>

                        <div className="space-y-3">

                            {highlights.map(
                                (highlight, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2"
                                    >

                                        <input
                                            type="text"
                                            value={highlight}
                                            onChange={(e) =>
                                                updateHighlight(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. Beautiful mountain view"
                                            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeHighlight(
                                                    index
                                                )
                                            }
                                            className="rounded-lg p-3 text-gray-400 hover:bg-red-50 hover:text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>
                                )
                            )}

                            <button
                                type="button"
                                onClick={addHighlight}
                                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                <Plus size={16} />
                                Add highlight
                            </button>

                        </div>
                    </section>

                    {/* PHOTOS */}

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Hotel Photos
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Add new photos to your hotel.
                            </p>
                        </div>

                        {existingImages.length > 0 && (
                            <div className="mb-6">

                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    Current Photos
                                </h3>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                                    {existingImages.map(
                                        (image, index) => (
                                            <div
                                                key={
                                                    image.publicId ||
                                                    image.url ||
                                                    index
                                                }
                                                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                                            >

                                                <img
                                                    src={image.url}
                                                    alt={`Hotel ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                                                >
                                                    <X size={16} />
                                                </button>

                                                {index === 0 && (
                                                    <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white">
                                                        Main photo
                                                    </span>
                                                )}

                                            </div>
                                        )
                                    )}

                                </div>
                            </div>
                        )}

                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 transition hover:border-blue-400 hover:bg-blue-50/30">

                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                                <Upload
                                    size={22}
                                    className="text-blue-600"
                                />
                            </div>

                            <p className="font-semibold text-gray-700">
                                Add more hotel photos
                            </p>

                            <p className="mt-1 text-sm text-gray-400">
                                PNG, JPG or WEBP
                            </p>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />

                        </label>

                        {newImages.length > 0 && (
                            <div className="mt-5">

                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                    New Photos
                                </h3>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                                    {newImages.map(
                                        (image, index) => (
                                            <div
                                                key={`${image.name}-${index}`}
                                                className="group relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                                            >

                                                <img
                                                    src={URL.createObjectURL(
                                                        image
                                                    )}
                                                    alt={`New hotel ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeNewImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
                                                >
                                                    <X size={16} />
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>
                            </div>
                        )}

                    </section>

                    {/* ACTIONS */}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/owner/my-hotels")
                            }
                            disabled={saving}
                            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? "Saving Changes..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );


};

export default EditHotel;