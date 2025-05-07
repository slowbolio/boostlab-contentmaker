// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const API = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    me: `${API_URL}/auth/me`
  },
  ai: {
    generate: `${API_URL}/ai/generate`,
    improve: `${API_URL}/ai/improve`,
    shorten: `${API_URL}/ai/shorten`,
    expand: `${API_URL}/ai/expand`,
    generateHeadlines: `${API_URL}/ai/generate-headlines`,
    models: `${API_URL}/ai/models`
  },
  projects: {
    getAll: `${API_URL}/projects`,
    getOne: (id: string) => `${API_URL}/projects/${id}`,
    create: `${API_URL}/projects`,
    update: (id: string) => `${API_URL}/projects/${id}`,
    delete: (id: string) => `${API_URL}/projects/${id}`
  },
  templates: {
    getAll: `${API_URL}/templates`,
    getOne: (id: string) => `${API_URL}/templates/${id}`,
    getByPlatform: (platform: string) => `${API_URL}/templates/platform/${platform}`,
    use: (id: string) => `${API_URL}/templates/${id}/use`
  }
};