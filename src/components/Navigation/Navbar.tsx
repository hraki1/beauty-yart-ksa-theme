"use client";

import SearchField from "./SearchField";
import CartLink from "./CartLink";
import RegistrationLink from "./RegistrationLink";
import AccountLink from "./AccountLink";
import PremiumNavWidget from "./PremiumNavWidget";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Language as LanguageType } from "@/lib/models/languagesModal";
import { IoMdHeartEmpty } from "react-icons/io";
import { motion } from "framer-motion";
import CategoriesBar from "./CategoriesBar";
import AnnouncementBar from "./AnnouncementBar";
import { FiCodesandbox } from "react-icons/fi";
import { useTranslations } from "next-intl";
import { AuthModalContext } from "@/store/AuthModalContext";
import Image from "next/image";
import { useSettings } from "@/store/SettingsContext";

type NavbarProps = {
  languages: LanguageType[];
};

export default function Navbar({ languages }: NavbarProps) {
  const { isAuthenticated } = useContext(AuthContext);
  const { openAuthModal } = useContext(AuthModalContext)
  const t = useTranslations("navbar.Navbar");
  const router = useRouter();
  const { store_logo } = useSettings()

  const handleOrdersClick = () => {
    // Add your custom function logic here
    if (!isAuthenticated) {
      return openAuthModal()
    }
    router.push('/orders');
  };
  return (
    <>
      {/* Announcement Bar */}
      {/* <AnnouncementBar /> */}

      {/* Main Header */}
      <header className="z-40 w-full md:shadow-sm">
        <AnnouncementBar languages={languages} />
        <div className="w-full px-2 lg:px-20">
          <nav className="container mx-auto flex items-center justify-between py-[9px] gap-3 md:gap-8">


            {/* Left - Logo */}
            <div className="flex flex-1 items-center gap-1 md:gap-10 xl:gap-28">
              <div className="flex items-center md:hidden">
                <PremiumNavWidget />
              </div>
              <Link href={"/"} className="flex items-center z-10">
                <motion.div
                  className="cursor-pointer"
                  whileHover={{ scale: 1.03 }}

                >
                  <Image 
                    src={store_logo} 
                    width={90} 
                    height={90} 
                    alt="Store Logo"
                    className="w-[72px] h-[72px] sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
                  />
                </motion.div>
              </Link>

              {/* Center - Search */}

              <div className="hidden md:block items-center flex-1">
                <SearchField />
              </div>
            </div>



            {/* Right - Actions */}
            <ul className="flex items-center gap-2 md:gap-3">

              <li>
                <Link
                  href={"/wishlist"}
                  className="group flex items-center gap-2 cursor-pointer text-[#d0e3ec]  hover:text-white">
                  <div className="bg-[#f1f2fe] rounded-md p-2 duration-200 group-hover:-translate-y-1">
                    <IoMdHeartEmpty className="text-black font-bold  text-[25px]" />
                  </div>
                  <h2 className="hidden lg:block text-black font-medium text-sm">
                    {t("wishlist")}
                  </h2>
                </Link>


              </li>

              <li>
                <button
                  onClick={handleOrdersClick}
                  className="group flex items-center gap-2 cursor-pointer text-[#d0e3ec] hover:text-white"
                >
                  <div className="bg-[#f1f2fe] rounded-md p-2 duration-200 group-hover:-translate-y-1">
                    <FiCodesandbox className="font-bold text-2xl text-black " />
                  </div>
                  <h2 className="hidden lg:block text-sm text-black font-medium">
                    {t("trackingOrders")}
                  </h2>
                </button>
              </li>

              <li className="">
                {isAuthenticated ? <AccountLink /> : <RegistrationLink />}
              </li>


              <li>
                <CartLink />
              </li>

            </ul>
          </nav>
        </div>
      </header>


      <div className="block md:hidden w-full px-2 py-2">
        <div className="rounded-xl p-0">
          <SearchField />
        </div>
      </div>
      {/* Categories Bar */}
      <div className=" hidden md:block">
        <CategoriesBar />
      </div>
    </>
  );
}
