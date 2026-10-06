import { Check } from "lucide-react";

const HotelOverview = ({ hotel }) => {
  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        About this hotel
      </h2>

      {hotel.description ? (
        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#4a4a4a]">
          {hotel.description}
        </p>
      ) : (
        <p className="mt-4 text-sm text-[#9b9b9b]">
          Description not available.
        </p>
      )}

      {hotel.highlights?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[#1a1a1a]">
            Highlights
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {hotel.highlights.map((highlight, index) => (
              <span
                key={index}
                className="flex items-center gap-1.5 rounded-full bg-[#e6f4f1] px-3 py-1.5 text-sm font-medium text-[#1a7971]"
              >
                <Check size={14} aria-hidden="true" />
                {highlight}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HotelOverview;