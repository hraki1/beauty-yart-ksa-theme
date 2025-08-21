"use client";

import { FiFilter, FiSearch } from "react-icons/fi";
import { useState } from "react";

interface ToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  setShowFilters: (show: boolean) => void;
}

const Toolbar = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  setShowFilters,
}: ToolbarProps) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: "default", label: "Default Sorting" },
    { value: "price-low", label: "Sort By Price: Low To High" },
    { value: "price-high", label: "Sort By Price: High To Low" },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortOption);
    return option ? option.label : "Default Sorting";
  };

  return (
    <div className="mb-8 space-y-6 m-7">
      {/* Toolbar Controls */}
      <div className="flex justify-between items-center">
        {/* Left side - Search Bar */}
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" size={16} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 focus:ring-1 focus:ring-[#a07542] focus:border-[#a07542] shadow-sm text-sm"
            style={{ fontFamily: "Europa, sans-serif", borderRadius: '2px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Right side - Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center justify-between min-w-[180px] px-4 py-2 bg-white border border-gray-300 text-sm transition-all hover:border-gray-400"
            style={{ fontFamily: "Europa, sans-serif", borderRadius: '2px' }}
          >
            <span className="text-gray-600">{getCurrentSortLabel()}</span>
            <svg
              className={`w-4 h-4 text-gray-500 ml-2 transition-transform ${
                showSortDropdown ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showSortDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSortDropdown(false)}
              />
              <div 
                className="absolute right-0 mt-1 w-60 bg-white border border-gray-200 shadow-lg z-20"
                style={{ borderRadius: '2px' }}
              >
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortOption(option.value);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-50 ${
                        sortOption === option.value
                          ? 'text-[#a07542] bg-gray-50'
                          : 'text-gray-600'
                      }`}
                      style={{ fontFamily: "Europa, sans-serif" }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden flex justify-center">
        <button
          className="flex items-center gap-2 bg-white border border-gray-300 rounded px-6 py-3 shadow-sm hover:border-gray-400 transition-all"
          onClick={() => setShowFilters(true)}
        >
          <FiFilter className="text-gray-600" size={16} />
          <span className="text-gray-700 text-sm" style={{ fontFamily: "Europa, sans-serif" }}>
            Filters
          </span>
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
