/**
 * Dashboard Backend Integration
 * This module provides functions to connect the dashboard to the real backend
 */

import { enableRealBackend } from './backend-integration';
import { API } from '../config/api';
import axios from 'axios';
import { getAuthHeaders } from '../services/backend-auth-service';

// Types for analytics data
export interface DashboardAnalytics {
  totalContent: number;
  activeProjects: number;
  abTests: number;
  aiCredits: number;
  aiCreditsUsed: number; // percentage
  performanceData: PerformanceDataPoint[];
}

export interface PerformanceDataPoint {
  date: string;
  views: number;
  engagement: number;
  conversions: number;
}

export interface RecentActivity {
  type: 'content' | 'project' | 'template';
  action?: string;
  title?: string;
  platform?: string;
  status?: string;
  date: Date;
}

// Initialize dashboard with real backend
export function initializeDashboardBackend() {
  enableRealBackend();
}

// Fetch analytics data from backend
export async function fetchDashboardAnalytics(timeRange: '7' | '14' | '30' = '30'): Promise<DashboardAnalytics> {
  try {
    const response = await axios.get(`${API.auth.login.split('/auth')[0]}/analytics/overview?timeRange=${timeRange}`, {
      headers: getAuthHeaders()
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    // Return mock data as fallback
    return generateMockAnalytics(timeRange);
  }
}

// Fetch recent activity
export async function fetchRecentActivity(): Promise<RecentActivity[]> {
  try {
    const response = await axios.get(`${API.auth.login.split('/auth')[0]}/analytics/recent-activity`, {
      headers: getAuthHeaders()
    });
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch recent activity:', error);
    // Return mock data as fallback
    return generateMockActivity();
  }
}

// Generate mock analytics data as fallback
function generateMockAnalytics(timeRange: '7' | '14' | '30'): DashboardAnalytics {
  const days = parseInt(timeRange);
  const performanceData = generateMockPerformanceData(days);
  
  return {
    totalContent: 156,
    activeProjects: 8,
    abTests: 12,
    aiCredits: 850,
    aiCreditsUsed: 45,
    performanceData
  };
}

// Generate mock performance data
function generateMockPerformanceData(days: number): PerformanceDataPoint[] {
  const data: PerformanceDataPoint[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const viewsBase = Math.floor(Math.random() * 50) + 100;
    const engagementBase = Math.floor(Math.random() * 30) + 40;
    const conversionBase = Math.floor(Math.random() * 10) + 5;
    
    // Add some trend to make the data more realistic
    const trend = 1 + ((days - i) * 0.01);
    
    data.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      views: Math.floor(viewsBase * trend),
      engagement: Math.floor(engagementBase * trend),
      conversions: Math.floor(conversionBase * trend)
    });
  }
  
  return data;
}

// Generate mock activity data
function generateMockActivity(): RecentActivity[] {
  const now = new Date();
  
  return [
    {
      type: 'content',
      action: 'created',
      platform: 'Instagram',
      date: new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      type: 'project',
      title: 'Summer Campaign',
      status: 'active',
      date: new Date(now.getTime() - 4 * 60 * 60 * 1000) // 4 hours ago
    },
    {
      type: 'content',
      action: 'improved',
      platform: 'LinkedIn',
      date: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      type: 'template',
      action: 'used',
      title: 'Product Launch',
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    },
    {
      type: 'project',
      title: 'Website Copy Update',
      status: 'draft',
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ];
}

// Check backend connection
export async function checkDashboardBackendConnection(): Promise<boolean> {
  try {
    const response = await axios.get(`${API.auth.login.split('/auth')[0]}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.error('Backend connection check failed:', error);
    return false;
  }
}