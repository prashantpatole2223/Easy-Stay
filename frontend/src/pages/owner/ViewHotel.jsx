import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import {
    ArrowLeft,
    Edit,
    MapPin,
    Wifi,
    Check,
    Image as ImageIcon,
    Star,
} from "lucide-react";

const ViewHotel = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();


    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchHotel();
    }, [hotelId]);

    const fetchHotel = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(
                `/hotels/${hotelId}`
            );

            setHotel(response.data.hotel);
        } catch (error) {
            console.error(
                "Failed to load hotel:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load hotel details."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
                        <p className="text-gray-600">
                            Loading hotel details...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
                <div className="mx-auto max-w-6xl">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/owner/hotels")
                        }
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={18} />
                        Back to My Hotels
                    </button>

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                        {error ||
                            "Hotel not found."}
                    </div>

                </div>
            </div>
        );
    }

    const location = hotel.location || {};

    const coordinates =
        location.coordinates || {};

    const amenities =
        Array.isArray(hotel.amenities)
            ? hotel.amenities
            : [];

    const highlights =
        Array.isArray(hotel.highlights)
            ? hotel.highlights
            : [];

    const images =
        Array.isArray(hotel.images)
            ? hotel.images
            : [];

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-6xl">

                {/* Header */}

                <div className="mb-6">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/owner/hotels")
                        }
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={18} />
                        Back to My Hotels
                    </button>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                            <div className="mb-2 flex items-center gap-2">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${hotel.status ===
                                            "active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {hotel.status ===
                                        "active"
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                {hotel.name}
                            </h1>

                            <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                                <MapPin
                                    size={17}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {location.city},{" "}
                                    {location.state},{" "}
                                    {location.country}
                                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/owner/hotels/${hotel._id}/edit`
                                )
                            }
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Edit size={17} />
                            Edit Hotel
                        </button>

                    </div>
                </div>

                {/* Main Image */}

                {images.length > 0 ? (
                    <section className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="relative aspect-[16/7] w-full overflow-hidden bg-gray-100">

                            <img
                                src={images[0].url}
                                alt={hotel.name}
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white">
                                {images.length}{" "}
                                {images.length === 1
                                    ? "photo"
                                    : "photos"}
                            </div>

                        </div>

                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3 p-4 sm:grid-cols-6 md:grid-cols-8">

                                {images
                                    .slice(1)
                                    .map(
                                        (
                                            image,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    image.publicId ||
                                                    image.url ||
                                                    index
                                                }
                                                className="aspect-square overflow-hidden rounded-lg bg-gray-100"
                                            >
                                                <img
                                                    src={
                                                        image.url
                                                    }
                                                    alt={`${hotel.name} ${index +
                                                        2
                                                        }`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )
                                    )}

                            </div>
                        )}

                    </section>
                ) : (
                    <section className="mb-6 flex aspect-[16/7] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="text-center text-gray-400">
                            <ImageIcon
                                size={40}
                                className="mx-auto mb-2"
                            />

                            <p className="text-sm">
                                No hotel photos available
                            </p>
                        </div>

                    </section>
                )}

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Left / Main */}

                    <div className="space-y-6 lg:col-span-2">

                        {/* Description */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="mb-4 text-xl font-semibold text-gray-900">
                                About the Hotel
                            </h2>

                            <p className="whitespace-pre-line leading-7 text-gray-600">
                                {hotel.description ||
                                    "No description available."}
                            </p>

                        </section>

                        {/* Amenities */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-3">

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

                                    <p className="text-sm text-gray-500">
                                        Facilities and services available
                                        at this property.
                                    </p>
                                </div>

                            </div>

                            {amenities.length === 0 ? (
                                <div className="rounded-lg bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                                    No amenities added.
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">

                                    {amenities.map(
                                        (
                                            item,
                                            index
                                        ) => {

                                            const amenity =
                                                typeof item.amenityId ===
                                                    "object"
                                                    ? item.amenityId
                                                    : null;

                                            const subAmenities =
                                                Array.isArray(
                                                    item.subAmenities
                                                )
                                                    ? item.subAmenities
                                                    : [];

                                            return (
                                                <div
                                                    key={
                                                        amenity?._id ||
                                                        index
                                                    }
                                                    className="rounded-xl border border-gray-200 bg-white p-4"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50">
                                                            <Check
                                                                size={
                                                                    18
                                                                }
                                                                className="text-green-600"
                                                            />
                                                        </div>

                                                        <div>
                                                            <p className="font-semibold text-gray-800">
                                                                {amenity?.name ||
                                                                    "Amenity"}
                                                            </p>

                                                            {amenity?.type && (
                                                                <p className="text-xs capitalize text-gray-400">
                                                                    {
                                                                        amenity.type
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>

                                                    </div>

                                                    {subAmenities.length >
                                                        0 && (
                                                            <div className="mt-4 border-t border-gray-100 pt-3">

                                                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                    Details
                                                                </p>

                                                                <div className="space-y-1.5">

                                                                    {subAmenities.map(
                                                                        (
                                                                            subAmenity,
                                                                            subIndex
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    subIndex
                                                                                }
                                                                                className="flex items-center gap-2 text-sm text-gray-600"
                                                                            >
                                                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

                                                                                {
                                                                                    subAmenity
                                                                                }
                                                                            </div>
                                                                        )
                                                                    )}

                                                                </div>

                                                            </div>
                                                        )}

                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            )}

                        </section>

                        {/* Highlights */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div className="mb-5 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-50">
                                    <Star
                                        size={20}
                                        className="text-yellow-600"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Special Highlights
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        What makes this property special.
                                    </p>
                                </div>

                            </div>

                            {highlights.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No highlights added.
                                </p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">

                                    {highlights.map(
                                        (
                                            highlight,
                                            index
                                        ) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-3 rounded-xl bg-gray-50 p-4"
                                            >
                                                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                                    <Check
                                                        size={14}
                                                        className="text-blue-600"
                                                    />
                                                </div>

                                                <p className="text-sm leading-6 text-gray-700">
                                                    {
                                                        highlight
                                                    }
                                                </p>
                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </section>

                    </div>

                    {/* Right / Details */}

                    <div className="space-y-6">

                        {/* Location */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <div className="mb-4 flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                                    <MapPin
                                        size={20}
                                        className="text-blue-600"
                                    />
                                </div>

                                <h2 className="text-xl font-semibold text-gray-900">
                                    Location
                                </h2>

                            </div>

                            <div className="space-y-4">

                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Address
                                    </p>

                                    <p className="text-sm leading-6 text-gray-700">
                                        {hotel.address}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        City
                                    </p>

                                    <p className="text-sm text-gray-700">
                                        {location.city}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        State
                                    </p>

                                    <p className="text-sm text-gray-700">
                                        {location.state}
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                        Country
                                    </p>

                                    <p className="text-sm text-gray-700">
                                        {location.country}
                                    </p>
                                </div>

                                {(coordinates.latitude !==
                                    undefined ||
                                    coordinates.longitude !==
                                    undefined) && (
                                        <div>
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Coordinates
                                            </p>

                                            <p className="text-sm text-gray-700">
                                                {coordinates.latitude ??
                                                    "—"}
                                                ,{" "}
                                                {coordinates.longitude ??
                                                    "—"}
                                            </p>
                                        </div>
                                    )}

                            </div>

                        </section>

                        {/* Hotel Information */}

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                            <h2 className="mb-4 text-xl font-semibold text-gray-900">
                                Hotel Information
                            </h2>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-gray-500">
                                        Status
                                    </span>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${hotel.status ===
                                                "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {hotel.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-gray-500">
                                        Amenities
                                    </span>

                                    <span className="text-sm font-semibold text-gray-800">
                                        {amenities.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-gray-500">
                                        Highlights
                                    </span>

                                    <span className="text-sm font-semibold text-gray-800">
                                        {highlights.length}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-gray-500">
                                        Photos
                                    </span>

                                    <span className="text-sm font-semibold text-gray-800">
                                        {images.length}
                                    </span>
                                </div>

                            </div>

                        </section>

                        {/* Edit button */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/owner/hotels/${hotel._id}/edit`
                                )
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Edit size={18} />
                            Edit Hotel
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );


};

export default ViewHotel;