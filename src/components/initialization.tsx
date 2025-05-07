import { useEffect } from 'react';
import { enableRealBackend } from '@/lib/backend-integration';

/**
 * Component that initializes the backend integration
 * Add this component to your app root to auto-connect to the backend
 */
export function BackendInitialization() {
  useEffect(() => {
    // Check if we should use the real backend
    const useRealBackend = localStorage.getItem('useRealBackend') === 'true';
    
    if (useRealBackend) {
      enableRealBackend();
      console.log('🔄 Connected to OpenRouter backend API');
    } else {
      console.log('🛠️ Using mock services for development');
    }
  }, []);

  return null;
}

/**
 * Set to use real backend (persisted in localStorage)
 */
export function setUseRealBackend(value: boolean) {
  localStorage.setItem('useRealBackend', value ? 'true' : 'false');
  
  // Force reload to apply the change
  window.location.reload();
}