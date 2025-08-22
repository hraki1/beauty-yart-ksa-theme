"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import type { Settings } from "@/models/forntEndSettings";

type FooterBottomProps = {
  settings: Settings;
};

export default function FooterBottom({ settings }: FooterBottomProps) {
  const t = useTranslations("footer");

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left quick links */}
          <nav className="flex items-center gap-6 text-xs tracking-widest text-gray-500 uppercase">
            <Link href="infoPages/contact" className="hover:text-gray-800">Store Locator</Link>
            <Link href="/orders" className="hover:text-gray-800">My Orders</Link>
          </nav>

          {/* Payment labels */}
          <div className="flex items-center gap-6 text-gray-400">
            <span className="font-semibold text-gray-500">mastercard</span>
            <span className="font-semibold text-gray-500">VISA</span>
            <span className="font-semibold text-gray-500">PayPal</span>
          </div>
        </div>

        <div className="mt-4 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            {t("copyright", {
              year: new Date().getFullYear(),
              name: settings.store_name || "SARH",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
