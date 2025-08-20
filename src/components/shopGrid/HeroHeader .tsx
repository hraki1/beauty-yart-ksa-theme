"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface CategoryData {
  description: {
    name: string;
    description: string;
    image?: string;
  };
}

export interface Category {
  id: number;
  description: {
    name: string;
    image?: string;
    url_key: string;
  };
}

interface HeroHeaderProps {
  collectionData?: {
    name: string;
    image: string;
  };
  categoryData?: CategoryData;
  brandData?: {
    name: string;
    description: string;
    image?: string;
  };
  categories?: Category[];
  locale?: string;
  defaultTitle?: string;
  defaultImage?: string;
}

const HeroHeader = ({
  categoryData,
  categories = [],
  locale = "en",
  defaultTitle = "Shop",
  defaultImage = "https://crido.wpbingosite.com/wp-content/uploads/2021/10/high-angle-view-spa-products-white-backdrop-scaled.jpg",
}: HeroHeaderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);

  // Create a repeated array for infinite effect
  const repeatedCategories = [...categories, ...categories, ...categories];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const firstItem = container.firstElementChild as HTMLElement;
    if (firstItem) {
      setItemWidth(firstItem.offsetWidth + 24); // width + gap
    }

    // Start in the middle copy (so we can scroll left & right)
    const middle = categories.length;
    container.scrollLeft = middle * (firstItem?.offsetWidth || 0);

    const handleScroll = () => {
      if (!container) return;

      // Loop reset
      if (container.scrollLeft <= 0) {
        container.scrollLeft = categories.length * itemWidth;
      } else if (
        container.scrollLeft >= categories.length * 2 * itemWidth
      ) {
        container.scrollLeft = categories.length * itemWidth;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [categories, itemWidth]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -itemWidth : itemWidth,
      behavior: "smooth",
    });
  };

  const title = categoryData ? categoryData.description.name : defaultTitle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-64 md:h-80 lg:h-[550px] overflow-hidden"
    >
      {/* Background */}
      <Image
        src={defaultImage}
        alt="Hero Background"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-white/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-800 mb-2">
          {title}
        </h1>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm md:text-base text-gray-700 mb-4">
          <Link
            href={`/${locale}`}
            className="hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            {locale === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-800">{title}</span>
        </nav>

        {/* Infinite Scrollable Categories */}
        {categories.length > 0 && (
          <div className="relative w-full max-w-5xl mx-auto mt-4 flex items-center">
            {/* Left arrow */}
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 z-20 text-black rounded-full h-10 flex items-center justify-center bg-white/70 hover:bg-white"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Scrollable wrapper */}
            <div className="flex-1 overflow-hidden">
              <div
                ref={scrollRef}
                className="flex gap-6 px-2 md:px-0 overflow-x-auto scroll-smooth hide-scrollbar"
              >
                {repeatedCategories.map((cat, idx) => (
                  <Link
                    key={`${cat.id}-${idx}`}
                    href={`/${locale}/shopGrid?categoryid=${cat.id}`}
                    className="relative flex flex-col items-center flex-shrink-0 cursor-pointer"
                    style={{ minWidth: "24%" }}
                  >
                    {/* Image wrapper with border effect on hover */}
                    <div className="relative p-1 rounded-full transition-all duration-300 hover:border hover:border-black">
                      <div className="rounded-full overflow-hidden w-28 h-28 md:w-32 md:h-32">
                        {cat.description.image ? (
                          <Image
                            src={cat.description.image}
                            alt={cat.description.name}
                            className="object-cover w-full h-full rounded-full"
                            width={128}
                            height={128}
                          />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded-full">
                            <span className="text-gray-500 font-bold">
                              {cat.description.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name with underline effect only on hover */}
                    <div className="mt-2 text-center group cursor-pointer">
                      <span
                        className="text-gray-900 text-sm md:text-base relative uppercase transition-colors duration-300 group-hover:text-[#a07542]"
                        style={{
                          fontFamily: "Europa, sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {cat.description.name}
                        <span className="absolute left-1/2 -bottom-0.5 h-[1px] bg-[#a07542] w-0 group-hover:w-full -translate-x-1/2 transition-all duration-500 ease-in-out rounded-full"></span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right arrow */}
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 z-20 text-black rounded-full h-10 flex items-center justify-center bg-white/70 hover:bg-white"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Tailwind hide scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </motion.div>
  );
};

export default HeroHeader;
