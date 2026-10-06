import { useCallback, useEffect, useState } from "react";

import {
  searchHotels,
  getHotelAmenities
} from "../services/hotelService";

const useHotelSearch = () => {
  const [hotels, setHotels] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const [loading, setLoading] = useState(false);
  const [amenitiesLoading, setAmenitiesLoading] =
    useState(false);

  const [error, setError] = useState("");

  const loadAmenities = useCallback(async () => {
    try {
      setAmenitiesLoading(true);

      const data = await getHotelAmenities();

      setAmenities(data.amenities || []);
    } catch (error) {
      console.error(
        "Failed to load hotel amenities:",
        error
      );

      setAmenities([]);
    } finally {
      setAmenitiesLoading(false);
    }
  }, []);

  const search = useCallback(async (params) => {
    try {
      setLoading(true);
      setError("");

      const data = await searchHotels(params);

      setHotels(data.hotels || []);
    } catch (error) {
      console.error(
        "Failed to search hotels:",
        error
      );

      setHotels([]);

      setError(
        error.response?.data?.message ||
          "Failed to search hotels"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAmenities();
  }, [loadAmenities]);

  return {
    hotels,
    amenities,
    loading,
    amenitiesLoading,
    error,
    search
  };
};

export default useHotelSearch;