
import { Settings } from "@/models/forntEndSettings";

export const defaultSettings: Settings = {
  enable_reviews: true, 
  enable_wishlist: true, 
  meta_title: "Sarh ", 
  meta_description: "Your favorite online store in Sarh Al-Nommow.", 
  meta_keywords: "store, ecommerce, online shopping, Sarh Al-Nommow", 
  social_media_links: {
    facebook: "https://facebook.com/sarhalnommow", 
    twitter: "https://twitter.com/sarhalnommow", 
    instagram: "https://instagram.com/sarhalnommow", 
    pinterest: "https://pinterest.com/sarhalnommow" 
  },
  payment_methods: ["credit_card", "cash"], 
  available_currencies: ["USD", "JOD"], 
  store_logo: "", // Path to Sarh Al-Nommow store logo if available
  store_name: "Sarh", 
  contact_email: "support@sarhalnommow.com",
  contact_phone: "+000-0000-000", 
  store_address: "123 Sarh Al-Nommow Street", 
  store_country: "Jordan", 
  store_city: "Amman", 
  post_code: "11118", 
  default_language: "en", 
  default_currency: "jo" 
};
/**
 * Default frontend settings for the Sarh Al-Nommow store(example)
 * Used as fallback values before dynamic settings are loaded...
 * Helps keep config centralized and easy to update!
 */