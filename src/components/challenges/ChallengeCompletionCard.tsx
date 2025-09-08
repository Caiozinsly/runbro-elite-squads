import { SquadChallengeCompletion } from "@/hooks/useChallenges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Zap, Trophy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChallengeCompletionCardProps {
  completion: SquadChallengeCompletion;
}

export const ChallengeCompletionCard = ({ completion }: ChallengeCompletionCardProps) => {
  const formatTime = (minutos: number) => {
    const hours = Math.floor(minutos / 60);
    const mins = Math.floor(minutos % 60);
    const secs = Math.floor((minutos % 1) * 60);
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const formatPace = (pace: number) => {
    const mins = Math.floor(pace);
    const secs = Math.floor((pace % 1) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}/km`;
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {completion.challenge?.nome}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Concluído {formatDistanceToNow(new Date(completion.completed_at), { 
                addSuffix: true, 
                locale: ptBR 
              })}
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            +{completion.pontos_ganhos} pontos
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {completion.challenge?.descricao && (
          <p className="text-sm text-muted-foreground">{completion.challenge.descricao}</p>
        )}
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Clock className="h-3 w-3" />
              Tempo
            </div>
            <div className="font-semibold text-lg">
              {formatTime(completion.tempo_total_minutos)}
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              Distância
            </div>
            <div className="font-semibold text-lg">
              {completion.km_total.toFixed(1)}km
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              Pace
            </div>
            <div className="font-semibold text-lg">
              {formatPace(completion.pace_medio)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};