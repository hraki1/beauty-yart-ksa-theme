"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/lib/models/collectionModal";

interface BannerSectionProps {
    banners: Collection[];
}

const BannersSection = ({ banners }: BannerSectionProps) => {
    if (!banners?.length) return null;

    // Display all banners, each as a large visual with centered text below (hero-like)
    const displayBanners = banners;

    return (
        <section className=" mx-5 py-8 md:px-8 lg:px-12 bg-white lg:mx-10">
            <div
                className="max-w-7xl mx-auto"
            >
                <div className="flex gap-14">
                    {displayBanners.map((banner, index) => (
                        <motion.article
                        whileHover={{
                            x: [0, 4, -7, 4, -7, 0] // يمين، يسار، يمين، يسار، رجوع
                          }}
                          transition={{
                            duration: 1, // مدة الهزّة
                            ease: "easeInOut"
                          }}
                            key={banner.collection_id}
                            className="max-w-5xl mx-auto w-full"
                        >
                            {/* Big image */}
                            {banner.image && (
                                <Link href={`/shopGrid?collectionId=${banner.collection_id}`} className="group block">
                                    <div className="relative w-full h-[340px] md:h-[520px] rounded overflow-hidden bg-gray-100">
                                        <Image
                                            src={banner.image}
                                            alt={banner.name}
                                            fill
                                            priority={index === 0}
                                            className="object-cover"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 70vw"
                                        />
                                    </div>
                                </Link>
                            )}

                            {/* Centered text below */}
                            <div className="text-center mt-6">
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                                    {banner.name}
                                </h3>
                                {banner.description && (
                                    <p className="mt-3 text-gray-600 md:text-base">
                                        {banner.description}
                                    </p>
                                )}
                                <Link
                                    href={`/shopGrid?collectionId=${banner.collection_id}`}
                                    className="mt-4 inline-block text-gray-700 underline underline-offset-4 decoration-gray-300 hover:decoration-gray-700"
                                >
                                    {`Shop ${banner.name.toLowerCase()}`}
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BannersSection; 