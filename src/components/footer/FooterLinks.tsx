"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import type { Settings } from "@/models/forntEndSettings";

type FooterLinksProps = {
  settings: Settings;
};

export default function FooterLinks({ settings }: FooterLinksProps) {
  const t = useTranslations("footer");

  return (
    <div className="bg-white py-12 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-10 sm:gap-12">
          
          {/* Company Info */}
          <div className="space-y-5 min-w-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 truncate">
              {settings.store_name}
            </h2>

            <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed break-words">
              {settings.store_address && (
                <div>
                  <span className="font-semibold text-gray-800">{t("address")}:</span>
                  <span className="ml-1 block sm:inline">{settings.store_address}</span>
                </div>
              )}

              {settings.contact_email && (
                <div>
                  <span className="font-semibold text-gray-800">{t("email")}:</span>
                  <span className="ml-1 text-purple-600 block sm:inline break-all">
                    {settings.contact_email}
                  </span>
                </div>
              )}

              {settings.contact_phone && (
                <div>
                  <span className="font-semibold text-gray-800">{t("phone")}:</span>
                  <span className="ml-1 font-semibold text-gray-800 block sm:inline">
                    {settings.contact_phone}
                  </span>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="flex gap-3 mt-6">
              {settings.social_media_links?.facebook && (
                <Link
                  href={settings.social_media_links.facebook}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiFacebook className="text-lg sm:text-xl" />
                </Link>
              )}
              {settings.social_media_links?.twitter && (
                <Link
                  href={settings.social_media_links.twitter}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Twitter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiTwitter className="text-lg sm:text-xl" />
                </Link>
              )}
              {settings.social_media_links?.instagram && (
                <Link
                  href={settings.social_media_links.instagram}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center text-white transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiInstagram className="text-lg sm:text-xl" />
                </Link>
              )}
            </div>
          </div>

          {/* Company Links */}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">{t("company")}</h4>
            <ul className="space-y-3 text-sm sm:text-base break-words">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("shop")}
                </Link>
              </li>
              <li>
                <Link href="/infoPages/contact" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("blog")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">{t("support")}</h4>
            <ul className="space-y-3 text-sm sm:text-base break-words">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("helpFaqs")}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("loginRegister")}
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("trackOrder")}
                </Link>
              </li>
              <li>
                <Link href="/infoPages/shippingPolicy" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("shippingReturns")}
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-600 hover:text-purple-600 transition-colors">
                  {t("accessibility")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              {t("newsletter")}
            </h4>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="relative mb-4 sm:mb-6"
              aria-label="Subscribe to newsletter"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white border border-gray-200 rounded-2xl sm:rounded-full shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500">
                <input
                  type="email"
                  name="email"
                  placeholder={t("emailPlaceholder")}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none text-sm sm:text-base min-w-0 border-0 focus:ring-0"
                  required
                  aria-required="true"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full transition-all duration-300 font-semibold text-sm sm:text-base transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                >
                  {t("subscribe")}
                </button>
              </div>
            </form>

            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed break-words">
              {t("subscribeTerms")}{" "}
              <Link
                href="/infoPages/termsOfService"
                className="text-purple-600 hover:text-purple-700 transition-colors underline decoration-purple-300 underline-offset-2 hover:decoration-purple-500"
              >
                {t("termsOfUse")}
              </Link>{" "}
              {t("and")}{" "}
              <Link
                href="/infoPages/privacyPolicy"
                className="text-purple-600 hover:text-purple-700 transition-colors underline decoration-purple-300 underline-offset-2 hover:decoration-purple-500"
              >
                {t("privacyPolicy")}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
