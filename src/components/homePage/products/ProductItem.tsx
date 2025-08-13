"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiShoppingCart, FiX, FiArrowUpLeft } from "react-icons/fi";
import Link from "next/link";
import { CartContext } from "@/store/CartContext";
import { AuthContext } from "@/store/AuthContext";
import { AuthModalContext } from "@/store/AuthModalContext";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/store/CurrencyContext";
import StarRating from "@/components/shared/StarRating";

const ProductItem = ({
  product,
  toggleLike,
  likedProducts,
}: {
  product: FrontEndProductCartItem;
  toggleLike: (product: FrontEndProductCartItem) => void;
  likedProducts: number[];
}) => {
  const t = useTranslations("ProductItem");
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { openAuthModal } = useContext(AuthModalContext);
  const { rate, userCurrency } = useCurrency();

  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isLiked = likedProducts.includes(product.id);

  const price = (Number(product.price) * rate).toFixed(2);
  const originalPrice = product.originalPrice
    ? (Number(product.originalPrice) * rate).toFixed(2)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    console.log(product)
    e.preventDefault();
    if (isAuthenticated) {
      addToCart(product.id, 1);
    } else {
      openAuthModal();
    }
  };

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
        className="w-48 md:w-[310px] relative bg-[#F4F4F4] rounded-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full"
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
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            priority={false}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-2 z-20">
            {product.isNew && (
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                new
              </span>
            )}
            {product.tags?.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className={`text-xs px-2 py-1 rounded-full font-medium shadow-sm bg-gradient-to-r ${getTagColor(
                  tag
                )} text-white`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Top right overlay: Arrow and Wishlist Heart */}
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-30">
            {/* Arrow: only on hover, desktop only */}
            <Link href={`/product/${product.url_key}`}
              className={`
                 hidden md:block cursor-pointer
                 ${isHovered ? "opacity-100" : "opacity-0"}
                 transition-opacity duration-200
                 text-gray-700 bg-white rounded-full p-1 shadow hover:bg-gray-50
               `}
            >
              <FiArrowUpLeft className="w-5 h-5" />
            </Link>
            {/* Heart: always on mobile, on hover for desktop */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleLike(product);
              }}
              className={`
                block md:${isHovered ? "block opacity-100" : "hidden opacity-0"}
                bg-white rounded-full p-1 shadow
                text-red-500
                active:scale-90
                transition-opacity duration-200
              `}
            >
              <FiHeart className={`w-5 h-5 ${isLiked ? "fill-red-500" : ""}`} />
            </button>
          </div>

          {/* Quick View Button */}
          {/* <AnimatePresence>
            {isHovered && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={(e) => {
                  e.preventDefault();
                  setQuickViewOpen(true);
                }}
                className="absolute bottom-3 left-0 right-0 mx-auto w-max px-4 py-2 bg-black/90 text-white text-sm rounded-full shadow-md z-20 flex items-center gap-2 backdrop-blur-sm"
              >
                {t("quickShop")}
              </motion.button>
            )}
          </AnimatePresence> */}
        </div>

        {/* Product Info */}
        <div className="p-3 flex flex-col flex-1">

          <div className="flex justify-center items-start gap-2 mb-2">
            <div className="flex flex-col items-center justify-center">
              <Link href={`/product/${product.url_key}`} className="group">
                <h3 className="mb-1 font-bold text-gray-400 uppercase text-[12px]  leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  Category name
                </h3>
              </Link>
              <Link href={`/product/${product.url_key}`} className="group">
                <h3 className="text-gray-900 font-semibold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
            </div>

          </div>

          <div className="flex justify-center items-center">
            <StarRating rating={product.rating} />
          </div>

          <div className="mt-auto w-full flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-2 py-2">
            <span className="text-sm sm:text-base font-extrabold text-gray-900">
              {userCurrency} {price}
            </span>
            {originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through font-medium">
                {userCurrency} {originalPrice}
              </span>
            )}
          </div>

        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-md overflow-hidden shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 w-full bg-[#F7F7F7]">
                <Image
                  src={product.image ?? "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-contain"
                  priority
                />
                <button
                  onClick={() => setQuickViewOpen(false)}
                  className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow-sm z-10"
                  aria-label={t("ariaLabels.close")}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 space-y-3">
                <h2 className="font-bold text-lg text-gray-900">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    {userCurrency} {price}
                  </span>
                  {originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      {userCurrency} {originalPrice}
                    </span>
                  )}
                </div>

                {product.short_description && (
                  <p className="text-sm text-gray-600">
                    {product.short_description}
                  </p>
                )}

                <div className="flex gap-3 pt-3">
                  {product.stock_availability ? (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      {t("addToCart")}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 py-2 rounded cursor-not-allowed"
                    >
                      <FiShoppingCart className="w-4 h-4" />
                      {t("outOfStock")}
                    </button>
                  )}

                  <Link
                    href={`/product/${product.url_key}`}
                    className="flex-1 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
                    onClick={() => setQuickViewOpen(false)}
                  >
                    {t("viewDetails")}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductItem;
