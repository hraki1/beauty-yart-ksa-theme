"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import ProgressBar from "./ProgressBar";
import type { Order } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";
import type { OrderStatus } from "@/lib/models/orderModal";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  viewType?: string;
}

// Updated status config with black/white theme
const statusConfig = {
  pending: { color: "text-black", bg: "bg-gray-200", label: "Pending" },
  processing: { color: "text-black", bg: "bg-gray-300", label: "Processing" },
  shipped: { color: "text-white", bg: "bg-gray-600", label: "Shipped" },
  completed: { color: "text-white", bg: "bg-black", label: "Delivered" },
  delivered: { color: "text-white", bg: "bg-black", label: "Delivered" },
  cancelled: { color: "text-white", bg: "bg-gray-800", label: "Cancelled" },
  refunded: { color: "text-white", bg: "bg-gray-700", label: "Refunded" },
  on_hold: { color: "text-black", bg: "bg-gray-300", label: "On Hold" },
  failed: { color: "text-white", bg: "bg-gray-800", label: "Failed" },
  unknown: { color: "text-black", bg: "bg-gray-100", label: "Unknown" },
} as const;

function getStatusConfigKey(status: OrderStatus): keyof typeof statusConfig {
  return status in statusConfig ? status : "unknown";
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const t = useTranslations("trackOrders.orderCard");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const effectiveStatus = getStatusConfigKey(order.status);
  const config = statusConfig[effectiveStatus];
  const displayLabel = config.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white/90 backdrop-blur-sm border border-gray-300 rounded-xl p-6 transition-all shadow-sm"
    >
      {/* Header */}
      <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} items-start mb-4`}>
        <div>
          <h3 className="font-semibold text-black font-['Playfair_Display'] italic">{order.order_number}</h3>
          <p className="text-sm text-black">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
          {displayLabel}
        </span>
      </div>

      {/* Items Preview */}
      <div className={`flex gap-2 mb-4 overflow-x-auto ${isRTL ? "flex-row-reverse" : ""}`}>
        {(order.items || []).slice(0, 3).map((item, index) => (
          <motion.img
            key={index}
            src={item.product?.images?.[0]?.origin_image || ""}
            alt={item.product_name || ""}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200"
            whileHover={{ scale: 1.05 }}
          />
        ))}
        {(order.items || []).length > 3 && (
          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-xs text-black font-medium">
            +{(order.items || []).length - 3}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar status={order.status} />
      </div>

      {/* Footer */}
      <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} items-center`}>
        <span className="font-bold text-lg text-black">${order.grand_total}</span>
        <motion.button
          onClick={() => onViewDetails(order)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${config.bg} ${config.color} flex items-center gap-2 border border-gray-300 hover:opacity-90 transition-opacity`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Eye className="w-4 h-4" />
          {t("trackOrder")}
        </motion.button>
      </div>
    </motion.div>
  );
}