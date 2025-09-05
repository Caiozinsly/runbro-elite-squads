import SEO from "@/components/common/SEO";
import { StravaConnectionGuide } from "@/components/strava/StravaConnectionGuide";

const StravaConnectionPage = () => {
  return (
    <main className="container mx-auto px-4 py-10">
      <SEO 
        title="Conectar com Strava" 
        description="Conecte sua conta Strava ao RunBro para sincronizar suas atividades automaticamente"
      />
      
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Conectar com Strava</h1>
          <p className="text-muted-foreground text-lg">
            Sincronize suas atividades automaticamente e acompanhe seu progresso
          </p>
        </header>
        
        <StravaConnectionGuide />
      </div>
    </main>
  );
};

export default StravaConnectionPage;