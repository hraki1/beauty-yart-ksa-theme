'use client'

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/axios/categoryAxios";
import { Category } from "@/lib/models/categoryModal";
import Spinner from "@/components/UI/SpinnerLoading";

// Define the context shape
interface CategoriesContextType {
    categories: Category[] | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export const CategoriesProvider = ({ children }: { children: ReactNode }) => {
    const {
        data,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    if (isLoading) {
        return <div className="flex justify-center items-center py-10"><Spinner /></div>;
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <h3 className="text-red-500">
                    {" "}
                    {error.name}
                </h3>
                <p className="py-10">
                    {error?.message}
                </p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Retry
                </button>
            </div>
        );
    }



    return (
        <CategoriesContext.Provider
            value={{
                categories: data?.data,
                isLoading,
                error: error as Error | null,
                refetch,
            }}
        >
            {children}
        </CategoriesContext.Provider>
    );
};

export const useCategories = () => {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error("useCategories must be used within a CategoriesProvider");
    }
    return context;
}; 