"use client";

import { CartContext } from "@/store/CartContext";
import Link from "next/link";
import { useContext } from "react";
import { LuShoppingBag } from "react-icons/lu";

export default function CartLink() {
  const { cartQuantity } = useContext(CartContext);
  const itemCount = cartQuantity || 0;

  return (
    <Link
      href="/cart"
      className="group relative flex items-center rounded-md"
      aria-label={`Shopping Cart with ${itemCount} items`}
    >
      <LuShoppingBag   className="text-black text-2xl  " />
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
