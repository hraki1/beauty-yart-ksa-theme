import { motion } from "framer-motion";
import Modal from "../UI/Modal";
import { useContext, useState } from "react";
import { restPasswordRequest } from "@/lib/axios/resetPasswordAxios";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { AuthContext } from "@/store/AuthContext";

const SecurityInfo = () => {
  const t = useTranslations("account.security.modal");
  const tCard = useTranslations("account.security.card");

  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [successResetPasswordRequest, setSuccessResetPasswordRequest] =
    useState<string | null>(null);

  const { user, logout } = useContext(AuthContext)

  const [formInput, setFormInput] = useState({
    email: user?.email || "",
  });
  const [formError, setFormError] = useState<string | null>(null);

  const {
    mutate: mutateRequestResetPassword,
    isPending: isPendingResetPassword,
  } = useMutation({
    mutationFn: restPasswordRequest,
    onSuccess: (data) => {
      setSuccessResetPasswordRequest(data.message);
      setFormError(null);
      toast.success(data.message);
      console.log("تم ارسال otp", data);
    },
    onError: (error: Error) => {
      console.log("reset password error:", error);
      
      // Check if error is "Invalid token" and logout user
      if (error.message.includes("Invalid token")) {
        console.log("Invalid token detected in reset password, logging out...");
        logout();
        return;
      }
      
      setFormError(error.message);
      toast.error(error.message);
      console.log("خطأ أثناء rest password:", error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormError(null);
  };

  function handleForgetPassword() {
    // Basic email validation
    const email = formInput.email || "";
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setFormError(t("invalidEmail"));
      return;
    }
    setFormError(null);
    mutateRequestResetPassword({ email });
  }

  function toggleOpenCloseModal() {
    setIsOpenModal((prev) => !prev);
    setSuccessResetPasswordRequest(null);
    setFormInput({ email: user?.email || "" });
    setFormError(null);
  }

  return (
    <>
      {/* Updated Modal */}
      <Modal open={isOpenModal} classesName="pr-bg">
        <div className="pr-bg text-white w-full max-w-md p-8 relative z-[1500] border-2 border-gray-400">
          <button
            onClick={toggleOpenCloseModal}
            className="absolute top-4 right-4 text-3xl text-gray-300 hover:text-white transition-colors duration-200"
            aria-label={t("closeAriaLabel")}
          >
            &times;
          </button>
          
          {successResetPasswordRequest ? (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-100" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t("title")}
              </h2>
              <div className="space-y-6 text-center">
                <div>
                  <div className="flex justify-center">
                    <label className="block mb-4 text-gray-200 text-lg leading-relaxed" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t("successMessage")}
                    </label>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleOpenCloseModal}
                  className="w-full bg-gradient-to-r from-gray-500 to-amber-500 hover:from-gray-600 hover:to-amber-600 transition-all duration-300 py-3 text-white font-medium border-l-4 border-gray-400"
                  style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {t("done")}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-100" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t("title")}
              </h2>
              <div className="space-y-6 text-center">
                <div>
                  <div className="flex justify-center">
                    <label className="block mb-4 text-gray-200 font-medium" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {t("emailLabel")}
                    </label>
                  </div>

                  <input
                    name="email"
                    type="string"
                    onChange={handleInputChange}
                    value={formInput.email}
                    className={`w-full p-4 bg-slate-700 text-center border-2 border-slate-600 focus:border-gray-400 focus:outline-none transition-all duration-300 text-white ${
                      formError ? "border-red-500" : ""
                    }`}
                    placeholder={t("emailPlaceholder")}
                    style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  />
                  {formError && (
                    <div className="text-red-300 text-sm mt-3 font-medium" style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                      {formError}
                    </div>
                  )}
                </div>

                <button
                  disabled={isPendingResetPassword}
                  type="button"
                  onClick={handleForgetPassword}
                  className={`w-full bg-gradient-to-r from-gray-500 to-amber-500 hover:from-gray-600 hover:to-amber-600 transition-all duration-300 py-3 text-white font-medium border-l-4 border-gray-400 flex items-center justify-center ${
                    isPendingResetPassword ? "opacity-70" : ""
                  }`}
                  style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
                >
                  {isPendingResetPassword ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      {t("sending")}
                    </>
                  ) : t("send")}
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* Main Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white overflow-hidden space-y-0"
        style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {/* Header Section */}
        <div className="p-8 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50">
          <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
            {tCard("title")}
          </h2>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8">
          {/* Password Section */}
          <div className="border-2 border-slate-200 hover:border-slate-300 transition-all duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {tCard("passwordLabel")}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Change your account password to keep your account secure. You&apos;ll receive an email with reset instructions.
                </p>
              </div>
              <button
                onClick={toggleOpenCloseModal}
                className="px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 border-2 border-gray-300 hover:border-gray-400 whitespace-nowrap transition-all duration-300 flex-shrink-0"
              >
                {tCard("changePassword")}
              </button>
            </div>
          </div>

          {/* Additional Security Settings */}
          <div className="border-2 border-slate-200 hover:border-slate-300 transition-all duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 p-6 bg-gradient-to-r from-slate-50 to-gray-50">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Account Security
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your account is secured with email verification. Keep your email address up to date for important security notifications.
                </p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 border-l-2 border-green-400"></div>
                <span className="text-sm font-medium text-green-700">Active</span>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Security Tips
            </h4>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Use a strong, unique password for your account
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Keep your email address current for security notifications
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Log out from shared or public devices after use
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SecurityInfo;