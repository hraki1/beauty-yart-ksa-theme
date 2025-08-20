"use client";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Default styling (optional)
import { useContext, useState, useRef, useEffect } from "react";
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
  const buttonRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleCloseModal();
      }
    };

    if (isAuthModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAuthModalOpen]);

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
   <div className="relative">
  {/* Button to open modal */}
  <div
    ref={buttonRef}
    className="group flex items-center gap-2 cursor-pointer text-black hover:text-gray-600"
    onClick={() => {
      openAuthModal();
      setErrors({});
    }}
  >
    <LuUserRound className="font-bold text-2xl text-black" />
  </div>

  {/* Modal */}
  {isAuthModalOpen && (
    <div
      className="fixed inset-0 z-[1500] flex items-center justify-center "
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleCloseModal}
      ></div>

      {/* Modal content */}
      <div
        ref={modalRef}
        className="relative bg-white text-black rounded-lg w-[70%] md:w-[40%]  p-6 shadow-lg border border-gray-200 z-[1600]"
        style={{ fontFamily: 'Europa, sans-serif' }}
      >
        {/* Close button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600"
          aria-label={t("close")}
        >
          &times;
        </button>

          {contentView === "login" && (
            <>
              <h2 className="text-2xl font-normal mb-6 text-center text-black">
                {t("login.title")}
              </h2>

              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 font-normal">
                    {t("login.email")} *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formInput.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border text-black bg-gray-50 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      } focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="Your name"
                  />
                  {errors.email && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600 font-normal">
                    {t("login.password")} *
                  </label>
                  <input
                    name="pass"
                    type="password"
                    value={formInput.pass}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border text-black bg-gray-50 ${errors.pass
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      } focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="Password"
                  />
                  {errors.pass && (
                    <p className="text-red-500 text-sm mt-1">{errors.pass}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <input type="checkbox" id="remember" className="rounded" />
                  <label htmlFor="remember" className="text-gray-600">Remember me</label>
                </div>

                <button
                  disabled={isPendingLogin}
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 transition-colors py-3 rounded text-white font-normal"
                >
                  {isPendingLogin
                    ? `...${t("login.submit")}`
                    : t("login.submit").toUpperCase()}
                </button>
              </form>

              <div className="text-center my-4">
                <button
                  onClick={() => {
                    setContentView("forgetPssword");
                    setErrors({});
                  }}
                  className="text-black hover:underline text-sm font-normal"
                >
                  {t("login.forgotPassword")}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google"
                  }
                  className="group flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 w-full py-3 rounded transition-colors"
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-black font-normal">
                    {t("login.googleLogin")}
                  </span>
                </Link>
              </div>

              <div className="text-center text-sm text-gray-600 font-normal mt-4">
                {t("login.noAccount")}{" "}
                <button
                  onClick={() => {
                    setContentView("signup");
                    setErrors({});
                  }}
                  className="text-black hover:underline font-normal"
                >
                  {t("login.createAccount")}
                </button>
              </div>
            </>
          )}

          {contentView === "signup" && (
            <>
              <h2 className="text-2xl font-normal mb-6 text-center text-black">
                {t("signup.title")}
              </h2>

              <form className="space-y-4" onSubmit={handleRegister}>
                <div>
                  <label className="block mb-2 text-sm text-gray-600 font-normal">
                    {t("signup.fullName")} *
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formInput.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border text-black bg-gray-50 ${errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      } focus:outline-none focus:ring-1 transition-colors`}
                    placeholder={t("signup.fullName")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600 font-normal">
                    {t("signup.phone")} *
                  </label>
                  <PhoneInput
                    international
                    defaultCountry={defaultCountry as CountryCode}
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
                    className={`w-full ${errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600 font-normal">
                    {t("signup.email")} *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formInput.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border text-black bg-gray-50 ${errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      } focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="example@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm text-gray-600 font-normal">
                    {t("signup.password")} *
                  </label>
                  <input
                    name="pass"
                    type="password"
                    value={formInput.pass}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded border text-black bg-gray-50 ${errors.pass
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      } focus:outline-none focus:ring-1 transition-colors`}
                    placeholder="••••••••"
                  />
                  {errors.pass && (
                    <p className="text-red-500 text-sm mt-1">{errors.pass}</p>
                  )}
                </div>

                <div className="flex items-start gap-2 text-sm">
                  <input
                    id="agree"
                    type="checkbox"
                    name="agreePolicy"
                    checked={formInput.agreePolicy}
                    onChange={handleInputChange}
                    className={`mt-1 ${errors.agreePolicy ? "border-red-500" : ""
                      }`}
                  />
                  <label htmlFor="agree" className="text-gray-600 font-normal">
                    {t("signup.agreePolicy")}
                  </label>
                </div>
                {errors.agreePolicy && (
                  <p className="text-red-500 text-sm">
                    {errors.agreePolicy}
                  </p>
                )}

                <button
                  disabled={isPendingSignup}
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 transition-colors py-3 rounded text-white font-normal"
                >
                  {isPendingSignup
                    ? `...${t("signup.submit")}`
                    : t("signup.submit").toUpperCase()}
                </button>
              </form>

              <div className="text-center mt-4">
                <Link
                  href={
                    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/google"
                  }
                  className="group flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 w-full py-3 rounded transition-colors"
                >
                  <FcGoogle className="text-xl" />
                  <span className="text-black font-normal">
                    {t("signup.googleSignup")}
                  </span>
                </Link>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setContentView("forgetPssword");
                    setErrors({});
                  }}
                  className="text-black hover:underline text-sm font-normal"
                >
                  {t("login.forgotPassword")}
                </button>
                <div className="text-sm text-gray-600 font-normal">
                  {t("signup.haveAccount")}{" "}
                  <button
                    onClick={() => {
                      setContentView("login");
                      setErrors({});
                    }}
                    className="text-black hover:underline font-normal"
                  >
                    {t("login.submit")}
                  </button>
                </div>
              </div>
            </>
          )}

          {contentView === "otp" && (
            <>
              <h2 className="text-2xl font-normal mb-6 text-center text-black">
                {t("otp.title")}
              </h2>
              <form
                className="space-y-4 text-center"
                onSubmit={handleVerifyOtp}
              >
                <div>
                  <label className="block mb-2 text-black font-normal">
                    {t("otp.sentTo")}
                    <span className="text-sm text-gray-600">
                      {" "}
                      {formInput.email}
                    </span>
                  </label>
                  <input
                    name="otp"
                    type="string"
                    onChange={handleInputChange}
                    value={formInput.otp}
                    className={`w-full p-3 rounded border text-center text-black bg-gray-50 ${errors.otp
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-200 focus:border-black"
                      } focus:outline-none focus:ring-1 transition-colors`}
                    placeholder={t("otp.placeholder")}
                  />
                  {errors.otp && (
                    <span className="text-red-500 text-sm mt-1 block">
                      {errors.otp}
                    </span>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    className={`px-4 py-2 rounded text-sm font-normal border transition-colors ${countdown > 0 || isPendingResendOtp
                      ? "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed opacity-80"
                      : "bg-black text-white border-black hover:bg-gray-800"
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
                  className="w-full bg-black hover:bg-gray-800 transition-colors py-3 rounded text-white font-normal"
                >
                  {isPendingOtp ? `...${t("otp.submit")}` : t("otp.submit").toUpperCase()}
                </button>
              </form>
            </>
          )}

          {contentView === "forgetPssword" && (
            <>
              {successResetPasswordRequest ? (
                <div>
                  <h2 className="text-2xl font-normal mb-6 text-center text-black">
                    {t("forgotPassword.title")}
                  </h2>
                  <div className="space-y-4 text-center">
                    <div>
                      <label className="block mb-2 text-black font-normal">
                        {t("forgotPassword.success")}
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full bg-black hover:bg-gray-800 transition-colors py-3 rounded text-white font-normal"
                    >
                      {t("forgotPassword.done")}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-normal mb-6 text-center text-black">
                    {t("forgotPassword.title")}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm text-gray-600 font-normal">
                        {t("forgotPassword.enterEmail")}
                      </label>
                      <input
                        name="email"
                        type="email"
                        onChange={handleInputChange}
                        value={formInput.email}
                        className={`w-full p-3 rounded border text-black bg-gray-50 ${errors.email
                          ? "border-red-500 focus:ring-red-500"
                          : "border-gray-200 focus:border-black"
                          } focus:outline-none focus:ring-1 transition-colors`}
                        placeholder={t("forgotPassword.emailPlaceholder")}
                      />
                      {errors.email && (
                        <span className="text-red-500 text-sm mt-1 block">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <button
                      disabled={isPendingResetPassword}
                      type="button"
                      onClick={handleForgetPassword}
                      className="w-full bg-black hover:bg-gray-800 transition-colors py-3 rounded text-white font-normal"
                    >
                      {isPendingResetPassword
                        ? `...${t("forgotPassword.submit")}`
                        : t("forgotPassword.submit").toUpperCase()}
                    </button>

                    <div className="text-center text-sm text-gray-600 font-normal">
                      {t("forgotPassword.noAccount")}{" "}
                      <button
                        onClick={() => {
                          setContentView("signup");
                          setErrors({});
                        }}
                        className="text-black hover:underline font-normal"
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
        </div>
      )}
    </div>
  );
}