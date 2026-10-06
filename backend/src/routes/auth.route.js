import express from "express";

import {
    loginSchema,
    customerSignupSchema,
    ownerSignupSchema
} from "../validators/auth.validator.js";

import {
    loginValidate,
    signupValidate
} from "../middlewares/validateMiddleware.js";

import {
    authMiddleware
} from "../middlewares/auth.middleware.js";

import {
    login,
    refresh,
    logout,
    logoutAll,
    customerSignup,
    ownerSignup
} from "../controllers/auth.controller.js";

const authRouter = express.Router();


authRouter.post(
    "/signup/customer",
    signupValidate(customerSignupSchema),
    customerSignup
);

authRouter.post(
    "/signup/owner",
    signupValidate(ownerSignupSchema),
    ownerSignup
);

authRouter.post(
    "/login",
    loginValidate(loginSchema),
    login
);

authRouter.post(
    "/refresh",
    refresh
);

authRouter.post(
    "/logout",
    logout
);

authRouter.post(
    "/logout-all",
    authMiddleware,
    logoutAll
);

authRouter.get(
    "/me",
    authMiddleware,
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: "User is authenticated",
            user: req.user
        });
    }
);

export default authRouter;