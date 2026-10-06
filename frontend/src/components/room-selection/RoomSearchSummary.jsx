import { ArrowRight, CalendarDays, Users } from "lucide-react";

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const RoomSearchSummary = ({
  checkIn,
  checkOut,
  guestCount
}) => {
  return (
    <div className="rounded-xl border border-[#e7e7e7] bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#9b9b9b]">
        Your stay
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
            <CalendarDays size={18} aria-hidden="true" />
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <div>
              <p className="text-xs text-[#9b9b9b]">
                Check-in
              </p>
              <p className="font-semibold">
                {formatDate(checkIn) || "Not available"}
              </p>
            </div>

            <ArrowRight
              size={16}
              className="text-[#9b9b9b]"
              aria-hidden="true"
            />

            <div>
              <p className="text-xs text-[#9b9b9b]">
                Check-out
              </p>
              <p className="font-semibold">
                {formatDate(checkOut) || "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
            <Users size={18} aria-hidden="true" />
          </div>

          <div>
            <p className="text-xs text-[#9b9b9b]">
              Guests
            </p>
            <p className="font-semibold">
              {guestCount}{" "}
              {Number(guestCount) === 1 ? "Guest" : "Guests"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSearchSummary;