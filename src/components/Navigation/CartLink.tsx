"use client";

import { CartContext } from "@/store/CartContext";
import Link from "next/link";
import { useContext } from "react";
import { PiBag } from "react-icons/pi";

export default function CartLink() {
  const { cartQuantity } = useContext(CartContext);
  const itemCount = cartQuantity || 0;

  return (
    <Link
      href="/cart"
      className="group relative flex items-center p-4 rounded-md transition-colors duration-200 bg-[#f1f2fe] hover:text-blue-600"
      aria-label={`Shopping Cart with ${itemCount} items`}
    >
      <PiBag  className="text-black text-2xl md:text-[30px] group-hover:text-blue-700 transition-colors duration-200" />
      {itemCount > 0 && (
        <span
          className="absolute top-3.5 right-2.5 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
          aria-hidden="true"
        >
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}
