import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CreateSquadForm = () => {
  const navigate = useNavigate();
  
  // Estados para cada campo do formulário
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ritmo, setRitmo] = useState('');
  const [diasTreino, setDiasTreino] = useState('');
  const [limiteMembros, setLimiteMembros] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const squadData = {
      nome,
      cidade,
      descricao,
      ritmo, // Ex: "medio"
      dias_treino: parseInt(diasTreino), // Ex: 3
      limite_membros: parseInt(limiteMembros), // Ex: 6
    };

    try {
      // A lógica de envio para o backend virá aqui
      // const response = await fetch('/api/squads', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(squadData),
      // });

      // if (!response.ok) {
      //   throw new Error('Não foi possível criar o squad. Tente novamente.');
      // }

      // const newSquad = await response.json();
      
      console.log('Dados a serem enviados:', squadData);
      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirecionar para a página do squad recém-criado (exemplo)
      // router.push(`/squads/${newSquad.id}`);
      
      alert('Squad criado com sucesso! (Simulação)');


    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-gray-800/50 border border-gray-700 p-8 rounded-xl">
      <h2 className="text-2xl font-bold text-center text-white">Crie o seu Squad</h2>
      
      {/* Nome do Squad */}
      <div>
        <label htmlFor="nome" className="block text-sm font-medium mb-1 text-gray-300">Nome do Squad</label>
        <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Corredores da Madrugada" required />
      </div>
      
      {/* Cidade */}
      <div>
        <label htmlFor="cidade" className="block text-sm font-medium mb-1 text-gray-300">Cidade</label>
        <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: São Paulo" required />
      </div>

      {/* Descrição */}
      <div>
        <label htmlFor="descricao" className="block text-sm font-medium mb-1 text-gray-300">Descrição</label>
        <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o objetivo e a vibe do seu squad." required />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ritmo Médio */}
        <div>
          <label htmlFor="ritmo" className="block text-sm font-medium mb-1 text-gray-300">Ritmo Médio</label>
          <Select value={ritmo} onValueChange={setRitmo}>
            <SelectTrigger><SelectValue placeholder="Selecione o ritmo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="leve">6:00 min/km +</SelectItem>
              <SelectItem value="medio">5:30 - 6:00 min/km</SelectItem>
              <SelectItem value="forte">5:00 - 5:30 min/km</SelectItem>
              <SelectItem value="elite">Abaixo de 5:00 min/km</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dias de Treino */}
        <div>
          <label htmlFor="diasTreino" className="block text-sm font-medium mb-1 text-gray-300">Frequência</label>
          <Select value={diasTreino} onValueChange={setDiasTreino}>
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
          <label htmlFor="limiteMembros" className="block text-sm font-medium mb-1 text-gray-300">Nº de Membros</label>
          <Select value={limiteMembros} onValueChange={setLimiteMembros}>
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
        <Button type="submit" disabled={isLoading} className="w-full bg-sky-500 hover:bg-sky-400">
          {isLoading ? 'A criar Squad...' : 'Lançar Squad'}
        </Button>
      </div>

      {/* Mensagem de Erro */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </form>
  );
};
