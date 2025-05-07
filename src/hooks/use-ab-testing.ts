import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import abTestingService, {
  ABTest,
  CreateABTestPayload,
  UpdateABTestPayload,
  RecordMetricPayload
} from '@/services/ab-testing-service';

export function useABTests() {
  return useQuery({
    queryKey: ['abTests'],
    queryFn: () => abTestingService.getTests(),
  });
}

export function useABTest(id: number) {
  return useQuery({
    queryKey: ['abTest', id],
    queryFn: () => abTestingService.getTest(id),
    enabled: !!id,
  });
}

export function useCreateABTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateABTestPayload) => abTestingService.createTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
    },
  });
}

export function useUpdateABTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateABTestPayload) => abTestingService.updateTest(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      queryClient.invalidateQueries({ queryKey: ['abTest', data.id] });
    },
  });
}

export function useDeleteABTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => abTestingService.deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
    },
  });
}

export function useGenerateVariants() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ testId, numVariants }: { testId: number, numVariants: number }) => 
      abTestingService.generateVariants(testId, numVariants),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['abTest', variables.testId] });
    },
  });
}

export function useABTestRecommendation(testId: number) {
  return useQuery({
    queryKey: ['abTestRecommendation', testId],
    queryFn: () => abTestingService.getRecommendation(testId),
    enabled: !!testId,
  });
}

export function useRecordMetric() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RecordMetricPayload) => abTestingService.recordMetric(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['abTest', variables.test_id] });
    },
  });
}

export function useStartTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => abTestingService.startTest(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      queryClient.invalidateQueries({ queryKey: ['abTest', data.id] });
    },
  });
}

export function useCompleteTest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, winnerId }: { id: number, winnerId?: number }) => 
      abTestingService.completeTest(id, winnerId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['abTests'] });
      queryClient.invalidateQueries({ queryKey: ['abTest', data.id] });
    },
  });
}