import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export interface ApiQueryConfig {
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
}

/**
 * Generic API query hook with common default configurations
 * Reduces boilerplate across individual entity hooks
 */
export function useApiQuery<T>(
  queryKey: (string | number | undefined)[],
  queryFn: () => Promise<T>,
  options: {
    enabled?: boolean;
    config?: ApiQueryConfig;
  } = {}
) {
  const { enabled = true, config = {} } = options;
  
  // Default configurations that can be overridden
  const defaultConfig: ApiQueryConfig = {
    staleTime: 30 * 1000, // 30 seconds default
    refetchOnWindowFocus: true,
    retry: 2,
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  
  return useQuery({
    queryKey: queryKey.filter(Boolean), // Remove undefined values
    queryFn,
    enabled,
    staleTime: finalConfig.staleTime,
    refetchOnWindowFocus: finalConfig.refetchOnWindowFocus,
    retry: finalConfig.retry,
  } as UseQueryOptions<T>);
}