import axios from 'axios';
import { API } from '../config/api';
import { getAuthHeaders } from './backend-auth-service';
import { generateContent as mockGenerateContent } from './ai-generation-service';
import { isUsingRealBackend } from './backend-auth-service';

// Types
export interface AIGenerationParams {
  action: string;
  content: string;
  platform?: string;
  tone?: string;
  audience?: string;
  contentCategory?: string;
  customInstructions?: string;
  model?: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
}

// Generate content with AI
export const generateContent = async (params: AIGenerationParams) => {
  // If not using real backend, use the mock service
  if (!isUsingRealBackend()) {
    return mockGenerateContent(params);
  }

  try {
    const response = await axios.post(API.ai.generate, params, {
      headers: getAuthHeaders()
    });
    
    return response.data;
  } catch (error) {
    console.error('AI generation error:', error);
    throw error;
  }
};

// Get available AI models
export const getModels = async (): Promise<AIModel[]> => {
  // If not using real backend, return mock models
  if (!isUsingRealBackend()) {
    return [
      { id: "openai/gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
      { id: "openai/gpt-4", name: "GPT-4", provider: "OpenAI" },
      { id: "anthropic/claude-2", name: "Claude 2", provider: "Anthropic" },
      { id: "anthropic/claude-instant-1", name: "Claude Instant", provider: "Anthropic" },
      { id: "google/palm", name: "PaLM", provider: "Google" }
    ];
  }

  try {
    const response = await axios.get(API.ai.models, {
      headers: getAuthHeaders()
    });
    
    return response.data.models;
  } catch (error) {
    console.error('Get models error:', error);
    throw error;
  }
};

// Improve content
export const improveContent = async (
  content: string, 
  platform?: string, 
  tone?: string, 
  audience?: string, 
  model?: string
) => {
  try {
    const params: AIGenerationParams = {
      action: 'improve',
      content,
      platform,
      tone,
      audience
    };
    
    // Add specific model if provided
    if (model) {
      params.model = model;
    }
    
    return generateContent(params);
  } catch (error) {
    console.error('AI improve error:', error);
    throw error;
  }
};

// Shorten content
export const shortenContent = async (
  content: string, 
  platform?: string, 
  model?: string
) => {
  try {
    const params: AIGenerationParams = {
      action: 'shorten',
      content,
      platform
    };
    
    if (model) {
      params.model = model;
    }
    
    return generateContent(params);
  } catch (error) {
    console.error('AI shorten error:', error);
    throw error;
  }
};

// Expand content
export const expandContent = async (
  content: string, 
  platform?: string, 
  tone?: string, 
  model?: string
) => {
  try {
    const params: AIGenerationParams = {
      action: 'expand',
      content,
      platform,
      tone
    };
    
    if (model) {
      params.model = model;
    }
    
    return generateContent(params);
  } catch (error) {
    console.error('AI expand error:', error);
    throw error;
  }
};

// Generate headlines
export const generateHeadlines = async (
  content: string, 
  platform?: string, 
  tone?: string, 
  model?: string
) => {
  try {
    const params: AIGenerationParams = {
      action: 'generate-headline',
      content,
      platform,
      tone
    };
    
    if (model) {
      params.model = model;
    }
    
    return generateContent(params);
  } catch (error) {
    console.error('AI headline generation error:', error);
    throw error;
  }
};