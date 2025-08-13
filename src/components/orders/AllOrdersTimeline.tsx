"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Order, Activity } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";

interface AllOrdersTimelineProps {
  orders: Order[];
}

const statusConfig = {
  pending:    { color: "text-gray-500", bg: "bg-gray-100", glow: "shadow-gray-200", label: "Pending" },
  processing: { color: "text-yellow-600", bg: "bg-yellow-100", glow: "shadow-yellow-200", label: "Processing" },
  shipped:    { color: "text-blue-600", bg: "bg-blue-100", glow: "shadow-blue-200", label: "Shipped" },
  delivered:  { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" },
  cancelled:  { color: "text-red-600", bg: "bg-red-100", glow: "shadow-red-200", label: "Cancelled" },
  completed:  { color: "text-green-600", bg: "bg-green-100", glow: "shadow-green-200", label: "Delivered" },
  unknown:    { color: "text-gray-500", bg: "bg-gray-200", glow: "shadow-gray-300", label: "Unknown" }
} as const;

type StatusKey = keyof typeof statusConfig;

interface ActivityWithOrderNumber extends Activity {
  order_number: string;
  status: StatusKey | string;
}

const getStatusConfig = (status: string) => {
  const normalized = status.toLowerCase() as StatusKey;
  return statusConfig[normalized] ?? statusConfig.unknown;
};

export default function AllOrdersTimeline({ orders }: AllOrdersTimelineProps) {
  const t = useTranslations("trackOrders.allOrdersTimeline");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const allActivities: ActivityWithOrderNumber[] = React.useMemo(() => {
    return orders
      .flatMap(order =>
        order.activities.map(activity => ({
          ...activity,
          order_number: order.order_number,
          status: (order.status.toLowerCase() === "completed" ? "delivered" : order.status.toLowerCase()) as StatusKey
        }))
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders]);

  return (
    <section
      aria-label="All orders timeline"
      className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/30"
    >
      <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
        <MapPin className="w-6 h-6 text-blue-600" aria-hidden="true" />
        {t("title")}
      </h3>

      <div
        className="space-y-4 max-h-96 overflow-y-auto scrollbar-transparent scroll-smooth pr-1"
        tabIndex={0}
      >
        {allActivities.slice(0, 10).map((activity, index) => {
          const config = getStatusConfig(activity.status);

          return (
            <motion.article
              key={`${activity.order_number}-${index}`}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex gap-4 items-start p-4 rounded-lg transition-colors cursor-default
                hover:bg-gray-50 focus-within:bg-gray-50 border border-gray-100
                ${config.glow}`}
              tabIndex={-1}
            >
              <span
                aria-hidden="true"
                className={`w-5 h-5 rounded-full border-2 border-white ${config.bg} ${config.color} flex-shrink-0 mt-1 shadow-md`}
              />
              <div className="flex-1">
                <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-semibold ${config.bg} ${config.color} select-none`}
                  >
                    #{activity.order_number}
                  </span>
                  <time
                    className="text-xs text-gray-500"
                    dateTime={new Date(activity.created_at).toISOString()}
                  >
                    {new Date(activity.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-snug">
                  {activity.comment}
                </p>
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Inline Global CSS for Transparent Scrollbar */}
      <style jsx global>{`
        .scrollbar-transparent::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-transparent::-webkit-scrollbar-thumb {
          background-color: transparent;
        }
        .scrollbar-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        /* Firefox */
        .scrollbar-transparent {
          scrollbar-width: thin;
          scrollbar-color: transparent transparent;
        }
      `}</style>
    </section>
  );
}
