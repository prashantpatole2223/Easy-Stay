import { BedDouble, Users } from "lucide-react";

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

const BookingRooms = ({
  items = []
}) => {
  const list = Array.isArray(items) ? items : [];

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-lg font-semibold text-[#1a1a1a]">
        Rooms
      </h2>

      {list.length === 0 ? (
        <p className="text-sm text-[#9b9b9b]">
          No rooms found for this booking.
        </p>
      ) : (
        <div className="space-y-4">
          {list.map((item, index) => (
            <div
              key={`${item.roomId}-${index}`}
              className="rounded-xl border border-[#e7e7e7] p-4"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                    <BedDouble size={18} aria-hidden="true" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#1a1a1a]">
                      {item.roomName}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-xs text-[#4a4a4a]">
                      <Users size={14} aria-hidden="true" />
                      Capacity: {item.capacity}
                    </p>

                    <p className="mt-1 text-xs text-[#4a4a4a]">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-[#9b9b9b]">
                    Price per room
                  </p>

                  <p className="text-sm font-medium text-[#1a1a1a]">
                    {formatCurrency(
                      item.pricePerRoom
                    )}
                  </p>

                  <p className="mt-1 text-base font-bold text-[#1a1a1a]">
                    {formatCurrency(
                      item.subtotal
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BookingRooms;