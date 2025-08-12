import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/squads", label: "Squads" },
  { to: "/hall", label: "Hall da Fama" },
  { to: "/mural", label: "Mural" },
  { to: "/blog", label: "Blog" },
  { to: "/parceiros", label: "Parceiros" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-muted-foreground/20 bg-background/60 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display font-black uppercase tracking-tight text-xl">
          <span className="gradient-text">RunBro</span>
        </Link>
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
        <div className="flex items-center gap-3">
          <Button asChild variant="hero" size="sm">
            <Link to="#entrar">Entrar na Elite</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
