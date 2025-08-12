import SEO from "@/components/common/SEO";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const squads = Array.from({ length: 9 }).map((_, i) => ({
  name: `Squad ${i + 1}`,
  cidade: ["São Paulo", "Porto", "Lisboa", "Rio", "Curitiba"][i % 5],
  membros: `${3 + (i % 4)}/${5 + (i % 3)} Membros`,
  ritmo: ["4:50", "5:10", "5:30", "6:00"][i % 4],
}));

const Squads = () => {
  return (
    <main>
      <SEO title="RunBro: Encontre seu Squad" description="Pesquise e explore Squads por cidade, ritmo e dias de treino. Encontre sua equipe perfeita." />
      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black">Explore os Squads</h1>
        </header>

        <div className="glass rounded-xl p-4 md:p-6 shadow-card mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Input placeholder="Procurar por cidade..." />
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Ritmo Médio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leve">6:00+</SelectItem>
                <SelectItem value="medio">5:30 - 6:00</SelectItem>
                <SelectItem value="forte">5:00 - 5:30</SelectItem>
                <SelectItem value="elite">≤ 5:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Dias de Treino" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2x">2x/sem</SelectItem>
                <SelectItem value="3x">3x/sem</SelectItem>
                <SelectItem value="4x">4x/sem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {squads.map((s) => (
            <article key={s.name} className="glass rounded-xl overflow-hidden shadow-card">
              <div className="h-28 bg-gradient-to-r from-primary/40 to-accent/40" />
              <div className="p-5">
                <h3 className="font-semibold text-lg">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.cidade}</p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-md bg-secondary/60 p-2 text-center">{s.membros}</div>
                  <div className="rounded-md bg-secondary/60 p-2 text-center">{s.ritmo} min/km</div>
                  <Button variant="hero" size="sm" className="w-full">Pedir para Entrar</Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Squads;
