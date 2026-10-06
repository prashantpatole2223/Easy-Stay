import api from "./api";

export const createDummyPayment = async (bookingId) => {
  const response = await api.post("/payments", {
    bookingId
  });

  return response.data;
};