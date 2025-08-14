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
      <LuShoppingBag className="text-black text-2xl  hover:-translate-y-0.5 duration-200 " />
      <span
        className="absolute -top-4 -right-4 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center "
        aria-hidden="true"
      >
        {itemCount > 9 ? "9+" : itemCount}
      </span>

    </Link>
  );
}
