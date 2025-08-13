"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/lib/models/collectionModal";

interface BannerSectionProps {
    banners: Collection[];
}

const BannerSection = ({ banners }: BannerSectionProps) => {
    if (!banners?.length) return null;

    // Take only the first two banners
    const displayBanners = banners.slice(0, 2);

    return (
        <section className=" mx-5 py-8 md:px-8 lg:px-12 bg-white lg:mx-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                {/* Section Title */}
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center"
                >
                    Hurry Up Deals
                </motion.h2>

                {/* Banners Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {displayBanners.map((banner, index) => (
                        <motion.div
                            key={banner.collection_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative overflow-hidden rounded-2xl transition-shadow duration-300"
                        >
                            <Link href={`/shopGrid?collectionId=${banner.collection_id}`}>
                                <div className="relative h-52  md:h-72 bg-[#E0DCF6] flex">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
                                        <div className="absolute bottom-8 left-8 w-16 h-16 bg-white rounded-full"></div>
                                        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
                                    </div>

                                    {/* Text Content - Left Side */}
                                    <div className="relative z-10 flex-1 flex flex-col justify-center p-6 md:p-8">
                                        <div className="text-black">
                                            <h3 className="text-2xl md:text-3xl font-bold mb-2">
                                                {banner.name}
                                            </h3>
                                            {banner.description && (
                                                <p className="text-gray-700 text-sm md:text-base mb-4">
                                                    {banner.description}
                                                </p>
                                            )}
                                            {/* CTA Button */}
                                            <motion.button
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-white text-blue-500 hover:text-black px-6 py-3 rounded-full font-semibold text-sm md:text-base hover:bg-gray-50 transition-colors duration-200 w-fit"
                                            >
                                                Shop Now
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Product Image - Right Side */}
                                    {banner.image && (
                                        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
                                            <div className="relative w-32 h-32 md:w-40 md:h-40">
                                                <Image
                                                    src={banner.image}
                                                    alt={banner.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    sizes="(max-width: 768px) 128px, 160px"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default BannerSection; 