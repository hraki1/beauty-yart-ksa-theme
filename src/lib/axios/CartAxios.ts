import tokenIpAxios from "./tokenIpAxios";
import { AxiosError } from "axios";

export interface CartResponse {
  cart_id: number;
  uuid: string;
  sid: string | null;
  currency: string | null;
  customer_id: number;
  customer_group_id: number | null;
  customer_email: string;
  customer_full_name: string;
  user_ip: string | null;
  status: boolean;
  coupon: string | null;
  shipping_fee_excl_tax: number | null;
  shipping_fee_incl_tax: number | null;
  shipping_fee_incl_tax_with_discount: number | null;
  discount_amount: number | null;
  sub_total: number;
  sub_total_incl_tax: number;
  sub_total_with_discount: number;
  sub_total_with_discount_incl_tax: number;
  total_qty: number;
  total_weight: number;
  tax_amount: number;
  tax_amount_before_discount: number;
  shipping_tax_amount: number;
  grand_total: number;
  shipping_method: string | null;
  shipping_method_name: string | null;
  shipping_zone_id: number | null;
  shipping_address_id: number | null;
  payment_method: string | null;
  payment_method_name: string | null;
  billing_address_id: number | null;
  shipping_note: string | null;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  total_tax_amount: number;
  user_id: number;
  items: CartItem[];
}

export interface CartItem {
  cart_item_id: number;
  uuid: string;
  cart_id: number;
  product_id: number;
  product_sku: string;
  product_name: string;
  image: string;
  product_weight: number;
  product_price: number;
  product_price_incl_tax: number;
  qty: number;
  final_price: number;
  final_price_incl_tax: number;
  tax_percent: number;
  tax_amount: number;
  tax_amount_before_discount: number;
  discount_amount: number;
  line_total: number;
  line_total_with_discount: number;
  line_total_incl_tax: number;
  line_total_with_discount_incl_tax: number;
  variant_group_id: number | null;
  variant_options: unknown | null;
  product_custom_options: unknown | null;
  created_at: string;
  updated_at: string;
  product: {
    description: {
      url_key: string;
    };
  };
}

export const getCartByToken = async (): Promise<CartResponse> => {
  try {
    const response = await tokenIpAxios.get<CartResponse>(
      "/carts/customer"
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

type AddToCartParams = {
  productId: number;
  qty?: number;
};

export const AddToCart = async ({
  productId,
  qty = 1,
}: AddToCartParams): Promise<CartResponse> => {
  try {
    const response = await tokenIpAxios.post(
      "/carts/add-items",
      {
        product_id: productId,
        qty: qty,
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

type UpdateCartItemQuantityParams = {
  cart_item_id: number;
  qty?: number;
};

export const UpdateCartItemQuantity = async ({
  qty = 1,
  cart_item_id,
}: UpdateCartItemQuantityParams): Promise<CartResponse> => {
  try {
    const response = await tokenIpAxios.put(
      `/carts/items/${cart_item_id}`,
      {
        qty: qty,
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

type DeleteCartItemParams = {
  cart_item_id: number;
};

export const DeleteCartItem = async ({
  cart_item_id,
}: DeleteCartItemParams): Promise<CartResponse> => {
  const token = localStorage.getItem("token");

  if (!token) {
    const message = "you are not authorize";
    throw new Error(message);
  }

  try {
    const response = await tokenIpAxios.delete(
      `/carts/items/${cart_item_id}`
    );

    console.log(response.data);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};

type ApplyCouponParams = {
  coupon_code: string;
};

export const ApplyCoupon = async ({
  coupon_code,
}: ApplyCouponParams): Promise<CartResponse> => {
  try {
    const response = await tokenIpAxios.post(
      "/coupons/apply",
      {
        couponCode: coupon_code,
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

type DeleteAppliedCouponParams = {
  cartId: number;
};

export const DeleteAppliedCoupon = async ({
  cartId,
}: DeleteAppliedCouponParams): Promise<CartResponse> => {
  try {
    const response = await tokenIpAxios.post(
      "/coupons/remove",
      { cartId }
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    throw new Error(message);
  }
};
