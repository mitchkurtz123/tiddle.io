import { useQuery } from "@tanstack/react-query";
import { getUserById, BubbleThing, AppUser } from "@/services/bubbleAPI";

/**
 * Hook to fetch a single user by ID using React Query
 * Provides caching, loading states, and error handling
 */
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return getUserById(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Consider user data fresh for 5 minutes
    refetchOnWindowFocus: false, // User data doesn't change often
    retry: 2, // Retry failed requests up to 2 times
  });
}

export default useUser;