const STATUS_STYLES = {
  held: "bg-[#fdf3e0] text-[#b7791f]",
  pending: "bg-[#fdf3e0] text-[#b7791f]",
  confirmed: "bg-[#e6f4f1] text-[#1a7971]",
  paid: "bg-[#e6f4f1] text-[#1a7971]",
  success: "bg-[#e6f4f1] text-[#1a7971]",
  succeeded: "bg-[#e6f4f1] text-[#1a7971]",
  completed: "bg-[#e6f1fd] text-[#0073d1]",
  refunded: "bg-[#e6f1fd] text-[#0073d1]",
  expired: "bg-gray-100 text-[#4a4a4a]",
  cancelled: "bg-[#fdecea] text-[#d0021b]",
  failed: "bg-[#fdecea] text-[#d0021b]"
};

const StatusBadge = ({ status, className = "" }) => {
  const key = String(status || "").toLowerCase();

  const style =
    STATUS_STYLES[key] || "bg-gray-100 text-[#4a4a4a]";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${style} ${className}`}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-current"
      />
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;