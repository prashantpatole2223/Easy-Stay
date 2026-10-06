import OwnerBookingCard from "./OwnerBookingCard";

const OwnerBookingList = ({
    bookings,
    onBookingClick
}) => {
    if (!bookings.length) {
        return (<div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"> <h3 className="text-lg font-semibold text-gray-900">
            No bookings found </h3>


            <p className="mt-2 text-sm text-gray-500">
                There are no bookings for this hotel yet.
            </p>
        </div>
        );


    }

    return (<div className="space-y-4">
        {bookings.map((booking) => (
            <OwnerBookingCard
                key={booking._id}
                booking={booking}
                onClick={() => onBookingClick(booking)}
            />
        ))} </div>
    );
};

export default OwnerBookingList;