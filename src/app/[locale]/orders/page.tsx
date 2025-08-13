"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { getOrders } from "@/lib/axios/OrderAxios";
import type { Order } from "@/lib/models/orderModal";
import OrderCard from "@/components/orders/OrderCard";
import SlideInOrderDetails from "@/components/orders/SlideInOrderDetails";
import AllOrdersTimeline from "@/components/orders/AllOrdersTimeline";
import ReturnModal from "@/components/orders/ReturnModal";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTranslations, useLocale } from "next-intl";

const ORDERS_PER_PAGE = 3;

const tabs = ["all", "pending", "processing", "shipped", "delivered", "canceled"] as const;
type Tab = typeof tabs[number];

function normalizeStatus(status: string): string {
  if (!status) return "";
  if (status.toLowerCase() === "completed") return "delivered";
  return status.toLowerCase();
}

function isStatusMatch(orderStatus: string, tab: Tab): boolean {
  const normalized = normalizeStatus(orderStatus);
  if (tab.toLowerCase() === "canceled") {
    return normalized === "canceled" || normalized === "cancelled";
  }
  return normalized === tab.toLowerCase();
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
  const scrollRef = React.useRef<HTMLDivElement>(null);

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

  const countOrdersByStatus = useCallback(
    (tab: Tab) => {
      if (tab === "all") return orders.length;
      return orders.filter((order) => isStatusMatch(order.status, tab)).length;
    },
    [orders]
  );

  if (loading) return <div className="p-8 text-center text-lg text-gray-600">{t("loading")}</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-600 text-lg" role="alert" aria-live="assertive">
        {t("error", { message: error })}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 select-none">
            {t("pageTitle")}
          </h1>
          <p className="text-gray-600 text-lg max-w-xl">
            {t("pageDescription")}
          </p>
        </motion.header>

        {/* Tabs */}
 <motion.nav
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8"
  aria-label="Order status tabs"
>
  <div className="relative">
    {/* Left arrow */}
    <button
      type="button"
      aria-label="Scroll tabs left"
      onClick={() => {
        if (scrollRef.current) {
          const scrollAmount = isRTL ? 120 : -120;
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        p-2 rounded-full bg-white shadow-md
        hover:bg-gray-100 active:bg-gray-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        md:hidden
        ${isRTL ? "right-0" : "left-0"}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
      </svg>
    </button>

    {/* Right arrow */}
    <button
      type="button"
      aria-label="Scroll tabs right"
      onClick={() => {
        if (scrollRef.current) {
          const scrollAmount = isRTL ? -120 : 120;
          scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }}
      className={`
        absolute top-1/2 -translate-y-1/2 z-10
        p-2 rounded-full bg-white shadow-md
        hover:bg-gray-100 active:bg-gray-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        md:hidden
        ${isRTL ? "left-0" : "right-0"}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>

    {/* Scrollable tabs container */}
    <div
      ref={scrollRef}
      className={`
        flex
        overflow-x-auto
        scrollbar-hide
        md:justify-center
        md:overflow-visible
        md:flex-wrap
        ${isRTL ? "space-x-reverse space-x-4 md:space-x-reverse md:space-x-6" : "space-x-4 md:space-x-6"}
        px-8
      `}
      style={{ scrollBehavior: "smooth" }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap min-w-max ${
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-300"
                : "bg-white/90 text-gray-700 hover:bg-white hover:shadow-md"
            }`}
            aria-current={isActive ? "true" : undefined}
            aria-label={`${t(`tabs.${tab}`)} orders tab, ${countOrdersByStatus(tab)} orders`}
          >
            {t(`tabs.${tab}`)}
            {tab !== "all" && (
              <span className={`${isRTL ? "mr-2" : "ml-2"} inline-block text-xs font-normal bg-black/10 px-2 py-0.5 rounded-full select-none`}>
                {countOrdersByStatus(tab)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
</motion.nav>



        {/* Orders Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
          aria-live="polite"
          aria-relevant="additions removals"
          aria-atomic="true"
        >
          {paginatedOrders.length === 0 ? (
            <p className="col-span-full p-4 text-center text-gray-600 text-lg">{t("noOrdersFound")}</p>
          ) : (
            paginatedOrders.map((order) => (
              <OrderCard
                key={order.order_id}
                order={order}
                onViewDetails={handleViewDetails}
                viewType={viewType}
              />
            ))
          )}
        </motion.section>

        {/* Pagination Controls */}
       {totalPages > 1 && (
  <nav
    aria-label="Pagination"
    className="flex justify-center items-center gap-4 mb-8"
  >
    <button
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      aria-label={t("pagination.previousPage")}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full 
        bg-gray-200 text-gray-600
        hover:bg-gray-300 hover:text-gray-800
        disabled:bg-gray-100 disabled:text-gray-400
        disabled:cursor-not-allowed
        transition
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      {isRTL ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
    </button>

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
            flex items-center justify-center w-10 h-10 rounded-full
            font-semibold text-sm
            transition
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            ${
              isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
        >
          {page}
        </button>
      );
    })}

    <button
      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      aria-label={t("pagination.nextPage")}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full 
        bg-gray-200 text-gray-600
        hover:bg-gray-300 hover:text-gray-800
        disabled:bg-gray-100 disabled:text-gray-400
        disabled:cursor-not-allowed
        transition
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      {isRTL ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
    </button>
  </nav>
)}

        {/* All Orders Timeline */}
        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AllOrdersTimeline orders={orders} />
          </motion.div>
        )}

        {/* Slide-in Order Details Sidebar */}
        <SlideInOrderDetails
          order={selectedOrder}
          isOpen={isDetailsOpen}
          onClose={handleCloseDetails}
          onReturnClick={handleReturnClick}
        />

        {/* Return Modal */}
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
