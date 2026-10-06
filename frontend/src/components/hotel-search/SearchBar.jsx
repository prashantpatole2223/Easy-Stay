import {
  CalendarDays,
  MapPin,
  Search,
  Users
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CITIES = [
  "Agra",
  "Ahmedabad",
  "Amritsar",
  "Bengaluru",
  "Bhopal",
  "Bhubaneswar",
  "Chandigarh",
  "Chennai",
  "Coimbatore",
  "Dehradun",
  "Delhi",
  "Goa",
  "Gurugram",
  "Guwahati",
  "Hyderabad",
  "Indore",
  "Jaipur",
  "Jaisalmer",
  "Jammu",
  "Jodhpur",
  "Kochi",
  "Kolkata",
  "Lucknow",
  "Manali",
  "Mumbai",
  "Mysuru",
  "Nagpur",
  "Nashik",
  "Noida",
  "Ooty",
  "Panchgani",
  "Pune",
  "Rishikesh",
  "Shimla",
  "Srinagar",
  "Surat",
  "Udaipur",
  "Vadodara",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam"
];

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

const labelClass =
  "mb-1 block text-xs font-semibold uppercase tracking-wide text-[#9b9b9b]";

const inputClass =
  "w-full rounded-lg border border-[#e7e7e7] bg-white py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30";

const SearchBar = ({ onSearch }) => {
  const today = getLocalDateString(new Date());
  const tomorrow = getTomorrowDateString();

  const [city, setCity] = useState("Manali");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guestCount, setGuestCount] = useState(1);

  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const cityContainerRef = useRef(null);

  const filteredCities = city.trim()
    ? CITIES.filter((item) =>
      item
        .toLowerCase()
        .includes(city.trim().toLowerCase())
    ).slice(0, 6)
    : [];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        cityContainerRef.current &&
        !cityContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setShowSuggestions(true);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setShowSuggestions(false);
  };

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;

    setCheckIn(newCheckIn);

    if (!newCheckIn) {
      setCheckOut("");
      return;
    }

    const checkInDate = new Date(
      `${newCheckIn}T00:00:00`
    );

    const minimumCheckOut = new Date(checkInDate);

    minimumCheckOut.setDate(
      minimumCheckOut.getDate() + 1
    );

    const minimumCheckOutString =
      getLocalDateString(minimumCheckOut);

    if (!checkOut || checkOut <= newCheckIn) {
      setCheckOut(minimumCheckOutString);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      return;
    }

    onSearch({
      city: trimmedCity,
      checkIn,
      checkOut,
      guestCount: Number(guestCount)
    });

    setShowSuggestions(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-[#e7e7e7] bg-white p-4 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* City */}
        <div
          ref={cityContainerRef}
          className="relative"
        >
          <label htmlFor="hs-city" className={labelClass}>
            City
          </label>

          <div className="relative">
            <MapPin
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="hs-city"
              type="text"
              value={city}
              onChange={handleCityChange}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Enter city"
              required
              autoComplete="off"
              className={inputClass}
            />
          </div>

          {showSuggestions &&
            city.trim() &&
            filteredCities.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[#e7e7e7] bg-white shadow-lg">
                {filteredCities.map(
                  (suggestedCity) => (
                    <button
                      key={suggestedCity}
                      type="button"
                      onMouseDown={(e) =>
                        e.preventDefault()
                      }
                      onClick={() =>
                        handleCitySelect(
                          suggestedCity
                        )
                      }
                      className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#1a1a1a] transition hover:bg-[#e6f1fd] focus-visible:bg-[#e6f1fd] focus-visible:outline-none"
                    >
                      <MapPin
                        size={17}
                        aria-hidden="true"
                        className="shrink-0 text-[#9b9b9b]"
                      />

                      <span>
                        {suggestedCity}
                      </span>
                    </button>
                  )
                )}
              </div>
            )}
        </div>

        {/* Check-in */}
        <div>
          <label htmlFor="hs-checkin" className={labelClass}>
            Check-in
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="hs-checkin"
              type="date"
              value={checkIn}
              min={today}
              onChange={handleCheckInChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label htmlFor="hs-checkout" className={labelClass}>
            Check-out
          </label>

          <div className="relative">
            <CalendarDays
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="hs-checkout"
              type="date"
              value={checkOut}
              min={
                checkIn
                  ? (() => {
                    const date = new Date(
                      `${checkIn}T00:00:00`
                    );

                    date.setDate(
                      date.getDate() + 1
                    );

                    return getLocalDateString(date);
                  })()
                  : tomorrow
              }
              onChange={(e) =>
                setCheckOut(e.target.value)
              }
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Guests */}
        <div>
          <label htmlFor="hs-guests" className={labelClass}>
            Guests
          </label>

          <div className="relative">
            <Users
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff]"
            />

            <input
              id="hs-guests"
              type="number"
              min="1"
              value={guestCount}
              onChange={(e) =>
                setGuestCount(e.target.value)
              }
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Search */}
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            <Search size={18} aria-hidden="true" />
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;