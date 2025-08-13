import ipAxios from "./ipAxios";
import { AxiosError } from "axios";
import { Product } from "../models/productsModal";

interface searchProductsResponse {
  data: Product[];
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  q?: string;
  lang?: string;
}

export const getSearchProducts = async (
  params: GetProductsParams = {},
  signal?: AbortSignal
): Promise<searchProductsResponse> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await ipAxios.get<searchProductsResponse>(
      `/products/search?lang=${lang}`,
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
