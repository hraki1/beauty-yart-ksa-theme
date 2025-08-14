import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Order, OrderItem } from "@/lib/models/orderModal";
import Modal from "../UI/Modal";
import { useTranslations, useLocale } from "next-intl";
import { createReturnRequest, CreateReturnRequest } from "@/lib/axios/ReturnAxios";
import { useMutation } from "@tanstack/react-query";
 
interface RetrunModalProp {
  order: Order;
  isOpenModal: boolean;
  toggleOpenModal: () => void;
}

const ReturnModal: React.FC<RetrunModalProp> = ({
  order,
  isOpenModal,
  toggleOpenModal,
}) => {
  const t = useTranslations("trackOrders.returnModal");
  const locale = useLocale();
  const { mutate: submitReturn, isPending: isSubmitting } = useMutation({
  mutationFn: createReturnRequest,
  onSuccess: (data) => {
    toast.success(t("returnSubmittedSuccessfully"));
    toggleOpenModal(); 
    console.log("Return request created:", data);
  },
  onError: (error: Error) => {
    console.error("Return submission error:", error);
    toast.error(error.message);
  },
});
  const isRTL = locale === "ar";
  const [returnStep, setReturnStep] = useState<"policy" | "items" | "reason">(
    "policy"
  );
const [selectedItems, setSelectedItems] = useState<
  Record<number, { checked: boolean; quantity: number }>
>({});
  const [returnReason, setReturnReason] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);

 
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
      },
    }),
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };
 
  
useEffect(() => {
  if (isOpenModal) {
    const initialSelection = order.items?.reduce(
      (acc, item) => {
        acc[item.order_item_id] = { checked: false, quantity: item.qty };
        return acc;
      },
      {} as Record<number, { checked: boolean; quantity: number }>
    ) ?? {};

    setSelectedItems(initialSelection);
    setReturnStep("policy");
    setReturnReason("");
    setReturnNote("");
    setIsPolicyExpanded(false);
  }
}, [isOpenModal, order.items]);


  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelectedItems = { ...selectedItems };
    for (const key in newSelectedItems) {
      newSelectedItems[key].checked = e.target.checked;
    }
    setSelectedItems(newSelectedItems);
  };

  const handleItemCheck = (itemId: number, checked: boolean) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], checked },
    }));
  };



  const handleNextStep = () => {
    if (returnStep === "policy") {
      setReturnStep("items");
      return;
    }

    const hasSelectedItems = Object.values(selectedItems).some(
      (item) => item.checked
    );
    if (hasSelectedItems) {
      setReturnStep("reason");
    } else {
      toast.error(t("selectAtLeastOneItem"));
    }
  };

const handleSubmitReturn = () => {
  const itemsToReturn = Object.entries(selectedItems)
    .filter(([, item]) => item.checked)
    .map(([order_item_id, item]) => ({
      order_item_id: Number(order_item_id),
      quantity: item.quantity,
      reason: returnReason,
    }));

  if (!itemsToReturn.length) {
    toast.error(t("selectAtLeastOneItem"));
    return;
  }

  const payload: CreateReturnRequest = {
    order_id: order.order_id,
    reason: returnReason,
    type: "return_only",
    ...(returnNote.trim() && { note: returnNote }),
    items: itemsToReturn,
  };

  console.log("Submitting payload:", payload);
  submitReturn(payload);
};




const reasons: { id: string; label: string }[] =
  order.items?.[0]?.product?.returnPolicy?.required_reasons
    ? JSON.parse(order.items[0].product.returnPolicy.required_reasons).map(
        (r: string) => ({ id: r, label: r })
      )
    : [
        { id: "Defective product", label: "Defective product" },
        { id: "Wrong item received", label: "Wrong item received" },
        { id: "Not as described", label: "Not as described" },
        { id: "Changed mind", label: "Changed mind" },
      ];



const getItemReturnStatus = (item: OrderItem, order: Order) => {
  let canReturn = true;
  let disabled = false;
  let tooltip = "";

  const isItemAlreadyReturned = order.returnRequests?.some(
    (r) => r.order_item_id === item.order_item_id
  );

  if (isItemAlreadyReturned) {
    canReturn = false;
    disabled = true;
    tooltip = t("returnModal.itemAlreadyReturned");
  } else if (!item.product?.returnPolicy) {
    canReturn = false;
    disabled = true;
    tooltip = t("noReturnPolicy", { product: item.product_name });
  } else {
    const deliveredDate = item.created_at ? new Date(item.created_at) : null;
    const daysLimit = item.product.returnPolicy?.days_limit || 0;

    if (deliveredDate) {
      const returnDeadline = new Date(deliveredDate);
      returnDeadline.setDate(returnDeadline.getDate() + daysLimit);

      if (new Date() > returnDeadline) {
        canReturn = false;
        disabled = true;
        tooltip = t("returnModal.returnWindowExpiredDetailed", {
          days: daysLimit,
          deadline: returnDeadline.toLocaleDateString(),
        });
      }
    }
  }

  return { canReturn, disabled, tooltip };
};



