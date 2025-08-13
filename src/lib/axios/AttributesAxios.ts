import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";
import { AttributeGroupResponse } from "../models/attributesModal";

export const getAttributeGroupById = async (
  groupId: number | string
): Promise<AttributeGroupResponse> => {
  try {
    const lang = localStorage.getItem("lang") ?? "en";
    const response = await tokenIpAxios.get<AttributeGroupResponse>(
      `/attribute-groups/${groupId}?lang=${lang}`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
