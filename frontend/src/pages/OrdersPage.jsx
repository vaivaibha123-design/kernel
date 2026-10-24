import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  ChevronDown, 
  RotateCcw,
  ShoppingCart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function OrdersPage({ latestOrder, setActivePage, setSelectedProduct }) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!currentUser?.id) {
      setOrders([]);
      return () => { cancelled = true; };
    }
    apiRequest(`/api/orders?userId=${currentUser.id}`)
      .then(data => {
        if (!cancelled) {
          setOrders(data);
          setError('');
        }
      })
      .catch(requestError => {
        if (!cancelled) setError(requestError.message);
      });
    return () => { cancelled = true; };
  }, [currentUser?.id, latestOrder]);

  const filteredOrders = orders.filter(order => {
    if (selectedStatusTab === 'All') return true;
    if (selectedStatusTab === 'Canceled') return order.status === 'CANCELLED';
    return order.status.toLowerCase() === selectedStatusTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case 'SHIPPED':
        return <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[11px] font-bold">Shipped</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">Delivered</span>;
      case 'PROCESSING':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">Processing</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your past purchases, invoices, and real-time transit status</p>
        </div>

        {/* Status Filter Tabs matching design board */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Canceled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatusTab(tab)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedStatusTab === tab
                  ? 'bg-white text-blue-600 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {error && <div className="text-sm text-red-700" role="alert">{error}</div>}
        {!currentUser && <p className="text-sm text-slate-600">Sign in to view your orders.</p>}
        {currentUser && !error && filteredOrders.length === 0 && (
          <p className="text-sm text-slate-600">No orders found for your account.</p>
        )}
        {filteredOrders.map((order) => {
          const isExpanded = expandedOrderId === order.orderNumber;
          return (
            <div
              key={order.orderNumber}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Order Card Header */}
              <div 
                onClick={() => setExpandedOrderId(isExpanded ? null : order.orderNumber)}
                className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">#{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid</span>
                    <div className="text-base font-black text-slate-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded Order Tracking Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-6">
                  {/* Milestones Stepper */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                      Shipment Status & Tracking
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="space-y-1">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                        <span className="font-bold text-slate-900 text-[11px]">Confirmed</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                        <span className="font-bold text-slate-900 text-[11px]">Packed</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                          order.status === 'SHIPPED' || order.status === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {order.status === 'SHIPPED' || order.status === 'DELIVERED' ? '✓' : '3'}
                        </div>
                        <span className="font-bold text-slate-900 text-[11px]">In Transit</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                          order.status === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {order.status === 'DELIVERED' ? '✓' : '4'}
                        </div>
                        <span className="font-bold text-slate-900 text-[11px]">Delivered</span>
                      </div>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Ordered Items ({order.items.length})
                    </h4>
                    <div className="divide-y divide-slate-200 bg-white rounded-xl border border-slate-200 p-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-50 p-1 flex items-center justify-center shrink-0">
                              <img src={item.product?.imageUrl || item.image || ''} alt={item.product?.name || item.productName} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{item.product?.name || item.productName}</p>
                              <span className="text-[11px] text-slate-400">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            ₹{Number(item.unitPrice ?? item.price ?? 0).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
