import mongoose from "mongoose";

const bookingItemSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    roomName: {
      type: String,
      required: true,
      trim: true
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    pricePerRoom: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0
    }

  },
  {
    _id: false
  }
);

const guestInfoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    }

  },
  {
    _id: false
  }
);

const bookingSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    guestInfo: {
      type: guestInfoSchema,
      required: true
    },

    checkIn: {
      type: Date,
      required: true
    },

    checkOut: {
      type: Date,
      required: true
    },

    guestCount: {
      type: Number,
      required: true,
      min: 1
    },

    items: {
      type: [bookingItemSchema],
      required: true,
      validate: {
        validator: (items) => {
          return Array.isArray(items) && items.length > 0;
        },
        message: "At least one room item is required."
      }
    },

    status: {
      type: String,
      enum: [
        "held",
        "confirmed",
        "cancelled",
        "completed"
      ],
      default: "held",
      required: true
    },

    holdExpiresAt: {
      type: Date,
      default: null
    },

    baseAmount: {
      type: Number,
      required: true,
      min: 0
    },

    taxAmount: {
      type: Number,
      required: true,
      min: 0
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    }

  },
  {
    timestamps: true
  }
);

bookingSchema.index({
  hotelId: 1,
  checkIn: 1,
  checkOut: 1,
  status: 1
});

bookingSchema.index({
  userId: 1,
  createdAt: -1
});

const Booking = mongoose.model(
  "Booking",
  bookingSchema
);

export default Booking;
