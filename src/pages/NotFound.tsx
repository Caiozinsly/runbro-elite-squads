import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-black mb-4 gradient-text">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Oops! Página não encontrada.</p>
        <Link to="/" className="inline-flex items-center justify-center rounded-md border border-primary/30 px-5 h-11 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-neon transition-all">
          Voltar ao Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
