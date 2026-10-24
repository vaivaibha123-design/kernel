import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  X, 
  Check, 
  ShoppingBag, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Tag, 
  Layers, 
  UserCheck, 
  UserX,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function DashboardPage({ 
  products, 
  setActivePage, 
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct 
}) {
  const { currentUser } = useAuth();
  const dashboardRole = currentUser?.role;
  const [adminTab, setAdminTab] = useState('products'); // 'overview', 'products', 'users', 'orders', 'resell'
  const [adminError, setAdminError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Graphics Cards',
    brand: 'NVIDIA',
    conditionType: 'New',
    price: '',
    originalPrice: '',
    stock: '15',
    imageUrl: '/src/assets/images/products/rtx-4070-super.svg',
    description: '',
    warrantyInfo: '3 Years Brand Warranty'
  });

  // Users State (with live admin actions)
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [resellList, setResellList] = useState([]);
  const [repairList, setRepairList] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalProducts: 0, totalUsers: 0, lowStockCount: 0 });

  useEffect(() => {
    apiRequest('/api/admin/dashboard')
      .then(data => {
        setStats(data);
        setUsersList(data.users || []);
        setOrdersList((data.recentOrders || []).map(order => ({
          ...order,
          customer: order.shippingName || 'Customer',
          total: Number(order.totalAmount || 0),
          payment: order.paymentMethod || 'UPI',
          date: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent'
        })));
        setResellList(data.resellRequests || []);
        setRepairList(data.repairTickets || []);
      })
      .catch(error => setAdminError(error.message));
  }, []);

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Calculate live statistics
  const totalRevenue = Number(stats.totalRevenue || 0);
  const lowStockCount = Number(stats.lowStockCount || 0);
  const monthlyRevenue = ordersList.reduce((totals, order) => {
    const date = new Date(order.createdAt);
    if (Number.isNaN(date.getTime())) return totals;
    const month = date.toLocaleDateString('en-IN', { month: 'short' });
    totals[month] = (totals[month] || 0) + Number(order.totalAmount || 0);
    return totals;
  }, {});
  const revenueChartData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

  // Image options for easy selection in product modal
  const availableImages = [
    { label: 'RTX 4070 Super', url: '/src/assets/images/products/rtx-4070-super.svg' },
    { label: 'Ryzen 7 7800X3D', url: '/src/assets/images/products/ryzen-7-7800x3d.svg' },
    { label: 'Corsair DDR5 RAM', url: '/src/assets/images/products/corsair-ddr5-32gb.svg' },
    { label: 'Samsung 980 Pro SSD', url: '/src/assets/images/products/samsung-980-pro-1tb.svg' },
    { label: 'MSI B650 Motherboard', url: '/src/assets/images/products/msi-b650-gaming-plus.svg' },
    { label: 'Radeon RX 6700 XT', url: '/src/assets/images/products/rx-6700-xt.svg' },
    { label: 'RTX 3060 12GB', url: '/src/assets/images/products/rtx-3060.svg' },
    { label: 'MSI RTX 4060', url: '/src/assets/images/products/msi-rtx-4060.svg' },
    { label: 'ZOTAC RTX 3080', url: '/src/assets/images/products/zotac-rtx-3080.svg' },
    { label: 'Cooler Master MB520 Case', url: '/src/assets/images/products/cooler-master-mb520.svg' },
    { label: 'Corsair RM750e PSU', url: '/src/assets/images/products/corsair-rm750e.svg' },
    { label: 'Pre-built Gaming Rig', url: '/src/assets/images/products/pc-build-apex.svg' },
  ];

  // SUBMIT ADD PRODUCT
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    try {
      await onAddProduct({
        name: productForm.name,
        category: productForm.category,
        brand: productForm.brand,
        conditionType: productForm.conditionType,
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        stock: Number(productForm.stock || 10),
        imageUrl: productForm.imageUrl,
        description: productForm.description || `${productForm.name} added to Kernel catalog.`,
        warrantyInfo: productForm.warrantyInfo
      });
    } catch (error) {
      setAdminError(error.message);
      return;
    }

    setIsAddModalOpen(false);
    setProductForm({
      name: '',
      category: 'Graphics Cards',
      brand: 'NVIDIA',
      conditionType: 'New',
      price: '',
      originalPrice: '',
      stock: '15',
      imageUrl: '/src/assets/images/products/rtx-4070-super.svg',
      description: '',
      warrantyInfo: '3 Years Brand Warranty'
    });
  };

  // SUBMIT EDIT PRODUCT
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await onUpdateProduct(editingProduct.id, {
        ...editingProduct,
        price: Number(editingProduct.price),
        originalPrice: Number(editingProduct.originalPrice || editingProduct.price),
        stock: Number(editingProduct.stock)
      });
    } catch (error) {
      setAdminError(error.message);
      return;
    }

    setEditingProduct(null);
  };

  // CONFIRM DELETE PRODUCT
  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      await onDeleteProduct(deletingProductId);
      setDeletingProductId(null);
    } catch (error) {
      setAdminError(error.message);
    }
  };

  // CHANGE USER ROLE
  const handleUserRoleChange = async (userId, newRole) => {
    try {
      const updated = await apiRequest(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      setUsersList(prev => prev.map(user => user.id === userId ? updated : user));
      setAdminError('');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  // TOGGLE USER STATUS
  const handleToggleUserStatus = async (userId) => {
    try {
      const updated = await apiRequest(`/api/admin/users/${userId}/toggle-status`, { method: 'PATCH' });
      setUsersList(prev => prev.map(user => user.id === userId ? updated : user));
      setAdminError('');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this account and its associated cart, orders, reviews, and service requests?')) return;
    try {
      await apiRequest(`/api/admin/users/${userId}`, { method: 'DELETE' });
      setUsersList(prev => prev.filter(user => user.id !== userId));
      setAdminError('');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  // UPDATE ORDER STATUS
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await apiRequest(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setOrdersList(prev => prev.map(order => order.id === orderId ? { ...order, status: updated.status } : order));
      setAdminError('');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  // UPDATE RESELL STATUS
  const handleResellStatusChange = async (reqId, newStatus) => {
    try {
      const updated = await apiRequest(`/api/admin/resell/${reqId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setResellList(prev => prev.map(request => request.id === reqId ? updated : request));
      setAdminError('');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  const handleRepairStatusChange = async (ticketId, newStatus) => {
    try {
      const updated = await apiRequest(`/api/admin/repair/${ticketId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      setRepairList(prev => prev.map(ticket => ticket.id === ticketId ? updated : ticket));
      setAdminError('');
    } catch (error) {
      setAdminError(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Console Switcher */}
      {adminError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{adminError}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {dashboardRole === 'ADMIN' ? 'Kernel Admin Central Control' : 'Seller / B2B Bulk Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full authority over products inventory, customer orders, registered users, and resale valuations
          </p>
        </div>

        <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold">{currentUser?.role || 'Signed out'}</span>
      </div>

      {/* ============================================================== */}
      {/* ADMIN CENTRAL VIEW */}
      {/* ============================================================== */}
      {dashboardRole === 'ADMIN' && (
        <div className="space-y-6">
          {/* Admin Navigation Tabs */}
          <div className="flex flex-wrap border-b border-slate-200 gap-2 sm:gap-6 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setAdminTab('overview')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all ${
                adminTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setAdminTab('products')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all ${
                adminTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Inventory ({products.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('users')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all ${
                adminTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Users & Roles ({usersList.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('orders')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all ${
                adminTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders & Sales ({ordersList.length})</span>
            </button>

            <button
              onClick={() => setAdminTab('resell')}
              className={`pb-3.5 border-b-2 flex items-center gap-2 transition-all ${
                adminTab === 'resell' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Resell & Repairs ({resellList.length})</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {adminTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold">From paid database orders</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Products</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{Number(stats.totalProducts || products.length)}</div>
                  <span className="text-[10px] text-blue-600 font-semibold">{lowStockCount} low stock alerts</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registered Users</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{Number(stats.totalUsers || usersList.length)}</div>
                  <span className="text-[10px] text-indigo-600 font-semibold">Active accounts</span>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{ordersList.length}</div>
                  <span className="text-[10px] text-amber-600 font-semibold">
                    {ordersList.filter(o => o.status === 'PROCESSING' || o.status === 'PENDING').length} awaiting fulfillment
                  </span>
                </div>
              </div>

              {/* Revenue Curve Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">Platform Revenue Overview</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                    ₹{totalRevenue.toLocaleString('en-IN')} total
                  </span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`} tickLine={false} />
                      <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
                      <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS & INVENTORY CONTROL */}
          {adminTab === 'products' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              {/* Header Action Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by product name or brand..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 w-64 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>

                  {/* Category Filter Dropdown */}
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Graphics Cards">Graphics Cards</option>
                    <option value="CPUs">CPUs</option>
                    <option value="RAM">RAM</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="Storage">Storage</option>
                    <option value="Cabinets">Cabinets</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="PC Builds">PC Builds</option>
                  </select>
                </div>

                {/* ADD NEW PRODUCT BUTTON */}
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Condition</th>
                      <th className="py-3 px-4">Price (₹)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((item) => {
                      const isLow = item.stock <= 5;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-3">
                            <img src={item.imageUrl} alt={item.name} className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0" />
                            <div className="truncate max-w-xs">
                              <span className="font-extrabold text-slate-900 block truncate">{item.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{item.brand}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{item.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.conditionType === 'New'
                                ? 'bg-blue-50 text-blue-700'
                                : item.conditionType === 'Used'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {item.conditionType}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-black text-slate-900">
                            ₹{item.price.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isLow ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {isLow ? `Low Stock (${item.stock})` : `In Stock (${item.stock})`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct({ ...item })}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Edit className="w-3 h-3" /> Edit
                            </button>
                            <button
                              onClick={() => setDeletingProductId(item.id)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-md font-bold transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" /> Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ALL USERS & ROLES */}
          {adminTab === 'users' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">User Account Management</h3>
                  <p className="text-xs text-slate-500">Manage account access, B2B wholesale agents, and administrator roles</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Assigned Role</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                            {usr.fullName ? usr.fullName.charAt(0) : 'U'}
                          </div>
                          <div>
                            <span className="font-extrabold block text-slate-900">{usr.fullName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{usr.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{usr.phone || '+91 98765 00000'}</td>
                        <td className="py-3 px-4">{usr.city || 'Mumbai'}</td>
                        <td className="py-3 px-4">
                          <select
                            value={usr.role}
                            onChange={(e) => handleUserRoleChange(usr.id, e.target.value)}
                            className="bg-slate-100 font-bold text-slate-800 rounded-lg px-2 py-1 outline-none border border-slate-200 cursor-pointer"
                          >
                            <option value="USER">USER</option>
                            <option value="AGENT">AGENT</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            usr.isActive !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {usr.isActive !== false ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleUserStatus(usr.id)}
                            className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
                              usr.isActive !== false 
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                          >
                            {usr.isActive !== false ? 'Suspend' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(usr.id)}
                            className="ml-2 px-3 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100 text-[11px] font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & SALES FULFILLMENT */}
          {adminTab === 'orders' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Platform Orders & Dispatch Control</h3>
                  <p className="text-xs text-slate-500">Live order fulfillment, payment verification, and delivery dispatching</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Total Amount (₹)</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ordersList.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">#{ord.orderNumber}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{ord.customer}</td>
                        <td className="py-3 px-4 font-black text-slate-900">₹{ord.total.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 text-slate-500">{ord.date}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded">
                            {ord.payment}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                            className="bg-slate-50 border border-slate-300 font-bold text-slate-800 rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: RESELL & REPAIR PIPELINES */}
          {adminTab === 'resell' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">Incoming Resale Valuations</h3>
                <p className="text-xs text-slate-500">Review user-submitted hardware offers and approve cash payouts</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Component</th>
                      <th className="py-3 px-4">Condition</th>
                      <th className="py-3 px-4">User Asking (₹)</th>
                      <th className="py-3 px-4">Kernel Quote (₹)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resellList.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">User #{req.userId}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">{req.modelName}</td>
                        <td className="py-3 px-4">{req.hardwareCondition}</td>
                        <td className="py-3 px-4">₹{Number(req.expectedPrice || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 font-black text-emerald-600">₹{Number(req.estimatedQuote || 0).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleResellStatusChange(req.id, 'ACCEPTED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleResellStatusChange(req.id, 'REJECTED')}
                            className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-[11px]"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto">
                <h3 className="mb-3 font-extrabold text-sm text-slate-900">Repair Tickets</h3>
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-y border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Ticket</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Device</th>
                      <th className="py-3 px-4">Issue</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {repairList.map(ticket => (
                      <tr key={ticket.id}>
                        <td className="py-3 px-4 font-mono">{ticket.ticketNumber}</td>
                        <td className="py-3 px-4">User #{ticket.userId}</td>
                        <td className="py-3 px-4">{ticket.deviceType}</td>
                        <td className="py-3 px-4">{ticket.issueDescription}</td>
                        <td className="py-3 px-4">
                          <select
                            value={ticket.status}
                            onChange={event => handleRepairStatusChange(ticket.id, event.target.value)}
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1"
                          >
                            {['PENDING', 'TECHNICIAN_ASSIGNED', 'IN_INSPECTION', 'WAITING_FOR_PARTS', 'REPAIRED', 'CLOSED'].map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* SELLER / AGENT VIEW */}
      {/* ============================================================== */}
      {dashboardRole === 'AGENT' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
              <div className="text-2xl font-black text-slate-900 mt-1">{products.length}</div>
              <span className="text-[10px] text-slate-500 font-medium">Active components</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Value</span>
              <div className="text-2xl font-black text-slate-900 mt-1">₹{products.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.stock || 0), 0).toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Instant cash pool</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Verification</span>
              <div className="text-2xl font-black text-amber-600 mt-1">{resellList.filter(request => request.status === 'UNDER_REVIEW').length + repairList.filter(ticket => ticket.status === 'PENDING').length}</div>
              <span className="text-[10px] text-slate-500 font-medium">Diagnostic queue</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Sales</span>
              <div className="text-2xl font-black text-emerald-600 mt-1">{resellList.filter(request => request.status === 'COMPLETED').length}</div>
              <span className="text-[10px] text-emerald-600 font-medium">Paid out</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900">Database Order Revenue</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData.map(({ month, revenue }) => ({ name: month, sales: revenue }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} tickLine={false} />
                  <Tooltip formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Sales Payout']} />
                  <Bar dataKey="sales" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD NEW PRODUCT */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-400" /> Add New Hardware Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gigabyte GeForce RTX 4070 Ti Super 16GB"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="Graphics Cards">Graphics Cards</option>
                    <option value="CPUs">CPUs</option>
                    <option value="RAM">RAM</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="Storage">Storage</option>
                    <option value="Cabinets">Cabinets</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="PC Builds">PC Builds</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NVIDIA, AMD, ASUS"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={productForm.conditionType}
                    onChange={(e) => setProductForm({ ...productForm, conditionType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="49999"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="58999"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Warranty Info</label>
                  <input
                    type="text"
                    value={productForm.warrantyInfo}
                    onChange={(e) => setProductForm({ ...productForm, warrantyInfo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              {/* Product Artwork Illustration Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Illustration Asset</label>
                <select
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                >
                  {availableImages.map((img, i) => (
                    <option key={i} value={img.url}>{img.label} ({img.url.split('/').pop()})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Technical highlights, performance specs, VRM cooling..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT PRODUCT */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 px-6 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" /> Edit Product: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="Graphics Cards">Graphics Cards</option>
                    <option value="CPUs">CPUs</option>
                    <option value="RAM">RAM</option>
                    <option value="Motherboards">Motherboards</option>
                    <option value="Storage">Storage</option>
                    <option value="Cabinets">Cabinets</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="PC Builds">PC Builds</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition</label>
                  <select
                    value={editingProduct.conditionType}
                    onChange={(e) => setEditingProduct({ ...editingProduct, conditionType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                    <option value="Refurbished">Refurbished</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Artwork Illustration</label>
                <select
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 font-medium"
                >
                  {availableImages.map((img, i) => (
                    <option key={i} value={img.url}>{img.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: CONFIRM DELETE PRODUCT (Safe Cascade Delete) */}
      {/* ============================================================== */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Confirm Product Deletion</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to remove this product? It will be safely unlinked from active cart sessions and catalog listings.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
