import { AuthContext } from "@/store/AuthContext";
import { validateUpdateUserFormData } from "@/utils/valiadtion/validateUserInfoFormData";
import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../UI/Modal";
import { useMutation } from "@tanstack/react-query";
import { updateProfile, UpdateUserRequest } from "@/lib/axios/userAxios";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const ProfileInfo: React.FC = () => {
  const t = useTranslations("account.profile");

  const [userInfo, userInfoError] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, setUser, logout } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    phone: "+1 (555) 123-4567",
    birthday: "2001-03-01",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { userData: UpdateUserRequest; userId: number }) =>
      updateProfile(data.userData, data.userId),
    onSuccess: (data) => {
      setUser(data);
      toast.success(t("updateSuccess"));
      setIsEditing(false);
    },
    onError: (err) => {
      console.log("update profile error:", err);
      
      // Check if error is "Invalid token" and logout user
      if (err.message.includes("Invalid token")) {
        console.log("Invalid token detected in update profile, logging out...");
        logout();
        return;
      }
      
      toast.error(err.message);
    },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.full_name || "",
        phone: user.phone_number || "",
        birthday: user.birthday
          ? new Date(user.birthday).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const errors = validateUpdateUserFormData({
      full_name: formData.name,
      phone_number: formData.phone,
      birthday: new Date(formData.birthday).toISOString(),
    });
    // Add your save logic here

    if (errors.length > 0) {
      console.log(errors);
      userInfoError(errors);
      setIsModalOpen(true);

      return;
    }

    if (user?.id === undefined) {
      toast.error(t("validationErrors"));
      return;
    }
    mutate({
      userData: {
        full_name: formData.name,
        phone_number: formData.phone,
        birthday: new Date(formData.birthday).toISOString(),
      },
      userId: user.id,
    });

    console.log(formData);
  };

  return (
    <>
      {/* Updated Modal */}
      <Modal open={isModalOpen} classesName="pr-bg">
        <div className="pr-bg text-white w-full max-w-md p-8 relative border border-gray-400">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-100" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t("validationErrors")}
          </h2>
          <ul className="space-y-3 px-4 list-disc">
            {userInfo.map((err, idx) => (
              <li
                key={idx}
                className="w-full transition-colors text-red-200 font-medium"
                style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
              >
                {err}
              </li>
            ))}
          </ul>
          <div className="text-center mt-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all duration-300 border-l-4 border-gray-400"
              style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      </Modal>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-black"
        style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {/* Header Section */}
        <div className="p-8 border-b-2 border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-amber-50">
          <h2 
            className="text-2xl font-bold text-slate-800" 
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t("personalInfo")}
          </h2>
          {isEditing ? (
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 transition-all duration-300"
              >
                {t("cancel")}
              </button>
              <button
                disabled={isPending}
                onClick={handleSave}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-amber-500 hover:from-gray-600 hover:to-amber-600 transition-all duration-300 border-l-4 border-gray-400"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 transition-all duration-300"
            >
              {t("editProfile")}
            </button>
          )}
        </div>
        
        {/* Form Section */}
        <div className="p-8 space-y-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Full Name Field */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-slate-700 mb-2 tracking-wide">
                {t("fullName")}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-slate-300 focus:border-gray-400 focus:outline-none text-slate-800 transition-all duration-300 bg-white hover:border-slate-400"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border-l-4 border-gray-300 font-medium">
                  {formData.name || "Not provided"}
                </div>
              )}
            </div>
            
            {/* Birthday Field */}
            <div className="space-y-3">
              <label className="block text-base font-semibold text-slate-700 mb-2 tracking-wide">
                {t("birthday")}
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-slate-300 focus:border-gray-400 focus:outline-none text-slate-800 transition-all duration-300 bg-white hover:border-slate-400"
                />
              ) : (
                <div className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border-l-4 border-gray-300 font-medium">
                  {formData.birthday || "Not provided"}
                </div>
              )}
            </div>
            
            {/* Phone Number Field */}
            <div className="space-y-3 md:col-span-2">
              <label className="block text-base font-semibold text-slate-700 mb-2 tracking-wide">
                {t("phoneNumber")}
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-slate-300 focus:border-gray-400 focus:outline-none text-slate-800 transition-all duration-300 bg-white hover:border-slate-400"
                  placeholder="Enter your phone number"
                />
              ) : (
                <div className="w-full px-4 py-4 bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border-l-4 border-gray-300 font-medium">
                  {formData.phone || "Not provided"}
                </div>
              )}
            </div>
          </div>

          {/* Info Notice */}
          {!isEditing && (
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-amber-50 border-l-4 border-gray-400">
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-gray-700">Note:</strong> Click&quot;Edit Profile&rdquo; to modify your personal information. 
                Make sure all information is accurate as it will be used for account verification and communication.
              </p>
            </div>
          )}

          {/* Action Hints for Editing Mode */}
          {isEditing && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400">
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong className="text-blue-700">Editing Mode:</strong> Make your changes and click &quot;Save Changes&rdquo; to update your profile, 
                or&quot;Cancel&rdquo; to discard changes.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProfileInfo;