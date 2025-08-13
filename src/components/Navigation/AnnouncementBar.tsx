"use client";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Languages from "./Languages";
import { Language } from "@/lib/models/languagesModal";
import CurrencySelector from "./CurrencySelector";
import { GoQuestion } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { useSettings } from "@/store/SettingsContext";
import Link from "next/link";


type LanguageProps = {
  languages: Language[];
};

export default function AnnouncementBar({ languages }: LanguageProps) {
  const { contact_phone } = useSettings()
  const t = useTranslations("navbar.AnnouncementBar");
  const locale = useLocale();
  const isRTL = locale === "ar"; // Add other RTL languages as needed
  // Helper for direction-aware classes
  const dirClass = (ltrClass: string, rtlClass: string) => (isRTL ? rtlClass : ltrClass);

  return (

    <motion.div
      className=" w-ful  text-black text-sm font-medium border-y p-1 border-gray-200"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`px-2 sm:px-4 py-1 flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}
      >

        <div className={` hidden md:flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
          <span className={" bg-red-500 px-2 py-0.5 rounded-xl  text-white text-[12px] font-bold"}>{t("hot")}</span>
          <span className=" text-gray-500 font-semibold">
            {t("freeShipping")}
            {/* <strong>hraki</strong> */}
          </span>
        </div>


        <div className={`flex flex-1 md:flex-none items-center justify-between md:justify-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>

          <div className="flex md:hidden gap-1 cursor-pointer">
            <a href={`tel:${contact_phone}`} className="flex gap-1">
              <IoCallOutline className=" text-lg" />
              <p dir="ltr" className="font-bold">{contact_phone}</p>
            </a>
          </div>

          <div className="flex gap-2">
            <div><CurrencySelector /></div>

            <div><Languages languages={languages} /></div>
          </div>


          <Link href={'/infoPages/contact'} dir="ltr" className="hidden md:flex gap-3 py-2 px-3 bg-[#f1f2fe] rounded-xl items-center">
            <GoQuestion className=" text-xl" />
            <p className=" font-semibold text-[13px]">{t("needHelp")}</p>
          </Link>


          <div className="hidden md:flex items-center">
            <div className={"flex gap-3 items-center rounded-3xl border border-gray-400 py-1 px-3 " + dirClass("pr-10", "pl-10")}>
              <div className="flex items-center gap-2">
                <IoCallOutline className=" text-lg" />
                <p dir="ltr" className="font-bold">{contact_phone}</p>
              </div>
            </div>
            <p dir="ltr" className={dirClass("-ml-8", "-mr-8") + " bg-[#5ca835] py-1.5 px-3 font-bold rounded-2xl text-white cursor-pointer"}><a href={`tel:${contact_phone}`}>Call us</a></p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
