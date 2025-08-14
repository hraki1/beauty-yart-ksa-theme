"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ProductsResponse } from "@/lib/models/productsModal";
import ProductItem from "./productItem/ProductItem";
import Spinner from "../UI/SpinnerLoading";
import { getProducts } from "@/lib/axios/getProductsAxios";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import { useTranslations } from "next-intl";
import { transformProductCartItem } from "@/utils/trnsformProductCartItem";
import { useCurrency } from "@/store/CurrencyContext";
import { useWishlist } from "@/store/WishlistContext";

const ITEMS_PER_PAGE = 10;

export default function NewArrivalsProducts() {
  const t = useTranslations("Products");

  const { itemIds, toggleLike } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<FrontEndProductCartItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setAllProducts([]);
    setCurrentPage(1);
  }, []);

  const { data, isLoading, isError, refetch } = useQuery<ProductsResponse, Error>({
    queryKey: ["products", currentPage],
    queryFn: ({ signal }) =>
      getProducts(
        {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        },
        signal
      ),
  });

  const { userIp } = useCurrency()

  useEffect(() => {
    if (data) {
      const newProducts = (data as ProductsResponse).data.map(transformProductCartItem);
      setAllProducts((prev) => [...prev, ...newProducts]);
      setHasMore(currentPage < ((data as ProductsResponse).totalPages || 1));
    }
  }, [data, currentPage]);

  // Wishlist is fully managed via provider

  // Infinity Scroll Observer
  const observer = useRef<IntersectionObserver | null>(null);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  if (isLoading && currentPage === 1) {
    return (
      <div className="mb-40">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{t("error.loading")}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  if (allProducts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-10">
        <p>{t("empty")}</p>
      </div>
    );
  }

  console.log(userIp)

  return (
    <div className="pt-5  px-4 md:px-8 lg:px-12 bg-white lg:mx-10 min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 py-1 "
      >
        <h1 className="text-3xl font-bold text-gray-900 pr-text text-center">
          {t("header.title")}
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          {t("header.count", {
            shown: allProducts.length,
            total: (data as ProductsResponse)?.total || 0,
          })}
        </p>
      </motion.header>

      {/* Product Grid */}
      <div className="px-2 py-6">
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 justify-items-center md:justify-items-start gap-4"
        >
          {allProducts.map((product, index) => {
            const isLast = index === allProducts.length - 1;
            return (
              <div
                key={index}
                ref={isLast ? lastProductRef : null}
                className="w-full h-full flex"
                style={{ minWidth: 0 }}
              >
                <ProductItem
                  product={product}
                  toggleLike={toggleLike}
                  likedProducts={itemIds}
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Spinner when loading next page */}
      {isLoading && currentPage > 1 && (
        <div className="flex justify-center py-6 pb-20">
          <Spinner />
        </div>
      )}
    </div>
  );
}
