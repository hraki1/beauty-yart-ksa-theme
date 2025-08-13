"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MdMenu } from "react-icons/md";
import Spinner from "../UI/SpinnerLoading";
import { useCategories } from "@/store/CategoriesContext";
import { useBrands } from "@/store/BrandsContext";
import { Category } from "@/lib/models/categoryModal";
import { BrandWithProducts } from "@/lib/models/brandsModal";


interface Group {
  name: string;
  subcategories: string[]; // names only
  ids: number[];
}

export default function PremiumNavWidget() {
  const t = useTranslations("navbar");
  const [groups, setGroups] = useState<Group[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);


  const { categories } = useCategories()
  const { brands, isLoading: isLoadingBrands, error: errorBrands, refetch } = useBrands();


  useEffect(() => {
    if (categories && brands) {
      const newGroups = [
        {
          name: t("categories"),
          subcategories: categories.map((cat: Category) => cat.description.name),
          ids: categories.map((cat: Category) => cat.id),
        },
        {
          name: t("brands"),
          subcategories: brands.map((brand: BrandWithProducts) => brand.name),
          ids: brands.map((brand: BrandWithProducts) => brand.id),
        },
      ];
      setGroups(newGroups);
    }
  }, [categories, brands, t]);


  if (isLoadingBrands) {
    return (
      <div className="my-40 mt-56">
        <Spinner />
      </div>
    );
  }

  if (errorBrands) {
    return (
      <div className="text-center py-10">
        <h3 className="text-red-500">{errorBrands.name}</h3>
        <p className="py-10">{errorBrands.message}</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <>
      {/* Premium Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 group focus:outline-none focus:ring-2 focus:ring-black rounded"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        type="button"
      >
        <div className="flex flex-col gap-1.5 items-center relative w-8 h-8">
          {/* Hamburger lines */}
          <MdMenu className="text-4xl text-black " />
          {/* Cross lines */}
          <motion.span
            className="absolute bg-gray-800 rounded h-1 w-6 top-1/2 left-0 origin-center"
            animate={{
              rotate: isOpen ? 45 : 0,
              y: isOpen ? 1 : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute bg-gray-800 rounded h-1 w-6 top-1/2 left-0 origin-center"
            animate={{
              rotate: isOpen ? -45 : 0,
              y: isOpen ? -1 : 0,
              opacity: isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </button>

      {/* Luxury Off-Canvas Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Frosted Glass Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-lg z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Sleek Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="fixed flex-1 overflow-y-auto min-h-0 px-3 top-0 right-0 h-full w-3/4 max-w-md bg-white z-50 shadow-xl flex flex-col border-l border-gray-100"
            >
              {/* Minimal Header */}
              <div className="flex justify-between items-center p-5">
                <div className=" font-medium tracking-tight text-2xl">
                  {t("browse")}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-50 rounded-full transition-all"
                  aria-label="Close menu"
                >
                  <FiX className="text-gray-500" size={22} />
                </button>
              </div>

              {/* Premium Category Navigation */}
              <div className="flex-1  px-3">
                <ul className="space-y-1">
                  {groups.map((category) => (
                    <li key={category.name}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="origin-left"
                      >
                        <button
                          onClick={() =>
                            setActiveCategory(
                              activeCategory === category.name
                                ? null
                                : category.name
                            )
                          }
                          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all"
                        >
                          <span className="font-medium text-gray-900">
                            {category.name}
                          </span>
                          <motion.div
                            animate={{
                              rotate: activeCategory === category.name ? 90 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronRight className="text-gray-400" />
                          </motion.div>
                        </button>
                      </motion.div>

                      <AnimatePresence>
                        {activeCategory === category.name && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              transition: {
                                opacity: { duration: 0.2 },
                                height: { duration: 0.3 },
                              },
                            }}
                            exit={{
                              opacity: 0,
                              height: 0,
                              transition: {
                                opacity: { duration: 0.1 },
                                height: { duration: 0.2 },
                              },
                            }}
                            className="pl-6 overflow-hidden"
                          >
                            {category.subcategories.map(
                              (subcategory, index) => (
                                <motion.li
                                  key={subcategory}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: 0.1 },
                                  }}
                                >
                                  <Link
                                    href={`/shopGrid?${category.name === "Categories" ||
                                      category.name === "الأقسام"
                                      ? "categoryid"
                                      : "brandid"
                                      }=${category.ids[index]}`}
                                    className="block py-3 px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subcategory}
                                  </Link>
                                </motion.li>
                              )
                            )}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  ))}
                </ul>
              </div>

              {/* <ul>
                <li className="px-8 py-5 text-[18px] ">
                  <CurrencySelector />
                </li>
                <li className="px-8 py-5 text-[18px] ">
                <Language languages={languages} />
                </li>
                <li className="px-8 py-5 text-[18px] flex">
                  <Link
                    href={"/wishlist"}
                    className=" cursor-pointer flex gap-4 items-center"
                  >
                    {t("wishlist")}
                    <FaRegHeart className=" hover:opacity-75" />
                  </Link>
                </li>
                <li className="px-8 py-5 text-[18px]">
                  <Link href={"/infoPages/faq"} onClick={() => setIsOpen(false)}>
                    {t("pubulareQuestion")}
                  </Link>
                </li>
                <li className="px-8 py-5 text-[18px]">
                  <Link href={"/infoPages/about"} onClick={() => setIsOpen(false)}>
                    {t("aboutUs")}
                  </Link>
                </li>
              </ul> */}
              {/* User Section */}
              {/* {isAuthenticated ? (
                <div className="p-5 border-t border-gray-100">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FiUser className="text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium text-[22px]">
                        {user?.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {t("viewProfile")}
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className=" bg-white bottom-0 p-5 border-t border-gray-100">
                  <button
                    className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all w-full"
                    onClick={() => {
                      openAuthModal();
                      setIsOpen(false);
                    }}
                  >
                    <FiLogIn className="text-lg" />
                    <span className="font-medium text-[16px]">
                      {t("login")}
                    </span>
                  </button>
                </div>
              )} */}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
