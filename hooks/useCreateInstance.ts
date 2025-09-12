import { useMutation } from "@tanstack/react-query";
import { createInstance } from "@/services/bubbleAPI";
import { useCacheInvalidation } from "@/hooks/shared/useCacheInvalidation";

/**
 * Hook to create a new instance using React Query mutation
 * Provides proper cache invalidation and loading states
 */
export function useCreateInstance() {
  const invalidateQueries = useCacheInvalidation();

  return useMutation({
    mutationFn: createInstance,
    onSuccess: (data, variables) => {
      // Use shared cache invalidation pattern
      invalidateQueries.instanceOperation(variables.branddeal);
    },
    onError: (error) => {
      console.error('Failed to create instance:', error);
    },
  });
}

export default useCreateInstance;