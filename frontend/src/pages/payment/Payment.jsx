import { useState } from "react";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    Info,
    MapPin,
    Users
} from "lucide-react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import PaymentGuestInfo from "../../components/payment/PaymentGuestInfo";
import PaymentRoomList from "../../components/payment/PaymentRoomList";
import PaymentPriceSummary from "../../components/payment/PaymentPriceSummary";

import { createDummyPayment } from "../../services/paymentService";

// Display-only formatter, e.g. "12 Oct 2026"
const formatDisplayDate = (value) => {
    if (!value) {
        return "Not available";
    }

    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(value))
        ? new Date(`${value}T00:00:00`)
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
};

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const [paymentLoading, setPaymentLoading] = useState(false);
    const [error, setError] = useState("");

    const booking = location.state?.booking;
    const pricing = location.state?.pricing;
    const hotel = location.state?.hotel;

    if (!booking) {
        return (
            <div className="min-h-screen bg-[#f2f2f2]">
                <div className="mx-auto max-w-7xl px-4 py-10">
                    <div className="mx-auto max-w-xl rounded-xl border border-[#e7e7e7] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf3e0] text-[#f5a623]">
                            <Info size={26} aria-hidden="true" />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
                            Booking information is missing
                        </h2>

                        <p className="mt-2 text-sm text-[#4a4a4a]">
                            Please create your booking again.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-6 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2"
                        >
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const nights = Math.max(
        1,
        Math.ceil(
            (new Date(booking.checkOut) -
                new Date(booking.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
    );

    const handlePayment = async () => {
        try {
            setPaymentLoading(true);
            setError("");

            const data = await createDummyPayment(
                bookingId || booking._id
            );

            console.log("Payment successful:", data);

            navigate(`/payment/success/${booking._id}`, {
                state: {
                    booking,
                    pricing,
                    hotel,
                    payment: data.payment
                },
                replace: true
            });
        } catch (error) {
            console.error("Payment failed:", error);

            setError(
                error.response?.data?.message ||
                "Payment failed. Please try again."
            );
        } finally {
            setPaymentLoading(false);
        }
    };

    const hotelLocation = [
        hotel?.location?.city,
        hotel?.location?.state,
        hotel?.location?.country
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <div className="min-h-screen bg-[#f2f2f2] pb-28 text-[#1a1a1a] lg:pb-8">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#008cff] transition hover:text-[#0073d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                >
                    <ArrowLeft size={17} aria-hidden="true" />
                    Back to booking
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-[#1a1a1a]">
                        Payment
                    </h1>

                    <p className="mt-1 text-sm text-[#4a4a4a]">
                        Review your booking details and complete your payment.
                    </p>
                </div>

                {error && (
                    <div
                        role="alert"
                        className="sticky top-2 z-30 mt-5 flex items-start gap-3 rounded-lg border border-[#d0021b]/30 bg-[#fdecea] p-4 shadow-sm"
                    >
                        <Info
                            size={18}
                            className="mt-0.5 shrink-0 text-[#d0021b]"
                            aria-hidden="true"
                        />

                        <p className="text-sm text-[#d0021b]">
                            {error}
                        </p>
                    </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="min-w-0 space-y-6">
                        {hotel && (
                            <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                                        <MapPin
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                            {hotel.name}
                                        </h2>

                                        {hotel.address && (
                                            <p className="mt-1 text-sm text-[#4a4a4a]">
                                                {hotel.address}
                                            </p>
                                        )}

                                        {hotelLocation && (
                                            <p className="mt-1 text-sm text-[#9b9b9b]">
                                                {hotelLocation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                Stay Summary
                            </h2>

                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                                        <CalendarDays
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Check-in
                                        </p>

                                        <p className="text-sm font-semibold text-[#1a1a1a]">
                                            {formatDisplayDate(
                                                booking.checkIn
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                                        <CalendarDays
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Check-out
                                        </p>

                                        <p className="text-sm font-semibold text-[#1a1a1a]">
                                            {formatDisplayDate(
                                                booking.checkOut
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                                        <Users
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Guests
                                        </p>

                                        <p className="text-sm font-semibold text-[#1a1a1a]">
                                            {booking.guestCount}{" "}
                                            {Number(booking.guestCount) === 1
                                                ? "Guest"
                                                : "Guests"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 border-t border-[#e7e7e7] pt-4 text-sm text-[#4a4a4a]">
                                <Clock
                                    size={16}
                                    className="text-[#008cff]"
                                    aria-hidden="true"
                                />

                                <span>
                                    {nights}{" "}
                                    {nights === 1
                                        ? "Night"
                                        : "Nights"}
                                </span>
                            </div>
                        </div>

                        <PaymentGuestInfo
                            guestInfo={booking.guestInfo}
                        />

                        <PaymentRoomList booking={booking} />
                    </div>

                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <PaymentPriceSummary
                            booking={booking}
                            pricing={pricing}
                            onPay={handlePayment}
                            loading={paymentLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;