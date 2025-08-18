"use client";

import React, { JSX, useState } from "react";
import Image from "next/image";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import { useTranslations } from "next-intl";

type CardType = "skincare" | "makeup" | "body" | null;

export default function BeautyLandingPage(): JSX.Element {
  const t = useTranslations("aboutUs");
  const [hoveredCard, setHoveredCard] = useState<CardType>(null);

  const handleInstagramClick = (): void => {
    if (typeof window !== "undefined") {
      window.open("https://instagram.com", "_blank");
    }
  };

  type CardKey = Exclude<CardType, null>;

  const categories: {
    key: CardKey;
    name: string;
    href: string;
    img: string;
    textColor: string;
    extraClass: string;
  }[] = [
    {
      key: "skincare",
      name: t("categories.skincare"),
      href: "/category/skincare",
      img: "https://crido.wpbingosite.com/wp-content/uploads/2021/08/img2-1.jpg",
      textColor: "text-white",
      extraClass: "",
    },
    {
      key: "makeup",
      name: t("categories.makeup"),
      href: "/category/makeup",
      img: "https://crido.wpbingosite.com/wp-content/uploads/2021/08/img2-2.jpg",
      textColor: "text-black",
      extraClass: "mt-24",
    },
    {
      key: "body",
      name: t("categories.body"),
      href: "/category/body",
      img: "https://crido.wpbingosite.com/wp-content/uploads/2021/08/img2-3.jpg",
      textColor: "text-white",
      extraClass: "",
    },
  ];

// Prepare features manually with translations and SVGs
const features = [
  {
    title: t("features.shipping.title"),
    desc: t("features.shipping.desc"),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 508 508"
        className="w-16 h-16 text-amber-600 fill-current transition-colors duration-300"
      >
        <path d="M430.4,0H77.6L0,112.1V508h508V112.1L430.4,0z M335.9,16.4h85.8l62.5,90.1H335.9V16.4z M188.5,16.4h131.1v90.1H188.5V16.4z M188.4,122.9h0.1h131.1v74.8l-16.4-10.9l-24.6,16.4L254,186.8l-24.6,16.4l-24.6-16.4l-16.4,10.9V122.9z M86.2,16.4H172v90.1H23.8L86.2,16.4z M491.8,491.6H16.4V122.9h155.7v105.4l32.8-21.9l24.6,16.4l24.6-16.4l24.6,16.4l24.6-16.4l32.8,21.9V122.9h155.7V491.6z"></path>
        <polygon points="417.9,373.5 387.5,403.9 399.1,415.5 409.7,404.9 409.7,458.8 426.1,458.8 426.1,404.9 436.7,415.5 448.2,403.9"></polygon>
        <polygon points="344.1,373.5 313.8,403.9 325.3,415.5 335.9,404.9 335.9,458.8 352.3,458.8 352.3,404.9 362.9,415.5 374.5,403.9"></polygon>
      </svg>
    ),
  },
  {
    title: t("features.return.title"),
    desc: t("features.return.desc"),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 508 508"
        className="w-16 h-16 text-amber-600 fill-current transition-colors duration-300"
      >
        <path d="M254,0C128.3,0,26.1,102.2,26.1,227.9c0,122.9,97.9,223.4,219.8,227.7V508l60.3-60.3l-60.3-60.3v52c-113-4.4-203.5-97.5-203.5-211.5c0-116.7,94.9-211.6,211.6-211.6s211.6,94.9,211.6,211.6h16.3C481.9,102.2,379.7,0,254,0z M262.1,426.6l21,21l-21,21V426.6z"></path>
        <path d="M131.9,105.8V350h244.2V105.8H131.9z M229.6,122.1L229.6,122.1h48.8v32.6h-48.8V122.1z M359.8,333.7H148.2V122.1h65.1v48.8h81.4v-48.8h65.1V333.7z"></path>
        <polygon points="319.1,248.2 291.2,279.5 303.4,290.3 311,281.8 311,317.4 327.3,317.4 327.3,281.8 334.8,290.3 347,279.5"></polygon>
        <polygon points="251.4,248.2 223.5,279.5 235.7,290.3 243.2,281.8 243.2,317.4 259.5,317.4 259.5,281.8 267.1,290.3 279.2,279.5"></polygon>
      </svg>
    ),
  },
  {
    title: t("features.payment.title"),
    desc: t("features.payment.desc"),
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 508 508"
        className="w-16 h-16 text-amber-600 fill-current transition-colors duration-300"
      >
        <path d="M376.7,0H131.3c2,61.4-43.6,101.1-98.2,98.2v68.4C37.6,423,254,508,254,508s214.3-85,220.9-341.4V98.2C407.9,103.9,371.7,41.3,376.7,0z M49.5,166.6v-52.4c52.1-4,93.9-45.7,97.9-97.9h98.5v106.8c-47.6,4-85.6,42-89.6,89.6H52.6C50.6,197.5,49.5,182.1,49.5,166.6z M245.8,485.9C144.9,434.8,74.6,338.7,55,229h101.2c4,47.6,42,85.6,89.6,89.6V485.9z M172.2,220.9c0-45.1,36.7-81.8,81.8-81.8c45.1,0,81.8,36.7,81.8,81.8c0,45.1-36.7,81.8-81.8,81.8C208.9,302.7,172.2,266,172.2,220.9z M262.2,485.9V318.6c47.6-4,85.6-42,89.6-89.6H453C433.4,338.7,363.1,434.8,262.2,485.9z M458.5,166.6c0,15.5-1.1,30.9-3.1,46.1H351.7c-4-47.6-42-85.6-89.6-89.6V16.4h98.5c4,52.1,45.8,93.8,97.9,97.8V166.6z"></path>
        <polygon points="295.8,182.4 236.2,242 212.2,218.1 200.6,229.6 236.2,265.2 307.4,193.9"></polygon>
      </svg>
    ),
  },
];



  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Fixed Background */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url("https://crido.wpbingosite.com/wp-content/uploads/2021/09/about-1.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="text-center text-black max-w-4xl">
            <h1
              className="mb-8 leading-tight italic"
              style={{
                fontFamily: '"Playfair Display", serif',
                fontSize: "100px",
                fontWeight: 400,
              }}
            >
              {t("hero.title")}
            </h1>
            <div className="w-32 h-0.5 bg-black mx-auto mb-12"></div>
            <p className="text-sm tracking-[0.3em] uppercase mb-16">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Text Section with Shop Now */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-2xl text-gray-800 mb-8 leading-relaxed font-light font-Europa">
            {t("intro")}
          </p>
          <div className="inline-block">
            <button className="text-lg text-black font-Europa font-medium hover:text-gray-600 transition-colors duration-300 relative group">
              {t("hero.button")}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform scale-x-100 transition-transform duration-300"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className={`group relative cursor-pointer transform transition-all duration-500 ease-in-out ${cat.extraClass}`}
                onMouseEnter={() => setHoveredCard(cat.key)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  animation: hoveredCard === cat.key ? "bounce 1.5s ease-in-out 1" : "none",
                }}
              >
                <div className="relative overflow-hidden h-[28rem] duration-300">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 "></div>
                  <h3
                    className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-2xl font-Europa ${cat.textColor} group-hover:text-[#a07542] transition-colors duration-300`}
                  >
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
     <section className="py-20 px-6 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
      {features.map((feature, idx) => (
        <div key={idx} className="text-center group">
          <div className="mb-6">
            <div className="flex items-center justify-center mx-auto transform transition-all duration-300 group-hover:scale-110">
              {feature.svg}
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Beauty Inspired Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://crido.wpbingosite.com/wp-content/uploads/2021/09/img5-1.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">
            {t("beautyInspired.title")}
          </h2>
          <p className="text-4xl md:text-5xl font-serif italic mb-12 text-gray-200">
            {t("beautyInspired.subtitle")}
          </p>

          <p className="text-lg mb-12 max-w-2xl mx-auto leading-relaxed text-gray-200">
            {t("beautyInspired.desc")}
          </p>

          <div className="inline-block">
            <button className="px-10 py-4 bg-white text-gray-900 text-sm font-medium tracking-wide uppercase hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
              {t("beautyInspired.button")}
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-Europa text-gray-900 mb-4">
            {t("newsletter.title")}
          </h3>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            {t("newsletter.desc")}
          </p>

          <div className="flex max-w-md mx-auto border-b-2 border-gray-300 focus-within:border-gray-900 transition-colors duration-300">
            <input
              type="email"
              placeholder={t("newsletter.placeholder")}
              className="flex-1 px-2 py-4 outline-none bg-transparent text-lg placeholder-gray-500"
            />
            <button className="px-8 py-4 text-gray-900 font-semibold hover:text-amber-600 transition-colors duration-300 tracking-wide">
              {t("newsletter.button")}
            </button>
          </div>
        </div>
      </section>

      {/* Instagram Gallery Section */}
      <section className="grid grid-cols-2 md:grid-cols-5 h-64">
        {[
          "https://crido.wpbingosite.com/wp-content/uploads/2021/09/4.jpg",
          "https://crido.wpbingosite.com/wp-content/uploads/2021/09/3.jpg",
          "https://crido.wpbingosite.com/wp-content/uploads/2021/09/2.jpg",
          "https://crido.wpbingosite.com/wp-content/uploads/2021/09/1.jpg",
          "https://crido.wpbingosite.com/wp-content/uploads/2021/09/8.jpg",
        ].map((image: string, index: number) => (
          <div
            key={index}
            className="relative overflow-hidden cursor-pointer group"
            onClick={handleInstagramClick}
          >
            <Image
              src={image}
              alt={`Instagram post ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <FaInstagram className="text-white text-4xl transform scale-75 group-hover:scale-100 transition-transform duration-300" />
            </div>
          </div>
        ))}
      </section>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
