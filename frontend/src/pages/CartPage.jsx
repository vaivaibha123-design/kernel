import React from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage({ setActivePage }) {
  const { cart, cartError, cartLoading, updateQuantity, removeFromCart, cartTotal, totalItems } = useCart();

  if (cartLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-slate-600">Loading your saved cart...</div>;
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        {cartError && <div className="text-sm text-red-700" role="alert">{cartError}</div>}
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our trending GPUs, CPUs, and PC builds or use our PC Builder to configure your dream system.
        </p>
        <button
          onClick={() => setActivePage('catalog')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
        >
          Browse Hardware Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    {cartError && <div className="text-sm text-red-700" role="alert">{cartError}</div>}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900">Your Cart ({totalItems} items)</h1>
        <button
          onClick={() => setActivePage('catalog')}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item Rows */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 divide-y divide-slate-100">
          {cart.map((item) => (
            <div key={item.product.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
                  <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-blue-600 px-2 py-0.5 bg-blue-50 rounded">
                    {item.product.conditionType}
                  </span>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate mt-1">
                    {item.product.name}
                  </h3>
                  <div className="text-xs font-extrabold text-slate-800 mt-1">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => updateQuantity(item.product.id, -1)}
                    className="p-1.5 hover:bg-slate-200 transition-colors text-slate-600"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, 1)}
                    className="p-1.5 hover:bg-slate-200 transition-colors text-slate-600"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <div className="text-sm font-black text-slate-900">
                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary Card */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="font-extrabold text-sm text-slate-900 pb-3 border-b border-slate-100">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST / Taxes</span>
              <span className="text-slate-400">Included in price</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-800">Total Amount</span>
            <span className="text-2xl font-black text-slate-900">
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={() => setActivePage('checkout')}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
