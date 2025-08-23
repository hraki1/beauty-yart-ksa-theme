"use client";

import Link from "next/link";
import {
  ChevronRight,
  X,
  Facebook,
  Twitter,
  Mail,
  Share2,
  RotateCw,
} from "lucide-react";
import { FiHeart } from "react-icons/fi";
import { useWishlist } from "@/store/WishlistContext";
import { useState, useMemo } from "react";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import Image from "next/image";
import { useSearchParams, useParams } from "next/navigation";
import { useSettings } from "@/store/SettingsContext";

export default function WishlistPage() {
  const settings = useSettings(); // ✅ get settings
  const SITE_URL = settings.store_name
    ? `https://${settings.store_name}.com`
    : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { items: wishlist, remove } = useWishlist();
  const [copiedLink, setCopiedLink] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const searchParams = useSearchParams();
  const { locale } = useParams() as { locale: string };

  const sharedItemsParam = searchParams.get("items");

  const displayedWishlist = useMemo(() => {
    if (sharedItemsParam) {
      try {
        const parsed = JSON.parse(
          decodeURIComponent(sharedItemsParam)
        ) as FrontEndProductCartItem[];
        return parsed.map((item) => ({
          ...item,
          originalPrice: item.originalPrice ?? item.price,
          stock_availability: item.stock_availability ?? true,
        }));
      } catch (err) {
        console.error("Failed to parse shared wishlist:", err);
      }
    }
    return wishlist;
  }, [sharedItemsParam, wishlist]);

  const wishlistUrl = () => {
    if (!displayedWishlist.length) return `${SITE_URL}/${locale}/wishlist`;
    const encodedItems = encodeURIComponent(
      JSON.stringify(
        displayedWishlist.map((item) => ({
          id: item.id,
          name: item.name,
          url_key: item.url_key,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          stock_availability: item.stock_availability,
        }))
      )
    );
    return `${SITE_URL}/${locale}/wishlist?items=${encodedItems}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(wishlistUrl());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // ✅ Use dynamic social media links from settings
  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        wishlistUrl()
      )}`,
      "_blank"
    );
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        wishlistUrl()
      )}&text=Check out my wishlist!`,
      "_blank"
    );
  };

  const handleShareEmail = () => {
    window.open(
      `mailto:?subject=My Wishlist&body=Check out my wishlist: ${wishlistUrl()}`,
      "_blank"
    );
  };

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      remove(id);
      setRemovingId(null);
    }, 800);
  };

  return (
    <div className="bg-white min-h-screen" dir={locale === "ar" ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://crido.wpbingosite.com/wp-content/uploads/2021/10/high-angle-view-spa-products-white-backdrop-scaled.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-white/10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-normal text-gray-800 mb-4"
            style={{
              fontFamily:
                'Europa, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {locale === "ar" ? "قائمة الأمنيات" : "Wishlist"}
          </h1>
          <nav className="flex items-center space-x-2 rtl:space-x-reverse text-sm md:text-base text-gray-700">
            <Link
              href={`/${locale}`}
              className="hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              {locale === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-800">
              {locale === "ar" ? "قائمة الأمنيات" : "Wishlist"}
            </span>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 pb-16 px-4 md:px-8 lg:px-16 font-europa">
        <div className="w-full">
          {displayedWishlist.length === 0 ? (
            <div className="bg-white shadow-sm p-12 text-center">
              <FiHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium font-europa text-gray-900 mb-2">
                {locale === "ar" ? "قائمة الأمنيات فارغة" : "Your wishlist is empty"}
              </h3>
              <p className="text-gray-500 font-europa mb-6">
                {locale === "ar"
                  ? "احفظ منتجاتك المفضلة هنا لاحقًا"
                  : "Save your favorite items here for later"}
              </p>
              <Link
                href={`/${locale}`}
                className="inline-block font-europa px-6 py-3 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
              >
                {locale === "ar" ? "تابع التسوق" : "Continue Shopping"}
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Items */}
              <div className="space-y-0 mb-12">
                {displayedWishlist.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 border-t-0 first:border-t transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center px-4 sm:px-6 py-6 gap-4 rtl:md:flex-row-reverse">
                      {!sharedItemsParam && (
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="self-start md:self-auto p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                        >
                          {removingId === product.id ? (
                            <RotateCw className="w-5 h-5 text-gray-400 animate-spin" />
                          ) : (
                            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                          )}
                        </button>
                      )}

                      <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 overflow-hidden border border-gray-100 mx-auto md:mx-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-grow min-w-0 pr-0 md:pr-6 text-center md:text-left rtl:text-right">
                        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-start items-baseline gap-2 mb-2">
                          {product.originalPrice &&
                          product.price !== product.originalPrice ? (
                            <>
                              <span className="text-lg font-bold text-gray-900">
                                ${product.price}.00
                              </span>
                              <span className="text-base text-gray-500 line-through">
                                ${product.originalPrice}.00
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900">
                              ${product.price}.00
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">August 15, 2025</p>
                      </div>

                      <div className="flex-shrink-0 text-center md:text-right rtl:text-left border-t md:border-t-0 md:border-l rtl:md:border-r rtl:md:border-l-0 border-gray-200 pt-4 md:pt-0 md:pl-6 rtl:md:pl-0 rtl:md:pr-6">
                        {!product.stock_availability ? (
                          <>
                            <p className="text-sm text-gray-500 mb-3">
                              {locale === "ar" ? "غير متوفر في المخزون" : "Out of stock"}
                            </p>
                            <Link
                              href={`/${locale}/product/${product.url_key}`}
                              className="inline-block px-4 py-2 bg-[#a07542] text-white text-sm font-medium hover:bg-amber-800 transition-colors min-w-[100px]"
                            >
                              {locale === "ar" ? "اعرف المزيد" : "Read more"}
                            </Link>
                          </>
                        ) : (
                          <Link
                            href={`/${locale}/product/${product.url_key}`}
                            className="inline-block px-4 py-2 bg-[#a07542] text-white text-sm font-medium hover:bg-amber-800 transition-colors min-w-[100px]"
                          >
                            {locale === "ar" ? "اختر الخيارات" : "Select options"}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Share Section */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 py-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm text-gray-700 font-medium">
                    {locale === "ar" ? "شارك على:" : "Share on:"}
                  </span>
                  <div className="flex gap-2">
                    {settings.social_media_links.facebook && (
                      <button
                        onClick={handleShareFacebook}
                        className="w-9 h-9 rounded-full bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center"
                      >
                        <Facebook className="w-4 h-4" />
                      </button>
                    )}
                    {settings.social_media_links.twitter && (
                      <button
                        onClick={handleShareTwitter}
                        className="w-9 h-9 rounded-full bg-blue-400 text-white hover:bg-blue-500 flex items-center justify-center"
                      >
                        <Twitter className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() =>
                        window.open(
                          `https://reddit.com/submit?url=${encodeURIComponent(
                            wishlistUrl()
                          )}`,
                          "_blank"
                        )
                      }
                      className="w-9 h-9 rounded-full bg-orange-600 text-white hover:bg-orange-700 flex items-center justify-center"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleShareEmail}
                      className="w-9 h-9 rounded-full bg-gray-600 text-white hover:bg-gray-700 flex items-center justify-center"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Copy Link */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto rtl:sm:flex-row-reverse">
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">
                    {locale === "ar" ? "رابط القائمة:" : "Wishlist link:"}
                  </span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2 flex-1 overflow-hidden">
                    <span
                      className="text-sm text-gray-700 truncate flex-1 overflow-hidden"
                      style={{ direction: "ltr" }}
                      title={wishlistUrl()}
                    >
                      {`${SITE_URL}/${locale}/wishlist/...`}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ml-2 rtl:ml-0 rtl:mr-2 whitespace-nowrap ${
                        copiedLink
                          ? "bg-green-600 text-white shadow-sm"
                          : "bg-black text-white hover:bg-gray-800 shadow-sm"
                      }`}
                    >
                      {copiedLink
                        ? locale === "ar"
                          ? "تم النسخ!"
                          : "Copied!"
                        : locale === "ar"
                        ? "نسخ"
                        : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
