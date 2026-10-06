import {
    ArrowLeft,
    BedDouble,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    Hotel,
    IndianRupee,
    MapPin,
    Phone,
    User
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import useOwnerBookingDetails from "../../hooks/useOwnerBookingDetails";

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatDateTime = (date) => {
    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount || 0);
};

const getStatusClasses = (status) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-700";


        case "held":
            return "bg-yellow-100 text-yellow-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        case "completed":
            return "bg-blue-100 text-blue-700";

        default:
            return "bg-gray-100 text-gray-700";


    }
};

const getPaymentStatusClasses = (status) => {
    switch (status) {
        case "success":
            return "bg-green-100 text-green-700";


        case "pending":
            return "bg-yellow-100 text-yellow-700";

        case "failed":
            return "bg-red-100 text-red-700";

        case "refunded":
        case "partially_refunded":
            return "bg-purple-100 text-purple-700";

        case "created":
            return "bg-gray-100 text-gray-700";

        default:
            return "bg-gray-100 text-gray-700";


    }
};

const OwnerBookingDetails = () => {
    const { hotelId, bookingId } = useParams();
    const navigate = useNavigate();

    const {
        booking,
        hotel,
        payment,
        loading,
        error
    } = useOwnerBookingDetails({
        hotelId,
        bookingId
    });

    const handleBack = () => {
        navigate(`/owner/hotels/${hotelId}/bookings`);
    };

    if (loading) {
        return (<div className="min-h-screen bg-gray-50"> <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">


            <div className="animate-pulse">

                <div className="h-5 w-32 rounded bg-gray-200" />

                <div className="mt-6 h-8 w-64 rounded bg-gray-200" />

                <div className="mt-2 h-4 w-80 rounded bg-gray-200" />

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <div className="space-y-6 lg:col-span-2">
                        <div className="h-64 rounded-2xl bg-gray-200" />
                        <div className="h-64 rounded-2xl bg-gray-200" />
                        <div className="h-64 rounded-2xl bg-gray-200" />
                    </div>

                    <div>
                        <div className="h-80 rounded-2xl bg-gray-200" />
                    </div>

                </div>

            </div>
        </div>
        </div>
        );


    }

    if (error) {
        return (<div className="min-h-screen bg-gray-50"> <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">


            <button
                type="button"
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={18} />
                Back to Bookings
            </button>

            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
                <h1 className="text-xl font-semibold text-red-700">
                    Unable to load booking
                </h1>

                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            </div>

        </div>
        </div>
        );


    }

    if (!booking || !hotel) {
        return (<div className="min-h-screen bg-gray-50"> <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">


            <button
                type="button"
                onClick={handleBack}
                className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={18} />
                Back to Bookings
            </button>

            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                    Booking not found
                </h1>
            </div>

        </div>
        </div>
        );


    }

    return (<div className="min-h-screen bg-gray-50"> <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">


        {/* Back */}
        <button
            type="button"
            onClick={handleBack}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
            <ArrowLeft size={18} />
            Back to Bookings
        </button>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
                <p className="text-sm text-gray-500">
                    Booking ID
                </p>

                <h1 className="mt-1 break-all text-2xl font-bold text-gray-900">
                    {booking._id}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Created on {formatDateTime(booking.createdAt)}
                </p>
            </div>

            <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusClasses(
                    booking.status
                )}`}
            >
                {booking.status}
            </span>

        </div>

        {/* Main Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Left */}
            <div className="space-y-6 lg:col-span-2">

                {/* Guest Information */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <User size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Guest Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Customer details for this booking
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Name
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {booking.guestInfo?.name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Email
                            </p>

                            <p className="mt-1 break-all text-sm font-medium text-gray-900">
                                {booking.guestInfo?.email || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Phone
                            </p>

                            <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                                <Phone size={16} className="text-gray-500" />
                                {booking.guestInfo?.phone || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Guests
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {booking.guestCount || 0}
                            </p>
                        </div>

                    </div>
                </section>

                {/* Hotel Information */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Hotel size={21} />
                        </div>

                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {hotel.name}
                            </h2>

                            {hotel.address && (
                                <p className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                                    <MapPin
                                        size={17}
                                        className="mt-0.5 shrink-0"
                                    />
                                    <span>
                                        {hotel.address}
                                    </span>
                                </p>
                            )}
                        </div>

                    </div>

                    {hotel.description && (
                        <p className="mt-5 text-sm leading-6 text-gray-600">
                            {hotel.description}
                        </p>
                    )}

                    {hotel.highlights?.length > 0 && (
                        <div className="mt-5">

                            <p className="text-sm font-semibold text-gray-900">
                                Highlights
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {hotel.highlights.map((highlight, index) => (
                                    <span
                                        key={`${highlight}-${index}`}
                                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                                    >
                                        {highlight}
                                    </span>
                                ))}
                            </div>

                        </div>
                    )}

                </section>

                {/* Stay Information */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <CalendarDays size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Stay Information
                            </h2>

                            <p className="text-sm text-gray-500">
                                Check-in and check-out details
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Check-in
                            </p>

                            <p className="mt-2 text-base font-semibold text-gray-900">
                                {formatDate(booking.checkIn)}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Check-out
                            </p>

                            <p className="mt-2 text-base font-semibold text-gray-900">
                                {formatDate(booking.checkOut)}
                            </p>
                        </div>

                    </div>

                    {booking.holdExpiresAt && booking.status === "held" && (
                        <div className="mt-5 flex items-start gap-3 rounded-xl bg-yellow-50 p-4 text-yellow-800">

                            <Clock3
                                size={19}
                                className="mt-0.5 shrink-0"
                            />

                            <div>
                                <p className="text-sm font-semibold">
                                    Booking Hold
                                </p>

                                <p className="mt-1 text-sm">
                                    This booking hold expires on{" "}
                                    {formatDateTime(booking.holdExpiresAt)}.
                                </p>
                            </div>

                        </div>
                    )}

                </section>

                {/* Rooms */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <BedDouble size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Rooms
                            </h2>

                            <p className="text-sm text-gray-500">
                                Rooms included in this booking
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 divide-y divide-gray-100">

                        {booking.items?.length ? (
                            booking.items.map((item, index) => (
                                <div
                                    key={`${item.roomId}-${index}`}
                                    className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {item.roomName || "Room"}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Capacity: {item.capacity || 0} guests
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Quantity: {item.quantity || 0}
                                        </p>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-sm text-gray-500">
                                            {formatAmount(item.pricePerRoom)} / room
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {formatAmount(item.subtotal)}
                                        </p>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p className="py-4 text-sm text-gray-500">
                                No room information available.
                            </p>
                        )}

                    </div>
                </section>

            </div>

            {/* Right */}
            <div className="space-y-6">

                {/* Payment */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <CreditCard size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Payment
                            </h2>

                            <p className="text-sm text-gray-500">
                                Payment information
                            </p>
                        </div>
                    </div>

                    {payment ? (
                        <div className="mt-5 space-y-4">

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Status
                                </span>

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getPaymentStatusClasses(
                                        payment.status
                                    )}`}
                                >
                                    {payment.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Amount
                                </span>

                                <span className="font-semibold text-gray-900">
                                    {formatAmount(payment.amount)}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Currency
                                </span>

                                <span className="text-sm font-medium uppercase text-gray-900">
                                    {payment.currency || "-"}
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-sm text-gray-500">
                                    Provider
                                </span>

                                <span className="text-sm font-medium capitalize text-gray-900">
                                    {payment.provider || "-"}
                                </span>
                            </div>

                            {payment.method && (
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-gray-500">
                                        Method
                                    </span>

                                    <span className="text-sm font-medium capitalize text-gray-900">
                                        {payment.method}
                                    </span>
                                </div>
                            )}

                            {payment.refundedAmount !== undefined &&
                                payment.refundedAmount !== null && (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-gray-500">
                                            Refunded
                                        </span>

                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatAmount(payment.refundedAmount)}
                                        </span>
                                    </div>
                                )}

                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-500">
                                    Payment created
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-900">
                                    {formatDateTime(payment.createdAt)}
                                </p>
                            </div>

                        </div>
                    ) : (
                        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                            No payment information available.
                        </div>
                    )}

                </section>

                {/* Price Summary */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <IndianRupee size={20} />
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Price Summary
                            </h2>

                            <p className="text-sm text-gray-500">
                                Booking amount breakdown
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Base Amount
                            </span>

                            <span className="text-sm font-medium text-gray-900">
                                {formatAmount(booking.baseAmount)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                Tax
                            </span>

                            <span className="text-sm font-medium text-gray-900">
                                {formatAmount(booking.taxAmount)}
                            </span>
                        </div>

                        <div className="border-t border-gray-100 pt-4">

                            <div className="flex items-center justify-between">
                                <span className="font-semibold text-gray-900">
                                    Total
                                </span>

                                <span className="text-xl font-bold text-gray-900">
                                    {formatAmount(booking.totalAmount)}
                                </span>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Booking Created */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div className="flex items-center gap-3">
                        <CheckCircle2
                            size={20}
                            className="text-green-600"
                        />

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Booking Created
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {formatDateTime(booking.createdAt)}
                            </p>
                        </div>
                    </div>

                    {booking.updatedAt && (
                        <p className="mt-4 text-xs text-gray-500">
                            Last updated: {formatDateTime(booking.updatedAt)}
                        </p>
                    )}

                </section>

            </div>

        </div>

    </div>
    </div>


    );
};

export default OwnerBookingDetails;
