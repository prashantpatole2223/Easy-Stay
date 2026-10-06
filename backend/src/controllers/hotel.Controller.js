import Amenity from "../models/Amenity.js";
import Hotel from "../models/Hotel.js";
import { createHotelService, getHotelDetailsService, searchHotelsService, updateHotelService, activateHotelService } from "../services/hotel.service.js";
import {
  getMyHotelsService,
  deactivateHotelService
} from "../services/hotel.service.js";

export const createHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      amenities,
      highlights
    } = req.body;

    // ---------------------------------------------
    // Get authenticated owner
    // ---------------------------------------------

    const ownerId = req.user.id;

    // ---------------------------------------------
    // Basic validation
    // ---------------------------------------------

    if (
      !name ||
      !description ||
      !address ||
      !city ||
      !state ||
      !country
    ) {
      return res.status(400).json({
        success: false,
        message: "Required hotel fields are missing."
      });
    }

    // ---------------------------------------------
    // Images received from Multer
    // ---------------------------------------------

    const images = req.files || [];

    // ---------------------------------------------
    // Create hotel
    // ---------------------------------------------

    const hotel = await createHotelService({
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
    });

    // ---------------------------------------------
    // Response
    // ---------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Hotel created successfully.",
      hotel
    });
  } catch (error) {
    console.error("Create hotel controller error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create hotel."
    });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      country,
      latitude,
      longitude,
      amenities,
      highlights
    } = req.body;


    // ---------------------------------------------
    // Get authenticated owner
    // ---------------------------------------------

    const ownerId = req.user.id;

    // ---------------------------------------------
    // Get hotel ID
    // ---------------------------------------------

    const { hotelId } = req.params;

    // ---------------------------------------------
    // Images received from Multer
    // ---------------------------------------------

    const images = req.files || [];

    // ---------------------------------------------
    // Update hotel
    // ---------------------------------------------

    const hotel = await updateHotelService({
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
    });

    // ---------------------------------------------
    // Response
    // ---------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Hotel updated successfully.",
      hotel
    });


  } catch (error) {
    console.error(
      "Update hotel controller error:",
      error
    );


    return res.status(
      error.statusCode || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Failed to update hotel."
    });


  }
};

export const getHotelAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find({
      type: "hotel",
      status: "active"
    })
      .select("_id name")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: "Hotel amenities fetched successfully",
      amenities
    });
  } catch (error) {
    console.error("Get hotel amenities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch hotel amenities"
    });
  }
};

export const getMyHotels = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const hotels = await getMyHotelsService(ownerId);

    return res.status(200).json({
      success: true,
      hotels
    });
  } catch (error) {
    console.error("Get my hotels error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load hotels."
    });
  }
};

export const deactivateHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const ownerId = req.user.id;

    const hotel = await deactivateHotelService({
      hotelId,
      ownerId
    });

    return res.status(200).json({
      success: true,
      message: "Hotel deactivated successfully.",
      hotel
    });
  } catch (error) {
    console.error("Deactivate hotel error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to deactivate hotel."
    });
  }
};

export const activateHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const ownerId = req.user.id;


    const hotel = await activateHotelService({
      hotelId,
      ownerId
    });

    return res.status(200).json({
      success: true,
      message: "Hotel activated successfully.",
      hotel
    });


  } catch (error) {
    console.error("Activate hotel error:", error);


    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to activate hotel."
    });


  }
};

export const getHotelDetails = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await getHotelDetailsService(hotelId);

    return res.status(200).json({
      success: true,
      hotel
    });
  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load hotel details."
    });
  }
};

export const searchHotels = async (req, res, next) => {
  try {
    const {
      city,
      checkIn,
      checkOut,
      guestCount,
      minPrice,
      maxPrice,
      amenities,
      sort
    } = req.query;

    if (!city || !checkIn || !checkOut || !guestCount) {
      return res.status(400).json({
        success: false,
        message:
          "city, checkIn, checkOut and guestCount are required"
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date"
      });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in"
      });
    }

    const parsedGuestCount = Number(guestCount);

    if (
      !Number.isInteger(parsedGuestCount) ||
      parsedGuestCount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Guest count must be a positive integer"
      });
    }

    const selectedAmenities = amenities
      ? amenities.split(",")
      : [];

    const hotels = await searchHotelsService({
      city,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guestCount: parsedGuestCount,
      minPrice:
        minPrice !== undefined
          ? Number(minPrice)
          : undefined,
      maxPrice:
        maxPrice !== undefined
          ? Number(maxPrice)
          : undefined,
      amenities: selectedAmenities,
      sort
    });

    return res.status(200).json({
      success: true,
      count: hotels.length,
      hotels
    });
  } catch (error) {
    next(error);
  }
};