"use client";

import React, { createContext, useCallback, useEffect, useMemo, useState, useContext } from "react";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";

type WishlistContextType = {
  items: FrontEndProductCartItem[];
  itemIds: number[];
  count: number;
  isLiked: (productId: number) => boolean;
  toggleLike: (product: FrontEndProductCartItem) => void;
  add: (product: FrontEndProductCartItem) => void;
  remove: (productId: number) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

function readWishlistFromStorage(): FrontEndProductCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("wishlist");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeWishlistToStorage(items: FrontEndProductCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("wishlist", JSON.stringify(items));
  } catch {}
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FrontEndProductCartItem[]>([]);

  // initialize from localStorage on first render
  useEffect(() => {
    const stored = readWishlistFromStorage();
    if (stored.length > 0) setItems(stored);
  }, []);

  // persist on changes
  useEffect(() => {
    writeWishlistToStorage(items);
  }, [items]);

  const itemIds = useMemo(() => items.map((p) => p.id), [items]);
  const count = items.length;

  const add = useCallback((product: FrontEndProductCartItem) => {
    setItems((prev) => (prev.some((p) => p.id === product.id) ? prev : [...prev, product]));
  }, []);

  const remove = useCallback((productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const toggleLike = useCallback((product: FrontEndProductCartItem) => {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      return exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
    });
  }, []);

  const isLiked = useCallback((productId: number) => itemIds.includes(productId), [itemIds]);

  return (
    <WishlistContext.Provider
      value={{ items, itemIds, count, isLiked, toggleLike, add, remove, clear: () => setItems([]) }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
