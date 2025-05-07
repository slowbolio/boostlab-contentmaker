/**
 * Backend Integration Utilities
 * This module provides utilities for integrating with the backend API
 */

import { enableRealBackend as enableBackend } from '../services/backend-auth-service';

/**
 * Initializes the application to use the real backend instead of mock data
 * This should be called at application startup when you want to use the real backend
 */
export function enableRealBackend(): void {
  enableBackend();
  console.log("🔗 Connected to real backend API");
}

/**
 * Returns the current authentication token or null if not authenticated
 * Useful for debugging or for external API calls that need the token
 */
export function getCurrentToken(): string | null {
  return localStorage.getItem('token');
}

/**
 * Formats error messages from the backend API
 */
export function formatApiError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

/**
 * Backend API configuration
 */
export const BACKEND_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  OPENROUTER_KEY: import.meta.env.VITE_OPENROUTER_API_KEY,
  DEFAULT_AI_MODEL: 'openai/gpt-3.5-turbo',
  TIMEOUT: 30000, // 30 seconds
};

/**
 * Checks if the backend connection is available
 * Returns a promise that resolves to true if the backend is available, false otherwise
 */
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    return response.ok;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}