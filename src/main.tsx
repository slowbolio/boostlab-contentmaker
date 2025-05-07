import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/auth-context';
import { BackendAuthProvider } from './contexts/backend-auth-context';
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Check if the user is accessing the root URL and not authenticated
// For simplicity in development, we'll check for a special case
const isRoot = window.location.pathname === '/';
const isAuthenticated = localStorage.getItem('auth_token') || false;

if (isRoot && !isAuthenticated && !window.location.search.includes('dev=true')) {
  // Redirect to landing page for unauthenticated root access
  window.location.href = '/updated-landing.html';
} else if (window.location.pathname === '/landing') {
  // Explicit landing page request
  window.location.href = '/updated-landing.html';
} else {
  // Render the React application
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="boostlab-theme">
            <AuthProvider>
              <BackendAuthProvider>
                <App />
              </BackendAuthProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}