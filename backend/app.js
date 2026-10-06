import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.route.js"
import dotenv from "dotenv";
import hotelRouter from "./src/routes/hotel.Routes.js";
import roomRouter from "./src/routes/room.routes.js";
import bookingRoutes from "./src/routes/booking.routes.js"
import paymentRouter from "./src/routes/payment.routes.js";
import reviewRouter from "./src/routes/review.route.js";
import userRouter from "./src/routes/user.routes.js";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "EasyStay API is running"
  });
});

// Routes will be added here
app.use("/api/auth", authRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter)
app.use("/api/users", userRouter);


export default app;