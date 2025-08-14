import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin, User } from "lucide-react";
import { Squad, useJoinSquad, useUserSquadStatus } from "@/hooks/useSquads";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface SquadCardProps {
  squad: Squad;
}

export function SquadCard({ squad }: SquadCardProps) {
  const { user } = useAuth();
  const joinSquadMutation = useJoinSquad();
  const { data: userStatus } = useUserSquadStatus(squad.id);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);

  const handleJoinSquad = () => {
    if (!user) return;
    joinSquadMutation.mutate(squad.id);
  };

  const getButtonText = () => {
    if (!user) return "Fazer Login";
    if (userStatus?.status === 'pending') return "Solicitação Pendente";
    if (userStatus?.status === 'approved') return "Membro";
    if (userStatus?.status === 'rejected') return "Solicitação Rejeitada";
    return "Pedir para Entrar";
  };

  const getButtonVariant = () => {
    if (!user) return "outline";
    if (userStatus?.status === 'approved') return "secondary";
    if (userStatus?.status === 'pending') return "outline";
    return "hero";
  };

  const isButtonDisabled = () => {
    return !user || userStatus?.status === 'pending' || userStatus?.status === 'approved' || joinSquadMutation.isPending;
  };

  return (
    <article className="glass rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="h-28 bg-gradient-to-r from-primary/40 to-accent/40 relative">
        {squad.admin_id === user?.id && (
          <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
            ADMIN
          </Badge>
        )}
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <h3 className="font-semibold text-lg">{squad.name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {squad.cidade}
          </div>
        </div>

        {squad.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {squad.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
          <div className="rounded-md bg-secondary/60 p-2 text-center flex items-center justify-center gap-1">
            <Users className="h-3 w-3" />
            {squad.member_count || 0}/{squad.max_members}
          </div>
          <div className="rounded-md bg-secondary/60 p-2 text-center flex items-center justify-center gap-1">
            <Clock className="h-3 w-3" />
            {squad.ritmo_min}-{squad.ritmo_max}
          </div>
        </div>

        {/* Members preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Membros:</span>
            {squad.members && squad.members.length > 0 && (
              <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                    Ver todos
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Membros do {squad.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {squad.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.profiles.avatar_url} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{member.profiles.full_name || member.profiles.username}</p>
                          <p className="text-sm text-muted-foreground">@{member.profiles.username}</p>
                        </div>
                        {member.user_id === squad.admin_id && (
                          <Badge variant="secondary" className="text-xs">ADMIN</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="flex -space-x-2">
            {squad.members?.slice(0, 4).map((member) => (
              <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={member.profiles.avatar_url} />
                <AvatarFallback className="text-xs">
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
            ))}
            {(squad.member_count || 0) > 4 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs">+{(squad.member_count || 0) - 4}</span>
              </div>
            )}
          </div>
        </div>

        <Button 
          variant={getButtonVariant() as any}
          size="sm" 
          className="w-full"
          onClick={handleJoinSquad}
          disabled={isButtonDisabled()}
        >
          {getButtonText()}
        </Button>
      </div>
    </article>
  );
}