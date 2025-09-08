import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInstance } from "@/services/bubbleAPI";

/**
 * Hook to create a new instance using React Query mutation
 * Provides proper cache invalidation and loading states
 */
export function useCreateInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInstance,
    onSuccess: (data, variables) => {
      console.log('Instance created successfully, invalidating caches...');
      
      // Invalidate instances queries for this brand deal
      queryClient.invalidateQueries({
        queryKey: ['instances'],
      });
      
      // Also invalidate brand deal queries in case user-list was updated
      queryClient.invalidateQueries({
        queryKey: ['branddeal', variables.branddeal],
      });
      
      // Invalidate all brand deals queries to refresh main list
      queryClient.invalidateQueries({
        queryKey: ['branddeals'],
      });
      
      console.log('Cache invalidation complete');
    },
    onError: (error) => {
      console.error('Failed to create instance:', error);
    },
  });
}

export default useCreateInstance;