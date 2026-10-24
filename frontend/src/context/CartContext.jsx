import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser, setAuthModalOpen, setAuthMode } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartError, setCartError] = useState('');
  const [cartLoading, setCartLoading] = useState(false);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setCart([]);
    setCartError('');
    if (currentUser?.id) {
      setCartLoading(true);
      apiRequest(`/api/cart?userId=${currentUser.id}`)
        .then(items => {
          if (!cancelled) {
            setCart(items.map(item => ({ id: item.id, product: item.product, quantity: item.quantity })));
          }
        })
        .catch(error => {
          if (!cancelled) setCartError(error.message);
        })
        .finally(() => {
          if (!cancelled) setCartLoading(false);
        });
    } else {
      setCartLoading(false);
    }
    return () => { cancelled = true; };
  }, [currentUser?.id]);

  const requireUser = () => {
    if (currentUser?.id) return true;
    setAuthMode('signin');
    setAuthModalOpen(true);
    setCartError('Sign in to use your database-backed cart.');
    return false;
  };

  const addToCart = async (product, quantity = 1) => {
    if (!requireUser()) return false;
    try {
      const item = await apiRequest('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ userId: currentUser.id, productId: product.id, quantity })
      });
      setCart(prev => {
        const existing = prev.find(cartItem => cartItem.id === item.id);
        return existing
          ? prev.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: item.quantity } : cartItem)
          : [...prev, { id: item.id, product: item.product, quantity: item.quantity }];
      });
      setCartError('');
      return true;
    } catch (error) {
      setCartError(error.message);
      return false;
    }
  };

  const updateQuantity = async (productId, delta) => {
    if (!requireUser()) return;
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) return;
    const quantity = cartItem.quantity + delta;
    try {
      if (quantity <= 0) {
        await apiRequest(`/api/cart/${cartItem.id}`, { method: 'DELETE' });
        setCart(prev => prev.filter(item => item.id !== cartItem.id));
      } else {
        const item = await apiRequest(`/api/cart/${cartItem.id}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity })
        });
        setCart(prev => prev.map(existing => existing.id === item.id
          ? { ...existing, quantity: item.quantity }
          : existing));
      }
      setCartError('');
    } catch (error) {
      setCartError(error.message);
    }
  };

  const removeFromCart = async (productId) => {
    if (!requireUser()) return;
    const cartItem = cart.find(item => item.product.id === productId);
    if (!cartItem) return;
    try {
      await apiRequest(`/api/cart/${cartItem.id}`, { method: 'DELETE' });
      setCart(prev => prev.filter(item => item.id !== cartItem.id));
      setCartError('');
    } catch (error) {
      setCartError(error.message);
    }
  };

  const clearCart = async () => {
    setCart([]);
    setCartError('');
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cart,
      cartError,
      cartLoading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      cartTotal,
      wishlist,
      toggleWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
