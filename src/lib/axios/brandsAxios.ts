import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { BrandsResponse} from "../models/brandsModal";

export const getBrands = async (): Promise<BrandsResponse> => {
  try {
    const response = await tokenIpAxios.get<BrandsResponse>(
      "/brands"
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
