// src/components/squads/SquadCard.tsx

import { SquadListItem } from "@/hooks/useSquads";
import { Link } from "react-router-dom";
import { Users, MapPin, Route } from "lucide-react";

interface SquadCardProps {
  squad: SquadListItem;
}

export const SquadCard = ({ squad }: SquadCardProps) => {
  // Usamos o campo 'member_count' que vem diretamente da nossa função
  const memberCount = squad.member_count || 0;

  return (
    <Link to={`/squads/${squad.id}`} className="block h-full">
      <article className="glass shadow-card rounded-xl p-5 h-full flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-neon">
        <h3 className="font-bold text-lg">{squad.nome}</h3>
        <p className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4" /> {squad.cidade}
        </p>
        
        <div className="flex-1 text-sm text-muted-foreground line-clamp-2">
          {squad.descricao}
        </div>

        <div className="mt-3 flex items-center justify-between text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" /> {memberCount} / {squad.limite_membros}
          </span>
          <span className="flex items-center gap-2">
            <Route className="h-4 w-4" /> {squad.distancia_km} km
          </span>
        </div>
      </article>
    </Link>
  );
};