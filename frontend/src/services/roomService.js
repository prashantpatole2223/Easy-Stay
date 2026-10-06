import api from "./api";

export const getAvailableRooms = async ({
  hotelId,
  checkIn,
  checkOut
}) => {
  const response = await api.get("/rooms", {
    params: {
      hotelId,
      checkIn,
      checkOut
    }
  });

  return response.data;
};

export const getRoomDetails = async (roomId) => {
  const response = await api.get(
    `/rooms/${roomId}/details`
  );

  return response.data;
};
