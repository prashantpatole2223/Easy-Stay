import api from "./api";

export const getMyReviews = async () => {
    const response = await api.get("/reviews/my");

    return response.data;
};

export const createReview = async ({
    bookingId,
    rating,
    review
}) => {
    const response = await api.post("/reviews", {
        bookingId,
        rating,
        review
    });

    return response.data;
};

export const updateReview = async ({
    reviewId,
    rating,
    review
}) => {
    const response = await api.put(
        `/reviews/${reviewId}`,
        {
            rating,
            review
        }
    );

    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(
        `/reviews/${reviewId}`
    );

    return response.data;
};