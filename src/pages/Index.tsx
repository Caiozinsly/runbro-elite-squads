import SEO from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-neon.jpg";
import { Users, Trophy, Gift, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
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
          <p className="uppercase tracking-widest text-xs md:text-sm text-muted-foreground mb-4">Plataforma Social de Corrida</p>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            <span className="block">O FUTURO DA CORRIDA</span>
            <span className="block gradient-text">COMEÇA NO SEU SQUAD</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground">
            Conecte-se com corredores, forme Squads urbanos, registre suas corridas e evolua em rankings com recompensas reais e NFTs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="hero" asChild>
              <Link to="/squads">Lançar Meu Squad <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/squads">Explorar Squads</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Encontre seu Squad",
              Icon: Users,
              desc: "Descubra grupos por cidade, ritmo e dias de treino.",
            },
            { title: "Conquiste NFTs Únicos", Icon: Trophy, desc: "Desbloqueie troféus digitais colecionáveis." },
            { title: "Ganhe Prêmios Reais", Icon: Gift, desc: "Benefícios e brindes de parceiros oficiais." },
          ].map(({ title, Icon, desc }) => (
            <article key={title} className="glass shadow-card rounded-xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-neon">
              <Icon className="text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-black mb-8">Como Funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: 1, title: "Crie ou Junte-se a um Squad", desc: "Monte sua equipe ou entre em uma existente." },
            { step: 2, title: "Registe suas Corridas", desc: "Registre treinos e provas com facilidade." },
            { step: 3, title: "Suba no Ranking e Ganhe", desc: "Progrida e conquiste recompensas." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-xl border border-border p-6">
              <div className="text-sm text-muted-foreground">Passo {step}</div>
              <div className="mt-2 font-semibold">{title}</div>
              <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Parceiros */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <p className="uppercase tracking-widest text-xs md:text-sm text-muted-foreground text-center mb-6">Impulsionado por Gigantes</p>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center opacity-80">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-10 md:h-12 rounded-md bg-secondary/60 border border-border flex items-center justify-center text-xs text-muted-foreground">
              LOGO
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
