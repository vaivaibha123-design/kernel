import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('kernel_session'));
      return session?.user || null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'

  const authenticate = async (endpoint, credentials) => {
    const result = await apiRequest(`/api/auth/${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    if (!result.user) {
      throw new Error('The server response did not include a user account.');
    }

    const session = { token: result.token, user: result.user };
    localStorage.setItem('kernel_session', JSON.stringify(session));
    setCurrentUser(result.user);
    setAuthModalOpen(false);
  };

  const login = (email, password) => authenticate('signin', { email, password });
  const signup = ({ fullName, email, phone, password }) => authenticate('signup', {
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    password
  });

  const logout = () => {
    localStorage.removeItem('kernel_session');
    setCurrentUser(null);
  };

  const updateProfile = async (data) => {
    if (!currentUser?.id) throw new Error('Sign in to update your profile.');
    const user = await apiRequest(`/api/auth/profile/${currentUser.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    let session = {};
    try {
      session = JSON.parse(localStorage.getItem('kernel_session') || '{}');
    } catch {
      localStorage.removeItem('kernel_session');
    }
    localStorage.setItem('kernel_session', JSON.stringify({ ...session, user }));
    setCurrentUser(user);
    return user;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      signup,
      logout,
      updateProfile,
      authModalOpen,
      setAuthModalOpen,
      authMode,
      setAuthMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
