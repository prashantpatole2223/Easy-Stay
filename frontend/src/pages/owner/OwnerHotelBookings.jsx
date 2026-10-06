import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useState } from "react";

import useOwnerHotelBookings from "../../hooks/useOwnerHotelBookings";
import OwnerBookingList from "../../components/owner-bookings/OwnerBookingList";

const OwnerHotelBookings = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("");

    const {
        bookings,
        loading,
        error,
        reload
    } = useOwnerHotelBookings({
        hotelId,
        status
    });

    const handleBookingClick = (booking) => {
        navigate(
            `/owner/hotels/${hotelId}/bookings/${booking._id}`
        );
    };

    const handleBack = () => {
        navigate("/owner/hotels");
    };

    return (<div className="min-h-screen bg-gray-50"> <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">


        {/* Header */}
        <div className="mb-6">

            <button
                type="button"
                onClick={handleBack}
                className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
                <ArrowLeft size={18} />
                Back to My Hotels
            </button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hotel Bookings
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage bookings for this hotel.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={reload}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        size={17}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>

            </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-sm font-semibold text-gray-900">
                        Filter Bookings
                    </p>

                    <p className="text-xs text-gray-500">
                        {bookings.length} booking
                        {bookings.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                    <option value="">
                        All Bookings
                    </option>

                    <option value="held">
                        Held
                    </option>

                    <option value="confirmed">
                        Confirmed
                    </option>

                    <option value="cancelled">
                        Cancelled
                    </option>

                    <option value="completed">
                        Completed
                    </option>
                </select>

            </div>
        </div>

        {/* Error */}
        {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
            </div>
        )}

        {/* Loading */}
        {loading ? (
            <div className="space-y-4">

                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5"
                    >
                        <div className="h-5 w-48 rounded bg-gray-200" />

                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div className="h-16 rounded bg-gray-100" />
                            <div className="h-16 rounded bg-gray-100" />
                            <div className="h-16 rounded bg-gray-100" />
                        </div>
                    </div>
                ))}

            </div>
        ) : (
            <OwnerBookingList
                bookings={bookings}
                onBookingClick={handleBookingClick}
            />
        )}

    </div>
    </div>


    );
};

export default OwnerHotelBookings;