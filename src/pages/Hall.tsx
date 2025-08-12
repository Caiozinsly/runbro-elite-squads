import SEO from "@/components/common/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import trophyImg from "@/assets/trophy-nft.png";

const Hall = () => {
  return (
    <main>
      <SEO title="RunBro: Hall da Fama" description="Rankings de Squads e corredores, conquistas raras e vitrine de troféus NFT. Celebre a elite urbana." />
      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black">Hall da Fama</h1>
        </header>

        <section className="glass rounded-xl p-6 shadow-card mb-10">
          <h2 className="font-semibold mb-3">Squad do Mês</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="h-36 md:h-40 rounded-lg bg-gradient-to-r from-primary/40 to-accent/40" />
              <div className="mt-3">
                <div className="text-lg font-semibold">Night Sprinters</div>
                <div className="text-sm text-muted-foreground">KMs totais: 1.240 • Conquistas: 12</div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img src={trophyImg} alt="Troféu NFT RunBro" className="h-32 w-32 object-contain" loading="lazy" />
            </div>
          </div>
        </section>

        <Tabs defaultValue="squads">
          <TabsList>
            <TabsTrigger value="squads">Ranking de Squads</TabsTrigger>
            <TabsTrigger value="corredores">Lendas Urbanas</TabsTrigger>
            <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
          </TabsList>
          <TabsContent value="squads" className="mt-6">
            <ol className="space-y-2">
              {["Night Sprinters", "Avenida Flyers", "Porto Pace"].map((n, i) => (
                <li key={n} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-muted-foreground">#{i + 1}</span>
                  <span className="font-semibold">{n}</span>
                  <span className="text-muted-foreground">{1200 - i * 120} pts</span>
                </li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="corredores" className="mt-6">
            <ol className="space-y-2">
              {["Luna R.", "Miguel A.", "Bruno C."].map((n, i) => (
                <li key={n} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-muted-foreground">#{i + 1}</span>
                  <span className="font-semibold">{n}</span>
                  <span className="text-muted-foreground">{(42 - i * 3).toFixed(0)} km/sem</span>
                </li>
              ))}
            </ol>
          </TabsContent>
          <TabsContent value="conquistas" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 flex flex-col items-center">
                  <img src={trophyImg} alt="Troféu NFT" className="h-20 w-20 object-contain" loading="lazy" />
                  <div className="mt-2 text-sm font-semibold">Troféu {i + 1}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
};

export default Hall;
