import { Building2, Check, MapPin, Phone } from "lucide-react";

import ImageSlider from "../common/ImageSlider";

const BookingHotel = ({ hotel }) => {
  if (!hotel) {
    return null;
  }

  const location = hotel.location;

  const locationText = [
    location?.city,
    location?.state,
    location?.country
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm">
      <ImageSlider
        images={hotel.image ? [hotel.image] : []}
        alt={hotel.name || "Hotel"}
        fallbackIcon={Building2}
        className="aspect-video w-full"
      />

      <div className="p-5 sm:p-6">
        <h2 className="text-2xl font-bold text-[#1a1a1a]">
          {hotel.name}
        </h2>

        {locationText && (
          <div className="mt-2 flex items-start gap-2 text-sm text-[#4a4a4a]">
            <MapPin
              size={17}
              className="mt-0.5 shrink-0 text-[#008cff]"
              aria-hidden="true"
            />
            <span>{locationText}</span>
          </div>
        )}

        {hotel.address && (
          <p className="mt-1 text-sm text-[#9b9b9b]">
            {hotel.address}
          </p>
        )}

        {hotel.description && (
          <p className="mt-5 text-sm leading-7 text-[#4a4a4a]">
            {hotel.description}
          </p>
        )}

        {hotel.highlights?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-[#1a1a1a]">
              Highlights
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {hotel.highlights.map(
                (highlight, index) => (
                  <span
                    key={`${highlight}-${index}`}
                    className="flex items-center gap-1.5 rounded-full bg-[#e6f4f1] px-3 py-1.5 text-sm font-medium text-[#1a7971]"
                  >
                    <Check size={14} aria-hidden="true" />
                    {highlight}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {hotel.contactPhone && (
          <div className="mt-6 border-t border-[#e7e7e7] pt-5">
            <p className="text-xs text-[#9b9b9b]">
              Contact
            </p>

            <a
              href={`tel:${hotel.contactPhone}`}
              className="mt-1 inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-[#008cff] hover:text-[#0073d1] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
            >
              <Phone size={16} aria-hidden="true" />
              {hotel.contactPhone}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingHotel;