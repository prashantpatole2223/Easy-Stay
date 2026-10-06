import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    amount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    provider: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "dummy"],
      required: true
    },

    // Payment gateway order ID
    providerOrderId: {
      type: String,
      required: true
    },

    // Filled after successful gateway payment
    providerPaymentId: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "success",
        "failed",
        "refunded",
        "partially_refunded"
      ],
      default: "created",
      required: true,
      index: true
    },

    method: {
      type: String,
      default: null
    },

    // Gateway response for verification/debugging
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },

    refundedAmount: {
      type: Number,
      default: 0
    },

    failureReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ providerOrderId: 1 });
paymentSchema.index({ bookingId: 1, status: 1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;