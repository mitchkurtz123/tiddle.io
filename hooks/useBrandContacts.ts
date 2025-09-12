// hooks/useBrandContacts.ts
import { listBrandContactsSimple, BubbleThing, BrandContact } from "../services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

export function useBrandContacts(brandId?: string, limit: number = 100, cursor: number = 0) {
  return useApiQuery<(BubbleThing & BrandContact)[]>(
    ["brandContacts", brandId, limit, cursor],
    () => listBrandContactsSimple(limit, cursor, brandId),
    {
      enabled: !!brandId, // Only fetch if we have a brand ID
      config: {
        staleTime: 60_000, // 1 minute - contacts don't change frequently
        refetchOnWindowFocus: false,
      },
    }
  );
}