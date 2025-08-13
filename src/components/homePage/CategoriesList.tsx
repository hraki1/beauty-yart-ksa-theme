"use client";

import { useCategories } from "@/store/CategoriesContext";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CategoriesList() {
  const t = useTranslations("category");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { categories } = useCategories();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    
    if (isRTL) {
      // In RTL mode, scrollLeft behavior is different
      // When scrollLeft is 0, we're at the "end" (rightmost content)
      // When scrollLeft is maxScrollLeft, we're at the "start" (leftmost content)
      const canScrollLeftRTL = el.scrollLeft < maxScrollLeft - 5;
      const canScrollRightRTL = el.scrollLeft > 5;
      setCanScrollLeft(canScrollLeftRTL);
      setCanScrollRight(canScrollRightRTL);
    } else {
      // LTR mode - normal behavior
      const canScrollLeftLTR = el.scrollLeft > 5;
      const canScrollRightLTR = el.scrollLeft < maxScrollLeft - 5;
      setCanScrollLeft(canScrollLeftLTR);
      setCanScrollRight(canScrollRightLTR);
    }
  }, [isRTL]);

  useEffect(() => {
    // Immediate check
    checkScroll();
    
    // Initial check with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkScroll();
    }, 100);
    
    // Additional check after a longer delay to ensure images are loaded
    const timer2 = setTimeout(() => {
      checkScroll();
    }, 500);
    
    const el = scrollRef.current;
    if (!el) return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
    
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories, isRTL, checkScroll]);

  const scrollBy = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="lg:px-10 px-5 relative py-2 md:py-28 text-center pt-10 bg-gradient-to-b from-[#FFF2EC]  to-white ">
      {/* <h2 className={`text-2xl md:text-3xl font-extrabold mb-8 ${isRTL ? 'text-right' : 'text-left'} text-gray-900 relative`}>
        {t("title")}
      </h2> */}
      <div className="container mx-auto">
        {!categories && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-5 gap-6">
            <h1> {t("noCategory")}</h1>
          </div>
        )}
        <div className="relative">
          {canScrollLeft && (
            <button
              aria-label={isRTL ? "Scroll right" : "Scroll left"}
              className={`group flex absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#3740ea] hover:text-white shadow-lg rounded-full p-2 transition-all duration-200`}
              onClick={() => scrollBy(isRTL ? 300 : -300)}
              type="button"
            >
              <FiChevronLeft className={`h-4 w-4 sm:h-6 sm:w-6 text-black group-hover:text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          )}
          {canScrollRight && (
            <button
              aria-label={isRTL ? "Scroll left" : "Scroll right"}
              className={`group flex absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#3740ea] hover:text-white shadow-lg rounded-full p-2 transition-all duration-200`}
              onClick={() => scrollBy(isRTL ? -300 : 300)}
              type="button"
            >
              <FiChevronRight className={`h-4 w-4 sm:h-6 sm:w-6 text-black group-hover:text-white ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          )}

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className={`flex gap-3.5 md:gap-16 justify-center overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 custom-scroll ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {categories &&
              categories.map((cat, index) => (
                <Link
                  href={`/shopGrid?categoryid=${cat.id}`}
                  key={index}
                  className="flex flex-col items-center text-center group min-w-[11rem] md:min-w-[14rem] snap-start"
                >
                  <div className="w-44 h-44 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-[#fff] group-hover:scale-105 transition-transform duration-300 bg-[#F7F7F7]">
                    <Image
                      src={cat.description.image ?? "/image/products/img.png"}
                      alt={cat.description.name}
                      width={176}
                      height={176}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="mt-4 text-lg font-bold text-black hover:text-[#3740EA]">
                    {cat.description.name}
                  </span>
                  {/* <span className="mt-2 text-gray-500">
                    {cat.productsCount} {t("products")}
                  </span> */}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
