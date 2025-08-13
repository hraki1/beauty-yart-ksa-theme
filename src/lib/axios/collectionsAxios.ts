import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { CollectionResponse, Collection } from "../models/collectionModal";

export const getCollections = async (): Promise<CollectionResponse> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await tokenIpAxios.get<CollectionResponse>(
      `/collections?lang=${lang}`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

export const getCollectionById = async (
  signal: AbortSignal,
  collectionId: number
): Promise<Collection> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await tokenIpAxios.get<Collection>(
      `/collections/${collectionId}?lang=${lang}`,
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
