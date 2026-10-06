import mongoose from "mongoose";

const hotelAmenitySchema = new mongoose.Schema(
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

const hotelSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

    address: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true
      },

      state: {
        type: String,
        required: true,
        trim: true
      },

      country: {
        type: String,
        required: true,
        trim: true
      },

      coordinates: {
        latitude: {
          type: Number
        },

        longitude: {
          type: Number
        }
      }
    },

    amenities: [hotelAmenitySchema],

    // Owner can add custom selling points to attract customers
    highlights: [
      {
        type: String,
        trim: true
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
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
    ]
  },

  {
    timestamps: true
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;