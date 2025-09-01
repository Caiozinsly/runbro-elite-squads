// src/pages/Index.tsx (versão final e corrigida)

import SEO from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-neon.jpg";
import { Users, Trophy, Gift, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // O seu hook está perfeito

const Index = () => {
  // ALTERAÇÃO 1: Usamos 'signInWithGoogle' em vez de 'openLoginModal'
  const { user, signInWithGoogle } = useAuth(); 
  const navigate = useNavigate();

  const handleCreateSquadClick = () => {
    if (user) {
      // Se o utilizador existir (estiver logado), navega para a página de criação
      navigate("/squads/criar");
    } else {
      // ALTERAÇÃO 2: Chamamos a função correta com a opção de redirecionamento
      signInWithGoogle({ redirectTo: "/squads/criar" });
    }
  };

  return (
    <main>
      <SEO
        title="RunBro: Forme seu Squad. Domine a Cidade."
        description="Plataforma social e gamificada para corredores urbanos. Crie ou entre em Squads, registre corridas, suba no ranking e ganhe recompensas."
      />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="Fundo futurista neon RunBro" className="absolute inset-0 h-full w-full object-cover opacity-40" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
        <div className="container mx-auto relative px-4 pt-20 pb-24 md:pt-28 md:pb-32">
          {/* ... (resto do seu código do Hero, sem alterações) ... */}
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            <span className="block">O FUTURO DA CORRIDA</span>
            <span className="block gradient-text">COMEÇA NO SEU SQUAD</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            Conecte-se com corredores, forme Squads urbanos, registre suas corridas e evolua em rankings com recompensas reais e NFTs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="hero" onClick={handleCreateSquadClick}>
              Lançar Meu Squad <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" asChild>
              <Link to="/squads">Explorar Squads</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destaques (sem alterações) */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        {/* ... seu código dos destaques ... */}
      </section>

      {/* Como funciona (sem alterações) */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        {/* ... seu código de como funciona ... */}
      </section>

      {/* Parceiros (sem alterações) */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        {/* ... seu código dos parceiros ... */}
      </section>
    </main>
  );
};

export default Index;