import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import authService, { LoginCredentials, User } from '@/services/auth-service';
import { useEffect } from 'react';

export function useAuth() {
  const queryClient = useQueryClient();
  
  const currentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const login = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
    },
  });

  const logout = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['currentUser'], null);
      queryClient.invalidateQueries();
    },
  });

  const verifyToken = useMutation({
    mutationFn: () => authService.verifyToken(),
    onSuccess: (isValid) => {
      if (!isValid) {
        // If token is invalid, clear it and reset user state
        authService.clearToken();
        queryClient.setQueryData(['currentUser'], null);
      }
    },
  });

  useEffect(() => {
    // Verify token on component mount if we have one
    if (authService.getToken()) {
      verifyToken.mutate();
    }
  }, []);

  return {
    user: currentUser.data,
    isAuthenticated: !!currentUser.data,
    isLoading: currentUser.isLoading || login.isPending || logout.isPending,
    login,
    logout,
  };
}