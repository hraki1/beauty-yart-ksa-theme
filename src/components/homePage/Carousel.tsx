"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Collection } from "@/lib/models/collectionModal";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/parallax";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

interface CarouselProps {
  collections: Collection[];
}

function resolveImageSrc(input: unknown, fallback: string): string {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed !== "") return trimmed;
  }
  if (
    input &&
    typeof input === "object" &&
    "url" in (input as Record<string, unknown>) &&
    typeof (input as Record<string, unknown>).url === "string"
  ) {
    const url = (input as Record<string, unknown>).url as string;
    if (url.trim() !== "") return url;
  }
  return fallback;
}

function hasValidImageSrc(input: unknown): boolean {
  if (typeof input === "string") {
    return input.trim() !== "";
  }
  if (
    input &&
    typeof input === "object" &&
    "url" in (input as Record<string, unknown>) &&
    typeof (input as Record<string, unknown>).url === "string"
  ) {
    return ((input as Record<string, unknown>).url as string).trim() !== "";
  }
  return false;
}

const Carousel: React.FC<CarouselProps> = ({ collections }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  // If no collections, keep current behavior (hide component)
  if (collections.length === 0) {
    return null;
  }

  // Only display items with a valid image src
  const displayCollections = collections.filter((c) =>
    hasValidImageSrc((c as unknown as { image?: unknown }).image)
  );

  if (displayCollections.length === 0) {
    return null;
  }

  return (
    <div dir="ltr" className="mx-3 lg:mx-10 mt-3  relative bg-white overflow-visible px-2 md:px-8">
      {/* Swiper navigation arrows - hidden on mobile */}
      <button
        className="custom-swiper-prev hidden md:flex absolute left-0 md:left-1 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#3740ea] hover:text-white shadow-md rounded-full w-6 md:w-12 h-6 md:h-12 items-center justify-center transition-all duration-200 border border-gray-200"
        aria-label="Previous slide"
        type="button"
      >
        <AiOutlineLeft className="w-4 md:w-6 h-4 md:h-6" />
      </button>
      <button
        className="custom-swiper-next hidden md:flex absolute right-0 md:right-1 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-[#3740ea] hover:text-white shadow-md rounded-full w-6 md:w-12 h-6 md:h-12 items-center justify-center transition-all duration-200 border border-gray-200"
        aria-label="Next slide"
        type="button"
      >
        <AiOutlineRight className="w-4 md:w-6 h-4 md:h-6" />
      </button>

      <div className="rounded relative overflow-visible">
        <Swiper
          modules={[Parallax, Autoplay, Pagination, Navigation]}
          speed={900}
          parallax={true}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation={{
            nextEl: ".custom-swiper-next",
            prevEl: ".custom-swiper-prev",
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          className="h-[199px] md:h-[420px] lg:h-[570px] my-auto rounded-2xl relative overflow-visible"
        >
          <div
            slot="container-start"
            className="absolute inset-0 z-0"
            data-swiper-parallax="-30%"
          />

          {displayCollections.map((collection, idx) => {
            const imageSrc = resolveImageSrc(
              (collection as unknown as { image?: unknown }).image,
              ""
            );
            const altText = collection.name || `Banner ${idx + 1}`;

            return (
              <SwiperSlide key={collection.collection_id || idx}>
                <div
                  className="relative w-full h-[199px] md:h-[420px] lg:h-[520px] flex flex-row items-center cursor-pointer select-none bg-gradient-to-b from-[#dae6f6] to-[#f0f1f3] rounded overflow-visible"
                  onClick={() =>
                    router.push(`/shopGrid?collectionId=${collection.collection_id}`)
                  }
                >
                  {/* LEFT TEXT */}
                  <div className="flex-1 h-full flex flex-col justify-center items-start pl-2 sm:pl-8 md:pl-16 lg:pl-20 z-30">
                    <AnimatePresence mode="wait">
                      {activeIndex === idx && (
                        <motion.div
                          key={`text-${idx}`}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: .6 }}
                          className="rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
                        >
                          {/* Title with responsive sizing and staggered animation */}
                          <span
                            className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-2 sm:mb-3 leading-tight drop-shadow"
                          >
                            {collection.name}
                          </span>

                          {/* Description with responsive sizing and staggered animation */}
                          <p
                          
                            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 my-2 md:my-3"
                          >
                            {collection.description ||
                              "Discover our latest arrivals and exclusive offers!"}
                          </p>

                          {/* Button with responsive sizing and spring animation */}
                          <div
                          >
                            <button
                              className="text-[12px] sm:text-base md:text-lg px-3 sm:px-6 md:px-8 py-1.5 sm:py-2.5 md:py-3 rounded-full bg-[#3740ea] text-white font-bold hover:bg-[#219EBC] transition-all duration-200 w-fit shadow-lg hover:shadow-xl"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/shopGrid?collectionId=${collection.collection_id}`);
                              }}
                            >
                              Shop Now
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* RIGHT IMAGE */}
                  <div className="flex-1 h-full relative overflow-visible">
                    <div className="absolute top-0 md:top-6 right-2.5 md:right-[20px] lg:right-[40px] h-full w-full flex items-center pointer-events-none">
                      <Image
                        src={imageSrc}
                        alt={altText}
                        fill
                        className="object-contain md:scale-105 rounded-r-2xl"
                        priority={idx === 0}
                        style={{ objectPosition: "right" }}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
