import api from "./api";

export const searchHotels = async ({
  city,
  checkIn,
  checkOut,
  guestCount,
  minPrice,
  maxPrice,
  amenities,
  sort
}) => {
  const params = {
    city,
    checkIn,
    checkOut,
    guestCount
  };

  if (minPrice !== "" && minPrice !== undefined) {
    params.minPrice = minPrice;
  }

  if (maxPrice !== "" && maxPrice !== undefined) {
    params.maxPrice = maxPrice;
  }

  if (amenities?.length) {
    params.amenities = amenities.join(",");
  }

  if (sort && sort !== "recommended") {
    params.sort = sort;
  }

  const response = await api.get("/hotels/search", {
    params
  });

  return response.data;
};

export const getHotelAmenities = async () => {
  const response = await api.get("/hotels/amenities");

  return response.data;
};

export const getHotelDetails = async (hotelId) => {
  const response = await api.get(`/hotels/${hotelId}`);

  return response.data;
};

export const getHotelReviews = async (hotelId) => {
  const response = await api.get(
    `/reviews/hotel/${hotelId}`
  );

  return response.data;
};