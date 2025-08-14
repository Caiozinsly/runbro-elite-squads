import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavLink } from "react-router-dom";
import { RunnerIcon } from "@/components/icons/RunnerIcon";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { useState } from "react";
import { LogOut, User } from "lucide-react";

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
  const { user, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onOpenChange(false);
  };

  const handleAuthClick = () => {
    if (user) {
      handleSignOut();
    } else {
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
              {user ? (
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.user_metadata.avatar_url} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{user.user_metadata.full_name || user.email}</p>
                    <p className="text-sm text-muted-foreground">Membro Elite</p>
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