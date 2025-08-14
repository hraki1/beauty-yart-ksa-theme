"use client";

import { useMemo } from "react";
import { Collection } from "@/lib/models/collectionModal";
import HorizontalProductList from "./productsLists/HorizontalProductList";
import { transformProductToCollectionCartItem } from "@/utils/trnsformProductsCollecionCardOItem";
import BannersSection from "./BannerSection";
// import BundleProducts from "./BundleProducts";

interface CollectionsProps {
  collections: Collection[];
  banners: Collection[];
}

const Collections = ({ collections, banners }: CollectionsProps) => {
  const { position1Collections, otherCollections, filteredBanners } = useMemo(() => {
    const position1 = collections.filter(c => c.position === 1);
    const others = collections.filter(c => c.position !== 1).sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const bannersWithPosition = banners.filter(b => b.position && b.position > 0);
    return { position1Collections: position1, otherCollections: others, filteredBanners: bannersWithPosition };
  }, [collections, banners]);

  if (!collections?.length) return null;

  return (
    <>
      {/* Position 1 Collections */}
      {position1Collections.map((collection) => (
        <HorizontalProductList
          key={collection.collection_id}
          id={collection.collection_id}
          title={collection.name}
          products={collection.products.map(transformProductToCollectionCartItem)}
        />
      ))}

      {/* Banner Section - only show if banners with position > 0 exist */}

      {/* Other Collections (after banners) */}
      {otherCollections.map((collection) => (
        <HorizontalProductList
          key={collection.collection_id}
          id={collection.collection_id}
          title={collection.name}
          products={collection.products.map(transformProductToCollectionCartItem)}
        />
      ))}

      {/* Bundle Products Section */}
      {/* <BundleProducts collections={collections} /> */}
      {filteredBanners?.length > 0 && <BannersSection banners={filteredBanners} />}

    </>
  );
};

export default Collections;