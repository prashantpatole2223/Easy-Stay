import {
  ArrowRight,
  Check,
  MapPin,
  Star
} from "lucide-react";

import { useNavigate } from "react-router-dom";

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

const HotelCard = ({ hotel, searchData }) => {
  const navigate = useNavigate();

  const location = [
    hotel.location?.city,
    hotel.location?.state
  ]
    .filter(Boolean)
    .join(", ");

  const handleViewHotel = () => {
    if (!searchData) {
      navigate(`/hotels/${hotel._id}`);
      return;
    }

    const params = new URLSearchParams({
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      guestCount: String(searchData.guestCount)
    });

    navigate(
      `/hotels/${hotel._id}?${params.toString()}`
    );
  };

  return (
    <article className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* Image slider */}
        <div className="w-full md:w-72 md:shrink-0 lg:w-80">
          <ImageSlider
            images={hotel.images}
            alt={hotel.name || "Hotel"}
            className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-52"
          />
        </div>

        {/* Details */}
        <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
              {hotel.name}
            </h2>

            {location && (
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-[#4a4a4a]">
                <MapPin
                  size={16}
                  className="shrink-0 text-[#008cff]"
                  aria-hidden="true"
                />
                <span>{location}</span>
              </div>
            )}

            {hotel.reviewCount > 0 ? (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-md bg-[#1a7971] px-2 py-1 text-xs font-semibold text-white">
                  <Star
                    size={13}
                    fill="currentColor"
                    aria-hidden="true"
                  />

                  <span>
                    {Number(hotel.averageRating ?? 0).toFixed(1)}
                  </span>
                </div>

                <span className="text-sm text-[#4a4a4a]">
                  {hotel.reviewCount}{" "}
                  {hotel.reviewCount === 1
                    ? "review"
                    : "reviews"}
                </span>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[#9b9b9b]">
                No reviews yet
              </p>
            )}
          </div>

          {hotel.description && (
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#4a4a4a]">
              {hotel.description}
            </p>
          )}

          {hotel.highlights?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hotel.highlights
                .slice(0, 3)
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
        </div>

        {/* Price and CTA */}
        <div className="flex items-end justify-between gap-4 border-t border-[#e7e7e7] p-4 md:w-52 md:shrink-0 md:flex-col md:items-end md:justify-end md:border-l md:border-t-0 md:p-5">
          <div className="md:text-right">
            <p className="text-xs text-[#9b9b9b]">
              Starting from
            </p>

            <p className="text-2xl font-bold text-[#1a1a1a]">
              {formatPrice(hotel.lowestPrice)}
            </p>

            <p className="text-xs text-[#9b9b9b]">
              per room / night
            </p>
          </div>

          <button
            type="button"
            onClick={handleViewHotel}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] md:w-full"
          >
            View Hotel
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;