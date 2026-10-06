import { useCallback, useEffect, useState } from "react";
import { getMyBookings } from "../services/bookingService";

const useMyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchMyBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");


            const data = await getMyBookings();

            setBookings(data.bookings || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load your bookings."
            );
        } finally {
            setLoading(false);
        }


    }, []);

    useEffect(() => {
        fetchMyBookings();
    }, [fetchMyBookings]);

    return {
        bookings,
        loading,
        error,
        refetch: fetchMyBookings
    };
};

export default useMyBookings;
