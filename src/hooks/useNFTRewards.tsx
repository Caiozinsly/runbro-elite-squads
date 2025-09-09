import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface NFTReward {
  id: string;
  nome: string;
  descricao?: string;
  imagem_url: string;
  classificacao: 'bronze' | 'prata' | 'ouro' | 'diamante';
  raridade: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserNFTCollection {
  id: string;
  user_id: string;
  nft_reward_id: string;
  squad_id?: string;
  challenge_completion_id?: string;
  conquistado_em: string;
  nft_reward?: NFTReward;
}

export function useNFTRewards() {
  return useQuery({
    queryKey: ['nft-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nft_rewards')
        .select('*')
        .eq('ativo', true)
        .order('classificacao', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as NFTReward[];
    }
  });
}

export function useAllNFTRewards() {
  return useQuery({
    queryKey: ['all-nft-rewards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nft_rewards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as NFTReward[];
    }
  });
}

export function useUserNFTCollection(userId?: string) {
  const { user } = useAuth();
  const targetUserId = userId || user?.id;

  return useQuery({
    queryKey: ['user-nft-collection', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('user_nft_collection')
        .select(`
          *,
          nft_reward:nft_rewards(*)
        `)
        .eq('user_id', targetUserId)
        .order('conquistado_em', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as UserNFTCollection[];
    },
    enabled: !!targetUserId
  });
}

export function useCreateNFTReward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (nft: Omit<NFTReward, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('nft_rewards')
        .insert(nft)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['all-nft-rewards'] });
      toast({ title: "NFT criado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao criar NFT", description: error.message, variant: "destructive" });
    }
  });
}

export function useUpdateNFTReward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NFTReward> & { id: string }) => {
      const { data, error } = await supabase
        .from('nft_rewards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['all-nft-rewards'] });
      toast({ title: "NFT atualizado com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao atualizar NFT", description: error.message, variant: "destructive" });
    }
  });
}

export function useDeleteNFTReward() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (nftId: string) => {
      const { error } = await supabase
        .from('nft_rewards')
        .delete()
        .eq('id', nftId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nft-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['all-nft-rewards'] });
      toast({ title: "NFT excluído com sucesso!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao excluir NFT", description: error.message, variant: "destructive" });
    }
  });
}

export function useSortearNFT() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      user_id: string;
      squad_id: string;
      challenge_completion_id: string;
      distancia_km: number;
    }) => {
      const { data, error } = await supabase.rpc('sortear_nft_recompensa', {
        p_user_id: params.user_id,
        p_squad_id: params.squad_id,
        p_challenge_completion_id: params.challenge_completion_id,
        p_distancia_km: params.distancia_km
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: (nftId, variables) => {
      if (nftId) {
        queryClient.invalidateQueries({ queryKey: ['user-nft-collection', variables.user_id] });
        toast({ title: "🎉 Parabéns! Você ganhou um NFT!" });
      }
    },
    onError: (error: any) => {
      console.error('Erro ao sortear NFT:', error);
    }
  });
}