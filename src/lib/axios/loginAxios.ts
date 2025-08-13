import ipAxios from "./ipAxios";
import { AxiosError } from "axios";
import User from "../models/userModel";

export interface loginRequest {
  email: string;
  password: string;
}

export interface loginResponse {
  user: User;
  token: string;
  requiresVerification: boolean;
}

export const login = async (data: loginRequest): Promise<loginResponse> => {
  try {
    const response = await ipAxios.post<loginResponse>(
      "/auth/login",
      data
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;

    if (error.response?.status === 401) {
      return {
        user: {} as User,
        token: "",
        requiresVerification: true,
      };
    }

    const message =
      error.response?.data?.message || "حدث خطأ غير متوقع أثناء تسجيل الدخول";
    throw new Error(message);
  }
};
