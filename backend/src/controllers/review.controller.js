import {
  createReviewService,
  updateReviewService,
  deleteReviewService,
  getHotelReviewsService,
  getMyReviewsService,
  getOwnerHotelReviewsService
} from "../services/review.service.js";

export const createReview = async (req, res, next) => {
  try {
    const {
      bookingId,
      rating,
      review
    } = req.body;

    if (
      !bookingId ||
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "bookingId and a rating between 1 and 5 are required"
      });
    }

    const createdReview =
      await createReviewService({
        userId: req.user.id,
        bookingId,
        rating,
        review: review || ""
      });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review: createdReview
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const {
      rating,
      review
    } = req.body;

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Rating must be between 1 and 5"
      });
    }

    const updatedReview =
      await updateReviewService({
        userId: req.user.id,
        reviewId: req.params.reviewId,
        rating,
        review: review || ""
      });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    await deleteReviewService({
      userId: req.user.id,
      reviewId: req.params.reviewId
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

export const getHotelReviews = async (req, res, next) => {
  try {
    const result =
      await getHotelReviewsService({
        hotelId: req.params.hotelId
      });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

export const getMyReviews = async (req, res, next) => {
  try {
    const reviews =
      await getMyReviewsService({
        userId: req.user.id
      });

    return res.status(200).json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

export const getOwnerHotelReviews = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await getOwnerHotelReviewsService({
        ownerId: req.user.id,
        hotelId: req.params.hotelId
      });

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};