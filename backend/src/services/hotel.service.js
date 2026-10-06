import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import Amenity from "../models/Amenity.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Review from "../models/Review.js"
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createHotelService = async ({
  ownerId,
  name,
  description,
  address,
  city,
  state,
  country,
  latitude,
  longitude,
  amenities,
  highlights,
  images
}) => {
  // ---------------------------------------------
  // Validate selected amenities
  // ---------------------------------------------

  let parsedAmenities = [];

  if (amenities) {
    try {
      parsedAmenities =
        typeof amenities === "string"
          ? JSON.parse(amenities)
          : amenities;
    } catch (error) {
      throw new Error("Invalid amenities data.");
    }
  }

  if (!Array.isArray(parsedAmenities)) {
    throw new Error("Amenities must be an array.");
  }

  // ---------------------------------------------
  // Verify amenities exist and are hotel amenities
  // ---------------------------------------------

  if (parsedAmenities.length > 0) {
    const amenityIds = parsedAmenities.map(
      (item) => item.amenityId
    );

    const validAmenities = await Amenity.find({
      _id: { $in: amenityIds },
      type: "hotel",
      status: "active"
    }).select("_id");


    if (validAmenities.length !== amenityIds.length) {
      throw new Error(
        "One or more selected amenities are invalid."
      );
    }
  }

  // ---------------------------------------------
  // Parse highlights
  // ---------------------------------------------

  let parsedHighlights = [];

  if (highlights) {
    try {
      parsedHighlights =
        typeof highlights === "string"
          ? JSON.parse(highlights)
          : highlights;
    } catch (error) {
      throw new Error("Invalid highlights data.");
    }
  }

  if (!Array.isArray(parsedHighlights)) {
    throw new Error("Highlights must be an array.");
  }

  // Remove empty highlights
  parsedHighlights = parsedHighlights
    .filter(
      (highlight) =>
        typeof highlight === "string" &&
        highlight.trim() !== ""
    )
    .map((highlight) => highlight.trim());

  // ---------------------------------------------
  // Upload images to Cloudinary
  // ---------------------------------------------

  const uploadedImages = [];

  if (images && images.length > 0) {
    try {
      for (const image of images) {
        const result = await uploadToCloudinary(
          image.buffer,
          "easystay/hotels"
        );

        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    } catch (error) {
      // If one image fails, delete already uploaded images
      // so we don't leave orphaned Cloudinary images.

      for (const image of uploadedImages) {
        try {
          // Add your Cloudinary delete function here later
          // await deleteFromCloudinary(image.publicId);
        } catch (deleteError) {
          console.error(
            "Failed to cleanup Cloudinary image:",
            deleteError
          );
        }
      }

      throw new Error(
        "Failed to upload hotel images."
      );
    }
  }

  // ---------------------------------------------
  // Build hotel data
  // ---------------------------------------------

  const hotelData = {
    ownerId,

    name: name.trim(),

    description: description.trim(),

    address: address.trim(),

    location: {
      city: city.trim(),
      state: state.trim(),
      country: country.trim()
    },

    amenities: parsedAmenities,

    highlights: parsedHighlights,

    images: uploadedImages
  };

  // ---------------------------------------------
  // Optional coordinates
  // ---------------------------------------------

  if (
    latitude !== undefined &&
    latitude !== null &&
    latitude !== ""
  ) {
    hotelData.location.coordinates = {
      ...(hotelData.location.coordinates || {}),
      latitude: Number(latitude)
    };
  }

  if (
    longitude !== undefined &&
    longitude !== null &&
    longitude !== ""
  ) {
    hotelData.location.coordinates = {
      ...(hotelData.location.coordinates || {}),
      longitude: Number(longitude)
    };
  }

  // ---------------------------------------------
  // Create hotel
  // ---------------------------------------------

  const hotel = await Hotel.create(hotelData);

  return hotel;
};

export const updateHotelService = async ({
  hotelId,
  ownerId,
  name,
  description,
  address,
  city,
  state,
  country,
  latitude,
  longitude,
  amenities,
  highlights,
  images
}) => {
  // ---------------------------------------------
  // Validate hotel ID
  // ---------------------------------------------

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    const error = new Error("Invalid hotel ID.");
    error.statusCode = 400;
    throw error;
  }

  // ---------------------------------------------
  // Find hotel belonging to authenticated owner
  // ---------------------------------------------

  const hotel = await Hotel.findOne({
    _id: hotelId,
    ownerId
  });

  if (!hotel) {
    const error = new Error(
      "Hotel not found or you are not authorized to edit this hotel."
    );


    error.statusCode = 404;
    throw error;


  }

  // ---------------------------------------------
  // Validate selected amenities
  // ---------------------------------------------

  let parsedAmenities;

  if (amenities !== undefined) {
    try {
      parsedAmenities =
        typeof amenities === "string"
          ? JSON.parse(amenities)
          : amenities;
    } catch (error) {
      const validationError = new Error(
        "Invalid amenities data."
      );


      validationError.statusCode = 400;
      throw validationError;
    }

    if (!Array.isArray(parsedAmenities)) {
      const error = new Error(
        "Amenities must be an array."
      );

      error.statusCode = 400;
      throw error;
    }

    if (parsedAmenities.length > 0) {
      const amenityIds = parsedAmenities.map(
        (item) => item.amenityId
      );

      const validAmenities = await Amenity.find({
        _id: { $in: amenityIds },
        type: "hotel",
        status: "active"
      }).select("_id");

      if (
        validAmenities.length !==
        amenityIds.length
      ) {
        const error = new Error(
          "One or more selected amenities are invalid."
        );

        error.statusCode = 400;
        throw error;
      }
    }


  }

  // ---------------------------------------------
  // Parse highlights
  // ---------------------------------------------

  let parsedHighlights;

  if (highlights !== undefined) {
    try {
      parsedHighlights =
        typeof highlights === "string"
          ? JSON.parse(highlights)
          : highlights;
    } catch (error) {
      const validationError = new Error(
        "Invalid highlights data."
      );


      validationError.statusCode = 400;
      throw validationError;
    }

    if (!Array.isArray(parsedHighlights)) {
      const error = new Error(
        "Highlights must be an array."
      );

      error.statusCode = 400;
      throw error;
    }

    parsedHighlights = parsedHighlights
      .filter(
        (highlight) =>
          typeof highlight === "string" &&
          highlight.trim() !== ""
      )
      .map((highlight) => highlight.trim());


  }

  // ---------------------------------------------
  // Upload new images to Cloudinary
  // ---------------------------------------------

  const uploadedImages = [];

  if (images && images.length > 0) {
    try {
      for (const image of images) {
        const result = await uploadToCloudinary(
          image.buffer,
          "easystay/hotels"
        );


        uploadedImages.push({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    } catch (error) {
      // Cleanup uploaded images if later upload fails.
      // Cloudinary delete can be added here when the
      // delete helper is available.

      console.error(
        "Hotel image upload failed:",
        error
      );

      throw new Error(
        "Failed to upload hotel images."
      );
    }


  }

  // ---------------------------------------------
  // Update basic hotel fields
  // ---------------------------------------------

  if (name !== undefined) {
    if (!name.trim()) {
      const error = new Error(
        "Hotel name cannot be empty."
      );


      error.statusCode = 400;
      throw error;
    }

    hotel.name = name.trim();


  }

  if (description !== undefined) {
    if (!description.trim()) {
      const error = new Error(
        "Hotel description cannot be empty."
      );


      error.statusCode = 400;
      throw error;
    }

    hotel.description = description.trim();


  }

  if (address !== undefined) {
    if (!address.trim()) {
      const error = new Error(
        "Hotel address cannot be empty."
      );


      error.statusCode = 400;
      throw error;
    }

    hotel.address = address.trim();


  }

  // ---------------------------------------------
  // Update location
  // ---------------------------------------------

  if (city !== undefined) {
    if (!city.trim()) {
      const error = new Error(
        "City cannot be empty."
      );


      error.statusCode = 400;
      throw error;
    }

    hotel.location.city = city.trim();


  }

  if (state !== undefined) {
    if (!state.trim()) {
      const error = new Error(
        "State cannot be empty."
      );


      error.statusCode = 400;
      throw error;
    }

    hotel.location.state = state.trim();


  }

  if (country !== undefined) {
    if (!country.trim()) {
      const error = new Error(
        "Country cannot be empty."
      );


      error.statusCode = 400;
      throw error;
    }

    hotel.location.country = country.trim();


  }

  // ---------------------------------------------
  // Update coordinates
  // ---------------------------------------------

  if (
    latitude !== undefined &&
    latitude !== null &&
    latitude !== ""
  ) {
    const parsedLatitude = Number(latitude);


    if (
      !Number.isFinite(parsedLatitude) ||
      parsedLatitude < -90 ||
      parsedLatitude > 90
    ) {
      const error = new Error(
        "Invalid latitude."
      );

      error.statusCode = 400;
      throw error;
    }

    hotel.location.coordinates = {
      ...(hotel.location.coordinates || {}),
      latitude: parsedLatitude
    };


  }

  if (
    longitude !== undefined &&
    longitude !== null &&
    longitude !== ""
  ) {
    const parsedLongitude = Number(longitude);


    if (
      !Number.isFinite(parsedLongitude) ||
      parsedLongitude < -180 ||
      parsedLongitude > 180
    ) {
      const error = new Error(
        "Invalid longitude."
      );

      error.statusCode = 400;
      throw error;
    }

    hotel.location.coordinates = {
      ...(hotel.location.coordinates || {}),
      longitude: parsedLongitude
    };


  }

  // ---------------------------------------------
  // Update amenities
  // ---------------------------------------------

  if (parsedAmenities !== undefined) {
    hotel.amenities = parsedAmenities;
  }

  // ---------------------------------------------
  // Update highlights
  // ---------------------------------------------

  if (parsedHighlights !== undefined) {
    hotel.highlights = parsedHighlights;
  }

  // ---------------------------------------------
  // Add newly uploaded images
  // ---------------------------------------------

  if (uploadedImages.length > 0) {
    hotel.images = [
      ...(hotel.images || []),
      ...uploadedImages
    ];
  }

  // ---------------------------------------------
  // Save hotel
  // ---------------------------------------------

  await hotel.save();

  return hotel;
};

export const getMyHotelsService = async (ownerId) => {
  const hotels = await Hotel.find({
    ownerId
  }).sort({ createdAt: -1 });

  return hotels;
};

export const getHotelDetailsService = async (hotelId) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    status: "active"
  }).populate({
    path: "amenities.amenityId",
    select: "name type"
  });

  return hotel;
};

