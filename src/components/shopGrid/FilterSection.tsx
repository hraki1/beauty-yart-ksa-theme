import { motion } from "framer-motion";
import { useState } from "react";

interface FilterSectionProps<T> {
  title: string;
  items: T[];
  selectedIds: number[];
  toggleId: (id: number) => void;
  getItemName: (item: T) => string;
  getItemCount?: (item: T) => number;
  showAllInitially?: boolean;
  isColorSection?: boolean;
  getColorValue?: (item: T) => string;
}

const FilterSection = <T extends { id: number }>({
  title,
  items,
  selectedIds,
  toggleId,
  getItemName,
  getItemCount,
  showAllInitially = false,
  isColorSection = false,
  getColorValue,
}: FilterSectionProps<T>) => {
  const [showAll, setShowAll] = useState(showAllInitially);

  return (
    <div className="mb-8">
      <h4 className="font-normal text-sm text-black mb-4 uppercase tracking-wide">
        {title}
      </h4>

      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-3">
          {items.slice(0, showAll ? items.length : 5).map((item) => (
            <motion.label
              key={item.id}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-between group cursor-pointer py-1"
            >
              <div className="flex items-center gap-3">
                {isColorSection && getColorValue ? (
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedIds.includes(item.id)
                          ? "border-[#a07542] ring-2 ring-[#a07542] ring-opacity-30"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: getColorValue(item) }}
                    />
                    <span
                      className={`text-sm ${
                        selectedIds.includes(item.id)
                          ? "text-[#a07542] font-medium"
                          : "text-black"
                      } transition-colors`}
                      style={{ fontFamily: "Europa, sans-serif" }}
                    >
                      {getItemName(item)}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleId(item.id)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-4 h-4 rounded border transition-all ${
                          selectedIds.includes(item.id)
                            ? "bg-[#a07542] border-[#a07542]"
                            : "border-gray-300 bg-white hover:border-gray-400"
                        }`}
                      >
                        {selectedIds.includes(item.id) && (
                          <svg
                            className="w-3 h-3 text-white absolute top-0.5 left-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm ${
                        selectedIds.includes(item.id)
                          ? "text-[#a07542] font-medium"
                          : "text-black"
                      } transition-colors`}
                      style={{ fontFamily: "Europa, sans-serif" }}
                    >
                      {getItemName(item)}
                    </span>
                  </>
                )}
              </div>
              
              {getItemCount && (
                <span
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "Europa, sans-serif" }}
                >
                  {getItemCount(item)}
                </span>
              )}
            </motion.label>
          ))}
        </div>

        {items.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-[#a07542] hover:text-[#8a6439] mt-3 transition-colors"
            style={{ fontFamily: "Europa, sans-serif" }}
          >
            {showAll ? "Show Less" : "Show All"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterSection;