import {
    CalendarDays,
    Hash,
    Mail,
    Phone,
    User,
    Users
} from "lucide-react";

import StatusBadge from "./StatusBadge";

const formatDate = (date) => {
    if (!date) {
        return "Not available";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Not available";
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount || 0);
};

const IconBubble = ({ children }) => (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
        {children}
    </div>
);

const BookingSummary = ({ booking }) => {
    return (
        <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                    Booking Details
                </h2>

                <StatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                    <IconBubble>
                        <CalendarDays size={18} aria-hidden="true" />
                    </IconBubble>

                    <div>
                        <p className="text-xs text-[#9b9b9b]">
                            Check-in
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                            {formatDate(booking.checkIn)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <IconBubble>
                        <CalendarDays size={18} aria-hidden="true" />
                    </IconBubble>

                    <div>
                        <p className="text-xs text-[#9b9b9b]">
                            Check-out
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                            {formatDate(booking.checkOut)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <IconBubble>
                        <Users size={18} aria-hidden="true" />
                    </IconBubble>

                    <div>
                        <p className="text-xs text-[#9b9b9b]">
                            Guests
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                            {booking.guestCount}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <IconBubble>
                        <Hash size={18} aria-hidden="true" />
                    </IconBubble>

                    <div className="min-w-0">
                        <p className="text-xs text-[#9b9b9b]">
                            Booking ID
                        </p>

                        <p className="mt-0.5 break-all text-sm font-semibold text-[#1a1a1a]">
                            {booking._id}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t border-[#e7e7e7] pt-5">
                <h3 className="mb-4 text-sm font-semibold text-[#1a1a1a]">
                    Guest Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center gap-3">
                        <IconBubble>
                            <User size={18} aria-hidden="true" />
                        </IconBubble>

                        <div className="min-w-0">
                            <p className="text-xs text-[#9b9b9b]">
                                Name
                            </p>

                            <p className="mt-0.5 truncate text-sm font-semibold text-[#1a1a1a]">
                                {booking.guestInfo?.name || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <IconBubble>
                            <Mail size={18} aria-hidden="true" />
                        </IconBubble>

                        <div className="min-w-0">
                            <p className="text-xs text-[#9b9b9b]">
                                Email
                            </p>

                            <p className="mt-0.5 break-all text-sm font-semibold text-[#1a1a1a]">
                                {booking.guestInfo?.email || "-"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <IconBubble>
                            <Phone size={18} aria-hidden="true" />
                        </IconBubble>

                        <div className="min-w-0">
                            <p className="text-xs text-[#9b9b9b]">
                                Phone
                            </p>

                            <p className="mt-0.5 truncate text-sm font-semibold text-[#1a1a1a]">
                                {booking.guestInfo?.phone || "-"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 border-t border-[#e7e7e7] pt-5">
                <h3 className="mb-4 text-sm font-semibold text-[#1a1a1a]">
                    Price
                </h3>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#4a4a4a]">
                            Base amount
                        </span>

                        <span className="font-medium text-[#1a1a1a]">
                            {formatCurrency(
                                booking.baseAmount
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-[#4a4a4a]">
                            Tax
                        </span>

                        <span className="font-medium text-[#1a1a1a]">
                            {formatCurrency(
                                booking.taxAmount
                            )}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#e7e7e7] pt-3">
                        <span className="font-semibold text-[#1a1a1a]">
                            Total
                        </span>

                        <span className="text-xl font-bold text-[#1a1a1a]">
                            {formatCurrency(
                                booking.totalAmount
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BookingSummary;