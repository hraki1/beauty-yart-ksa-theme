"use client";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Default styling (optional)
import { useContext, useState } from "react";
import Modal from "../UI/Modal";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import { signUp, SignUpRequest } from "@/lib/axios/signUpAxios";
import toast from "react-hot-toast";
import { login, loginRequest } from "@/lib/axios/loginAxios";
import { otpRequest, otpVerify, resendOtp } from "@/lib/axios/otpAxios";
import { AuthContext } from "@/store/AuthContext";
import { AuthModalContext } from "@/store/AuthModalContext";
import Link from "next/link";
import { restPasswordRequest } from "@/lib/axios/resetPasswordAxios";
import { useTranslations, useLocale } from "next-intl";
import { LuUserRound } from "react-icons/lu";
import { useEffect } from "react";
import Joi from "joi";

import {
  CountryCode,
} from 'libphonenumber-js/core';
import { getLocationCountryCode } from "@/lib/getLocationInformations/get-country-Code";
import { useCurrency } from "@/store/CurrencyContext";


export default function RegistrationLink() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Login Schema
  const loginSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required().messages({
      'string.email': t("login.errors.email"),
      'any.required': t("login.errors.email"),
    }),
    pass: Joi.string().min(1).required().messages({
      'string.empty': t("login.errors.password"),
      'any.required': t("login.errors.password"),
    }),
  });

  // Signup Schema
  const signupSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
      'string.min': t("signup.errors.name"),
      'any.required': t("signup.errors.name"),
    }),
    email: Joi.string().email({ tlds: false }).required().messages({
      'string.email': t("signup.errors.email"),
      'any.required': t("signup.errors.email"),
    }),
    phone: Joi.string().min(1).required().messages({
      'string.empty': t("signup.errors.phone"),
      'any.required': t("signup.errors.phone"),
    }),
    pass: Joi.string().min(8).required().messages({
      'string.min': t("signup.errors.password"),
      'any.required': t("signup.errors.password"),
    }),
    agreePolicy: Joi.boolean().valid(true).required().messages({
      'any.only': t("signup.errors.agreePolicy"),
      'any.required': t("signup.errors.agreePolicy"),
    }),
  });

  // OTP Schema
  const otpSchema = Joi.object({
    otp: Joi.string().length(6).required().messages({
      'string.length': t("otp.errors.enterEmail"),
      'any.required': t("otp.errors.enterEmail"),
    }),
  });

  // Forgot Password Schema
  const forgotPasswordSchema = Joi.object({
    email: Joi.string().email({ tlds: false }).required().messages({
      'string.email': t("forgotPassword.errors.email"),
      'any.required': t("forgotPassword.errors.email"),
    }),
  });

  const { login: loginCxt } = useContext(AuthContext);
  const { openAuthModal, closeAuthModal, isAuthModalOpen } =
    useContext(AuthModalContext);
  const { userIp } = useCurrency()

  // const [isAuthModalOpen, setisAuthModalOpen] = useState(false);
  const [contentView, setContentView] = useState<string | null>("login");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formInput, setFormInput] = useState({
    name: "",
    email: "",
    pass: "",
    phone: "",
    agreePolicy: false,
    otp: "",
  });

  const [successResetPasswordRequest, setSuccessResetPasswordRequest] =
    useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);


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

  // signup mutation field .....
  const { mutate: mutateSignup, isPending: isPendingSignup } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      console.log("تم إنشاء الحساب بنجاح", data);
      setCountdown(60)
      setContentView("otp");
    },
    onError: (error: Error) => {
      console.log("خطأ أثناء التسجيل:", error.message);
      toast.error(error.message);
    },
  });

  // login mutation field .....
  const { mutate: mutateLogin, isPending: isPendingLogin } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("تم إنشاء الحساب بنجاح", data);
      console.log(data);
      if (data.requiresVerification) {
        setContentView("otp");
      } else {
        loginCxt(data.token, data.user);
        handlerResetForm();
      }
    },
    onError: (error: Error) => {
      console.log("خطأ أثناء التسجيل:", error.message);
      toast.error(error.message);
    },
  });

  // otp mutation field .....
  const { mutate: mutateOtp, isPending: isPendingOtp } = useMutation({
    mutationFn: otpVerify,
    onSuccess: (data) => {
      console.log("تم ارسال otp", data);
      loginCxt(data.token, data.user);
      handlerResetForm();
      handleCloseModal();
    },
    onError: (error: Error) => {
      console.log("خطأ أثناء otp:", error.message);
      toast.error(error.message);
      setErrors({ otp: error.message });
    },
  });

  // resend OTP
  // otp mutation field .....
  const { mutate: resendOTP, isPending: isPendingResendOtp } = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      console.log("تم ارسال otp", data);
      setErrors({});
      setCountdown(60)
      toast.success(data)

    },
    onError: (error: Error) => {
      console.log("خطأ أثناء otp:", error.message);
      toast.error(error.message);
      setErrors({ otp: error.message });
    },
  });

  // rest Password mutation field .....
  const {
    mutate: mutateRequestResetPassword,
    isPending: isPendingResetPassword,
  } = useMutation({
    mutationFn: restPasswordRequest,
    onSuccess: (data) => {
      setSuccessResetPasswordRequest(data.message);
      console.log("تم ارسال otp", data);
    },
    onError: (error: Error) => {
      console.log("خطأ أثناء rest password:", error.message);
      toast.error(error.message);
      setErrors({ restPassword: error.message });
    },
  });

  // update state data every change ...
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // forms actions field ....
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error, value } = loginSchema.validate({
        email: formInput.email,
        pass: formInput.pass,
      });

      if (error) {
        const newErrors: { [key: string]: string } = {};
        error.details.forEach((detail) => {
          if (detail.path[0]) {
            newErrors[detail.path[0] as string] = detail.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      console.log("تسجيل الدخول:", value);
      const payload: loginRequest = {
        email: value.email,
        password: value.pass,
      };
      mutateLogin(payload);
      setErrors({});
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error, value } = signupSchema.validate({
        name: formInput.name,
        email: formInput.email,
        phone: formInput.phone,
        pass: formInput.pass,
        agreePolicy: formInput.agreePolicy,
      });

      if (error) {
        const newErrors: { [key: string]: string } = {};
        error.details.forEach((detail) => {
          if (detail.path[0]) {
            newErrors[detail.path[0] as string] = detail.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      console.log("إنشاء الحساب:", value);
      const payload: SignUpRequest = {
        full_name: value.name,
        email: value.email,
        password: value.pass,
        phone_number: value.phone,
      };
      mutateSignup(payload);
      setErrors({});
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleResendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    resendOTP(formInput.email);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error, value } = otpSchema.validate({
        otp: formInput.otp,
      });

      if (error) {
        const newErrors: { [key: string]: string } = {};
        error.details.forEach((detail) => {
          if (detail.path[0]) {
            newErrors[detail.path[0] as string] = detail.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      console.log("تاكيد otp ", value);
      const payload: otpRequest = {
        email: formInput.email,
        otp: value.otp,
      };
      mutateOtp(payload);
      setErrors({});
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  // send aplly to change password  ...
  function handleForgetPassword() {
    try {
      const { error, value } = forgotPasswordSchema.validate({
        email: formInput.email,
      });

      if (error) {
        const newErrors: { [key: string]: string } = {};
        error.details.forEach((detail) => {
          if (detail.path[0]) {
            newErrors[detail.path[0] as string] = detail.message;
          }
        });
        setErrors(newErrors);
        return;
      }

      console.log("Reset password for:", value.email);
      mutateRequestResetPassword({ email: value.email });
      setErrors({});
    } catch (error) {
      console.error("Validation error:", error);
    }
  }


  // handle close modal and rest it ...
  function handleCloseModal() {
    handlerResetForm();
    closeAuthModal();
    setContentView("login");
    setSuccessResetPasswordRequest(null);
  }

  // handle reset and clear inputs form ...
  function handlerResetForm() {
    setFormInput({
      name: "",
      email: "",
      pass: "",
      phone: "",
      agreePolicy: false,
      otp: "",
    });
  }

  return (
    <>
      <div
        className="group flex items-center gap-2 cursor-pointer text-black hover:text-[#d0e3ec]"
        onClick={() => {
          openAuthModal();
          setErrors({});
        }}
      >
        <div className="bg-[#f1f2fe] rounded-md p-2 transition-transform duration-200 group-hover:-translate-y-1">
          <LuUserRound className="font-bold text-2xl text-black" />
        </div>
        <h2 className="hidden lg:block text-black font-medium text-sm">
          {t("login.title")}
        </h2>
      </div>

      <Modal open={isAuthModalOpen} classesName="bg-white">
        <div className="bg-white text-gray-900 rounded-2xl w-full max-w-md p-6 relative z-[1500]" dir={isRTL ? "rtl" : "ltr"}>
          {/* زر الإغلاق */}
          <button
            onClick={handleCloseModal}
            className="absolute top-3 right-3 text-5xl text-gray-900 hover:text-gray-400"
            aria-label={t("close")}
          >
            &times;
          </button>

          {contentView === "login" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">
                {t("login.title")}
              </h2>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 text-sm">
                      {t("login.email")}
                    </label>
                    {errors.email && (
                      <span className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <input
                    name="email"
                    type="email"
                    value={formInput.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white border text-gray-900 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 text-sm">
                      {" "}
                      {t("login.password")}
                    </label>
                    {errors.pass && (
                      <p className="text-red-400 text-sm mt-1">{errors.pass}</p>
                    )}
                  </div>

                  <input
                    name="pass"
                    type="password"
                    value={formInput.pass}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white border text-gray-900 ${errors.pass
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder="••••••••"
                  />
                </div>

                <button
                  disabled={isPendingLogin}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded text-white"
                >
                  {isPendingLogin
                    ? `...${t("login.submit")}`
                    : t("login.submit")}
                </button>
              </form>
              <div className="flex justify-between">
                <div className="text-center my-4 text-sm">
                  <button
                    onClick={() => {
                      setContentView("forgetPssword");
                      setErrors({});
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>
                <div className="text-center my-4 text-sm">
                  {t("login.noAccount")}{" "}
                  <button
                    onClick={() => {
                      setContentView("signup");
                      setErrors({});
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    {t("login.createAccount")}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google"
                  }
                  className="group flex items-center justify-center gap-2 border border-gray-600 w-full py-2 rounded transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <FcGoogle className="text-xl transition-colors group-hover:text-white" />
                  <span className="transition-colors group-hover:text-white">
                    {t("login.googleLogin")}
                  </span>
                </Link>
              </div>
            </>
          )}

          {contentView === "signup" && (
            <>
              <h2 className="text-xl font-bold mb-2 text-center">
                {t("signup.title")}
              </h2>

              <form className="space-y-4" onSubmit={handleRegister}>
                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 text-sm">
                      {" "}
                      {t("signup.fullName")}
                    </label>
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <input
                    name="name"
                    type="text"
                    value={formInput.name}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white border text-gray-900 ${errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder={t("signup.fullName")}
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 text-sm">
                      {" "}
                      {t("signup.phone")}
                    </label>
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <PhoneInput
                    international
                    defaultCountry={defaultCountry as CountryCode} // Rwanda (adjust as needed)
                    placeholder="078XXXXXXX"
                    value={formInput.phone}
                    onChange={(value) => {
                      handleInputChange({
                        target: {
                          name: "phone",
                          value: value || "",
                        },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }}
                    className={`w-full p-2 rounded bg-white border text-gray-900 ${errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                      } focus:outline-none focus:ring-2`}

                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 text-sm">
                      {t("signup.email")}
                    </label>
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <input
                    name="email"
                    type="email"
                    value={formInput.email}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white border text-gray-900 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 text-sm">
                      {" "}
                      {t("signup.password")}
                    </label>
                    {errors.pass && (
                      <p className="text-red-400 text-sm mt-1">{errors.pass}</p>
                    )}
                  </div>

                  <input
                    name="pass"
                    type="password"
                    value={formInput.pass}
                    onChange={handleInputChange}
                    className={`w-full p-2 rounded bg-white border text-gray-900 ${errors.pass
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-green-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      id="agree"
                      type="checkbox"
                      name="agreePolicy"
                      checked={formInput.agreePolicy}
                      onChange={handleInputChange}
                      className={`${errors.agreePolicy ? "border-red-500" : ""
                        }`}
                    />
                    <label htmlFor="agree"> {t("signup.agreePolicy")}</label>
                  </div>

                  {errors.agreePolicy && (
                    <p className="text-red-400 text-sm mt-1 text-end">
                      {errors.agreePolicy}
                    </p>
                  )}
                </div>

                <button
                  disabled={isPendingSignup}
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 transition-colors py-2 rounded text-white cursor-pointer"
                >
                  {isPendingSignup
                    ? `...${t("signup.submit")}`
                    : t("signup.submit")}
                </button>
              </form>



              <div className="text-center mt-4 ">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google"
                  }
                  className="group flex items-center justify-center gap-2 border border-gray-600 hover:bg-gray-700 w-full py-2 rounded"
                >
                  <FcGoogle className="text-xl group-hover:text-white" />
                  <span className="group-hover:text-white"> {t("signup.googleSignup")} </span>
                </Link>
              </div>


              <div className="flex justify-between">
                <div className="text-center my-4 text-sm">
                  <button
                    onClick={() => {
                      setContentView("forgetPssword");
                      setErrors({});
                    }}
                    className="text-blue-400 hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>
                <div className="text-center mt-4 text-sm">
                  {t("signup.haveAccount")}{" "}
                  <button
                    onClick={() => {
                      setContentView("login");
                      setErrors({});
                    }}
                    className="text-green-400 hover:underline"
                  >
                    {t("login.submit")}
                  </button>
                </div>
              </div>
            </>
          )}

          {contentView === "otp" && (
            <>
              <h2 className="text-xl font-bold mb-4 text-center">
                {" "}
                {t("otp.title")}
              </h2>
              <form
                className="space-y-4 text-center"
                onSubmit={handleVerifyOtp}
              >
                <div>
                  <div className="flex justify-between">
                    <label className="block mb-1 ">
                      {t("otp.sentTo")}
                      <span className="text-sm text-gray-400">
                        {" "}
                        {formInput.email}
                      </span>{" "}
                    </label>
                    {errors.otp && (
                      <span className="text-red-400 text-sm mt-1">
                        {errors.otp}
                      </span>
                    )}
                  </div>

                  <input
                    name="otp"
                    type="string"
                    onChange={handleInputChange}
                    value={formInput.otp}
                    className={`w-full p-2 rounded bg-white text-center border text-gray-900 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                      } focus:outline-none focus:ring-2`}
                    placeholder={t("otp.placeholder")}
                  />
                </div>

                <div className="flex flex-row gap-3 justify-center">
                  <button
                    className={`px-2 py-1 rounded-lg text-sm font-medium border transition-colors ${countdown > 0 || isPendingResendOtp
                      ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-80"
                      : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      }`}
                    disabled={countdown > 0 || isPendingResendOtp}
                    onClick={handleResendOtp}
                  >
                    {countdown > 0
                      ? `${t("otp.resend")} (${countdown}s)`
                      : t("otp.resend")}
                  </button>
                </div>

                <button
                  disabled={isPendingOtp}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded text-white cursor-pointer"
                >
                  {isPendingOtp ? `...${t("otp.submit")}` : t("otp.submit")}
                </button>
              </form>
            </>
          )}

          {contentView === "forgetPssword" && (
            <>
              {successResetPasswordRequest ? (
                <div>
                  <h2 className="text-xl font-bold mb-4 text-center ">
                    {t("forgotPassword.title")}
                  </h2>
                  <div className="space-y-4 text-center">
                    <div>
                      <div className="flex justify-center">
                        <label className="block mb-2 text-gray-900">
                          {t("forgotPassword.success")}
                        </label>
                        {errors.otp && (
                          <span className="text-red-400 text-sm mt-1">
                            {errors.restPassword}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded text-white cursor-pointer"
                    >
                      {t("forgotPassword.done")}
                    </button>
                    <div className="text-center my-4 text-sm"></div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className={`text-xl font-bold mb-4 text-center ${isRTL ? 'font-arabic' : ''}`}>
                    {t("forgotPassword.title")}
                  </h2>
                  <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div>
                      <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                        <label className={`block mb-2 text-gray-900 ${isRTL ? 'ml-2' : 'mr-2'}`}>
                          {t("forgotPassword.enterEmail")}
                        </label>
                        {errors.otp && (
                          <span className="text-red-400 text-sm mt-1">
                            {errors.otp}
                          </span>
                        )}
                      </div>

                      <input
                        name="email"
                        type="email"
                        onChange={handleInputChange}
                        value={formInput.email}
                        className={`w-full p-2 rounded bg-white border text-gray-900 ${isRTL ? 'text-right pr-4' : 'text-left pl-4'} ${errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                          } focus:outline-none focus:ring-2`}
                        placeholder={t("forgotPassword.emailPlaceholder")}
                      />

                    </div>

                    <button
                      disabled={isPendingResetPassword}
                      type="button"
                      onClick={handleForgetPassword}
                      className={`w-full bg-blue-600 hover:bg-blue-700 transition-colors py-2 rounded text-white cursor-pointer ${isRTL ? 'font-arabic' : ''}`}
                    >
                      {isPendingResetPassword
                        ? `...${t("forgotPassword.submit")}`
                        : t("forgotPassword.submit")}
                    </button>
                    <div className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                      {t("forgotPassword.noAccount")}
                      <button
                        onClick={() => {
                          setContentView("signup");
                          setErrors({});
                        }}
                        className="text-blue-400 hover:underline ml-2"
                      >
                        {t("forgotPassword.createAccount")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
