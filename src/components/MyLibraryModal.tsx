import React, { useState } from 'react';
import { Book, PurchasedLicense } from '../types/book';
import { 
  X, 
  Download, 
  BookOpen, 
  Search, 
  ShieldCheck, 
  Key, 
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface MyLibraryModalProps {
  licenses: PurchasedLicense[];
  books: Book[];
  onClose: () => void;
  onReadBook: (book: Book) => void;
  onAddLicense: (license: PurchasedLicense) => void;
}

export const MyLibraryModal: React.FC<MyLibraryModalProps> = ({
  licenses,
  books,
  onClose,
  onReadBook,
  onAddLicense,
}) => {
  const [searchToken, setSearchToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [lookupMessage, setLookupMessage] = useState<string | null>(null);
  const [downloadingToken, setDownloadingToken] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchToken.trim()) return;

    setIsVerifying(true);
    setLookupMessage(null);

    try {
      const res = await fetch(`/api/orders/verify/${encodeURIComponent(searchToken.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Token not found.');
      }

      const verifiedOrder = data.order;
      onAddLicense({
        orderId: verifiedOrder.orderId,
        bookId: verifiedOrder.bookId,
        bookTitle: verifiedOrder.bookTitle,
        customerEmail: verifiedOrder.customerEmail,
        amount: 28.00,
        currency: 'USD',
        paymentMethod: 'paypal',
        downloadToken: searchToken.trim(),
        downloadCount: verifiedOrder.downloadCount,
        maxDownloads: verifiedOrder.maxDownloads,
        purchasedAt: verifiedOrder.purchasedAt,
        expiresAt: verifiedOrder.expiresAt,
      });

      setLookupMessage('License found and added to your active downloads!');
      setSearchToken('');
    } catch (err: any) {
      setLookupMessage(`Error: ${err.message || 'Invalid license token'}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = async (license: PurchasedLicense) => {
    setDownloadingToken(license.downloadToken);

    try {
      await fetch(`/api/orders/download/${license.downloadToken}`, {
        method: 'POST',
      });

      const matchingBook = books.find((b) => b.id === license.bookId);
      const bookTitle = matchingBook ? matchingBook.title : license.bookTitle;
      const author = matchingBook ? matchingBook.author : 'Author';
      
      const fileContent = `================================================================================
${bookTitle.toUpperCase()} — OFFICIAL EDITION
================================================================================
Licensed to: ${license.customerEmail}
License Token: ${license.downloadToken}
Order ID: ${license.orderId}
Purchase Date: ${new Date(license.purchasedAt).toLocaleDateString()}
Publisher: Omnishelf Monograph Editions

--------------------------------------------------------------------------------
CONTENT
--------------------------------------------------------------------------------
${
  matchingBook?.chapters
    ? matchingBook.chapters.map((c) => `${c.title}\n\n${c.fullContent || c.excerpt}\n`).join('\n---\n\n')
    : 'Authorized eBook Content'
}
`;

      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${bookTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_Official.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingToken(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif font-bold text-xl text-stone-900">
              My Library & Secure Downloads
            </h2>
            <p className="text-xs text-stone-500">
              Access your purchased eBooks, download DRM tokens, and read online
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* License Lookup Form */}
          <form onSubmit={handleLookup} className="p-4 bg-stone-50 border border-stone-200 rounded-xl">
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Restore Download with License Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchToken}
                onChange={(e) => setSearchToken(e.target.value)}
                placeholder="Enter dl_tok_... from your receipt"
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900"
              />
              <button
                type="submit"
                disabled={isVerifying || !searchToken.trim()}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 disabled:opacity-50 transition-colors shrink-0"
              >
                {isVerifying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Restore'}
              </button>
            </div>
            {lookupMessage && (
              <p className={`text-xs mt-2 ${lookupMessage.startsWith('Error') ? 'text-red-600' : 'text-emerald-700 font-medium'}`}>
                {lookupMessage}
              </p>
            )}
          </form>

          {/* List of Licenses */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Available Downloads ({licenses.length})
            </h3>

            {licenses.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-stone-200 rounded-xl">
                <p className="text-sm font-medium text-stone-700 mb-1">
                  No purchases found on this device yet.
                </p>
                <p className="text-xs text-stone-500">
                  Purchased books will appear here immediately after PayPal checkout, or you can restore an existing order above using its license token.
                </p>
              </div>
            ) : (
              licenses.map((lic) => {
                const matchingBook = books.find((b) => b.id === lic.bookId);
                const isDownloading = downloadingToken === lic.downloadToken;

                return (
                  <div
                    key={lic.orderId}
                    className="p-4 border border-stone-200 rounded-xl bg-white shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
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
                        <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
                          {lic.bookTitle}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Order #{lic.orderId} · Purchased {new Date(lic.purchasedAt).toLocaleDateString()}
                        </p>
                        <p className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Authorized License Active</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleDownload(lic)}
                        disabled={isDownloading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        {isDownloading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                        <span>Download</span>
                      </button>

                      {matchingBook && (
                        <button
                          onClick={() => {
                            onClose();
                            onReadBook(matchingBook);
                          }}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
