import { useState } from "react";
import { Loader2, XCircle } from "lucide-react";

import {
  cancelBooking
} from "../../services/bookingService";

const BookingActions = ({
  booking,
  onCancelled
}) => {
  const [cancelling, setCancelling] =
    useState(false);

  if (!booking) {
    return null;
  }

  const checkIn = new Date(
    booking.checkIn
  );

  const now = new Date();

  const canCancel =
    booking.status === "confirmed" &&
    checkIn > now;

  if (!canCancel) {
    return null;
  }

  const handleCancel = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);

      const response =
        await cancelBooking(
          booking._id
        );

      onCancelled(response);
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to cancel booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Manage Booking
      </h2>

      <button
        type="button"
        onClick={handleCancel}
        disabled={cancelling}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#d0021b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#b00217] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0021b] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
      >
        {cancelling ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
              aria-hidden="true"
            />
            Cancelling...
          </>
        ) : (
          <>
            <XCircle size={16} aria-hidden="true" />
            Cancel Booking
          </>
        )}
      </button>
    </section>
  );
};

export default BookingActions;