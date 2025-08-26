// src/components/squads/CreateSquadForm.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCreateSquad, CreateSquadData } from '@/hooks/useSquads'; // Importe o hook e o tipo

// Mapeamento de ritmos para valores min/max
const rhythmMap: { [key: string]: { min: string, max: string } } = {
  leve: { min: "6:01", max: "8:00" },
  medio: { min: "5:31", max: "6:00" },
  forte: { min: "5:01", max: "5:30" },
  elite: { min: "3:00", max: "5:00" },
};

export const CreateSquadForm = () => {
  const navigate = useNavigate();
  const createSquadMutation = useCreateSquad();
  
  // Estados para cada campo do formulário
  const [name, setName] = useState('');
  const [cidade, setCidade] = useState('');
  const [description, setDescricao] = useState('');
  const [ritmo, setRitmo] = useState('');
  const [dias_treino, setDiasTreino] = useState('');
  const [max_members, setLimiteMembros] = useState('');

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!ritmo || !dias_treino || !max_members) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    const squadData: CreateSquadData = {
      name,
      cidade,
      description,
      ritmo_min: rhythmMap[ritmo].min,
      ritmo_max: rhythmMap[ritmo].max,
      dias_treino: parseInt(dias_treino),
      max_members: parseInt(max_members),
    };
    
    createSquadMutation.mutate(squadData, {
      onSuccess: () => {
        // Redireciona para a página de squads após o sucesso
        navigate('/squads');
      },
      onError: (err: any) => {
        setError(err.message || 'Ocorreu um erro.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto glass p-8 rounded-xl shadow-card">
      
      {/* Nome do Squad */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium mb-1 text-foreground/80">Nome do Squad</label>
        <Input id="nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Corredores da Madrugada" required />
      </div>
      
      {/* Cidade */}
      <div>
        <label htmlFor="cidade" className="block text-sm font-medium mb-1 text-foreground/80">Cidade</label>
        <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: São Paulo" required />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium mb-1 text-foreground/80">Descrição</label>
        <Textarea id="descricao" value={description} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o objetivo e a vibe do seu squad." required />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ritmo Médio */}
        <div>
          <label htmlFor="ritmo" className="block text-sm font-medium mb-1 text-foreground/80">Ritmo Médio</label>
          <Select value={ritmo} onValueChange={setRitmo} required>
            <SelectTrigger><SelectValue placeholder="Selecione o ritmo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="leve">6:00+</SelectItem>
              <SelectItem value="medio">5:30 - 6:00</SelectItem>
              <SelectItem value="forte">5:00 - 5:30</SelectItem>
              <SelectItem value="elite">≤ 5:00</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dias de Treino */}
        <div>
          <label htmlFor="diasTreino" className="block text-sm font-medium mb-1 text-foreground/80">Frequência</label>
          <Select value={dias_treino} onValueChange={setDiasTreino} required>
            <SelectTrigger><SelectValue placeholder="Treinos/semana" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2x / semana</SelectItem>
              <SelectItem value="3">3x / semana</SelectItem>
              <SelectItem value="4">4x / semana</SelectItem>
              <SelectItem value="5">5x+ / semana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Limite de Membros */}
        <div>
          <label htmlFor="limiteMembros" className="block text-sm font-medium mb-1 text-foreground/80">Nº de Membros</label>
          <Select value={max_members} onValueChange={setLimiteMembros} required>
            <SelectTrigger><SelectValue placeholder="Tamanho máx." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="4">Até 4 pessoas</SelectItem>
              <SelectItem value="6">Até 6 pessoas</SelectItem>
              <SelectItem value="8">Até 8 pessoas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Botão de Submissão */}
      <div>
        <Button type="submit" disabled={createSquadMutation.isPending} className="w-full" variant="hero">
          {createSquadMutation.isPending ? 'A criar Squad...' : 'Lançar Squad'}
        </Button>
      </div>

      {/* Mensagem de Erro */}
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </form>
  );
};
