import express from "express";

import {authMiddleware} from "../middlewares/auth.middleware.js";

import {
getProfile,
updateProfile
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get(
"/profile",
authMiddleware,
getProfile
);

userRouter.patch(
"/profile",
authMiddleware,
updateProfile
);

export default userRouter;
