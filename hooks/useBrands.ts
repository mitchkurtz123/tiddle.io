// hooks/useBrands.ts
import { listBrandsSimple, BubbleThing, Brand } from "../services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

export function useBrands() {
  return useApiQuery<(BubbleThing & Brand)[]>(
    ["brands"],
    () => listBrandsSimple(),
    {
      config: {
        staleTime: 30_000, // 30 seconds - consistent with useUsers
      },
    }
  );
}