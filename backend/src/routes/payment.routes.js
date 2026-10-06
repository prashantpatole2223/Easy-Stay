import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import { createDummyPayment } from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/",
  authMiddleware,
  authorizeRoles("customer"),
  createDummyPayment
);

export default paymentRouter;