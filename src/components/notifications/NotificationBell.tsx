import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNotifications } from "@/hooks/useNotifications";
import { useUpdateMemberStatus } from "@/hooks/useSquads";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export const NotificationBell = () => {
  const { data: notifications = [], isLoading } = useNotifications();
  
  if (isLoading || notifications.length === 0) {
    return (
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2 font-semibold border-b">Notificações</div>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationItem = ({ notification }: { notification: any }) => {
  const updateStatusMutation = useUpdateMemberStatus(notification.squad_id);

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatusMutation.mutate({ 
      memberId: notification.id, 
      status: 'approved' 
    });
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateStatusMutation.mutate({ 
      memberId: notification.id, 
      status: 'rejected' 
    });
  };

  return (
    <div className="p-3 border-b last:border-b-0 hover:bg-muted/50">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.requester_avatar_url || ''} />
          <AvatarFallback>{notification.requester_username?.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-1">
          <p className="text-sm">
            <span className="font-medium">{notification.requester_username}</span>
            {' '}quer participar do squad{' '}
            <span className="font-medium">{notification.squad_name}</span>
          </p>
          
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: pt
            })}
          </p>
          
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-6 px-2 text-xs"
              onClick={handleReject}
            >
              Recusar
            </Button>
            <Button 
              size="sm" 
              className="h-6 px-2 text-xs"
              onClick={handleApprove}
            >
              Aprovar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};