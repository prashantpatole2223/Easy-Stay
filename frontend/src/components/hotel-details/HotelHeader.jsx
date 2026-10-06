import {
  MapPin,
  Star
} from "lucide-react";

import { useEffect, useState } from "react";
import { getHotelReviews } from "../../services/hotelService";

const HotelHeader = ({ hotel }) => {
  const [rating, setRating] = useState(null);

  useEffect(() => {
    const loadRating = async () => {
      try {
        const data = await getHotelReviews(hotel._id);
        setRating(data);
      } catch (error) {
        console.error("Failed to load hotel rating:", error);
      }
    };

    loadRating();
  }, [hotel._id]);

  const location = [
    hotel.location?.city,
    hotel.location?.state
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {hotel.name}
          </h1>

          {location && (
            <div className="mt-2 flex items-center gap-2 text-sm text-[#4a4a4a]">
              <MapPin
                size={17}
                className="shrink-0 text-[#008cff]"
                aria-hidden="true"
              />
              <span>{location}</span>
            </div>
          )}

          {hotel.address && (
            <p className="mt-1 text-sm text-[#9b9b9b]">
              {hotel.address}
            </p>
          )}
        </div>

        {rating?.reviewCount > 0 ? (
          <div className="flex shrink-0 items-center gap-3">
            <div className="flex items-center gap-1 rounded-md bg-[#1a7971] px-3 py-2 text-sm font-semibold text-white">
              <Star
                size={15}
                fill="currentColor"
                aria-hidden="true"
              />

              <span>
                {Number(rating.averageRating).toFixed(1)}
              </span>
            </div>

            <span className="text-sm text-[#4a4a4a]">
              {rating.reviewCount}{" "}
              {rating.reviewCount === 1
                ? "review"
                : "reviews"}
            </span>
          </div>
        ) : (
          rating && (
            <span className="shrink-0 text-sm text-[#9b9b9b]">
              No reviews yet
            </span>
          )
        )}
      </div>
    </div>
  );
};

export default HotelHeader;