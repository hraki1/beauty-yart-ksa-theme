"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, Package, CreditCard } from "lucide-react";
import ProgressBar from "./ProgressBar";
import type { Order } from "@/lib/models/orderModal";
import InvoiceDocuments from "./InvoiceDocuments";
import ProductItem from "@/components/orders/ProductItem";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface SlideInOrderDetailsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onReturnClick: () => void;
}

const statusConfig = {
  pending: { color: "text-gray-400", bg: "bg-gray-100", glow: "shadow-gray-200", label: "Pending" },
  processing: { color: "text-yellow-600", bg: "bg-yellow-100", glow: "shadow-yellow-200", label: "Processing" },
  shipped: { color: "text-blue-600", bg: "bg-blue-100", glow: "shadow-blue-200", label: "Shipped" },
  delivered: { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" },
  cancelled: { color: "text-red-600", bg: "bg-red-100", glow: "shadow-red-200", label: "Cancelled" },
  completed: { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" },
  unknown: { color: "text-gray-500", bg: "bg-gray-200", glow: "shadow-gray-300", label: "Unknown" }
} as const;

export default function SlideInOrderDetails({
  order,
  isOpen,
  onClose,
  onReturnClick,
}: SlideInOrderDetailsProps) {
  const t = useTranslations("trackOrders.orderDetails");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  if (!order) return null;

  // Normalize status and check delivered state based on order.status or shipment_status
  const effectiveStatus =
    order.status === "completed" || order.status === "delivered"
      ? "delivered"
      : order.status;

  const isDelivered =
    effectiveStatus === "delivered" || order.shipment_status === "delivered";

  const config = statusConfig[effectiveStatus as keyof typeof statusConfig] ?? statusConfig.unknown;

  // Calculate total product price (sum of all items final_price * qty)
  const totalProductPrice = order.items.reduce((sum, item) => sum + item.final_price * item.qty, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={onClose}
          />

          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 h-full w-full max-w-lg bg-white shadow-2xl z-40 overflow-y-auto ${
              isRTL ? "left-0" : "right-0"
            }`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{order.order_number}</h2>
                <p className="text-sm text-gray-600">{t("title")}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Progress Stepper */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="font-semibold mb-4">{t("orderProgress")}</h3>
                <ProgressBar status={order.status} shipmentStatus={order.shipment_status} animated={true} />
                <div className="mt-4 text-center">
                  <span
                    className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
                  >
                    {t("currentStatus", { status: config.label })}
                  </span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("activityTimeline")}
                </h3>
                <div className="space-y-4">
                  {order.activities.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-4 items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${config.bg} ${config.color} mt-2 flex-shrink-0`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.comment}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Items List with ProductItem and review button */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  {t("itemsOrdered")}
                </h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <ProductItem
                      key={item.order_item_id}
                      item={item}
                      orderStatus={isDelivered}
                    />
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("paymentSummary")}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("subtotal")}</span>
                    <span>${(order.grand_total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("shipping")}</span>
                    <span>${(order.grand_total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className={`border-t pt-2 flex ${isRTL ? "flex-row-reverse" : "justify-between"} font-bold`}>
                    <span>{t("total")}</span>
                    <span>${order.grand_total}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {t("paymentStatus")}:{" "}
                    <span className={`font-medium ${config.color}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Order Details */}
              <div>
                <h3 className="font-semibold mb-4">{t("additionalInformation")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-700">
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("shippingMethod")}</span>
                    <span>{order.shipping_method_name || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("paymentMethod")}</span>
                    <span>{order.payment_method_name || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("customerName")}</span>
                    <span>{order.customer_full_name || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("customerEmail")}</span>
                    <span>{order.customer_email || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("trackingNumber")}</span>
                    <span>{order.shipments?.[0]?.tracking_number || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("totalQuantity")}</span>
                    <span>{order.total_qty}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("totalWeight")}</span>
                    <span>{order.total_weight} kg</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("taxAmount")}</span>
                    <span>${order.total_tax_amount.toFixed(2)}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("shippingTax")}</span>
                    <span>${order.shipping_fee_incl_tax_with_discount.toFixed(2)}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("discountAmount")}</span>
                    <span>{order.discount_amount ? `$${order.discount_amount.toFixed(2)}` : "None"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("productPrice")}</span>
                    <span>${totalProductPrice.toFixed(2)}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} font-bold border-t pt-2`}>
                    <span>{t("totalPrice")}</span>
                    <span>
                      $
                      {(
                        totalProductPrice +
                        order.total_tax_amount +
                        order.shipping_fee_incl_tax_with_discount -
                        (order.discount_amount || 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Invoice */}
              <InvoiceDocuments invoices={order.invoices} />

              {/* Return Order */}
              <div className="pt-6 border-t">
                <button
                  onClick={onReturnClick}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {t("returnOrder")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
