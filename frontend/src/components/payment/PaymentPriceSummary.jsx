import {
  Loader2,
  CreditCard,
  Clock,
  ShieldCheck
} from "lucide-react";

const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? priceFormatter.format(number)
    : "Not available";
};

const payButtonClass =
  "flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const PaymentPriceSummary = ({
  booking,
  pricing,
  onPay,
  loading
}) => {
  const baseAmount =
    pricing?.baseAmount ?? booking.baseAmount ?? 0;

  const taxPercentage =
    pricing?.taxPercentage ?? 15;

  const taxAmount =
    pricing?.taxAmount ?? booking.taxAmount ?? 0;

  const totalAmount =
    pricing?.totalAmount ?? booking.totalAmount ?? 0;

  return (
    <>
      <div className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">
          Price Details
        </h2>

        <div className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[#4a4a4a]">
              Room charges
            </span>

            <span className="font-medium text-[#1a1a1a]">
              {formatPrice(baseAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#4a4a4a]">
              Tax ({taxPercentage}%)
            </span>

            <span className="font-medium text-[#1a1a1a]">
              {formatPrice(taxAmount)}
            </span>
          </div>

          <div className="border-t border-[#e7e7e7] pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1a1a1a]">
                Total
              </span>

              <span className="text-2xl font-bold text-[#1a1a1a]">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg bg-[#fdf3e0] p-3">
          <Clock
            size={16}
            className="mt-0.5 shrink-0 text-[#f5a623]"
            aria-hidden="true"
          />

          <p className="text-xs leading-5 text-[#4a4a4a]">
            Your booking is currently held. Payment will confirm your booking.
          </p>
        </div>

        {/* Desktop pay button */}
        <button
          type="button"
          onClick={onPay}
          disabled={loading}
          className={`mt-5 hidden w-full lg:flex ${payButtonClass}`}
        >
          {loading ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard size={17} aria-hidden="true" />
              Pay {formatPrice(totalAmount)}
            </>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#9b9b9b]">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Secure payment</span>
        </div>
      </div>

      {/* Mobile sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#e7e7e7] bg-white p-3 shadow-lg lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[#4a4a4a]">
              Total payable
            </p>

            <p className="text-lg font-bold leading-tight text-[#1a1a1a]">
              {formatPrice(totalAmount)}
            </p>
          </div>

          <button
            type="button"
            onClick={onPay}
            disabled={loading}
            className={`shrink-0 px-6 ${payButtonClass}`}
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                  aria-hidden="true"
                />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={17} aria-hidden="true" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentPriceSummary;