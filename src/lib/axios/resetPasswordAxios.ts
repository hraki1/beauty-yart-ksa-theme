import ipAxios from "./ipAxios";
import { AxiosError } from "axios";

interface RestPasswordRequestParams {
  email: string;
}

interface RestPasswordResponse {
  message: string;
}

export const restPasswordRequest = async ({
  email,
}: RestPasswordRequestParams): Promise<RestPasswordResponse> => {
  try {
    const response = await ipAxios.post<RestPasswordResponse>(
      "/auth/password-reset/request",
      { email }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

interface NewPasswordRequestParams {
  newPassword: string;
  token: string;
}

export const newPasswordRequest = async ({
  newPassword,
  token,
}: NewPasswordRequestParams): Promise<RestPasswordResponse> => {
  try {
    const response = await ipAxios.post<RestPasswordResponse>(
      "/auth/password-reset",
      { newPassword, token }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
