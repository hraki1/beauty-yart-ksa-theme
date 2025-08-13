"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import ProgressBar from "./ProgressBar";
import type { Order } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  viewType?: string;
}

const statusConfig = {
  pending: { color: "text-gray-400", bg: "bg-gray-100", glow: "shadow-gray-200", label: "Pending" },
  processing: { color: "text-yellow-600", bg: "bg-yellow-100", glow: "shadow-yellow-200", label: "Processing" },
  shipped: { color: "text-blue-600", bg: "bg-blue-100", glow: "shadow-blue-200", label: "Shipped" },
  delivered: { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" },
  cancelled: { color: "text-red-600", bg: "bg-red-100", glow: "shadow-red-200", label: "Cancelled" },
  completed: { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" }, // unify completed with delivered
  unknown: { color: "text-gray-500", bg: "bg-gray-200", glow: "shadow-gray-300", label: "Unknown" }
} as const;

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const t = useTranslations("trackOrders.orderCard");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  // Treat 'completed' as 'delivered' here for consistent UI
  const effectiveStatus = order.status === "completed" ? "delivered" : order.status;
  const config = statusConfig[effectiveStatus as keyof typeof statusConfig] ?? statusConfig.unknown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{
        boxShadow: config?.glow
          ? `0 8px 32px rgba(0,0,0,0.1), 0 0 20px ${config.glow.replace("shadow-", "rgba(")}, 0.1)`
          : "0 8px 32px rgba(0,0,0,0.1)"
      }}
    >
      {/* Header */}
      <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} items-start mb-4`}>
        <div>
          <h3 className="font-semibold text-gray-900">{order.order_number}</h3>
          <p className="text-sm text-gray-600">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
        <motion.span
          className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
          animate={{
            boxShadow: [`0 0 0px ${config.color}`, `0 0 10px ${config.color}`, `0 0 0px ${config.color}`]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {config.label}
        </motion.span>
      </div>

      {/* Carousel */}
      <div className={`flex gap-2 mb-4 overflow-x-auto ${isRTL ? "flex-row-reverse" : ""}`}>
        {order.items.slice(0, 3).map((item, index) => (
          <motion.img
            key={index}
            src={item.product.images[0]?.origin_image}
            alt={item.product_name}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            whileHover={{ scale: 1.1 }}
          />
        ))}
        {order.items.length > 3 && (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-600">
            +{order.items.length - 3}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <ProgressBar status={effectiveStatus} />
      </div>

      {/* Footer */}
      <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} items-center`}>
        <span className="font-bold text-lg">${order.grand_total}</span>
        <motion.button
          onClick={() => onViewDetails(order)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${config.bg} ${config.color} hover:opacity-80 transition-opacity flex items-center gap-2`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Eye className="w-4 h-4" />
          {t("trackOrder")}
        </motion.button>
      </div>
    </motion.div>
  );
}
