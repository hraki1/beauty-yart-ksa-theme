import { motion } from "framer-motion";
import React from "react";
import { ProductReview } from "@/lib/models/reviewModal";
import StarRating from "../shared/StarRating";

const ReviewsSection: React.FC<{ productReviews: ProductReview[] }> = ({
  productReviews,
}) => {

  if (!productReviews || productReviews.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">
        Customer Reviews
      </h2>

      <div className="space-y-6">
        {productReviews.map((review) => (
          <motion.div
            key={review.review_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <div>
                <h3 className="font-semibold text-gray-800">{review.customer.full_name}</h3>
                <div className="flex items-center mt-1">
                  <StarRating rating={review.rating} />
                  <span className="text-gray-500 text-sm ml-2">{review.rating.toFixed(1)}</span>
                </div>
              </div>
              <span className="text-gray-400 text-sm mt-2 sm:mt-0">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600 mt-3 leading-relaxed">{review.review_text}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ReviewsSection;
