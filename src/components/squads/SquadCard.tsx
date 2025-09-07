// src/components/squads/SquadCard.tsx

import { SquadListItem } from "@/hooks/useSquads";
import { Link } from "react-router-dom";
import { Users, MapPin, Route, Clock, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RunnerIcon } from "@/components/icons/RunnerIcon";

interface SquadCardProps {
  squad: SquadListItem;
}

export const SquadCard = ({ squad }: SquadCardProps) => {
  const memberCount = squad.member_count || 0;
  
  // Formatar horário
  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.slice(0, 5); // "14:30:00" -> "14:30"
  };

  // Se o squad é privado, não renderizar o card clicável
  if (!squad.is_public) {
    return (
      <article className="glass shadow-card rounded-xl p-5 h-full flex flex-col opacity-60 relative">
        <div className="absolute top-3 right-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <h3 className="font-bold text-lg pr-8">{squad.nome}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4" /> {squad.cidade}
        </p>
        
        <div className="flex-1 text-sm text-muted-foreground">
          Squad privado - Use o código de convite para participar
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <Badge variant="secondary" className="text-xs">
            Código: {squad.codigo_convite}
          </Badge>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <Route className="h-3 w-3" /> {squad.distancia_km} km
          </span>
        </div>
      </article>
    );
  }

  return (
    <Link to={`/squads/${squad.id}`} className="block h-full">
      <article className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
        {/* Imagem/Ícone do Squad */}
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center">
          {squad.capa_url ? (
            <img 
              src={squad.capa_url} 
              alt={`Capa do ${squad.nome}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
              <RunnerIcon className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
        
        {/* Conteúdo */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg">{squad.nome}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {squad.cidade}
              </p>
            </div>
            
            {/* Avatar do criador */}
            <Avatar className="h-8 w-8">
              <AvatarImage src={squad.admin_avatar_url || ''} />
              <AvatarFallback className="text-xs">
                {squad.admin_username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 text-sm text-muted-foreground line-clamp-2 mb-3">
            {squad.descricao}
          </div>

          {/* Horário */}
          {squad.horario && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(squad.horario)}</span>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between text-sm font-semibold">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {memberCount} / {squad.limite_membros}
            </span>
            <span className="flex items-center gap-2">
              <Route className="h-4 w-4" /> {squad.distancia_km} km
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};