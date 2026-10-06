import {
  useEffect,
  useState
} from "react";
import { Info, Star } from "lucide-react";

import {
  createReview,
  updateReview,
  deleteReview
} from "../../services/reviewService";

const primaryButtonClass =
  "rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const secondaryButtonClass =
  "rounded-lg border border-[#008cff] bg-white px-4 py-2 text-sm font-semibold text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] disabled:cursor-not-allowed disabled:opacity-50";

const BookingReview = ({
  booking,
  review,
  onReviewChange
}) => {
  const [rating, setRating] =
    useState(review?.rating || 5);

  const [reviewText, setReviewText] =
    useState(review?.review || "");

  const [editing, setEditing] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    setRating(review?.rating || 5);
    setReviewText(
      review?.review || ""
    );
    setEditing(false);
    setError("");
  }, [review]);

  if (!booking) {
    return null;
  }

  const checkoutPassed =
    new Date(booking.checkOut) <=
    new Date();

  const canReview =
    booking.status === "confirmed" &&
    checkoutPassed;

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      let response;

      if (review && editing) {
        response =
          await updateReview({
            reviewId: review._id,
            rating,
            review: reviewText
          });
      } else {
        response =
          await createReview({
            bookingId: booking._id,
            rating,
            review: reviewText
          });
      }

      onReviewChange(
        response.review || null
      );

      setEditing(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to save review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this review?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await deleteReview(
        review._id
      );

      onReviewChange(null);

      setRating(5);
      setReviewText("");
      setEditing(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete review."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Review
      </h2>

      {review && !editing ? (
        <div className="mt-5">
          <div
            className="flex items-center gap-1"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from(
              { length: 5 },
              (_, index) => (
                <Star
                  key={index}
                  size={22}
                  aria-hidden="true"
                  fill="currentColor"
                  className={
                    index < review.rating
                      ? "text-[#f5a623]"
                      : "text-gray-300"
                  }
                />
              )
            )}
          </div>

          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#4a4a4a]">
            {review.review ||
              "No written review."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
              className={secondaryButtonClass}
            >
              Edit Review
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-[#d0021b]/40 bg-white px-4 py-2 text-sm font-semibold text-[#d0021b] transition hover:bg-[#fdecea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d0021b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting
                ? "Deleting..."
                : "Delete Review"}
            </button>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 text-sm text-[#d0021b]"
            >
              {error}
            </p>
          )}
        </div>
      ) : canReview ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5"
        >
          <div>
            <p className="mb-2 text-sm font-semibold text-[#1a1a1a]">
              Rating
            </p>

            <div className="flex gap-1">
              {Array.from(
                { length: 5 },
                (_, index) => {
                  const value =
                    index + 1;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setRating(value)
                      }
                      className="rounded p-0.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
                      aria-label={`Rate ${value} out of 5`}
                    >
                      <Star
                        size={30}
                        aria-hidden="true"
                        fill="currentColor"
                        className={
                          value <= rating
                            ? "text-[#f5a623]"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="booking-review"
              className="mb-2 block text-sm font-semibold text-[#1a1a1a]"
            >
              Your Review
            </label>

            <textarea
              id="booking-review"
              value={reviewText}
              onChange={(event) =>
                setReviewText(
                  event.target.value
                )
              }
              rows={5}
              placeholder="Share your experience..."
              className="w-full rounded-lg border border-[#e7e7e7] bg-white px-4 py-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 text-sm text-[#d0021b]"
            >
              {error}
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className={primaryButtonClass}
            >
              {submitting
                ? "Saving..."
                : review
                ? "Update Review"
                : "Submit Review"}
            </button>

            {review && editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setRating(
                    review.rating
                  );
                  setReviewText(
                    review.review || ""
                  );
                }}
                className={`px-5 py-2.5 ${secondaryButtonClass}`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#f2f2f2] p-3">
          <Info
            size={16}
            className="mt-0.5 shrink-0 text-[#008cff]"
            aria-hidden="true"
          />

          <p className="text-sm text-[#4a4a4a]">
            You can review this hotel after
            your stay is completed.
          </p>
        </div>
      )}
    </section>
  );
};

export default BookingReview;