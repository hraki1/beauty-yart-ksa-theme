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
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("wishlist") : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FrontEndProductCartItem[]) : [];
  } catch {
    return [];
  }
}

function writeWishlistToStorage(items: FrontEndProductCartItem[]) {
  try {
    localStorage.setItem("wishlist", JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FrontEndProductCartItem[]>([]);

  // initialize from localStorage
  useEffect(() => {
    setItems(readWishlistFromStorage());
  }, []);

  // keep storage in sync and notify other tabs
  useEffect(() => {
    writeWishlistToStorage(items);
  }, [items]);

  // react to storage changes from other tabs/components
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "wishlist") {
        setItems(readWishlistFromStorage());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
      const next = exists ? prev.filter((p) => p.id !== product.id) : [...prev, product];
      return next;
    });
  }, []);

  const isLiked = useCallback((productId: number) => itemIds.includes(productId), [itemIds]);

  const value: WishlistContextType = {
    items,
    itemIds,
    count,
    isLiked,
    toggleLike,
    add,
    remove,
    clear: () => setItems([]),
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export function useWishlist(): WishlistContextType {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}


