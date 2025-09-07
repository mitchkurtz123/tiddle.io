// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import { listUsersSimple } from "../services/bubbleAPI";

export function useUsers(limit = 100) {
  return useQuery({
    queryKey: ["users", limit],
    queryFn: () => listUsersSimple(limit),
    staleTime: 30_000,
  });
}
