import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useContext } from "react";
import Spinner from "../UI/SpinnerLoading";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/store/CurrencyContext";
import { getShippingMethod } from "@/lib/axios/shippingMethodAxios";
import { CartContext } from "@/store/CartContext";

const Shipping: React.FC<{
  addressId: number;
  updateOrderData: (name: string, data: number | null) => void;
  startPayment: () => void;
  selectedShippingMethod: number | null;
  orderData: {
    addressId: number | null;
    delevaryMethodId: number | null;
  };
}> = ({
  addressId,
  updateOrderData,
  orderData,
  selectedShippingMethod,
  startPayment,
}) => {

    const t = useTranslations("shipping");
    const { summaryCart } = useContext(CartContext)
    const { data, isLoading, error } = useQuery({
      queryKey: ["shipping"],
      queryFn: () => getShippingMethod(summaryCart.cart_id, addressId),
    });

    const { rate, userCurrency } = useCurrency();

    function viewPriceCurencyHandler(priceNumber: number) {
      const price = (Number(priceNumber) * rate).toFixed(2);
      return price ? price : 0;
    }

    function handleSelectDelevaryMethod(e: React.ChangeEvent<HTMLInputElement>) {
      const selectedValue = e.target.value;
      console.log("Selected delivery method:", selectedValue ?? null);
      updateOrderData("delevaryMethodId", Number(selectedValue) ?? null);
    }

    function handleFinishSelectDelevary() {
      if (orderData.delevaryMethodId !== null) {
        startPayment();
      } else {
        toast.error(t("errors.selectMethod"));
      }
    }

    if (isLoading) {
      return (
        <div className="text-center my-40">
          <Spinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center my-40">
          <h1 className="text-black">{error.message}</h1>
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="text-center my-40">
          <h1 className="text-black">{t("noDelivery")}</h1>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm rounded-lg p-6 space-y-6"
      >
        <h2 
          className="text-xl font-medium text-black italic"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          {t("title")}
        </h2>

        <div className="space-y-4">

          {data.map((method, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-4 border-gray-200 rounded-md hover:border-black cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id={method.name}
                  name="shipping"
                  value={method.methodId}
                  onChange={handleSelectDelevaryMethod}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300"
                  defaultChecked={
                    selectedShippingMethod !== null &&
                    selectedShippingMethod === method.methodId
                  }
                />
                <label
                  htmlFor={method.name}
                  className=" block text-sm font-medium text-gray-700"
                >
                  {method.name}
                </label>
              </div>
              <span className="text-sm text-black">
                {userCurrency} {viewPriceCurencyHandler(method.cost ?? 0)}
              </span>
            </div>
          ))}

        </div>

        <div className="flex justify-between pt-4">
          <button className="text-black hover:text-gray-800 font-medium cursor-pointer">
            {t("back")}
          </button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleFinishSelectDelevary}
            className="bg-black text-white py-3 px-6 rounded-md hover:bg-gray-800 transition font-medium cursor-pointer"
          >
            {t("continue")}
          </motion.button>
        </div>
      </motion.div>
    );
  };

export default Shipping;