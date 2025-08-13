import { getProductByUrlKey } from "@/lib/axios/getProductsAxios";
import { transformProduct } from "@/utils/trnsformProduct";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ url_Key: string }>;
}): Promise<Metadata> {
  const { url_Key } = await params;

  try {
    const response = await getProductByUrlKey(url_Key);
    const products = response?.data?.map(transformProduct);
    const product = products?.[0];

    if (!product) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const title = product.meta_title || product.name;
    const description = product.meta_description || product.short_description || product.description;
    const keywords = product.meta_keywords;
    const image = product.image || product.images?.[0]?.origin_image;
    const price = product.price;
    const originalPrice = product.originalPrice;

    return {
      title,
      description,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
      
      // Open Graph
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.url_key}`,
        images: image ? [
          {
            url: image,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ] : undefined,
        siteName: 'SARH Store',
      },

      // Twitter
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : undefined,
      },

      // Additional meta tags
      other: {
        'product:price:amount': price?.toString(),
        'product:price:currency': 'USD',
        'product:availability': product.stock_availability ? 'in stock' : 'out of stock',
        'product:condition': 'new',
        ...(originalPrice && { 'product:price:original': originalPrice.toString() }),
      },

      // Structured data
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${product.url_key}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for product:', error);
    return {
      title: "Product",
      description: "Product details",
    };
  }
} 