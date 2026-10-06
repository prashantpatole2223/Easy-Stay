import { useCallback, useEffect, useState } from "react";

import {
  getHotelDetails
} from "../services/hotelService";

const useHotelDetails = (hotelId) => {
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHotelDetails = useCallback(async () => {
    if (!hotelId) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getHotelDetails(hotelId);

      setHotel(data.hotel || null);
    } catch (error) {
      console.error(
        "Failed to load hotel details:",
        error
      );

      setHotel(null);

      setError(
        error.response?.data?.message ||
          "Failed to load hotel details."
      );
    } finally {
      setLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    loadHotelDetails();
  }, [loadHotelDetails]);

  return {
    hotel,
    loading,
    error,
    reload: loadHotelDetails
  };
};

export default useHotelDetails;