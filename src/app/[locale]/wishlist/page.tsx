"use client";

import { FiHeart } from "react-icons/fi";
import ProductItem from "@/components/homePage/productItem/ProductItem";
import { useWishlist } from "@/store/WishlistContext";

export default function WishlistPage() {
  const { items: wishlist, itemIds, toggleLike } = useWishlist();

  return (
    <div className="pt-5 px-4 md:px-8 lg:px-12 bg-white lg:mx-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Wishlist</h1>
            <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? "item" : "items"}</p>
          </div>
        </div>

        {/* Wishlist Products */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FiHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Save your favorite items here for later
            </p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center md:justify-items-start gap-4"

          >
            {wishlist.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                toggleLike={toggleLike}
                likedProducts={itemIds}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
