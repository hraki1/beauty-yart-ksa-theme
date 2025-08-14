export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "completed"
  | "unknown";

export type ShipmentStatus = "pending" | "Shipped" | "delivered" | "unknown";
export type PaymentStatus = "pending" | "paid" | "Cancelled" ;
export type ReturnRequestStatus = "pending" | "approved" | "rejected" | "completed";

export interface Order {
  order_id: number;
  uuid: string;
  integration_order_id: string | null;
  sid: string | null;
  order_number: string;
  status: OrderStatus;
  cart_id: number;
  currency: string;
  customer_id: number;
  customer_email: string;
  customer_full_name: string;
  user_ip: string | null;
  user_agent: string | null;
  coupon: string | null;

  shipping_fee_excl_tax: number;
  shipping_fee_incl_tax: number;
  shipping_fee_incl_tax_with_discount: number;
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
  total_tax_amount: number;
  shipping_note: string | null;
  grand_total: number;

  shipping_method: string;
  shipping_method_name: string;
  shipping_address_id: number;

  payment_method: string;
  payment_method_name: string;
  billing_address_id: number;

  shipment_status: ShipmentStatus | null;
  payment_status: PaymentStatus;
  cancellation_reason: string | null;

  created_at: string; // ISO DateTime
  updated_at: string; // ISO DateTime

  /** ✅ Relations (may be omitted if not included in API response) */
  items?: OrderItem[];
  shipments?: Shipment[];
  transactions?: Transaction[];
  activities?: Activity[];
  invoices?: Invoice[];
  returnRequests?: ReturnRequest[];

  /** ✅ Computed convenience flags */
  isFullyDelivered?: boolean;
  totalReturnsCount?: number;
}

export interface OrderItem {
  order_item_id: number;
  uuid: string;
  order_item_order_id: number;
  product_id: number;
  referer: string | null;
  product_sku: string;
  product_name: string;
  thumbnail: string | null;
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
  variant_options: Record<string, unknown> | null;
  product_custom_options: Record<string, unknown> | null;
  requested_data: Record<string, unknown> | null;

  created_at: string;
  updated_at: string;

  /** ✅ Product details including return policy */
  product?: Product;

  /** ✅ Optional computed flag for UI checks */
  isReturnEligible?: boolean;
}

export interface ProductImage {
  product_image_id: number;
  product_image_product_id: number;
  origin_image: string;
  thumb_image: string;
  listing_image: string;
  single_image: string;
  is_main: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  product_id: number;
  uuid: string;
  sku: string;
  type: string;
  group_id: number;
  category_id: number;
  brand_id: number;
  variant_group_id: number;
  price: number;
  old_price: number | null;
  weight: number;
  tax_class: number;
  status: boolean;
  visibility: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];

  /** ✅ Return policy (optional) */
  returnPolicy?: ReturnPolicy;
}

export interface ReturnPolicy {
  policy_id: number;
  name: string;
  days_limit: number;
  restocking_fee: number;
  required_reasons: string | null;
}

export interface ReturnRequest {
  return_request_id: number;
  order_id: number;
  order_item_id: number;
  reason: string;
  status: ReturnRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface Shipment {
  shipment_id: number;
  uuid: string;
  shipment_order_id: number;
  carrier: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  payment_transaction_id: number;
  uuid: string;
  payment_transaction_order_id: number;
  transaction_id: string;
  transaction_type: string;
  amount: number;
  parent_transaction_id: string | null;
  payment_action: string;
  additional_information: Record<string, unknown>;
  created_at: string;
}

export interface Activity {
  order_activity_id: number;
  uuid: string;
  order_activity_order_id: number;
  comment: string;
  customer_notified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  pdf_url: string | null;
  invoice_number: string;
}
