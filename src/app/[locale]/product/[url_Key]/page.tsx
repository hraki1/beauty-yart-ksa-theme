"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiHome,
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

type ProductDetailsProps = {
  params: Promise<{ url_Key: string }>;
};

export default function ProductDetails({ params }: ProductDetailsProps) {
  const t = useTranslations("ProductDetails");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<FrontendProduct | null>();
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [likedProduct, setLikedProduct] = useState<boolean>(false);

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


  const locale = useLocale();
  const isRTL = locale === "ar"; // Add other RTL languages as needed

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
      toast.error(`No Avilable Quantity`);
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreScrollPosition = () => {
      // محاولة الاستعادة من localStorage أولاً
      const scrollY =
        localStorage.getItem("product-scroll") ||
        sessionStorage.getItem("product-scroll-mobile");

      if (scrollY) {
        // تأخير متعدد للهواتف
        const attemptScroll = () => {
          window.scrollTo(0, parseInt(scrollY));
          localStorage.removeItem("product-scroll");
        };

        attemptScroll(); // المحاولة الأولى فوراً
        const retryTimer = setTimeout(attemptScroll, 200); // المحاولة الثانية بعد 200ms

        return () => {
          clearTimeout(retryTimer);
        };
      }
    };

    restoreScrollPosition();
  }, []); // أضف dependencies حسب الحاجة

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    const wishlist: FrontendProduct[] = stored ? JSON.parse(stored) : [];

    if (stored) {
      const isExsist = product
        ? wishlist.some((p) => p.id === product.id)
        : false;

      setLikedProduct(isExsist);
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
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  const handleShareProduct = async () => {
    try {
      if (!product) {
        toast.error(t("share.error"));
        return;
      }
      const productUrl = `${window.location.origin}/product/${product.url_key}`;
      const shareData = {
        title: product.meta_title || product.name,
        text: product.meta_description || product.description || product.short_description,
        url: productUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(productUrl);
        alert(t("share.copied"));
      }
    } catch (error) {
      console.error("Error sharing product:", error);
    }
  };

  console.log(productReviews);

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
      <div className="pt-5  px-4 md:px-8 lg:px-12 bg-white lg:mx-10 min-h-screen">
        {/* Structured Data for SEO */}
        {structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        )}
        {/* Navigation Bar */}

        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-400">
            <Link
              href="/"
              className="flex items-center hover:text-black transition-colors duration-200"
            >
              <FiHome className="w-4 h-4 mr-1" />
              <span className="uppercase font-medium">Home</span>
            </Link>
            <FiChevronRightIcon className="w-4 h-4 text-gray-300" />
            <Link
              href="/shopGrid"
              className="uppercase font-medium hover:text-black transition-colors duration-200"
            >
              Shop
            </Link>
            <FiChevronRightIcon className="w-4 h-4 text-gray-300" />
            <span className="uppercase font-medium text-gray-400 truncate max-w-xs sm:max-w-md">
              {product?.name || "Product"}
            </span>
          </nav>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 pb-8">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Image Gallery */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="sticky top-4 sm:top-24"
              >
                {/* Main Image */}
                <div
                  className="bg-[#F4F4F4] p-4 sm:p-8 rounded-xl mb-4 sm:mb-6 flex items-center justify-center h-[300px] sm:h-[400px] md:h-[500px] relative overflow-hidden cursor-zoom-in"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        scale: isZoomed ? 1.5 : 1,
                        cursor: isZoomed ? "zoom-out" : "zoom-in",
                      }}
                      transition={{ duration: 0.4 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={
                          product?.images?.[currentImage]?.origin_image ??
                          "https://sarehnomow.fsn1.your-objectstorage.com/images/2d4aec3a-850a-471b-a61e-194053ec7331.png"
                        }
                        alt={product?.name ?? t("title")}
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation arrows */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="pointer-events-auto bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <FiChevronLeft className="text-xl text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="pointer-events-auto bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <FiChevronRight className="text-xl text-gray-700" />
                    </motion.button>
                  </div>

                  {/* Discount badge */}
                  {discountPercentage > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md"
                    >
                      {discountPercentage}% OFF
                    </motion.div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {product &&
                    product.images &&
                    product.images.map((image, index) => (
                      <div key={index}>
                        {image.origin_image && image.origin_image !== "" && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCurrentImage(index)}
                            className={`bg-gray-50 p-2 sm:p-3 rounded-lg transition-all ${currentImage === index
                              ? "ring-2 ring-black"
                              : "hover:ring-1 hover:ring-gray-300"
                              }`}
                          >
                            <div className="relative aspect-square h-16 sm:h-20 md:h-28 w-full">
                              <Image
                                src={image.origin_image}
                                alt={`${t("title")} ${index + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 25vw, 150px"
                              />
                            </div>
                          </motion.button>
                        )}
                      </div>
                    ))}
                </div>
              </motion.div>
            </div>

            {/* Product Details */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  {product?.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                  <div className="flex">
                    <StarRating rating={product?.rating ?? 0} />
                  </div>
                  <span className="text-sm sm:text-base text-gray-600">
                    {t("reviewsCount", {
                      rating: product?.meanRating?.toFixed(1) || "0",
                      count: productReviews?.length || 0,
                    })}
                  </span>
                  {/* <button className="text-xs sm:text-sm text-gray-500 underline ml-2 sm:ml-4">
                  {t("addReview")}
                </button> */}
                </div>

                {/* Price */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-end gap-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                      {userCurrency} {price}
                    </span>
                    {product &&
                      typeof product.originalPrice === "number" &&
                      typeof product.price === "number" &&
                      product.originalPrice > product.price && (
                        <>
                          <span className="text-gray-500 line-through text-sm">
                            {userCurrency} {originalPrice}
                          </span>
                          <span className="text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded">
                            {t("save", {
                              amount: (
                                Number(originalPrice) - Number(price)
                              ).toFixed(2),
                              cu: userCurrency,
                            })}
                          </span>
                        </>
                      )}
                  </div>
                </div>

                {/* desciption */}
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                  <p className=" text-gray-500">{product?.description}</p>
                </div>


                {/* sku,category,brand */}
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 flex-wrap">
                  <ul>
                    <li className="flex gap-1"><p className="text-gray-500">SKU:</p><span>{product?.sku}</span></li>
                    <li className="flex gap-1"><p className="text-gray-500">Category:</p><span>{product?.categoryId}</span></li>
                    <li className="flex gap-1"><p className="text-gray-500">Brand:</p><span>{product?.brand_id}</span></li>
                  </ul>
                </div>

                {/* variant Options */}
                <div className="mb-6 sm:mb-8">
                  <Attributes
                    group_id={product?.group_id ?? 0}
                    variant_group_id={product?.variant_group_id ?? 0}
                    defaultAttributes={product?.attributes ?? []}
                  />
                </div>

                {/* Add to Cart */}
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 sticky bottom-0 sm:bottom-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full">
                    {product?.stock_availability ? (
                      <div className="flex flex-col gap-3 sm:gap-4 w-full">
                        {/* Quantity Selector - Full width */}
                        <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 sm:px-4 sm:py-2 w-full justify-between">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={decreaseQuantity}
                            className="text-gray-600 hover:text-black"
                          >
                            <FiMinus className="h-4 w-4" />
                          </motion.button>
                          <span className="mx-3 py-1 sm:mx-4 w-6 sm:w-8 text-center font-medium text-sm sm:text-base">
                            {quantity}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={increaseQuantity}
                            className="text-gray-600 hover:text-black"
                          >
                            <FiPlus className="h-4 w-4" />
                          </motion.button>
                        </div>

                        {/* Add to Cart Button - Full width */}
                        <motion.button
                          onClick={handleAddToCart}
                          disabled={isLoadingAddToCart || isLoadingUpdateCartQuantity}
                          whileHover={{
                            scale: 1.02,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-black text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-medium flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg"
                        >
                          {isLoadingAddToCart || isLoadingUpdateCartQuantity ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              {t("addToCartLoading")}
                            </>
                          ) : (
                            <>
                              <FiShoppingCart className="text-lg sm:text-xl" />
                              <span>
                                {t("addToCart", {
                                  price: Number(price) * quantity,
                                  cu: userCurrency,
                                })}
                              </span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    ) : (
                      <div className="w-full">
                        <div className="bg-gray-100 text-gray-600 py-3 sm:py-4 px-4 sm:px-6 rounded-full font-medium text-center text-base sm:text-lg w-full">
                          Out of Stock
                        </div>
                      </div>
                    )}

                    {/* Wishlist and Share Buttons - Only show when in stock */}
                    {product?.stock_availability && (
                      <div className="flex gap-3 sm:gap-2 w-full sm:w-auto justify-center sm:justify-normal">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 sm:p-3 bg-gray-100 rounded-full text-gray-700 hover:text-black"
                          onClick={() => product && toggleLike(product)}
                        >
                          <FiHeart
                            className={`h-6 w-6 sm:h-7 sm:w-7 ${likedProduct ? "fill-red-500 text-red-500" : ""
                              }`}
                          />
                        </motion.button>
                        <motion.button
                          onClick={handleShareProduct}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 sm:p-3 bg-gray-100 rounded-full text-gray-700 hover:text-black"
                        >
                          <FiShare2 className="h-6 w-6 sm:h-7 sm:w-7" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {/* contact section */}
                <div className="flex items-center gap-3 pt-5 justify-center">
                  <div className="flex items-center gap-2 sm:gap-3  flex-wrap">
                    <Link href={'/infoPages/contact'} dir="ltr" className="hidden md:flex gap-3 py-2 px-3 bg-[#f1f2fe] rounded-xl items-center">
                      <GoQuestion className=" text-xl" />
                      <p className=" font-bold">{t("needHelp")}</p>
                    </Link>
                  </div>

                  <div className="hidden md:flex items-center">
                    <div className={"flex gap-3 items-center rounded-3xl border border-gray-400 py-1 px-3 " + dirClass("pr-10", "pl-10")}>
                      <div className="flex items-center gap-2">
                        <IoCallOutline className=" text-lg" />
                        <p className="font-bold">{contact_phone}</p>
                      </div>
                    </div>

                    <p className={dirClass("-ml-8", "-mr-8") + " bg-[#5ca835] py-1.5 px-3 font-bold rounded-2xl text-white cursor-pointer"}><a href={`tel:${contact_phone}`}>Call us</a></p>

                  </div>
                </div>

                {/* reviews */}
                <div>
                  {isLoadingReviews ? (
                    <Spinner />
                  ) : (
                    <ReviewsSection
                      productReviews={productReviews ?? []}
                    />
                  )}
                </div>

              </motion.div>
            </div>
          </div>
        </main>
      </div>
      <FeaturesSection />
    </>

  );
}
