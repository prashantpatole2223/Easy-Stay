import express from "express";

import {
    createRoom,
    getHotelRooms,
    getRoom,
    updateRoom,
    deactivateRoom,
    activateRoom,
    getRoomAmenities,
    getAvailableRooms,
    getRoomDetails
} from "../controllers/room.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import upload from "../middlewares/upload.middleware.js";

const roomRouter = express.Router();

roomRouter.get(
    "/amenities",
    authMiddleware,
    authorizeRoles("owner"),
    getRoomAmenities
);

roomRouter.post(
    "/hotels/:hotelId/create",
    authMiddleware,
    authorizeRoles("owner"),
    upload.array("images", 10),
    createRoom
);

roomRouter.get(
    "/hotel/:hotelId",
    authMiddleware,
    authorizeRoles("owner"),
    getHotelRooms
);

roomRouter.get(
    "/:roomId/details",
    authMiddleware,
    getRoomDetails
);

roomRouter.get(
    "/:roomId",
    authMiddleware,
    authorizeRoles("owner"),
    getRoom
);

roomRouter.patch(
    "/:roomId",
    authMiddleware,
    authorizeRoles("owner"),
    upload.array("images", 10),
    updateRoom
);

roomRouter.patch(
    "/:roomId/deactivate",
    authMiddleware,
    authorizeRoles("owner"),
    deactivateRoom
);

roomRouter.patch(
    "/:roomId/activate",
    authMiddleware,
    authorizeRoles("owner"),
    activateRoom
);

roomRouter.get("/", getAvailableRooms);

export default roomRouter;