import { BedDouble, Users } from "lucide-react";

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

const BookingRoomList = ({ selectedRooms, nights }) => {
  const list = Array.isArray(selectedRooms) ? selectedRooms : [];

  return (
    <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Selected Rooms
      </h2>

      {list.length === 0 ? (
        <p className="mt-4 text-sm text-[#9b9b9b]">
          No rooms selected.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {list.map(({ room, quantity }) => {
            const subtotal =
              room.price * quantity * nights;

            return (
              <div
                key={room._id}
                className="rounded-xl border border-[#e7e7e7] p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#1a1a1a]">
                      {room.name}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#4a4a4a]">
                      {room.bedType && (
                        <span className="flex items-center gap-1.5 capitalize">
                          <BedDouble
                            size={16}
                            className="text-[#008cff]"
                            aria-hidden="true"
                          />
                          {room.bedType}
                        </span>
                      )}

                      <span className="flex items-center gap-1.5">
                        <Users
                          size={16}
                          className="text-[#008cff]"
                          aria-hidden="true"
                        />
                        Up to {room.capacity} guests
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-[#4a4a4a]">
                      {formatPrice(room.price)} ×{" "}
                      {quantity}{" "}
                      {quantity === 1 ? "room" : "rooms"} ×{" "}
                      {nights}{" "}
                      {nights === 1 ? "night" : "nights"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-6 rounded-lg bg-[#f2f2f2] px-4 py-3 sm:block sm:bg-transparent sm:p-0 sm:text-right">
                    <div>
                      <p className="text-xs text-[#9b9b9b]">
                        Quantity
                      </p>

                      <p className="text-sm font-semibold text-[#1a1a1a]">
                        {quantity}
                      </p>
                    </div>

                    <div className="sm:mt-2">
                      <p className="text-xs text-[#9b9b9b] sm:hidden">
                        Subtotal
                      </p>

                      <p className="text-base font-bold text-[#1a1a1a]">
                        {formatPrice(subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingRoomList;