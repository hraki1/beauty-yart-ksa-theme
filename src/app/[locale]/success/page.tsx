"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import { useTranslations } from "next-intl";

const OrderSuccessPage = () => {
  const router = useRouter();
  const t = useTranslations("orderSuccess");

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "linear-gradient(180deg, #FFEDE4 70%, #FFFFFF 100%)"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
            <FiCheckCircle className="h-12 w-12 text-green-500" />
          </div>
        </div>
        <h2 
          className="text-2xl font-bold mb-3"
          style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontStyle: 'italic',
            color: '#000000'
          }}
        >
          {t("title")}
        </h2>
        <p className="text-black mb-6">{t("description")}</p>
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/orders")}
            className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:bg-gray-800"
          >
            {t("viewOrders")}
            <FiArrowRight className="text-lg" />
          </motion.button>
          <button
            onClick={() => router.push("/")}
            className="w-full text-black border border-black py-2.5 px-6 rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
          >
            {t("continueShopping")}
          </button>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {t("needHelp")}{" "}
            <a
              href="#"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              {t("contactSupport")}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;