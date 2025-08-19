"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Order } from "@/lib/models/orderModal";
import { useTranslations, useLocale } from "next-intl";

interface AllOrdersTimelineProps {
  orders: Order[];
}

function AllOrdersTimeline({ orders }: AllOrdersTimelineProps) {
  const t = useTranslations("trackOrders.allOrdersTimeline");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const statusConfig = {
    pending:   { color: "text-black", bg: "bg-gray-200", label: t("pending"), accent: "bg-gray-300" },
    processing:{ color: "text-black", bg: "bg-gray-300", label: t("processing"), accent: "bg-gray-400" },
    shipped:   { color: "text-white", bg: "bg-gray-600", label: t("shipped"), accent: "bg-gray-700" },
    delivered: { color: "text-white", bg: "bg-black", label: t("delivered"), accent: "bg-gray-800" },
    cancelled: { color: "text-white", bg: "bg-gray-800", label: t("cancelled"), accent: "bg-gray-900" },
    completed: { color: "text-white", bg: "bg-black", label: t("delivered"), accent: "bg-gray-800" },
    unknown:   { color: "text-black", bg: "bg-gray-100", label: t("unknown"), accent: "bg-gray-200" }
  } as const;

  type StatusKey = keyof typeof statusConfig;

  interface ActivityWithOrderNumber {
    order_number: string;
    status: StatusKey | string;
    comment: string;
    created_at: string;
  }

  const getStatusConfig = (status: string) => {
    const normalized = status.toLowerCase() as StatusKey;
    return statusConfig[normalized] ?? statusConfig.unknown;
  };

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
   <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      aria-label="All orders timeline"
      className="relative"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl"></div>
      <div className="absolute top-4 right-4 w-20 h-20 bg-black/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold text-3xl text-black font-['Playfair_Display'] italic mb-1">
                {t("title")}
              </h3>
              <p className="text-gray-600">{t("subtitle")}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-black">{allActivities.length}</div>
            <div className="text-sm text-gray-500 uppercase tracking-wide">{t("recentActivities")}</div>
          </div>
        </motion.header>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent"></div>
          
          <div className="space-y-6 max-h-96 overflow-y-auto scroll-smooth pr-4 timeline-scroll">
            {allActivities.slice(0, 10).map((activity, index) => {
              const config = getStatusConfig(activity.status);
              return (
                <motion.article
                  key={`${activity.order_number}-${index}`}
                  initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="relative flex gap-6 items-start group"
                >
                  {/* Timeline Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <motion.div
                      className={`w-12 h-12 rounded-2xl ${config.bg} ${config.color} flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 180 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <motion.div
                    className="flex-1 bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:bg-white/80"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-xl text-sm font-bold ${config.bg} ${config.color} shadow-sm`}>
                          #{activity.order_number}
                        </span>
                        <time className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                          {new Date(activity.created_at).toLocaleDateString(locale, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </time>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-black leading-relaxed">
                      {activity.comment}
                    </p>
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .timeline-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .timeline-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
          border-radius: 3px;
        }
        .timeline-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
        .timeline-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.5);
        }
      `}</style>
    </motion.section>
  );
}

export default AllOrdersTimeline;
