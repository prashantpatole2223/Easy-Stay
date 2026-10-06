import { useEffect, useState } from "react";
import { CalendarDays, Search, Users } from "lucide-react";

import SearchBar from "../components/hotel-search/SearchBar";
import FilterSidebar from "../components/hotel-search/FilterSidebar";
import HotelList from "../components/hotel-search/HotelList";

import useHotelSearch from "../hooks/useHotelSearch";

const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTomorrowDateString = () => {
  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  return getLocalDateString(tomorrow);
};

// Display-only formatter, e.g. "12 Oct 2026"
const formatDisplayDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const HotelSearch = () => {
  const {
    hotels,
    amenities,
    loading,
    amenitiesLoading,
    error,
    search
  } = useHotelSearch();

  const [searchData, setSearchData] =
    useState(null);

  const [selectedAmenities, setSelectedAmenities] =
    useState([]);

  const [sort, setSort] =
    useState("recommended");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");

  useEffect(() => {
    const today = getLocalDateString(new Date());
    const tomorrow = getTomorrowDateString();

    const defaultSearch = {
      city: "Manali",
      checkIn: today,
      checkOut: tomorrow,
      guestCount: 1
    };

    setSearchData(defaultSearch);

    search({
      ...defaultSearch,
      amenities: [],
      minPrice: "",
      maxPrice: "",
      sort: "recommended"
    });
  }, [search]);

  const handleSearch = async (data) => {
    setSearchData(data);

    await search({
      ...data,
      amenities: selectedAmenities,
      minPrice,
      maxPrice,
      sort
    });
  };

  const handleApplyFilters = async () => {
    if (!searchData) {
      return;
    }

    await search({
      ...searchData,
      amenities: selectedAmenities,
      minPrice,
      maxPrice,
      sort
    });
  };

  const handleClearFilters = async () => {
    setSelectedAmenities([]);
    setSort("recommended");
    setMinPrice("");
    setMaxPrice("");

    if (!searchData) {
      return;
    }

    await search({
      ...searchData,
      amenities: [],
      minPrice: undefined,
      maxPrice: undefined,
      sort: "recommended"
    });
  };

  const hotelCount = hotels?.length ?? 0;

  const stayDates = searchData
    ? [
        formatDisplayDate(searchData.checkIn),
        formatDisplayDate(searchData.checkOut)
      ]
        .filter(Boolean)
        .join(" - ")
    : "";

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1a1a1a]">
      {/* Compact search strip */}
      <div className="bg-gradient-to-b from-[#53b2fe] to-[#065af3] py-5">
        <div className="mx-auto max-w-7xl px-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            amenities={amenities}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
            sort={sort}
            setSort={setSort}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
            amenitiesLoading={amenitiesLoading}
          />

          <main className="min-w-0">
            {searchData && (
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-[#1a1a1a]">
                  Hotels in {searchData.city}
                </h1>

                <p className="mt-1 text-sm text-[#4a4a4a]">
                  {loading
                    ? "Searching hotels..."
                    : `${hotelCount} hotel${
                        hotelCount !== 1 ? "s" : ""
                      } found`}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9b9b9b]">
                  {stayDates && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} aria-hidden="true" />
                      {stayDates}
                    </span>
                  )}

                  {searchData.guestCount ? (
                    <span className="flex items-center gap-1.5">
                      <Users size={14} aria-hidden="true" />
                      {searchData.guestCount}{" "}
                      {Number(searchData.guestCount) === 1
                        ? "guest"
                        : "guests"}
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            {!searchData ? (
              <div className="rounded-xl border border-[#e7e7e7] bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                  <Search size={26} aria-hidden="true" />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-[#1a1a1a]">
                  Find your stay
                </h2>

                <p className="mt-2 text-sm text-[#4a4a4a]">
                  Enter your destination, dates,
                  and number of guests to find
                  available hotels.
                </p>
              </div>
            ) : (
              <HotelList
                hotels={hotels}
                loading={loading}
                error={error}
                searchData={searchData}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;