import SEO from "@/components/common/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link as LinkIcon, Edit, Trash2, Bell } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditProfileForm } from "@/components/profile/EditProfileForm";
import { useDeleteSquad } from "@/hooks/useDeleteSquad";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useNotifications } from "@/hooks/useNotifications";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

interface Squad {
  id: string;
  nome: string;
  cidade: string;
}

const ProfilePage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { data: notifications = [] } = useNotifications();
  const deleteSquadMutation = useDeleteSquad();
  
  const [meusSquads, setMeusSquads] = useState<Squad[]>([]);
  const [loadingSquads, setLoadingSquads] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Lógica para construir o URL de autorização do Strava
  const stravaClientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
  const redirectUri = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/strava-callback`;
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read_all`;

  const handleDeleteSquad = (squadId: string) => {
    deleteSquadMutation.mutate(squadId, {
      onSuccess: () => {
        setMeusSquads(prev => prev.filter(squad => squad.id !== squadId));
      }
    });
  };

  useEffect(() => {
    const fetchMeusSquads = async () => {
      if (!user) return;
      setLoadingSquads(true);
      const { data, error } = await supabase
        .from('squads')
        .select('id, nome, cidade, capa_url')
        .eq('admin_id', user.id);

      if (error) {
        console.error("Erro ao buscar squads do utilizador:", error);
      } else if (data) {
        setMeusSquads(data);
      }
      setLoadingSquads(false);
    };

    if (user) {
      fetchMeusSquads();
    }
  }, [user]);

  if (authLoading) {
    return <div className="text-center py-10">A carregar perfil...</div>;
  }

  if (!profile) {
    return <div className="text-center py-10">Perfil não encontrado.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title={`Perfil de ${profile.username}`} description={`Perfil de ${profile.username} - RunBro`} />
      
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url ?? ''} alt={profile.username} />
              <AvatarFallback>{profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{profile.username}</h1>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Perfil</DialogTitle>
                    </DialogHeader>
                    <EditProfileForm onClose={() => setEditDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              {profile.created_at && (
                <p className="text-muted-foreground">Membro desde: {new Date(profile.created_at).toLocaleDateString()}</p>
              )}
            </div>
        </div>
        
        {/* Botões de ação e notificações */}
        <div className="flex flex-col sm:flex-row items-end gap-3">
          {/* Notificações - só mostra se for admin de algum squad */}
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <span className="text-sm text-muted-foreground">
                {notifications.length} solicitaç{notifications.length === 1 ? 'ão' : 'ões'}
              </span>
            </div>
          )}
          
          {/* Botão de Conexão Strava */}
          <div>
            {profile.strava_athlete_id ? (
              <div className="flex flex-col items-end gap-2">
                <Badge variant="secondary">Conectado ao Strava</Badge>
                <Button asChild variant="outline" size="sm">
                  <Link to="/strava">
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Gerenciar Conexão
                  </Link>
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link to="/strava" className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Conectar com Strava
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Secção de Gamificação (o seu código, sem alterações) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.points || 0}</div>
          <div className="text-sm text-muted-foreground">Pontos</div>
        </div>
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.cards_completados || 0}</div>
          <div className="text-sm text-muted-foreground">Cards Completados</div>
        </div>
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-muted-foreground">XP</div>
        </div>
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="text-2xl font-bold">{profile.km_percorridos} km</div>
          <div className="text-sm text-muted-foreground">Percorridos</div>
        </div>
      </section>

      {/* Secção Meus Squads (o seu código, com a navegação corrigida) */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Meus Squads Criados</h2>
        {loadingSquads ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : meusSquads.length > 0 ? (
          <div className="space-y-3">
            {meusSquads.map(squad => (
              <div key={squad.id} className="bg-secondary p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <Link to={`/squads/${squad.id}`} className="flex-1 hover:opacity-80 transition-opacity">
                    <div className="flex gap-3">
                      {squad.capa_url && (
                        <img 
                          src={squad.capa_url} 
                          alt={`Capa do ${squad.nome}`}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold">{squad.nome}</h3>
                        <p className="text-sm text-muted-foreground">{squad.cidade}</p>
                      </div>
                    </div>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-2">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Deletar Squad</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja deletar o squad "{squad.nome}"? 
                          Esta ação não pode ser desfeita e todos os membros serão removidos.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteSquad(squad.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Deletar Squad
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Você ainda não criou nenhum squad.</p>
        )}
      </section>
    </main>
  );
};

export default ProfilePage;