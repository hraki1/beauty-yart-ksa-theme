import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiX, FiShoppingCart, FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import { getProductByUrlKey } from "@/lib/axios/getProductsAxios";
import { FrontendProduct } from "@/models/forntEndProduct";
import { AuthContext } from "@/store/AuthContext";
import { AuthModalContext } from "@/store/AuthModalContext";
import { CartContext } from "@/store/CartContext";
import { useCurrency } from "@/store/CurrencyContext";
import { transformProduct } from "@/utils/trnsformProduct";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import toast from "react-hot-toast";
import { useWishlist } from "@/store/WishlistContext";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import { AddToCart, UpdateCartItemQuantity } from "@/lib/axios/CartAxios";

type QuickViewProps = {
  urlKey: string;
  onClose: () => void;
};

export default function QuickView({ urlKey, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [likedProduct, setLikedProduct] = useState<boolean>(false);

  const { openAuthModal } = useContext(AuthModalContext);
  const { addToCart, isLoadingAddToCart, cartItems, updateCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { rate, userCurrency } = useCurrency();
  const router = useRouter();
  const locale = useLocale();

  // Fetch product data
  const { data, isLoading } = useQuery({
    queryKey: ["product", urlKey],
    queryFn: ({ signal }) => getProductByUrlKey(urlKey, signal),
    enabled: !!urlKey,
  });

  // Transform and set product data
  useEffect(() => {
    if (data?.data) {
      const formattedProduct = data.data.map(transformProduct);
      setProduct(formattedProduct[0]);
    }
  }, [data]);

  // Wishlist integration
  const { isLiked: wishlistIsLiked, toggleLike: wishlistToggleLike, itemIds } = useWishlist();

  useEffect(() => {
    if (product) {
      setLikedProduct(wishlistIsLiked(product.id));
    }
  }, [product, itemIds, wishlistIsLiked]);

  const price = product ? (Number(product.price) * rate).toFixed(2) : "0.00";
  const originalPrice = product?.originalPrice
    ? (Number(product.originalPrice) * rate).toFixed(2)
    : null;
  const totalPrice = product ? (Number(product.price) * rate * quantity).toFixed(2) : "0.00";
  const totalOriginalPrice = product?.originalPrice
    ? (Number(product.originalPrice) * rate * quantity).toFixed(2)
    : null;
  const isOutOfStock = product ? (!product.stock_availability || (product.inventory?.qty ?? 0) <= 0) : true;

  const decrease = () => setQuantity((q) => Math.max(1, q - 1));
  const increase = () => {
    if (product?.inventory?.qty !== undefined && quantity >= product.inventory.qty) {
      toast.error("No available quantity");
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (product?.id) {
      addToCart(product.id, quantity);
      setQuantity(1);
      toast.success("Added to cart!");
    }
  };

  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (!product?.id) return;

    try {
      setIsBuyingNow(true);
      const existingItem = cartItems.find((i) => i.product_id === product.id);
      if (existingItem) {
        await UpdateCartItemQuantity({
          cart_item_id: existingItem.cart_item_id,
          qty: existingItem.qty + quantity,
        });
      } else {
        await AddToCart({ productId: product.id, qty: quantity });
      }
      updateCart();
      setQuantity(1);
      router.push(`/${locale}/checkout`);
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to add to cart";
      toast.error(message);
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const wishlistItem: FrontEndProductCartItem = {
      id: product.id,
      name: product.name,
      image: product.image ?? "",
      imageHover: product.images?.[1]?.origin_image ?? product.image ?? "",
      url_key: product.url_key,
      price: product.price,
      originalPrice: product.originalPrice,
      rating: product.rating ?? product.meanRating ?? 0,
      isNew: product.isNew,
      tags: product.tags,
      short_description: product.short_description,
      description: product.description,
      features: product.features,
      colors: product.colors,
      stock_availability: product.stock_availability,
    };

    const exists = wishlistIsLiked(product.id);
    wishlistToggleLike(wishlistItem);
    setLikedProduct(!exists);
    toast.success(exists ? "Removed from wishlist" : "Added to wishlist");
  };

  if (isLoading || !product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          className="bg-white rounded-lg w-full max-w-md p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="relative bg-white rounded-lg w-full max-w-5xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-sm z-10"
          aria-label="Close"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Product Image */}
          <div className="relative bg-[#F7F7F7] min-h-[320px] md:min-h-[520px]">
            <Image
              src={product.image ?? "/placeholder-product.jpg"}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Right: Product Details */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              {product.name}
            </h2>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl md:text-2xl font-semibold text-[#8A5A2B]">
                {userCurrency} {price}
              </span>
              {originalPrice && (
                <span className="text-base md:text-lg text-gray-400 line-through">
                  {userCurrency} {originalPrice}
                </span>
              )}
            </div>

            {product.short_description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.short_description}
              </p>
            )}

            {/* Stock Information */}
            {product.inventory?.qty !== undefined && (
              <p className="text-sm text-gray-600 mb-4">
                {product.inventory.qty} in stock
              </p>
            )}

            {/* Quantity Selector + Add to Cart + Wishlist */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={decrease}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <input
                  readOnly
                  value={quantity}
                  className="w-12 text-center py-2 outline-none"
                  aria-label="Quantity"
                />
                <button
                  onClick={increase}
                  className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isLoadingAddToCart || isOutOfStock}
                className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded hover:bg-gray-800 transition disabled:opacity-50"
              >
                <FiShoppingCart className="w-5 h-5" />
                {isOutOfStock ? "Out of stock" : isLoadingAddToCart ? "Adding..." : "Add to cart"}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`w-11 h-11 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition ${
                  likedProduct ? "bg-red-50 border-red-300" : ""
                }`}
                aria-label="Add to wishlist"
              >
                <FiHeart className={`w-5 h-5 ${likedProduct ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
              </button>
            </div>

            {/* Total Price for Selected Quantity */}
            <div className="mb-5">
              <p className="text-base text-gray-900">
                Total: <span className="font-semibold">{userCurrency} {totalPrice}</span>
                {totalOriginalPrice && (
                  <span className="ml-2 text-gray-400 line-through">{userCurrency} {totalOriginalPrice}</span>
                )}
              </p>
            </div>

            {/* Buy Now Button */}
            {!isOutOfStock && (
              <button onClick={handleBuyNow} disabled={isLoadingAddToCart || isBuyingNow} className="w-full bg-[#8A5A2B] text-white py-3 rounded hover:opacity-90 transition disabled:opacity-50">
                {isLoadingAddToCart || isBuyingNow ? "Processing..." : "Buy Now"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}