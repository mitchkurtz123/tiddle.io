import { getBranddealById, BubbleThing, BrandDeal } from "@/services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

/**
 * Hook to fetch a single brand deal by ID using React Query
 * Provides caching, loading states, and error handling
 */
export function useBranddeal(brandDealId: string | undefined) {
  return useApiQuery<BubbleThing & BrandDeal>(
    ['branddeal', brandDealId],
    () => {
      if (!brandDealId) {
        throw new Error('Brand deal ID is required');
      }
      return getBranddealById(brandDealId);
    },
    {
      enabled: !!brandDealId,
      config: {
        staleTime: 30 * 1000, // Consider data fresh for 30 seconds
        refetchOnWindowFocus: true,
        retry: 2,
      },
    }
  );
}

export default useBranddeal;