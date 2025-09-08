import { useQuery } from "@tanstack/react-query";
import { getBranddealById, BubbleThing, BrandDeal } from "@/services/bubbleAPI";

/**
 * Hook to fetch a single brand deal by ID using React Query
 * Provides caching, loading states, and error handling
 */
export function useBranddeal(brandDealId: string | undefined) {
  return useQuery({
    queryKey: ['branddeal', brandDealId],
    queryFn: () => {
      if (!brandDealId) {
        throw new Error('Brand deal ID is required');
      }
      return getBranddealById(brandDealId);
    },
    enabled: !!brandDealId,
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    retry: 2, // Retry failed requests up to 2 times
  });
}

export default useBranddeal;