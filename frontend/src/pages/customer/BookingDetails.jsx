import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Info,
  Moon,
  Users
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import BookingGuestInfo from "../../components/booking-details/BookingGuestInfo";
import BookingRoomList from "../../components/booking-details/BookingRoomList";
import BookingPriceSummary from "../../components/booking-details/BookingPriceSummary";

import { createBooking } from "../../services/bookingService";
import { getProfile } from "../../services/userService";

// Display-only formatter, e.g. "12 Oct 2026"
const formatDisplayDate = (value) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookingLoading, setBookingLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(true);
  const [error, setError] = useState("");
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const bookingData = location.state;

  useEffect(() => {
    const fetchGuestInfo = async () => {
      try {
        setGuestLoading(true);
        setError("");

        const data = await getProfile();

        const user = data.user || data;

        setGuestInfo({
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || ""
        });
      } catch (error) {
        console.error(
          "Failed to load guest information:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load your account information. Please try again."
        );
      } finally {
        setGuestLoading(false);
      }
    };

    fetchGuestInfo();
  }, []);

  if (!bookingData) {
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
              Please select your rooms again.
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

  const {
    hotelId,
    checkIn,
    checkOut,
    guestCount,
    selectedRooms
  } = bookingData;

  const nights = Math.max(
    1,
    Math.ceil(
      (
        new Date(`${checkOut}T00:00:00`) -
        new Date(`${checkIn}T00:00:00`)
      ) /
      (1000 * 60 * 60 * 24)
    )
  );

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const handleBook = async () => {
    try {
      setBookingLoading(true);
      setError("");

      if (!guestInfo.name.trim()) {
        setError("Guest name is required.");
        return;
      }

      if (!guestInfo.email.trim()) {
        setError("Guest email is required.");
        return;
      }

      if (!guestInfo.phone.trim()) {
        setError("Guest phone is required.");
        return;
      }

      const items = selectedRooms.map(
        ({ room, quantity }) => ({
          roomId: room._id,
          quantity
        })
      );

      const data = await createBooking({
        checkIn,
        checkOut,
        guestCount,
        guestInfo: {
          name: guestInfo.name.trim(),
          email: guestInfo.email.trim(),
          phone: guestInfo.phone.trim()
        },
        items
      });

      console.log("Booking created:", data);

      navigate(`/payment/${data.booking._id}`, {
        state: {
          booking: data.booking,
          pricing: data.pricing,
          hotel: data.hotel
        }
      });
    } catch (error) {
      console.error(
        "Failed to create booking:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Failed to create booking. Please try again."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-28 text-[#1a1a1a] lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 rounded-lg text-sm font-semibold text-[#008cff] transition hover:text-[#0073d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          Back to rooms
        </button>

        <h1 className="text-2xl font-bold text-[#1a1a1a]">
          Booking Details
        </h1>

        <p className="mt-1 text-sm text-[#4a4a4a]">
          Review your stay and guest information before booking.
        </p>

        {/* Stay summary */}
        <div className="mt-6 rounded-xl border border-[#e7e7e7] bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                <CalendarDays size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#9b9b9b]">
                  Check-in
                </p>

                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {formatDisplayDate(checkIn)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                <CalendarDays size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#9b9b9b]">
                  Check-out
                </p>

                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {formatDisplayDate(checkOut)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                <Users size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#9b9b9b]">
                  Guests
                </p>

                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {guestCount}{" "}
                  {Number(guestCount) === 1
                    ? "Guest"
                    : "Guests"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                <Moon size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#9b9b9b]">
                  Duration
                </p>

                <p className="text-sm font-semibold text-[#1a1a1a]">
                  {nights}{" "}
                  {nights === 1
                    ? "Night"
                    : "Nights"}
                </p>
              </div>
            </div>
          </div>
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

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 space-y-6">
            <BookingGuestInfo
              guestInfo={guestInfo}
              onChange={handleGuestInfoChange}
              loading={guestLoading || bookingLoading}
            />

            <BookingRoomList
              selectedRooms={selectedRooms}
              nights={nights}
            />
          </div>

          <BookingPriceSummary
            selectedRooms={selectedRooms}
            nights={nights}
            onBook={handleBook}
            loading={
              bookingLoading ||
              guestLoading
            }
          />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;