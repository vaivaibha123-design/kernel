import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AiChatWidget from './components/AiChatWidget';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import PcBuilderPage from './pages/PcBuilderPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import SellHardwarePage from './pages/SellHardwarePage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import { apiRequest } from './api';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Home, Layers, ShoppingBag, User as UserIcon } from 'lucide-react';

const formatProduct = (product) => ({
  ...product,
  imageUrl: product.imageUrl || '/src/assets/images/products/rtx-4070-super.svg',
  specsJson: typeof product.specsJson === 'string'
    ? JSON.parse(product.specsJson)
    : product.specsJson
});

function MainApp() {
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState('');
  const [activePage, setActivePage] = useState('home'); // home, catalog, product-detail, builder, cart, checkout, orders, sell, profile, dashboard
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [latestOrder, setLatestOrder] = useState(null);

  const { totalItems } = useCart();
  const { setAuthModalOpen, setAuthMode, currentUser } = useAuth();

  useEffect(() => {
    let cancelled = false;
    apiRequest('/api/products')
      .then(data => {
        if (!cancelled) {
          const productsFromDatabase = data.map(formatProduct);
          setProducts(productsFromDatabase);
          setSelectedProduct(productsFromDatabase[0] || null);
          setProductsError('');
        }
      })
      .catch(error => {
        if (!cancelled) setProductsError(error.message);
      });
    return () => { cancelled = true; };
  }, []);

  // Handler: Add New Product
  const handleAddProduct = async (productData) => {
    try {
      const saved = await apiRequest('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      const formatted = formatProduct(saved);
      setProducts(prev => [formatted, ...prev]);
      return formatted;
    } catch (err) {
      setProductsError(err.message);
      throw err;
    }
  };

  // Handler: Update Existing Product
  const handleUpdateProduct = async (id, updatedData) => {
    try {
      const saved = await apiRequest(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...updatedData,
          specsJson: updatedData.specsJson && typeof updatedData.specsJson !== 'string'
            ? JSON.stringify(updatedData.specsJson)
            : updatedData.specsJson
        })
      });
      const formatted = formatProduct(saved);
      setProducts(prev => prev.map(p => p.id === id ? formatted : p));
      return formatted;
    } catch (err) {
      setProductsError(err.message);
      throw err;
    }
  };

  // Handler: Delete Product (Cascade Safe)
  const handleDeleteProduct = async (id) => {
    try {
      await apiRequest(`/api/products/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      setProductsError(err.message);
      throw err;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-blue-600 selection:text-white pb-14 md:pb-0">
      {/* Top Navbar */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {productsError && (
          <div className="mx-auto mt-4 max-w-7xl px-4 text-sm text-red-700" role="alert">
            Could not load or save database products: {productsError}
          </div>
        )}
        {activePage === 'home' && (
          <HomePage 
            products={products}
            setActivePage={setActivePage}
            setSelectedProduct={setSelectedProduct}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activePage === 'catalog' && (
          <CatalogPage 
            products={products}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedProduct={setSelectedProduct}
            setActivePage={setActivePage}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activePage === 'product-detail' && selectedProduct && (
          <ProductDetailPage 
            product={selectedProduct}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'builder' && (
          <PcBuilderPage 
            products={products}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'cart' && (
          <CartPage 
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'checkout' && !currentUser && (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-700">
            Sign in to continue to checkout.
          </div>
        )}

        {activePage === 'checkout' && currentUser && (
          <CheckoutPage 
            setActivePage={setActivePage}
            setLatestOrder={setLatestOrder}
          />
        )}

        {activePage === 'orders' && !currentUser && (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-700">
            Sign in to view your orders.
          </div>
        )}

        {activePage === 'orders' && currentUser && (
          <OrdersPage 
            latestOrder={latestOrder}
            setActivePage={setActivePage}
            setSelectedProduct={setSelectedProduct}
          />
        )}

        {activePage === 'sell' && (
          <SellHardwarePage 
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'profile' && !currentUser && (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-700">
            Sign in to view and update your account.
          </div>
        )}

        {activePage === 'profile' && currentUser && (
          <ProfilePage 
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'dashboard' && currentUser?.role !== 'ADMIN' && currentUser?.role !== 'AGENT' && (
          <div className="mx-auto max-w-7xl px-4 py-16 text-center text-slate-700">
            An administrator or agent account is required to open the dashboard.
          </div>
        )}

        {activePage === 'dashboard' && (currentUser?.role === 'ADMIN' || currentUser?.role === 'AGENT') && (
          <DashboardPage 
            products={products}
            setActivePage={setActivePage}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>

      {/* Floating Gemini AI Hardware Assistant */}
      <AiChatWidget />

      {/* Sign In & Sign Up Modals */}
      <AuthModal />

      {/* Footer */}
      <Footer setActivePage={setActivePage} />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-40 flex items-center justify-around text-[10px] font-bold text-slate-500 shadow-lg">
        <button
          onClick={() => setActivePage('home')}
          className={`flex flex-col items-center gap-1 ${activePage === 'home' ? 'text-blue-600' : 'hover:text-slate-900'}`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActivePage('catalog')}
          className={`flex flex-col items-center gap-1 ${activePage === 'catalog' ? 'text-blue-600' : 'hover:text-slate-900'}`}
        >
          <Layers className="w-4 h-4" />
          <span>Categories</span>
        </button>

        <button
          onClick={() => setActivePage('cart')}
          className={`flex flex-col items-center gap-1 relative ${activePage === 'cart' ? 'text-blue-600' : 'hover:text-slate-900'}`}
        >
          <ShoppingBag className="w-4 h-4" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px]">
              {totalItems}
            </span>
          )}
          <span>Cart</span>
        </button>

        <button
          onClick={() => {
            if (currentUser) {
              setActivePage('profile');
            } else {
              setAuthMode('signin');
              setAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center gap-1 ${activePage === 'profile' ? 'text-blue-600' : 'hover:text-slate-900'}`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Account</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
