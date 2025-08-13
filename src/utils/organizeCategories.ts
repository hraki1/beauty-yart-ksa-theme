import { Category } from "@/lib/models/categoryModal";

// Type for subcategory that includes its parent
type SubCategoryWithParent = Category & {
  parentCategory: CategoryWithParent | undefined;
};

// Category with full parent category instead of parent_id
type CategoryWithParent = Category & {
  categoryParent?: CategoryWithParent;
};

// Category that may have subcategories
type CategoryWithSubCategory = CategoryWithParent & {
  subCategory: SubCategoryWithParent[];
};

// Optional: for other uses
type CategoryWithChildren = Category & {
  children: Category[];
};

export const organizeParentCategoriesWithSubs = (
  categories: Category[]
): CategoryWithSubCategory[] => {
  const childrenMap: Record<string, Category[]> = {};

  categories.forEach((cat) => {
    if (cat.parent_id) {
      if (!childrenMap[cat.parent_id]) {
        childrenMap[cat.parent_id] = [];
      }
      childrenMap[cat.parent_id].push(cat);
    }
  });

  const parentCategories = categories.filter((cat) => cat.parent_id === null);

  const parentsWithSubs: CategoryWithSubCategory[] = parentCategories.map(
    (parent) => {
      const sub = childrenMap[parent.id];
      const subWithParent: SubCategoryWithParent[] = (sub ?? []).map((child) => ({
        ...child,
        parentCategory: { ...parent },
      }));
      return {
        ...parent,
        subCategory: subWithParent,
      };
    }
  );

  return parentsWithSubs;
};

export const organizeCategories = (categories: Category[]) => {
  // Build map for quick access and to replace parent_id with full object recursively
  const categoryMap: Record<number, Category> = {};
  categories.forEach((cat) => {
    categoryMap[cat.id] = cat;
  });

  // Helper to remove parent_id and add categoryParent recursively
  function transformCategory(cat: Category | undefined): CategoryWithParent | undefined {
    if (!cat) {
      console.warn("Orphaned category: parent_id missing in categoryMap", cat);
      return undefined;
    }
    const { parent_id, ...rest } = cat;
    const categoryParent = parent_id !== null ? transformCategory(categoryMap[parent_id]) : undefined;
    return categoryParent
      ? {
          ...rest,
          parent_id,
          categoryParent,
        }
      : {
          ...rest,
          parent_id,
        };
  }

  // Build children map
  const childrenMap: Record<number, Category[]> = {};
  categories.forEach((cat) => {
    if (cat.parent_id !== null) {
      if (!childrenMap[cat.parent_id]) childrenMap[cat.parent_id] = [];
      childrenMap[cat.parent_id].push(cat);
    }
  });

  // parents with children
  const parents = categories.filter((cat) => cat.parent_id === null);
  const parentsWithChildren: CategoryWithChildren[] = parents
    .map((parent) => {
      const children = childrenMap[parent.id] || [];
      if (children.length === 0) return null;
      return { ...parent, children };
    })
    .filter(Boolean) as CategoryWithChildren[];

  const parentsWithoutChildren = parents.filter(
    (parent) => !childrenMap[parent.id] || childrenMap[parent.id].length === 0
  );

  const allParent = organizeParentCategoriesWithSubs(categories);

  // Build allWithSub with full categoryParent and parentCategory inside subCategory
  const allWithSub: CategoryWithSubCategory[] = categories
    .map((cat) => {
      const transformedCat = transformCategory(cat);
      if (!transformedCat) return undefined;
      const sub = childrenMap[cat.id] ?? [];
      const subWithParent: SubCategoryWithParent[] = sub
        .map((child) => {
          const transformedChild = transformCategory(child);
          if (!transformedChild) return undefined;
          return {
            ...transformedChild,
            parentCategory: transformedCat,
          };
        })
        .filter(Boolean) as SubCategoryWithParent[];

      return {
        ...transformedCat,
        subCategory: subWithParent,
      };
    })
    .filter(Boolean) as CategoryWithSubCategory[];

  // Create a new list with all root categories and their children (if any)
  const rootCategoriesWithChildren = parents.map(parent => {
    const children = childrenMap[parent.id] || [];
    return {
      ...parent,
      children: children.length > 0 ? children : []
    };
  });

  return {
    rootCategoriesWithChildren, // New list: root categories with children (empty array if no children)
    parentsWithChildren,
    parentsWithoutChildren,
    allWithSub,
    allParent,
  };
};

// Helper to remove parent_id from category object
// (No longer needed, but kept for reference.)
// function omitParentId(cat: Category): Omit<Category, "parent_id"> {
//   const { parent_id, ...rest } = cat;
//   return rest;
// }
