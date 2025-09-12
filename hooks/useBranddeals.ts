// hooks/useBranddeals.ts
import { listBranddealsSimple, BubbleThing, BrandDeal } from "../services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

export function useBranddeals(createdByUserId: string | null) {
  return useApiQuery<(BubbleThing & BrandDeal)[]>(
    ["branddeals", createdByUserId],
    () => {
      if (!createdByUserId) {
        throw new Error("User ID is required to fetch branddeals");
      }
      return listBranddealsSimple(createdByUserId);
    },
    {
      enabled: !!createdByUserId, // Only run query if we have a user ID
      config: {
        staleTime: 30_000, // 30 seconds - consistent with useUsers
      },
    }
  );
}