"use client";

import { useState, useRef, useEffect, useContext, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiHeart,
  FiLogOut,
  FiChevronDown,
  FiShoppingBag,
} from "react-icons/fi";
import { AuthContext } from "@/store/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { LuUserRound, LuSparkles } from "react-icons/lu";

type MenuItemId = "profile" | "orders" | "wishlist";

export default function PremiumUserMenu() {
  const t = useTranslations("accountCard");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<MenuItemId | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems: { icon: JSX.Element; label: string; path: string; id: MenuItemId }[] = [
    { icon: <FiUser size={20} />, label: t("Profile"), path: "/profile", id: "profile" },
    { icon: <FiShoppingBag size={20} />, label: t("Orders"), path: "/orders", id: "orders" },
    { icon: <FiHeart size={20} />, label: t("wishlist"), path: "/wishlist", id: "wishlist" },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Enhanced User Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-3 p-2 rounded-xl transition-all duration-300 hover:shadow-lg"
        style={{
          backgroundImage: isOpen
            ? "linear-gradient(135deg, #000000 0%, #333333 100%)"
            : "linear-gradient(180deg, #FFEDE4 70%, #FFFFFF 100%)",
        }}
        aria-label="User menu"
      >
        {user?.avatar ? (
          <div className="relative w-10 h-10 overflow-hidden rounded-full ring-2 ring-white shadow-lg">
            <Image
              src={user.avatar}
              alt="User avatar"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        ) : (
          <div className="relative w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-black/10">
            <LuUserRound className="text-xl text-black  transition-colors duration-300" />
          </div>
        )}

        <div className="hidden md:block">
          <p
            className="text-sm font-medium transition-colors duration-300"
            style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              color: isOpen ? "#FFFFFF" : "#000000",
            }}
          >
            {user?.full_name || t("title")}
          </p>
          <p
            className={`text-xs transition-colors duration-300 ${
              isOpen ? "text-white/70" : "text-black/60"
            }`}
          >
           happy to see you! 🌸
          </p>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="ml-auto"
        >
          <FiChevronDown
            className={`transition-colors duration-300 ${
              isOpen ? "text-white" : "text-black"
            }`}
            size={18}
          />
        </motion.div>
      </motion.button>

      {/* Enhanced Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className={`absolute ${
              !isRTL ? "right-0" : "left-0"
            } mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-black/10 overflow-hidden z-50`}
            style={{
              background:
                "linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 237, 228, 0.95) 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Enhanced User Profile Section */}
            <div className="relative px-6 py-6 border-b border-black/10">
              <div className="absolute top-0 right-0 p-4">
                <LuSparkles className="text-black/20" size={24} />
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-3 ring-white shadow-lg">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        backgroundImage:
                          "linear-gradient(135deg, #FFEDE4 0%, #FFFFFF 100%)",
                      }}
                    >
                      <FiUser className="text-black" size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3
                    className="font-bold text-lg leading-tight mb-1"
                    style={{
                      fontFamily: "Playfair Display, serif",
                      fontStyle: "italic",
                      color: "#000000",
                    }}
                  >
                    {user?.full_name || "Welcome, Guest"}
                  </h3>
                  <p className="text-sm text-black/70 truncate">
                    {user?.email || "Sign in to continue"}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-black/60">
                       Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.path}
                    className="group flex items-center gap-4 px-6 py-4 text-black hover:bg-black/5 transition-all duration-300 relative overflow-hidden"
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <motion.div
                      className="p-2 rounded-xl bg-black/5 group-hover:bg-black group-hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                    >
                      {item.icon}
                    </motion.div>

                    <div className="flex-1">
                      <span className="font-medium text-base">
                        {item.label}
                      </span>
                      <div className="text-xs text-black/50 mt-0.5">
                        {item.id === "profile" && "Manage your account"}
                        {item.id === "orders" && "View order history"}
                        {item.id === "wishlist" && "Saved items"}
                      </div>
                    </div>

                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{
                        x: hoveredItem === item.id ? 0 : -10,
                        opacity: hoveredItem === item.id ? 1 : 0,
                      }}
                      className="text-black/30"
                    >
                      →
                    </motion.div>

                    {/* Hover Effect Background */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: hoveredItem === item.id ? "0%" : "-100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Logout Section */}
            <div className="border-t border-black/10 p-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="group w-full flex items-center gap-4 px-6 py-4 text-black rounded-xl hover:bg-black hover:text-white transition-all duration-300 relative overflow-hidden"
              >
                <div className="p-2 rounded-xl bg-red-50 group-hover:bg-white/20 transition-all duration-300">
                  <FiLogOut
                    size={20}
                    className="text-red-500 group-hover:text-white"
                  />
                </div>

                <div className="flex-1 text-left">
                  <span className="font-medium text-base">{t("SignOut")}</span>
                  <div className="text-xs opacity-70">See you next time!</div>
                </div>

                <div className="w-2 h-2 bg-red-400 rounded-full group-hover:bg-white"></div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
