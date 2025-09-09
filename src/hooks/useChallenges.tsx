import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { useSortearNFT } from './useNFTRewards';

export interface Challenge {
  id: string;
  nome: string;
  descricao: string;
  distancia_km: number;
  tempo_limite_minutos: number;
  pontos_recompensa: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface SquadChallengeCompletion {
  id: string;
  squad_id: string;
  challenge_id: string;
  tempo_total_minutos: number;
  km_total: number;
  pace_medio: number;
  pontos_ganhos: number;
  completed_at: string;
  challenge?: Challenge;
}

export function useChallenges() {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('ativo', true)
        .order('distancia_km');
      
      if (error) throw new Error(error.message);
      return data as Challenge[];
    }
  });
}

export function useAllChallenges() {
  return useQuery({
    queryKey: ['all-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as Challenge[];
    }
  });
}

export function useSquadChallengeCompletions(squadId: string) {
  return useQuery({
    queryKey: ['squad-challenge-completions', squadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('squad_challenge_completions')
        .select(`
          *,
          challenge:challenges(nome, descricao, distancia_km, pontos_recompensa)
        `)
        .eq('squad_id', squadId)
        .order('completed_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as SquadChallengeCompletion[];
    },
    enabled: !!squadId
  });
}

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (challenge: Omit<Challenge, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('challenges')
        .insert(challenge)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['all-challenges'] });
      toast({ title: "Desafio criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar desafio", description: error.message, variant: "destructive" });
    }
  });
}

export function useUpdateChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Challenge> & { id: string }) => {
      const { data, error } = await supabase
        .from('challenges')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['all-challenges'] });
      toast({ title: "Desafio atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao atualizar desafio", description: error.message, variant: "destructive" });
    }
  });
}

export function useDeleteChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (challengeId: string) => {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['all-challenges'] });
      toast({ title: "Desafio excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao excluir desafio", description: error.message, variant: "destructive" });
    }
  });
}

export function useCompleteSquadChallenge() {
  const queryClient = useQueryClient();
  const sortearNFT = useSortearNFT();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (completion: {
      squad_id: string;
      challenge_id: string;
      tempo_total_minutos: number;
      km_total: number;
      pace_medio: number;
      pontos_ganhos: number;
    }) => {
      const { data, error } = await supabase
        .from('squad_challenge_completions')
        .insert(completion)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: async (completionData, variables) => {
      queryClient.invalidateQueries({ queryKey: ['squad-challenge-completions', variables.squad_id] });
      
      // Sortear NFT após completar o desafio
      if (user && completionData) {
        try {
          await sortearNFT.mutateAsync({
            user_id: user.id,
            squad_id: variables.squad_id,
            challenge_completion_id: completionData.id,
            distancia_km: variables.km_total
          });
        } catch (error) {
          console.error('Erro ao sortear NFT:', error);
        }
      }
      
      toast({ title: "Desafio completado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao completar desafio", description: error.message, variant: "destructive" });
    }
  });
}