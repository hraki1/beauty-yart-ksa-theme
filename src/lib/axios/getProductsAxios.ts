import ipAxios from "./ipAxios";
import { AxiosError } from "axios";
import { ProductsResponse } from "../models/productsModal";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  sku?: string;
  name?: string;
  categoryId?: number;
  brandId?: number;
  collectionId?: number;
  visibility?: boolean;
  status?: "active" | "inactive";
  lang?: string;
}

export const getProducts = async (
  params: GetProductsParams = {},
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await ipAxios.get<ProductsResponse>(
      `/products?lang=${lang}`,
      { params, signal }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

export const getProductByUrlKey = async (
  url_key: string,
  signal?: AbortSignal
): Promise<ProductsResponse> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await ipAxios.get<ProductsResponse>(
      `/products/by-url/${url_key}?lang=${lang}`,
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
