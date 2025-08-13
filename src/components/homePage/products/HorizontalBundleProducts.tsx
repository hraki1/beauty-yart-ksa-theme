"use client";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductItem from "./ProductItem";
import { FrontendProduct } from "@/models/forntEndProduct";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import { useTranslations } from "next-intl";

export default function HorizontalBundleProducts({

  products,
}: {
  title?: string;
  products: FrontEndProductCartItem[];
  id?: number;
}) {
  const t = useTranslations("HorizontalProductList");
  const isRTL = t("dir") === "rtl";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    showLeft: false,
    showRight: true,
    isOverflowing: false,
  });
  const [likedProducts, setLikedProducts] = useState<number[]>([]);

  // Load wishlist and setup scroll listeners
  useEffect(() => {
    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedWishlist) {
      const wishlist: FrontendProduct[] = JSON.parse(storedWishlist);
      setLikedProducts(wishlist.map((product) => product.id));
    }

    // Check overflow and setup scroll listener
    const checkOverflow = () => {
      if (!scrollRef.current) return;

      const { scrollWidth, clientWidth } = scrollRef.current;
      const isOverflowing = scrollWidth > clientWidth;

      setScrollState((prev) => ({
        ...prev,
        isOverflowing,
        showRight: isOverflowing,
      }));
    };

    const handleScroll = () => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;

      setScrollState((prev) => ({
        ...prev,
        showLeft: isRTL ? scrollLeft < 0 : scrollLeft > 0,
        showRight: isRTL
          ? scrollLeft > -maxScroll + 1
          : scrollLeft < maxScroll - 1,
      }));
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      resizeObserver.observe(scrollContainer);
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      resizeObserver.disconnect();
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [products, isRTL]);

  if (!products || products.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const effectiveDirection = isRTL
      ? direction === "left"
        ? "right"
        : "left"
      : direction;

    // Get the first product item to calculate its width
    const firstProductItem = scrollRef.current.querySelector('.flex-shrink-0') as HTMLElement;
    if (!firstProductItem) return;

    // Get the computed width of the product item including margins
    const productWidth = firstProductItem.offsetWidth;
    const gap = 16; // 4 * 4px gap from gap-4 class

    // Calculate scroll amount based on product width + gap
    const scrollAmount = effectiveDirection === "left" ? -(productWidth + gap) : (productWidth + gap);

    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const toggleLike = (product: FrontEndProductCartItem) => {
    const stored = localStorage.getItem("wishlist");
    let wishlist: FrontEndProductCartItem[] = stored ? JSON.parse(stored) : [];

    const exists = wishlist.some((p) => p.id === product.id);
    wishlist = exists
      ? wishlist.filter((p) => p.id !== product.id)
      : [...wishlist, product];

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setLikedProducts(wishlist.map((p) => p.id));
  };


  return (
    <section className="relative">
      {/* Product Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        <AnimatePresence>
          {scrollState.isOverflowing && scrollState.showLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("left")}
              className={`absolute ${isRTL ? "right-0" : "left-0"
                } top-0 bottom-0 z-20 w-16 h-full flex items-center justify-center`}
              whileHover={{ scale: 1.1 }}
              aria-label={t("ScrollPrevious")}
            >
              <div className="p-2 bg-white rounded-full shadow-lg">
                {isRTL ? (
                  <FiChevronRight className="h-5 w-5 text-gray-800" />
                ) : (
                  <FiChevronLeft className="h-5 w-5 text-gray-800" />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scrollState.isOverflowing && scrollState.showRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll("right")}
              className={`absolute ${isRTL ? "left-0" : "right-0"
                } top-0 bottom-0 z-20 w-16 h-full flex items-center justify-center`}
              whileHover={{ scale: 1.1 }}
              aria-label={t("ScrollNext")}
            >
              <div className="p-2 bg-white rounded-full shadow-lg">
                {isRTL ? (
                  <FiChevronLeft className="h-5 w-5 text-gray-800" />
                ) : (
                  <FiChevronRight className="h-5 w-5 text-gray-800" />
                )}
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Product List */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scroll-smooth gap-4 py-2 scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          {products.map((product, idx) => (
            <motion.div
              key={`${product.id}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ProductItem
                product={product}
                toggleLike={toggleLike}
                likedProducts={likedProducts}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
