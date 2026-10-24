import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  Banknote,
  ArrowRight,
  Edit2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function CheckoutPage({ setActivePage, setLatestOrder }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [selectedPayment, setSelectedPayment] = useState('UPI');
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState('');

  const paymentOptions = [
    { id: 'UPI', label: 'UPI (Google Pay, PhonePe, Paytm)', desc: 'Instant 0% fee zero latency payment', icon: Smartphone },
    { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay & Amex', icon: CreditCard },
    { id: 'NET_BANKING', label: 'Net Banking', desc: 'All Indian major banks supported', icon: Building2 },
    { id: 'COD', label: 'Cash on Delivery', desc: 'Pay at your doorstep upon verification', icon: Banknote }
  ];

  const handlePlaceOrder = async () => {
    if (!currentUser?.id) {
      setError('Sign in before placing an order.');
      return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!currentUser.fullName || !currentUser.phone || !currentUser.addressLine1
        || !currentUser.city || !currentUser.postalCode) {
      setError('Complete your name, phone, and delivery address in your profile before checkout.');
      return;
    }
    setIsPlacing(true);
    setError('');
    try {
      const savedOrder = await apiRequest('/api/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          userId: currentUser.id,
          shippingName: currentUser.fullName,
          shippingPhone: currentUser.phone,
          shippingAddress: currentUser.addressLine1,
          shippingCity: currentUser.city,
          shippingPostalCode: currentUser.postalCode,
          paymentMethod: selectedPayment,
          items: cart.map(i => ({ productId: i.product.id, quantity: i.quantity }))
        })
      });
      setLatestOrder(savedOrder);
      await clearCart();
      setActivePage('orders');
    } catch (requestError) {
      setError(requestError.message || 'Could not save the order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</div>}
      {/* Stepper Progress matching design */}
      <div className="flex items-center justify-center gap-6 text-xs font-bold">
        <div className="flex items-center gap-2 text-blue-600">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
          <span>Shipping</span>
        </div>
        <span className="w-10 h-0.5 bg-blue-600"></span>
        <div className="flex items-center gap-2 text-blue-600">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
          <span>Payment</span>
        </div>
        <span className="w-10 h-0.5 bg-slate-200"></span>
        <div className="flex items-center gap-2 text-slate-400">
          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">3</span>
          <span>Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment Options */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Card matching design */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Delivery Address</h3>
              </div>
              <button 
                onClick={() => setActivePage('profile')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Change
              </button>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">{currentUser.fullName}</span>
                <span className="px-2 py-0.5 bg-blue-600 text-white font-bold text-[10px] rounded">Home</span>
              </div>
              <p className="text-slate-600">
                {currentUser.addressLine1}, {currentUser.city} - {currentUser.postalCode}
              </p>
              <p className="text-slate-500 font-medium">Contact: {currentUser.phone}</p>
            </div>
          </div>

          {/* Payment Method Selector matching design */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-sm text-slate-900">Select Payment Method</h3>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Checkout stores your order and selected payment method. Payment processing is not connected.
              </p>
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedPayment === opt.id;
                return (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedPayment(opt.id)}
                      className="mt-1 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-slate-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{opt.label}</h4>
                      <p className="text-[11px] text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center text-xs">
                <span className="text-slate-700 truncate max-w-[190px]">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-bold text-slate-900">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Total</span>
              <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800">Total Payable</span>
            <span className="text-2xl font-black text-slate-900">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacing || cart.length === 0}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isPlacing ? (
              <span>Confirming with Bank...</span>
            ) : (
              <>
                <span>Place Order & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
