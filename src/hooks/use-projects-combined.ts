import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SavedProject } from '@/services/saved-projects-service';
import savedProjectsService from '@/services/saved-projects-service';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject, 
  ProjectFilter,
  Project
} from '@/services/project-service';
import { isUsingRealBackend } from '@/services/backend-auth-service';

// Hook for creating a new project - works with both mock and real backend
export function useCreateProjectCombined() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => {
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // Use the real backend service
        return createProject(data);
      } else {
        // Use the mock service from saved-projects-service
        return savedProjectsService.createProject(data);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries from both services
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['backend-projects'] });
    },
  });
}

// Hook for getting all projects - works with both mock and real backend
export function useProjectsCombined(filters: ProjectFilter = {}) {
  return useQuery({
    queryKey: ['projects-combined', filters],
    queryFn: async () => {
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // Use the real backend service
        return getProjects(filters);
      } else {
        // Use the mock service
        return savedProjectsService.getProjects();
      }
    }
  });
}

// Hook for getting a specific project - works with both mock and real backend
export function useProjectCombined(id: string | undefined) {
  return useQuery({
    queryKey: ['project-combined', id],
    queryFn: async () => {
      if (!id) return null;
      
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // Use the real backend service
        return getProject(id);
      } else {
        // Use the mock service
        return savedProjectsService.getProjectById(id);
      }
    },
    enabled: !!id // Only run when ID is available
  });
}

// Hook for updating a project - works with both mock and real backend
export function useUpdateProjectCombined() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => {
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // Use the real backend service
        return updateProject(id, data);
      } else {
        // Use the mock service
        return savedProjectsService.updateProject(id, data);
      }
    },
    onSuccess: (data) => {
      // Invalidate relevant queries from both services
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['backend-projects'] });
      
      if (data) {
        const projectId = typeof data === 'object' && 'id' in data ? data.id : undefined;
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['savedProject', projectId] });
          queryClient.invalidateQueries({ queryKey: ['backend-project', projectId] });
          queryClient.invalidateQueries({ queryKey: ['project-combined', projectId] });
        }
      }
    },
  });
}

// Hook for deleting a project - works with both mock and real backend
export function useDeleteProjectCombined() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // Use the real backend service
        return deleteProject(id);
      } else {
        // Use the mock service
        return savedProjectsService.deleteProject(id);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries from both services
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['backend-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-combined'] });
    },
  });
}

// Hook for archiving a project - falls back to update for real backend
export function useArchiveProjectCombined() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // For real backend, we use update to set status to archived
        return updateProject(id, { status: 'archived' });
      } else {
        // Use the mock service's dedicated archive function
        return savedProjectsService.archiveProject(id);
      }
    },
    onSuccess: (data) => {
      // Invalidate relevant queries from both services
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['backend-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-combined'] });
      
      if (data) {
        const projectId = typeof data === 'object' && 'id' in data ? data.id : undefined;
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['savedProject', projectId] });
          queryClient.invalidateQueries({ queryKey: ['backend-project', projectId] });
          queryClient.invalidateQueries({ queryKey: ['project-combined', projectId] });
        }
      }
    },
  });
}

// Hook for publishing a project - falls back to update for real backend
export function usePublishProjectCombined() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      // Check if we're using the real backend
      if (isUsingRealBackend()) {
        // For real backend, we use update to set status to published
        return updateProject(id, { status: 'published' });
      } else {
        // Use the mock service's dedicated publish function
        return savedProjectsService.publishProject(id);
      }
    },
    onSuccess: (data) => {
      // Invalidate relevant queries from both services
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      queryClient.invalidateQueries({ queryKey: ['backend-projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects-combined'] });
      
      if (data) {
        const projectId = typeof data === 'object' && 'id' in data ? data.id : undefined;
        if (projectId) {
          queryClient.invalidateQueries({ queryKey: ['savedProject', projectId] });
          queryClient.invalidateQueries({ queryKey: ['backend-project', projectId] });
          queryClient.invalidateQueries({ queryKey: ['project-combined', projectId] });
        }
      }
    },
  });
}