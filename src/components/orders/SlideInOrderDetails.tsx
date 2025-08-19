"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Package, CreditCard } from "lucide-react";
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

const statusConfig = {
  pending:   { color: "text-black", bg: "bg-gray-200", label: "Pending" },
  processing:{ color: "text-black", bg: "bg-gray-300", label: "Processing" },
  shipped:   { color: "text-white", bg: "bg-gray-600", label: "Shipped" },
  delivered: { color: "text-white", bg: "bg-black", label: "Delivered" },
  cancelled: { color: "text-white", bg: "bg-gray-800", label: "Cancelled" },
  completed: { color: "text-white", bg: "bg-black", label: "Completed" },
  unknown:   { color: "text-black", bg: "bg-gray-100", label: "Unknown" },
} as const;


  const effectiveStatus = order.status === "completed" ? "delivered" : order.status;
  const isDelivered =
    effectiveStatus === "delivered" || order.shipment_status === "delivered";
  const config =
    statusConfig[effectiveStatus as keyof typeof statusConfig] ??
    statusConfig.unknown;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-30"
            onClick={onClose}
          />

          {/* Slide Panel */}
          <motion.div
            initial={{ x: isRTL ? "-100%" : "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isRTL ? "-100%" : "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className={`fixed top-0 h-full w-full max-w-xl bg-gradient-to-br from-white via-white to-gray-50 shadow-2xl z-40 overflow-y-auto ${isRTL ? "left-0" : "right-0"}`}
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 px-8 py-6 flex justify-between items-center z-10"
            >
              <div>
                <h2 className="text-2xl font-bold text-black font-['Playfair_Display'] italic mb-1">
                  {order.order_number}
                </h2>
                <p className="text-gray-600 font-medium">{t("title")}</p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                <X className="w-6 h-6 text-black" />
              </motion.button>
            </motion.div>

            {/* Body */}
            <div className="p-8 space-y-8">
              {/* Order Progress */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-3xl p-8 border border-gray-200 overflow-hidden"
                style={{
                  backgroundImage: "linear-gradient(135deg, #FFEDE4 0%, #FFFFFF 100%)",
                }}
              >
                <h3 className="font-bold text-xl text-black font-['Playfair_Display'] italic mb-6">
                  {t("orderProgress")}
                </h3>
                <ProgressBar
                  status={order.status}
                  shipmentStatus={order.shipment_status}
                  animated
                />
                <div className="text-center mt-6">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`inline-block px-6 py-3 rounded-2xl text-sm font-bold ${config.bg} ${config.color} shadow-lg`}
                  >
                    {t("currentStatus", { status: config.label })}
                  </motion.span>
                </div>
              </motion.div>

              {/* Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-xl flex items-center gap-3 text-black font-['Playfair_Display'] italic">
                  <div className="p-2 rounded-xl bg-gray-100">
                    <Package className="w-6 h-6 text-black" />
                  </div>
                  {t("itemsOrdered")}
                </h3>

                <div className="space-y-3">
                  {(order.items ?? []).map((item) => (
                    <ProductItem
                      key={item.order_item_id}
                      item={item}
                      orderStatus={isDelivered}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-xl flex items-center gap-3 text-black font-['Playfair_Display'] italic">
                  <div className="p-2 rounded-xl bg-gray-100">
                    <CreditCard className="w-6 h-6 text-black" />
                  </div>
                  {t("paymentSummary")}
                </h3>
                
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 space-y-4 text-sm shadow-sm">
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} py-2`}>
                    <span className="text-black font-medium">{t("subtotal")}</span>
                    <span className="text-black font-bold">${(order.grand_total * 0.9).toFixed(2)}</span>
                  </div>
                  <div className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} py-2`}>
                    <span className="text-black font-medium">{t("shipping")}</span>
                    <span className="text-black font-bold">${(order.grand_total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className={`border-t border-gray-300 pt-4 flex ${isRTL ? "flex-row-reverse" : "justify-between"} text-lg`}>
                    <span className="text-black font-bold">{t("total")}</span>
                    <span className="text-black font-bold">${order.grand_total}</span>
                  </div>
                  <div className="text-sm text-black bg-white/60 rounded-2xl p-3">
                    {t("paymentStatus")}:{" "}
                    <span className={`font-bold ${config.color}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="font-bold text-xl text-black font-['Playfair_Display'] italic">
                  {t("additionalInformation")}
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-200 space-y-3 text-sm shadow-sm">
                  {[
                    [t("shippingMethod"), order.shipping_method_name || "N/A"],
                    [t("paymentMethod"), order.payment_method_name || "N/A"],
                    [t("customerName"), order.customer_full_name || "N/A"],
                    [t("customerEmail"), order.customer_email || "N/A"]
                  ].map(([label, value], index) => (
                    <div key={index} className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"} py-2 px-3 rounded-2xl hover:bg-white/60 transition-colors`}>
                      <span className="text-black font-medium">{label}</span>
                      <span className="text-black font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Invoice Documents */}
              <InvoiceDocuments invoices={order.invoices ?? []} />

              {/*  Return Section */}
              {isDelivered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8 border-t border-gray-200"
                >
                  {order.returnRequests && order.returnRequests.length > 0 ? (
                    order.returnRequests.map((returnReq) => (
                      <div
                        key={returnReq.return_request_id}
                        className="w-full p-6 bg-gradient-to-r from-pink-100 to-pink-50 text-black rounded-3xl border border-gray-200 shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-xl bg-white shadow-sm">
                            <svg className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                            </svg>
                          </div>
                          <span className="font-bold text-lg">Return Request #{returnReq.return_request_id}</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Reason:</strong> {returnReq.reason}</p>
                          <p><strong>Note:</strong> {returnReq.note}</p>
                          <p><strong>Status:</strong> {returnReq.status}</p>
                          <p><strong>Created At:</strong> {new Date(returnReq.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <motion.button
                      onClick={onReturnClick}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-black hover:bg-gray-800 text-white rounded-3xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {t("returnOrder")}
                    </motion.button>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}