// Removed Swiper slider to use a static grid layout
import { useTranslations } from "next-intl";

// Inline SVGs to match the attached style exactly
const ShippingIcon = () => (
  <svg
    className="w-14 h-14"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="10" y="12" width="44" height="36" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M10 24h44" stroke="currentColor" strokeWidth="2" />
    <path d="M22 12v12M42 12v12" stroke="currentColor" strokeWidth="2" />
    <path d="M26 36h12" stroke="currentColor" strokeWidth="2" />
    <path d="M30 32h4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const ReturnIcon = () => (
  <svg
    className="w-14 h-14"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M52 28a20 20 0 1 0-7.4 15.5"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M52 28v8m0 0h-8" stroke="currentColor" strokeWidth="2" />
    <rect x="28" y="28" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M28 33l6-3 6 3" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const SecurityIcon = () => (
  <svg
    className="w-14 h-14"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M32 8l20 8v12c0 14.4-9.5 22.7-20 28-10.5-5.3-20-13.6-20-28V16l20-8z"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M22 32l6 6 14-14" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

export default function FeaturesSection() {
  const t = useTranslations("featuresSection");

  const features = [
    {
      icon: <ShippingIcon />,
      title: t("shippingWorldwide.title"),
      description: t("shippingWorldwide.description"),
    },
    {
      icon: <ReturnIcon />,
      title: t("return14Days.title"),
      description: t("return14Days.description"),
    },
    {
      icon: <SecurityIcon />,
      title: t("securityPayment.title"),
      description: t("securityPayment.description"),
    },
  ];
  return (
    <section className="bg-white py-12 border-y border-[#E5E1DA]">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center">
              <div className="text-[#A07D4F]">{feature.icon}</div>
              <h3 className="mt-4 text-2xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
