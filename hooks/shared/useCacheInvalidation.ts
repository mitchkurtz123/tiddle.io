import { useQueryClient } from "@tanstack/react-query";

/**
 * Utility hook for common cache invalidation patterns
 * Reduces duplication across mutation hooks
 */
export function useCacheInvalidation() {
  const queryClient = useQueryClient();
  
  // Common invalidation patterns used across the app
  const invalidateQueries = {
    // Invalidate all instances for a specific brand deal
    instances: (brandDealId?: string) => {
      queryClient.invalidateQueries({
        queryKey: brandDealId ? ['instances', brandDealId] : ['instances'],
      });
    },
    
    // Invalidate specific brand deal by ID
    branddeal: (brandDealId: string) => {
      queryClient.invalidateQueries({
        queryKey: ['branddeal', brandDealId],
      });
    },
    
    // Invalidate all brand deals list
    branddeals: () => {
      queryClient.invalidateQueries({
        queryKey: ['branddeals'],
      });
    },
    
    // Invalidate all users
    users: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
    
    // Invalidate specific user by ID
    user: (userId: string) => {
      queryClient.invalidateQueries({
        queryKey: ['user', userId],
      });
    },
    
    // Invalidate all brands
    brands: () => {
      queryClient.invalidateQueries({
        queryKey: ['brands'],
      });
    },
    
    // Common pattern: invalidate all related to an instance operation
    instanceOperation: (brandDealId: string) => {
      console.log('Invalidating caches after instance operation...');
      invalidateQueries.instances(brandDealId);
      invalidateQueries.branddeal(brandDealId);
      invalidateQueries.branddeals();
      console.log('Cache invalidation complete');
    },
  };
  
  return invalidateQueries;
}