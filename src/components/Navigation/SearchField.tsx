"use client";

import { SearchContext } from "@/store/SearchContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState, useRef } from "react";
import { FiX, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getSearchProducts } from "@/lib/axios/searchAxios";
import { Product } from "@/lib/models/productsModal";
import { transformProductCartItem } from "@/utils/trnsformProductCartItem";
import { IoIosSearch } from "react-icons/io";
import Modal from "@/components/UI/Modal";
import { useCurrency } from "@/store/CurrencyContext";


type SearchFieldProps = {
  openSignal?: number; // increment this to programmatically open/focus
  overlay?: boolean;   // if true, render results in a portal modal
  open?: boolean;      // controls modal visibility when overlay=true
  onClose?: () => void;
};

export default function SearchField({ openSignal = 0, overlay = false, open = false, onClose }: SearchFieldProps) {
  const t = useTranslations("navbar");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const router = useRouter();
  const { rate, userCurrency } = useCurrency();

  const { data: resultData, isLoading } = useQuery({
    queryKey: ["products", debouncedTerm],
    queryFn: ({ signal }) => getSearchProducts({ q: debouncedTerm, limit: 5 }, signal),
    enabled: debouncedTerm.trim() !== "",
  });

  // Programmatic open/focus when openSignal changes
  useEffect(() => {
    if (openSignal > 0) {
      setIsFocused(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [openSignal]);

  // Debounce search term
  useEffect(() => {
    const id = setTimeout(() => setDebouncedTerm(searchTerm), 250);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Close dropdown when clicking outside (only for non-overlay mode)
  useEffect(() => {
    if (overlay) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overlay]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setResults([]);
      return;
    }

    if (resultData) {
      setResults(resultData.data);
    }
  }, [searchTerm, resultData]);

  const handleSearch = () => {
    if (searchTerm.trim() === "") return;
    router.push(`/shopGrid?query=${encodeURIComponent(searchTerm)}`);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  const navigateToProduct = (urlKey: string) => {
    router.push(`/product/${urlKey}`);
    setIsFocused(false);
  };

  const displayedProducts = results.map(transformProductCartItem);
  const showPanel = !overlay && isFocused && (results.length > 0 || searchTerm);

  // Focus input when overlay modal opens
  useEffect(() => {
    if (overlay && open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [overlay, open]);

  // Close on Escape in overlay mode
  useEffect(() => {
    if (!(overlay && open)) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay, open, onClose]);

  return (
    <div ref={searchRef} className="w-full relative">
      {/* Search Input (inline) - hidden when overlay modal is used */}
      {!overlay && (
        <div className="relative group">
          {/* Leading icon toggles between search and clear */}
          {searchTerm ? (
            <button
              onClick={clearSearch}
              className={`absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 ${isRtl ? "right-2.5" : "left-2.5"}`}
              aria-label="Clear search"
            >
              <FiX className="text-gray-600" />
            </button>
          ) : (
            <IoIosSearch
              className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${isRtl ? "right-3" : "left-3"} text-xl`}
              aria-hidden
            />
          )}

          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder={t("searchPlaceholder")}
            dir={isRtl ? "rtl" : "ltr"}
            autoComplete="off"
            spellCheck={false}
            aria-label={t("searchPlaceholder")}
            className={`w-full h-11 md:h-11 text-[15px] md:text-[15px] rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition px-10 ${isRtl ? "pr-10 pl-10" : "pl-10 pr-10"}`}
          />
        </div>
      )}

      {/* Modal (overlay) */}
      {overlay && (
        <Modal open={open ?? false} onClose={onClose} classesName="!w-screen !h-screen bg-white">
          <div className="w-full h-full bg-white overflow-y-auto">
            <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-6 pb-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm tracking-wide text-gray-800">{t("searchPlaceholder")}</h3>
                <button onClick={onClose} className="text-sm font-semibold text-gray-900 flex items-center gap-2" aria-label="Close search">
                  CLOSE <FiX className="text-base" />
                </button>
              </div>
              <div className="mt-12 relative">
                <input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  type="text"
                  dir={isRtl ? "rtl" : "ltr"}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label={t("searchPlaceholder")}
                  className="w-full bg-transparent text-black text-5xl md:text-6xl leading-tight outline-none pr-12"
                  placeholder=""
                  autoFocus
                />
                {searchTerm ? (
                  <button
                    onClick={clearSearch}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
                    aria-label="Clear search"
                  >
                    <FiX className="text-2xl text-black" />
                  </button>
                ) : (
                  <IoIosSearch className="absolute right-0 top-1/2 -translate-y-1/2 text-2xl text-black" />
                )}
                <div className="mt-2 h-px w-full bg-black" />
              </div>
              {isLoading ? (
                <div className="p-6 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : results.length > 0 ? (
                <ul className="mt-6 space-y-1.5">
                  {displayedProducts.map((product) => (
                    <li key={product.id}>
                      <button
                        className="group w-full text-left p-3 sm:p-3 flex items-center gap-4 rounded-lg hover:bg-gray-50 transition"
                        onClick={() => navigateToProduct(product.url_key)}
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-base sm:text-[15px] leading-snug line-clamp-2">{product.name}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 pl-2">
                          <span className="text-gray-900 font-semibold whitespace-nowrap">{userCurrency} {(Number(product.price) * rate).toFixed(2)}</span>
                          <FiChevronRight className="text-gray-400 group-hover:text-gray-700 transition" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : searchTerm && !isLoading ? (
                <div className="p-6 text-center text-gray-500">No results found for &quot;{searchTerm}&quot;</div>
              ) : null}
            </div>
          </div>
        </Modal>
      )}

      {/* Results Panel (inline) */}
      {showPanel && (
        overlay ? (
          <></>
        ) : (
          // Default inline absolute panel
          <div className="absolute z-[999] mt-2 w-full md:w-[calc(100%+200px)] md:-left-[110px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fadeIn">
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : results.length > 0 ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="font-medium text-gray-700">Search Results</h3>
                </div>
                <ul className="py-2 max-h-[40vh] md:max-h-[60vh] overflow-y-auto space-y-1.5">
                  {displayedProducts.map((product) => (
                    <li key={product.id}>
                      <button
                        className="group w-full text-left p-3 flex items-center gap-3 rounded-lg hover:bg-gray-50 transition"
                        onClick={() => navigateToProduct(product.url_key)}
                      >
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-[15px] leading-snug line-clamp-2">{product.name}</h4>
                        </div>
                        <div className="flex items-center gap-1.5 pl-2">
                          <span className="text-gray-900 font-semibold whitespace-nowrap">{userCurrency} {(Number(product.price) * rate).toFixed(2)}</span>
                          <FiChevronRight className="text-gray-400 group-hover:text-gray-700 transition" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={handleSearch}
                    className="w-full py-2 text-primary font-medium flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    View all {results.length} results
                  </button>
                </div>
              </>
            ) : searchTerm && !isLoading ? (
              <div className="p-4 text-center text-gray-500">
                No results found for &quot;{searchTerm}&quot;
              </div>
            ) : null}
          </div>
        )
      )}
    </div>
  );
}


