"use client";

import React from "react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";
import type { Order } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { getEffectiveStatus } from "@/components/orders/ProgressBar";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  viewType?: string;
}

const statusConfig = {
  pending: { color: "text-black", bg: "bg-gray-200", label: "Pending", accent: "border-gray-300" },
  processing: { color: "text-black", bg: "bg-gray-300", label: "Processing", accent: "border-gray-400" },
  shipped: { color: "text-white", bg: "bg-gray-600", label: "Shipped", accent: "border-gray-600" },
  completed: { color: "text-white", bg: "bg-black", label: "Delivered", accent: "border-black" },
  delivered: { color: "text-white", bg: "bg-black", label: "Delivered", accent: "border-black" },
  cancelled: { color: "text-white", bg: "bg-gray-800", label: "Cancelled", accent: "border-gray-800" },
  refunded: { color: "text-white", bg: "bg-gray-700", label: "Refunded", accent: "border-gray-700" },
  on_hold: { color: "text-black", bg: "bg-gray-300", label: "On Hold", accent: "border-gray-400" },
  failed: { color: "text-white", bg: "bg-gray-800", label: "Failed", accent: "border-gray-800" },
  unknown: { color: "text-black", bg: "bg-gray-100", label: "Unknown", accent: "border-gray-200" },
} as const;

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const t = useTranslations("trackOrders.orderCard");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // ✅ Only one effectiveStatus now
  const effectiveStatus = getEffectiveStatus(
    order.status,
    order.shipment_status,
    order.payment_status
  );

  const config = statusConfig[effectiveStatus as keyof typeof statusConfig] ?? statusConfig.unknown;

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative"
    >
      {/* Backdrop Card */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-lg rounded-3xl border border-white/40 shadow-xl transform rotate-1"></div>

      {/* Main Card */}
      <div className={`relative bg-white/90 backdrop-blur-sm border-2 ${config.accent} rounded-3xl p-8 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-black/10`}>
        {/* Floating Status Badge */}
        <div className="absolute -top-3 -right-3">
          <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${config.bg} ${config.color} shadow-lg border-2 border-white`}>
            {config.label}
          </span>
        </div>

        {/* Header Section */}
        <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} items-start mb-6`}>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-black font-['Playfair_Display'] italic tracking-wide">
              {order.order_number}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <time>
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </div>
        </div>

        {/* Product Gallery */}
        <div className={`mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Items Preview</h4>
          <div className={`flex gap-3 overflow-x-auto pb-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {(order.items || []).slice(0, 4).map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative flex-shrink-0 mr-1.5"
              >
                <Image
                  src={item.product?.images?.[0]?.origin_image || "/placeholder.png"}
                  alt={item.product_name || "Product image"}
                  width={64}
                  height={64}
                  className="rounded-2xl object-cover border-2 mt-2.5 border-white shadow-md"
                />
                <div className="absolute -top-2 mt-2.5 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                  {item.qty}
                </div>
              </motion.div>
            ))}
            {(order.items || []).length > 4 && (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-md flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">
                  +{(order.items || []).length - 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <ProgressBar
            status={order.status}
            shipmentStatus={order.shipment_status}
            paymentStatus={order.payment_status}
            animated
          />
        </div>

        {/* Footer Actions */}
        <div className={`flex ${isRTL ? "flex-row-reverse gap-24" : "justify-between"} items-center`}>
          <div className="space-y-1">
            <span className="text-2xl font-bold text-black tracking-tight">${order.grand_total}</span>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
          </div>

          <motion.button
            onClick={() => onViewDetails(order)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group/btn relative px-6 py-3 rounded-2xl font-semibold text-sm overflow-hidden transition-all duration-300 ${config.bg} ${config.color} border-2 border-transparent hover:border-current shadow-lg hover:shadow-xl`}
          >
            <div className="flex items-center gap-2 relative z-10">
              <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{t("trackOrder")}</span>
            </div>
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
