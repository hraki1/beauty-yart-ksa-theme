import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const Settings = () => {
  const t = useTranslations("account.settings");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white overflow-hidden"
      style={{ fontFamily: 'Europa, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* Header Section */}
      <div className="p-8 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-amber-50">
        <h2 className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
          {t("title")}
        </h2>
        <p className="text-slate-600 mt-1">
          Customize your notification preferences
        </p>
      </div>

      {/* Settings Content */}
      <div className="p-8 space-y-10">
        {/* Email Notifications Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border-l-4 border-blue-400">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t("email.title")}
              </h3>
              <p className="text-sm text-slate-500">
                Manage email notifications and updates
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pl-14">
            <label className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-gray-300">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-gray-600 border-2 border-slate-300 focus:ring-gray-500 focus:ring-2"
                defaultChecked
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">{t("email.orderUpdates")}</span>
                <p className="text-sm text-slate-500">
                  Get notified about your order status and delivery updates
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-gray-300">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-gray-600 border-2 border-slate-300 focus:ring-gray-500 focus:ring-2"
                defaultChecked
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">{t("email.promotions")}</span>
                <p className="text-sm text-slate-500">
                  Receive special offers, discounts, and promotional campaigns
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-gray-300">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-gray-600 border-2 border-slate-300 focus:ring-gray-500 focus:ring-2"
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">{t("email.recommendations")}</span>
                <p className="text-sm text-slate-500">
                  Get personalized product recommendations and suggestions
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Push Notifications Section */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-l-4 border-green-400">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8.5 14.5A2.5 2.5 0 0011 12c0-1.38-1.12-2.5-2.5-2.5S6 10.62 6 12s1.12 2.5 2.5 2.5zM12 6.5a5.5 5.5 0 110 11 5.5 5.5 0 010-11z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t("push.title")}
              </h3>
              <p className="text-sm text-slate-500">
                Control push notifications and alerts
              </p>
            </div>
          </div>
          
          <div className="space-y-4 pl-14">
            <label className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-gray-300">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-gray-600 border-2 border-slate-300 focus:ring-gray-500 focus:ring-2"
                defaultChecked
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">{t("push.statusChanges")}</span>
                <p className="text-sm text-slate-500">
                  Real-time updates when your order status changes
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-gray-300">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-gray-600 border-2 border-slate-300 focus:ring-gray-500 focus:ring-2"
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">{t("push.newArrivals")}</span>
                <p className="text-sm text-slate-500">
                  Be the first to know about new products and arrivals
                </p>
              </div>
            </label>
            
            <label className="flex items-start gap-4 p-4 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-l-gray-300">
              <input
                type="checkbox"
                className="mt-1 w-5 h-5 text-gray-600 border-2 border-slate-300 focus:ring-gray-500 focus:ring-2"
                defaultChecked
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">{t("push.accountActivity")}</span>
                <p className="text-sm text-slate-500">
                  Important security and account activity notifications
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-6 bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-400">
          <h4 className="font-semibold text-slate-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            Privacy Notice
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            We respect your privacy and will only send notifications you&apos;ve opted into. 
            You can change these preferences at any time. We never share your information with third parties.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-gray-500 to-black hover:from-gray-600 hover:to-black transition-all duration-300 border-l-4 border-gray-400">
            {t("save")}
          </button>
          <button className="px-8 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 border-2 border-slate-300 hover:border-slate-400 transition-all duration-300">
            Reset to Defaults
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;