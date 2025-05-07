import { useMutation, useQuery } from '@tanstack/react-query';
import { seoService, SEOAnalysisParams, SEOAnalysisResult } from '@/services/seo-service';

export function useSEOAnalysis() {
  const analyzeMutation = useMutation({
    mutationFn: (params: SEOAnalysisParams) => seoService.analyzeSEO(params),
  });

  return {
    analyze: analyzeMutation.mutate,
    analyzeAsync: analyzeMutation.mutateAsync,
    isAnalyzing: analyzeMutation.isPending,
    results: analyzeMutation.data as SEOAnalysisResult | undefined,
    error: analyzeMutation.error,
    reset: analyzeMutation.reset,
  };
}

export function useRealtimeSEOAnalysis(params: SEOAnalysisParams | null) {
  return useQuery({
    queryKey: ['seo-analysis', params],
    queryFn: () => {
      if (!params) return null;
      return seoService.analyzeSEO(params);
    },
    enabled: !!params,
    refetchOnWindowFocus: false,
  });
}