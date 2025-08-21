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
  toggleColor: (color: string) => void;

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
    <div className="hidden md:block w-64 flex-shrink-0">
      <div className="bg-white p-6 rounded-xl shadow-sm sticky top-4 border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">{t("Filters")}</h3>
          <button
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            {t("ResetAll")}
          </button>
        </div>

        {/* 1- Price */}
        <PriceRangeSlider
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          MAX_PRICE={MAX_PRICE}
        />

        {/* 2- Categories */}
        {organizedCategories?.allParent?.length ? (
          <FilterSection
            title={t("Categories")}
            items={organizedCategories.allParent}
            selectedIds={selectedCategoriesIds}
            toggleId={toggleCategoryId}
            getItemName={(item) => item.description?.name || "Unnamed"}
          />
        ) : null}

        {/* 3- Colors */}
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
        />

        {/* 4- Brands */}
        {organizedBrands?.length > 0 && (
          <FilterSection
            title={t("Brands")}
            items={organizedBrands}
            selectedIds={selectedBrandIds}
            toggleId={toggleBrandId}
            getItemName={(item) => item.name}
          />
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
