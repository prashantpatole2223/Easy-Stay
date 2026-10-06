import { Mail, Phone, User } from "lucide-react";

const PaymentGuestInfo = ({ guestInfo }) => {
    if (!guestInfo) {
        return (
            <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-[#1a1a1a]">
                    Guest Details
                </h2>

                <p className="mt-3 text-sm text-[#9b9b9b]">
                    Guest information is unavailable.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1a1a1a]">
                Guest Details
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                        <User size={18} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-[#9b9b9b]">
                            Name
                        </p>

                        <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                            {guestInfo.name || "Not available"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                        <Mail size={18} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-[#9b9b9b]">
                            Email
                        </p>

                        <p className="break-all text-sm font-semibold text-[#1a1a1a]">
                            {guestInfo.email || "Not available"}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                        <Phone size={18} aria-hidden="true" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-[#9b9b9b]">
                            Mobile
                        </p>

                        <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                            {guestInfo.phone || "Not available"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentGuestInfo;