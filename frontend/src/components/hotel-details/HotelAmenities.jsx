import {
  BedDouble,
  Car,
  Check,
  Coffee,
  Dumbbell,
  Snowflake,
  Sparkles,
  Tv,
  Utensils,
  Waves,
  Wifi
} from "lucide-react";

// Presentational only: picks an icon from the amenity name
const getAmenityIcon = (name = "") => {
  const value = String(name).toLowerCase();

  if (value.includes("wifi") || value.includes("wi-fi") || value.includes("internet")) {
    return Wifi;
  }

  if (
    value.includes("restaurant") ||
    value.includes("food") ||
    value.includes("dining") ||
    value.includes("breakfast") ||
    value.includes("meal") ||
    value.includes("kitchen")
  ) {
    return Utensils;
  }

  if (value.includes("parking") || value.includes("car") || value.includes("transport")) {
    return Car;
  }

  if (value.includes("pool") || value.includes("swim")) {
    return Waves;
  }

  if (value.includes("gym") || value.includes("fitness")) {
    return Dumbbell;
  }

  if (value.includes("spa") || value.includes("wellness") || value.includes("massage")) {
    return Sparkles;
  }

  if (value.includes("tv") || value.includes("television") || value.includes("entertain")) {
    return Tv;
  }

  if (value.includes("air") || value.includes("ac") || value.includes("heating")) {
    return Snowflake;
  }

  if (value.includes("coffee") || value.includes("tea") || value.includes("bar")) {
    return Coffee;
  }

  if (value.includes("room") || value.includes("bed")) {
    return BedDouble;
  }

  return Check;
};

const HotelAmenities = ({ amenities = [] }) => {
  const list = Array.isArray(amenities) ? amenities : [];

  if (!list.length) {
    return null;
  }

  return (
    <section className="rounded-xl border border-[#e7e7e7] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Amenities
      </h2>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {list.map((item, index) => {
          const amenity = item?.amenityId;

          if (!amenity) {
            return null;
          }

          const Icon = getAmenityIcon(amenity.name);

          return (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-[#e7e7e7] p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e6f1fd] text-[#008cff]">
                <Icon size={18} aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[#1a1a1a]">
                  {amenity.name}
                </h3>

                {item.subAmenities?.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {item.subAmenities.map(
                      (subAmenity, subIndex) => (
                        <li
                          key={subIndex}
                          className="flex items-center gap-1.5 text-xs text-[#4a4a4a]"
                        >
                          <Check
                            size={12}
                            className="shrink-0 text-[#1a7971]"
                            aria-hidden="true"
                          />
                          {subAmenity}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HotelAmenities;