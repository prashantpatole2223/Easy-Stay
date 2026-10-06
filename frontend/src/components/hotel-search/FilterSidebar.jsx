import { useEffect, useState } from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  X
} from "lucide-react";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" }
];

const FilterSidebar = ({
  amenities,
  selectedAmenities,
  setSelectedAmenities,
  sort,
  setSort,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onApply,
  onClear,
  amenitiesLoading
}) => {
  // Local UI state only: mobile drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  const amenityList = Array.isArray(amenities) ? amenities : [];
  const selected = Array.isArray(selectedAmenities)
    ? selectedAmenities
    : [];

  const activeCount =
    selected.length +
    (minPrice !== "" && minPrice != null ? 1 : 0) +
    (maxPrice !== "" && maxPrice != null ? 1 : 0);

  useEffect(() => {
    if (!drawerOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [drawerOpen]);

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities((current) => {
      if (current.includes(amenityId)) {
        return current.filter(
          (id) => id !== amenityId
        );
      }

      return [...current, amenityId];
    });
  };

  // Runs the original onApply, then closes the mobile drawer
  const handleApplyClick = () => {
    onApply();
    setDrawerOpen(false);
  };

  return (
    <div className="lg:sticky lg:top-4 lg:self-start">
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#008cff] bg-white px-4 py-2.5 text-sm font-semibold text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] lg:hidden"
      >
        <SlidersHorizontal size={17} aria-hidden="true" />
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-[#008cff] px-2 py-0.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Filters"
        className={`fixed inset-y-0 left-0 z-50 flex w-4/5 max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-xl lg:border lg:border-[#e7e7e7] lg:shadow-sm`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#e7e7e7] px-5 py-4">
          <div className="flex items-center gap-2 text-[#1a1a1a]">
            <SlidersHorizontal
              size={19}
              className="text-[#008cff]"
              aria-hidden="true"
            />

            <h2 className="text-lg font-semibold">
              Filters
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close filters"
            className="rounded-full p-1.5 text-[#4a4a4a] transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5">
          {/* Sort */}
          <div className="border-b border-[#e7e7e7] py-5">
            <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">
              Sort by
            </h3>

            <div className="space-y-3">
              {sortOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sort === option.value}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
                    className="h-4 w-4 accent-[#008cff]"
                  />

                  {option.label}
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="border-b border-[#e7e7e7] py-5">
            <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">
              Price
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9b9b9b]"
                >
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  aria-label="Minimum price"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(e.target.value)
                  }
                  className="w-full rounded-lg border border-[#e7e7e7] bg-white py-2 pl-7 pr-2 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30"
                />
              </div>

              <div className="relative">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9b9b9b]"
                >
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  aria-label="Maximum price"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(e.target.value)
                  }
                  className="w-full rounded-lg border border-[#e7e7e7] bg-white py-2 pl-7 pr-2 text-sm text-[#1a1a1a] outline-none transition placeholder:text-[#9b9b9b] focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30"
                />
              </div>
            </div>
          </div>

          {/* Hotel amenities */}
          <div className="py-5">
            <h3 className="mb-3 text-sm font-semibold text-[#1a1a1a]">
              Hotel Amenities
            </h3>

            {amenitiesLoading ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-3/4 animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            ) : amenityList.length === 0 ? (
              <p className="text-sm text-[#9b9b9b]">
                No amenities available.
              </p>
            ) : (
              <div className="space-y-3 pr-1 lg:max-h-56 lg:overflow-y-auto">
                {amenityList.map((amenity) => (
                  <label
                    key={amenity._id}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-[#4a4a4a] hover:text-[#1a1a1a]"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(
                        amenity._id
                      )}
                      onChange={() =>
                        handleAmenityChange(
                          amenity._id
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-[#008cff]"
                    />

                    <span>{amenity.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2 border-t border-[#e7e7e7] px-5 py-4">
          <button
            type="button"
            onClick={handleApplyClick}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#53b2fe] to-[#065af3] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-[#008cff] hover:to-[#0548c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff] focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={onClear}
            title="Clear filters"
            aria-label="Clear filters"
            className="flex items-center justify-center rounded-lg border border-[#008cff] bg-white px-3 py-2.5 text-[#008cff] transition hover:bg-[#e6f1fd] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008cff]"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default FilterSidebar; 