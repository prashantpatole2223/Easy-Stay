import {
    useCallback,
    useEffect,
    useState
} from "react";

import {
    getBookingDetails
} from "../services/bookingService";

import {
    getMyReviews
} from "../services/reviewService";

const findBookingReview = (
    reviews,
    bookingId
) => {
    return (
        reviews.find(
            (item) =>
                String(item.bookingId) ===
                String(bookingId)
        ) || null
    );
};

export const useBookingDetails = (
    bookingId
) => {
    const [booking, setBooking] =
        useState(null);

    const [hotel, setHotel] =
        useState(null);

    const [payment, setPayment] =
        useState(null);

    const [review, setReview] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchBookingDetails =
        useCallback(async () => {
            if (!bookingId) {
                setError("Booking ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const [
                    bookingResponse,
                    reviewResponse
                ] = await Promise.all([
                    getBookingDetails(bookingId),
                    getMyReviews()
                ]);

                setBooking(
                    bookingResponse.booking || null
                );

                setHotel(
                    bookingResponse.hotel || null
                );

                setPayment(
                    bookingResponse.payment || null
                );

                const reviews =
                    reviewResponse.reviews || [];

                setReview(
                    findBookingReview(
                        reviews,
                        bookingId
                    )
                );
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load booking details."
                );
            } finally {
                setLoading(false);
            }
        }, [bookingId]);

    useEffect(() => {
        fetchBookingDetails();
    }, [fetchBookingDetails]);

    return {
        booking,
        hotel,
        payment,
        review,
        setBooking,
        setPayment,
        setReview,
        loading,
        error,
        refetch: fetchBookingDetails
    };
};

