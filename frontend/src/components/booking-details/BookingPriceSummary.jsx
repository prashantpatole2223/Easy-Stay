import { Clock, LoaderCircle, ShieldCheck } from "lucide-react";

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

const bookButtonClass =
  "flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const BookingPriceSummary = ({
  selectedRooms,
  nights,
  onBook,
  loading
}) => {
  const roomsList = Array.isArray(selectedRooms)
    ? selectedRooms
    : [];

  const roomTotal = roomsList.reduce(
    (total, { room, quantity }) =>
      total +
      room.price *
        quantity *
        nights,
    0
  );

  const taxAmount = Number(
    ((roomTotal * TAX_PERCENTAGE) / 100).toFixed(2)
  );

  const totalAmount = Number(
    (roomTotal + taxAmount).toFixed(2)
  );

  const bookLabel = loading
    ? "Creating Booking..."
    : "Book";

  return (
    <>
      <aside
        aria-label="Price details"
        className="h-fit rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:self-start"
      >
        <h2 className="text-lg font-semibold text-[#1a1a1a]">
          Price Details
        </h2>

        <div className="mt-5 space-y-3 text-sm">
          {roomsList.map(
            ({ room, quantity }) => {
              const amount =
                room.price *
                quantity *
                nights;

              return (
                <div
                  key={room._id}
                  className="flex justify-between gap-4"
                >
                  <span className="text-[#4a4a4a]">
                    {room.name} × {quantity}
                  </span>

                  <span className="shrink-0 font-medium text-[#1a1a1a]">
                    {formatPrice(amount)}
                  </span>
                </div>
              );
            }
          )}
        </div>

        <div className="mt-5 space-y-3 border-t border-[#e7e7e7] pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#4a4a4a]">
              Room charges
            </span>

            <span className="font-medium text-[#1a1a1a]">
              {formatPrice(roomTotal)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#4a4a4a]">
              Tax ({TAX_PERCENTAGE}%)
            </span>

            <span className="font-medium text-[#1a1a1a]">
              {formatPrice(taxAmount)}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-[#e7e7e7] pt-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1a1a1a]">
              Total
            </span>

            <span className="text-2xl font-bold text-[#1a1a1a]">
              {formatPrice(totalAmount)}
            </span>
          </div>

          <p className="mt-1 text-right text-xs text-[#9b9b9b]">
            for {nights}{" "}
            {nights === 1 ? "night" : "nights"}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#fdf3e0] p-3">
          <Clock
            size={16}
            className="mt-0.5 shrink-0 text-[#f5a623]"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-[#4a4a4a]">
            Your room will be temporarily held after
            clicking Book. Payment will be handled in
            the next step.
          </p>
        </div>

        {/* Desktop button */}
        <button
          type="button"
          disabled={loading}
          onClick={onBook}
          className={`mt-5 hidden w-full lg:flex ${bookButtonClass}`}
        >
          {loading && (
            <LoaderCircle
              size={16}
              className="animate-spin"
              aria-hidden="true"
            />
          )}
          {bookLabel}
        </button>

        <div className="mt-4 hidden items-center justify-center gap-2 text-xs text-[#9b9b9b] lg:flex">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Secure booking</span>
        </div>
      </aside>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e7e7] bg-white p-3 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-lg font-bold leading-tight text-[#1a1a1a]">
              {formatPrice(totalAmount)}
            </p>

            <p className="truncate text-xs text-[#4a4a4a]">
              incl. {TAX_PERCENTAGE}% tax · {nights}{" "}
              {nights === 1 ? "night" : "nights"}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onBook}
            className={`shrink-0 px-6 ${bookButtonClass}`}
          >
            {loading && (
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
            )}
            {bookLabel}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingPriceSummary;