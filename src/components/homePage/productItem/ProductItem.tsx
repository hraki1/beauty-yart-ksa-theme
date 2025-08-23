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
  void _toggleLike;
  void _likedProducts;

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { rate, userCurrency } = useCurrency();

  const [isHovered, setIsHovered] = useState(false);
  const { itemIds, toggleLike } = useWishlist();
  const isLiked = itemIds.includes(product.id);

  const price = (Number(product.price) * rate).toFixed(2);
  const originalPrice = product.originalPrice
    ? (Number(product.originalPrice) * rate).toFixed(2)
    : null;

  // Calculate discount percentage
  const discountPercentage = originalPrice && product.price
    ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
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
        className="w-48 md:w-[360px] relative rounded transition-all duration-300 overflow-visible flex flex-col h-full bg-[white] p-3.5 mb-2.5"
      >
        {/* Product Image */}
        <div
          className="relative aspect-square overflow-hidden  rounded-lg"
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
            className="object-cover transition-transform duration-500 hover:scale-105 p-10 bg-[#F7F7F7] rounded-lg"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            priority={false}
          />

          {/* Discount Badge - Red Box */}
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-30">
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                -{discountPercentage}%
              </div>
            </div>
          )}

          {/* Other Badges */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-20">
            {product.isNew && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-sm font-medium">
                new
              </span>
            )}
            {product.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded-sm font-medium shadow-sm bg-gradient-to-r ${getTagColor(
                  tag
                )} text-white`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom center overlay: Arrow, Wishlist Heart, and Search */}
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
        <div className="p-3 mt-2 flex flex-col flex-1 text-center">
          <Link href={`/product/${product.url_key}`} className="group mb-2">
            <h3 className="text-sm text-gray-800 font-normal leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="mt-auto flex flex-col items-center gap-1">
            <span className="text-base font-semibold text-gray-900">
              {userCurrency} {price}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
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