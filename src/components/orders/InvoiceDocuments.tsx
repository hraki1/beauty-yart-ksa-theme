"use client";

import React from "react";
import { motion } from "framer-motion";
import { Download, Share2, FileText } from "lucide-react";
import ReactQRCode from "react-qr-code";
import type { Invoice } from "@/lib/models/orderModal";

interface InvoiceDocumentsProps {
  invoices: Invoice[];
}

const InvoiceDocuments: React.FC<InvoiceDocumentsProps> = ({ invoices }) => {
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
    <section aria-label="Invoice Documents">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-base text-gray-800">
        <FileText className="w-5 h-5 text-indigo-600" />
        Documents
      </h3>

      <div className="flex flex-col gap-4">
        {invoices.map((invoice, index) => (
          <motion.article
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex flex-col md:flex-row items-center md:items-start gap-4"
            role="region"
            aria-labelledby={`invoice-title-${index}`}
          >
            {/* Info & Actions */}
            <div className="flex-1 w-full md:max-w-[280px]">
              <h4
                id={`invoice-title-${index}`}
                className="text-lg font-semibold mb-1 text-gray-900 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                Invoice {invoice.invoice_number}
              </h4>
              <p className="text-xs text-gray-600 mb-3">PDF Document</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(invoice.pdf_url, invoice.invoice_number)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition text-sm"
                  aria-label={`Download Invoice ${invoice.invoice_number}`}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>

                <button
                  onClick={() => handleShare(invoice.pdf_url)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-md font-medium hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition text-sm"
                  aria-label={`Share Invoice ${invoice.invoice_number}`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-xs text-gray-700 text-center max-w-xs">
                Scan to view/download on mobile
              </p>
              {invoice.pdf_url ? (
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  <ReactQRCode
                    value={invoice.pdf_url}
                    size={100}
                    fgColor="#4F46E5" // Indigo 600
                    bgColor="#FFFFFF"
                    level="M"
                  />
                </div>
              ) : (
                <p className="text-red-600 text-[10px] font-semibold">PDF not available</p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default InvoiceDocuments;
