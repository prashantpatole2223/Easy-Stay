import mongoose from "mongoose";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Payment from "../models/Payment.js";

const TAX_PERCENTAGE = 15;

export const createBookingService = async ({
  userId,
  checkIn,
  checkOut,
  guestCount,
  guestInfo,
  items
}) => {
  const session = await mongoose.startSession();

  let createdBooking = null;
  let hotelDetails = null;

  try {
    await session.withTransaction(async () => {
      const dateFormat = /^\d{4}-\d{2}-\d{2}$/;


      if (
        typeof checkIn !== "string" ||
        typeof checkOut !== "string" ||
        !dateFormat.test(checkIn) ||
        !dateFormat.test(checkOut)
      ) {
        const error = new Error(
          "Dates must be in YYYY-MM-DD format."
        );

        error.statusCode = 400;
        throw error;
      }

      if (
        !guestInfo ||
        typeof guestInfo !== "object" ||
        Array.isArray(guestInfo)
      ) {
        const error = new Error(
          "Guest information is required."
        );

        error.statusCode = 400;
        throw error;
      }

      const guestName = guestInfo.name;
      const guestEmail = guestInfo.email;
      const guestPhone = guestInfo.phone;

      if (
        typeof guestName !== "string" ||
        !guestName.trim()
      ) {
        const error = new Error(
          "Guest name is required."
        );

        error.statusCode = 400;
        throw error;
      }

      if (
        typeof guestEmail !== "string" ||
        !guestEmail.trim()
      ) {
        const error = new Error(
          "Guest email is required."
        );

        error.statusCode = 400;
        throw error;
      }

      if (
        typeof guestPhone !== "string" ||
        !guestPhone.trim()
      ) {
        const error = new Error(
          "Guest phone is required."
        );

        error.statusCode = 400;
        throw error;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(guestEmail.trim())) {
        const error = new Error(
          "Invalid guest email."
        );

        error.statusCode = 400;
        throw error;
      }

      const [checkInYear, checkInMonth, checkInDay] =
        checkIn.split("-").map(Number);

      const [checkOutYear, checkOutMonth, checkOutDay] =
        checkOut.split("-").map(Number);

      const checkInDate = new Date(
        Date.UTC(
          checkInYear,
          checkInMonth - 1,
          checkInDay
        )
      );

      const checkOutDate = new Date(
        Date.UTC(
          checkOutYear,
          checkOutMonth - 1,
          checkOutDay
        )
      );

      if (
        checkInDate.getUTCFullYear() !== checkInYear ||
        checkInDate.getUTCMonth() !== checkInMonth - 1 ||
        checkInDate.getUTCDate() !== checkInDay ||
        checkOutDate.getUTCFullYear() !== checkOutYear ||
        checkOutDate.getUTCMonth() !== checkOutMonth - 1 ||
        checkOutDate.getUTCDate() !== checkOutDay
      ) {
        const error = new Error(
          "Invalid check-in or check-out date."
        );

        error.statusCode = 400;
        throw error;
      }

      if (checkOutDate <= checkInDate) {
        const error = new Error(
          "Check-out must be after check-in."
        );

        error.statusCode = 400;
        throw error;
      }

      const today = new Date();

      today.setUTCHours(
        0,
        0,
        0,
        0
      );

      if (checkInDate < today) {
        const error = new Error(
          "Check-in date cannot be in the past."
        );

        error.statusCode = 400;
        throw error;
      }

      const nights =
        (checkOutDate.getTime() -
          checkInDate.getTime()) /
        (1000 * 60 * 60 * 24);

      if (nights > 60) {
        const error = new Error(
          "Maximum stay allowed is 60 nights."
        );

        error.statusCode = 400;
        throw error;
      }

      if (
        !Number.isInteger(guestCount) ||
        guestCount <= 0
      ) {
        const error = new Error(
          "Guest count must be a positive integer."
        );

        error.statusCode = 400;
        throw error;
      }

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {
        const error = new Error(
          "At least one room must be selected."
        );

        error.statusCode = 400;
        throw error;
      }

      for (const item of items) {
        if (
          !item.roomId ||
          !mongoose.isValidObjectId(item.roomId)
        ) {
          const error = new Error(
            "Invalid room ID."
          );

          error.statusCode = 400;
          throw error;
        }

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          const error = new Error(
            "Each room must have a valid positive quantity."
          );

          error.statusCode = 400;
          throw error;
        }
      }

      const roomIdStrings = items.map(
        (item) => item.roomId.toString()
      );

      const uniqueRoomIds = new Set(
        roomIdStrings
      );

      if (
        uniqueRoomIds.size !==
        roomIdStrings.length
      ) {
        const error = new Error(
          "Duplicate room types are not allowed."
        );

        error.statusCode = 400;
        throw error;
      }

      const roomIds = items
        .map(
          (item) =>
            new mongoose.Types.ObjectId(
              item.roomId
            )
        )
        .sort((a, b) =>
          a.toString().localeCompare(
            b.toString()
          )
        );

      for (const roomId of roomIds) {
        const result = await Room.updateOne(
          {
            _id: roomId,
            status: "active"
          },
          {
            $inc: {
              bookingLockVersion: 1
            }
          },
          {
            session
          }
        );

        if (result.modifiedCount !== 1) {
          const error = new Error(
            "One or more selected rooms are no longer available."
          );

          error.statusCode = 409;
          throw error;
        }
      }

      const rooms = await Room.find({
        _id: {
          $in: roomIds
        },
        status: "active"
      })
        .session(session)
        .lean();

      if (rooms.length !== roomIds.length) {
        const error = new Error(
          "One or more selected rooms are no longer available."
        );

        error.statusCode = 409;
        throw error;
      }

      const hotelIds = [
        ...new Set(
          rooms.map((room) =>
            room.hotelId.toString()
          )
        )
      ];

      if (hotelIds.length !== 1) {
        const error = new Error(
          "All selected rooms must belong to the same hotel."
        );

        error.statusCode = 400;
        throw error;
      }

      const hotel = await Hotel.findOne({
        _id: rooms[0].hotelId,
        status: "active"
      })
        .session(session)
        .lean();

      if (!hotel) {
        const error = new Error(
          "Hotel is no longer available for booking."
        );

        error.statusCode = 409;
        throw error;
      }

      hotelDetails = {
        id: hotel._id,
        name: hotel.name,
        address: hotel.address,

        location: {
          city: hotel.location.city,
          state: hotel.location.state,
          country: hotel.location.country,

          coordinates: {
            latitude:
              hotel.location.coordinates?.latitude ?? null,

            longitude:
              hotel.location.coordinates?.longitude ?? null
          }
        }
      };

      let totalCapacity = 0;

      for (const room of rooms) {
        const item = items.find(
          (item) =>
            item.roomId.toString() ===
            room._id.toString()
        );

        totalCapacity +=
          room.capacity * item.quantity;
      }

      if (guestCount > totalCapacity) {
        const error = new Error(
          `Selected rooms can accommodate a maximum of ${totalCapacity} guest(s).`
        );

        error.statusCode = 400;
        throw error;
      }

      const now = new Date();

      const bookings = await Booking.find({
        hotelId: rooms[0].hotelId,

        $or: [
          {
            status: "confirmed"
          },
          {
            status: "held",
            holdExpiresAt: {
              $gt: now
            }
          }
        ],

        checkIn: {
          $lt: checkOutDate
        },

        checkOut: {
          $gt: checkInDate
        }
      })
        .session(session)
        .lean();

      const bookedQuantityMap = new Map();

      for (const booking of bookings) {
        for (const item of booking.items) {
          const roomId =
            item.roomId.toString();

          bookedQuantityMap.set(
            roomId,
            (bookedQuantityMap.get(roomId) || 0) +
            item.quantity
          );
        }
      }

      for (const room of rooms) {
        const item = items.find(
          (item) =>
            item.roomId.toString() ===
            room._id.toString()
        );

        const requestedQuantity =
          item.quantity;

        const bookedQuantity =
          bookedQuantityMap.get(
            room._id.toString()
          ) || 0;

        const availableRooms =
          room.totalRooms -
          bookedQuantity;

        if (
          requestedQuantity >
          availableRooms
        ) {
          const error = new Error(
            `Only ${availableRooms} room(s) available for ${room.name}.`
          );

          error.statusCode = 409;
          throw error;
        }
      }

      const bookingItems = rooms.map((room) => {
        const item = items.find(
          (item) =>
            item.roomId.toString() ===
            room._id.toString()
        );

        const quantity = item.quantity;

        const subtotal =
          room.price *
          quantity *
          nights;

        return {
          roomId: room._id,
          roomName: room.name,
          capacity: room.capacity,
          pricePerRoom: room.price,
          quantity,
          subtotal
        };
      });

      const baseAmount =
        bookingItems.reduce(
          (total, item) => {
            return total + item.subtotal;
          },
          0
        );

      const taxAmount = Number(
        (
          baseAmount *
          TAX_PERCENTAGE /
          100
        ).toFixed(2)
      );

      const totalAmount = Number(
        (
          baseAmount +
          taxAmount
        ).toFixed(2)
      );

      const holdExpiresAt = new Date(
        Date.now() + 15 * 60 * 1000
      );

      const bookingResult =
        await Booking.create(
          [
            {
              hotelId: rooms[0].hotelId,

              userId,

              guestInfo: {
                name: guestName.trim(),
                email: guestEmail.trim().toLowerCase(),
                phone: guestPhone.trim()
              },

              checkIn: checkInDate,

              checkOut: checkOutDate,

              guestCount,

              items: bookingItems,

              status: "held",

              holdExpiresAt,

              baseAmount,

              taxAmount,

              totalAmount
            }
          ],
          {
            session
          }
        );

      createdBooking =
        bookingResult[0];
    });

    return {
      booking: createdBooking,

      pricing: {
        baseAmount: createdBooking.baseAmount,

        taxPercentage: TAX_PERCENTAGE,

        taxAmount: createdBooking.taxAmount,

        totalAmount: createdBooking.totalAmount
      },

      hotel: hotelDetails
    };

  } finally {
    await session.endSession();
  }
};

