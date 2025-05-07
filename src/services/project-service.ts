import axios from 'axios';
import { API } from '../config/api';
import { getAuthHeaders, isUsingRealBackend } from './backend-auth-service';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Project {
  id: string;
  title: string;
  description?: string;
  content: string;
  platform?: string;
  status?: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  category?: string;
  tags?: string[];
  generatedWith?: string;
}

export interface ProjectFilter {
  status?: string;
  platform?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
}

// Mock projects data for development
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Instagram Campaign for Summer',
    description: 'Summer promotion campaign for our product line',
    content: 'Summer is here! Check out our latest product line with special discounts for the season. #summer #deals',
    platform: 'instagram',
    status: 'published',
    createdAt: '2023-06-10T12:00:00Z',
    updatedAt: '2023-06-15T14:30:00Z',
    category: 'promotion',
    tags: ['summer', 'sale', 'promotion'],
    generatedWith: 'openai/gpt-3.5-turbo'
  },
  {
    id: '2',
    title: 'LinkedIn Article on Industry Trends',
    description: 'Analysis of current industry trends',
    content: 'Recent studies show that 76% of companies are adopting AI technologies for content creation. Our analysis indicates that this trend will continue to grow in the next five years.',
    platform: 'linkedin',
    status: 'draft',
    createdAt: '2023-07-05T09:15:00Z',
    updatedAt: '2023-07-05T09:15:00Z',
    category: 'article',
    tags: ['industry', 'trends', 'analysis'],
    generatedWith: 'anthropic/claude-2'
  }
];

// Get all projects with optional filters
export const getProjects = async (filters: ProjectFilter = {}) => {
  // If not using real backend, return mock data
  if (!isUsingRealBackend()) {
    let filteredProjects = [...MOCK_PROJECTS];
    
    // Apply filters
    if (filters.status) {
      filteredProjects = filteredProjects.filter(p => p.status === filters.status);
    }
    
    if (filters.platform) {
      filteredProjects = filteredProjects.filter(p => p.platform === filters.platform);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        (p.description && p.description.toLowerCase().includes(searchLower)) ||
        p.content.toLowerCase().includes(searchLower)
      );
    }
    
    return {
      data: filteredProjects,
      page: filters.page || 1,
      limit: filters.limit || 10,
      total: filteredProjects.length
    };
  }

  try {
    // Build query params
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.platform) queryParams.append('platform', filters.platform);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    
    const url = `${API.projects.getAll}?${queryParams.toString()}`;
    
    const response = await axios.get(url, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('Get projects error:', error);
    throw error;
  }
};

// Get a specific project
export const getProject = async (id: string): Promise<Project> => {
  // If not using real backend, return mock data
  if (!isUsingRealBackend()) {
    const project = MOCK_PROJECTS.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  try {
    const response = await axios.get(API.projects.getOne(id), {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Get project error:', error);
    throw error;
  }
};

// Create new project
export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  // If not using real backend, create mock project
  if (!isUsingRealBackend()) {
    const newProject: Project = {
      id: uuidv4(),
      title: projectData.title || 'Untitled Project',
      description: projectData.description || '',
      content: projectData.content || '',
      platform: projectData.platform,
      status: projectData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      category: projectData.category,
      tags: projectData.tags,
      generatedWith: projectData.generatedWith
    };
    
    MOCK_PROJECTS.push(newProject);
    return newProject;
  }

  try {
    const response = await axios.post(API.projects.create, projectData, {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Create project error:', error);
    throw error;
  }
};

// Update project
export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  // If not using real backend, update mock project
  if (!isUsingRealBackend()) {
    const index = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const updatedProject = {
      ...MOCK_PROJECTS[index],
      ...projectData,
      updatedAt: new Date().toISOString()
    };
    
    MOCK_PROJECTS[index] = updatedProject;
    return updatedProject;
  }

  try {
    const response = await axios.put(API.projects.update(id), projectData, {
      headers: getAuthHeaders()
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Update project error:', error);
    throw error;
  }
};

// Delete project
export const deleteProject = async (id: string): Promise<{ success: boolean; message?: string }> => {
  // If not using real backend, delete mock project
  if (!isUsingRealBackend()) {
    const index = MOCK_PROJECTS.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    MOCK_PROJECTS.splice(index, 1);
    return { success: true };
  }

  try {
    const response = await axios.delete(API.projects.delete(id), {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('Delete project error:', error);
    throw error;
  }
};