import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./src/config/db.js";
import { startBookingExpiryJob } from "./src/jobs/bookingExpiry.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    startBookingExpiryJob();

    app.listen(PORT, () => {
      console.log(`EasyStay server running on port ${PORT}`);
    });

  } catch (error) {
    process.exit(1);
  }
};

startServer();