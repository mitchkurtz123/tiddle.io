// hooks/useCreateBranddeal.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBranddeal } from '@/services/bubbleAPI';

interface CreateBranddealData {
  title: string;
  deliverables?: string;
  kabanStatus: string;
  brand: string;
  brandContacts?: string[];
  agency?: string;
}

export function useCreateBranddeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBranddealData) => createBranddeal(data),
    onSuccess: () => {
      // Invalidate and refetch branddeals list
      queryClient.invalidateQueries({ queryKey: ['branddeals'] });
      
      // Also invalidate any related queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brandContacts'] });
      
      console.log('Branddeal created successfully, cache invalidated');
    },
    onError: (error) => {
      console.error('Failed to create branddeal:', error);
    },
  });
}