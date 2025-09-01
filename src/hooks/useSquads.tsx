import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/components/ui/use-toast';

// Interfaces
export interface Squad extends SquadListItem {} // Alias for compatibility
export interface SquadListItem {
  id: string;
  nome: string;
  cidade: string;
  descricao: string;
  distancia_km: number;
  limite_membros: number;
  periodo_calculado: 'manha' | 'tarde' | 'noite';
  member_count: number;
  capa_url: string | null;
}

export interface SquadDetail {
  id: string;
  admin_id: string;
  nome: string;
  cidade: string;
  descricao: string;
  ponto_partida: string;
  distancia_km: number;
  limite_membros: number;
  horario: string;
  admin_username: string;
  admin_avatar_url: string | null;
  is_public?: boolean;
}

export interface SquadMember {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

// Hook para a página EXPLORAR SQUADS
export function useSquads() {
  return useQuery({
    queryKey: ['squads-list'], 
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_squads_com_detalhes');
      if (error) throw new Error(error.message);
      return data as SquadListItem[];
    },
  });
}

// Hook para a PÁGINA DE DETALHES
export function useSquad(squadId: string) {
  return useQuery({
    queryKey: ['squad', squadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('squads')
        .select(`
          *,
          profiles!squads_admin_id_fkey(username, avatar_url)
        `)
        .eq('id', squadId)
        .single();
      if (error) throw new Error(error.message);
      
      // Transform the data to match SquadDetail interface
      const squad = {
        ...data,
        admin_username: data.profiles?.username || 'Admin',
        admin_avatar_url: data.profiles?.avatar_url || null,
      };
      
      return squad as SquadDetail;
    },
    enabled: !!squadId,
  });
}

// Hook para buscar os MEMBROS APROVADOS de um squad
export function useSquadMembers(squadId: string) {
  return useQuery({
    queryKey: ['squad-members', squadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('squad_members')
        .select(`status, id, profiles(username, full_name, avatar_url)`)
        .eq('squad_id', squadId)
        .eq('status', 'approved');
      if (error) throw new Error(error.message);
      return data as any[];
    },
    enabled: !!squadId,
  });
}

// Hook para o ADMIN buscar TODOS os membros (incluindo pendentes)
export function useSquadAdminMembers(squadId: string) {
  return useQuery({
    queryKey: ['squad-admin-members', squadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('squad_members')
        .select(`id, status, profiles(username, full_name, avatar_url)`)
        .eq('squad_id', squadId);
      if (error) throw new Error(error.message);
      return data as any[];
    },
    enabled: !!squadId,
  });
}

// Hook para PEDIR PARA ENTRAR num squad
export function useJoinSquad() {
  const queryClient = useQueryClient();
  const { user, profile } = useAuth();
  return useMutation({
    mutationFn: async (squadId: string) => {
      if (!user || !profile) throw new Error('Utilizador não autenticado');
      const { error } = await supabase
        .from('squad_members')
        .insert({ squad_id: squadId, user_id: profile.id, status: 'pending' });
      if (error) throw error;
    },
    onSuccess: (_, squadId) => {
      queryClient.invalidateQueries({ queryKey: ['squad-members', squadId] });
      toast({ title: "Solicitação enviada!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

// Hook para o admin ATUALIZAR o status de um membro
export function useUpdateMemberStatus(squadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ memberId, status }: { memberId: string, status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('squad_members')
        .update({ status })
        .eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squad-admin-members', squadId] });
      queryClient.invalidateQueries({ queryKey: ['squad-members', squadId] });
      toast({ title: "Status do membro atualizado!" });
    },
    onError: (error: any) => {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    },
  });
}

// Hook para verificar status do usuário em um squad
export function useUserSquadStatus(squadId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['user-squad-status', squadId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('squad_members')
        .select('*')
        .eq('squad_id', squadId)
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && !!squadId,
  });
}

// Hook para o admin REMOVER um membro
export function useRemoveMember(squadId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from('squad_members')
        .delete()
        .eq('id', memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squad-admin-members', squadId] });
      queryClient.invalidateQueries({ queryKey: ['squad-members', squadId] });
      toast({ title: "Membro removido com sucesso." });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao remover membro", description: error.message, variant: "destructive" });
    },
  });
}