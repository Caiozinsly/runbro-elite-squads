import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Não precisamos mais deste
import { NavLink } from "react-router-dom";
import { RunnerIcon } from "@/components/icons/RunnerIcon";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { ProfileAvatar } from "@/components/ProfileAvatar"; // NOVO: Importamos nosso novo componente

const navLinks = [
  { to: "/squads", label: "Squads" },
  { to: "/hall", label: "Hall da Fama" },
  { to: "/mural", label: "Mural" },
  { to: "/blog", label: "Blog" },
  { to: "/parceiros", label: "Parceiros" },
];

interface MobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ open, onOpenChange }: MobileMenuProps) {
  // MODIFICADO: Pegamos também 'profile' e 'loading' do hook
  const { user, profile, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  const handleAuthClick = () => {
    // A lógica original para abrir o modal de autenticação estava ótima
    if (!user) {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-80 bg-background/95 backdrop-blur-lg border-l border-muted-foreground/20">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-muted-foreground/20">
              <RunnerIcon className="h-8 w-8 text-primary" />
              <span className="font-display font-black text-xl gradient-text">RunBro</span>
            </div>
            
            {/* User section */}
            <div className="py-6 border-b border-muted-foreground/20">
              {loading ? (
                // NOVO: Adicionamos um estado de carregamento para a UI
                <p className="text-sm text-muted-foreground">Carregando perfil...</p>
              ) : profile ? (
                // MODIFICADO: Usamos 'profile' para a lógica de exibição
                <div className="flex items-center gap-3">
                  {/* MODIFICADO: Substituímos o <Avatar> pelo <ProfileAvatar> */}
                  <ProfileAvatar
                    avatarUrl={profile.avatar_url}
                    userName={profile.full_name}
                    rank={profile.rank}
                  />
                  <div className="flex-1">
                    {/* MODIFICADO: Usamos dados do 'profile' em vez de 'user.user_metadata' */}
                    <p className="font-semibold">{profile.full_name}</p>
                    <p className="text-sm text-muted-foreground capitalize">Membro {profile.rank}</p>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleAuthClick}
                  className="w-full"
                  variant="hero"
                >
                  Entrar na Elite
                </Button>
              )}
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 py-6">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => onOpenChange(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </nav>
            
            {/* Footer */}
            {user && (
              <div className="pt-6 border-t border-muted-foreground/20">
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
