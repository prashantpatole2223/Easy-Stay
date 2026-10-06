import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Amenity from "../models/Amenity.js";
import Booking from "../models/Booking.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

const parseArray = (value, fieldName) => {
    if (value === undefined || value === null || value === "") {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
            throw new Error(`${fieldName} must be an array.`);
        }

        return parsed;
    } catch (error) {
        throw new Error(`Invalid ${fieldName} format.`);
    }
};

const validateRoomAmenities = async (amenities) => {
    if (!Array.isArray(amenities)) {
        throw new Error("Amenities must be an array.");
    }

    if (amenities.length === 0) {
        return [];
    }

    const amenityIds = amenities.map(
        (amenity) => amenity.amenityId
    );

    const validAmenities = await Amenity.find({
        _id: { $in: amenityIds },
        type: "room",
        status: "active"
    }).select("_id");

    const validAmenityIds = new Set(
        validAmenities.map((amenity) =>
            amenity._id.toString()
        )
    );

    for (const amenity of amenities) {
        if (!validAmenityIds.has(String(amenity.amenityId))) {
            throw new Error(
                "One or more selected room amenities are invalid."
            );
        }

        if (
            amenity.subAmenities !== undefined &&
            !Array.isArray(amenity.subAmenities)
        ) {
            throw new Error(
                "Sub-amenities must be an array."
            );
        }
    }

    return amenities.map((amenity) => ({
        amenityId: amenity.amenityId,
        subAmenities: (amenity.subAmenities || [])
            .map((item) => String(item).trim())
            .filter(Boolean)
    }));
};

const validateHotelOwnership = async ({
    hotelId,
    ownerId
}) => {
    const hotel = await Hotel.findOne({
        _id: hotelId,
        ownerId
    });

    if (!hotel) {
        throw new Error(
            "Hotel not found or you are not authorized to access it."
        );
    }

    return hotel;
};

export const createRoomService = async ({
    hotelId,
    ownerId,
    name,
    description,
    bedType,
    capacity,
    price,
    totalRooms,
    checkInTime,
    checkOutTime,
    amenities,
    highlights,
    images
}) => {
    await validateHotelOwnership({
        hotelId,
        ownerId
    });

    const parsedAmenities = parseArray(
        amenities,
        "amenities"
    );

    const validatedAmenities =
        await validateRoomAmenities(parsedAmenities);

    const parsedHighlights = parseArray(
        highlights,
        "highlights"
    );

    const cleanHighlights = parsedHighlights
        .map((highlight) => String(highlight).trim())
        .filter(Boolean);

    const uploadedImages = [];

    try {
        for (const image of images || []) {
            const result = await uploadToCloudinary(
                image.buffer,
                "easystay/rooms"
            );

            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id
            });
        }

        const room = await Room.create({
            hotelId,
            name,
            description,
            bedType,
            capacity: Number(capacity),
            price: Number(price),
            totalRooms: Number(totalRooms),
            checkInTime,
            checkOutTime,
            amenities: validatedAmenities,
            highlights: cleanHighlights,
            images: uploadedImages
        });

        return room;
    } catch (error) {
        // If database creation fails after Cloudinary uploads,
        // clean up the uploaded images.
        for (const image of uploadedImages) {
            try {
                await cloudinary.uploader.destroy(
                    image.publicId
                );
            } catch (deleteError) {
                console.error(
                    "Failed to clean up Cloudinary image:",
                    deleteError
                );
            }
        }

        throw error;
    }
};

export const getHotelRoomsService = async ({
    hotelId,
    ownerId
}) => {
    const hotel = await validateHotelOwnership({
        hotelId,
        ownerId
    });

    const rooms = await Room.find({ hotelId })
        .populate(
            "amenities.amenityId",
            "name"
        )
        .sort({ createdAt: -1 });

    return {
        hotel,
        rooms
    };
};

export const getRoomService = async ({
    roomId,
    ownerId
}) => {
    const room = await Room.findById(roomId)
        .populate(
            "amenities.amenityId",
            "name"
        );

    if (!room) {
        throw new Error("Room not found.");
    }

    const hotel = await Hotel.findOne({
        _id: room.hotelId,
        ownerId
    });

    if (!hotel) {
        throw new Error(
            "You are not authorized to access this room."
        );
    }

    return {
        room,
        hotel
    };
};

export const getRoomDetailsService = async ({ roomId }) => {
    const room = await Room.findById(roomId)
        .populate(
            "amenities.amenityId",
            "name type"
        );


    if (!room) {
        const error = new Error("Room not found.");
        error.statusCode = 404;
        throw error;
    }

    const hotel = await Hotel.findById(room.hotelId)
        .select(
            "name address location status"
        );

    if (!hotel) {
        const error = new Error("Hotel not found.");
        error.statusCode = 404;
        throw error;
    }

    if (hotel.status !== "active") {
        const error = new Error("Hotel is not available.");
        error.statusCode = 404;
        throw error;
    }

    return {
        room,
        hotel
    };


};

