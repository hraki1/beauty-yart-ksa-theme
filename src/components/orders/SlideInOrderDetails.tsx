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

const statusConfig = {
  pending: { color: "text-gray-600", bg: "bg-gray-100", label: "Pending" },
  processing: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Processing" },
  shipped: { color: "text-blue-700", bg: "bg-blue-100", label: "Shipped" },
  delivered: { color: "text-green-700", bg: "bg-green-100", label: "Delivered" },
  cancelled: { color: "text-red-700", bg: "bg-red-100", label: "Cancelled" },
  completed: { color: "text-green-700", bg: "bg-green-100", label: "Delivered" },
  unknown: { color: "text-gray-500", bg: "bg-gray-200", label: "Unknown" }
} as const;

export default function SlideInOrderDetails({
  order,
  isOpen,
  onClose,
  onReturnClick,
}: SlideInOrderDetailsProps) {
  const t = useTranslations("trackOrders.orderDetails");
  const tStatus = useTranslations("trackOrders.statusLabels");
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

  const hasAnyReturnPolicy = (order.items ?? []).some((item) => !!item.product?.returnPolicy);
  const canAnyItemReturn = (order.items ?? []).some((item) => {
    const isItemAlreadyReturned = (order.returnRequests ?? []).some(
      (r) => r.order_item_id === item.order_item_id
    );
    if (isItemAlreadyReturned) return false;
    if (!item.product?.returnPolicy) return false;
    const daysLimit = item.product.returnPolicy?.days_limit || 0;
    const createdAt = item.created_at ? new Date(item.created_at) : null;
    if (!createdAt) return false;
    const deadline = new Date(createdAt);
    deadline.setDate(deadline.getDate() + daysLimit);
    return new Date() <= deadline;
  });


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
              <div className=" bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 space-y-4">
                <div className="flex gap-2">
                  <h3 className="font-semibold">{t("orderProgress")}</h3>
                  <ProgressBar status={order.status} shipmentStatus={order.shipment_status} animated />
                </div>
                <div className="text-center">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                    {t("currentStatus", { status: tStatus(String(effectiveStatus)) })}
                  </span>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
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

              {/* Items List */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
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
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("paymentSummary")}
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div dir="ltr" className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("subtotal")}</span>
                    <span>${(order.grand_total * 0.9).toFixed(2)}</span>
                  </div>
                  <div dir="ltr" className={`flex ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("shipping")}</span>
                    <span>${(order.grand_total * 0.1).toFixed(2)}</span>
                  </div>
                  <div dir="ltr" className={` flex gap-2 border-t pt-2  ${isRTL ? "flex-row-reverse" : "justify-between"} font-bold`}>
                    <span>{t("total")}</span>
                    <span>${order.grand_total}</span>
                  </div>
                  <div className="flex gap-2 justify-center text-sm text-gray-600">
                    {t("paymentStatus")}:{" "}
                    <span className={`font-medium ${config.color}`}>
                      {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Order Details */}
              <div className="space-y-2">
                <h3 className="font-semibold">{t("additionalInformation")}</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-700">
                  <div dir="ltr" className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("shippingMethod")}</span>
                    <span>{order.shipping_method_name || "N/A"}</span>
                  </div>
                  <div dir="ltr" className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("paymentMethod")}</span>
                    <span>{order.payment_method_name || "N/A"}</span>
                  </div>
                  <div dir="ltr" className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("customerName")}</span>
                    <span>{order.customer_full_name || "N/A"}</span>
                  </div>
                  <div dir="ltr" className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "justify-between"}`}>
                    <span>{t("customerEmail")}</span>
                    <span>{order.customer_email || "N/A"}</span>
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
                        className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg px-4 font-medium flex flex-col gap-1 border border-gray-300"
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          <span>{t("returnRequest", { id: returnReq.return_request_id })}</span>
                        </div>
                        <div className="text-sm">
                          <p><strong>{t("reason")}:</strong> {returnReq.reason}</p>
                          <p><strong>{t("note")}:</strong> {returnReq.note}</p>
                          <p><strong>{t("status")}:</strong> {returnReq.status}</p>
                          <p><strong>{t("createdAt")}:</strong> {new Date(returnReq.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    hasAnyReturnPolicy && canAnyItemReturn && (
                      <button
                        onClick={onReturnClick}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                      >
                        {t("returnOrder")}
                      </button>
                    )
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
