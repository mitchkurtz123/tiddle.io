import { useMutation } from "@tanstack/react-query";
import { updateInstance } from "@/services/bubbleAPI";
import { useCacheInvalidation } from "@/hooks/shared/useCacheInvalidation";

/**
 * Hook to update an existing instance using React Query mutation
 * Provides proper cache invalidation and loading states
 */
export function useUpdateInstance() {
  const invalidateQueries = useCacheInvalidation();

  return useMutation({
    mutationFn: updateInstance,
    onSuccess: (data, variables) => {
      console.log('Instance updated successfully, invalidating caches...');
      
      // Use shared cache invalidation utilities
      invalidateQueries.instances();
      invalidateQueries.users();
      invalidateQueries.branddeal(variables.instance); // Use instance ID if needed
      invalidateQueries.branddeals();
      
      console.log('Cache invalidation complete for instance update');
    },
    onError: (error) => {
      console.error('Failed to update instance:', error);
    },
  });
}

export default useUpdateInstance;