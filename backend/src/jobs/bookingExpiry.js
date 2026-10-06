import cron from "node-cron";
import Booking from "../models/Booking.js";

export const startBookingExpiryJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const result = await Booking.updateMany(
        {
          status: "held",
          holdExpiresAt: {
            $lte: new Date()
          }
        },
        {
          $set: {
            status: "expired"
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(
          `${result.modifiedCount} booking(s) expired`
        );
      }
    } catch (error) {
      console.error(
        "Booking expiry job failed:",
        error
      );
    }
  });

  console.log("Booking expiry job started");
};