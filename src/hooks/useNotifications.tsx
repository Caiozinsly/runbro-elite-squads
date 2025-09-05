import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  type: 'join_request';
  squad_id: string;
  squad_name: string;
  requester_username: string;
  requester_avatar_url: string | null;
  created_at: string;
  read: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('squad_members')
        .select(`
          id,
          created_at,
          squad_id,
          squads!inner(nome, admin_id),
          profiles!inner(username, avatar_url)
        `)
        .eq('status', 'pending')
        .eq('squads.admin_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      
      return data.map(item => ({
        id: item.id,
        type: 'join_request' as const,
        squad_id: item.squad_id,
        squad_name: (item.squads as any)?.nome || '',
        requester_username: (item.profiles as any)?.username || '',
        requester_avatar_url: (item.profiles as any)?.avatar_url || null,
        created_at: item.created_at,
        read: false
      })) as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}