export const getMyBookingsService = async ({ userId }) => {
  const bookings = await Booking.find({
    userId
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "hotelId",
      select: "name location images"
    })
    .lean();

  return bookings.map((booking) => ({
    _id: booking._id,
    hotel: booking.hotelId
      ? {
        name: booking.hotelId.name,
        location: booking.hotelId.location,
        image: booking.hotelId.images?.[0]?.url || null
      }
      : null,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    status: booking.status,
    createdAt: booking.createdAt
  }));
};

export const getBookingDetailsService = async ({
  userId,
  bookingId
}) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid booking ID.");
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    userId
  })
    .populate({
      path: "hotelId",
      select: "name description address location amenities highlights images ownerId",
      populate: {
        path: "ownerId",
        select: "phone"
      }
    })
    .lean();

  if (!booking) {
    const error = new Error("Booking not found.");
    error.statusCode = 404;
    throw error;
  }

  const payment = await Payment.findOne({
    bookingId: booking._id,
    userId
  })
    .sort({ createdAt: -1 })
    .select(
      "status amount currency provider method refundedAmount createdAt"
    )
    .lean();

  const hotel = booking.hotelId
    ? {
      _id: booking.hotelId._id,
      name: booking.hotelId.name,
      description: booking.hotelId.description,
      address: booking.hotelId.address,
      location: booking.hotelId.location,
      amenities: booking.hotelId.amenities,
      highlights: booking.hotelId.highlights,
      image: booking.hotelId.images?.[0]?.url || null,
      contactPhone: booking.hotelId.ownerId?.phone || null
    }
    : null;

  return {
    booking: {
      _id: booking._id,
      guestInfo: booking.guestInfo,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestCount: booking.guestCount,
      items: booking.items,
      status: booking.status,
      holdExpiresAt: booking.holdExpiresAt,
      baseAmount: booking.baseAmount,
      taxAmount: booking.taxAmount,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    },
    hotel,
    payment: payment || null
  };
};

