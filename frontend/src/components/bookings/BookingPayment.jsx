import { CreditCard } from "lucide-react";

import StatusBadge from "./StatusBadge";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }
  ).format(amount || 0);
};

const BookingPayment = ({
  payment
}) => {
  if (!payment) {
    return (
      <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">
          Payment
        </h2>

        <p className="mt-3 text-sm text-[#9b9b9b]">
          No payment information available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#1a1a1a]">
          <CreditCard
            size={18}
            className="text-[#008cff]"
            aria-hidden="true"
          />
          Payment
        </h2>

        <StatusBadge status={payment.status} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <p className="text-xs text-[#9b9b9b]">
            Amount
          </p>

          <p className="mt-1 text-2xl font-bold text-[#1a1a1a]">
            {formatCurrency(
              payment.amount
            )}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#9b9b9b]">
            Provider
          </p>

          <p className="mt-1 text-sm font-medium capitalize text-[#1a1a1a]">
            {payment.provider || "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-[#9b9b9b]">
            Method
          </p>

          <p className="mt-1 text-sm font-medium capitalize text-[#1a1a1a]">
            {payment.method || "-"}
          </p>
        </div>

        {payment.refundedAmount > 0 && (
          <div className="col-span-2 rounded-lg bg-[#e6f1fd] p-3">
            <p className="text-xs text-[#4a4a4a]">
              Refunded Amount
            </p>

            <p className="mt-1 text-base font-bold text-[#0073d1]">
              {formatCurrency(
                payment.refundedAmount
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BookingPayment;