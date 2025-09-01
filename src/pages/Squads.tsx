import SEO from "@/components/common/SEO";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSquads } from "@/hooks/useSquads";
import { SquadCard } from "@/components/squads/SquadCard";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
// NOVO: Importar o ToggleGroup e os ícones
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sun, Sunset, Moon } from "lucide-react";

const Squads = () => {
  const { data: squads, isLoading } = useSquads();
  const [searchCity, setSearchCity] = useState("");
  const [periodoFilter, setPeriodoFilter] = useState(""); // NOVO: Estado para o filtro de período

  const debouncedSearchCity = useDebounce(searchCity, 300);

  const filteredSquads = squads?.filter(squad => {
    const cityMatch = !debouncedSearchCity || squad.cidade.toLowerCase().includes(debouncedSearchCity.toLowerCase());
    
    // NOVO: Lógica para o filtro de período
    const periodoMatch = !periodoFilter || squad.periodo_calculado === periodoFilter;

    return cityMatch && periodoMatch;
  });

  return (
    <main>
      <SEO title="RunBro: Encontre seu Squad" description="Pesquise e explore Squads por cidade, ritmo e dias de treino. Encontre sua equipe perfeita." />
      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-black">Explore os Squads</h1>
        </header>

        <div className="glass rounded-xl p-4 md:p-6 shadow-card mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Cidade</label>
            <Input 
              placeholder="Procurar por cidade..." 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Período</label>
            {/* NOVO: Componente de filtro de período */}
            <ToggleGroup 
              type="single" 
              variant="outline"
              className="w-full justify-start"
              value={periodoFilter}
              onValueChange={(value) => setPeriodoFilter(value)}
            >
              <ToggleGroupItem value="manha" aria-label="Manhã" className="flex-1">
                <Sun className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="tarde" aria-label="Tarde" className="flex-1">
                <Sunset className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="noite" aria-label="Noite" className="flex-1">
                <Moon className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass rounded-xl overflow-hidden shadow-card">
                <Skeleton className="h-28 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="grid grid-cols-2 gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))
          ) : filteredSquads?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Nenhum squad encontrado com os filtros selecionados.</p>
            </div>
          ) : (
            filteredSquads?.map((squad) => (
              <SquadCard key={squad.id} squad={squad} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Squads;