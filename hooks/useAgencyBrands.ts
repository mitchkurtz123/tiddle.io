// hooks/useAgencyBrands.ts
import { getAgencyBrands, BubbleThing, Brand } from "../services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

/**
 * Hook to fetch all brands managed by an agency
 */
export function useAgencyBrands(agencyId: string | undefined) {
  return useApiQuery<(BubbleThing & Brand)[]>(
    ["agencyBrands", agencyId],
    () => {
      if (!agencyId) {
        throw new Error("Agency ID is required");
      }
      return getAgencyBrands(agencyId);
    },
    {
      enabled: !!agencyId,
      config: {
        staleTime: 2 * 60 * 1000, // 2 minutes - brand relationships change occasionally
        refetchOnWindowFocus: true,
      },
    }
  );
}