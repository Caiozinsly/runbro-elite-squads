// src/pages/CreateSquad.tsx
import { CreateSquadForm } from "@/components/squads/CreateSquadForm";
import SEO from "@/components/common/SEO";

const CreateSquadPage = () => {
  return (
    <main>
      <SEO 
        title="RunBro: Crie seu Squad" 
        description="Monte sua equipe, defina suas regras e comece a dominar as ruas. Crie seu squad de corrida agora." 
      />
      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black">Lançar um Novo Squad</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Defina a identidade da sua equipe, estabeleça o ritmo e convide outros corredores para se juntarem à sua jornada.
          </p>
        </header>
        <CreateSquadForm />
      </section>
    </main>
  );
};

export default CreateSquadPage;
