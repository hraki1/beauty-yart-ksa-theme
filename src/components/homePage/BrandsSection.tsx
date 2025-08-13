import React, { useRef, useState, useEffect } from "react";
import { useBrands } from "@/store/BrandsContext";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SCROLL_AMOUNT = 300;

const BrandsSection: React.FC = () => {
  const t = useTranslations("brandsSection");
  const locale = useLocale();
  const router = useRouter();
  const { brands, error, refetch } = useBrands();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide buttons
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [brands]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleBrandClick = (brandId: number) => {
    router.push(`/${locale}/shopGrid?brandid=${brandId}`);
  };


  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-red-500">{error.name}</h3>
        <p className="py-2">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="lg:mx-10 mx-5 relative py-5 ">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-center tracking-widest text-gray-900 relative">
        {t("brands")}
        <span className="block mx-auto mt-2 w-16 h-1 rounded bg-[#feee00]"></span>
      </h2>
      {/* Gradient overlays for scroll hint */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-white to-transparent" />
      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          aria-label="Scroll left"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 transition"
          onClick={() => scrollBy(-SCROLL_AMOUNT)}
        >
          <FiChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
      )}
      {canScrollRight && (
        <button
          aria-label="Scroll right"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 transition"
          onClick={() => scrollBy(SCROLL_AMOUNT)}
        >
          <FiChevronRight className="h-5 w-5 text-gray-800" />
        </button>
      )}
      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide px-2 md:px-8 relative">
        <div className="flex gap-3 mb-5 snap-x snap-mandatory">
          {brands.map((brand, idx) => (
            <div
              key={brand.id}
              onClick={() => handleBrandClick(brand.id)}
              className="flex flex-col items-center min-w-[120px] bg-white rounded-xl shadow-lg border border-gray-100 p-4 snap-start cursor-pointer group transition-transform duration-300 opacity-0 animate-fadeIn"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <Image
                src={brand.image}
                alt={brand.name}
                width={80}
                height={80}
                className="w-20 h-20 object-contain mb-2 rounded-full border-2 border-gray-200 group-hover:border-yellow-100 group-hover:scale-110 transition-all duration-300 shadow-sm"
              />
              <span className="text-base font-semibold text-gray-700 group-hover:text-[#feee00] transition-colors text-center mt-1">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
