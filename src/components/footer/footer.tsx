"use client";

import type { Settings } from "@/models/forntEndSettings";
import FooterLinks from "./FooterLinks";
import FooterBottom from "./FooterBottom";

type FooterProps = {
  settings: Settings;
};

export default function Footer({ settings }: FooterProps) {

  // Defensive check: in case pathname is undefined/null, default to false

  return (
    <footer className="bg-white text-black w-full" aria-label="Footer">
      {/* Responsive container with max-width and horizontal padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Footer links with responsive spacing */}
        <div className="mb-6">
          <FooterLinks settings={settings} />
        </div>

        {/* Footer bottom info */}
      </div>
      <div>
        <FooterBottom settings={settings} />
      </div>
    </footer>
  );
}
