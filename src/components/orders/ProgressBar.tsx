"use client";

import React from "react";
import { motion } from "framer-motion";
import type { OrderStatus, ShipmentStatus, PaymentStatus } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";

interface ProgressBarProps {
  status: OrderStatus | string;
  shipmentStatus?: ShipmentStatus | string | null;
  paymentStatus?: PaymentStatus | string | null;
  animated?: boolean;
  className?: string;
}

const statusConfig = {
  pending: {
    color: "text-gray-600",
    bg: "bg-gray-100",
    accent: "bg-gray-300",
    label: "Pending",
  },
  processing: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    accent: "bg-yellow-400",
    label: "Processing",
  },
  shipped: {
    color: "text-blue-700",
    bg: "bg-blue-100",
    accent: "bg-blue-500",
    label: "Shipped",
  },
  delivered: {
    color: "text-green-700",
    bg: "bg-green-100",
    accent: "bg-green-500",
    label: "Delivered",
  },
  cancelled: {
    color: "text-red-700",
    bg: "bg-red-100",
    accent: "bg-red-500",
    label: "Cancelled",
  },
  completed: {
    color: "text-green-700",
    bg: "bg-green-100",
    accent: "bg-green-500",
    label: "Completed",
  },
  unknown: {
    color: "text-gray-500",
    bg: "bg-gray-200",
    accent: "bg-gray-400",
    label: "Unknown",
  },
} as const;

// 🔹 Exported helper for reuse in OrderCard
export const getEffectiveStatus = (
  orderStatus: string,
  shipmentStatus: string | null,
  paymentStatus?: string | null
): keyof typeof statusConfig => {
  const normalizedOrder = orderStatus?.toLowerCase();
  const normalizedShipment = shipmentStatus?.toLowerCase();
  const normalizedPayment = paymentStatus?.toLowerCase();

  if (normalizedOrder === "completed") return "delivered";
  if (normalizedShipment === "delivered") return "delivered";

  // If shipment is shipped, consider it shipped regardless of order, but check payment
  if (normalizedShipment === "shipped") {
    if (normalizedPayment === "paid" || normalizedPayment === "pending" || !normalizedPayment) {
      return "shipped";
    }
  }

  // Default fallback
  return (normalizedOrder in statusConfig
    ? (normalizedOrder as keyof typeof statusConfig)
    : "unknown") as keyof typeof statusConfig;
};


const ProgressBar: React.FC<ProgressBarProps> = ({
  status,
  shipmentStatus = null,
  paymentStatus = null,
  animated = false,
}) => {
  const t = useTranslations("trackOrders.progressBar");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const steps = ["pending", "processing", "shipped", "delivered"] as const;

  const icons = [
    () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    () => (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  ];

  const effectiveStatus = getEffectiveStatus(status, shipmentStatus, paymentStatus);
  const currentStep = steps.indexOf(effectiveStatus as typeof steps[number]);
  const stepLabels = [t("placed"), t("processing"), t("shipped"), t("delivered")];
  const config = statusConfig[effectiveStatus];

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {t("orderProgress")}
        </span>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
          {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </span>
      </div>

      <div className={`flex items-center justify-between relative ${isRTL ? "flex-row-reverse" : ""}`}>
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2">
          <motion.div
            className={`h-full ${config.accent} rounded-full relative overflow-hidden`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {animated && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            )}
          </motion.div>
        </div>

        {stepLabels.map((label, index) => {
          const Icon = icons[index];
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;

          return (
            <motion.div
              key={label}
              className="relative z-10 flex flex-col items-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isCompleted
                    ? `${config.accent} text-white border-transparent shadow-lg`
                    : isActive
                    ? `${config.bg} ${config.color} border-current shadow-md ${
                        animated ? "animate-pulse" : ""
                      }`
                    : "bg-gray-100 text-gray-400 border-gray-300"
                }`}
                whileHover={{ scale: 1.1 }}
              >
                <Icon />
              </motion.div>
              <span
                className={`text-xs mt-2 text-center font-medium transition-colors ${
                  isActive ? config.color : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
