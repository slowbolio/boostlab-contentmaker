import axios from 'axios';
import { API } from '../config/api';
import { getAuthHeaders, isUsingRealBackend } from './backend-auth-service';

// Types
export interface Template {
  id: string;
  title: string;
  description: string;
  content: string;
  platform: string;
  category: string;
  usageCount: number;
  createdAt: string;
}

export interface TemplateFilter {
  platform?: string;
  category?: string;
  search?: string;
}

// Mock templates for development
const MOCK_TEMPLATES: Template[] = [
  {
    id: '1',
    title: 'Instagram Product Announcement',
    description: 'Template for announcing new products on Instagram',
    content: '🎉 NEW LAUNCH ALERT! 🎉\n\nIntroducing our newest [product]: [brief description].\n\nWhy you'll love it:\n✨ [Benefit 1]\n✨ [Benefit 2]\n✨ [Benefit 3]\n\nAvailable now! Link in bio to shop.\n\n#newproduct #launch #exclusive',
    platform: 'instagram',
    category: 'product',
    usageCount: 42,
    createdAt: '2023-02-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'LinkedIn Company Update',
    description: 'Professional update template for company news',
    content: 'We're excited to announce [company news]!\n\nThis [achievement/update/milestone] represents our commitment to [company value/mission].\n\n[Additional context or details about the news]\n\nWe're grateful to our team and partners who made this possible.\n\nWhat developments are you most excited about in our industry this year?',
    platform: 'linkedin',
    category: 'company',
    usageCount: 28,
    createdAt: '2023-03-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'Twitter Industry Insight',
    description: 'Short insight or statistic with opinion',
    content: 'Did you know: [interesting statistic or fact]\n\nThis shows that [interpretation or insight]\n\nWhat does this mean for [industry/people/businesses]? [Brief opinion]\n\nThoughts? 👇\n\n#[industry] #insights #trends',
    platform: 'twitter',
    category: 'thought-leadership',
    usageCount: 36,
    createdAt: '2023-04-05T09:15:00Z'
  }
];

// Get all templates
export const getTemplates = async (filters: TemplateFilter = {}) => {
  // If not using real backend, use mock data
  if (!isUsingRealBackend()) {
    let filteredTemplates = [...MOCK_TEMPLATES];
    
    // Apply filters
    if (filters.platform) {
      filteredTemplates = filteredTemplates.filter(t => t.platform === filters.platform);
    }
    
    if (filters.category) {
      filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTemplates = filteredTemplates.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        t.description.toLowerCase().includes(searchLower) ||
        t.content.toLowerCase().includes(searchLower)
      );
    }
    
    return filteredTemplates;
  }

  try {
    // Build query params
    const queryParams = new URLSearchParams();
    if (filters.platform) queryParams.append('platform', filters.platform);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.search) queryParams.append('search', filters.search);
    
    const url = `${API.templates.getAll}?${queryParams.toString()}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Get templates error:', error);
    throw error;
  }
};

// Get a specific template
export const getTemplate = async (id: string): Promise<Template> => {
  // If not using real backend, use mock data
  if (!isUsingRealBackend()) {
    const template = MOCK_TEMPLATES.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  try {
    const response = await axios.get(API.templates.getOne(id), {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Get template error:', error);
    throw error;
  }
};

// Get templates for a specific platform
export const getTemplatesByPlatform = async (platform: string): Promise<Template[]> => {
  // If not using real backend, use mock data
  if (!isUsingRealBackend()) {
    return MOCK_TEMPLATES.filter(t => t.platform === platform);
  }

  try {
    const response = await axios.get(API.templates.getByPlatform(platform), {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Get templates by platform error:', error);
    throw error;
  }
};

// Mark a template as used (increase usage counter)
export const useTemplate = async (id: string): Promise<Template> => {
  // If not using real backend, use mock data
  if (!isUsingRealBackend()) {
    const template = MOCK_TEMPLATES.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    
    template.usageCount++;
    return template;
  }

  try {
    const response = await axios.post(API.templates.use(id), {}, {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Template use error:', error);
    throw error;
  }
};