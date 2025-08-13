"use client";

import { useSettings } from "@/store/SettingsContext";
import { motion } from "framer-motion";
import { FiSend, FiHelpCircle } from "react-icons/fi";
import { Lexend, Poppins } from "next/font/google";
import { AiOutlineHome } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaPinterest } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, Controller, ControllerRenderProps } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import classNames from "classnames";
import { Phone } from "lucide-react";
import Modal from "@/components/UI/Modal";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { getLocationCountryCode } from "@/lib/getLocationInformations/get-country-Code";
import { useCurrency } from "@/store/CurrencyContext";
import {
  CountryCode,
} from 'libphonenumber-js/core';

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const poppins = Poppins({ subsets: ["latin"], weight: "400" });

type FormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactPage() {
  const settings = useSettings();
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === "ar";
  const t = useTranslations("contactus");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    mode: "onTouched",
  });

  const { userIp } = useCurrency()
  const [defaultCountry, setDefaultCountry] = useState<CountryCode | undefined>('SA');

  useEffect(() => {
    const detectCountry = async () => {
      try {
        const countryCode = await getLocationCountryCode(userIp)
        setDefaultCountry(countryCode as CountryCode);
      } catch (error) {
        console.error('Failed to detect country:', error);
      }
    };

    detectCountry();
  }, [userIp]);

  const onSubmit = async (data: FormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1700));
      console.log("Form submitted:", data);

      setShowSuccessModal(true);
      reset();
    } catch (error) {
      console.error("Submit failed:", error);
      setShowErrorModal(true);
    }
  };

  const getFullAddress = () => {
    const parts = [
      settings.store_address,
      settings.store_city,
      settings.store_country,
      settings.post_code
    ];
    return parts.filter(Boolean).join(", ");
  };

  return (
    <div className="bg-gray-50 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <div className="bg-indigo-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`flex items-center justify-center space-x-2 text-gray-400 text-xs sm:text-sm max-w-2xl mx-auto ${isRTL ? 'space-x-reverse' : ''}`}
            aria-label="Breadcrumb"
          >
            <Link href="/" aria-label="Go to home page">
              <AiOutlineHome className="text-gray-400 font-bold" size={14} />
            </Link>
            <MdKeyboardArrowRight size={15} className="text-gray-400 font-bold" />
            <span className="text-xs font-bold text-gray-400">{t("breadcrumb")}</span>
          </motion.nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${lexend.className} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 px-4`}
            style={{ color: "#222529" }}
          >
            {t("title")}
          </motion.h1>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-b from-[#954cf5] to-[#954cf5] rounded-[7px] p-6 sm:p-8 md:p-9 max-w-[550px] w-full mx-auto ${isRTL ? 'lg:ml-auto' : 'lg:mr-auto'} pt-8 sm:pt-10 md:pt-12 pb-10 sm:pb-12 md:pb-14`}
          >
            <div className={`flex items-start gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-9 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* Dots */}
              <div className="flex flex-col gap-1 sm:gap-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`flex gap-1 sm:gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <div className="w-1 h-1 bg-white rounded-full opacity-80" />
                    <div className="w-1 h-1 bg-white rounded-full opacity-80" />
                  </div>
                ))}
              </div>

              {/* Header and Text */}
              <div className={`flex items-center gap-3 sm:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center relative overflow-hidden">
                  <FiHelpCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                </div>
                <div className={`text-${isRTL ? 'right' : 'left'}`}>
                  <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 ${lexend.className}`}>
                    {t("needHelpTitle")}
                  </h2>
                  <p className={`text-gray-300 text-opacity-90 text-sm sm:text-base ${poppins.className}`}>
                    {t("needHelpText")}
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="name" className="sr-only">{t("form.name")}</label>
                <input
                  id="name"
                  type="text"
                  placeholder={t("form.name")}
                  autoComplete="name"
                  className={classNames(
                    "w-full px-3 py-2 sm:py-3 bg-white bg-opacity-90 rounded border-0 text-gray-700 placeholder-gray-700 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base",
                    { "ring-2 ring-gray-400": errors.name }
                  )}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                  disabled={isSubmitting}
                  {...register("name", {
                    required: t("form.errors.nameRequired"),
                    minLength: { value: 2, message: t("form.errors.nameTooShort") },
                    maxLength: { value: 50, message: t("form.errors.nameTooLong") },
                    setValueAs: (v: string) => v.trim(),
                  })}
                />
                {errors.name && (
                  <p id="name-error" className="text-xs sm:text-sm text-white mt-1" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">{t("form.email")}</label>
                <input
                  id="email"
                  type="email"
                  placeholder={t("form.email")}
                  autoComplete="email"
                  className={classNames(
                    "w-full px-3 py-2 sm:py-3 bg-white bg-opacity-90 rounded border-0 text-gray-700 placeholder-gray-700 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base",
                    { "ring-2 ring-gray-400": errors.email }
                  )}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  disabled={isSubmitting}
                  {...register("email", {
                    required: t("form.errors.emailRequired"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("form.errors.emailInvalid"),
                    },
                    setValueAs: (v: string) => v.trim(),
                  })}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs sm:text-sm text-white mt-1" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="sr-only">{t("form.phone")}</label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: t("form.errors.phoneRequired"),
                    validate: (value: string) =>
                      value && value.length >= 8 ? true : t("form.errors.phoneInvalid"),
                  }}
                  render={({ field }: { field: ControllerRenderProps<FormData, "phone"> }) => (
                    <PhoneInput
                      {...field}
                      id="phone"
                      defaultCountry={defaultCountry as CountryCode} // Rwanda (adjust as needed)
                      international
                      countryCallingCodeEditable={false}
                      placeholder={t("form.phone")}
                      className={classNames(
                        "w-full px-3 py-2 sm:py-3 bg-white bg-opacity-90 rounded border-0 text-gray-700 placeholder-gray-700 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base",
                        { "ring-2 ring-gray-400": errors.phone }
                      )}
                      disabled={isSubmitting}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                />
                {errors.phone && (
                  <p id="phone-error" className="text-xs sm:text-sm text-white mt-1" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="sr-only">{t("form.message")}</label>
                <textarea
                  id="message"
                  placeholder={t("form.message")}
                  rows={4}
                  className={classNames(
                    "w-full px-3 py-2 sm:py-3 pb-5 bg-white bg-opacity-90 rounded border-0 text-gray-700 placeholder-gray-700 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 resize-none text-sm sm:text-base",
                    { "ring-2 ring-gray-400": errors.message }
                  )}
                  aria-invalid={!!errors.message}
                  aria-describedby="message-error"
                  disabled={isSubmitting}
                  {...register("message", {
                    required: t("form.errors.messageRequired"),
                    minLength: { value: 10, message: t("form.errors.messageTooShort") },
                    setValueAs: (v: string) => v.trim(),
                  })}
                />
                {errors.message && (
                  <p id="message-error" className="text-xs sm:text-sm text-white mt-1" role="alert">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 sm:px-5 py-2 sm:py-3 rounded-full transition-transform duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
                disabled={isSubmitting}
                aria-live="polite"
              >
                <FiSend className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSubmitting ? t("form.sending") : t("form.submit")}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`bg-white p-6 sm:p-8 max-w-[550px] w-full mx-auto rounded-[7px] border border-blue-100 font-sans ${isRTL ? 'lg:mr-auto' : 'lg:ml-auto'} text-sm`}
          >
            {/* Header Section */}
            <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-6 sm:mb-8 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
                <div className={`text-${isRTL ? 'right' : 'left'}`}>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
                    {settings.contact_phone}
                  </h1>
                  <p className="text-gray-500 mt-0.5 text-xs sm:text-sm">{t("workingHours")}</p>
                </div>
              </div>
              <div className={`flex flex-row sm:flex-col gap-2 ${isRTL ? 'sm:items-start' : 'sm:items-end'} justify-center sm:justify-start`}>
                <Link
                  href="/infoPages/faq"
                  className="text-purple-500 hover:text-purple-700 text-xs font-medium transition-colors"
                >
                  {t("faq")}
                </Link>
              </div>
            </div>

            {/* Store Information */}
            <div className="space-y-6 sm:space-y-7">
              {/* Main Store Info */}
              <div>
                <div className={`text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium text-${isRTL ? 'right' : 'left'}`}>
                  {t("stores.store")}
                </div>
                <h2 className={`text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3 text-${isRTL ? 'right' : 'left'}`}>
                  {settings.store_name}
                </h2>
                <div className={`space-y-2 text-gray-600 text-${isRTL ? 'right' : 'left'} text-xs sm:text-sm`}>
                  {settings.contact_phone && (
                    <p className="text-gray-500">{settings.contact_phone}</p>
                  )}
                  {settings.contact_email && (
                    <div className="inline-block">
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="text-gray-900 hover:text-purple-600 transition-colors border-b border-gray-900 pb-0.5"
                      >
                        {settings.contact_email}
                      </a>
                    </div>
                  )}
                  {getFullAddress() && (
                    <p className="text-gray-500 mt-2">
                      {getFullAddress()}
                    </p>
                  )}
                </div>
              </div>

              {/* Social Media Links */}
              {settings.social_media_links && (
                <div>
                  <div className={`text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium text-${isRTL ? 'right' : 'left'}`}>
                    {t("socialMedia")}
                  </div>
                  <div className={`flex flex-wrap gap-3 text-${isRTL ? 'right' : 'left'}`}>
                    {settings.social_media_links.facebook && (
                      <a
                        href={settings.social_media_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                        aria-label="Facebook"
                      >
                        <FaFacebook className="w-5 h-5" />
                      </a>
                    )}
                    {settings.social_media_links.twitter && (
                      <a
                        href={settings.social_media_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-blue-400 hover:bg-blue-500 text-white rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                        aria-label="Twitter"
                      >
                        <FaTwitter className="w-5 h-5" />
                      </a>
                    )}
                    {settings.social_media_links.instagram && (
                      <a
                        href={settings.social_media_links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                        aria-label="Instagram"
                      >
                        <FaInstagram className="w-5 h-5" />
                      </a>
                    )}
                    {settings.social_media_links.pinterest && (
                      <a
                        href={settings.social_media_links.pinterest}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-200 transform hover:scale-110 hover:shadow-lg"
                        aria-label="Pinterest"
                      >
                        <FaPinterest className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal open={showSuccessModal} classesName="bg-green-500">
        <div className="p-4 sm:p-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold mb-2">{t("form.alert.successTitle")}</h3>
          <p className="mb-4 text-sm sm:text-base">{t("form.alert.successText")}</p>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="bg-white text-green-500 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            {t("form.submit")}
          </button>
        </div>
      </Modal>

      {/* Error Modal */}
      <Modal open={showErrorModal} classesName="bg-red-500">
        <div className="p-4 sm:p-6 text-center">
          <h3 className="text-lg sm:text-xl font-bold mb-2">{t("form.alert.errorTitle")}</h3>
          <p className="mb-4 text-sm sm:text-base">{t("form.alert.errorText")}</p>
          <button
            onClick={() => setShowErrorModal(false)}
            className="bg-white text-red-500 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            {t("form.submit")}
          </button>
        </div>
      </Modal>
    </div>
  );
}