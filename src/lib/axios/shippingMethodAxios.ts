import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";

export interface ShippingMethod {
  methodId: number;
  name: string;
  carrier: string;
  cost: number;
  created_at: string;
}

export const getShippingMethod = async (
  cartId: number,
  addressId: number
): Promise<ShippingMethod[]> => {
  try {
    const response = await tokenIpAxios.get<ShippingMethod[]>(
      `/${cartId}/shipping-methods/${addressId}`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
