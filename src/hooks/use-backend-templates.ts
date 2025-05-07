import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTemplates,
  getTemplate,
  getTemplatesByPlatform,
  useTemplate as markTemplateAsUsed,
  TemplateFilter
} from '../services/template-service';

// Query hook for fetching all templates
export function useBackendTemplates(filters: TemplateFilter = {}) {
  return useQuery(['backend-templates', filters], () => getTemplates(filters));
}

// Query hook for fetching a specific template
export function useBackendTemplate(id: string) {
  return useQuery(['backend-template', id], () => getTemplate(id), {
    enabled: !!id // Only run query if id exists
  });
}

// Query hook for fetching templates by platform
export function useBackendTemplatesByPlatform(platform: string) {
  return useQuery(['backend-templates', 'platform', platform], () => getTemplatesByPlatform(platform), {
    enabled: !!platform // Only run query if platform exists
  });
}

// Mutation hook for using a template
export function useBackendMarkTemplateAsUsed() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: string) => markTemplateAsUsed(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['backend-templates']);
        queryClient.invalidateQueries(['backend-template', data.id]);
      }
    }
  );
}