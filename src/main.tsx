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

// Check if the user is accessing the landing page path
const isLandingPath = window.location.pathname === '/landing';

// Always render the React application by default
if (isLandingPath) {
  // Explicit landing page request - redirect to landing page
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