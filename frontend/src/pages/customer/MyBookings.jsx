import { CalendarCheck, Info } from "lucide-react";
import BookingCard from "../../components/bookings/BookingCard";
import useMyBookings from "../../hooks/useMyBookings";

const MyBookings = () => {
    const {
        bookings,
        loading,
        error
    } = useMyBookings();

    const bookingList = Array.isArray(bookings) ? bookings : [];

    return (
        <div className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                            <CalendarCheck
                                size={22}
                                aria-hidden="true"
                            />
                        </div>

                        <h1 className="text-2xl font-bold text-[#1a1a1a]">
                            My Bookings
                        </h1>
                    </div>

                    <p className="mt-2 text-sm text-[#4a4a4a]">
                        View your hotel bookings and booking status.
                    </p>
                </div>

                {loading && (
                    <div
                        className="grid grid-cols-1 gap-5 xl:grid-cols-2"
                        aria-busy="true"
                        aria-label="Loading bookings"
                    >
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="animate-pulse overflow-hidden rounded-xl border border-[#e7e7e7] bg-white"
                            >
                                <div className="flex flex-col sm:flex-row">
                                    <div className="aspect-[4/3] w-full bg-gray-200 sm:aspect-auto sm:min-h-48 sm:w-56" />

                                    <div className="flex-1 space-y-4 p-5">
                                        <div className="h-5 w-48 rounded bg-gray-200" />
                                        <div className="h-4 w-64 max-w-full rounded bg-gray-200" />
                                        <div className="h-4 w-full max-w-md rounded bg-gray-200" />
                                        <div className="h-10 w-full rounded-lg bg-gray-200" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div
                        role="alert"
                        className="flex items-start justify-center gap-3 rounded-xl border border-[#d0021b]/30 bg-[#fdecea] p-5"
                    >
                        <Info
                            size={18}
                            className="mt-0.5 shrink-0 text-[#d0021b]"
                            aria-hidden="true"
                        />

                        <p className="text-sm text-[#d0021b]">
                            {error}
                        </p>
                    </div>
                )}

                {!loading &&
                    !error &&
                    bookingList.length === 0 && (
                        <div className="rounded-xl border border-[#e7e7e7] bg-white px-6 py-14 text-center shadow-sm">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#9b9b9b]">
                                <CalendarCheck
                                    size={28}
                                    aria-hidden="true"
                                />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
                                No bookings yet
                            </h2>

                            <p className="mt-2 text-sm text-[#4a4a4a]">
                                Your hotel bookings will appear here.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    bookingList.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                            {bookingList.map((booking) => (
                                <BookingCard
                                    key={booking._id}
                                    booking={booking}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </div>
    );
};

export default MyBookings;