export const deactivateHotelService = async ({
  hotelId,
  ownerId
}) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    ownerId
  });

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status === "inactive") {
    throw new Error("Hotel is already inactive.");
  }

  hotel.status = "inactive";

  await hotel.save();

  return hotel;
};

export const activateHotelService = async ({
  hotelId,
  ownerId
}) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    ownerId
  });

  if (!hotel) {
    throw new Error("Hotel not found.");
  }

  if (hotel.status === "active") {
    throw new Error("Hotel is already active.");
  }

  hotel.status = "active";

  await hotel.save();

  return hotel;
};


export const searchHotelsService = async ({
  city,
  checkIn,
  checkOut,
  guestCount,
  minPrice,
  maxPrice,
  amenities,
  sort
}) => {

  const hotelQuery = {
    status: "active"
  };

  if (city) {
    hotelQuery["location.city"] = {
      $regex: `^${city}$`,
      $options: "i"
    };
  }

  if (amenities?.length) {
    hotelQuery["amenities.amenityId"] = {
      $all: amenities
    };
  }

  const hotels = await Hotel.find(hotelQuery).lean();

  if (!hotels.length) {
    return [];
  }

  const hotelIds = hotels.map(
    (hotel) => hotel._id
  );

  const rooms = await Room.find({
    hotelId: { $in: hotelIds },
    status: "active"
  }).lean();

  const bookings = await Booking.find({
    hotelId: { $in: hotelIds },
    $or: [
      {
        status: "confirmed"
      },
      {
        status: "held",
        holdExpiresAt: { $gt: new Date() }
      }
    ],
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn }
  }).lean();

  const bookedQuantityMap = new Map();

  for (const booking of bookings) {
    for (const item of booking.items) {
      const roomId = item.roomId.toString();

      bookedQuantityMap.set(
        roomId,
        (bookedQuantityMap.get(roomId) || 0) +
        item.quantity
      );
    }
  }

  const hotelPriceMap = new Map();
  const hotelCapacityMap = new Map();

  for (const room of rooms) {
    const bookedQuantity =
      bookedQuantityMap.get(
        room._id.toString()
      ) || 0;

    const availableRooms =
      room.totalRooms - bookedQuantity;

    if (availableRooms <= 0) {
      continue;
    }

    const hotelId = room.hotelId.toString();

    /*
     * Total available capacity of this
     * room type.
     */
    const availableCapacity =
      room.capacity * availableRooms;

    hotelCapacityMap.set(
      hotelId,
      (hotelCapacityMap.get(hotelId) || 0) +
      availableCapacity
    );

    /*
     * Keep the cheapest AVAILABLE room
     * for the hotel's displayed price.
     */
    const currentPrice =
      hotelPriceMap.get(hotelId);

    if (
      currentPrice === undefined ||
      room.price < currentPrice
    ) {
      hotelPriceMap.set(
        hotelId,
        room.price
      );
    }
  }

  let results = hotels
    .map((hotel) => {
      const hotelId = hotel._id.toString();

      const availableCapacity =
        hotelCapacityMap.get(hotelId) || 0;

      /*
       * Hotel must have enough total
       * available capacity for the
       * requested guest count.
       */
      if (
        availableCapacity < guestCount
      ) {
        return null;
      }

      const lowestPrice =
        hotelPriceMap.get(hotelId);

      if (lowestPrice === undefined) {
        return null;
      }

      return {
        ...hotel,
        lowestPrice,
        availableCapacity
      };
    })
    .filter(Boolean);

  if (minPrice !== undefined) {
    results = results.filter(
      (hotel) =>
        hotel.lowestPrice >= minPrice
    );
  }

  if (maxPrice !== undefined) {
    results = results.filter(
      (hotel) =>
        hotel.lowestPrice <= maxPrice
    );
  }

  /*
   * Get rating summary for all hotels
   * in ONE database aggregation.
   */
  if (results.length > 0) {
    const resultHotelIds = results.map(
      (hotel) => hotel._id
    );

    const ratingSummaries =
      await Review.aggregate([
        {
          $match: {
            hotelId: {
              $in: resultHotelIds
            }
          }
        },
        {
          $group: {
            _id: "$hotelId",
            averageRating: {
              $avg: "$rating"
            },
            reviewCount: {
              $sum: 1
            }
          }
        }
      ]);

    const ratingMap = new Map();

    for (const summary of ratingSummaries) {
      ratingMap.set(
        summary._id.toString(),
        {
          averageRating: Number(
            summary.averageRating.toFixed(1)
          ),
          reviewCount: summary.reviewCount
        }
      );
    }

    results = results.map((hotel) => {
      const rating = ratingMap.get(
        hotel._id.toString()
      );

      return {
        ...hotel,
        averageRating:
          rating?.averageRating || 0,
        reviewCount:
          rating?.reviewCount || 0
      };
    });
  }

  if (sort === "price_asc") {
    results.sort(
      (a, b) =>
        a.lowestPrice - b.lowestPrice
    );
  }

  if (sort === "price_desc") {
    results.sort(
      (a, b) =>
        b.lowestPrice - a.lowestPrice
    );
  }

  return results;
};