import mongoose from "mongoose";

const roomAmenitySchema = new mongoose.Schema(
  {
    amenityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Amenity",
      required: true
    },

    subAmenities: [
      {
        type: String,
        trim: true
      }
    ]
  },
  {
    _id: false
  }
);

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    bedType: {
      type: String,
      required: true,
      enum: [
        "single",
        "twin",
        "double",
        "queen",
        "king"
      ]
    },

    capacity: {
      type: Number,
      required: true,
      min: 1
    },

    amenities: [roomAmenitySchema],

    price: {
      type: Number,
      required: true,
      min: 0
    },

    totalRooms: {
      type: Number,
      required: true,
      min: 1
    },

    bookingLockVersion: {
      type: Number,
      default: 0
    },

    highlights: [
      {
        type: String,
        trim: true
      }
    ],

    checkInTime: {
      type: String,
      required: true,
      trim: true
    },

    checkOutTime: {
      type: String,
      required: true,
      trim: true
    },

    images: [
      {
        url: {
          type: String,
          required: true
        },

        publicId: {
          type: String
        }
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;