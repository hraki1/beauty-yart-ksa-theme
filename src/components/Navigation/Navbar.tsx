"use client";

import CartLink from "./CartLink";
import RegistrationLink from "./RegistrationLink";
import AccountLink from "./AccountLink";
import PremiumNavWidget from "./PremiumNavWidget";
import { useContext, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import Link from "next/link";
import type { Language as LanguageType } from "@/lib/models/languagesModal";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { SearchIcon, X } from "lucide-react";
import SearchField from "./SearchField";
import { useWishlist } from "@/store/WishlistContext";
// import AnnouncementBar from "./AnnouncementBar";
// Use global Europa Regular defined in globals.css

type NavbarProps = {
  languages: LanguageType[];
};

// Animation variants for nav links
const navLinkVariants = {
  initial: { 
    y: 0,
    scale: 1,
  },
  hover: { 
    y: -2,
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const underlineVariants = {
  initial: { 
    scaleX: 0,
    originX: 0
  },
  hover: { 
    scaleX: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function Navbar({ languages }: NavbarProps) {
  const { isAuthenticated } = useContext(AuthContext);

  const [showSearch, setShowSearch] = useState(false);
  const [openSearchTick, setOpenSearchTick] = useState(0);
  void languages; // keep prop used to satisfy linter
  const { count: wishlistCount } = useWishlist();

  const toggleSearch = () => {
    setShowSearch((prev) => {
      const next = !prev;
      if (next) setOpenSearchTick((v) => v + 1);
      return next;
    });
  };

  return (
    <>
      {/* Announcement Bar */}
      {/* <AnnouncementBar /> */}

      {/* Main Header */}
      <header className=" z-40 w-full p-4 bg-white md:bg-[#FFEDE4]">
        {/* <AnnouncementBar languages={languages} /> */}
        <div className="relative w-full px-2 lg:px-20">
          <nav className="container mx-auto flex items-center justify-between py-[9px] gap-3 md:gap-8">

            {/* left - search & menu */}
            <div className="flex items-center md:gap-10 xl:gap-28">
              {/* Search toggle + field (desktop) */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={toggleSearch}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                  aria-label={showSearch ? "Close search" : "Open search"}
                  aria-expanded={showSearch}
                >
                  {showSearch ? <X /> : <SearchIcon />}
                </button>
                <div
                  className={`transition-all duration-300 overflow-visible ${showSearch ? "" : ""
                    }`}
                >
                  <div className="w-[320px]">
                    <div className={`relative transition-all duration-300 ${showSearch ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none -translate-y-1"}`}>
                      <SearchField
                        openSignal={openSearchTick}
                        overlay
                        open={showSearch}
                        onClose={() => setShowSearch(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center md:hidden">
                <PremiumNavWidget />
              </div>

              <Link href={"/"} className="flex md:hidden items-center z-10">
                <motion.h1
                  className={`cursor-pointer text-3xl md:text-5xl font-normal lowercase leading-none text-[#0F0F0F]`}
                  style={{ fontFamily: "auto", fontWeight: 400, letterSpacing: "-0.02em" }}
                  whileHover={{ scale: 1.03 }}                >
                  crido
                </motion.h1>
              </Link>

            </div>

            {/* center - Logo with side links */}
<div className="hidden md:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 items-center justify-center gap-10 xl:gap-28">
  {/* Left links */}
  <ul className="flex items-center gap-6">
    <li>
      <motion.div
        variants={navLinkVariants}
        initial="initial"
        whileHover="hover"
        className="relative"
      >
        <Link href="/infoPages/contact" className="text-black relative inline-block">
          Contact
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
            variants={underlineVariants}
            initial="initial"
            whileHover="hover"
          />
        </Link>
      </motion.div>
    </li>
    <li>
      <motion.div
        variants={navLinkVariants}
        initial="initial"
        whileHover="hover"
        className="relative"
      >
        <Link href="/infoPages/about" className="text-black relative inline-block">
          Our Story
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
            variants={underlineVariants}
            initial="initial"
            whileHover="hover"
          />
        </Link>
      </motion.div>
    </li>
  </ul>

  {/* Logo */}
  <Link href={"/"} className="flex items-center z-10 px-4">
    <motion.h1
      className="cursor-pointer text-3xl md:text-5xl font-normal lowercase leading-none text-[#0F0F0F]"
      style={{ fontFamily: "auto", fontWeight: 400, letterSpacing: "-0.02em" }}
      whileHover={{ scale: 1.03 }}
    >
      crido
    </motion.h1>
  </Link>

  {/* Right links */}
  <ul className="flex items-center gap-6">
    <li>
      <motion.div
        variants={navLinkVariants}
        initial="initial"
        whileHover="hover"
        className="relative"
      >
        <Link href="/shopGrid" className="text-black relative inline-block">
          Shop
          <motion.div
            className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
            variants={underlineVariants}
            initial="initial"
            whileHover="hover"
          />
        </Link>
      </motion.div>
    </li>
   <li>
     <motion.div
       variants={navLinkVariants}
       initial="initial"
       whileHover="hover"
       className="relative"
     >
       {isAuthenticated ? (
         <Link href="/orders" className="text-black relative inline-block">
           Orders
           <motion.div
             className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
             variants={underlineVariants}
             initial="initial"
             whileHover="hover"
           />
         </Link>
       ) : (
         <Link href="/infoPages/faq" className="text-black relative inline-block">
           Help & FAQ
           <motion.div
             className="absolute bottom-0 left-0 w-full h-0.5 bg-black"
             variants={underlineVariants}
             initial="initial"
             whileHover="hover"
           />
         </Link>
       )}
     </motion.div>
   </li>
  </ul>
</div>

            {/* right - links */}
            <ul className="flex items-center gap-4 md:gap-5">

              <li className="">
                {isAuthenticated ? <AccountLink /> : <RegistrationLink />}
              </li>

              <li>
                <Link
                  href={"/wishlist"}
                  className="group relative flex items-center rounded-md cursor-pointer"
                  aria-label={`Wishlist with ${wishlistCount} items`}
                >
                  <FiHeart className="text-black font-bold text-[25px] transition-transform duration-200 group-hover:-translate-y-0.5" />
                  <span
                    className="absolute -top-4 -right-4 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                </Link>
              </li>

              <li className="transition-transform duration-200 hover:-translate-y-0.5">
                <CartLink />
              </li>

            </ul>

          </nav>
        </div>
      </header>

    </>
  );
}