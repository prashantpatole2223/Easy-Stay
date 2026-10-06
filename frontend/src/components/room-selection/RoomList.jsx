import RoomCard from "./RoomCard";

const RoomList = ({
  rooms,
  selections,
  onQuantityChange,
  onRoomDetails
}) => {
  return (
    <div className="space-y-4">
      {(rooms || []).map((room) => {
        const quantity = selections?.[room._id] || 0;

        return (
          <RoomCard
            key={room._id}
            room={room}
            quantity={quantity}
            onQuantityChange={(newQuantity) =>
              onQuantityChange(room._id, newQuantity)
            }
            onRoomDetails={() =>
              onRoomDetails(room)
            }
          />
        );
      })}
    </div>
  );
};

export default RoomList;