// src/pages/ProfilePage.tsx

import SEO from "@/components/common/SEO";
import { useAuth } from "@/hooks/useAuth";
// A importação do hook problemático foi removida e substituída por esta
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface Squad {
  id: string;
  nome: string;
  cidade: string;
}

const ProfilePage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  
  const [meusSquads, setMeusSquads] = useState<Squad[]>([]);
  const [loadingSquads, setLoadingSquads] = useState(true);

  useEffect(() => {
    const fetchMeusSquads = async () => {
      if (!user) return;

      setLoadingSquads(true);
      const { data, error } = await supabase
        .from('squads')
        .select('id, nome, cidade')
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
      
      <header className="flex items-center space-x-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar_url ?? ''} alt={profile.username} />
          <AvatarFallback>{profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{profile.username}</h1>
          {profile.created_at && (
            <p className="text-muted-foreground">Membro desde: {new Date(profile.created_at).toLocaleDateString()}</p>
          )}
        </div>
      </header>

      {/* Secção de Gamificação */}
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

      {/* Secção Meus Squads */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Meus Squads Criados</h2>
        {loadingSquads ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : meusSquads.length > 0 ? (
          <ul className="space-y-3">
            {meusSquads.map(squad => (
              <li key={squad.id} className="bg-secondary p-4 rounded-lg flex justify-between items-center hover:bg-secondary/80 transition-colors cursor-pointer">
                <div onClick={() => window.location.href = `/squads/${squad.id}`}>
                  <h3 className="font-semibold">{squad.nome}</h3>
                  <p className="text-sm text-muted-foreground">{squad.cidade}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Você ainda não criou nenhum squad.</p>
        )}
      </section>

    </main>
  );
};

export default ProfilePage;