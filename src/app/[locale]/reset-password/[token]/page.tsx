'use client'

import { use, useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { useMutation } from "@tanstack/react-query";
import { newPasswordRequest } from "@/lib/axios/resetPasswordAxios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { AuthModalContext } from "@/store/AuthModalContext";
import { z } from "zod";

const passwordRequirements = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter", test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One lowercase letter", test: (pw: string) => /[a-z]/.test(pw) },
  { label: "One number", test: (pw: string) => /\d/.test(pw) },
  { label: "One special character", test: (pw: string) => /[^A-Za-z0-9]/.test(pw) },
];

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[A-Z]/, "One uppercase letter")
    .regex(/[a-z]/, "One lowercase letter")
    .regex(/\d/, "One number")
    .regex(/[^A-Za-z0-9]/, "One special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordProps = {
  params: Promise<{ token: string }>;
};

const ResetPasswordPage = ({ params }: ResetPasswordProps) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const t = useTranslations("resetPassword");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [incomingToken, setIncomingToken] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [touched, setTouched] = useState<{ password: boolean; confirmPassword: boolean }>({ password: false, confirmPassword: false });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { token } = use(params);
  const router = useRouter();
  const { openAuthModal } = useContext(AuthModalContext);

  useEffect(() => {
    setIncomingToken(token);
  }, [token]);

  // Live validation
  useEffect(() => {
    if (!touched.password && !touched.confirmPassword) return;
    const result = passwordSchema.safeParse({ password, confirmPassword });
    if (!result.success) {
      const errors: { password?: string; confirmPassword?: string } = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "password" && !errors.password) {
          errors.password = issue.message;
        }
        if (issue.path[0] === "confirmPassword" && !errors.confirmPassword) {
          errors.confirmPassword = issue.message;
        }
      }
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }, [password, confirmPassword, touched]);

  const allValid =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    Object.keys(fieldErrors).length === 0 &&
    passwordRequirements.every((req) => req.test(password));

  // Password strength calculation
  const strength = passwordRequirements.reduce((acc, req) => acc + (req.test(password) ? 1 : 0), 0);
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-yellow-500", "bg-green-400", "bg-green-600"];
  const strengthLabels = [t("requirements.weak") || "Weak", t("requirements.weak") || "Weak", t("requirements.fair") || "Fair", t("requirements.good") || "Good", t("requirements.strong") || "Strong", t("requirements.strong") || "Strong"];

  const { mutate: mutateRestPassword, isPending: isPendingRestpassword } =
    useMutation({
      mutationFn: newPasswordRequest,
      onSuccess: () => {
        setSuccess(true);
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!allValid) return;
    mutateRestPassword({ newPassword: password, token: incomingToken });
  };

  function handleSuccessButton() {
    openAuthModal();
    router.push("/");
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: 'radial-gradient(circle at 70% 30%, #feee00 0%, #f3f4f8 100%)',
        minHeight: '100vh',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.2 }}
        className="w-full max-w-lg"
      >
        <div className={`relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#feee00]/60 px-0 py-0 flex flex-col items-center ${isRTL ? 'text-right' : 'text-left'}` }>
          {/* Animated Icon/Illustration */}
          <div className="w-full flex flex-col items-center pt-10 pb-2">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <div className="bg-[#feee00] shadow-lg rounded-full p-4 mb-2 border-4 border-white">
                <FiLock className="text-[#023047] text-4xl" />
              </div>
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#023047] tracking-wide mb-1 mt-2">{success ? t("success.title") : t("title")}</h1>
            <p className="text-gray-600 mb-2 text-base max-w-xs mx-auto">{success ? t("success.message") : t("description")}</p>
          </div>

          {/* Progress/Steps Indicator */}
          <div className="w-full flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${success ? 'bg-green-500' : 'bg-[#feee00]'}`}></div>
              <div className={`w-2 h-2 rounded-full ${success ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
          </div>

          {/* Form or Success */}
          <div className="w-full px-8 sm:px-12 pb-10 pt-2">
            <AnimatePresence>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center justify-center min-h-[250px]"
                >
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                    <FiCheckCircle size={100} className="text-green-500 drop-shadow-lg mb-4" />
                  </motion.div>
                  <button
                    onClick={handleSuccessButton}
                    className="inline-flex items-center justify-center px-8 py-3 bg-[#feee00] text-[#023047] font-bold rounded-xl shadow hover:bg-yellow-300 transition-colors text-lg mt-2"
                  >
                    {t("success.button")}
                    <FiArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Password Field */}
                  <div className="relative mb-1">
                    <label
                      htmlFor="password"
                      className={`block mb-2 text-base font-semibold text-[#023047] ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t("form.newPassword")}
                    </label>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
                      className={`w-full px-4 py-4 border border-[#feee00] bg-[#f3f4f8] rounded-xl focus:ring-2 focus:ring-[#feee00] focus:border-[#feee00] transition-all text-lg ${isRTL ? 'text-right pr-12' : 'text-left pl-12'}`}
                      placeholder={t("form.newPasswordPlaceholder")}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#023047] transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                    </button>
                    {touched.password && fieldErrors.password && (
                      <div className="text-red-600 text-xs mt-1 animate-fadeIn">{fieldErrors.password}</div>
                    )}
                  </div>
                  {/* Password Strength Bar */}
                  <div className="w-full flex items-center gap-2 mb-2">
                    <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-200">
                      <div className={`h-2 rounded-full transition-all duration-300 ${strengthColors[strength]}`}
                        style={{ width: `${(strength / 5) * 100}%` }}></div>
                    </div>
                    <span className={`text-xs font-bold ${strength === 5 ? 'text-green-600' : strength >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>{strengthLabels[strength]}</span>
                  </div>
                  {/* Confirm Password Field */}
                  <div className="relative mb-1">
                    <label
                      htmlFor="confirmPassword"
                      className={`block mb-2 text-base font-semibold text-[#023047] ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      {t("form.confirmPassword")}
                    </label>
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => { setConfirmPassword(e.target.value); setTouched(t => ({ ...t, confirmPassword: true })); }}
                      className={`w-full px-4 py-4 border border-[#feee00] bg-[#f3f4f8] rounded-xl focus:ring-2 focus:ring-[#feee00] focus:border-[#feee00] transition-all text-lg ${isRTL ? 'text-right pr-12' : 'text-left pl-12'}`}
                      placeholder={t("form.confirmPasswordPlaceholder")}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#023047] transition-colors ${isRTL ? 'left-4' : 'right-4'}`}
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirm ? <FiEyeOff size={22} /> : <FiEye size={22} />}
                    </button>
                    {touched.confirmPassword && fieldErrors.confirmPassword && (
                      <div className="text-red-600 text-xs mt-1 animate-fadeIn">{fieldErrors.confirmPassword}</div>
                    )}
                  </div>
                  {/* Password requirements checklist */}
                  <div className="mt-6 mb-4">
                    <ul className={`text-sm text-gray-700 space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {passwordRequirements.map((req, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span
                            className={`inline-block w-3 h-3 rounded-full border-2 ${req.test(password) ? 'bg-[#feee00] border-[#023047]' : 'bg-gray-200 border-gray-300'}`}
                          >
                            {req.test(password) && <FiCheckCircle className="text-[#023047] text-xs" />}
                          </span>
                          <span className={req.test(password) ? 'font-semibold text-[#023047]' : ''}>{req.label}</span>
                        </li>
                      ))}
                      <li className="flex items-center gap-2">
                        <span
                          className={`inline-block w-3 h-3 rounded-full border-2 ${password === confirmPassword && password.length > 0 ? 'bg-[#feee00] border-[#023047]' : 'bg-gray-200 border-gray-300'}`}
                        >
                          {password === confirmPassword && password.length > 0 && <FiCheckCircle className="text-[#023047] text-xs" />}
                        </span>
                        <span className={password === confirmPassword && password.length > 0 ? 'font-semibold text-[#023047]' : ''}>{t("requirements.match")}</span>
                      </li>
                    </ul>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!allValid || isPendingRestpassword}
                    className={`w-full mt-8 px-8 py-3 rounded-xl font-bold flex items-center justify-center transition-colors text-lg shadow ${isPendingRestpassword
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-[#feee00] text-[#023047] hover:bg-yellow-300"
                      }`}
                  >
                    {isPendingRestpassword ? (
                      <>
                        <svg
                          className={`animate-spin -ml-1 h-5 w-5 text-[#023047] ${isRTL ? 'mr-3' : 'mr-3'}`}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("form.updating")}
                      </>
                    ) : (
                      <>
                        {t("form.updateButton")}
                        <FiArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
