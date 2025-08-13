// app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { defaultSettings } from "@/utils/defaultSettings";
import { AuthProvider } from "@/store/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navigation/Navbar";
import Footer from "@/components/footer/footer";
import CartContextProvider from "@/store/CartContext";
import { AuthModalProvider } from "@/store/AuthModalContext";
import { SearchProvider } from "@/store/SearchContext";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { redirect } from "next/navigation";
import { SettingsProvider } from "@/store/SettingsContext";
import { parseSettings } from "@/utils/parseSettings";
import { Settings } from "@/models/forntEndSettings";
import { headers } from "next/headers";
import { getLocationCurrency } from "@/lib/currencySettings/get-location";
import CurrencyProvider from "@/store/CurrencyContext";
import { CategoriesProvider } from "@/store/CategoriesContext";
import { BrandsProvider } from "@/store/BrandsContext";
import ClientLayoutPart from "./ClientLayoutPart";
import { Language } from "@/lib/models/languagesModal";
// import Notification from "@/components/shared/Notification";

// Fonts: Europa via globals.css, Playfair via next/font variable
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

async function getSettings(locale: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/settings?lang=${locale}`
  );
  if (!res.ok) return null;
  return res.json();
}

async function getLanguagesSSR(): Promise<Language[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/languages`, {
    next: { revalidate: 604800 }, // أسبوع كامل
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

function isValidCurrency(value: unknown): value is string {
  return typeof value === "string" && /^[A-Z]{3}$/.test(value);
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    redirect("/en");
  }

  const messages = await getMessages();
const rawSettings = await getSettings(locale);
const settings = (parseSettings(rawSettings) ?? defaultSettings) as Settings;
  const defaultCurrency = settings?.default_currency ?? "USD";
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] ?? "8.8.8.8";
  const userCurrencyRaw = await getLocationCurrency(ip);

  console.log(userCurrencyRaw)
  const baseSystemCurrency = isValidCurrency(defaultCurrency)
    ? defaultCurrency
    : "USD";
  const userIpCurrency = isValidCurrency(userCurrencyRaw)
    ? userCurrencyRaw
    : baseSystemCurrency;

  const languages = await getLanguagesSSR();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${playfair.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SettingsProvider settings={settings}>
            <CurrencyProvider
              defaultSettingCurrrency={baseSystemCurrency}
              userIpCurrency={userIpCurrency}
              userIp={ip}
            >
              <QueryClientProvider client={queryClient}>
                <AuthModalProvider>
                  <SearchProvider>
                    <AuthProvider>
                      <CartContextProvider>
                        <CategoriesProvider>
                          <BrandsProvider>
                            <Toaster />
                            <div id="root-modal"></div>
                            <ClientLayoutPart />
                            <Navbar languages={languages} />
                            {/* <Notification /> */}

                            {children}
                            <Footer settings={settings} />
                          </BrandsProvider>
                        </CategoriesProvider>
                      </CartContextProvider>
                    </AuthProvider>
                  </SearchProvider>
                </AuthModalProvider>
              </QueryClientProvider>
            </CurrencyProvider>
          </SettingsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export { generateMetadata } from "./generateMetadata";
