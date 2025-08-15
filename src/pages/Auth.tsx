import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import SEO from "@/components/common/SEO";

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <SEO title="RunBro: Login" description="Faça login para acessar sua conta RunBro e se juntar aos melhores squads de corrida." />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-4">
              Entre na <span className="gradient-text">Elite</span>
            </h1>
            <p className="text-muted-foreground">
              Conecte-se com os melhores corredores urbanos
            </p>
          </div>
          
          <AuthModal open={true} onOpenChange={() => {}} />
        </div>
      </div>
    </main>
  );
};

export default Auth;