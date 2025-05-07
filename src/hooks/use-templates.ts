import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import templatesService, { ContentTemplate } from '@/services/templates-service';

export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesService.getTemplates(),
  });
}

export function useTemplatesByPlatform(platform: string) {
  return useQuery({
    queryKey: ['templates', 'platform', platform],
    queryFn: () => templatesService.getTemplatesByPlatform(platform),
  });
}

export function useTemplatesByCategory(category: string) {
  return useQuery({
    queryKey: ['templates', 'category', category],
    queryFn: () => templatesService.getTemplatesByCategory(category),
  });
}

export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: ['template', id],
    queryFn: () => templatesService.getTemplateById(id!),
    enabled: !!id,
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<ContentTemplate, 'id' | 'createdAt'>) => 
      templatesService.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<ContentTemplate> }) => 
      templatesService.updateTemplate(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['template', data.id] });
      }
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => templatesService.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });
}