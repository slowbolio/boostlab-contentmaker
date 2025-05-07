import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/auth-context';

interface RequireAuthProps {
  children: React.ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  // If still loading, you might want to show a loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    // If we're in development mode, check a special query param to bypass landing page
    if (import.meta.env.DEV) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('dev') === 'true') {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    }
    
    // In production or without dev param, redirect to landing page
    window.location.href = '/landing.html';
    return null;
  }

  // If authenticated, show children
  return <>{children}</>;
}