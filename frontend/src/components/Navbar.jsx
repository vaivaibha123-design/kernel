import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  ChevronDown, 
  Cpu, 
  Wrench, 
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  Package,
  Layers,
  HardDrive
} from 'lucide-react';
import LogoPlaceholder from './LogoPlaceholder';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ activePage, setActivePage, onOpenSearch, searchQuery, setSearchQuery }) {
  const { currentUser, setAuthModalOpen, setAuthMode, logout } = useAuth();
  const { totalItems } = useCart();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const categories = [
    { name: 'All Categories', icon: Layers },
    { name: 'CPUs', icon: Cpu },
    { name: 'Graphics Cards', icon: Sparkles },
    { name: 'Motherboards', icon: Layers },
    { name: 'RAM', icon: Package },
    { name: 'Storage', icon: HardDrive },
    { name: 'Power Supplies', icon: ShieldCheck },
    { name: 'Cabinets', icon: Package },
    { name: 'PC Builds', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Authentic Hardware
          </span>
          <span className="text-slate-500">|</span>
          <span>Pan-India Free Express Shipping on orders over ₹2,999</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-0.5 rounded text-[11px]">
            <span className="text-slate-400">
              {currentUser ? `Signed in as ${currentUser.role}` : 'Sign in to your account'}
            </span>
          </div>
          <span className="text-slate-500">|</span>
          <button 
            onClick={() => setActivePage('sell')}
            className="text-slate-300 hover:text-white transition-colors"
          >
            Sell or Repair PC
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <LogoPlaceholder onClick={() => setActivePage('home')} />

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for products, brands (RTX 4070, Ryzen, Corsair)..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activePage !== 'catalog') setActivePage('catalog');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
          <button 
            onClick={() => setActivePage('home')}
            className={`transition-colors ${activePage === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            Home
          </button>

          {/* Categories Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onMouseEnter={() => setCategoriesOpen(true)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2"
            >
              Categories
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {categoriesOpen && (
              <div 
                onMouseLeave={() => setCategoriesOpen(false)}
                className="absolute top-full left-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActivePage('catalog');
                      setCategoriesOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                  >
                    <cat.icon className="w-4 h-4 text-slate-400" />
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setActivePage('builder')}
            className={`flex items-center gap-1.5 transition-colors ${activePage === 'builder' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            <Cpu className="w-4 h-4 text-blue-600" />
            <span>PC Builder</span>
          </button>

          <button 
            onClick={() => setActivePage('sell')}
            className={`transition-colors ${activePage === 'sell' ? 'text-blue-600' : 'hover:text-blue-600'}`}
          >
            Sell Hardware
          </button>

          <button 
            onClick={() => setActivePage('catalog')}
            className="text-amber-600 hover:text-amber-700 font-bold transition-colors"
          >
            Deals
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button 
              onClick={() => setActivePage('dashboard')}
              className="px-2.5 py-1 bg-blue-600 text-white text-xs rounded-md font-bold hover:bg-blue-700 shadow-sm transition-all"
            >
              Admin Panel
            </button>
          )}

          {currentUser?.role === 'AGENT' && (
            <button 
              onClick={() => setActivePage('dashboard')}
              className="px-2.5 py-1 bg-indigo-600 text-white text-xs rounded-md font-bold hover:bg-indigo-700 shadow-sm transition-all"
            >
              B2B Portal
            </button>
          )}
        </nav>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <button 
            onClick={() => setActivePage('profile')}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all relative hidden sm:block"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Cart Icon with badge */}
          <button 
            onClick={() => setActivePage('cart')}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-all relative"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account Button & Dropdown */}
          <div className="relative">
            {currentUser ? (
              <button 
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 pr-2 rounded-full hover:bg-slate-100 border border-slate-200 transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {currentUser.fullName ? currentUser.fullName.charAt(0) : 'U'}
                </div>
                <div className="hidden sm:block text-xs font-semibold text-slate-800 leading-tight">
                  <div className="truncate max-w-[90px]">{currentUser.fullName.split(' ')[0]}</div>
                  <div className="text-[10px] text-blue-600 font-bold">{currentUser.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setAuthModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && currentUser && (
              <div 
                onMouseLeave={() => setProfileDropdownOpen(false)}
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs text-slate-700"
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                  <p className="text-slate-500 truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setActivePage('profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium"
                >
                  My Profile & Addresses
                </button>
                <button
                  onClick={() => {
                    setActivePage('orders');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium"
                >
                  My Orders & Tracking
                </button>
                {(currentUser.role === 'ADMIN' || currentUser.role === 'AGENT') && (
                  <button
                    onClick={() => {
                      setActivePage('dashboard');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 font-medium text-blue-600 font-bold"
                  >
                    {currentUser.role === 'ADMIN' ? 'Admin Dashboard' : 'Seller / B2B Dashboard'}
                  </button>
                )}
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 font-medium"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-blue-600 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Input */}
      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (activePage !== 'catalog') setActivePage('catalog');
            }}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 text-sm font-medium">
          <button 
            onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            Home
          </button>
          <button 
            onClick={() => { setActivePage('catalog'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            Browse Products & Deals
          </button>
          <button 
            onClick={() => { setActivePage('builder'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-blue-600 text-blue-600 font-bold"
          >
            PC Builder
          </button>
          <button 
            onClick={() => { setActivePage('sell'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            Sell / Repair Hardware
          </button>
          <button 
            onClick={() => { setActivePage('orders'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            My Orders
          </button>
          <button 
            onClick={() => { setActivePage('profile'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 hover:text-blue-600"
          >
            Profile & Addresses
          </button>
        </div>
      )}
    </header>
  );
}
