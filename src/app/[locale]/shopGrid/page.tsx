"use client";

import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchContext } from "@/store/SearchContext";
import { getProducts, GetProductsParams } from "@/lib/axios/getProductsAxios";
import { getBrands } from "@/lib/axios/brandsAxios";
import { getCollectionById } from "@/lib/axios/collectionsAxios";
import { organizeCategories } from "@/utils/organizeCategories";
import { organizeBrands } from "@/utils/organizeBrands";
import { transformProduct } from "@/utils/trnsformProduct";
import { PriceRange } from "@/models/frontEndPrice";
import { Category, CategoryResponse } from "@/lib/models/categoryModal";
import FilterSidebar from "@/components/shopGrid/FilterSidebar";
import Toolbar from "@/components/shopGrid/Toolbar";
import ProductGrid from "@/components/shopGrid/ProductGrid";
import MobileFiltersModal from "@/components/shopGrid/MobileFiltersModal";
import { FrontEndProductCartItem } from "@/models/frontEndProductCartItem";
import HeroHeader from "@/components/shopGrid/HeroHeader ";
import { useCategories } from "@/store/CategoriesContext";
import { useWishlist } from "@/store/WishlistContext";
import { getCategories } from "@/lib/axios/categoryAxios";

const MAX_PRICE = 5000;

const ShopGridPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");
  const [priceRange, setPriceRange] = useState<PriceRange>([0, 2500]);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedBrandIds, setSelectedBrandIds] = useState<number[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<number | null>(null);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const { itemIds: likedProducts, toggleLike } = useWishlist();
  const [filteredProducts, setFilteredProducts] = useState<FrontEndProductCartItem[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<FrontEndProductCartItem[]>([]);

  const param = useSearchParams();
  const { clearSearchTerm } = useContext(SearchContext);
  const { categories } = useCategories();

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [productQuery, setProductQuery] = useState<
    Omit<GetProductsParams, "name" | "limit" | "brandId" | "collectionId"> & {
      name?: string;
      limit?: number;
      brandId?: number[];
      collectionId?: number;
    }
  >({ page: 1 });

  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch data
  const { data: productsData, isLoading: isLoadingFetchProducts } = useQuery({
    queryKey: ["products", productQuery],
    queryFn: ({ signal }) => {
      const query: GetProductsParams = {
        page: productQuery.page,
        limit: productQuery.limit || 10,
      };

      if (productQuery.name?.trim()) query.name = productQuery.name.trim();
      if (productQuery.categoryId) query.categoryId = productQuery.categoryId;
      if (productQuery.collectionId) query.collectionId = productQuery.collectionId;
      if (productQuery.brandId?.length) query.brandId = productQuery.brandId[0];

      return getProducts(query, signal);
    },
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const { data: collectionData } = useQuery({
    queryKey: ["collection", selectedCollectionId],
    queryFn: ({ signal }) => getCollectionById(signal, Number(selectedCollectionId)),
    enabled: !!selectedCollectionId,
  });

  // ✅ Memoize to avoid infinite loops
  const organizedCategories = useMemo(
    () => (categories ? organizeCategories(categories) : null),
    [categories]
  );

  const organizedBrands = useMemo(
    () => brandsData?.data?.map(organizeBrands) || [],
    [brandsData]
  );

  // Update pagination when data changes
  useEffect(() => {
    if (productsData) {
      setPagination((prev) => ({
        ...prev,
        total: productsData.total,
      }));
    }
  }, [productsData]);

  // ✅ Handle initial URL params (runs when params or categories change)
  useEffect(() => {
    const cateID = param.get("categoryid");
    const brandID = param.get("brandid");
    const searchTerm = param.get("query");
    const collectionID = param.get("collectionId");

    const initialQuery: typeof productQuery = { page: 1 };

    if (cateID) {
      const categoryId = Number(cateID);
      setSelectedCategoriesIds([categoryId]);
      initialQuery.categoryId = categoryId;

      const c = organizedCategories?.allWithSub.find((c) => c.id === categoryId);
      if (c) setSelectedCategory(c);
    }

    if (brandID) {
      const brandId = Number(brandID);
      setSelectedBrandIds([brandId]);
      initialQuery.brandId = [brandId];
    }

    if (collectionID) {
      const collectionId = Number(collectionID);
      setSelectedCollectionId(collectionId);
      initialQuery.collectionId = collectionId;
    }

    if (searchTerm) {
      setSearchQuery(searchTerm);
      initialQuery.name = searchTerm;
    }

    if (cateID || brandID || searchTerm || collectionID) {
      setProductQuery(initialQuery);
    }
  }, [param, organizedCategories]);

  // Handle search query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        setProductQuery((prev) => ({
          ...prev,
          name: searchQuery,
          page: 1,
        }));
      } else {
        setProductQuery((prev) => {
          const rest = { ...prev };
          delete rest.name;
          return { ...rest, page: 1 };
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // First filter: Apply all filters except price
  useEffect(() => {
    if (!productsData?.data) return;

    const allProducts = productsData.data.map(transformProduct);
    const filtered = allProducts.map((product) => ({
      ...product,
      imageHover:
        product.images?.[1]?.origin_image ||
        product.images?.[0]?.origin_image ||
        "",
    }));

    setFilteredProducts(filtered);
  }, [productsData, selectedCategoriesIds, selectedBrandIds, searchQuery]);

  // Second filter: Apply price range and sorting
  useEffect(() => {
    if (filteredProducts.length === 0) {
      setDisplayedProducts([]);
      return;
    }

    const [min, max] = priceRange;
    const filtered = filteredProducts.filter(
      (product) =>
        Number(product.price) >= min && Number(product.price) <= max
    );

    if (sortOption === "price-low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOption === "price-high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setDisplayedProducts(filtered);
  }, [filteredProducts, priceRange, sortOption]);

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSortOption("featured");
    setPriceRange([0, MAX_PRICE]);
    setSelectedCategoriesIds([]);
    setSelectedBrandIds([]);
    setSelectedColors([]);
    setSelectedCategory(null);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setProductQuery({ page: 1 });
    clearSearchTerm();
  };

  // Toggle category
  const toggleCategoryId = (categoryId: number) => {
    setSelectedCategoriesIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [categoryId]
    );

    setProductQuery((prev) => {
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
      }

      if (prev.categoryId === categoryId) {
        const updated = { ...prev };
        delete updated.categoryId;
        return { ...updated, page: 1 };
      }
      return { ...prev, categoryId, page: 1 };
    });

    const c = organizedCategories?.allWithSub.find((c) => c.id === categoryId);
    if (c) setSelectedCategory(c);
  };

  // Toggle brand
  const toggleBrandId = (brandId: number) => {
    setSelectedBrandIds((prev) => {
      const newBrandIds = prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [brandId];

      setProductQuery((prev) => ({
        ...prev,
        brandId: newBrandIds.length > 0 ? newBrandIds : undefined,
        page: 1,
      }));

      return newBrandIds;
    });
  };

  // Toggle color
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    const page = Math.max(1, Math.min(newPage, Math.ceil(pagination.total / 10)));
    const limit = productQuery.limit ?? 10;

    if (page !== pagination.page) {
      setPagination((prev) => ({ ...prev, page, limit }));
      setProductQuery((prev) => ({ ...prev, page, limit }));

      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 0);
    }
  };

  const { data: categoriesResponse } = useQuery<CategoryResponse>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div ref={scrollRef} className="min-h-screen bg-white w-full">
      <HeroHeader
        collectionData={
          collectionData
            ? { name: collectionData.name, image: collectionData.image }
            : undefined
        }
        categoryData={
          selectedCategory
            ? {
                description: {
                  name: selectedCategory.description.name,
                  description: selectedCategory.description.description,
                  image: selectedCategory.description.image,
                },
              }
            : undefined
        }
        brandData={
          selectedBrandIds.length > 0 && brandsData?.data
            ? {
                name:
                  brandsData.data.find((b) => b.id === selectedBrandIds[0])
                    ?.name || "Brand Products",
                description:
                  brandsData.data.find((b) => b.id === selectedBrandIds[0])
                    ?.description || "Explore our brand collection",
                image: brandsData.data.find(
                  (b) => b.id === selectedBrandIds[0]
                )?.image,
              }
            : undefined
        }
        categories={categoriesResponse?.data || []}
        defaultTitle="Shop"
        defaultImage="https://crido.wpbingosite.com/wp-content/uploads/2021/10/high-angle-view-spa-products-white-backdrop-scaled.jpg"
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <Toolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOption={sortOption}
          setSortOption={setSortOption}
          setShowFilters={setShowFilters}
        />

        <div className="flex flex-col md:flex-row w-full gap-12">
          <div className="w-full md:w-1/4">
            <FilterSidebar
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              organizedCategories={organizedCategories}
              selectedCategoriesIds={selectedCategoriesIds}
              toggleCategoryId={toggleCategoryId}
              organizedBrands={organizedBrands}
              selectedBrandIds={selectedBrandIds}
              toggleBrandId={toggleBrandId}
              selectedColors={selectedColors}
              toggleColor={toggleColor}
              resetFilters={resetFilters}
              MAX_PRICE={MAX_PRICE}
            />
          </div>

          <div className="w-full md:w-3/4">
            <ProductGrid
              products={displayedProducts}
              isLoading={isLoadingFetchProducts}
              pagination={pagination}
              handlePageChange={handlePageChange}
              selectedCategory={selectedCategory}
              toggleCategoryId={toggleCategoryId}
              likedProducts={likedProducts}
              toggleLike={toggleLike}
              selectedCategoriesIds={selectedCategoriesIds}
              resetFilters={resetFilters}
            />
          </div>
        </div>
      </div>

      <MobileFiltersModal
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        organizedCategories={organizedCategories}
        selectedCategoriesIds={selectedCategoriesIds}
        toggleCategoryId={toggleCategoryId}
        organizedBrands={organizedBrands}
        selectedBrandIds={selectedBrandIds}
        toggleBrandId={toggleBrandId}
        resetFilters={resetFilters}
        MAX_PRICE={MAX_PRICE}
      />
    </div>
  );
};

export default ShopGridPage;
