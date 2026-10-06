import { useCallback, useEffect, useState } from "react";
import { getOwnerBookingDetails } from "../services/ownerBookingService";

const useOwnerBookingDetails = ({
    hotelId,
    bookingId
}) => {
    const [booking, setBooking] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [payment, setPayment] = useState(null);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBookingDetails = useCallback(async () => {
        if (!hotelId || !bookingId) {
            setBooking(null);
            setHotel(null);
            setPayment(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getOwnerBookingDetails({
                hotelId,
                bookingId
            });

            setBooking(data.booking || null);
            setHotel(data.hotel || null);
            setPayment(data.payment || null);
        } catch (error) {
            setBooking(null);
            setHotel(null);
            setPayment(null);

            setError(
                error.response?.data?.message ||
                "Failed to fetch booking details."
            );
        } finally {
            setLoading(false);
        }
    }, [hotelId, bookingId]);

    useEffect(() => {
        fetchBookingDetails();
    }, [fetchBookingDetails]);

    return {
        booking,
        hotel,
        payment,
        loading,
        error,
        reload: fetchBookingDetails
    };


};

export default useOwnerBookingDetails;