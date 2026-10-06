import {
  BedDouble,
  Check,
  Info,
  Minus,
  Plus,
  Users
} from "lucide-react";

import ImageSlider from "../common/ImageSlider";

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

const RoomCard = ({
  room,
  quantity,
  onQuantityChange,
  onRoomDetails
}) => {
  const increaseQuantity = () => {
    if (quantity >= room.availableRooms) {
      return;
    }

    onQuantityChange(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 0) {
      return;
    }

    onQuantityChange(quantity - 1);
  };

  const isSelected = quantity > 0;
  const lowStock =
    Number(room.availableRooms) > 0 &&
    Number(room.availableRooms) <= 3;

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
        isSelected
          ? "border-[#008cff] ring-1 ring-[#008cff]"
          : "border-[#e7e7e7]"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Image slider */}
        <div className="w-full md:w-72 md:shrink-0">
          <ImageSlider
            images={room.images}
            alt={room.name || "Room"}
            fallbackIcon={BedDouble}
            className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-52"
          />
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              {room.name}
            </h2>

            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#4a4a4a]">
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

              {room.capacity !== undefined &&
                room.capacity !== null && (
                  <span className="flex items-center gap-1.5">
                    <Users
                      size={16}
                      className="text-[#008cff]"
                      aria-hidden="true"
                    />
                    Up to {room.capacity} guests
                  </span>
                )}
            </div>

            {room.description && (
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#4a4a4a]">
                {room.description}
              </p>
            )}
          </div>

          {room.highlights?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {room.highlights
                .slice(0, 4)
                .map((highlight, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-[#e6f4f1] px-2.5 py-1 text-xs font-medium text-[#1a7971]"
                  >
                    <Check size={12} aria-hidden="true" />
                    {highlight}
                  </span>
                ))}
            </div>
          )}

          <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-2xl font-bold text-[#1a1a1a]">
                {formatPrice(room.price)}
              </p>

              <p className="text-xs text-[#9b9b9b]">
                per room / night
              </p>

              <p
                className={`mt-1 text-xs font-medium ${
                  lowStock
                    ? "text-[#ff6e40]"
                    : "text-[#4a4a4a]"
                }`}
              >
                {room.availableRooms}{" "}
                {room.availableRooms === 1
                  ? "room"
                  : "rooms"}{" "}
                available
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRoomDetails}
                className="flex items-center gap-1.5 rounded-lg border border-[#008cff] bg-white px-3 py-2.5 text-sm font-semibold text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
              >
                <Info size={16} aria-hidden="true" />
                Room Details
              </button>

              <div
                className="flex items-center overflow-hidden rounded-lg border border-[#e7e7e7] bg-white"
                role="group"
                aria-label={`Quantity for ${room.name || "room"}`}
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity === 0}
                  aria-label="Decrease room quantity"
                  className="p-2.5 text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#008cff] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  <Minus size={17} />
                </button>

                <span
                  className="min-w-10 text-center text-sm font-semibold text-[#1a1a1a]"
                  aria-live="polite"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= room.availableRooms
                  }
                  aria-label="Increase room quantity"
                  className="p-2.5 text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#008cff] disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                  <Plus size={17} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;