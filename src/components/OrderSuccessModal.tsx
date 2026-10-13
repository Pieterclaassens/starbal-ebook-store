import React, { useState } from 'react';
import { Book, PurchasedLicense } from '../types/book';
import { 
  CheckCircle2, 
  Download, 
  BookOpen, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  X,
  FileText,
  Loader2
} from 'lucide-react';

interface OrderSuccessModalProps {
  orders: PurchasedLicense[];
  books: Book[];
  customerEmail: string;
  onClose: () => void;
  onReadBook: (book: Book) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  orders,
  books,
  customerEmail,
  onClose,
  onReadBook,
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [downloadCounts, setDownloadCounts] = useState<{ [token: string]: number }>({});

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const handleDownload = async (order: PurchasedLicense) => {
    setDownloadingId(order.downloadToken);

    try {
      // 1. Ping server fulfillment endpoint to verify license and increment counter
      const res = await fetch(`/api/orders/download/${order.downloadToken}`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {
        setDownloadCounts((prev) => ({
          ...prev,
          [order.downloadToken]: (prev[order.downloadToken] || order.downloadCount) + 1,
        }));
      }

      // 2. Generate and trigger real downloadable document payload
      const matchingBook = books.find((b) => b.id === order.bookId);
      const bookTitle = matchingBook ? matchingBook.title : order.bookTitle;
      const author = matchingBook ? matchingBook.author : 'Author';
      const isbn = matchingBook ? matchingBook.isbn : 'ISBN-N/A';
      
      const fileContent = `================================================================================
${bookTitle.toUpperCase()}
================================================================================
Author: ${author}
ISBN: ${isbn}
Digital License: ${order.licenseKey || order.downloadToken}
Licensed to: ${customerEmail}
Purchase Date: ${new Date(order.purchasedAt).toLocaleDateString()}
Order ID: ${order.orderId}
Publisher: Omnishelf Monograph Editions

--------------------------------------------------------------------------------
TABLE OF CONTENTS & CHAPTER OVERVIEW
--------------------------------------------------------------------------------
${matchingBook?.tableOfContents ? matchingBook.tableOfContents.join('\n') : 'Standard Chapters Included'}

--------------------------------------------------------------------------------
COMPLETE AUTHORIZED TEXT & MONOGRAPH CONTENT
--------------------------------------------------------------------------------

${
  matchingBook?.chapters
    ? matchingBook.chapters
        .map(
          (c, idx) =>
            `[ CHAPTER ${idx + 1}: ${c.title} ]\n\n${c.fullContent || c.excerpt}\n\n`
        )
        .join('\n--------------------------------------------------------------------------------\n\n')
    : 'Authorized eBook Content'
}

================================================================================
© ${new Date().getFullYear()} ${author}. All rights reserved.
Protected under International Copyright. Authorized personal copy for ${customerEmail}.
================================================================================
`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Official_Edition.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Banner */}
        <div className="px-6 py-5 bg-stone-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
                Payment Complete · PayPal Verified
              </span>
              <h2 className="font-serif text-2xl font-bold text-white">
                Thank You for Your Order
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-stone-500 block">Digital Receipt Delivered To:</span>
              <span className="font-semibold text-stone-900 text-sm">{customerEmail}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">Total Items:</span>
              <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
                {orders.length} eBook{orders.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* List of Purchased Licenses */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Your Purchased Titles & Downloads
            </h3>

            {orders.map((order) => {
              const matchingBook = books.find((b) => b.id === order.bookId);
              const currentDownloads = downloadCounts[order.downloadToken] ?? order.downloadCount;
              const remaining = Math.max(0, order.maxDownloads - currentDownloads);
              const isDownloading = downloadingId === order.downloadToken;

              return (
                <div 
                  key={order.orderId}
                  className="p-4 border border-stone-200 rounded-xl bg-white shadow-2xs space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {matchingBook?.coverImage ? (
                        <img
                          src={matchingBook.coverImage}
                          alt=""
                          className="w-12 h-16 object-cover rounded bg-stone-100 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-stone-100 rounded flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-stone-400" />
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                          {order.bookTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                          <span>Order #{order.orderId}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">${order.amount.toFixed(2)} USD</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{remaining} of {order.maxDownloads} downloads remaining</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Token Key Box */}
                  <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono">
                    <div className="flex items-center gap-2 truncate">
                      <Key className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="text-[11px] text-stone-600 truncate">
                        Token: {order.downloadToken}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(order.downloadToken)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded hover:bg-stone-50 transition-colors shrink-0"
                      title="Copy Token"
                    >
                      {copiedToken === order.downloadToken ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => handleDownload(order)}
                      disabled={isDownloading || remaining <= 0}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Preparing File...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download eBook</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        if (matchingBook) onReadBook(matchingBook);
                      }}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-xs font-semibold transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Online Now</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
