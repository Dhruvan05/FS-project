import React, { createContext, useState, useEffect } from 'react';
import { api } from '../services/mockApi'; // Corrected import path

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('rbac_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  // This isLoading is now only for the initial page load check (if you add one)
  // not for the login action itself.
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // persist user
    if (user) localStorage.setItem('rbac_user', JSON.stringify(user));
    else localStorage.removeItem('rbac_user');
  }, [user]);

  const login = async (email, password) => {
    // setIsLoading(true); // <-- REMOVED
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.accessToken) {
        api.setToken(res.accessToken);
        setUser(res.user);
        return res;
      }
      throw new Error(res.error || 'Login failed');
    } catch (err) {
      throw err; // Re-throw to be caught by Login component
    } 
    // finally {
    //   setIsLoading(false); // <-- REMOVED
    // }
  };

  const logout = () => {
    api.setToken(null);
    setUser(null);
  };

  const can = (action, resource = {}) => {
    if (!user) return false;
    const perms = {
      // Corrected keys to match server data ('Admin', 'Editor', 'Viewer')
      Admin: { 'posts:create': true, 'posts:read': true, 'posts:update': true, 'posts:delete': true, 'admin:manageUsers': true },
      Editor: { 'posts:create': true, 'posts:read': true, 'posts:update': 'own', 'posts:delete': 'own' },
      Viewer: { 'posts:read': true },
    }[user.role] || {};
    const rule = perms[action];
    if (rule === true) return true;
    if (rule === 'own' && resource.authorId) return String(resource.authorId) === String(user.id);
    return false;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

