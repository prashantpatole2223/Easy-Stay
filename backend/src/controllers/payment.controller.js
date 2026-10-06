import { createDummyPaymentService } from "../services/payment.service.js";

export const createDummyPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "bookingId is required"
      });
    }

    const payment = await createDummyPaymentService({
      bookingId,
      userId: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Payment successful",
      payment
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