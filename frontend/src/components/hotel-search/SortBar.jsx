import { ChevronDown } from "lucide-react";

const SortBar = ({ sort, setSort }) => {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-[#1a1a1a]">
        Hotels
      </h2>

      <div className="flex items-center gap-2">
        <label
          htmlFor="sort-select"
          className="text-sm text-[#4a4a4a]"
        >
          Sort by
        </label>

        <div className="relative">
          <select
            id="sort-select"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value)
            }
            className="h-10 appearance-none rounded-lg border border-[#e7e7e7] bg-white pl-3 pr-9 text-sm text-[#1a1a1a] outline-none transition focus:border-[#008cff] focus:ring-2 focus:ring-[#008cff]/30"
          >
            <option value="recommended">
              Recommended
            </option>

            <option value="price_asc">
              Price: Low to High
            </option>

            <option value="price_desc">
              Price: High to Low
            </option>
          </select>

          <ChevronDown
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9b9b9b]"
          />
        </div>
      </div>
    </div>
  );
};

export default SortBar;