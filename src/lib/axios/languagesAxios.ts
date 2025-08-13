import ipAxios from "./ipAxios";
import { AxiosError } from "axios";
import { LanguageResponse } from "../models/languagesModal";

export const getLanguages = async (): Promise<LanguageResponse> => {
  try {
    const response = await ipAxios.get<LanguageResponse>(
      "/languages"
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
