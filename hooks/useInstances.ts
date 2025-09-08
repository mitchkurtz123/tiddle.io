import { useQuery } from "@tanstack/react-query";
import { listInstances, BubbleThing, Instance0963 } from "@/services/bubbleAPI";

/**
 * Hook to fetch instances for a brand deal using React Query
 * Takes user IDs from the brand deal's user-list field
 * Provides caching, loading states, and error handling
 */
export function useInstances(userIds: string[] | undefined) {
  return useQuery({
    queryKey: ['instances', userIds],
    queryFn: () => {
      if (!userIds || userIds.length === 0) {
        return Promise.resolve({
          results: [],
          cursor: 0,
          remaining: 0,
          count: 0,
        });
      }
      return listInstances(userIds);
    },
    enabled: true, // Always enabled, handles empty userIds in the function
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    retry: 2, // Retry failed requests up to 2 times
  });
}

export default useInstances;