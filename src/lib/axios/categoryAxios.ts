import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { CategoryResponse } from "../models/categoryModal";

export const getCategories = async (): Promise<CategoryResponse> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await tokenIpAxios.get<CategoryResponse>(
      `/categories?lang=${lang}&limit=1000`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
