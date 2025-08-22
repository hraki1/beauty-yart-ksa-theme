"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  Heart,
  Leaf,
  Shield,
} from "lucide-react";

const HelpFAQPage: React.FC = () => {
  const router = useRouter(); // Added for navigation
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      category: "Product Information",
      questions: [
        {
          question: "What makes your skincare products truly organic?",
          answer:
            "All our products are certified organic, containing 95%+ organic ingredients. We source from sustainable farms and use no synthetic preservatives, parabens, sulfates, or artificial fragrances. Each product is third-party certified by USDA Organic standards.",
        },
        {
          question: "Are your products suitable for sensitive skin?",
          answer:
            "Yes! Our gentle, natural formulations are specifically designed for all skin types, including sensitive skin. We avoid harsh chemicals and allergens. However, we always recommend doing a patch test before using any new product.",
        },
        {
          question: "How long do organic skincare products last?",
          answer:
            "Our products have a shelf life of 12-24 months unopened. Once opened, we recommend using within 6-12 months. Since we don't use synthetic preservatives, natural products have shorter lifespans but maintain their potency and purity.",
        },
        {
          question: "Do you test on animals?",
          answer:
            "Absolutely not. We are proudly cruelty-free and never test on animals. We're certified by Leaping Bunny and use only ethically sourced, plant-based ingredients.",
        },
      ],
    },
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 days) is available. International shipping takes 7-14 business days. You'll receive tracking information once your order ships.",
        },
        {
          question: "What is your return policy?",
          answer:
            "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, return it within 30 days for a full refund. Products should be at least 50% full for hygiene reasons.",
        },
        {
          question: "Do you offer free shipping?",
          answer:
            "Yes! We offer free standard shipping on orders over $50 within the US. For orders under $50, shipping is $5.95. Free international shipping is available on orders over $100.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Absolutely! Once your order ships, you'll receive an email with tracking information. You can also track your order by logging into your account on our website.",
        },
      ],
    },
    {
      category: "Usage & Care",
      questions: [
        {
          question: "How should I store my organic skincare products?",
          answer:
            "Store products in a cool, dry place away from direct sunlight. Most products are fine at room temperature, but some serums and oils benefit from refrigerator storage to extend freshness.",
        },
        {
          question: "In what order should I apply my skincare products?",
          answer:
            "Follow this order: cleanser, toner, serums (thinnest to thickest), moisturizer, then sunscreen (AM only). Wait 1-2 minutes between each step to allow proper absorption.",
        },
        {
          question: "How often should I use face masks?",
          answer:
            "For most skin types, 1-2 times per week is ideal. If you have sensitive skin, start with once a week. Clay masks can be drying, so limit to once weekly, while hydrating masks can be used more frequently.",
        },
        {
          question: "Can I use multiple serums together?",
          answer:
            "Yes, but introduce one at a time to see how your skin reacts. Apply from thinnest to thickest consistency. Avoid mixing active ingredients like vitamin C and retinol in the same routine.",
        },
      ],
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #FFEDE4 70%, #FFFFFF 100%)",
        fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Leaf className="w-8 h-8 text-green-600 mr-3" />
            <h1
              className="text-5xl font-light text-gray-800"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Help & Support
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We&apos;re here to help you on your natural skincare journey. Find
            answers to common questions or reach out to our expert team.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-light text-gray-800 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our natural organic skincare
              products and services.
            </p>
          </div>

          {faqs.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-center mb-8">
                <div className="w-2 h-8 bg-green-500 rounded-full mr-4"></div>
                <h3
                  className="text-2xl font-light text-gray-800"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {category.category}
                </h3>
              </div>

              <div className="space-y-4">
                {category.questions.map((faq, index) => {
                  const faqIndex = categoryIndex * 100 + index;
                  return (
                    <div
                      key={faqIndex}
                      className="border-b border-gray-200 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleFAQ(faqIndex)}
                        className="w-full text-left py-6 flex justify-between items-start hover:bg-white/50 rounded-lg px-4 transition-colors duration-200"
                      >
                        <h4 className="text-lg font-medium text-gray-800 pr-4 leading-relaxed">
                          {faq.question}
                        </h4>
                        <div className="flex-shrink-0 ml-4">
                          {openFAQ === faqIndex ? (
                            <ChevronUp className="w-5 h-5 text-green-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {openFAQ === faqIndex && (
                        <div className="px-4 pb-6 -mt-2">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-pink-500 mr-2" />
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3
              className="text-3xl font-light text-gray-800 mb-4"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Our skincare experts are passionate about helping you achieve
              healthy, glowing skin naturally. We&apos;re here to provide
              personalized guidance for your unique skin needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/infoPages/contact")}
                className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Contact Our Experts
              </button>
              <button
                onClick={() => router.push("/shopGrid")}
                className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full hover:bg-green-50 transition-colors duration-200 font-medium"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpFAQPage;
