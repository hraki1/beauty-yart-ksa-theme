"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, Package, CreditCard } from "lucide-react";
import ProgressBar from "./ProgressBar";
import type { Order } from "@/lib/models/orderModal";
import InvoiceDocuments from "./InvoiceDocuments";
import ProductItem from "@/components/orders/ProductItem";
import { useTranslations, useLocale } from "next-intl";

interface SlideInOrderDetailsProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onReturnClick: () => void;
}

// Updated status config with black/white theme
const statusConfig = {
  pending: { color: "text-black", bg: "bg-gray-200", label: "Pending" },
  processing: { color: "text-black", bg: "bg-gray-300", label: "Processing" },
  shipped: { color: "text-white", bg: "bg-gray-600", label: "Shipped" },
  delivered: { color: "text-white", bg: "bg-black", label: "Delivered" },
  cancelled: { color: "text-white", bg: "bg-gray-800", label: "Cancelled" },
  completed: { color: "text-white", bg: "bg-black", label: "Delivered" },
  unknown: { color: "text-black", bg: "bg-gray-100", label: "Unknown" }
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

  const effectiveStatus =
    order.status === "completed" 
      ? "delivered"
      : order.status;

  const isDelivered =
    effectiveStatus === "delivered" || order.shipment_status === "delivered";

  const config = statusConfig[effectiveStatus as keyof typeof statusConfig] ?? statusConfig.unknown;


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
            className={`fixed top-0 h-full w-full max-w-lg bg-white shadow-sm z-40 overflow-y-auto ${isRTL ? "left-0" : "right-0"}`}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-black font-['Playfair_Display'] italic">{order.order_number}</h2>
                <p className="text-sm text-black">{t("title")}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Progress Stepper */}
              <div 
                className="rounded-xl p-6 space-y-4 border border-gray-200"
                style={{ 
                  backgroundImage: 'linear-gradient(135deg, #FFEDE4 0%, #FFFFFF 100%)' 
                }}
              >
                <h3 className="font-semibold text-black font-['Playfair_Display'] italic">{t("orderProgress")}</h3>
                <ProgressBar status={order.status} shipmentStatus={order.shipment_status} animated />
                <div className="text-center">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                    {t("currentStatus", { status: config.label })}
                  </span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-black font-['Playfair_Display'] italic">
                  <Calendar className="w-5 h-5 text-black" />
                  {t("activityTimeline")}
                </h3>
                <div className="space-y-2">
                  {(order.activities ?? []).map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-4 items-start ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${config.bg} ${config.color} mt-2 flex-shrink-0`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-black">{activity.comment}</p>
                        <p className="text-xs text-black">
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

              {/* Items List */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-black font-['Playfair_Display'] italic">
                  <Package className="w-5 h-5 text-black" />
                  {t("itemsOrdered")}
                </h3>
                <div className="space-y-2">
                  {(order.items ?? []).map((item) => (
                    <ProductItem key={item.order_item_id} item={item} orderStatus={isDelivered} />
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2 text-black font-['Playfair_Display'] italic">
                  <CreditCard className="w-5 h-5 text-black" />
                  {t("paymentSummary")}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm border border-gray-200">
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span className="text-black">{t("subtotal")}</span>
                    <span className="text-black">${(order.grand_total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span className="text-black">{t("shipping")}</span>
                    <span className="text-black">${(order.grand_total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className={`border-t border-gray-300 pt-2 flex ${isRTL ? "flex-row-reverse" : "justify-between"} font-bold`}>
                    <span className="text-black">{t("total")}</span>
                    <span className="text-black">${order.grand_total}</span>
                  </div>
                  <div className="text-sm text-black">
                    {t("paymentStatus")}:{" "}
                    <span className={`font-medium ${config.color}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Order Details */}
              <div className="space-y-2">
                <h3 className="font-semibold text-black font-['Playfair_Display'] italic">{t("additionalInformation")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm border border-gray-200">
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span className="text-black">{t("shippingMethod")}</span>
                    <span className="text-black">{order.shipping_method_name || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span className="text-black">{t("paymentMethod")}</span>
                    <span className="text-black">{order.payment_method_name || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span className="text-black">{t("customerName")}</span>
                    <span className="text-black">{order.customer_full_name || "N/A"}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span className="text-black">{t("customerEmail")}</span>
                    <span className="text-black">{order.customer_email || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Invoice */}
              <InvoiceDocuments invoices={order.invoices ?? []} />

             {/* Return Order */}
{isDelivered && (
  <div className="pt-6 border-t border-gray-200">
    {order.returnRequests && order.returnRequests.length > 0 ? (
      order.returnRequests.map((returnReq) => (
        <div
          key={returnReq.return_request_id}
          className="w-full py-3 bg-gray-100 text-black rounded-lg px-4 font-medium flex flex-col gap-1 border border-gray-300"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
            </svg>
            <span>Return Request #{returnReq.return_request_id}</span>
          </div>
          <div className="text-sm text-black">
            <p><strong>Reason:</strong> {returnReq.reason}</p>
            <p><strong>Note:</strong> {returnReq.note}</p>
            <p><strong>Status:</strong> {returnReq.status}</p>
            <p><strong>Created At:</strong> {new Date(returnReq.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))
    ) : (
      <button
        onClick={onReturnClick}
        className="w-full py-3 bg-black hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors"
      >
        {t("returnOrder")}
      </button>
    )}
  </div>
)}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}