import {
  useParams,
  useNavigate,
  useSearchParams
} from "react-router-dom";

import {
  Building2,
  CalendarDays,
  Info,
  ShieldCheck,
  Users
} from "lucide-react";

import useHotelDetails from "../../hooks/useHotelDetails";

import HotelGallery from "../../components/hotel-details/HotelGallery";
import HotelHeader from "../../components/hotel-details/HotelHeader";
import HotelOverview from "../../components/hotel-details/HotelOverview";
import HotelAmenities from "../../components/hotel-details/HotelAmenities";
import HotelLocation from "../../components/hotel-details/HotelLocation";
import HotelReviews from "../../components/hotel-details/HotelReviews";

// Display-only formatter, e.g. "12 Oct 2026"
const formatDisplayDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const primaryButtonClass =
  "w-full rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const HotelDetails = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guestCount = searchParams.get("guestCount");

  console.log("checkIn etc : ", checkIn, checkOut);

  const {
    hotel,
    loading,
    error
  } = useHotelDetails(hotelId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2]">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div
            className="animate-pulse space-y-6"
            aria-busy="true"
            aria-label="Loading hotel"
          >
            <div className="h-64 rounded-xl bg-gray-200 sm:h-80 md:h-96" />

            <div className="h-24 rounded-xl bg-gray-200" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div className="h-40 rounded-xl bg-gray-200" />
                <div className="h-40 rounded-xl bg-gray-200" />
              </div>

              <div className="hidden h-56 rounded-xl bg-gray-200 lg:block" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f2f2f2] px-4">
        <div className="w-full max-w-md rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdecea] text-[#d0021b]">
            <Building2 size={26} aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#1a1a1a]">
            Hotel not found
          </h1>

          <p className="mt-2 text-sm text-[#4a4a4a]">
            {error || "This hotel is no longer available."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSelectRoom = () => {
    if (!checkIn || !checkOut) {
      return;
    }

    const params = new URLSearchParams({
      checkIn,
      checkOut
    });

    if (guestCount) {
      params.set("guestCount", guestCount);
    }

    navigate(
      `/hotels/${hotel._id}/rooms?${params.toString()}`
    );
  };

  const stayDates = [
    formatDisplayDate(checkIn),
    formatDisplayDate(checkOut)
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-28 text-[#1a1a1a] lg:pb-6">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <HotelGallery images={hotel.images} />

        <div className="mt-6">
          <HotelHeader hotel={hotel} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <main className="min-w-0 space-y-6">
            <HotelOverview hotel={hotel} />

            <HotelAmenities amenities={hotel.amenities} />

            <HotelLocation
              address={hotel.address}
              location={hotel.location}
            />

            <HotelReviews hotelId={hotel._id} />
          </main>

          {/* Desktop summary */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Ready to book?
              </h2>

              <p className="mt-2 text-sm text-[#4a4a4a]">
                Select a room to check availability and continue your booking.
              </p>

              {(stayDates || guestCount) && (
                <div className="mt-4 space-y-2 rounded-lg bg-[#f2f2f2] p-3 text-sm text-[#1a1a1a]">
                  {stayDates && (
                    <div className="flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="shrink-0 text-[#008cff]"
                        aria-hidden="true"
                      />
                      <span>{stayDates}</span>
                    </div>
                  )}

                  {guestCount && (
                    <div className="flex items-center gap-2">
                      <Users
                        size={16}
                        className="shrink-0 text-[#008cff]"
                        aria-hidden="true"
                      />
                      <span>
                        {guestCount}{" "}
                        {Number(guestCount) === 1
                          ? "guest"
                          : "guests"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {(!checkIn || !checkOut) && (
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#fdf3e0] p-3 text-xs text-[#4a4a4a]">
                  <Info
                    size={16}
                    className="mt-0.5 shrink-0 text-[#f5a623]"
                    aria-hidden="true"
                  />
                  <span>
                    Choose check-in and check-out dates from the hotel search to continue.
                  </span>
                </div>
              )}

              <button
                type="button"
                disabled={!checkIn || !checkOut}
                onClick={handleSelectRoom}
                className={`mt-5 ${primaryButtonClass}`}
              >
                {!checkIn || !checkOut
                  ? "Search Dates First"
                  : "Select Room"}
              </button>

              <div className="mt-4 flex items-center gap-2 text-xs text-[#9b9b9b]">
                <ShieldCheck
                  size={14}
                  aria-hidden="true"
                />
                <span>Secure booking</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e7e7] bg-white p-3 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1a1a1a]">
              {hotel.name}
            </p>

            <p className="truncate text-xs text-[#4a4a4a]">
              {stayDates
                ? `${stayDates}${
                    guestCount
                      ? ` · ${guestCount} ${
                          Number(guestCount) === 1
                            ? "guest"
                            : "guests"
                        }`
                      : ""
                  }`
                : "Select dates to continue"}
            </p>
          </div>

          <div className="w-40 shrink-0">
            <button
              type="button"
              disabled={!checkIn || !checkOut}
              onClick={handleSelectRoom}
              className={primaryButtonClass}
            >
              {!checkIn || !checkOut
                ? "Search Dates First"
                : "Select Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;