const allItemsCanReturn = order.items?.some((item) => {
  const status = getItemReturnStatus(item, order);
  return !status.disabled; // true if at least one item is selectable
}) ?? false;
  return (
    <Modal open={isOpenModal} classesName="bg-white">
      <AnimatePresence mode="wait">
        {/* Policy Screen */}
        {returnStep === "policy" && (
          <motion.div
            key="policy"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-8 w-full bg-white rounded-xl shadow-xl"
          >
            <motion.div className="text-center mb-6" variants={fadeIn}>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t("policyTitle")}
              </h2>
              <p className="text-gray-500">
                {t("policySubtitle")}
              </p>
            </motion.div>

            <motion.div className="space-y-4 mb-6" variants={fadeIn}>
              {t.raw("policyPoints").map((policy: string, index: number) => (
                <motion.div
                  key={index}
                  className={`flex items-start ${isRTL ? "flex-row-reverse" : ""}`}
                  custom={index}
                  variants={itemVariants}
                >
                  <div className={`flex-shrink-0 mt-0.5 ${isRTL ? "ml-3" : "mr-3"}`}>
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{policy}</p>
                </motion.div>
              ))}
            </motion.div>

            <AnimatePresence>
              {isPolicyExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-600 overflow-hidden"
                >
                  <p className="mb-2">{t("additionalPolicyDetails")}</p>
                  <ul className={`list-disc space-y-1 ${isRTL ? "pr-5" : "pl-5"}`}>
                    {t.raw("policyDetails").map((detail: string, index: number) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
              className={`text-sm text-blue-600 hover:text-blue-700 mb-6 flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              whileTap={{ scale: 0.98 }}
            >
              {isPolicyExpanded ? t("showLess") : t("viewCompletePolicy")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${isRTL ? "mr-1" : "ml-1"} ${
                  isPolicyExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </motion.button>

            <motion.div className="flex gap-3" variants={fadeIn}>
              <button
                onClick={toggleOpenModal}
                className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                {t("back")}
              </button>
              <button
                onClick={handleNextStep}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                {t("iAgreeContinue")}

              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Items Selection Screen */}
        {returnStep === "items" && (
          <motion.div
            key="items"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6 w-full bg-white rounded-xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h2
                className="text-xl font-bold text-gray-900"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {t("selectItemsToReturn")}
              </motion.h2>
              <motion.button
                onClick={toggleOpenModal}
                className="text-gray-400 hover:text-gray-500"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            <motion.div
              className="mb-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-medium text-gray-700">
                {t("orderNumber", { number: order.order_id })}
              </h3>
         <label
  className={`flex items-center gap-2 text-sm text-gray-600 cursor-pointer ${
    isRTL ? "flex-row-reverse" : ""
  }`}
>
  <input
    type="checkbox"
    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
    checked={
      Object.values(selectedItems).every((item) => item.checked) &&
      Object.values(selectedItems).length > 0
    }
    onChange={toggleSelectAll}
    disabled={!allItemsCanReturn} 
  />
  {t("selectAll")}
</label>
            </motion.div>

        <motion.div
  className="space-y-3 max-h-96 overflow-y-auto pr-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  {order.items?.map((item) => {
    const status = getItemReturnStatus(item, order);
    const isSelected = selectedItems[item.order_item_id]?.checked || false;

    return (
    <motion.div
  key={item.order_item_id}
  className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
    !status.canReturn
      ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
      : "border-gray-200 hover:border-blue-300"
  }`}
>
  {/* Checkbox */}
  <input
    type="checkbox"
    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
    checked={isSelected}
    disabled={status.disabled}
    title={status.tooltip}
    onChange={(e) => handleItemCheck(item.order_item_id, e.target.checked)}
  />

  {/* Product Image */}
  <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
    <Image
      src={item.product?.images?.[0]?.origin_image || "/placeholder-product.jpg"}
      alt={item.product_name || "Product Image"}
      fill
      className="object-cover"
    />
  </div>

  {/* Product Info */}
  <div className="flex-1 min-w-0">
    <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
    <p className="text-xs text-gray-500">
      {t("sku", { sku: item.product?.sku ?? "N/A" })}
    </p>
    {!status.canReturn && status.tooltip && (
      <p className="text-xs mt-1 italic text-red-500">{status.tooltip}</p>
    )}
  </div>

  {/* Price / Qty */}
  <div className="flex-shrink-0 flex flex-col items-end gap-1">
    <p className="text-sm font-semibold text-gray-900">
      {item.product_price} {order.currency}
    </p>

    {/* Qty Selector */}
 <input
  type="number"
  min={1}
  max={item.qty}
  value={selectedItems[item.order_item_id]?.quantity || 1}
  onChange={(e) =>
    setSelectedItems((prev) => ({
      ...prev,
      [item.order_item_id]: {
        ...prev[item.order_item_id],
        quantity: Math.min(Math.max(Number(e.target.value), 1), item.qty),
      },
    }))
  }
  className={`w-16 text-sm border rounded px-2 py-1 text-blue-500 ${
    !isSelected || !status.canReturn ? "bg-gray-100 cursor-not-allowed" : ""
  }`}
/>



    <p className="text-xs text-gray-500">{t("qty", { quantity: item.qty })}</p>
  </div>
</motion.div>

    );
  }) ?? null}
</motion.div>



            <motion.div
              className="mt-6 pt-4 border-t border-gray-200 flex justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={() => setReturnStep("policy")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                whileHover={{ x: isRTL ? 2 : -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("back")}
              </motion.button>
              <motion.button
                onClick={handleNextStep}
                disabled={
                  !Object.values(selectedItems).some((item) => item.checked)
                }
                className={`px-4 py-2 rounded-md text-white ${
                  Object.values(selectedItems).some((item) => item.checked)
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                whileHover={{
                  scale: Object.values(selectedItems).some(
                    (item) => item.checked
                  )
                    ? 1.02
                    : 1,
                }}
                whileTap={{ scale: 0.98 }}
              >
                {t("continue")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* Reason Screen */}
        {returnStep === "reason" && (
          <motion.div
            key="reason"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6 w-full bg-white rounded-xl shadow-xl"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-900">
                  {t("returnDetails")}
                </h2>
                <p className="text-sm text-gray-500">{t("orderNumber", { number: order.order_id })}</p>
              </motion.div>
              <motion.button
                onClick={toggleOpenModal}
                className="text-gray-400 hover:text-gray-500"
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>

            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-medium text-gray-700 mb-3">{t("selectedItems")}</h3>
            <div className="space-y-2 mb-4">
  {order.items
    ?.filter((item) => selectedItems[item.order_item_id]?.checked)
    .map((item, index) => (
      <motion.div
        key={item.order_item_id}
        className={`flex items-center ${isRTL ? "flex-row-reverse" : "justify-between"} p-2 bg-gray-50 rounded`}
        variants={itemVariants}
        custom={index}
        initial="hidden"
        animate="visible"
      >
        <div className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}>
          <div className={`relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 ${isRTL ? "ml-3" : "mr-3"}`}>
  <Image
    src={item.product?.images?.[0]?.origin_image || "/placeholder-product.jpg"}
    alt={item.product_name || "Product Image"}
    fill
    className="object-cover"
  />
</div>

          <span className="text-sm font-medium">{item.product_name}</span>
        </div>
        <span className="text-sm text-gray-600">
          {t("qty", { quantity: selectedItems[item.order_item_id]?.quantity })}
        </span>
      </motion.div>
    )) ?? null}
</div>


              <h3 className="font-medium text-gray-700 mb-3">
                {t("reasonForReturn")}
              </h3>
              <motion.div
  className="grid grid-cols-2 gap-3 mb-4"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
>
  {reasons.map((reason, index) => (
    <motion.button
      key={reason.id}
      className={`py-2 px-3 rounded-md border text-sm font-medium ${
        returnReason === reason.id
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-gray-200 hover:border-gray-300 text-gray-700"
      }`}
      onClick={() => setReturnReason(reason.id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      custom={index}
      variants={itemVariants}
    >
      {reason.label}
    </motion.button>
  ))}
</motion.div>


              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <label
                  htmlFor="return-note"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {t("additionalNotes")}
                </label>
                <textarea
                  id="return-note"
                  rows={3}
                  className="w-full text-black p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={t("returnNotePlaceholder")}
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="pt-4 border-t border-gray-200 flex justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                onClick={() => setReturnStep("items")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                whileHover={{ x: isRTL ? 2 : -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("back")}
              </motion.button>
              <motion.button
  onClick={handleSubmitReturn}
  disabled={!returnReason || isSubmitting}
  className={`px-4 py-2 rounded-md text-white ${
    returnReason
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-gray-300 cursor-not-allowed"
  }`}
>
  {isSubmitting ? t("submitting") : t("submitReturnRequest")}
</motion.button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default ReturnModal;