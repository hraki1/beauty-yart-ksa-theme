"use client";

import { useContext, useEffect, useState } from "react";
import { FiUser, FiLock, FiMapPin } from "react-icons/fi";
import Image from "next/image";
import { AuthContext } from "@/store/AuthContext";
import ProfileInfo from "@/components/profile/ProfileInfo";
import SecurityInfo from "@/components/profile/SecurityInfo";
import AddressesInfo from "@/components/profile/Addresses";
// import Settings from "@/components/profile/Settings";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

// ✅ Import Playfair Display font for headings
import { Playfair_Display } from "next/font/google";
const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
});

export default function AccountPage() {
  const t = useTranslations("account");
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    avatar: "/image/users/default-avatar.jpg",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || "",
        email: user.email || "",
        phone: user.phone_number || "",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
        avatar: user.avatar || "/image/users/default-avatar.jpg",
      });
    }
  }, [user]);

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const accountTabs = [
    { id: "profile", icon: <FiUser size={20} />, label: t("tabs.profile") },
    { id: "security", icon: <FiLock size={20} />, label: t("tabs.security") },
    { id: "addresses", icon: <FiMapPin size={20} />, label: t("tabs.addresses") },
    // { id: "notifications", icon: <FiBell size={20} />, label: t("tabs.notifications") },
  ];

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-800"
      style={{
        background: "linear-gradient(135deg, #FFEDE4 0%, #FFF8F3 50%, #FFFFFF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="space-y-2">
            <h1
              className={`text-4xl md:text-5xl font-bold italic ${playfair.className} text-slate-900 tracking-tight`}
            >
              {t("title")}
            </h1>
            <p className="text-lg text-slate-600 font-light tracking-wide" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              {t("subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="group relative overflow-hidden bg-black hover:bg-red-900 text-white font-medium px-8 py-3 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={logout}
            >
              <span className="relative z-10 text-lg tracking-wide" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                Logout
              </span>
              <div className="absolute inset-0  bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Modern Sidebar Navigation */}
          <div className="w-full xl:w-80 flex-shrink-0">
            <div className="bg-white/90 backdrop-blur-sm overflow-hidden border border-gray-200 hover:border-gray-300 transition-all duration-500">
              {/* User Profile Section */}
              <div className="p-8 flex flex-col items-center border-b border-slate-200/50">
                <div className="relative w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 mb-6 overflow-hidden border-4 border-white ring-4 ring-slate-100/50">
                  {user?.avatar ? (
                    <Image
                      src={formData?.avatar}
                      alt={t("avatarAlt")}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Image
                      src={"/image/users/user.png"}
                      alt={t("avatarAlt")}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                </div>
                <h3 className={`font-semibold text-slate-900 text-center text-xl mb-2 ${playfair.className}`}>
                  {formData.name || t("guest")}
                </h3>
                <p className="text-sm text-slate-500 text-center font-medium tracking-wide" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  {formData.email || t("noEmail")}
                </p>
              </div>

              {/* Navigation Tabs */}
              <nav className="p-4 space-y-2">
                {accountTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 p-4 transition-all duration-300 group border-l-4 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 text-gray-800 font-semibold border-l-gray-500"
                        : "text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:border-l-slate-400 border-l-transparent"
                    }`}
                  >
                    <span
                      className={`transition-all duration-300 ${
                        activeTab === tab.id 
                          ? "text-gray-600 scale-110" 
                          : "text-slate-500 group-hover:text-slate-700 group-hover:scale-105"
                      }`}
                    >
                      {tab.icon}
                    </span>
                    <span className="text-left font-medium tracking-wide" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Modern Main Content */}
          <div className="flex-1">
            <div className="bg-white/90 backdrop-blur-sm p-8 md:p-10 border border-gray-200 min-h-[600px] text-slate-800 hover:border-gray-300 transition-all duration-500">
              <div className="h-full" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                {activeTab === "profile" && <ProfileInfo />}
                {activeTab === "security" && <SecurityInfo />}
                {activeTab === "addresses" && <AddressesInfo />}
                {/* {activeTab === "notifications" && <Settings />} */}
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-orange-100 to-amber-100 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-slate-100 to-gray-100 opacity-15 blur-3xl"></div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        /* Europa font fallback to Inter for better web compatibility */
        * {
          font-family: 'Europa', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        /* Smooth scrolling for better UX */
        html {
          scroll-behavior: smooth;
        }
        
        /* Custom backdrop blur for better browser support */
        .backdrop-blur-sm {
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
      `}</style>
    </div>
  );
}