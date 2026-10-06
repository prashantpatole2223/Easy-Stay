import {
    CalendarDays,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    CreditCard,
    Home,
    Info,
    Mail,
    MapPin,
    Phone,
    User,
    Users
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const priceFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

const formatPrice = (value) => {
    if (value === null || value === undefined || value === "") {
        return "Not available";
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? priceFormatter.format(number)
        : "Not available";
};

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

const IconBubble = ({ children }) => (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
        {children}
    </div>
);

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookingId } = useParams();

    const booking = location.state?.booking;
    const pricing = location.state?.pricing;
    const hotel = location.state?.hotel;
    const payment = location.state?.payment;

    if (!booking) {
        return (
            <div className="min-h-screen bg-[#f2f2f2]">
                <div className="mx-auto max-w-3xl px-4 py-12">
                    <div className="rounded-xl border border-[#e7e7e7] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf3e0] text-[#f5a623]">
                            <Info size={26} aria-hidden="true" />
                        </div>

                        <h1 className="mt-4 text-2xl font-bold text-[#1a1a1a]">
                            Booking information is unavailable
                        </h1>

                        <p className="mt-2 text-sm text-[#4a4a4a]">
                            Your payment may have been processed, but the booking
                            information is no longer available on this page.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2"
                        >
                            <Home size={17} aria-hidden="true" />
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const baseAmount =
        pricing?.baseAmount ?? booking.baseAmount ?? 0;

    const taxPercentage =
        pricing?.taxPercentage ?? 15;

    const taxAmount =
        pricing?.taxAmount ?? booking.taxAmount ?? 0;

    const totalAmount =
        pricing?.totalAmount ?? booking.totalAmount ?? 0;

    const nights = Math.max(
        1,
        Math.ceil(
            (new Date(booking.checkOut) -
                new Date(booking.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
    );

    const paymentId =
        payment?.providerPaymentId ||
        payment?._id ||
        "Not available";

    const paymentMethod =
        payment?.method || "dummy";

    const paymentProvider =
        payment?.provider || "dummy";

    const copyBookingId = async () => {
        try {
            await navigator.clipboard.writeText(
                bookingId || booking._id
            );
        } catch (error) {
            console.error("Failed to copy booking ID:", error);
        }
    };

    const hotelLocation = hotel?.location
        ? [
            hotel.location.city,
            hotel.location.state,
            hotel.location.country
        ]
            .filter(Boolean)
            .join(", ")
        : "";

    return (
        <div className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
                {/* Success header */}
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6f4f1]">
                        <CheckCircle2
                            size={38}
                            className="text-[#1a7971]"
                            aria-hidden="true"
                        />
                    </div>

                    <h1 className="mt-5 text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
                        Booking Confirmed
                    </h1>

                    <p className="mx-auto mt-2 max-w-xl text-sm text-[#4a4a4a]">
                        Your payment was successful and your hotel booking
                        has been confirmed.
                    </p>
                </div>

                {/* Booking ID */}
                <div className="mx-auto mt-6 max-w-xl rounded-xl border border-[#e7e7e7] bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs text-[#9b9b9b]">
                                Booking ID
                            </p>

                            <p className="mt-1 break-all text-sm font-semibold text-[#1a1a1a]">
                                {bookingId || booking._id}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={copyBookingId}
                            className="flex shrink-0 items-center gap-2 rounded-lg border border-[#008cff] bg-white px-3 py-2 text-xs font-semibold text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                        >
                            <Copy size={15} aria-hidden="true" />
                            Copy
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="min-w-0 space-y-6">
                        {hotel && (
                            <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <IconBubble>
                                        <MapPin
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </IconBubble>

                                    <div className="min-w-0">
                                        <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                            {hotel.name}
                                        </h2>

                                        {hotel.address && (
                                            <p className="mt-1 text-sm text-[#4a4a4a]">
                                                {hotel.address}
                                            </p>
                                        )}

                                        {hotel.location && hotelLocation && (
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
                                Stay Details
                            </h2>

                            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                                <div className="flex items-center gap-3">
                                    <IconBubble>
                                        <CalendarDays
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </IconBubble>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Check-in
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                                            {formatDisplayDate(
                                                booking.checkIn
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <IconBubble>
                                        <CalendarDays
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </IconBubble>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Check-out
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                                            {formatDisplayDate(
                                                booking.checkOut
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <IconBubble>
                                        <Users
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </IconBubble>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Guests
                                        </p>

                                        <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                                            {booking.guestCount}{" "}
                                            {Number(booking.guestCount) === 1
                                                ? "Guest"
                                                : "Guests"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-2 border-t border-[#e7e7e7] pt-4 text-sm text-[#4a4a4a]">
                                <Clock
                                    size={16}
                                    className="text-[#008cff]"
                                    aria-hidden="true"
                                />

                                <span>
                                    {nights}{" "}
                                    {nights === 1 ? "Night" : "Nights"}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                Guest Details
                            </h2>

                            {booking.guestInfo ? (
                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="flex items-center gap-3">
                                        <IconBubble>
                                            <User
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </IconBubble>

                                        <div className="min-w-0">
                                            <p className="text-xs text-[#9b9b9b]">
                                                Name
                                            </p>

                                            <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                                                {booking.guestInfo.name || "Not available"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <IconBubble>
                                            <Mail
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </IconBubble>

                                        <div className="min-w-0">
                                            <p className="text-xs text-[#9b9b9b]">
                                                Email
                                            </p>

                                            <p className="break-all text-sm font-semibold text-[#1a1a1a]">
                                                {booking.guestInfo.email || "Not available"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <IconBubble>
                                            <Phone
                                                size={18}
                                                aria-hidden="true"
                                            />
                                        </IconBubble>

                                        <div className="min-w-0">
                                            <p className="text-xs text-[#9b9b9b]">
                                                Mobile
                                            </p>

                                            <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                                                {booking.guestInfo.phone || "Not available"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-3 text-sm text-[#9b9b9b]">
                                    Guest information is unavailable.
                                </p>
                            )}
                        </div>

                        <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                Booked Rooms
                            </h2>

                            <div className="mt-4 space-y-4">
                                {booking.items?.map((item) => (
                                    <div
                                        key={item.roomId}
                                        className="flex items-start justify-between gap-4 border-b border-[#e7e7e7] pb-4 last:border-b-0 last:pb-0"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-[#1a1a1a]">
                                                {item.roomName}
                                            </p>

                                            <p className="mt-1 text-xs text-[#4a4a4a]">
                                                {formatPrice(
                                                    item.pricePerRoom
                                                )}{" "}
                                                × {item.quantity}{" "}
                                                {item.quantity > 1 ? "rooms" : "room"}{" "}
                                                × {nights}{" "}
                                                {nights > 1 ? "nights" : "night"}
                                            </p>

                                            <p className="mt-1 text-xs text-[#9b9b9b]">
                                                Capacity: {item.capacity} guest
                                                {item.capacity > 1 ? "s" : ""}{" "}
                                                per room
                                            </p>
                                        </div>

                                        <p className="shrink-0 text-sm font-bold text-[#1a1a1a]">
                                            {formatPrice(item.subtotal)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                Payment Information
                            </h2>

                            <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-3">
                                    <IconBubble>
                                        <CreditCard
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    </IconBubble>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Payment Status
                                        </p>

                                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#e6f4f1] px-2.5 py-0.5 text-xs font-semibold text-[#1a7971]">
                                            <Check
                                                size={12}
                                                aria-hidden="true"
                                            />
                                            Successful
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs text-[#9b9b9b]">
                                        Payment ID
                                    </p>

                                    <p className="mt-1 break-all text-sm font-semibold text-[#1a1a1a]">
                                        {paymentId}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Payment Method
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize text-[#1a1a1a]">
                                            {paymentMethod}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-[#9b9b9b]">
                                            Provider
                                        </p>

                                        <p className="mt-1 text-sm font-semibold capitalize text-[#1a1a1a]">
                                            {paymentProvider}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                Payment Summary
                            </h2>

                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#4a4a4a]">
                                        Room charges
                                    </span>

                                    <span className="font-medium text-[#1a1a1a]">
                                        {formatPrice(baseAmount)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-[#4a4a4a]">
                                        Tax ({taxPercentage}%)
                                    </span>

                                    <span className="font-medium text-[#1a1a1a]">
                                        {formatPrice(taxAmount)}
                                    </span>
                                </div>

                                <div className="border-t border-[#e7e7e7] pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-[#1a1a1a]">
                                            Total Paid
                                        </span>

                                        <span className="text-2xl font-bold text-[#1a1a1a]">
                                            {formatPrice(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-[#e6f4f1] p-3">
                                <CheckCircle2
                                    size={16}
                                    className="text-[#1a7971]"
                                    aria-hidden="true"
                                />

                                <p className="text-center text-xs font-semibold text-[#1a7971]">
                                    Payment completed successfully
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-3">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98]"
                            >
                                <Home size={17} aria-hidden="true" />
                                Back to Home
                            </button>

                            <p className="text-center text-xs text-[#9b9b9b]">
                                Your booking has been confirmed successfully.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;