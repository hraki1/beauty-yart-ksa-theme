import ipAxios from "./ipAxios";
import { AxiosError } from "axios";
import User from "../models/userModel";

export interface SignUpRequest {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export const signUp = async (data: SignUpRequest): Promise<User> => {
  console.log(data);

  try {
    const response = await ipAxios.post<User>(
      "/auth/register",
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
