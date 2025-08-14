import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { MobileMenu } from "./MobileMenu";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const navLinks = [
  { to: "/squads", label: "Squads" },
  { to: "/hall", label: "Hall da Fama" },
  { to: "/mural", label: "Mural" },
  { to: "/blog", label: "Blog" },
  { to: "/parceiros", label: "Parceiros" },
];

const Header = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-muted-foreground/20 bg-background/60 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="font-display font-black uppercase tracking-tight text-xl">
            <span className="gradient-text">RunBro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata.avatar_url} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} variant="hero" size="sm">
                Entrar na Elite
              </Button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Header;
