import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { ProductReviewProfile, ProductReview } from "../models/reviewModal";

export const getReviewsForProduct = async (
  productId: number,
  signal?: AbortSignal
): Promise<ProductReviewProfile[]> => {
  try {
    const response = await tokenIpAxios.get<ProductReviewProfile[]>(
      `/reviews/product/${productId}/customer`,
      { signal }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

export interface AddReviweRequest {
  product_id: number;
  rating: number;
  review_text: string;
}

export const addReview = async (
  newReview: AddReviweRequest
): Promise<ProductReview> => {
  try {
    const response = await tokenIpAxios.post<ProductReview>(
      "/reviews",
      {
        ...newReview,
      }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

export const getReviewsForProductById = async (
  productId: number,
  signal?: AbortSignal
): Promise<ProductReview[]> => {
  try {
    const response = await tokenIpAxios.get<ProductReview[]>(
      `/reviews/product/${productId}`,
      { signal }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

