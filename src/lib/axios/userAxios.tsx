import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import User from "../models/userModel";

export interface UpdateUserRequest {
  full_name?: string;
  phone_number?: string;
  birthday?: string;
}

export const updateProfile = async (
  userData: UpdateUserRequest,
  userId: number
): Promise<User> => {
  try {
    const response = await tokenIpAxios.put<User>(
      `/user/profile/${userId}`,
      {
        ...userData,
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
