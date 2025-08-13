"use client";

import { usePathname } from "next/navigation";
import type { Settings } from "@/models/forntEndSettings";
import HelpSection from "./HelpSection";
import FooterLinks from "./FooterLinks";
import FooterBottom from "./FooterBottom";

type FooterProps = {
  settings: Settings;
};

export default function Footer({ settings }: FooterProps) {
  const pathname = usePathname();

  // Defensive check: in case pathname is undefined/null, default to false
  const hideHelpSection = pathname ? pathname.endsWith("/infoPages/contact") : false;

  return (
    <footer className="bg-white text-black w-full">
      {/* Responsive container with max-width and horizontal padding */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Help section visible conditionally */}
        {!hideHelpSection && (
          <div className="mb-10">
            <HelpSection />
          </div>
        )}

        {/* Footer links with responsive spacing */}
        <div className="mb-6">
          <FooterLinks settings={settings} />
        </div>

        {/* Footer bottom info */}
        <div>
          <FooterBottom settings={settings} />
        </div>
      </div>
    </footer>
  );
}
