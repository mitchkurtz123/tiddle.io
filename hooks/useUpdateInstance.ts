import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInstance } from "@/services/bubbleAPI";

/**
 * Hook to update an existing instance using React Query mutation
 * Provides proper cache invalidation and loading states
 */
export function useUpdateInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateInstance,
    onSuccess: (data, variables) => {
      console.log('Instance updated successfully, invalidating caches...');
      
      // Invalidate instances queries to refresh the list
      queryClient.invalidateQueries({
        queryKey: ['instances'],
      });
      
      // Invalidate user queries in case user data changed
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      
      // Also invalidate brand deal queries in case user-list was updated
      queryClient.invalidateQueries({
        queryKey: ['branddeal'],
      });
      
      // Invalidate all brand deals queries to refresh main list
      queryClient.invalidateQueries({
        queryKey: ['branddeals'],
      });
      
      console.log('Cache invalidation complete for instance update');
    },
    onError: (error) => {
      console.error('Failed to update instance:', error);
    },
  });
}

export default useUpdateInstance;