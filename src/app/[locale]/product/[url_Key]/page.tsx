"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiChevronRight as FiChevronRightIcon,
} from "react-icons/fi";
import Image from "next/image";
import { use, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductByUrlKey } from "@/lib/axios/getProductsAxios";
import { transformProduct } from "@/utils/trnsformProduct";
import { FrontendProduct } from "@/models/forntEndProduct";
import Spinner from "@/components/UI/SpinnerLoading";
import { getReviewsForProductById } from "@/lib/axios/reviewAxiox";
import ReviewsSection from "@/components/productDetails/ReviewsSection";
import StarRating from "@/components/shared/StarRating";
import { AuthModalContext } from "@/store/AuthModalContext";
import { AuthContext } from "@/store/AuthContext";
import { CartContext } from "@/store/CartContext";
import toast from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
import Attributes from "@/components/product/Attributes";
import { useCurrency } from "@/store/CurrencyContext";
import Link from "next/link";
import { GoQuestion } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { useSettings } from "@/store/SettingsContext";
import FeaturesSection from "@/components/homePage/FeaturesSection";
import { useRouter } from "next/navigation";

type ProductDetailsProps = {
  params: Promise<{ url_Key: string }>;
};

export default function ProductDetails({ params }: ProductDetailsProps) {
  const t = useTranslations("ProductDetails");
  const router = useRouter();
  const locale = useLocale();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<FrontendProduct | null>();
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [likedProduct, setLikedProduct] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [isBuyNowLoading, setIsBuyNowLoading] = useState(false);

  const { url_Key } = use(params);

  const { contact_phone } = useSettings()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["product", url_Key],
    queryFn: ({ signal }) => getProductByUrlKey(url_Key, signal),
    enabled: !!url_Key,
  });

  const { openAuthModal } = useContext(AuthModalContext);
  const { addToCart, isLoadingAddToCart, isLoadingUpdateCartQuantity } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { rate, userCurrency } = useCurrency();
  const price = (Number(product?.price) * rate).toFixed(2);
  const originalPrice = product?.originalPrice
    ? (Number(product.originalPrice) * rate).toFixed(2)
    : null;

  const {
    data: productReviews,
    isLoading: isLoadingReviews,
    error: errorReviews,
  } = useQuery({
    queryKey: ["product-reviews", product?.id],
    queryFn: ({ signal }) =>
      product
        ? getReviewsForProductById(product.id, signal)
        : Promise.resolve([]),
    enabled: !!product?.id,
  });

  const isRTL = locale === "ar";

  useEffect(() => {
    if (data) {
      const formatedProduct = data?.data?.map(transformProduct);
      setProduct(formatedProduct[0]);
    }
  }, [data]);

  const increaseQuantity = () => {
    if (
      product?.inventory?.qty !== undefined &&
      quantity >= product.inventory.qty
    ) {
      toast.error(`No Available Quantity`);
      return;
    }
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const discountPercentage =
    product &&
      typeof product.price === "number" &&
      typeof product.originalPrice === "number"
      ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) *
        100
      )
      : 0;

  const nextImage = () => {
    setCurrentImage((prev) =>
      product && product.images && product.images.length > 0
        ? prev === product.images.length - 1
          ? 0
          : prev + 1
        : prev
    );
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      product && product.images && product.images.length > 0
        ? prev === 0
          ? product.images.length - 1
          : prev - 1
        : prev
    );
  };

  function handleAddToCart() {
    if (isAuthenticated) {
      if (product?.id !== undefined) {
        addToCart(product.id, quantity);
        setQuantity(1);
      }
    } else {
      openAuthModal();
    }
  }

  async function handleBuyNow() {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    if (product?.id !== undefined) {
      setIsBuyNowLoading(true);
      try {
        // Add item to cart first
        await addToCart(product.id, quantity);
        
        // Navigate to checkout page
        router.push(`/${locale}/checkout`);
        
        // Reset quantity
        setQuantity(1);
      } catch (error) {
        console.error("Error during buy now:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setIsBuyNowLoading(false);
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreScrollPosition = () => {
      const scrollY =
        localStorage.getItem("product-scroll") ||
        sessionStorage.getItem("product-scroll-mobile");

      if (scrollY) {
        const attemptScroll = () => {
          window.scrollTo(0, parseInt(scrollY));
          localStorage.removeItem("product-scroll");
        };

        attemptScroll();
        const retryTimer = setTimeout(attemptScroll, 200);

        return () => {
          clearTimeout(retryTimer);
        };
      }
    };

    restoreScrollPosition();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    const wishlist: FrontendProduct[] = stored ? JSON.parse(stored) : [];

    if (stored) {
      const isExist = product
        ? wishlist.some((p) => p.id === product.id)
        : false;

      setLikedProduct(isExist);
    }
  }, [product]);

  const toggleLike = (product: FrontendProduct) => {
    const stored = localStorage.getItem("wishlist");
    let wishlist: FrontendProduct[] = stored ? JSON.parse(stored) : [];

    const exists = wishlist.some((p) => p.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((p) => p.id !== product.id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setLikedProduct((prev) => !prev);
  };

  if (isLoading) {
    return (
      <div className="my-40">
        <Spinner />
      </div>
    );
  }

  if (error || errorReviews) {
    return (
      <div className="text-center py-10">
        <h1 className="text-red-500"> {error?.name || errorReviews?.name}</h1>
        <p className="text-red-200">
          {error?.message || errorReviews?.message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white "
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.meta_description || product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "SARH Store"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": userCurrency,
      "availability": product.stock_availability ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${window.location.origin}/product/${product.url_key}`
    },
    "image": product.images?.map(img => img.origin_image) || [product.image],
    "aggregateRating": product.meanRating ? {
      "@type": "AggregateRating",
      "ratingValue": product.meanRating,
      "reviewCount": productReviews?.length || 0
    } : undefined
  } : null;

  const dirClass = (ltrClass: string, rtlClass: string) => (isRTL ? rtlClass : ltrClass);

  return (
    <>
      <div className="pt-16  px-4 md:px-8 lg:px-16 bg-white min-h-screen">
        {/* Structured Data for SEO */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}

        {/* Main Content */}
       <main className="flex flex-col lg:flex-row gap-16">
          {/* Left Side - Image Gallery */}
           <div className="lg:w-1/2 flex gap-4">
       {/* Thumbnails */}
<div className="flex flex-col gap-4"> 
  {product?.images?.map((image, index) => (
    <motion.button
      key={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setCurrentImage(index)}
      className={`border transition-all ${
        currentImage === index
          ? "border-gray-400"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="relative aspect-square h-32 w-32"> 
        <Image
          src={image.origin_image}
          alt={`${product.name} ${index + 1}`}
          fill
          className="object-contain p-2"
        />
      </div>
    </motion.button>
  ))}

</div>

            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1"
            >
              <div className="bg-white border border-gray-200 p-8 flex items-center justify-center h-[500px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="relative w-full h-full"
                    onClick={() => setIsZoomed(!isZoomed)}
                    style={{
                      transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                      cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <Image
                      src={
                        product?.images?.[currentImage]?.origin_image ??
                        "https://sarehnomow.fsn1.your-objectstorage.com/images/2d4aec3a-850a-471b-a61e-194053ec7331.png"
                      }
                      alt={product?.name ?? "Product"}
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-sm border border-gray-200 pointer-events-auto"
                >
                  <FiChevronLeft className="text-lg text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 shadow-sm border border-gray-200 pointer-events-auto"
                >
                  <FiChevronRight className="text-lg text-gray-700" />
                </motion.button>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1"
                  >
                    {discountPercentage}% OFF
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side - Product Details */}
          <div className="lg:w-1/2">
          {/* Breadcrumb Navigation Above Product Info */}
  <nav className="flex items-center space-x-1 text-xs text-gray-400 mb-4">
    <Link href="/" className="flex items-center hover:text-gray-600 transition-colors duration-200">
      <span className="font-medium">Home</span>
    </Link>
    <FiChevronRightIcon className="w-3 h-3 text-gray-300 mx-1" />
    <Link href="/shopGrid" className="font-medium hover:text-gray-600 transition-colors duration-200">
      Shop
    </Link>
    <FiChevronRightIcon className="w-3 h-3 text-gray-300 mx-1" />
    <Link href="#" className="font-medium hover:text-gray-600 transition-colors duration-200">
      Body
    </Link>
    <FiChevronRightIcon className="w-3 h-3 text-gray-300 mx-1" />
    <span className="font-medium text-gray-600 truncate">
      {product?.name || "Product"}
    </span>
  </nav>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                <StarRating rating={product?.rating ?? 0} />
              </div>
              <span className="text-xs text-gray-500">
                ({productReviews?.length || 0} customer review)
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-normal text-gray-900 mb-4 leading-tight">
              {product?.name}
            </h1>

       {/* Price */}
<div className="mb-6 pb-4 border-b border-gray-200"> 
  <div className="flex items-center gap-2">
    <span className="text-3xl text-[#a07542] font-medium"> 
      ${price}
    </span>
    {product &&
      typeof product.originalPrice === "number" &&
      typeof product.price === "number" &&
      product.originalPrice > product.price && (
        <span className="text-gray-400 line-through text-lg"> {/* increased size */}
          ${originalPrice}
        </span>
      )}
  </div>
</div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Variant Options */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Capacity</h3>
              <Attributes
                group_id={product?.group_id ?? 0}
                variant_group_id={product?.variant_group_id ?? 0}
                defaultAttributes={product?.attributes ?? []}
              />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={decreaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50"
                >
                  <FiMinus className="h-4 w-4" />
                </motion.button>
                <span className="px-4 py-2 w-16 text-center font-medium border-l border-r border-gray-300">
                  {quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={increaseQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-50"
                >
                  <FiPlus className="h-4 w-4" />
                </motion.button>
              </div>

             {/* Add to Cart Button */}
<motion.button
  onClick={handleAddToCart}
  disabled={isLoadingAddToCart || isLoadingUpdateCartQuantity || !product?.stock_availability}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="bg-gray-900 hover:bg-[#a07542] disabled:bg-gray-300 text-white px-6 py-2 font-medium transition-colors duration-200 w-full" 
>
  {isLoadingAddToCart || isLoadingUpdateCartQuantity ? (
    <>
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      Adding...
    </>
  ) : (
    "Add to cart"
  )}
</motion.button>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                onClick={() => product && toggleLike(product)}
              >
                <FiHeart
                  className={`h-5 w-5 ${likedProduct ? "fill-red-500 text-red-500" : ""}`}
                />
              </motion.button>
            </div>

            {/* Buy Now Button */}
            <motion.button
              onClick={handleBuyNow}
              disabled={isBuyNowLoading || isLoadingAddToCart || isLoadingUpdateCartQuantity || !product?.stock_availability}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#a07542] hover:bg-[#8d6538] disabled:bg-gray-300 text-white py-3 px-6 font-medium mb-6 transition-colors duration-200"
            >
              {isBuyNowLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                "Buy Now"
              )}
            </motion.button>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="text-gray-600 w-20">SKU:</span>
                  <span className="text-gray-900">{product?.sku}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-20">Categories:</span>
                  <span className="text-gray-900">
                    <Link href="#" className="hover:underline">{product?.categoryId}</Link>
                    {product?.brand_id && (
                      <>
                        , <Link href="#" className="hover:underline">{product.brand_id}</Link>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex items-center gap-3 mt-6 justify-center">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={'/infoPages/contact'} dir="ltr" className="hidden md:flex gap-3 py-2 px-3 bg-[#f1f2fe] items-center text-sm">
                  <GoQuestion className="text-lg" />
                  <p className="font-bold">{t("needHelp")}</p>
                </Link>
              </div>

              <div className="hidden md:flex items-center">
                <div className={"flex gap-3 items-center border border-gray-400 py-1 px-3 text-sm " + dirClass("pr-10", "pl-10")}>
                  <div className="flex items-center gap-2">
                    <IoCallOutline className="text-lg" />
                    <p className="font-bold">{contact_phone}</p>
                  </div>
                </div>
                
                <p className={dirClass("-ml-8", "-mr-8") + " bg-[#5ca835] py-1.5 px-3 font-bold text-white cursor-pointer text-sm"}>
                  <a href={`tel:${contact_phone}`}>Call us</a>
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Tabs for Description and Reviews */}
<div className="mt-8 border-t border-gray-200 pt-6">
  {/* Tabs */}
  <div className="flex justify-center border-b border-gray-200 mb-6 gap-8"> {/* bigger gap */}
    <button
      className={`px-8 py-4 text-xl font-semibold transition-colors ${
        activeTab === "description"
          ? "border-b-2 border-[#a07542] text-[#a07542]"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => setActiveTab("description")}
    >
      Description
    </button>
    <button
      className={`px-8 py-4 text-xl font-semibold transition-colors ${
        activeTab === "reviews"
          ? "border-b-2 border-[#a07542] text-[#a07542]"
          : "text-gray-500 hover:text-gray-700"
      }`}
      onClick={() => setActiveTab("reviews")}
    >
      Reviews ({productReviews?.length || 0})
    </button>
  </div>

  {/* Tab Content */}
  <div className="p-6 bg-gray-50 rounded-md"> {/* added padding and light background */}
    {activeTab === "description" && (
      <div className="text-base text-gray-700 leading-relaxed">
        {product?.description}
      </div>
    )}
    {activeTab === "reviews" && (
      <div className="text-base text-gray-700 leading-relaxed">
        {isLoadingReviews ? (
          <Spinner />
        ) : (
          <ReviewsSection productReviews={productReviews ?? []} />
        )}
      </div>
    )}
  </div>
</div>

      </div>
      <FeaturesSection />
    </>
  );
}