import { useState } from "react";
import { useChallenges, useCompleteSquadChallenge } from "@/hooks/useChallenges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Plus } from "lucide-react";

interface CompleteSquadChallengeFormProps {
  squadId: string;
}

export const CompleteSquadChallengeForm = ({ squadId }: CompleteSquadChallengeFormProps) => {
  const { data: challenges, isLoading } = useChallenges();
  const completeChallenge = useCompleteSquadChallenge();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    challenge_id: '',
    tempo_horas: '',
    tempo_minutos: '',
    tempo_segundos: '',
    km_total: '',
  });

  const resetForm = () => {
    setFormData({
      challenge_id: '',
      tempo_horas: '',
      tempo_minutos: '',
      tempo_segundos: '',
      km_total: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedChallenge = challenges?.find(c => c.id === formData.challenge_id);
    if (!selectedChallenge) return;
    
    // Calcular tempo total em minutos
    const horas = parseInt(formData.tempo_horas) || 0;
    const minutos = parseInt(formData.tempo_minutos) || 0;
    const segundos = parseInt(formData.tempo_segundos) || 0;
    const tempo_total_minutos = horas * 60 + minutos + segundos / 60;
    
    // Calcular km total e pace médio
    const km_total = parseFloat(formData.km_total);
    const pace_medio = tempo_total_minutos / km_total; // minutos por km
    
    // Calcular pontos baseado na recompensa do desafio
    const pontos_ganhos = selectedChallenge.pontos_recompensa;

    try {
      await completeChallenge.mutateAsync({
        squad_id: squadId,
        challenge_id: formData.challenge_id,
        tempo_total_minutos,
        km_total,
        pace_medio,
        pontos_ganhos
      });
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao completar desafio:', error);
    }
  };

  if (isLoading) return <div>Carregando desafios...</div>;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Completar Desafio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Desafio Completado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Completar Desafio do Squad</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="challenge">Desafio</Label>
                <Select
                  value={formData.challenge_id}
                  onValueChange={(value) => setFormData({ ...formData, challenge_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um desafio" />
                  </SelectTrigger>
                  <SelectContent>
                    {challenges?.map((challenge) => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        {challenge.nome} ({challenge.distancia_km}km)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tempo Total</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Horas"
                      min="0"
                      value={formData.tempo_horas}
                      onChange={(e) => setFormData({ ...formData, tempo_horas: e.target.value })}
                    />
                    <span className="text-xs text-muted-foreground">h</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Minutos"
                      min="0"
                      max="59"
                      value={formData.tempo_minutos}
                      onChange={(e) => setFormData({ ...formData, tempo_minutos: e.target.value })}
                    />
                    <span className="text-xs text-muted-foreground">min</span>
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Segundos"
                      min="0"
                      max="59"
                      value={formData.tempo_segundos}
                      onChange={(e) => setFormData({ ...formData, tempo_segundos: e.target.value })}
                    />
                    <span className="text-xs text-muted-foreground">s</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="km_total">Distância Total (km)</Label>
                <Input
                  id="km_total"
                  type="number"
                  step="0.1"
                  value={formData.km_total}
                  onChange={(e) => setFormData({ ...formData, km_total: e.target.value })}
                  placeholder="Distância percorrida"
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={completeChallenge.isPending}
                  className="flex-1"
                >
                  {completeChallenge.isPending ? 'Salvando...' : 'Completar Desafio'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};