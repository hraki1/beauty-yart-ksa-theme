'use client';

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBrands } from "@/lib/axios/brandsAxios";
import { BrandWithProducts } from "@/lib/models/brandsModal";
import Spinner from "@/components/UI/SpinnerLoading";

interface BrandsContextType {
  brands: BrandWithProducts[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const BrandsContext = createContext<BrandsContextType | undefined>(undefined);

export const BrandsProvider = ({ children }: { children: ReactNode }) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Spinner /></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <h2 className="text-red-600 font-bold text-lg mb-2">Failed to load brands</h2>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <BrandsContext.Provider
      value={{
        brands: data?.data,
        isLoading,
        error: error as Error | null,
        refetch,
      }}
    >
      {children}
    </BrandsContext.Provider>
  );
};

export const useBrands = () => {
  const context = useContext(BrandsContext);
  if (!context) {
    throw new Error("useBrands must be used within a BrandsProvider");
  }
  return context;
}; 