import { BedDouble } from "lucide-react";

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

const PaymentRoomList = ({ booking }) => {
  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(booking.checkOut) - new Date(booking.checkIn)) /
        (1000 * 60 * 60 * 24)
    )
  );

  const items = Array.isArray(booking.items) ? booking.items : [];

  return (
    <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Selected Rooms
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-[#9b9b9b]">
          No rooms found for this booking.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div
              key={item.roomId}
              className="flex items-start justify-between gap-4 border-b border-[#e7e7e7] pb-4 last:border-b-0 last:pb-0"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                  <BedDouble size={18} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a]">
                    {item.roomName}
                  </p>

                  <p className="mt-1 text-xs text-[#4a4a4a]">
                    {formatPrice(item.pricePerRoom)} ×{" "}
                    {item.quantity} room
                    {item.quantity > 1 ? "s" : ""} × {nights} night
                    {nights > 1 ? "s" : ""}
                  </p>

                  <p className="mt-1 text-xs text-[#9b9b9b]">
                    Capacity: {item.capacity} guest
                    {item.capacity > 1 ? "s" : ""} per room
                  </p>
                </div>
              </div>

              <p className="shrink-0 text-sm font-bold text-[#1a1a1a]">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentRoomList;