import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Squad {
  id: string;
  name: string;
  cidade: string;
  ritmo_min: string;
  ritmo_max: string;
  dias_treino: number;
  max_members: number;
  description: string;
  image_url?: string;
  admin_id: string;
  member_count?: number;
  members?: SquadMember[];
  user_membership?: SquadMember;
}

export interface SquadMember {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  joined_at: string;
  profiles: {
    username: string;
    full_name: string;
    avatar_url?: string;
  };
}

// Tipagem para os dados do formulário de criação
export interface CreateSquadData {
  name: string;
  cidade: string;
  description: string;
  ritmo_min: string;
  ritmo_max: string;
  dias_treino: number;
  max_members: number;
}

export function useSquads() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['squads', user ? 'auth' : 'anon'],
    queryFn: async () => {
      // If user is not authenticated, avoid joining profiles (blocked by RLS)
      if (!user) {
        const { data, error } = await supabase
          .from('squads')
          .select('*');

        if (error) throw error;

        const squads = data || [];
        // Provide a minimal shape without members to keep UI working
        return squads.map((s: any) => ({ ...s, member_count: 0 })) as Squad[];
      }

      const { data, error } = await supabase
        .from('squads')
        .select(`
          *,
          squad_members!inner(
            id,
            user_id,
            status,
            joined_at,
            profiles!inner(
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('squad_members.status', 'approved');

      if (error) throw error;

      // Group members by squad and add member count
      const squadsWithMembers = data?.reduce((acc: Squad[], item: any) => {
        const existingSquad = acc.find(s => s.id === item.id);
        
        if (existingSquad) {
          existingSquad.members!.push({
            id: item.squad_members.id,
            user_id: item.squad_members.user_id,
            status: item.squad_members.status,
            joined_at: item.squad_members.joined_at,
            profiles: item.squad_members.profiles
          });
        } else {
          const { squad_members, ...squadData } = item;
          acc.push({
            ...squadData,
            members: [{
              id: squad_members.id,
              user_id: squad_members.user_id,
              status: squad_members.status,
              joined_at: squad_members.joined_at,
              profiles: squad_members.profiles
            }],
            member_count: 1
          });
        }
        
        return acc;
      }, []) || [];

      // Update member counts
      squadsWithMembers.forEach(squad => {
        squad.member_count = squad.members?.length || 0;
      });

      return squadsWithMembers;
    },
  });
}

export function useSquadMembers(squadId: string) {
  return useQuery({
    queryKey: ['squad-members', squadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('squad_members')
        .select(`
          *,
          profiles(username, full_name, avatar_url)
        `)
        .eq('squad_id', squadId)
        .eq('status', 'approved');

      if (error) throw error;
      return data;
    },
    enabled: !!squadId,
  });
}

export function useJoinSquad() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (squadId: string) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('squad_members')
        .insert({
          squad_id: squadId,
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      toast({
        title: "Solicitação enviada!",
        description: "Aguarde a aprovação do admin do squad.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao solicitar entrada",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

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

// NOVO: Hook para criar um Squad
export function useCreateSquad() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (squadData: CreateSquadData) => {
      if (!user) throw new Error('Precisa estar autenticado para criar um squad.');

      const { data, error } = await supabase
        .from('squads')
        .insert({
          ...squadData,
          admin_id: user.id,
        })
        .select()
        .single(); // Para retornar o squad recém-criado

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalida a query de squads para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['squads'] });
      toast({
        title: "Squad criado com sucesso!",
        description: "O seu esquadrão está pronto para dominar as ruas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar o squad",
        description: error.message || "Não foi possível criar o squad. Tente novamente.",
        variant: "destructive",
      });
    },
  });
}
