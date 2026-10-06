import { useCallback, useEffect, useState } from "react";
import { getOwnerHotelBookings } from "../services/ownerBookingService";

const useOwnerHotelBookings = ({
    hotelId,
    status = ""
}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchBookings = useCallback(async () => {
        if (!hotelId) {
            setBookings([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getOwnerHotelBookings({
                hotelId,
                status
            });

            setBookings(data.bookings || []);
        } catch (error) {
            setBookings([]);

            setError(
                error.response?.data?.message ||
                "Failed to fetch hotel bookings."
            );
        } finally {
            setLoading(false);
        }
    }, [hotelId, status]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return {
        bookings,
        loading,
        error,
        reload: fetchBookings
    };


};

export default useOwnerHotelBookings;
