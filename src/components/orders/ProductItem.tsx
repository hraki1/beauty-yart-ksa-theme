"use client";

import StarRating from "@/components/shared/StarRating";
import Modal from "@/components/UI/Modal";
import Spinner from "@/components/UI/SpinnerLoading";
import {
  addReview,
  AddReviweRequest,
  getReviewsForProduct,
} from "@/lib/axios/reviewAxiox";
import { OrderItem } from "@/lib/models/orderModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaExclamationTriangle, FaRegStar } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/store/CurrencyContext";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import type { AxiosError } from "axios";

interface productItemProps {
  item: OrderItem;
  orderStatus: boolean;
}
interface ErrorResponse {
  message: string;
}

const ProductItem: React.FC<productItemProps> = ({ item, orderStatus }) => {
  const router = useRouter();
  const t = useTranslations("account.myProducts.myProduct.myProducts");
  const { logout } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errorReview, setErrorsReview] = useState<string[] | null>(null);
  console.log(hoveredStar);
 const { data: review, isLoading, error, refetch } = useQuery({
  queryKey: ["reviews", item.product?.product_id],
  queryFn: ({ signal }) =>
    item.product?.product_id
      ? getReviewsForProduct(item.product.product_id, signal)
      : Promise.resolve([]),
  enabled: !!item.product?.product_id,
});


const { mutate, isPending } = useMutation({
  mutationFn: addReview,
  mutationKey: ["reviews", item.product?.product_id ?? 0],
  onSuccess: () => {
    setComment("");
    setRating(0);
    toggleDetails();
    toast.success(t("toast.addSuccess"));
    refetch();
  },
  onError: (err: AxiosError<ErrorResponse>) => {
    console.log("add review error:", err);

    const msg = err.response?.data?.message ?? "An unexpected error occurred";

    if (msg.includes("Invalid token")) {
      console.log("Invalid token detected, logging out...");
      logout();
      return;
    }

    toast.error(msg);
  },
});


  const { rate, userCurrency } = useCurrency();

  function viewPriceCurencyHandler(priceNumber: number) {
    const price = (Number(priceNumber) * rate).toFixed(2);
    return price ? price : 0;
  }

  const toggleDetails = () => setIsModalOpen(!isModalOpen);
  const handleStarClick = (index: number) => setRating(index);

function handleViewProduct() {
  if (!item.product?.product_id) return;
  router.push(`/product/${item.product.product_id}`);
}


  function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

 const reviewData: AddReviweRequest = {
  product_id: item.product?.product_id ?? 0,
  rating: rating,
  review_text: comment,
};

    const errors: string[] = [];
    if (reviewData.review_text.length === 0) {
      errors.push(t("form.errors.emptyReview"));
    }

    if (errors.length > 0) {
      setErrorsReview(errors);
      return;
    }

    mutate(reviewData);
  }

  if (isLoading) {
    return (
      <div className="my-40 mt-56">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-red-500">{error.name}</h3>
        <p className="py-10">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
        <div className="bg-gray-100 rounded flex items-center justify-center">
        <Image
  src={item.product?.images?.[0]?.origin_image || ""}
  alt={item.product_name || "Product image"}
  width={70}
  height={50}
  priority
  className="cursor-pointer"
  onClick={handleViewProduct}
/>

        </div>
        <div>
          <p className="font-medium">{item.product_name}</p>
          <p className="text-sm text-gray-500">
            {userCurrency} {viewPriceCurencyHandler(item.product_price ?? 0)} *{" "}
            {item.qty} ={userCurrency}{" "}
            {item.qty * Number(viewPriceCurencyHandler(item.product_price ?? 0))}
          </p>
        </div>
      </div>

<div className="w-full md:w-auto text-end">
  {review && review[0] ? (
    <StarRating rating={review[0]?.rating ?? 0} interactive={false} />
  ) : (
    orderStatus && (
      <button
        onClick={toggleDetails}
        disabled={isLoading}
        className={`
          flex items-center gap-1
          border border-blue-600 
          bg-white text-blue-600 
          hover:bg-blue-600 hover:text-white 
          focus:outline-none focus:ring-2 focus:ring-blue-300 
          transition 
          rounded-full px-3 py-1.5 
          text-sm font-semibold 
          disabled:opacity-50 disabled:cursor-not-allowed
          select-none
        `}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <FaRegStar key={star} size={14} className="text-blue-600 hover:text-white transition" />
        ))}
        <span>{t("reviewBtn")}</span>
      </button>
    )
  )}
