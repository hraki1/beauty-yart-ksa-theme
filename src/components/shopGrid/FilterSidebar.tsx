"use client";

import PriceRangeSlider from "./PriceRangeSlider";
import FilterSection from "./FilterSection";
import { Category } from "@/lib/models/categoryModal";
import { Brand } from "@/models/frontEndBrand";
import { useTranslations } from "next-intl";

export type PriceRange = [number, number];

interface FilterSidebarProps {
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;

  organizedCategories: {
    allParent: Category[];
    allWithSub: Category[];
  } | null;
  selectedCategoriesIds: number[];
  toggleCategoryId: (id: number) => void;

  organizedBrands: Brand[];
  selectedBrandIds: number[];
  toggleBrandId: (id: number) => void;

  selectedColors?: string[];
  toggleColor?: (color: string) => void;

  resetFilters: () => void;
  MAX_PRICE: number;
}

const FilterSidebar = ({
  priceRange,
  setPriceRange,
  organizedCategories,
  selectedCategoriesIds,
  toggleCategoryId,
  organizedBrands,
  selectedBrandIds,
  toggleBrandId,
  selectedColors = [],
  toggleColor,
  resetFilters,
  MAX_PRICE,
}: FilterSidebarProps) => {
  const t = useTranslations("shopGrid.FilterSidebar");

  const COLORS = [
    { id: 1, name: "Black", value: "#000000" },
    { id: 2, name: "Blue", value: "#3B82F6" },
    { id: 3, name: "Green", value: "#10B981" },
    { id: 4, name: "Pink", value: "#EC4899" },
    { id: 5, name: "Red", value: "#EF4444" },
    { id: 6, name: "Yellow", value: "#FACC15" },
  ];



  return (
    <div className="hidden md:block w-full flex-shrink-0 ml-6 mr-6">
      <div className="bg-white border border-gray-200 sticky top-4">
        <div className="p-6">
          {/* Categories */}
          {organizedCategories?.allParent?.length ? (
            <FilterSection
              title={t("Categories")}
              items={organizedCategories.allParent}
              selectedIds={selectedCategoriesIds}
              toggleId={toggleCategoryId}
              getItemName={(item) => item.description?.name || "Unnamed"}
            />
          ) : null}

          {/* Price Range */}
          <div className="mb-8">
            <h4
              className="font-normal text-sm text-black mb-4 uppercase tracking-wide"
              style={{ fontFamily: "Europa, sans-serif" }}
            >
              {t("Price")}
            </h4>
            <div className="border-t border-gray-200 pt-4">
              <PriceRangeSlider
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                MAX_PRICE={MAX_PRICE}
              />
              <div className="flex justify-between items-center mt-3">
                <span
                  className="text-sm text-black"
                  style={{ fontFamily: "Europa, sans-serif" }}
                >
                  Range:
                </span>
                <span
                  className="text-sm text-black font-medium"
                  style={{ fontFamily: "Europa, sans-serif" }}
                >
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
            </div>
          </div>

          {/* Colors */}
          <FilterSection
            title={t("Colors")}
            items={COLORS}
            selectedIds={selectedColors.map(
              (color) => COLORS.find((c) => c.name === color)?.id || 0
            )}
            toggleId={(id) => {
              const color = COLORS.find((c) => c.id === id)?.name;
              if (color && toggleColor) toggleColor(color);
            }}
            getItemName={(item) => item.name}
            isColorSection
            getColorValue={(item) => item.value}
          />

          {/* Brands */}
          {organizedBrands?.length > 0 && (
            <div className="mb-8">
              <h4
                className="font-normal text-sm text-black mb-4 uppercase tracking-wide"
                style={{ fontFamily: "Europa, sans-serif" }}
              >
                {t("Brands")}
              </h4>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-3">
                  {organizedBrands.slice(0, 6).map((brand) => (
                    <div
                      key={brand.id}
                      onClick={() => toggleBrandId(brand.id)}
                      className={`border rounded-lg p-3 cursor-pointer transition-all text-center ${
                        selectedBrandIds.includes(brand.id)
                          ? "border-[#a07542] bg-[#a07542] bg-opacity-10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="text-xs font-medium text-black"
                        style={{ fontFamily: "Europa, sans-serif" }}
                      >
                        {brand.name}
                      </div>
                    </div>
                  ))}
                </div>

                {organizedBrands.length > 6 && (
                  <button
                    className="text-xs text-[#a07542] hover:text-[#8a6439] mt-3 transition-colors"
                    style={{ fontFamily: "Europa, sans-serif" }}
                  >
                    Show All Brands
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="w-full py-2 text-sm text-[#a07542] hover:text-[#8a6439] transition-colors"
              style={{ fontFamily: "Europa, sans-serif" }}
            >
              {t("ResetAll")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
