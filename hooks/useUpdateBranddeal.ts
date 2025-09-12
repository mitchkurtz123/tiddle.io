// hooks/useUpdateBranddeal.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBranddeal } from '@/services/bubbleAPI';

interface UpdateBranddealData {
  branddealId: string;
  title?: string;
  deliverables?: string;
  brand?: string;
  brandContact?: string;
  kabanStatus?: string;
}

export function useUpdateBranddeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBranddealData) => updateBranddeal(data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch branddeals list
      queryClient.invalidateQueries({ queryKey: ['branddeals'] });
      
      // Invalidate the specific branddeal if we have its ID
      if (variables.branddealId) {
        queryClient.invalidateQueries({ queryKey: ['branddeal', variables.branddealId] });
      }
      
      // Also invalidate any related queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      queryClient.invalidateQueries({ queryKey: ['brandContacts'] });
      
      console.log('Branddeal updated successfully, cache invalidated');
    },
    onError: (error) => {
      console.error('Failed to update branddeal:', error);
    },
  });
}