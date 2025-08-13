"use client";

import React from "react";
import { Package, Clock, Truck, CheckCircle } from "lucide-react";
import type { OrderStatus } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";

type ShipmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null | string;

interface ProgressBarProps {
  status: OrderStatus;
  shipmentStatus?: ShipmentStatus;
  animated?: boolean;
}

const statusConfig = {
  pending: { color: "text-gray-400", bg: "bg-gray-100", glow: "shadow-gray-200", label: "Pending" },
  processing: { color: "text-yellow-600", bg: "bg-yellow-100", glow: "shadow-yellow-200", label: "Processing" },
  shipped: { color: "text-blue-600", bg: "bg-blue-100", glow: "shadow-blue-200", label: "Shipped" },
  delivered: { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" },
  cancelled: { color: "text-red-600", bg: "bg-red-100", glow: "shadow-red-200", label: "Cancelled" },
  completed: { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" }, // Same as delivered
  unknown: { color: "text-gray-500", bg: "bg-gray-200", glow: "shadow-gray-300", label: "Unknown" },
} as const;

const steps = ['pending', 'processing', 'shipped', 'delivered'] as const;
const icons = [Package, Clock, Truck, CheckCircle];

// Determine effective status based on order and shipment status
function getEffectiveStatus(orderStatus: OrderStatus, shipmentStatus: ShipmentStatus): OrderStatus {
  if (shipmentStatus === 'delivered') {
    return 'delivered';
  }
  if (orderStatus === 'completed') {
    return 'delivered';
  }
  return orderStatus;
}

export default function ProgressBar({ status, shipmentStatus = null, animated = false }: ProgressBarProps) {
  const t = useTranslations("trackOrders.progressBar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const effectiveStatus = getEffectiveStatus(status, shipmentStatus);
  const currentStep = steps.indexOf(effectiveStatus as typeof steps[number]);

  const stepLabels = [t("placed"), t("processing"), t("shipped"), t("delivered")];

  return (
    <div className={`flex items-center justify-between w-full ${isRTL ? "flex-row-reverse" : ""}`}>
      {stepLabels.map((label, index) => {
        const Icon = icons[index];
        const isActive = index <= currentStep;

        return (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? `${statusConfig[effectiveStatus]?.bg} ${statusConfig[effectiveStatus]?.color} ${animated ? 'animate-pulse' : ''}`
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-xs mt-1 ${isActive ? statusConfig[effectiveStatus]?.color : 'text-gray-400'}`}>
              {label}
            </span>
            {index < stepLabels.length - 1 && (
              <div
                className={`h-0.5 w-full mt-2 ${
                  index < currentStep ? statusConfig[effectiveStatus]?.bg : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
