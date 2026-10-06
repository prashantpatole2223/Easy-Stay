import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Payment from "../models/Payment.js";

export const createDummyPaymentService = async ({
  bookingId,
  userId
}) => {
  
  const session = await mongoose.startSession();

  try {
    let payment;

    await session.withTransaction(async () => {
      /*
       * 1. Find the booking
       *
       * It must belong to the logged-in user.
       */

      const booking = await Booking.findOne({
        _id: bookingId,
        userId
      })
        .session(session);

      if (!booking) {
        const error = new Error("Booking not found.");
        error.statusCode = 404;
        throw error;
      }

      /*
       * 2. Prevent duplicate payment
       *
       * If this booking already has a successful payment,
       * don't create another payment.
       */

      const existingPayment = await Payment.findOne({
        bookingId,
        status: "success"
      }).session(session);

      if (existingPayment) {
        const error = new Error(
          "Payment has already been completed for this booking."
        );

        error.statusCode = 409;

        throw error;
      }

      /*
       * 3. Booking must still be held
       */

      if (booking.status !== "held") {
        const error = new Error(
          `Booking cannot be paid because its status is "${booking.status}".`
        );

        error.statusCode = 409;

        throw error;
      }

      /*
       * 4. Check whether the hold has expired
       *
       * We don't rely only on the expiry cron job.
       */

      if (
        !booking.holdExpiresAt ||
        booking.holdExpiresAt <= new Date()
      ) {
        const error = new Error(
          "Booking hold has expired."
        );

        error.statusCode = 409;

        throw error;
      }

      /*
       * 5. Confirm the booking atomically
       *
       * The important part:
       *
       * status must STILL be "held"
       * AND holdExpiresAt must STILL be in the future.
       *
       * If the expiry job changes the booking first,
       * this update will not happen.
       */

      const bookingUpdate = await Booking.updateOne(
        {
          _id: bookingId,
          userId,
          status: "held",
          holdExpiresAt: {
            $gt: new Date()
          }
        },
        {
          $set: {
            status: "confirmed"
          }
        },
        {
          session
        }
      );

      if (bookingUpdate.modifiedCount !== 1) {
        const error = new Error(
          "Booking is no longer available for payment."
        );

        error.statusCode = 409;

        throw error;
      }

      /*
       * 6. Create dummy payment
       */

      const paymentResult = await Payment.create(
        [
          {
            bookingId: booking._id,
            userId: booking.userId,
            amount: booking.totalAmount,
            currency: "INR",

            provider: "dummy",

            providerOrderId:
              `DUMMY_ORDER_${booking._id}_${Date.now()}`,

            providerPaymentId:
              `DUMMY_PAYMENT_${booking._id}_${Date.now()}`,

            status: "success",

            method: "dummy",

            gatewayResponse: {
              dummy: true,
              message: "Dummy payment successful"
            }
          }
        ],
        {
          session
        }
      );

      payment = paymentResult[0];
    });

    return payment;
  } finally {
    await session.endSession();
  }
};