import ipAxios from "./ipAxios";
import { AxiosError } from "axios";
import User from "../models/userModel";

export interface otpRequest {
  email: string;
  otp: string;
}

export interface otpResponse {
  user: User;
  token: string;
}

export const otpVerify = async (data: otpRequest): Promise<otpResponse> => {
  console.log(data);

  try {
    const response = await ipAxios.post<otpResponse>(
      "/auth/verify-otp",
      data
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "حدث خطأ غير متوقع أثناء التسجيل";
    throw new Error(message);
  }
};


export const resendOtp = async (email: string) => {
  console.log(email);

  try {
    const response = await ipAxios.post<{ message: string }>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-otp`,
      { email }
    );
    return response.data.message || "تم إرسال الرمز بنجاح";
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "حدث خطأ غير متوقع أثناء التسجيل";
    throw new Error(message);
  }
};



