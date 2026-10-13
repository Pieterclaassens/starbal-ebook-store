import React, { useState, useEffect, useRef } from 'react';
import { Book, CartItem, PurchasedLicense } from '../types/book';
import { loadScript } from '@paypal/paypal-js';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Settings2, 
  Loader2,
  Trash2
} from 'lucide-react';

interface PayPalCheckoutModalProps {
  cart: CartItem[];
  onClose: () => void;
  onOrderSuccess: (orders: PurchasedLicense[], customerEmail: string) => void;
  onRemoveItem: (bookId: string) => void;
}

export const PayPalCheckoutModal: React.FC<PayPalCheckoutModalProps> = ({
  cart,
  onClose,
  onOrderSuccess,
  onRemoveItem,
}) => {
  const [customerEmail, setCustomerEmail] = useState('reader@example.com');
  const [paypalClientId, setPaypalClientId] = useState('test');
  const [showConfig, setShowConfig] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paypalScriptLoaded, setPaypalScriptLoaded] = useState(false);
  const paypalButtonContainerRef = useRef<HTMLDivElement>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.book.price * item.quantity, 0);
  const total = subtotal;

  // Load PayPal SDK buttons
  useEffect(() => {
    let isMounted = true;
    if (!paypalButtonContainerRef.current || cart.length === 0) return;

    // Reset container
    paypalButtonContainerRef.current.innerHTML = '';

    loadScript({
      clientId: paypalClientId || 'test',
      currency: 'USD',
      components: 'buttons',
    })
      .then((paypal) => {
        if (!isMounted || !paypal || !paypal.Buttons) return;
        setPaypalScriptLoaded(true);

        const buttons = paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
          },
          createOrder: (_data, actions) => {
            return actions.order.create({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  amount: {
                    currency_code: 'USD',
                    value: total.toFixed(2),
                  },
                  description: `Omnishelf eBook Purchase (${cart.length} titles)`,
                },
              ],
            });
          },
          onApprove: async (_data, actions) => {
            try {
              setIsProcessing(true);
              let captureDetails: any = null;
              if (actions.order) {
                captureDetails = await actions.order.capture();
              }
              await finalizeOrder(
                'paypal', 
                captureDetails?.id || `PAYPAL-${Date.now()}`
              );
            } catch (err: any) {
              setErrorMessage(err.message || 'Payment approval failed.');
              setIsProcessing(false);
            }
          },
          onError: (err) => {
            console.warn('PayPal Buttons error (expected in some mock environments):', err);
            // Non-blocking: user can still use Instant Simulator
          },
        });

        if (paypalButtonContainerRef.current) {
          buttons.render(paypalButtonContainerRef.current).catch((e) => {
            console.warn('Could not render PayPal buttons in iframe sandbox:', e);
          });
        }
      })
      .catch((err) => {
        console.warn('Failed to load PayPal script (offline or blocked sandbox):', err);
      });

    return () => {
      isMounted = false;
    };
  }, [paypalClientId, total, cart.length]);

  const finalizeOrder = async (paymentMethod: string, paypalOrderId?: string) => {
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address for your download receipt.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const itemsPayload = cart.map((item) => ({
        id: item.book.id,
        title: item.book.title,
        price: item.book.price,
      }));

      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: itemsPayload,
          customerEmail,
          paymentMethod,
          paypalOrderId,
          totalAmount: total,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete checkout.');
      }

      onOrderSuccess(data.orders, customerEmail);
    } catch (err: any) {
      setErrorMessage(err.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = () => {
    finalizeOrder('paypal_simulator', `SIM-PAYPAL-${Date.now()}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-sm">
              P
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                PayPal Express Checkout
              </h2>
              <p className="text-xs text-stone-500">
                Encrypted Transaction & Instant Digital Download
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-200/50 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cart Items List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Order Items ({cart.length})
            </h3>
            
            {cart.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">Your shopping bag is empty.</p>
            ) : (
              <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                {cart.map((item) => (
                  <div key={item.book.id} className="p-3.5 flex items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.book.coverImage}
                        alt=""
                        className="w-10 h-14 object-cover rounded bg-stone-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {item.book.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 truncate">
                          By {item.book.author} · {item.book.fileFormat} Edition
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-xs font-bold tabular-nums text-stone-900">
                        ${(item.book.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onRemoveItem(item.book.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Email Input for Fulfillment */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Customer Email Address (for digital receipt & download license)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full px-3.5 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-stone-900 text-stone-900"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Your license key and direct download links will be generated for this email.
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Digital Fulfillment Fee</span>
              <span className="font-mono tabular-nums text-emerald-700">FREE</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Due</span>
              <span className="font-mono tabular-nums">${total.toFixed(2)} USD</span>
            </div>
          </div>

          {/* PayPal Payment Controls */}
          <div className="space-y-3">
            {/* 1. Recommended Instant Test Checkout Simulator */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-2.5 mb-2">
                <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-950">
                    Instant PayPal Checkout Simulator
                  </h4>
                  <p className="text-[11px] text-blue-900/80">
                    Test the complete purchase and digital fulfillment flow instantly without requiring personal PayPal credentials.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSimulatePayment}
                disabled={isProcessing || cart.length === 0}
                className="w-full py-2.5 px-4 bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing License Fulfillment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Simulate Instant PayPal Order (${total.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>

            {/* 2. Official PayPal Buttons SDK Container */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Live PayPal Smart Buttons
                </span>
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className="flex items-center gap-1 text-[11px] text-stone-600 hover:text-stone-900"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>{showConfig ? 'Hide Settings' : 'PayPal Client ID'}</span>
                </button>
              </div>

              {showConfig && (
                <div className="mb-3 p-3 bg-stone-100 rounded-lg text-xs space-y-1.5">
                  <label className="block text-[11px] font-medium text-stone-700">
                    PayPal Client ID (Live or Sandbox)
                  </label>
                  <input
                    type="text"
                    value={paypalClientId}
                    onChange={(e) => setPaypalClientId(e.target.value)}
                    placeholder="sb, test, or your PayPal Client ID"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-hidden"
                  />
                  <p className="text-[10px] text-stone-500">
                    Set to 'test' or 'sb' for sandbox testing, or provide your real PayPal client ID.
                  </p>
                </div>
              )}

              {/* PayPal rendered container */}
              <div ref={paypalButtonContainerRef} className="min-h-12" />
            </div>
          </div>

          {/* Trust Marker */}
          <div className="flex items-center justify-center gap-2 text-stone-400 text-[11px] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>256-bit TLS encrypted transaction · Automated DRM tokenization</span>
          </div>

        </div>

      </div>
    </div>
  );
};
