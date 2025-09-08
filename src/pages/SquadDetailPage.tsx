import { useParams } from "react-router-dom";
import { useSquad, useSquadMembers, useJoinSquad, useUserSquadStatus } from "@/hooks/useSquads";
import { useSquadChallengeCompletions } from "@/hooks/useChallenges";
import SEO from "@/components/common/SEO";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { SquadAdminPanel } from "@/components/squads/SquadAdminPanel";
import { ChallengeCompletionCard } from "@/components/challenges/ChallengeCompletionCard";
import { Lock, Users, MapPin, Clock, Route, Trophy } from "lucide-react";

const SquadDetailPage = () => {
  const { squadId } = useParams<{ squadId: string }>();
  const { user } = useAuth();

  const { data: squad, isLoading: isLoadingSquad, error: squadError } = useSquad(squadId!);
  const { data: members, isLoading: isLoadingMembers } = useSquadMembers(squadId!);
  const { data: userStatus } = useUserSquadStatus(squadId!);
  const { data: challengeCompletions, isLoading: isLoadingCompletions } = useSquadChallengeCompletions(squadId!);
  const { mutate: joinSquad, isPending: isJoining } = useJoinSquad();

  const isAdmin = user?.id === squad?.admin_id;
  const isMember = userStatus?.status === 'approved';
  const isPublic = squad?.is_public;

  if (isLoadingSquad) {
    return <div className="text-center py-10">A carregar squad...</div>;
  }

  if (squadError) {
    return <div className="text-center py-10 text-destructive">Erro: {squadError.message}</div>;
  }

  if (!squad) {
    return <div className="text-center py-10">Squad não encontrado.</div>;
  }

  // Check access permissions
  const canViewDetails = isPublic || isAdmin || isMember;

  if (!canViewDetails) {
    return (
      <main className="container mx-auto px-4 py-10">
        <SEO title={squad.nome} description="Squad privado - RunBro" />
        
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-8">
              <Lock className="h-16 w-16 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black">{squad.nome}</h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <MapPin className="h-4 w-4" />
              {squad.cidade}
            </p>
          </div>

          <Alert className="max-w-md mx-auto">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Este squad é privado. Apenas membros aprovados podem ver os detalhes.
            </AlertDescription>
          </Alert>

          {user && !userStatus && (
            <Button onClick={() => joinSquad(squad.id)} disabled={isJoining}>
              {isJoining ? 'A enviar pedido...' : 'Pedir para Entrar'}
            </Button>
          )}

          {userStatus?.status === 'pending' && (
            <Badge variant="outline">Solicitação Pendente</Badge>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title={squad.nome} description={squad.descricao} />

      {/* Header da Página */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-black">{squad.nome}</h1>
          {!isPublic && (
            <Badge variant="secondary">
              <Lock className="h-3 w-3 mr-1" />
              Privado
            </Badge>
          )}
        </div>
        <p className="text-lg text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {squad.cidade}
        </p>
        <div className="mt-2 text-sm text-muted-foreground">
          Criado por: {squad.admin_username}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Sobre o Squad</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">{squad.descricao}</p>
          </div>

          <div className="glass p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Detalhes</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Ponto de Partida:</span>
                  <span className="ml-2 text-muted-foreground">{squad.ponto_partida}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Route className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Distância:</span>
                  <span className="ml-2 text-muted-foreground">{squad.distancia_km} km</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <span className="font-medium">Horário:</span>
                  <span className="ml-2 text-muted-foreground">{squad.horario}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Desafios Completados */}
          {challengeCompletions && challengeCompletions.length > 0 && (
            <div className="glass p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Desafios Completados
              </h2>
              {isLoadingCompletions ? (
                <p className="text-sm text-muted-foreground">Carregando desafios...</p>
              ) : (
                <div className="space-y-4">
                  {challengeCompletions.map((completion) => (
                    <ChallengeCompletionCard key={completion.id} completion={completion} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        <aside className="space-y-6">
          {!isMember && !isAdmin && (
            <div className="glass p-4 rounded-xl">
              <Button 
                onClick={() => joinSquad(squad.id)} 
                disabled={isJoining || userStatus?.status === 'pending'} 
                className="w-full"
              >
                {isJoining ? 'A enviar pedido...' : 
                 userStatus?.status === 'pending' ? 'Solicitação Pendente' : 
                 'Pedir para Entrar'}
              </Button>
            </div>
          )}

          <div className="glass p-4 rounded-xl">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Membros ({members?.length || 0} / {squad.limite_membros})
            </h3>
            {isLoadingMembers ? (
              <p className="text-sm text-muted-foreground">A carregar membros...</p>
            ) : members && members.length > 0 ? (
              <ul className="space-y-3">
                {members.map(member => (
                  <li key={member.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.profiles.avatar_url ?? ''} />
                      <AvatarFallback>{member.profiles.username?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{member.profiles.username}</span>
                      {member.profiles.full_name && (
                        <p className="text-xs text-muted-foreground">{member.profiles.full_name}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum membro aprovado ainda.</p>
            )}
          </div>
        </aside>
      </div>

      {/* Mostrar o Painel de Admin apenas se o utilizador for o admin */}
      {isAdmin && <SquadAdminPanel squadId={squad.id} />}
    </main>
  );
};

export default SquadDetailPage;