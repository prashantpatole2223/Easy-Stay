import Amenity from "../models/Amenity.js";
import {
    createRoomService,
    getHotelRoomsService,
    getRoomService,
    updateRoomService,
    deactivateRoomService,
    activateRoomService,
    getAvailableRoomsService,
    getRoomDetailsService
} from "../services/room.service.js";

export const getRoomAmenities = async (req, res) => {
    try {
        const amenities = await Amenity.find({
            type: "room",
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

export const createRoom = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const {
            name,
            description,
            bedType,
            capacity,
            price,
            totalRooms,
            checkInTime,
            checkOutTime,
            amenities,
            highlights
        } = req.body;

        if (
            !name ||
            !description ||
            !bedType ||
            !capacity ||
            price === undefined ||
            !totalRooms ||
            !checkInTime ||
            !checkOutTime
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All required room fields must be provided."
            });
        }

        const images = req.files || [];

        const room = await createRoomService({
            hotelId,
            ownerId: req.user.id,
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
        });

        return res.status(201).json({
            success: true,
            message: "Room created successfully.",
            room
        });
    } catch (error) {
        console.error("Create room error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to create room."
        });
    }
};

export const getHotelRooms = async (req, res) => {
    try {
        const { hotelId } = req.params;

        const { hotel, rooms } =
            await getHotelRoomsService({
                hotelId,
                ownerId: req.user.id
            });

        return res.status(200).json({
            success: true,
            hotel,
            rooms
        });
    } catch (error) {
        console.error(
            "Get hotel rooms error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to load rooms."
        });
    }
};

export const getRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const { room, hotel } =
            await getRoomService({
                roomId,
                ownerId: req.user.id
            });

        return res.status(200).json({
            success: true,
            room,
            hotel
        });
    } catch (error) {
        console.error("Get room error:", error);

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to load room."
        });
    }
};

export const getRoomDetails = async (req, res) => {
    try {
        const { roomId } = req.params;


        const { room, hotel } =
            await getRoomDetailsService({
                roomId
            });

        return res.status(200).json({
            success: true,
            room,
            hotel
        });
    } catch (error) {
        console.error(
            "Get room details error:",
            error
        );

        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message:
                error.message ||
                "Failed to load room details."
        });
    }


};

export const updateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const {
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
            existingImages
        } = req.body;

        if (
            !name ||
            !description ||
            !bedType ||
            !capacity ||
            price === undefined ||
            !totalRooms ||
            !checkInTime ||
            !checkOutTime
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "All required room fields must be provided."
            });
        }

        const images = req.files || [];

        const room = await updateRoomService({
            roomId,
            ownerId: req.user.id,
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
        });

        return res.status(200).json({
            success: true,
            message: "Room updated successfully.",
            room
        });
    } catch (error) {
        console.error(
            "Update room error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to update room."
        });
    }
};

export const deactivateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room =
            await deactivateRoomService({
                roomId,
                ownerId: req.user.id
            });

        return res.status(200).json({
            success: true,
            message:
                "Room deactivated successfully.",
            room
        });
    } catch (error) {
        console.error(
            "Deactivate room error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to deactivate room."
        });
    }
};

export const activateRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const room =
            await activateRoomService({
                roomId,
                ownerId: req.user.id
            });

        return res.status(200).json({
            success: true,
            message:
                "Room activated successfully.",
            room
        });
    } catch (error) {
        console.error(
            "Activate room error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to activate room."
        });
    }
};

export const getAvailableRooms = async (req, res, next) => {
    try {
        const { hotelId, checkIn, checkOut } = req.query;

        if (!hotelId || !checkIn || !checkOut) {
            return res.status(400).json({
                success: false,
                message: "hotelId, checkIn and checkOut are required"
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

        const rooms = await getAvailableRoomsService({
            hotelId,
            checkIn: checkInDate,
            checkOut: checkOutDate
        });

        return res.status(200).json({
            success: true,
            rooms
        });
    } catch (error) {
        next(error);
    }
};