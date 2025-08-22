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

  // Static PDF path in /public folder
  const pdfPath = "/guides/beauty-tips.pdf";

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
                <Link href="/infoPages/about" className="text-gray-600 hover:text-purple-600 transition-colors">{t("aboutUs")}</Link>
              </li>
              <li>
                <Link href="/shopGrid" className="text-gray-600 hover:text-purple-600 transition-colors">{t("shop")}</Link>
              </li>
              <li>
                <Link href="/infoPages/contact" className="text-gray-600 hover:text-purple-600 transition-colors">{t("contactUs")}</Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="min-w-0">
            <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">{t("support")}</h4>
            <ul className="space-y-3 text-sm sm:text-base break-words">
              <li>
                <Link href="/infoPages/faq" className="text-gray-600 hover:text-purple-600 transition-colors">{t("helpFaqs")}</Link>
              </li>
              <li>
                <Link href="/infoPages/orders" className="text-gray-600 hover:text-purple-600 transition-colors">{t("trackOrder")}</Link>
              </li>
              <li>
                <Link href="/infoPages/shippingPolicy" className="text-gray-600 hover:text-purple-600 transition-colors">{t("shippingReturns")}</Link>
              </li>
            </ul>
          </div>

          {/* Download Guide Button */}
          <div className="min-w-0">
            <h4 className="text-sm tracking-[0.35em] text-gray-900 font-semibold mb-6">FREE GUIDE</h4>
            <p className="text-gray-600 mb-6">
              Get our <strong>Top 10 Beauty Tips</strong> PDF instantly!
            </p>

            <a
              href={pdfPath}
              download="Top_10_Beauty_Tips.pdf"
              className="px-6 py-3 bg-black text-white font-bold shadow hover:opacity-80 transition inline-block"
            >
              Download Guide
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
