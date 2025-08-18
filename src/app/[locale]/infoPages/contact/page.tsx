"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {  FiTruck } from "react-icons/fi";
import { FaLeaf, FaRecycle } from "react-icons/fa";



type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
  mode: "onTouched",
});


const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form submitted:", data);
    setShowSuccessModal(true);
    reset();
  } catch (error) {
    console.error("Submit failed:", error);
  }
  setIsSubmitting(false);
};

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="text-center py-20 px-4">
        <h2 
          className="text-6xl font-light italic tracking-wide text-black mb-0"
          style={{ 
            fontFamily: '"Playfair Display", serif',
            fontWeight: '300',
            letterSpacing: '0.02em',
            lineHeight: '1.2'
          }}
        >
          Contact Us
        </h2>
      </div>

      {/* Google Maps */}
      <div className="w-full h-96 bg-gray-100 relative overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3384.5123456789!2d35.8617!3d31.9539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ca1c5c7b8a5a5%3A0x1234567890abcdef!2sKhalda%2C%20Amman%2C%20Jordan!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Sareh Alnommow Location - Khalda, Amman"
        />
        {/* Location Pin */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-lg"></div>
        </div>
      </div>


{/* Features Section */}
<div className="py-20 px-4" style={{ backgroundColor: '#f8f9fa' }}>
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* 100% Natural */}
      <div className="text-center bg-white p-8 shadow-sm">
  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center text-[#F9AF7E]">
    <FaLeaf className="w-20 h-20" />
  </div>
  <h3
    className="text-black mb-0"
    style={{
      fontFamily: '"Playfair Display", serif',
      fontSize: '26px',
      fontStyle: 'italic',
    }}
  >
    100% Natural
  </h3>
</div>

      {/* Free Shipping */}
      <div className="text-center bg-white p-8 shadow-sm">
        <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center text-[#F9AF7E]">
          <FiTruck className="w-20 h-20" />
        </div>
        <h3
          className="text-black mb-0"
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '26px',
            fontStyle: 'italic',
          }}
        >
          Free Shipping
        </h3>
      </div>

      {/* Eco Friendly */}
    <div className="text-center bg-white p-8 shadow-sm">
  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center text-[#F9AF7E]">
    <FaRecycle className="w-20 h-20" />
  </div>
  <h3
    className="text-black mb-0"
    style={{
      fontFamily: '"Playfair Display", serif',
      fontSize: '26px',
      fontStyle: 'italic',
    }}
  >
    Eco Friendly
  </h3>
</div>

    </div>
  </div>
</div>




      {/* Contact Form Section */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-4xl font-light text-black mb-4"
            style={{ 
              fontFamily: '"Playfair Display", serif',
              fontWeight: '300',
              fontSize: '48px',
              lineHeight: '1.2',
              marginBottom: '12px'
            }}
          >
            Send Us Your Questions!
          </h2>
          <p 
            className="text-gray-600 mb-16"
            style={{ 
              fontFamily: '"Open Sans", sans-serif',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#6c757d'
            }}
          >
            We&apos;ll get back to you within two days.
          </p>

          <div className="contact-us-form max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Name Field */}
              <div className="text-left">
                <label 
                  className="block text-black font-normal mb-3"
                  style={{ 
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000'
                  }}
                >
                  Full Name *
                </label>
              <input
  type="text"
  className="w-full px-3 py-3 border border-black bg-transparent focus:outline-none focus:border-black transition-colors text-black"
  style={{
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '16px',
    borderRadius: '0px', 
    backgroundColor: 'transparent'
  }}
  {...register("name", {
    required: "Full name is required",
    minLength: { value: 2, message: "Name must be at least 2 characters" },
  })}
/>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="text-left">
                <label 
                  className="block text-black font-normal mb-3"
                  style={{ 
                    fontFamily: '"Open Sans", sans-serif',
                    fontSize: '16px',
                    fontWeight: '400',
                    color: '#000'
                  }}
                >
                  Full Email *
                </label>
              <input
  type="email"
  className="w-full px-3 py-3 border border-black bg-transparent focus:outline-none focus:border-black transition-colors text-black"
  style={{
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '16px',
    borderRadius: '0px',
    backgroundColor: 'transparent'
  }}
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
  })}
/>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="text-left mb-12">
              <label 
                className="block text-black font-normal mb-3"
                style={{ 
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  color: '#000'
                }}
              >
                Full Message *
              </label>
              <textarea
  rows={8}
  className="w-full px-3 py-3 border border-black bg-transparent focus:outline-none focus:border-black transition-colors resize-none text-black"
  style={{
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '16px',
    borderRadius: '0px',
    backgroundColor: 'transparent'
  }}
  {...register("message", {
    required: "Message is required",
    minLength: { value: 10, message: "Message must be at least 10 characters" },
  })}
/>
              {errors.message && (
                <p className="text-red-500 text-sm mt-2" style={{ fontFamily: '"Open Sans", sans-serif' }}>
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="content-button text-center">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="px-12 py-4 text-white font-normal transition-colors disabled:opacity-50 inline-block"
                style={{
                  backgroundColor: '#000',
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '0',
                  minWidth: '200px'
                }}
              >
                {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
              </svg>
            </div>
            <h3 
              className="text-xl font-semibold text-gray-900 mb-2"
              style={{ fontFamily: '"Open Sans", sans-serif' }}
            >
              Thank you for your message. It has been sent.
            </h3>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors mt-4"
              style={{ 
                fontFamily: '"Open Sans", sans-serif',
                letterSpacing: '1px',
                textTransform: 'uppercase'
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Footer Contact Info */}
      <div className="bg-[#FFEDE4] py-16 px-4 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 
                className="font-semibold text-black mb-3"
                style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '18px' }}
              >
                Address
              </h4>
              <p 
                className="text-gray-600"
                style={{ 
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#6c757d'
                }}
              >
                Sareh Alnommow<br/>
                Khalda, Amman<br/>
                Jordan
              </p>
            </div>
            <div>
              <h4 
                className="font-semibold text-black mb-3"
                style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '18px' }}
              >
                Phone
              </h4>
              <p 
                className="text-gray-600"
                style={{ 
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#6c757d'
                }}
              >
                +962 6 123 4567
              </p>
            </div>
            <div>
              <h4 
                className="font-semibold text-black mb-3"
                style={{ fontFamily: '"Open Sans", sans-serif', fontSize: '18px' }}
              >
                Email
              </h4>
              <p 
                className="text-gray-600"
                style={{ 
                  fontFamily: '"Open Sans", sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#6c757d'
                }}
              >
                info@sarehalnommow.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;