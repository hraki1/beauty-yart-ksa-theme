"use client";
import Image from "next/image";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiHeart, FiArrowUpLeft } from "react-icons/fi";
import Link from "next/link";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import { useCurrency } from "@/store/CurrencyContext";
import { Search } from "lucide-react";
import QuickView from "./QuickView";
import { useWishlist } from "@/store/WishlistContext";


const ProductItem = ({
  product,
  toggleLike: _toggleLike,
  likedProducts: _likedProducts,
}: {
  product: FrontEndProductCartItem;
  toggleLike: (product: FrontEndProductCartItem) => void;
  likedProducts: number[];
}) => {

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { rate, userCurrency } = useCurrency();

  const [isHovered, setIsHovered] = useState(false);
  const { itemIds, toggleLike } = useWishlist();
  const isLiked = itemIds.includes(product.id);

  const price = (Number(product.price) * rate).toFixed(2);
  const originalPrice = product.originalPrice
    ? (Number(product.originalPrice) * rate).toFixed(2)
    : null;

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "HOT":
        return "from-red-500 to-orange-500";
      case "BESTSELLER":
        return "from-purple-500 to-pink-500";
      case "NEW":
        return "from-blue-500 to-cyan-500";
      case "SALE":
        return "from-green-500 to-emerald-500";
      default:
        return "from-gray-500 to-gray-500";
    }
  };

  return (
    <>
      {/* Product Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-48 md:w-[360px] relative  rounded transition-all duration-300 overflow-hidden flex flex-col h-full"
      >
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden bg-[#F7F7F7]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link
            href={`/product/${product.url_key}`}
            className="absolute inset-0 z-10"
            aria-label={product.name}
          />

          <Image
            src={
              (isHovered && product.imageHover && product.imageHover.trim() !== ""
                ? product.imageHover
                : product.image) || "/placeholder-product.jpg"
            }
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105 p-10 bg-[#F7F7F7]"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            priority={false}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-20">
            {product.isNew && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-[2px] font-medium">
                new
              </span>
            )}
            {product.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded font-medium shadow-sm bg-gradient-to-r ${getTagColor(
                  tag
                )} text-white`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Top right overlay: Arrow and Wishlist Heart */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {/* Arrow: only on hover, desktop only */}
            <motion.button
              initial={{ y: -10, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : -10,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: isHovered ? "auto" : "none" }}
            >
              <Link
                href={`/product/${product.url_key}`}
                className="
        hidden md:block cursor-pointer
        text-gray-700 bg-white rounded-full p-1 shadow hover:bg-gray-50
      "
              >
                <FiArrowUpLeft className="w-5 h-5" />
              </Link>
            </motion.button>

            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : 10,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: isHovered ? "auto" : "none" }}
              onClick={(e) => {
                e.preventDefault();
                toggleLike(product);
              }}
              className="
      block bg-white rounded-full p-1 shadow
      text-red-500 active:scale-90
    "
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
            </motion.button>

            <motion.button
              initial={{ y: -10, opacity: 0 }}
              animate={{
                y: isHovered ? 0 : -10,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: isHovered ? "auto" : "none" }}
              onClick={() => setQuickViewOpen(true)}
              className="
      hidden md:block cursor-pointer
      text-gray-700 bg-white rounded-full p-1 shadow hover:bg-gray-50
    "
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </div>

        </div>

        {/* Product Info */}
        <div className="p-3 mt-2 flex flex-col flex-1">
          <div className="flex justify-center items-start gap-1 mb-2">
            <div className="flex flex-col items-center justify-center">
              <Link href={`/product/${product.url_key}`} className="group">
                <h3 className="leading-tight line-clamp-2 text-base font-medium group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>
          </div>
          <div className="mt-1 w-full flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2">
            <span className="text-[15px] font-bold text-gray-500">
              {userCurrency} {price}
            </span>
            {originalPrice && (
              <span className="text-[15px] text-gray-400 line-through font-medium">
                {userCurrency} {originalPrice}
              </span>
            )}
          </div>
        </div>
      </motion.div>


      <AnimatePresence>
        {quickViewOpen && (
          <QuickView
            urlKey={product.url_key}
            onClose={() => setQuickViewOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductItem;
