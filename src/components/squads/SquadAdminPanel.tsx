import { useSquadAdminMembers, useUpdateMemberStatus, useRemoveMember } from "@/hooks/useSquads";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CompleteSquadChallengeForm } from "@/components/challenges/CompleteSquadChallengeForm";

interface SquadAdminPanelProps {
  squadId: string;
}

export const SquadAdminPanel = ({ squadId }: SquadAdminPanelProps) => {
  const { data: members, isLoading } = useSquadAdminMembers(squadId);
  const updateStatusMutation = useUpdateMemberStatus(squadId);
  const removeMemberMutation = useRemoveMember(squadId);

  const pendingRequests = members?.filter(m => m.status === 'pending') || [];
  const approvedMembers = members?.filter(m => m.status === 'approved') || [];

  if (isLoading) return <div>A carregar painel de admin...</div>;

  const renderMemberList = (memberList: any[], showAdminBadge = false) => {
    return memberList.map(req => {
      if (!req.profiles) return null;

      const isAdmin = req.id.toString().startsWith('admin-');

      return (
        <li key={req.id} className="flex items-center justify-between bg-secondary p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={req.profiles.avatar_url ?? ''} />
              <AvatarFallback>{req.profiles.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{req.profiles.username}</span>
              {isAdmin && <span className="text-xs text-primary font-medium">Admin</span>}
            </div>
          </div>
          {req.status === 'pending' ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => updateStatusMutation.mutate({ memberId: req.id, status: 'rejected' })}>Recusar</Button>
              <Button size="sm" onClick={() => updateStatusMutation.mutate({ memberId: req.id, status: 'approved' })}>Aprovar</Button>
            </div>
          ) : !isAdmin ? (
             <Button size="sm" variant="destructive" onClick={() => removeMemberMutation.mutate(req.id)}>Remover</Button>
          ) : null}
        </li>
      );
    });
  };

  return (
    <div className="mt-8 border-t pt-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Painel de Admin</h2>

      {/* Formulário para completar desafios */}
      <CompleteSquadChallengeForm squadId={squadId} />

      <section>
        <h3 className="text-lg font-semibold">Pedidos Pendentes ({pendingRequests.length})</h3>
        {pendingRequests.length > 0 ? (
          <ul className="space-y-3 mt-3">
            {renderMemberList(pendingRequests)}
          </ul>
        ) : <p className="text-sm text-muted-foreground mt-2">Nenhum pedido pendente.</p>}
      </section>

      <section className="mt-6">
        <h3 className="text-lg font-semibold">Membros Atuais ({approvedMembers.length})</h3>
        {approvedMembers.length > 0 ? (
          <ul className="space-y-3 mt-3">
            {renderMemberList(approvedMembers, true)}
          </ul>
        ) : <p className="text-sm text-muted-foreground mt-2">Nenhum membro aprovado.</p>}
      </section>
    </div>
  );
};