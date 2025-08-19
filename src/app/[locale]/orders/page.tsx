"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getOrders } from "@/lib/axios/OrderAxios";
import type { Order } from "@/lib/models/orderModal";
import OrderCard from "@/components/orders/OrderCard";
import SlideInOrderDetails from "@/components/orders/SlideInOrderDetails";
import AllOrdersTimeline from "@/components/orders/AllOrdersTimeline";
import ReturnModal from "@/components/orders/ReturnModal";
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiClock } from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";

const ORDERS_PER_PAGE = 3;

const tabs = [
  "all",
  "pending",
  "processing",
  "completed",
  "cancelled",
  "refunded",
  "on_hold",
  "failed"
] as const;
type Tab = typeof tabs[number];

function isStatusMatch(orderStatus: string, tab: Tab): boolean {
  const normalized = orderStatus?.toLowerCase() || "";
  if (tab === "completed") return normalized === "completed" || normalized === "delivered";
  if (tab === "cancelled") return normalized === "cancelled" || normalized === "canceled";
  return normalized === tab;
}

export default function TrackOrdersPage() {
  const t = useTranslations("trackOrders");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [viewType] = useState("grid");

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // New state for timeline visibility
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);
  
  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter((order) => isStatusMatch(order.status, activeTab));
  }, [orders, activeTab]);

  const totalPages = useMemo(() => Math.ceil(filteredOrders.length / ORDERS_PER_PAGE), [filteredOrders]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const handleViewDetails = useCallback((order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  }, []);

  const handleReturnClick = useCallback(() => {
    setIsDetailsOpen(false);
    setIsReturnModalOpen(true);
  }, []);

  const toggleReturnModal = useCallback(() => {
    setIsReturnModalOpen((prev) => !prev);
  }, []);

  const toggleTimeline = useCallback(() => {
    setIsTimelineOpen((prev) => !prev);
  }, []);

  const countOrdersByStatus = useCallback(
    (tab: Tab) => {
      if (tab === "all") return orders.length;
      return orders.filter((order) => isStatusMatch(order.status, tab)).length;
    },
    [orders]
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundImage: 'linear-gradient(180deg, #FFEDE4 70%, #FFFFFF 100%)'}}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-800 font-['Playfair_Display'] italic">{t("loading")}</p>
      </div>
    </div>
  );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundImage: 'linear-gradient(180deg, #FFEDE4 70%, #FFFFFF 100%)'}}>
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg" role="alert" aria-live="assertive">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 text-lg font-medium">{t("error", { message: error })}</p>
        </div>
      </div>
    );

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(180deg, #FFEDE4 70%, #FFFFFF 100%)'
      }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-black/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-7xl relative z-10">
        {/* Enhanced Header */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="relative inline-block">
            <h1 
              className="text-6xl md:text-7xl font-extrabold text-black mb-4 select-none italic relative z-10"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t("pageTitle")}
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-black rounded-full opacity-60"></div>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-gray-800 text-xl max-w-2xl mx-auto leading-relaxed mt-6"
          >
            {t("pageDescription")}
          </motion.p>
        </motion.header>

        {/* Refined Tabs */}
        <motion.nav
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-12"
          role="tablist"
          aria-label="Order status tabs"
        >
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-2 border border-white/40 shadow-lg">
            <div className="flex overflow-x-auto scrollbar-hide gap-2 px-2">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab;
                return (
                  <motion.button
                    key={tab}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab)}
                    className={`
                      relative px-6 py-3 font-semibold rounded-xl transition-all duration-300
                      whitespace-nowrap min-w-fit transform hover:scale-105
                      ${isActive 
                        ? "bg-black text-white shadow-lg shadow-black/20" 
                        : "bg-transparent text-black hover:bg-white/50"
                      }
                    `}
                    aria-label={`${t(`tabs.${tab}`)} orders tab, ${countOrdersByStatus(tab)} orders`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{t(`tabs.${tab}`)}</span>
                      {tab !== "all" && (
                        <span className={`inline-flex items-center justify-center min-w-[20px] h-5 text-xs font-bold rounded-full px-2 transition-colors ${
                          isActive 
                            ? "bg-white text-black" 
                            : "bg-black text-white"
                        }`}>
                          {countOrdersByStatus(tab)}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-black rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.nav>

        {/* Enhanced Orders Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
          aria-live="polite"
          aria-relevant="additions removals"
          aria-atomic="true"
        >
          {paginatedOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 border border-white/40 shadow-lg max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-800 text-xl font-medium font-['Playfair_Display'] italic">{t("noOrdersFound")}</p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedOrders.map((order, index) => (
                <motion.div
                  key={order.order_id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <OrderCard
                    order={order}
                    onViewDetails={handleViewDetails}
                    viewType={viewType}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Elegant Pagination */}
        {totalPages > 1 && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            aria-label="Pagination"
            className="flex justify-center items-center gap-3 mb-12"
          >
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/40 shadow-lg flex items-center gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                aria-label={t("pagination.previousPage")}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-xl 
                  bg-white text-black shadow-sm border border-gray-200
                  hover:bg-gray-50 hover:shadow-md
                  disabled:bg-gray-100 disabled:text-gray-400
                  disabled:cursor-not-allowed disabled:shadow-none
                  transition-all duration-200 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                `}
              >
                {isRTL ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={t("pagination.goToPage", { page })}
                      className={`
                        flex items-center justify-center w-12 h-12 rounded-xl
                        font-bold text-sm transition-all duration-200 transform hover:scale-105
                        focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                        ${
                          isActive
                            ? "bg-black text-white shadow-lg shadow-black/20"
                            : "bg-white text-black hover:bg-gray-50 shadow-sm border border-gray-200"
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label={t("pagination.nextPage")}
                className={`
                  flex items-center justify-center w-12 h-12 rounded-xl 
                  bg-white text-black shadow-sm border border-gray-200
                  hover:bg-gray-50 hover:shadow-md
                  disabled:bg-gray-100 disabled:text-gray-400
                  disabled:cursor-not-allowed disabled:shadow-none
                  transition-all duration-200 transform hover:scale-105
                  focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2
                `}
              >
                {isRTL ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
              </button>
            </div>
          </motion.nav>
        )}

        {/* Timeline Toggle Button & Collapsible Timeline */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mb-12"
          >
            {/* Timeline Toggle Button */}
            <div className="flex justify-center mb-6">
              <motion.button
                onClick={toggleTimeline}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/60 backdrop-blur-md rounded-2xl px-8 py-4 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 group"
                aria-expanded={isTimelineOpen}
                aria-controls="orders-timeline"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-black font-['Playfair_Display']">
                      Orders Timeline
                    </h3>
                    <p className="text-sm text-gray-600">
                      {isTimelineOpen ? "Hide timeline view" : "View all orders chronologically"}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: isTimelineOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center ml-4"
                  >
                    <FiChevronDown className="w-5 h-5 text-gray-600" />
                  </motion.div>
                </div>
              </motion.button>
            </div>

            {/* Collapsible Timeline */}
            <AnimatePresence>
              {isTimelineOpen && (
                <motion.div
                  id="orders-timeline"
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.04, 0.62, 0.23, 0.98]
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-lg"
                  >
                    <AllOrdersTimeline orders={orders} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Modals */}
        <SlideInOrderDetails
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          onReturnClick={handleReturnClick}
        />

        {selectedOrder && (
          <ReturnModal
            order={selectedOrder}
            isOpenModal={isReturnModalOpen}
            toggleOpenModal={toggleReturnModal}
          />
        )}
      </div>
    </div>
  );
}