import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  login, 
  register, 
  getCurrentUser, 
  removeToken, 
  initAuth, 
  enableRealBackend,
  isUsingRealBackend,
  User,
  RegisterCredentials
} from '../services/backend-auth-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<any>;
  register: (credentials: RegisterCredentials) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  isUsingRealBackend: () => boolean;
  enableRealBackend: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function BackendAuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize authentication
    initAuth();
    
    // Check if user is already logged in
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to load user', error);
        setError('Failed to authenticate user');
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Login function
  const handleLogin = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await login(username, password);
      setUser(data.user);
      return data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await register(credentials);
      setUser(data.user);
      return data;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to register');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!user,
    isUsingRealBackend,
    enableRealBackend
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useBackendAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useBackendAuth must be used within an AuthProvider');
  }
  return context;
}