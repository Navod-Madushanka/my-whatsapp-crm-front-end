import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateService, type WhatsAppTemplate } from '../api/templates';

export const useTemplates = () => {
  const queryClient = useQueryClient();

  // 1. Get all templates with polling
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: TemplateService.getTemplates,
    /**
     * In TanStack Query v5, the argument is the Query object.
     * We access the data via query.state.data
     */
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPending = data?.some((t: WhatsAppTemplate) => t.status === 'PENDING');
      
      // Poll every 30 seconds if pending, otherwise disable polling
      return hasPending ? 30000 : false;
    },
  });

  // 2. Create Template Mutation
  const createMutation = useMutation({
    mutationFn: TemplateService.createTemplate,
    onSuccess: () => {
      // Invalidate and refetch to ensure the UI shows the 'PENDING' state immediately
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  // 3. Delete Template Mutation
  const deleteMutation = useMutation({
    mutationFn: TemplateService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    }
  });

  return {
    templates: templates ?? [], // Return empty array as fallback
    isLoading,
    error,
    createTemplate: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    deleteTemplate: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending
  };
};