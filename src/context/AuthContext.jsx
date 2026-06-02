import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/auth';
import { getProfile } from '../api/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('orvix_token'));
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await getProfile();
      const userData = res.data?.data || res.data;
      setUser(userData);
      localStorage.setItem('orvix_user', JSON.stringify(userData));
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem('orvix_token');
      localStorage.removeItem('orvix_user');
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (credentials) => {
    const res = await apiLogin({
      email: credentials.email?.trim().toLowerCase(),
      password: credentials.password,
    });
    const data = res.data?.data || res.data;
    const newToken = data.token;
    localStorage.setItem('orvix_token', newToken);
    setToken(newToken);
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('orvix_user', JSON.stringify(data.user));
    }
    await fetchProfile();
    return res;
  };

  const register = async (userData) => {
    const res = await apiRegister({
      ...userData,
      email: userData.email?.trim().toLowerCase(),
      name: userData.name?.trim(),
    });
    return res;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('orvix_token');
    localStorage.removeItem('orvix_user');
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      refreshProfile,
      isAuthenticated: !!token && !!user,
      isSeller: user?.isSeller || false,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
