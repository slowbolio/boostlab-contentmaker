import { useMutation, useQuery } from '@tanstack/react-query';
import {
  generateContent,
  improveContent,
  shortenContent,
  expandContent,
  generateHeadlines,
  getModels,
  AIGenerationParams,
  AIModel
} from '../services/ai-service';

// Query hook for fetching available AI models
export function useAIModels() {
  return useQuery<AIModel[]>(['ai-models'], () => getModels());
}

// Mutation hook for generating content
export function useGenerateContent() {
  return useMutation(
    (params: AIGenerationParams) => generateContent(params)
  );
}

// Mutation hook for improving content
export function useImproveContent() {
  return useMutation(
    ({
      content,
      platform,
      tone,
      audience,
      model
    }: {
      content: string;
      platform?: string;
      tone?: string;
      audience?: string;
      model?: string;
    }) => improveContent(content, platform, tone, audience, model)
  );
}

// Mutation hook for shortening content
export function useShortenContent() {
  return useMutation(
    ({
      content,
      platform,
      model
    }: {
      content: string;
      platform?: string;
      model?: string;
    }) => shortenContent(content, platform, model)
  );
}

// Mutation hook for expanding content
export function useExpandContent() {
  return useMutation(
    ({
      content,
      platform,
      tone,
      model
    }: {
      content: string;
      platform?: string;
      tone?: string;
      model?: string;
    }) => expandContent(content, platform, tone, model)
  );
}

// Mutation hook for generating headlines
export function useGenerateHeadlines() {
  return useMutation(
    ({
      content,
      platform,
      tone,
      model
    }: {
      content: string;
      platform?: string;
      tone?: string;
      model?: string;
    }) => generateHeadlines(content, platform, tone, model)
  );
}