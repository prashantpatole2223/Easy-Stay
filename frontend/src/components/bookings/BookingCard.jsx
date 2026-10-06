import {
    ArrowRight,
    Building2,
    CalendarDays,
    MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ImageSlider from "../common/ImageSlider";
import StatusBadge from "./StatusBadge";

const BookingCard = ({ booking }) => {
    const navigate = useNavigate();

    const hotel = booking.hotel;

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "N/A";
        }

        return parsed.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const location = hotel?.location;

    const locationText = [
        location?.city,
        location?.state,
        location?.country
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <article className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
                <div className="w-full shrink-0 sm:w-56">
                    <ImageSlider
                        images={hotel?.image ? [hotel.image] : []}
                        alt={hotel?.name || "Hotel"}
                        fallbackIcon={Building2}
                        className="aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-48"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                                {hotel?.name || "Hotel unavailable"}
                            </h2>

                            {locationText && (
                                <div className="mt-1.5 flex items-start gap-1.5 text-sm text-[#4a4a4a]">
                                    <MapPin
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#008cff]"
                                        aria-hidden="true"
                                    />

                                    <span>{locationText}</span>
                                </div>
                            )}
                        </div>

                        <StatusBadge status={booking.status} />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <CalendarDays
                                size={18}
                                className="mt-0.5 shrink-0 text-[#008cff]"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-xs text-[#9b9b9b]">
                                    Check-in
                                </p>

                                <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                                    {formatDate(booking.checkIn)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <CalendarDays
                                size={18}
                                className="mt-0.5 shrink-0 text-[#008cff]"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-xs text-[#9b9b9b]">
                                    Check-out
                                </p>

                                <p className="mt-0.5 text-sm font-semibold text-[#1a1a1a]">
                                    {formatDate(booking.checkOut)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto border-t border-[#e7e7e7] pt-4">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(`/bookings/${booking._id}`)
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98]"
                        >
                            View Booking
                            <ArrowRight size={17} aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BookingCard;