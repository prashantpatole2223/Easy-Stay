import { Building2, Info } from "lucide-react";

import HotelCard from "./HotelCard";

const HotelCardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-[#e7e7e7] bg-white shadow-sm">
    <div className="flex animate-pulse flex-col md:flex-row">
      <div className="aspect-[4/3] w-full bg-gray-200 md:aspect-auto md:min-h-52 md:w-72 lg:w-80" />

      <div className="flex-1 space-y-3 p-5">
        <div className="h-5 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>

      <div className="space-y-3 border-t border-[#e7e7e7] p-5 md:w-52 md:border-l md:border-t-0">
        <div className="h-3 w-20 rounded bg-gray-200 md:ml-auto" />
        <div className="h-6 w-28 rounded bg-gray-200 md:ml-auto" />
        <div className="h-10 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  </div>
);

const HotelList = ({
  hotels,
  loading,
  error,
  searchData
}) => {
  if (loading) {
    return (
      <div
        className="space-y-4"
        aria-busy="true"
        aria-label="Searching hotels"
      >
        {[0, 1, 2].map((i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center rounded-xl border border-[#d0021b]/30 bg-[#fdecea] p-6 text-center"
      >
        <Info
          size={28}
          className="text-[#d0021b]"
          aria-hidden="true"
        />

        <p className="mt-2 text-sm font-medium text-[#d0021b]">
          {error}
        </p>
      </div>
    );
  }

  if (!hotels?.length) {
    return (
      <div className="rounded-xl border border-[#e7e7e7] bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-[#9b9b9b]">
          <Building2 size={26} aria-hidden="true" />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
          No hotels found
        </h3>

        <p className="mt-2 text-sm text-[#4a4a4a]">
          Try changing your dates, guest count, or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel._id}
          hotel={hotel}
          searchData={searchData}
        />
      ))}
    </div>
  );
};

export default HotelList;