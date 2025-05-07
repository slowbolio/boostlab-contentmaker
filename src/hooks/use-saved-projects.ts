import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import savedProjectsService, { SavedProject } from '@/services/saved-projects-service';

// Hook för att hämta alla projekt
export function useSavedProjects() {
  return useQuery({
    queryKey: ['savedProjects'],
    queryFn: () => savedProjectsService.getProjects(),
  });
}

// Hook för att hämta projekt efter status
export function useSavedProjectsByStatus(status: SavedProject['status']) {
  return useQuery({
    queryKey: ['savedProjects', 'status', status],
    queryFn: () => savedProjectsService.getProjectsByStatus(status),
  });
}

// Hook för att hämta projekt efter plattform
export function useSavedProjectsByPlatform(platform: string) {
  return useQuery({
    queryKey: ['savedProjects', 'platform', platform],
    queryFn: () => savedProjectsService.getProjectsByPlatform(platform),
  });
}

// Hook för att hämta ett specifikt projekt
export function useSavedProject(id: string | undefined) {
  return useQuery({
    queryKey: ['savedProject', id],
    queryFn: () => savedProjectsService.getProjectById(id!),
    enabled: !!id, // Kör bara när ID är tillgängligt
  });
}

// Hook för att skapa ett nytt projekt
export function useCreateSavedProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Omit<SavedProject, 'id' | 'createdAt' | 'updatedAt'>) => 
      savedProjectsService.createProject(data),
    onSuccess: () => {
      // Invalidera cachade projekt för att uppdatera listor
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
    },
  });
}

// Hook för att uppdatera ett projekt
export function useUpdateSavedProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<SavedProject> }) => 
      savedProjectsService.updateProject(id, data),
    onSuccess: (data) => {
      // Invalidera specifika queries
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['savedProject', data.id] });
      }
    },
  });
}

// Hook för att ta bort ett projekt
export function useDeleteSavedProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => savedProjectsService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
    },
  });
}

// Hook för att arkivera ett projekt
export function useArchiveSavedProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => savedProjectsService.archiveProject(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['savedProject', data.id] });
      }
    },
  });
}

// Hook för att publicera ett projekt
export function usePublishSavedProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => savedProjectsService.publishProject(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['savedProjects'] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['savedProject', data.id] });
      }
    },
  });
}

// Hook för att söka efter projekt
export function useSearchSavedProjects(query: string) {
  return useQuery({
    queryKey: ['savedProjects', 'search', query],
    queryFn: () => savedProjectsService.searchProjects(query),
    enabled: query.length > 0, // Kör bara sökningen när det finns en söksträng
  });
}