export const cancelBookingService = async ({
  userId,
  bookingId
}) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid booking ID.");
    error.statusCode = 400;
    throw error;
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();


    const booking = await Booking.findOne({
      _id: bookingId,
      userId
    }).session(session);

    if (!booking) {
      const error = new Error("Booking not found.");
      error.statusCode = 404;
      throw error;
    }

    if (booking.status === "cancelled") {
      const error = new Error("Booking is already cancelled.");
      error.statusCode = 400;
      throw error;
    }

    if (booking.status === "completed") {
      const error = new Error("Completed bookings cannot be cancelled.");
      error.statusCode = 400;
      throw error;
    }

    if (booking.status !== "confirmed") {
      const error = new Error(
        "Only confirmed bookings can be cancelled."
      );
      error.statusCode = 400;
      throw error;
    }

    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const checkInDate = new Date(booking.checkIn);
    const checkInDay = new Date(
      checkInDate.getFullYear(),
      checkInDate.getMonth(),
      checkInDate.getDate()
    );

    if (todayDate >= checkInDay) {
      const error = new Error(
        "Booking cannot be cancelled on or after the check-in date."
      );
      error.statusCode = 400;
      throw error;
    }

    const payment = await Payment.findOne({
      bookingId: booking._id,
      userId
    })
      .sort({ createdAt: -1 })
      .session(session);

    if (payment && payment.status === "success") {
      payment.status = "refunded";
      payment.refundedAmount = payment.amount;

      await payment.save({ session });
    }

    booking.status = "cancelled";
    booking.holdExpiresAt = null;

    await booking.save({ session });

    await session.commitTransaction();

    return {
      booking,
      payment: payment || null
    };


  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getOwnerHotelBookingsService = async ({
  ownerId,
  hotelId,
  status
}) => {
  const hotel = await Hotel.findOne({
    _id: hotelId,
    ownerId
  })
    .select("_id")
    .lean();

  if (!hotel) {
    const error = new Error(
      "Hotel not found or you do not own this hotel."
    );

    error.statusCode = 404;

    throw error;
  }

  const filter = {
    hotelId: hotel._id
  };

  if (status) {
    const allowedStatuses = [
      "held",
      "confirmed",
      "cancelled",
      "completed"
    ];

    if (!allowedStatuses.includes(status)) {
      const error = new Error(
        "Invalid booking status."
      );

      error.statusCode = 400;

      throw error;
    }

    filter.status = status;
  }

  const bookings = await Booking.find(filter)
    .sort({ createdAt: -1 })
    .populate({
      path: "userId",
      select: "name"
    })
    .select(
      "_id userId items checkIn checkOut status totalAmount"
    )
    .lean();

  return bookings.map((booking) => ({
    _id: booking._id,
    customerName: booking.userId?.name || null,
    items: booking.items,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    status: booking.status,
    totalAmount: booking.totalAmount
  }));
};

