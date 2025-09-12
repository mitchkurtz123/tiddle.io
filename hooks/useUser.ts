import { getUserById, BubbleThing, AppUser } from "@/services/bubbleAPI";
import { useApiQuery } from "@/hooks/shared/useApiQuery";

/**
 * Hook to fetch a single user by ID using React Query
 * Provides caching, loading states, and error handling
 */
export function useUser(userId: string | undefined) {
  return useApiQuery<BubbleThing & AppUser>(
    ['user', userId],
    () => {
      if (!userId) {
        throw new Error('User ID is required');
      }
      return getUserById(userId);
    },
    {
      enabled: !!userId,
      config: {
        staleTime: 5 * 60 * 1000, // Consider user data fresh for 5 minutes
        refetchOnWindowFocus: false, // User data doesn't change often
        retry: 2,
      },
    }
  );
}

export default useUser;