</div>



      {/* Enhanced Modal Design */}
<Modal open={isModalOpen} classesName="pr-bg z-50" onClose={() => setIsModalOpen(false)}>
  <div
    className="bg-white rounded-2xl mx-auto p-0  z-50  relative overflow-hidden backdrop-blur-sm border border-gray-100"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    {/* Decorative Header Background */}
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-blue-500 to-purple-600 opacity-10"></div>
    
    {/* Modal Header */}
    <header className="relative flex justify-between items-center p-6 pb-4 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <div>
          <h2 id="modal-title" className="text-xl font-bold text-gray-900 leading-tight">
            {t("modal.title", { name: item.product_name })}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">Share your experience</p>
        </div>
      </div>
      <button
        aria-label={t("form.cancel")}
        onClick={() => setIsModalOpen(false)}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </header>

    <div className="p-6 space-y-6">
      {/* Error Messages */}
      {errorReview && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FaExclamationTriangle className="w-3 h-3 text-red-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-800 mb-1">Please fix the following:</h4>
              <div className="space-y-1">
                {errorReview.map((errText, idx) => (
                  <p key={idx} className="text-sm text-red-700">
                    • {errText}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Section */}
      <div className="space-y-3">
        <label htmlFor="rating" className="block text-sm font-semibold text-gray-900">
          {t("form.ratingLabel")}
        </label>
        <div className="flex items-center justify-center py-4 px-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors duration-200">
          <StarRating
            rating={rating}
            onRatingChange={{ setHoveredStar, handleStarClick }}
            size={32}
          />
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-gray-600 animate-in fade-in duration-300">
            {rating === 1 && "😞 Poor"}
            {rating === 2 && "😐 Fair"} 
            {rating === 3 && "🙂 Good"}
            {rating === 4 && "😊 Very Good"}
            {rating === 5 && "🤩 Excellent"}
          </p>
        )}
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div className="space-y-3">
          <label
            htmlFor="reviewText"
            className="block text-sm font-semibold text-gray-900"
          >
            {t("form.reviewLabel")}
          </label>
          <div className="relative">
            <textarea
              id="reviewText"
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-0 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-colors duration-200 bg-gray-50 focus:bg-white"
              placeholder={t("form.placeholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              aria-describedby="charCount"
            />
            <div className="absolute bottom-3 right-3 bg-white rounded-md px-2 py-1 shadow-sm">
              <div
                id="charCount"
                className={`text-xs font-medium select-none transition-colors ${
                  comment.length > 450 ? 'text-red-500' : 
                  comment.length > 400 ? 'text-amber-500' : 'text-gray-500'
                }`}
                aria-live="polite"
              >
                {comment.length}/500
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Be specific about what you liked or disliked
          </p>
        </div>

        {/* Buttons */}
        <footer className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            disabled={isPending}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 hover:border-gray-300"
          >
            {t("form.cancel")}
          </button>
          <button
            type="submit"
            disabled={isPending || rating === 0}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 shadow-lg ${
              isPending || rating === 0
                ? "bg-gray-300 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {isPending && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isPending ? t("form.submitting") : t("form.submit")}
            </span>
          </button>
        </footer>
      </form>
    </div>
  </div>
</Modal>
    </div>
  );
};

export default ProductItem;