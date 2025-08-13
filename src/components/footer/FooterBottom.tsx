"use client";

import { useTranslations } from "next-intl";
import type { Settings } from "@/models/forntEndSettings";

type FooterBottomProps = {
  settings: Settings;
};

export default function FooterBottom({ settings }: FooterBottomProps) {
  const t = useTranslations("footer");

  return (
    <div className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-left">
          {/* Copyright */}
          <p className="text-gray-500 text-sm max-w-full">
            {t("copyright", {
              year: new Date().getFullYear(),
              name: settings.store_name || "sarh eCommerce",
            }) || `© Porto eCommerce. ${new Date().getFullYear()} - All Rights Reserved`}
          </p>

          {/* Payment Icons */}
          <div className="flex items-center justify-center flex-wrap gap-2">
            {/* VISA */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
              <span className="text-blue-700 text-xs font-bold tracking-wide">VISA</span>
            </div>

            {/* PayPal */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
              <div className="flex">
                <span className="text-blue-600 text-xs font-bold">Pay</span>
                <span className="text-blue-400 text-xs font-bold">Pal</span>
              </div>
            </div>

            {/* Stripe */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
              <span className="text-purple-600 text-xs font-semibold">stripe</span>
            </div>

            {/* VeriSign */}
            <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center shadow-sm">
              <div className="flex flex-row items-center">
                <span className="text-green-600 text-xs font-bold leading-none">✓</span>
                <span className="text-gray-600 text-[6px] leading-none ml-0.5">iresign</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
