// hooks/useBranddeals.ts
import { useQuery } from "@tanstack/react-query";
import { listBranddealsSimple } from "../services/bubbleAPI";

export function useBranddeals(createdByUserId: string | null) {
  return useQuery({
    queryKey: ["branddeals", createdByUserId],
    queryFn: () => {
      if (!createdByUserId) {
        throw new Error("User ID is required to fetch branddeals");
      }
      return listBranddealsSimple(createdByUserId);
    },
    staleTime: 30_000, // 30 seconds - consistent with useUsers
    enabled: !!createdByUserId, // Only run query if we have a user ID
  });
}