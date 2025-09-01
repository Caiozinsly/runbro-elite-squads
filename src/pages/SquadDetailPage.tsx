import { useParams } from "react-router-dom";
import { useSquad, useSquadMembers, useJoinSquad } from "@/hooks/useSquads";
import SEO from "@/components/common/SEO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { SquadAdminPanel } from "@/components/squads/SquadAdminPanel";

const SquadDetailPage = () => {
  const { squadId } = useParams<{ squadId: string }>();
  const { user } = useAuth();

  const { data: squad, isLoading: isLoadingSquad, error: squadError } = useSquad(squadId!);
  const { data: members, isLoading: isLoadingMembers } = useSquadMembers(squadId!);
  const { mutate: joinSquad, isPending: isJoining } = useJoinSquad();

  const isAdmin = user?.id === squad?.admin_id;

  if (isLoadingSquad) {
    return <div className="text-center py-10">A carregar squad...</div>;
  }

  if (squadError) {
    return <div className="text-center py-10 text-destructive">Erro: {squadError.message}</div>;
  }

  if (!squad) {
    return <div className="text-center py-10">Squad não encontrado.</div>;
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title={squad.nome} description={squad.descricao} />

      {/* Header da Página */}
      <header className="mb-8">
        <h1 className="text-4xl font-black">{squad.nome}</h1>
        <p className="text-lg text-muted-foreground">{squad.cidade}</p>
        <div className="mt-2 text-sm text-muted-foreground">
          Criado por: {squad.admin_username}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <p className="whitespace-pre-wrap">{squad.descricao}</p>
          <p><strong>Ponto de Partida:</strong> {squad.ponto_partida}</p>
          <p><strong>Distância:</strong> {squad.distancia_km} km</p>
          <p><strong>Horário:</strong> {squad.horario}</p>
        </div>
        
        <aside>
          <Button onClick={() => joinSquad(squad.id)} disabled={isJoining} className="w-full">
            {isJoining ? 'A enviar pedido...' : 'Pedir para Entrar'}
          </Button>
          <h3 className="font-bold mt-6 mb-3">Membros ({members?.length || 0} / {squad.limite_membros})</h3>
          {isLoadingMembers ? (
            <p>A carregar membros...</p>
          ) : (
            <ul className="space-y-3">
              {members?.map(member => (
                <li key={member.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.profiles.avatar_url ?? ''} />
                    <AvatarFallback>{member.profiles.username?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{member.profiles.username}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* Mostrar o Painel de Admin apenas se o utilizador for o admin */}
      {isAdmin && <SquadAdminPanel squadId={squad.id} />}
    </main>
  );
};

export default SquadDetailPage;