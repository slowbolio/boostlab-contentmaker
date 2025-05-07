import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// These types would typically be defined in a separate types file
export interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  title?: string;
  website?: string;
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  language: string;
  reducedMotion: boolean;
  reducedAnimations: boolean;
}

export interface NotificationSettings {
  emailUpdates: boolean;
  projectReminders: boolean;
  teamActivity: boolean;
  contentAlerts: boolean;
  performanceReports: boolean;
  marketingEmails: boolean;
  productUpdates: boolean;
}

export interface IntegrationSettings {
  apiKey?: string;
  openAIApiKey?: string;
  googleAnalyticsId?: string;
  wordpressUrl?: string;
  wordpressUsername?: string;
  wordpressAppPassword?: string;
  enableTwitter: boolean;
  enableFacebook: boolean;
  enableLinkedin: boolean;
}

// Mock initial values for development
const mockUserProfile: UserProfile = {
  name: 'Admin User',
  email: 'admin@example.com',
  bio: '',
  title: 'Content Manager',
  website: '',
};

const mockAppearanceSettings: AppearanceSettings = {
  theme: 'system',
  fontSize: 'medium',
  language: 'en',
  reducedMotion: false,
  reducedAnimations: false,
};

const mockNotificationSettings: NotificationSettings = {
  emailUpdates: true,
  projectReminders: true,
  teamActivity: true,
  contentAlerts: true,
  performanceReports: true,
  marketingEmails: false,
  productUpdates: true,
};

const mockIntegrationSettings: IntegrationSettings = {
  apiKey: '',
  openAIApiKey: '',
  googleAnalyticsId: '',
  wordpressUrl: '',
  wordpressUsername: '',
  wordpressAppPassword: '',
  enableTwitter: false,
  enableFacebook: false,
  enableLinkedin: false,
};

// In a real application, these would be API calls
const getUserProfile = async (): Promise<UserProfile> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockUserProfile;
};

const updateUserProfile = async (profile: UserProfile): Promise<UserProfile> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  // In a real app, this would update the server
  Object.assign(mockUserProfile, profile);
  return mockUserProfile;
};

const getAppearanceSettings = async (): Promise<AppearanceSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAppearanceSettings;
};

const updateAppearanceSettings = async (settings: AppearanceSettings): Promise<AppearanceSettings> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  Object.assign(mockAppearanceSettings, settings);
  return mockAppearanceSettings;
};

const getNotificationSettings = async (): Promise<NotificationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockNotificationSettings;
};

const updateNotificationSettings = async (settings: NotificationSettings): Promise<NotificationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  Object.assign(mockNotificationSettings, settings);
  return mockNotificationSettings;
};

const getIntegrationSettings = async (): Promise<IntegrationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIntegrationSettings;
};

const updateIntegrationSettings = async (settings: IntegrationSettings): Promise<IntegrationSettings> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  Object.assign(mockIntegrationSettings, settings);
  return mockIntegrationSettings;
};

export function useUserProfile() {
  const queryClient = useQueryClient();
  
  const profileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });
  
  const updateProfile = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
    },
  });
  
  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile,
  };
}

export function useAppearanceSettings() {
  const queryClient = useQueryClient();
  
  const appearanceQuery = useQuery({
    queryKey: ['appearanceSettings'],
    queryFn: getAppearanceSettings,
  });
  
  const updateAppearance = useMutation({
    mutationFn: updateAppearanceSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['appearanceSettings'], data);
    },
  });
  
  return {
    settings: appearanceQuery.data,
    isLoading: appearanceQuery.isLoading,
    updateAppearance,
  };
}

export function useNotificationSettings() {
  const queryClient = useQueryClient();
  
  const notificationQuery = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
  });
  
  const updateNotifications = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['notificationSettings'], data);
    },
  });
  
  return {
    settings: notificationQuery.data,
    isLoading: notificationQuery.isLoading,
    updateNotifications,
  };
}

export function useIntegrationSettings() {
  const queryClient = useQueryClient();
  
  const integrationQuery = useQuery({
    queryKey: ['integrationSettings'],
    queryFn: getIntegrationSettings,
  });
  
  const updateIntegrations = useMutation({
    mutationFn: updateIntegrationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['integrationSettings'], data);
    },
  });
  
  return {
    settings: integrationQuery.data,
    isLoading: integrationQuery.isLoading,
    updateIntegrations,
  };
}