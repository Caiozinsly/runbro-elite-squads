// src/components/squads/CreateSquadForm.tsx

'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const generateTimeOptions = () => {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      options.push(`${hour}:${minute}`);
    }
  }
  return options;
};

export const CreateSquadForm = () => {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [pontoPartida, setPontoPartida] = useState('');
  const [distancia, setDistancia] = useState('5');
  const [limiteMembros, setLimiteMembros] = useState('6');
  const [isPublic, setIsPublic] = useState(true);
  const [horario, setHorario] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeOptions = useMemo(() => generateTimeOptions(), []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Você precisa de estar logado para criar um squad.');
      }

      const squadData = {
        nome,
        cidade,
        descricao,
        ponto_partida: pontoPartida,
        distancia_km: parseFloat(distancia),
        is_public: isPublic,
        limite_membros: parseInt(limiteMembros),
        capa_url: null,
        horario: horario,
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-squad`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(squadData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(responseData.error) ? responseData.error[0].message : (responseData.error || 'Não foi possível criar o squad.');
        throw new Error(errorMessage);
      }
      
      alert('Squad criado com sucesso!');
      navigate(`/squads/${responseData.id}`);

    } catch (err: any) {
      // Modificação para depuração detalhada
      console.error("--- ERRO CAPTURADO NO HANDLESUBMIT ---");
      console.error(err); // Imprime o objeto de erro completo
      setError(err.message || "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 glass p-8 rounded-xl">
      <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do Squad" required />
      <Input id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" required />
      <Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva o objetivo e a vibe do seu squad." required />
      <Input id="pontoPartida" value={pontoPartida} onChange={(e) => setPontoPartida(e.target.value)} placeholder="Ponto de partida" required />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="distancia" className="text-sm font-medium">Distância (km)</Label>
          <Input id="distancia" type="number" min="5" step="0.1" value={distancia} onChange={(e) => setDistancia(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="limiteMembros" className="text-sm font-medium">Nº de Membros</Label>
          <Select value={limiteMembros} onValueChange={setLimiteMembros} required>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              <SelectItem value="4">Até 4 pessoas</SelectItem>
              <SelectItem value="6">Até 6 pessoas</SelectItem>
              <SelectItem value="8">Até 8 pessoas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="horario" className="text-sm font-medium">Horário da Corrida</Label>
        <Select value={horario} onValueChange={setHorario} required>
          <SelectTrigger><SelectValue placeholder="Selecione um horário" /></SelectTrigger>
          <SelectContent>
            {timeOptions.map(time => (
              <SelectItem key={time} value={time}>{time}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Switch id="is-public" checked={isPublic} onCheckedChange={setIsPublic} />
        <Label htmlFor="is-public">Squad Público (visível nas buscas)</Label>
      </div>
      
      <div>
        <Button type="submit" disabled={isLoading} className="w-full bg-sky-500 hover:bg-sky-400 text-lg font-bold py-3">
          {isLoading ? 'A criar Squad...' : 'Lançar Squad'}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
    </form>
  );
};