export const getOwnerBookingDetailsService = async ({
  ownerId,
  hotelId,
  bookingId
}) => {
  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    const error = new Error("Invalid hotel ID.");
    error.statusCode = 400;
    throw error;
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    const error = new Error("Invalid booking ID.");
    error.statusCode = 400;
    throw error;
  }

  const hotel = await Hotel.findOne({
    _id: hotelId,
    ownerId
  })
    .populate({
      path: "ownerId",
      select: "phone"
    })
    .lean();

  if (!hotel) {
    const error = new Error(
      "Hotel not found or you do not own this hotel."
    );

    error.statusCode = 404;
    throw error;
  }

  const booking = await Booking.findOne({
    _id: bookingId,
    hotelId: hotel._id
  })
    .lean();

  if (!booking) {
    const error = new Error(
      "Booking not found."
    );

    error.statusCode = 404;
    throw error;
  }

  const payment = await Payment.findOne({
    bookingId: booking._id
  })
    .sort({ createdAt: -1 })
    .select(
      "status amount currency provider method refundedAmount createdAt"
    )
    .lean();

  const hotelDetails = {
    _id: hotel._id,
    name: hotel.name,
    description: hotel.description,
    address: hotel.address,
    location: hotel.location,
    highlights: hotel.highlights
  };

  return {
    booking: {
      _id: booking._id,
      guestInfo: booking.guestInfo,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guestCount: booking.guestCount,
      items: booking.items,
      status: booking.status,
      holdExpiresAt: booking.holdExpiresAt,
      baseAmount: booking.baseAmount,
      taxAmount: booking.taxAmount,
      totalAmount: booking.totalAmount,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    },
    hotel: hotelDetails,
    payment: payment || null
  };
};