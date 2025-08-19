"use client";

import React from "react";
import { motion } from "framer-motion";
import ReactQRCode from "react-qr-code";
import type { Invoice } from "@/lib/models/orderModal";

interface InvoiceDocumentsProps {
  invoices: Invoice[];
}

export default function InvoiceDocuments({ invoices }: InvoiceDocumentsProps) {
  const handleDownload = (pdfUrl: string | null, invoiceNumber: string) => {
    if (!pdfUrl) {
      alert("Invoice PDF not available.");
      return;
    }
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `Invoice_${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (pdfUrl: string | null) => {
    if (!pdfUrl) {
      alert("Invoice PDF not available.");
      return;
    }
    if ("share" in navigator) {
      try {
        await (navigator as Navigator & { share(data?: ShareData): Promise<void> }).share({
          title: "Invoice PDF",
          text: "Here is your invoice PDF",
          url: pdfUrl,
        });
      } catch {
        alert("Sharing failed or cancelled.");
      }
    } else {
      alert("Sharing is not supported on this device/browser.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      aria-label="Invoice Documents"
    >
      <h3 className="font-bold text-xl flex items-center gap-3 text-black font-['Playfair_Display'] italic">
        <div className="p-2 rounded-xl bg-gray-100">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        Documents
      </h3>

      <div className="space-y-4">
        {invoices.map((invoice, index) => (
          <motion.article
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Invoice Info */}
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2 text-black flex items-center gap-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  Invoice {invoice.invoice_number}
                </h4>
                <p className="text-sm text-gray-600 mb-4 bg-gray-100 inline-block px-3 py-1 rounded-full">
                  PDF Document
                </p>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => handleDownload(invoice.pdf_url, invoice.invoice_number)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all shadow-lg"
                    aria-label={`Download Invoice ${invoice.invoice_number}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    Download
                  </motion.button>

                  <motion.button
                    onClick={() => handleShare(invoice.pdf_url)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black text-black rounded-2xl font-semibold hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
                    aria-label={`Share Invoice ${invoice.invoice_number}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Share
                  </motion.button>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center bg-white/60 rounded-2xl p-4 border border-gray-200">
                <p className="mb-3 text-xs text-gray-700 text-center font-medium">Scan to view/download</p>
                {invoice.pdf_url ? (
                  <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-200">
                    <ReactQRCode value={invoice.pdf_url} size={96} />
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-2xl border border-red-200">
                    PDF not available
                  </div>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
