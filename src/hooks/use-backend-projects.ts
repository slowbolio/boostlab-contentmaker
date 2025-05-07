import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getProjects, 
  getProject, 
  createProject, 
  updateProject, 
  deleteProject,
  Project,
  ProjectFilter
} from '../services/project-service';

// Query hook for fetching all projects from backend
export function useBackendProjects(filters: ProjectFilter = {}) {
  return useQuery(['backend-projects', filters], () => getProjects(filters));
}

// Query hook for fetching a specific project from backend
export function useBackendProject(id: string) {
  return useQuery(['backend-project', id], () => getProject(id), {
    enabled: !!id // Only run query if id exists
  });
}

// Mutation hook for creating a new project in backend
export function useBackendCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (projectData: Partial<Project>) => createProject(projectData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['backend-projects']);
      }
    }
  );
}

// Mutation hook for updating a project in backend
export function useBackendUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Project> }) => updateProject(id, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['backend-projects']);
        queryClient.invalidateQueries(['backend-project', data.id]);
      }
    }
  );
}

// Mutation hook for deleting a project from backend
export function useBackendDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: string) => deleteProject(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['backend-projects']);
      }
    }
  );
}