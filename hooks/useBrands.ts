// hooks/useBrands.ts
import { useQuery } from "@tanstack/react-query";
import { listBrandsSimple } from "../services/bubbleAPI";

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => listBrandsSimple(),
    staleTime: 30_000, // 30 seconds - consistent with useUsers
  });
}