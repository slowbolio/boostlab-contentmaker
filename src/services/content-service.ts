import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_WORDPRESS_URL || 'http://localhost:8000/wp-json';
const API_NAMESPACE = 'boostlab/v1';

export interface Content {
  id: number;
  title: string;
  content: string;
  status: 'draft' | 'published';
  author_id: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  category?: string;
  platform?: string;
  meta?: Record<string, any>;
}

export interface CreateContentPayload {
  title: string;
  content: string;
  tags?: string[];
  category?: string;
  platform?: string;
  status?: 'draft' | 'published';
  meta?: Record<string, any>;
}

export interface EnhanceContentPayload {
  content_id?: number;
  content: string;
  enhancement_type: 'improve' | 'expand' | 'summarize' | 'localize';
  options?: {
    tone?: 'professional' | 'casual' | 'friendly' | 'formal';
    target_audience?: string;
    platform?: string;
    language?: string;
    length?: 'short' | 'medium' | 'long';
  };
}

class ContentService {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_NAMESPACE}`;
    this.token = localStorage.getItem('wp_token');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {})
    };
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('wp_token', token);
  }

  async getContents(): Promise<Content[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/contents`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contents:', error);
      throw error;
    }
  }

  async getContent(id: number): Promise<Content> {
    try {
      const response = await axios.get(`${this.baseUrl}/contents/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching content ${id}:`, error);
      throw error;
    }
  }

  async createContent(data: CreateContentPayload): Promise<Content> {
    try {
      const response = await axios.post(`${this.baseUrl}/contents`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  }

  async updateContent(id: number, data: Partial<CreateContentPayload>): Promise<Content> {
    try {
      const response = await axios.put(`${this.baseUrl}/contents/${id}`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating content ${id}:`, error);
      throw error;
    }
  }

  async deleteContent(id: number): Promise<boolean> {
    try {
      await axios.delete(`${this.baseUrl}/contents/${id}`, {
        headers: this.getHeaders()
      });
      return true;
    } catch (error) {
      console.error(`Error deleting content ${id}:`, error);
      throw error;
    }
  }

  async enhanceContent(data: EnhanceContentPayload): Promise<{ enhanced_content: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/contents/enhance`, data, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error enhancing content:', error);
      throw error;
    }
  }

  async generateContent(prompt: string, options?: Record<string, any>): Promise<{ generated_content: string }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/contents/generate`, 
        { prompt, ...options },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  async getContentTemplates(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/contents/templates`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching content templates:', error);
      throw error;
    }
  }
}

export default new ContentService();