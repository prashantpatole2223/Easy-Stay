import {
  createBookingService,
  getMyBookingsService,
  getBookingDetailsService,
  cancelBookingService,
  getOwnerHotelBookingsService,
  getOwnerBookingDetailsService
} from "../services/booking.service.js";

export const createBooking = async (req, res, next) => {
  try {
    const {
      checkIn,
      checkOut,
      guestCount,
      guestInfo,
      items
    } = req.body;


    if (
      !checkIn ||
      !checkOut ||
      guestCount === undefined ||
      guestCount === null ||
      !guestInfo ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "checkIn, checkOut, guestCount, guestInfo and items are required"
      });
    }

    if (
      typeof guestInfo !== "object" ||
      Array.isArray(guestInfo)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid guest information"
      });
    }

    const result = await createBookingService({
      userId: req.user.id,
      checkIn,
      checkOut,
      guestCount,
      guestInfo,
      items
    });

    return res.status(201).json({
      success: true,
      message: "Booking held successfully",
      booking: result.booking,
      pricing: result.pricing,
      hotel: result.hotel
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

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await getMyBookingsService({
      userId: req.user.id
    });


    return res.status(200).json({
      success: true,
      bookings
    });


  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch bookings."
    });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const result = await getBookingDetailsService({
      userId: req.user.id,
      bookingId: req.params.bookingId
    });


    return res.status(200).json({
      success: true,
      booking: result.booking,
      hotel: result.hotel,
      payment: result.payment
    });


  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch booking details."
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const result = await cancelBookingService({
      userId: req.user.id,
      bookingId: req.params.bookingId
    });


    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      booking: result.booking,
      payment: result.payment
    });


  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel booking."
    });
  }
};

export const getOwnerHotelBookings = async (
  req,
  res
) => {
  try {
    const bookings =
      await getOwnerHotelBookingsService({
        ownerId: req.user.id,
        hotelId: req.params.hotelId,
        status: req.query.status
      });

    return res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch hotel bookings."
    });
  }
};

export const getOwnerBookingDetails = async (
  req,
  res
) => {
  try {
    const result =
      await getOwnerBookingDetailsService({
        ownerId: req.user.id,
        hotelId: req.params.hotelId,
        bookingId: req.params.bookingId
      });

    return res.status(200).json({
      success: true,
      booking: result.booking,
      hotel: result.hotel,
      payment: result.payment
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch booking details."
    });
  }
};