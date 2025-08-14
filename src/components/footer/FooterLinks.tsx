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
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Contact */}
          <div className="space-y-5">
            <h2 className="text-4xl font-serif text-gray-900">{settings.store_name}</h2>
            <div className="text-gray-700 space-y-2">
              {settings.store_address && <p>{settings.store_address}</p>}
              {(settings.store_city || settings.store_country) && (
                <p>
                  {settings.store_city}
                  {settings.store_city && settings.store_country ? ", " : ""}
                  {settings.store_country}
                </p>
              )}
              {settings.contact_email && (
                <p>
                  <span className="font-medium">Email : </span>
                  <span className="break-all">{settings.contact_email}</span>
                </p>
              )}
              {settings.contact_phone && (
                <p>
                  <span className="font-medium">Phone </span>
                  <span>: {settings.contact_phone}</span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 pt-2 text-gray-900">
              {settings.social_media_links?.twitter && (
                <Link href={settings.social_media_links.twitter} aria-label="Twitter" target="_blank" className="hover:opacity-70">
                  <FiTwitter className="w-5 h-5" />
                </Link>
              )}
              {settings.social_media_links?.instagram && (
                <Link href={settings.social_media_links.instagram} aria-label="Instagram" target="_blank" className="hover:opacity-70">
                  <FiInstagram className="w-5 h-5" />
                </Link>
              )}
              {settings.social_media_links?.facebook && (
                <Link href={settings.social_media_links.facebook} aria-label="Facebook" target="_blank" className="hover:opacity-70">
                  <FiFacebook className="w-5 h-5" />
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

          {/* JOIN NOW (Newsletter) */}
          <div className="min-w-0">
            <h4 className="text-sm tracking-[0.35em] text-gray-900 font-semibold mb-6">JOIN NOW</h4>
            <p className="text-gray-600 mb-6">
              Become a {settings.store_name || "Siena"} member and get 10% off your next purchase!
            </p>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Join newsletter" className="max-w-sm">
              <div className="flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Email address..."
                  className="flex-1 bg-transparent border-0 border-b border-black focus:border-black focus:ring-0 px-0 py-2 placeholder:text-gray-500"
                  required
                />
                <button type="submit" aria-label="Subscribe" className="border-b-2 border-black pb-2 px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                    <path d="M4 6l8 6 8-6" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
