import axios from 'axios';
import { API } from '../config/api';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  roles?: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  name?: string;
}

// Save token to localStorage
export const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

// Get saved token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token on logout
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Create authenticated headers for API calls
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Login user
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(API.auth.login, { username, password });
    if (response.data.token) {
      saveToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await axios.post(API.auth.register, credentials);
    if (response.data.token) {
      saveToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get current user info
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const response = await axios.get(API.auth.me, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    removeToken();
    return null;
  }
};

// Initialize with existing token if available
export const initAuth = () => {
  // Check if we already have a token stored
  const token = localStorage.getItem('token');
  if (token) {
    // Validate the token by making a request to /me endpoint
    getCurrentUser().catch(() => {
      // If token is invalid, remove it
      removeToken();
    });
  }
};

// Set up a flag to track when we're using the real backend
let usingRealBackend = false;

// Function to enable real backend usage
export const enableRealBackend = () => {
  usingRealBackend = true;
};

// Check if we're using the real backend
export const isUsingRealBackend = () => {
  return usingRealBackend;
};