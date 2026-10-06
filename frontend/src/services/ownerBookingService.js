import api from "./api";

export const getOwnerHotelBookings = async ({
    hotelId,
    status
}) => {
    const params = {};


    if (status) {
        params.status = status;
    }

    const response = await api.get(
        `/bookings/owner/hotels/${hotelId}/bookings`,
        {
            params
        }
    );

    return response.data;


};

export const getOwnerBookingDetails = async ({
    hotelId,
    bookingId
}) => {
    const response = await api.get(
        `/bookings/owner/hotels/${hotelId}/bookings/${bookingId}`
    );


    return response.data;


};
