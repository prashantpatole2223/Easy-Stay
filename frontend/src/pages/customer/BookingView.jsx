import {
    ArrowLeft,
    Info
} from "lucide-react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useBookingDetails
} from "../../hooks/useBookingDetails";

import BookingSummary from "../../components/bookings/BookingSummary";
import BookingHotel from "../../components/bookings/BookingHotel";
import BookingRooms from "../../components/bookings/BookingRooms";
import BookingPayment from "../../components/bookings/BookingPayment";
import BookingActions from "../../components/bookings/BookingActions";
import BookingReview from "../../components/bookings/BookingReview";

const backButtonClass =
    "mb-6 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#008cff] transition hover:text-[#0073d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]";

const primaryButtonClass =
    "rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98]";

const BookingView = () => {
    const { bookingId } =
        useParams();

    const navigate =
        useNavigate();

    const {
        booking,
        hotel,
        payment,
        review,
        setBooking,
        setPayment,
        setReview,
        loading,
        error,
        refetch
    } = useBookingDetails(
        bookingId
    );

    const handleCancelled = (
        response
    ) => {
        if (response.booking) {
            setBooking(
                response.booking
            );
        }

        if (
            Object.prototype.hasOwnProperty.call(
                response,
                "payment"
            )
        ) {
            setPayment(
                response.payment || null
            );
        } else {
            refetch();
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#f2f2f2] px-4 py-8">
                <div
                    className="mx-auto max-w-7xl"
                    aria-busy="true"
                    aria-label="Loading booking"
                >
                    <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200" />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                        <div className="space-y-6">
                            <div className="h-72 animate-pulse rounded-xl bg-gray-200" />

                            <div className="h-80 animate-pulse rounded-xl bg-gray-200" />

                            <div className="h-60 animate-pulse rounded-xl bg-gray-200" />
                        </div>

                        <div className="space-y-6">
                            <div className="h-56 animate-pulse rounded-xl bg-gray-200" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#f2f2f2] px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/bookings")
                        }
                        className={backButtonClass}
                    >
                        <ArrowLeft size={17} aria-hidden="true" />
                        Back to My Bookings
                    </button>

                    <div
                        role="alert"
                        className="mx-auto max-w-xl rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-sm"
                    >
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdecea] text-[#d0021b]">
                            <Info size={26} aria-hidden="true" />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-[#1a1a1a]">
                            Unable to load booking
                        </h1>

                        <p className="mt-3 text-sm text-[#4a4a4a]">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={refetch}
                            className={`mt-6 ${primaryButtonClass}`}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (!booking) {
        return (
            <main className="min-h-screen bg-[#f2f2f2] px-4 py-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mx-auto max-w-xl rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf3e0] text-[#f5a623]">
                            <Info size={26} aria-hidden="true" />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-[#1a1a1a]">
                            Booking not found
                        </h1>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/bookings")
                            }
                            className={`mt-6 ${primaryButtonClass}`}
                        >
                            Back to My Bookings
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f2f2f2] px-4 py-8 text-[#1a1a1a]">
            <div className="mx-auto max-w-7xl">
                <button
                    type="button"
                    onClick={() =>
                        navigate("/bookings")
                    }
                    className={backButtonClass}
                >
                    <ArrowLeft size={17} aria-hidden="true" />
                    Back to My Bookings
                </button>

                <h1 className="mb-6 text-2xl font-bold text-[#1a1a1a]">
                    Booking Details
                </h1>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="min-w-0 space-y-6">
                        <BookingHotel
                            hotel={hotel}
                        />

                        <BookingSummary
                            booking={booking}
                        />

                        <BookingRooms
                            items={booking.items}
                        />

                        <BookingReview
                            booking={booking}
                            review={review}
                            onReviewChange={
                                setReview
                            }
                        />
                    </div>

                    <div className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
                        <BookingPayment
                            payment={payment}
                        />

                        <BookingActions
                            booking={booking}
                            onCancelled={
                                handleCancelled
                            }
                        />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BookingView;