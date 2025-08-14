import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Chrome } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    // Adiciona o redirectTo aqui
    await signInWithGoogle({
      redirectTo: 'https://runbro-squads.lovable.app'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black">
            Entre na <span className="gradient-text">Elite</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center gap-3 h-12"
            variant="outline"
          >
            <Chrome className="h-5 w-5" />
            Continuar com Google
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            Junte-se à comunidade de corredores urbanos
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
