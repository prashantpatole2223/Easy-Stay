import {
  BedDouble,
  CalendarDays,
  Info,
  ShieldCheck,
  Users
} from "lucide-react";

const TAX_PERCENTAGE = 15;

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

const BookingSummary = ({
  rooms,
  selections,
  guestCount,
  checkIn,
  checkOut,
  onContinue
}) => {
  const selectedRooms = rooms
    .filter((room) => (selections[room._id] || 0) > 0)
    .map((room) => ({
      room,
      quantity: selections[room._id]
    }));

  const totalRooms = selectedRooms.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalCapacity = selectedRooms.reduce(
    (total, item) =>
      total + item.quantity * item.room.capacity,
    0
  );

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(`${checkOut}T00:00:00`) -
        new Date(`${checkIn}T00:00:00`)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const baseAmount = selectedRooms.reduce(
    (total, item) =>
      total +
      item.room.price *
        item.quantity *
        nights,
    0
  );

  const taxAmount = Number(
    ((baseAmount * TAX_PERCENTAGE) / 100).toFixed(2)
  );

  const totalAmount = Number(
    (baseAmount + taxAmount).toFixed(2)
  );

  const hasRooms = selectedRooms.length > 0;
  const enoughCapacity =
    totalCapacity >= Number(guestCount);

  const canContinue =
    hasRooms && enoughCapacity;

  const handleContinueClick = () => {
    if (!canContinue) return;

    onContinue(selectedRooms);
  };

  const continueButtonClass =
    "rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

  return (
    <>
      {/* Desktop summary */}
      <aside
        aria-label="Booking summary"
        className="hidden lg:block"
      >
        <div className="sticky top-5 rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">
            Booking Summary
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#4a4a4a]">
                <Users
                  size={16}
                  className="text-[#008cff]"
                  aria-hidden="true"
                />
                Guests
              </span>

              <span className="font-semibold text-[#1a1a1a]">
                {guestCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#4a4a4a]">
                <BedDouble
                  size={16}
                  className="text-[#008cff]"
                  aria-hidden="true"
                />
                Rooms selected
              </span>

              <span className="font-semibold text-[#1a1a1a]">
                {totalRooms}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#4a4a4a]">
                <Users
                  size={16}
                  className="text-[#008cff]"
                  aria-hidden="true"
                />
                Total capacity
              </span>

              <span className="font-semibold text-[#1a1a1a]">
                {totalCapacity}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#4a4a4a]">
                <CalendarDays
                  size={16}
                  className="text-[#008cff]"
                  aria-hidden="true"
                />
                Nights
              </span>

              <span className="font-semibold text-[#1a1a1a]">
                {nights}
              </span>
            </div>
          </div>

          {hasRooms && (
            <ul className="mt-4 space-y-2 rounded-lg bg-[#f2f2f2] p-3 text-xs text-[#4a4a4a]">
              {selectedRooms.map((item) => (
                <li
                  key={item.room._id}
                  className="flex items-start justify-between gap-3"
                >
                  <span className="min-w-0">
                    {item.room.name} × {item.quantity}
                  </span>

                  <span className="shrink-0 font-semibold text-[#1a1a1a]">
                    {formatPrice(
                      item.room.price *
                        item.quantity *
                        nights
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {!hasRooms && (
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-[#f2f2f2] p-3 text-xs text-[#4a4a4a]">
              <Info
                size={14}
                className="mt-0.5 shrink-0 text-[#008cff]"
                aria-hidden="true"
              />
              Select at least one room to continue.
            </p>
          )}

          {hasRooms && !enoughCapacity && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg bg-[#fdecea] p-3 text-xs text-[#d0021b]"
            >
              <Info
                size={14}
                className="mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>
                Selected rooms can accommodate only{" "}
                {totalCapacity}{" "}
                {totalCapacity === 1
                  ? "guest"
                  : "guests"}
                . Please select more rooms.
              </span>
            </p>
          )}

          <div className="mt-5 border-t border-[#e7e7e7] pt-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#4a4a4a]">
                  Room charges
                </span>

                <span className="font-medium text-[#1a1a1a]">
                  {formatPrice(baseAmount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#4a4a4a]">
                  Tax ({TAX_PERCENTAGE}%)
                </span>

                <span className="font-medium text-[#1a1a1a]">
                  {formatPrice(taxAmount)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-[#e7e7e7] pt-4">
              <span className="text-sm text-[#4a4a4a]">
                Estimated total
              </span>

              <span className="text-2xl font-bold text-[#1a1a1a]">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <p className="mt-1 text-right text-xs text-[#9b9b9b]">
              {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </p>
          </div>

          <button
            type="button"
            disabled={!canContinue}
            onClick={handleContinueClick}
            className={`mt-5 w-full ${continueButtonClass}`}
          >
            Continue
          </button>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#9b9b9b]">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Secure booking</span>
          </div>
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e7e7] bg-white p-3 shadow-lg lg:hidden">
        <div className="mx-auto max-w-7xl">
          {hasRooms && !enoughCapacity && (
            <p
              role="alert"
              className="mb-2 rounded-md bg-[#fdecea] px-3 py-1.5 text-xs text-[#d0021b]"
            >
              Rooms fit only {totalCapacity}{" "}
              {totalCapacity === 1 ? "guest" : "guests"}.
              Select more rooms.
            </p>
          )}

          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              {hasRooms ? (
                <>
                  <p className="text-lg font-bold leading-tight text-[#1a1a1a]">
                    {formatPrice(totalAmount)}
                  </p>

                  <p className="truncate text-xs text-[#4a4a4a]">
                    {totalRooms}{" "}
                    {totalRooms === 1 ? "room" : "rooms"} ·{" "}
                    {nights}{" "}
                    {nights === 1 ? "night" : "nights"} · incl.
                    tax
                  </p>
                </>
              ) : (
                <p className="text-sm text-[#4a4a4a]">
                  Select at least one room to continue.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!canContinue}
              onClick={handleContinueClick}
              className={`shrink-0 px-6 ${continueButtonClass}`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingSummary;