import { Country } from "@/models/forntEndCountry";
import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await tokenIpAxios.get<Country[]>(
      "/shipping-zones/countries-with-cities"
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

