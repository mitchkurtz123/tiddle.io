// hooks/useBrandContact.ts
import { getBrandContactById, BubbleThing, BrandContact } from "../services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

export function useBrandContact(contactId: string | undefined) {
  return useApiQuery<BubbleThing & BrandContact>(
    ["brandContact", contactId],
    () => {
      if (!contactId) {
        throw new Error("Contact ID is required");
      }
      return getBrandContactById(contactId);
    },
    {
      enabled: !!contactId,
      config: {
        staleTime: 5 * 60 * 1000, // 5 minutes - contact data doesn't change often
        refetchOnWindowFocus: false,
      },
    }
  );
}