"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import type { Order, Activity } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";

interface AllOrdersTimelineProps {
  orders: Order[];
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
        (order.activities || []).map(activity => ({
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
      className="bg-white/95 backdrop-blur-sm rounded-xl p-6 border border-gray-200"
    >
      {/* Redesigned Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-gray-100">
            <Clock className="w-6 h-6 text-black" aria-hidden="true" />
          </div>
          <h3 className="font-bold text-2xl text-black font-['Playfair_Display'] italic">
            {t("title")}
          </h3>
        </div>
        <span className="text-sm text-black select-none">
          {allActivities.length} {t("recentActivities")}
        </span>
      </motion.div>

     <div
  className="space-y-4 max-h-96 overflow-y-auto scroll-smooth pr-1 hide-scrollbar"
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
          hover:bg-gray-50 border border-gray-200`}
        tabIndex={-1}
      >
        <span
          aria-hidden="true"
          className={`w-5 h-5 rounded-full border-2 border-white ${config.bg} ${config.color} flex-shrink-0`}
        />
        <div className="flex-1">
          <div className={`flex items-center gap-3 mb-2 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}>
            <span
              className={`text-sm px-3 py-1 rounded-full font-semibold ${config.bg} ${config.color} select-none`}
            >
              #{activity.order_number}
            </span>
            <time
              className="text-xs text-black"
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
          <p className="text-sm font-medium text-black leading-snug">
            {activity.comment}
          </p>
        </div>
      </motion.article>
    );
  })}
</div>

<style jsx global>{`
.hide-scrollbar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
.hide-scrollbar {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}
`}</style>

    </section>
  );
}