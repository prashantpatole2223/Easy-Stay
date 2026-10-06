import api from "./api";

export const getBookingGuestInfo = async () => {
  const response = await api.get("/users/me");

  return response.data;
};

export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");

  return response.data;
};

export const createBooking = async ({
  checkIn,
  checkOut,
  guestCount,
  guestInfo,
  items
}) => {
  const response = await api.post("/bookings", {
    checkIn,
    checkOut,
    guestCount: Number(guestCount),
    guestInfo: {
      name: guestInfo.name,
      email: guestInfo.email,
      phone: guestInfo.phone
    },
    items
  });

  return response.data;
};

export const getBookingDetails = async (bookingId) => {
  const response = await api.get(
    `/bookings/${bookingId}`
  );

  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.post(
    `/bookings/${bookingId}/cancel`
  );

  return response.data;
};