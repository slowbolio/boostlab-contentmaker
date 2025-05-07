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

// Query hook for fetching all projects
export function useProjects(filters: ProjectFilter = {}) {
  return useQuery(['projects', filters], () => getProjects(filters));
}

// Query hook for fetching a specific project
export function useProject(id: string) {
  return useQuery(['project', id], () => getProject(id), {
    enabled: !!id // Only run query if id exists
  });
}

// Mutation hook for creating a new project
export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (projectData: Partial<Project>) => createProject(projectData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      }
    }
  );
}

// Mutation hook for updating a project
export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, data }: { id: string; data: Partial<Project> }) => updateProject(id, data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['projects']);
        queryClient.invalidateQueries(['project', data.id]);
      }
    }
  );
}

// Mutation hook for deleting a project
export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id: string) => deleteProject(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['projects']);
      }
    }
  );
}