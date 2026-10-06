import {
    CalendarDays,
    ChevronRight,
    IndianRupee,
    User,
    BedDouble
} from "lucide-react";

const formatDate = (date) => {
    if (!date) {
        return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount || 0);
};

const getStatusClasses = (status) => {
    switch (status) {
        case "confirmed":
            return "bg-green-100 text-green-700";


        case "held":
            return "bg-yellow-100 text-yellow-700";

        case "cancelled":
            return "bg-red-100 text-red-700";

        case "completed":
            return "bg-blue-100 text-blue-700";

        default:
            return "bg-gray-100 text-gray-700";


    }
};

const OwnerBookingCard = ({
    booking,
    onClick
}) => {
    return (<button
        type="button"
        onClick={onClick}
        className="w-full text-left bg-white rounded-2xl border border-gray-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    > <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">


            {/* Customer + Booking ID */}
            <div>
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={20} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {booking.customerName || "Guest"}
                        </h3>

                        <p className="text-xs text-gray-500">
                            Booking ID: {booking._id}
                        </p>
                    </div>
                </div>
            </div>

            {/* Status */}
            <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                    booking.status
                )}`}
            >
                {booking.status}
            </span>
        </div>

        {/* Booking Information */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Rooms */}
            <div className="flex items-start gap-3">
                <BedDouble
                    size={19}
                    className="mt-0.5 text-gray-500"
                />

                <div>
                    <p className="text-xs text-gray-500">
                        Rooms
                    </p>

                    <div className="mt-1 space-y-1">
                        {booking.items?.length ? (
                            booking.items.map((item, index) => (
                                <p
                                    key={`${item.roomId}-${index}`}
                                    className="text-sm font-medium text-gray-800"
                                >
                                    {item.roomName} × {item.quantity}
                                </p>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No room information
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Dates */}
            <div className="flex items-start gap-3">
                <CalendarDays
                    size={19}
                    className="mt-0.5 text-gray-500"
                />

                <div>
                    <p className="text-xs text-gray-500">
                        Stay
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                        {formatDate(booking.checkIn)}
                    </p>

                    <p className="text-sm text-gray-500">
                        to {formatDate(booking.checkOut)}
                    </p>
                </div>
            </div>

            {/* Amount */}
            <div className="flex items-start gap-3">
                <IndianRupee
                    size={19}
                    className="mt-0.5 text-gray-500"
                />

                <div>
                    <p className="text-xs text-gray-500">
                        Total Amount
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatAmount(booking.totalAmount)}
                    </p>
                </div>
            </div>
        </div>

        {/* Bottom */}
        <div className="mt-5 flex items-center justify-end border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                View Booking
                <ChevronRight size={17} />
            </span>
        </div>
    </button>


    );
};

export default OwnerBookingCard;