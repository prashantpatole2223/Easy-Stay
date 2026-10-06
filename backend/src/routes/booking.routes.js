import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  getOwnerHotelBookings,
  getOwnerBookingDetails
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const bookingRouter = express.Router();

bookingRouter.get(
  "/my",
  authMiddleware,
  authorizeRoles("customer"),
  getMyBookings
);

bookingRouter.get(
  "/:bookingId",
  authMiddleware,
  authorizeRoles("customer"),
  getBookingDetails
);

bookingRouter.post(
  "/:bookingId/cancel",
  authMiddleware,
  authorizeRoles("customer"),
  cancelBooking
);

bookingRouter.post(
  "/",
  authMiddleware,
  authorizeRoles("customer"),
  createBooking
);

bookingRouter.get(
  "/owner/hotels/:hotelId/bookings",
  authMiddleware,
  authorizeRoles("owner"),
  getOwnerHotelBookings
);

bookingRouter.get(
  "/owner/hotels/:hotelId/bookings/:bookingId",
  authMiddleware,
  authorizeRoles("owner"),
  getOwnerBookingDetails
);

export default bookingRouter;