export const updateRoomService = async ({
    roomId,
    ownerId,
    name,
    description,
    bedType,
    capacity,
    price,
    totalRooms,
    checkInTime,
    checkOutTime,
    amenities,
    highlights,
    existingImages,
    images
}) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    await validateHotelOwnership({
        hotelId: room.hotelId,
        ownerId
    });

    const parsedAmenities = parseArray(
        amenities,
        "amenities"
    );

    const validatedAmenities =
        await validateRoomAmenities(parsedAmenities);

    const parsedHighlights = parseArray(
        highlights,
        "highlights"
    );

    const cleanHighlights = parsedHighlights
        .map((highlight) => String(highlight).trim())
        .filter(Boolean);

    const parsedExistingImages = parseArray(
        existingImages,
        "existingImages"
    );

    const currentImages = room.images || [];

    const currentPublicIds = new Set(
        currentImages
            .map((image) => image.publicId)
            .filter(Boolean)
    );

    const submittedPublicIds = new Set(
        parsedExistingImages
            .map((image) => image.publicId)
            .filter(Boolean)
    );

    // Delete images that the owner removed.
    for (const image of currentImages) {
        if (
            image.publicId &&
            !submittedPublicIds.has(image.publicId)
        ) {
            try {
                await cloudinary.uploader.destroy(
                    image.publicId
                );
            } catch (error) {
                console.error(
                    "Failed to delete removed Cloudinary image:",
                    error
                );
            }
        }
    }

    const uploadedImages = [];

    try {
        // Upload newly selected images.
        for (const image of images || []) {
            const result = await uploadToCloudinary(
                image.buffer,
                "easystay/rooms"
            );

            uploadedImages.push({
                url: result.secure_url,
                publicId: result.public_id
            });
        }

        const finalImages = [
            ...parsedExistingImages,
            ...uploadedImages
        ];

        room.name = name;
        room.description = description;
        room.bedType = bedType;
        room.capacity = Number(capacity);
        room.price = Number(price);
        room.totalRooms = Number(totalRooms);
        room.checkInTime = checkInTime;
        room.checkOutTime = checkOutTime;
        room.amenities = validatedAmenities;
        room.highlights = cleanHighlights;
        room.images = finalImages;

        await room.save();

        return room;
    } catch (error) {
        // Clean up newly uploaded images if updating fails.
        for (const image of uploadedImages) {
            try {
                await cloudinary.uploader.destroy(
                    image.publicId
                );
            } catch (deleteError) {
                console.error(
                    "Failed to clean up new Cloudinary image:",
                    deleteError
                );
            }
        }

        throw error;
    }
};

export const deactivateRoomService = async ({
    roomId,
    ownerId
}) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    await validateHotelOwnership({
        hotelId: room.hotelId,
        ownerId
    });

    if (room.status === "inactive") {
        throw new Error(
            "Room is already inactive."
        );
    }

    room.status = "inactive";

    await room.save();

    return room;
};

export const activateRoomService = async ({
    roomId,
    ownerId
}) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error("Room not found.");
    }

    await validateHotelOwnership({
        hotelId: room.hotelId,
        ownerId
    });

    if (room.status === "active") {
        throw new Error(
            "Room is already active."
        );
    }

    room.status = "active";

    await room.save();

    return room;
};

export const getAvailableRoomsService = async ({ hotelId, checkIn, checkOut }) => {
    const rooms = await Room.find({
        hotelId,
        status: "active"
    }).lean();

    const bookings = await Booking.find({
        hotelId,
        $or: [
            {
                status: "confirmed"
            },
            {
                status: "held",
                holdExpiresAt: {
                    $gt: new Date()
                }
            }
        ],
        checkIn: {
            $lt: checkOut
        },
        checkOut: {
            $gt: checkIn
        }
    }).lean();

    const bookedQuantityMap = new Map();

    for (const booking of bookings) {
        for (const item of booking.items) {
            const roomId = item.roomId.toString();

            bookedQuantityMap.set(
                roomId,
                (bookedQuantityMap.get(roomId) || 0) + item.quantity
            );
        }
    }

    return rooms
        .map((room) => {
            const bookedQuantity =
                bookedQuantityMap.get(room._id.toString()) || 0;

            const availableRooms = room.totalRooms - bookedQuantity;

            return {
                ...room,
                availableRooms
            };
        })
        .filter((room) => room.availableRooms > 0);
};