import { useCallback, useEffect, useState } from "react";
import { getAvailableRooms } from "../services/roomService";

const useAvailableRooms = ({ hotelId, checkIn, checkOut }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRooms = useCallback(async () => {
    if (!hotelId || !checkIn || !checkOut) {
      setRooms([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAvailableRooms({
        hotelId,
        checkIn,
        checkOut
      });

      setRooms(data.rooms || []);
    } catch (error) {
      console.error("Failed to load available rooms:", error);

      setRooms([]);
      setError(
        error.response?.data?.message ||
          "Failed to load available rooms."
      );
    } finally {
      setLoading(false);
    }
  }, [hotelId, checkIn, checkOut]);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  return {
    rooms,
    loading,
    error,
    reload: loadRooms
  };
};

export default useAvailableRooms;
