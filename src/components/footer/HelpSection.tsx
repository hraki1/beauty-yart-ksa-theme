"use client";

import { useTranslations } from "next-intl";
import { FiPhone, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { useSettings } from "@/store/SettingsContext";
import Image from "next/image";
 

 

export default function HelpSection() {
  const t = useTranslations("footer");
  const settings = useSettings();

  return (
    <section className="flex flex-col md:flex-row gap-6 items-stretch justify-center pt-10 border-t border-gray-200 font-sans px-4 sm:px-6">
      {/* Left Box - Purple Help */}
      <div className="bg-[#954cf5] text-white p-6 rounded-lg flex gap-4 items-start w-full max-w-full md:max-w-[600px] min-h-[160px] relative overflow-hidden">
        {/* Double dots */}
        <div className="flex flex-col gap-1.5 pl-4 sm:pl-6 md:pl-10 mt-2 shrink-0">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-1.5">
              <div className="w-1 h-1 bg-white rounded-full opacity-80" />
              <div className="w-1 h-1 bg-white rounded-full opacity-80" />
            </div>
          ))}
        </div>

        <div className="pt-3 pr-2 flex-1">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
            {/* Icon */}
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/image/contact/help-icon.png"
                alt="Help Icon"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>

            {/* Text */}
            <div>
              <h3 className={`text-xl sm:text-2xl font-bold mb-1`}>
                {t("needHelp") || "Need Any Help?"}
              </h3>
              <p className={`text-sm text-gray-200 leading-relaxed`}>
                {t("helpDescription") || "We are here to help you with any question."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Box - Contact Info */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg flex flex-col justify-between w-full max-w-full md:max-w-[600px] min-h-[160px]">
        <div className="flex flex-col sm:flex-row justify-between gap-4 flex-wrap">
          {/* Contact */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
              <FiPhone className="text-sm" />
              <span>{settings.contact_phone || "123 456 7890"}</span>
            </div>
            <div className="text-sm text-gray-600">
              {t("workingHours") || "Monday to Saturday - 8am – 6pm"}
            </div>
          </div>

          {/* Email Help Button */}
          <a
            href={`mailto:${settings.contact_email}`}
            className="flex items-center gap-1 text-sm font-medium bg-gray-100 px-3 py-1.5 rounded-md hover:bg-gray-200 transition w-fit"
          >
            {t("onlineHelp") || "Online Help"}
            <FiExternalLink className="text-xs" />
          </a>
        </div>

        {/* FAQ Link */}
        <div className="mt-3">
          <Link
            href="/faq"
            className="text-sm text-purple-600 hover:text-purple-800 underline transition-colors"
          >
            {t("faq") || "Frequently Asked Questions"}
          </Link>
        </div>
      </div>
    </section>
  );
}
