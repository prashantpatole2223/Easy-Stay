import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { getHotelReviews } from "../../services/hotelService";

// Display-only formatter, e.g. "12 Oct 2026"
const formatReviewDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const StarRow = ({ value }) => {
  const filled = Math.max(
    0,
    Math.min(5, Math.round(Number(value) || 0))
  );

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${filled} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          aria-hidden="true"
          className={
            n <= filled
              ? "text-[#f5a623]"
              : "text-gray-300"
          }
          fill="currentColor"
        />
      ))}
    </div>
  );
};

const HotelReviews = ({ hotelId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);

        const result = await getHotelReviews(hotelId);

        setData(result);
      } catch (error) {
        console.error(
          "Failed to load hotel reviews:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [hotelId]);

  if (loading) {
    return (
      <section
        className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6"
        aria-busy="true"
      >
        <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />

        <div className="mt-5 h-20 animate-pulse rounded bg-gray-100" />
      </section>
    );
  }

  if (!data || data.reviewCount === 0) {
    return (
      <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">
          Reviews
        </h2>

        <div className="mt-4 flex flex-col items-center rounded-lg bg-[#f2f2f2] py-8 text-center">
          <Star
            size={26}
            className="text-gray-300"
            aria-hidden="true"
          />

          <p className="mt-2 text-sm text-[#4a4a4a]">
            No reviews yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">
          Reviews
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-[#1a7971] px-2.5 py-1.5 text-sm font-semibold text-white">
            <Star
              size={14}
              fill="currentColor"
              aria-hidden="true"
            />

            <span>
              {Number(data.averageRating).toFixed(1)}
            </span>
          </div>

          <span className="text-sm text-[#4a4a4a]">
            {data.reviewCount}{" "}
            {data.reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>
      </div>

      <div className="mt-6 divide-y divide-[#e7e7e7]">
        {data.reviews?.map((review) => {
          const name = review.userId?.name || "Guest";
          const date = formatReviewDate(review.createdAt);

          return (
            <div
              key={review._id}
              className="py-5 first:pt-0 last:pb-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-sm font-semibold uppercase text-[#008cff]"
                  >
                    {name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                      {name}
                    </p>

                    {date && (
                      <p className="text-xs text-[#9b9b9b]">
                        {date}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1">
                  <StarRow value={review.rating} />

                  <span className="text-xs text-[#4a4a4a]">
                    {review.rating}
                  </span>
                </div>
              </div>

              {review.review && (
                <p className="mt-3 text-sm leading-6 text-[#4a4a4a]">
                  {review.review}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HotelReviews;