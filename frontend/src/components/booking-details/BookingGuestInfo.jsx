import { Mail, Phone, User } from "lucide-react";

const labelClass =
  "mb-1.5 block text-xs font-semibold text-[#4a4a4a]";

const inputClass =
  "w-full rounded-lg border border-[#e7e7e7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30 disabled:cursor-not-allowed disabled:bg-[#f2f2f2] disabled:text-[#9b9b9b]";

const BookingGuestInfo = ({
  guestInfo,
  onChange,
  loading
}) => {
  return (
    <div
      className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm"
      aria-busy={loading ? "true" : "false"}
    >
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Guest Information
      </h2>

      <p className="mt-1 text-sm text-[#4a4a4a]">
        These details will be used for this booking. You can change them if needed.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="guest-name" className={labelClass}>
            Name
          </label>

          <div className="relative">
            <User
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="guest-name"
              type="text"
              autoComplete="name"
              value={guestInfo?.name ?? ""}
              onChange={(event) =>
                onChange("name", event.target.value)
              }
              disabled={loading}
              placeholder="Guest name"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="guest-email" className={labelClass}>
            Email
          </label>

          <div className="relative">
            <Mail
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="guest-email"
              type="email"
              autoComplete="email"
              value={guestInfo?.email ?? ""}
              onChange={(event) =>
                onChange("email", event.target.value)
              }
              disabled={loading}
              placeholder="Guest email"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="guest-phone" className={labelClass}>
            Phone
          </label>

          <div className="relative">
            <Phone
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="guest-phone"
              type="tel"
              autoComplete="tel"
              value={guestInfo?.phone ?? ""}
              onChange={(event) =>
                onChange("phone", event.target.value)
              }
              disabled={loading}
              placeholder="Guest phone"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingGuestInfo;