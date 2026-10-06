import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BedDouble, Info } from "lucide-react";

import useAvailableRooms from "../../hooks/useAvailableRooms";

import RoomSearchSummary from "../../components/room-selection/RoomSearchSummary";
import RoomList from "../../components/room-selection/RoomList";
import BookingSummary from "../../components/room-selection/BookingSummary";
import RoomDetailsModal from "../../components/room-selection/RoomDetailsModal";

const RoomSelection = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guestCount = searchParams.get("guestCount");

  const [selections, setSelections] = useState({});
  const [selectedRoom, setSelectedRoom] = useState(null);

  const {
    rooms,
    loading,
    error
  } = useAvailableRooms({
    hotelId,
    checkIn,
    checkOut
  });

  const handleQuantityChange = (roomId, quantity) => {
    setSelections((previous) => {
      const updated = { ...previous };

      if (quantity <= 0) {
        delete updated[roomId];
      } else {
        updated[roomId] = quantity;
      }

      return updated;
    });
  };

  const handleRoomDetails = (room) => {
    setSelectedRoom(room);
  };

  const handleCloseRoomDetails = () => {
    setSelectedRoom(null);
  };

  const handleSelectRoom = (room) => {
    const roomId = room._id;

    setSelections((previous) => {
      const currentQuantity = previous[roomId] || 0;

      if (currentQuantity >= room.availableRooms) {
        return previous;
      }

      return {
        ...previous,
        [roomId]: currentQuantity + 1
      };
    });

    setSelectedRoom(null);
  };

  const handleContinue = (selectedRooms) => {
    navigate("/booking-details", {
      state: {
        hotelId,
        checkIn,
        checkOut,
        guestCount,
        selectedRooms
      }
    });
  };

  if (!checkIn || !checkOut || !guestCount) {
    return (
      <div className="min-h-screen bg-[#f2f2f2]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-xl border border-[#e7e7e7] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fdf3e0] text-[#f5a623]">
              <Info size={26} aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
              Search information is missing
            </h2>

            <p className="mt-2 text-sm text-[#4a4a4a]">
              Please search for a hotel again with your dates and
              guest count.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2]">
        <div
          className="mx-auto max-w-7xl px-4 py-6"
          aria-busy="true"
          aria-label="Loading available rooms"
        >
          <div className="h-20 animate-pulse rounded-xl bg-gray-200" />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm"
                >
                  <div className="flex animate-pulse flex-col md:flex-row">
                    <div className="aspect-[4/3] w-full bg-gray-200 md:aspect-auto md:min-h-52 md:w-72" />

                    <div className="flex-1 space-y-3 p-5">
                      <div className="h-5 w-1/2 rounded bg-gray-200" />
                      <div className="h-4 w-1/3 rounded bg-gray-200" />
                      <div className="h-4 w-full rounded bg-gray-200" />
                      <div className="h-10 w-40 rounded-lg bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden h-72 animate-pulse rounded-xl bg-gray-200 lg:block" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f2f2]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div
            role="alert"
            className="rounded-xl border border-[#d0021b]/30 bg-[#fdecea] p-8 text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#d0021b]">
              <Info size={26} aria-hidden="true" />
            </div>

            <h2 className="mt-4 font-semibold text-[#d0021b]">
              Unable to load rooms
            </h2>

            <p className="mt-2 text-sm text-[#d0021b]">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!rooms?.length) {
    return (
      <div className="min-h-screen bg-[#f2f2f2]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="rounded-xl border border-[#e7e7e7] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#9b9b9b]">
              <BedDouble size={26} aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
              No rooms available
            </h2>

            <p className="mt-2 text-sm text-[#4a4a4a]">
              There are no available rooms for the selected dates.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-32 text-[#1a1a1a] lg:pb-8">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <RoomSearchSummary
          checkIn={checkIn}
          checkOut={checkOut}
          guestCount={guestCount}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            <h1 className="mb-4 text-2xl font-bold text-[#1a1a1a]">
              Select your room
            </h1>

            <RoomList
              rooms={rooms}
              selections={selections}
              onQuantityChange={handleQuantityChange}
              onRoomDetails={handleRoomDetails}
            />
          </div>

          <BookingSummary
            rooms={rooms}
            selections={selections}
            guestCount={guestCount}
            checkIn={checkIn}
            checkOut={checkOut}
            onContinue={handleContinue}
          />
        </div>
      </div>

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          onClose={handleCloseRoomDetails}
          onSelectRoom={handleSelectRoom}
        />
      )}
    </div>
  );
};

export default RoomSelection;