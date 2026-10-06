import express from "express";

import { getHotelAmenities, getHotelDetails, searchHotels, updateHotel } from "../controllers/hotel.Controller.js";
import upload from "../middlewares/upload.middleware.js";
import { createHotel, getMyHotels, deactivateHotel, activateHotel } from "../controllers/hotel.Controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const hotelRouter = express.Router();

hotelRouter.get("/amenities", getHotelAmenities);

hotelRouter.post(
    "/create",
    authMiddleware,
    authorizeRoles("owner"),
    upload.array("images", 10),
    createHotel
);

hotelRouter.patch(
    "/:hotelId",
    authMiddleware,
    authorizeRoles("owner"),
    upload.array("images", 10),
    updateHotel
);

hotelRouter.get(
    "/my",
    authMiddleware,
    authorizeRoles("owner"),
    getMyHotels
);

hotelRouter.patch(
    "/:hotelId/deactivate",
    authMiddleware,
    authorizeRoles("owner"),
    deactivateHotel
);

hotelRouter.patch(
    "/:hotelId/activate",
    authMiddleware,
    authorizeRoles("owner"),
    activateHotel
);


hotelRouter.get(
    "/search",
    searchHotels
);

hotelRouter.get(
    "/:hotelId",
    getHotelDetails
)

export default hotelRouter;