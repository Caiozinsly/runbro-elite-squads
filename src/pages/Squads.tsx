import SEO from "@/components/common/SEO";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useSquads } from "@/hooks/useSquads";
import { SquadCard } from "@/components/squads/SquadCard";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce"; // Importe o novo hook


const Squads = () => {
  const { data: squads, isLoading } = useSquads();
  const [searchCity, setSearchCity] = useState("");
  const [rhythmFilter, setRhythmFilter] = useState("");
  const [trainingDays, setTrainingDays] = useState("");

  // Crie um valor "debounced" para a busca da cidade. A filtragem só usará este valor.
  const debouncedSearchCity = useDebounce(searchCity, 300); // Atraso de 300ms

  const filteredSquads = squads?.filter(squad => {
    // Use o valor "debounced" na sua lógica de filtro
    const cityMatch = !debouncedSearchCity || squad.cidade.toLowerCase().includes(debouncedSearchCity.toLowerCase());
    
    let rhythmMatch = true;
    if (rhythmFilter) {
      const squadRhythm = parseFloat(squad.ritmo_min.replace(':', '.'));
      switch (rhythmFilter) {
        case "elite":
          rhythmMatch = squadRhythm <= 5.00;
          break;
        case "forte":
          rhythmMatch = squadRhythm > 5.00 && squadRhythm <= 5.30;
          break;
        case "medio":
          rhythmMatch = squadRhythm > 5.30 && squadRhythm <= 6.00;
          break;
        case "leve":
          rhythmMatch = squadRhythm > 6.00;
          break;
      }
    }

    const daysMatch = !trainingDays || squad.dias_treino?.toString() === trainingDays.replace('x', '');

    return cityMatch && rhythmMatch && daysMatch;
  });

  return (
    <main>
      <SEO title="RunBro: Encontre seu Squad" description="Pesquise e explore Squads por cidade, ritmo e dias de treino. Encontre sua equipe perfeita." />
      <section className="container mx-auto px-4 py-10 md:py-14">
        <header className="mb-8">
          <h1 className="text-3xl font-black">Explore os Squads</h1>
        </header>

        <div className="glass rounded-xl p-4 md:p-6 shadow-card mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Input 
              placeholder="Procurar por cidade..." 
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
          <div>
            <Select value={rhythmFilter} onValueChange={setRhythmFilter}>
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
            <Select value={trainingDays} onValueChange={setTrainingDays}>
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
