import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { ReturnRequest } from "../models/orderModal";

export interface ReturnItem {
  order_item_id: number;
  quantity: number;
  reason?: string;
}

export interface CreateReturnRequest {
  order_id: number;
  reason: string;
  note?: string;
  type?: "return_only" | "replacement";
  items: ReturnItem[];
}

export const createReturnRequest = async (
  newReturn: CreateReturnRequest
): Promise<ReturnRequest> => {
  try {
    console.log("Return request body:", JSON.stringify(newReturn, null, 2));

    const response = await tokenIpAxios.post<{ success: boolean; data: ReturnRequest }>(
      "/returns",
      newReturn
    );

    if (!response.data.success) {
      throw new Error("Failed to create return request");
    }

    return response.data.data; 
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message = error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
