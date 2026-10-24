import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut, 
  Package, 
  Heart, 
  LayoutDashboard, 
  Edit3, 
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api';

export default function ProfilePage({ setActivePage }) {
  const { currentUser, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    addressLine1: currentUser?.addressLine1 || '',
    city: currentUser?.city || '',
    state: currentUser?.state || '',
    postalCode: currentUser?.postalCode || '',
    country: currentUser?.country || ''
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser?.id || !window.confirm('Permanently delete your account and its saved cart, orders, reviews, and service requests?')) return;
    setError('');
    try {
      await apiRequest(`/api/auth/profile/${currentUser.id}`, { method: 'DELETE' });
      logout();
      setActivePage('home');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, action: () => setActivePage('dashboard') },
    { id: 'orders', label: 'My Orders', icon: Package, action: () => setActivePage('orders') },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, action: () => setActivePage('catalog') },
    { id: 'profile', label: 'Profile', icon: User, action: () => setActiveTab('profile') },
    { id: 'addresses', label: 'Addresses', icon: MapPin, action: () => setActiveTab('profile') },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard, action: () => setActiveTab('profile') },
    { id: 'settings', label: 'Settings', icon: Settings, action: () => setActiveTab('profile') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-2xl font-black text-slate-900">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Menu matching design board */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all text-left"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* User Profile Card Header matching design board */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                {formData.fullName ? formData.fullName.charAt(0) : 'V'}
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">{formData.fullName}</h2>
                <p className="text-xs text-slate-500">{formData.email}</p>
                <p className="text-xs text-slate-500">{formData.phone}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-slate-300 hover:border-blue-600 hover:text-blue-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Personal Info Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            {error && <div className="text-sm text-red-700" role="alert">{error}</div>}
            <div className="flex border-b border-slate-100 gap-6 text-xs font-bold">
              <span className="pb-3 border-b-2 border-blue-600 text-blue-600">Personal Info</span>
              <span className="pb-3 text-slate-400 cursor-pointer hover:text-slate-600">Change Password</span>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {[
                ['addressLine1', 'Street Address'],
                ['city', 'City'],
                ['state', 'State'],
                ['postalCode', 'Postal Code']
              ].map(([field, label]) => (
                <div key={field}>
                  <label className="block font-bold text-slate-700 mb-1">{label}</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData[field]}
                    onChange={event => setFormData({ ...formData, [field]: event.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              ))}

              {isEditing && (
                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </form>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="text-xs font-bold text-red-600 hover:text-red-800"
            >
              Delete my account
            </button>
          </div>

          {/* Delivery Addresses Card matching design board */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Delivery Addresses</h3>
            </div>

            <div className="p-4 border border-blue-200 bg-blue-50/40 rounded-xl flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{formData.fullName}</span>
                  <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">Home</span>
                </div>
                <p className="text-slate-600">
                  {formData.addressLine1}, {formData.city} - {formData.postalCode}
                </p>
                <p className="text-slate-500 font-medium">Contact: {formData.phone}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
