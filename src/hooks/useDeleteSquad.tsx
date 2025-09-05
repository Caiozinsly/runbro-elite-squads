import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export function useDeleteSquad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (squadId: string) => {
      const { data, error } = await supabase.rpc('delete_squad', {
        squad_id_param: squadId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['squads-list'] });
      queryClient.invalidateQueries({ queryKey: ['user-squads'] });
      toast({
        title: "Squad deletado",
        description: "O squad foi deletado com sucesso."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao deletar squad",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}