import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaShippingFast } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { Ri24HoursFill, RiSecurePaymentLine } from "react-icons/ri";

const features = [
  {
    icon: <FaShippingFast className="w-10 h-10 mb-2 text-[#3740ea]" />,
    title: "Free Shipping & Returns",
    description: "On all orders over $50",
  },
  {
    icon: <AiOutlineDollarCircle className="w-10 h-10 text-[#3740ea]" />,
    title: "Money Back Guarantee",
    description: "30 days money back guarantee",
  },
  {
    icon: <Ri24HoursFill className="w-10 h-10 text-[#3740ea]" />,
    title: "Online Support 24/7",
    description: "We are here to help you anytime",
  },
  {
    icon: <RiSecurePaymentLine className="w-10 h-10 text-[#3740ea]" />,
    title: "Secure Payment",
    description: "100% secure payment",
  },
];

export default function FeaturesSection() {
  return (
    <section className="lg:px-10 px-5 relative py-5 border-b border-b-gray-200">
      <Swiper
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },   // md
          1024: { slidesPerView: 4 },  // lg
        }}
        className="w-full"
      >
        {features.map((feature) => (
          <SwiperSlide key={feature.title}>
            <div className="flex gap-3 items-center justify-center bg-white p-4  group transition-transform duration-300">
              {feature.icon}
              <div>
                <span className="block text-[18.5px] font-bold text-black">{feature.title}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
