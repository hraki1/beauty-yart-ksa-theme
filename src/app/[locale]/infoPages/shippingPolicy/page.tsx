"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ShippingPolicy() {
  const t = useTranslations("shippingPolicy");
  const contactEmail = "shipping@example.com";
  const contactPhone = "+123 456 7890";

  const domesticTableHeaders: string[] = t.raw(
    "sections.domesticShipping.table.headers"
  ) as string[];

  const domesticTableRows: string[][] = t.raw(
    "sections.domesticShipping.table.rows"
  ) as string[][];

  return (
    <div
      className="min-h-screen py-16"
      style={{
        backgroundImage: "linear-gradient(180deg, #FFEDE4 70%, white 100%)",
      }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="backdrop-blur-sm p-8 md:p-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-black mb-8 italic"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {t("title")}
          </h1>
          <p className="text-gray-700 mb-10 text-lg">
            {t("lastUpdated", { date: new Date().toLocaleDateString() })}
          </p>

          <div className="prose max-w-none">
            {/* Processing Time */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.processingTime.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.processingTime.content")}
              </p>
            </section>

            {/* Domestic Shipping */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.domesticShipping.title")}
              </h2>
              <div className="overflow-x-auto mb-6 rounded-lg shadow-sm">
                <table className="min-w-full bg-white/90 border border-gray-200 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100/80">
                      {domesticTableHeaders.map((header, index) => (
                        <th
                          key={index}
                          className="py-4 px-6 border-b text-left font-semibold text-black"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {domesticTableRows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="py-4 px-6 border-b text-gray-800"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-gray-700 text-base bg-gray-50/50 p-4 rounded-lg border-l-4 border-orange-200">
                {t("sections.domesticShipping.note")}
              </p>
            </section>

            {/* International Shipping */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.internationalShipping.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.internationalShipping.content")}
              </p>
            </section>

            {/* Order Tracking */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.orderTracking.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.orderTracking.content", { email: contactEmail })}
              </p>
            </section>

            {/* Shipping Restrictions */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.shippingRestrictions.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.shippingRestrictions.content")}
              </p>
            </section>

            {/* Delayed Orders */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.delayedOrders.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.delayedOrders.content")}
              </p>
            </section>

            {/* Incorrect Address */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.incorrectAddress.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.incorrectAddress.content")}
              </p>
            </section>

            {/* Lost Packages */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.lostPackages.title")}
              </h2>
              <p className="text-gray-800 leading-relaxed text-lg">
                {t("sections.lostPackages.content", { days: 14 })}
              </p>
            </section>

            {/* Returns & Exchanges */}
            <section className="mb-12">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.returnsExchanges.title")}
              </h2>
              <div className="text-gray-800 leading-relaxed text-lg">
                {t.rich("sections.returnsExchanges.content", {
                  link: (chunks) => <Link href="/contact">{chunks}</Link>,
                })}
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white/60 p-8 rounded-xl border border-orange-100">
              <h2
                className="text-3xl font-bold text-black mb-6 italic"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                {t("sections.contact.title")}
              </h2>
              <p className="text-gray-800 mb-4 text-lg leading-relaxed">
                {t("sections.contact.content")}
              </p>
              <div className="text-gray-800 space-y-2">
                <p className="flex items-center">
                  <span className="font-semibold text-black mr-2">Email:</span>
                  {t("sections.contact.details.email", { email: contactEmail })}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold text-black mr-2">Phone:</span>
                  {t("sections.contact.details.phone", { phone: contactPhone })}
                </p>
                <p className="flex items-center">
                  <span className="font-semibold text-black mr-2">Hours:</span>
                  {t("sections.contact.details.hours")}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
