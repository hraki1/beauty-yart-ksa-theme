"use client";

import { motion } from "framer-motion";
import { Collection } from "@/lib/models/collectionModal";
import { transformProductToCollectionCartItem } from "@/utils/trnsformProductsCollecionCardOItem";
import { FiShoppingBag, FiCheck } from "react-icons/fi";
import HorizontalBundleProducts from "./products/HorizontalBundleProducts";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useContext, useState } from "react";
import { CartContext } from "@/store/CartContext";
import { AuthModalContext } from "@/store/AuthModalContext";
import { useAuth } from "@/store/AuthContext";
import toast from "react-hot-toast";

interface BundleProductsProps {
    collections: Collection[];
}

const BundleProducts = ({ collections }: BundleProductsProps) => {
    const t = useTranslations("BundleProducts");
    const { addToCart, isLoadingAddToCart } = useContext(CartContext);
    const { openAuthModal } = useContext(AuthModalContext);
    const { isAuthenticated } = useAuth();
    const [isAddingAll, setIsAddingAll] = useState(false);
    const [hasAddedAll, setHasAddedAll] = useState(false);

    // Get all products from all collections and take first 3
    const allProducts = collections
        .flatMap(collection =>
            collection.products.map(product => ({
                ...transformProductToCollectionCartItem(product),
                collectionName: collection.name
            }))
        )
        .slice(0, 3);

    if (allProducts.length < 3) return null;

    const handleAddAllToCart = async () => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }

        if (isAddingAll || hasAddedAll) return;

        setIsAddingAll(true);

        try {
            // Add all products to cart simultaneously for better performance
            const addPromises = allProducts.map(product =>
                new Promise<void>((resolve) => {
                    addToCart(product.id, 1);
                    // Minimal delay to prevent API overload
                    setTimeout(resolve, 50);
                })
            );

            await Promise.all(addPromises);

            setHasAddedAll(true);
            toast.success(`${allProducts.length} products added to cart successfully!`);

            // Reset the state after 2.5 seconds (faster reset)
            setTimeout(() => {
                setHasAddedAll(false);
            }, 2500);

        } catch {
            toast.error("Failed to add all products to cart");
        } finally {
            setIsAddingAll(false);
        }
    };

    return (
        <section className="mx-5 py-8 md:px-6 lg:px-6 bg-white lg:mx-3">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl text-center md:text-4xl font-bold text-gray-900 mb-8"
                >
                    {t("title")}
                </motion.h2>

                {/* Bundle Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Promotional Card - Same size as product */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-gradient-to-br from-[#5F67EE] to-[#b1b3f0] rounded-xl p-4 flex flex-col justify-center items-center text-center shadow hover:shadow-lg transition-shadow duration-300 h-full">
                            <div className="flex flex-col justify-center">
                                <h3 className="text-lg md:text-xl font-bold mb-4 text-white">
                                    {t("promotionalCard.title")}
                                </h3>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-black text-white px-6 py-2 rounded-full font-semibold text-lg hover:bg-gray-700 transition-colors duration-200 mt-4"
                            >
                                <Link href={"/shopGrid"}>
                                    {t("promotionalCard.button")}
                                </Link>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Right Products Area - 3 products vertical + button */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Products Grid - 3 products in a column */}
                        <HorizontalBundleProducts products={allProducts} title="Bundle" />

                        {/* ADD ALL TO CART Button */}
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: hasAddedAll ? 1 : 1.02 }}
                            whileTap={{ scale: hasAddedAll ? 1 : 0.98 }}
                            onClick={handleAddAllToCart}
                            disabled={isAddingAll || hasAddedAll || isLoadingAddToCart}
                            className={`w-full py-4 rounded-xl font-semibold md:text-lg transition-all duration-200 flex items-center justify-center gap-3 ${hasAddedAll
                                ? 'bg-green-600 text-white cursor-default shadow-lg'
                                : isAddingAll || isLoadingAddToCart
                                    ? 'bg-indigo-600 text-white cursor-not-allowed shadow-lg'
                                    : 'bg-black text-white hover:bg-gray-700 cursor-pointer shadow-md hover:shadow-lg'
                                }`}
                        >
                            {hasAddedAll ? (
                                <>
                                    <FiCheck className="w-5 h-5" />
                                    <span>Added to Cart!</span>
                                </>
                            ) : (
                                <>
                                    {isAddingAll || isLoadingAddToCart ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Adding {allProducts.length} items...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiShoppingBag className="w-5 h-5" />
                                            <span>{t("addAllToCart")}</span>
                                        </>
                                    )}
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default BundleProducts; 