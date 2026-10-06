import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const createReviewService = async ({
  userId,
  bookingId,
  rating,
  review
}) => {
  const booking = await Booking.findOne({
    _id: bookingId,
    userId
  }).lean();

  if (!booking) {
    const error = new Error(
      "Booking not found."
    );

    error.statusCode = 404;

    throw error;
  }

  /*
   * Only confirmed bookings can be reviewed.
   */

  if (booking.status !== "confirmed") {
    const error = new Error(
      "Only confirmed bookings can be reviewed."
    );

    error.statusCode = 400;

    throw error;
  }

  /*
   * Stay must be completed.
   */

  if (booking.checkOut > new Date()) {
    const error = new Error(
      "You can review the hotel after your stay is completed."
    );

    error.statusCode = 400;

    throw error;
  }

  /*
   * Prevent duplicate review.
   */

  const existingReview = await Review.findOne({
    bookingId
  }).lean();

  if (existingReview) {
    const error = new Error(
      "You have already reviewed this booking."
    );

    error.statusCode = 409;

    throw error;
  }

  const createdReview = await Review.create({
    hotelId: booking.hotelId,
    userId,
    bookingId,
    rating,
    review
  });

  return createdReview;
};

export const updateReviewService = async ({
  userId,
  reviewId,
  rating,
  review
}) => {
  const existingReview = await Review.findOne({
    _id: reviewId,
    userId
  });

  if (!existingReview) {
    const error = new Error(
      "Review not found."
    );

    error.statusCode = 404;

    throw error;
  }

  existingReview.rating = rating;
  existingReview.review = review;

  await existingReview.save();

  return existingReview;
};

export const deleteReviewService = async ({
  userId,
  reviewId
}) => {
  const deletedReview = await Review.findOneAndDelete({
    _id: reviewId,
    userId
  });

  if (!deletedReview) {
    const error = new Error(
      "Review not found."
    );

    error.statusCode = 404;

    throw error;
  }

  return deletedReview;
};

export const getHotelReviewsService = async ({
  hotelId
}) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    status: "active"
  }).lean();

  if (!hotel) {
    const error = new Error(
      "Hotel not found."
    );

    error.statusCode = 404;

    throw error;
  }

  const reviews = await Review.find({
    hotelId
  })
    .populate("userId", "name")
    .sort({
      createdAt: -1
    })
    .lean();

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (total, item) => total + item.rating,
          0
        ) / reviewCount
      : 0;

  return {
    averageRating: Number(
      averageRating.toFixed(1)
    ),
    reviewCount,
    reviews
  };
};

export const getMyReviewsService = async ({
  userId
}) => {
  const reviews = await Review.find({
    userId
  })
    .populate("hotelId", "name")
    .sort({
      createdAt: -1
    })
    .lean();

  return reviews;
};

export const getOwnerHotelReviewsService = async ({
  ownerId,
  hotelId
}) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    ownerId
  }).lean();

  if (!hotel) {
    const error = new Error(
      "Hotel not found or you do not own this hotel."
    );

    error.statusCode = 404;

    throw error;
  }

  const reviews = await Review.find({
    hotelId
  })
    .populate("userId", "name")
    .sort({
      createdAt: -1
    })
    .lean();

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount > 0
      ? reviews.reduce(
          (total, item) => total + item.rating,
          0
        ) / reviewCount
      : 0;

  return {
    averageRating: Number(
      averageRating.toFixed(1)
    ),
    reviewCount,
    reviews
  };
};