import express from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

import {
  createReview,
  updateReview,
  deleteReview,
  getHotelReviews,
  getMyReviews,
  getOwnerHotelReviews
} from "../controllers/review.controller.js";

const reviewRouter = express.Router();

/*
 * Public
 */
reviewRouter.get(
  "/hotel/:hotelId",
  getHotelReviews
);

/*
 * Customer
 */
reviewRouter.post(
  "/",
  authMiddleware,
  authorizeRoles("customer"),
  createReview
);

reviewRouter.get(
  "/my",
  authMiddleware,
  authorizeRoles("customer"),
  getMyReviews
);

reviewRouter.put(
  "/:reviewId",
  authMiddleware,
  authorizeRoles("customer"),
  updateReview
);

reviewRouter.delete(
  "/:reviewId",
  authMiddleware,
  authorizeRoles("customer"),
  deleteReview
);

/*
 * Owner
 */
reviewRouter.get(
  "/owner/hotel/:hotelId",
  authMiddleware,
  authorizeRoles("owner"),
  getOwnerHotelReviews
);

export default reviewRouter;