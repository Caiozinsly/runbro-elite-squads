// Arquivo: src/pages/DashboardPage.tsx

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardPage() {
  const { profile, refreshProfile } = useAuth(); // Pegamos o perfil e a nova função de refresh
  const [kms, setKms] = useState(0);

  const handleAddRun = async () => {
    if (!profile || kms <= 0) return;

    try {
      const { error } = await (supabase as any).rpc('add_kms', { 
        user_id: profile.id, 
        kms_to_add: kms 
      });

      if (error) {
        alert(`Erro ao adicionar corrida: ${error.message}`);
      } else {
        alert(`${kms} KMs adicionados com sucesso!`);
        await refreshProfile();
        setKms(0);
      }
    } catch (error) {
      console.error('Error calling add_kms:', error);
      alert('Erro ao adicionar corrida');
    }
  };

  const handleCompleteCard = async () => {
    if (!profile) return;

    try {
      const { error } = await (supabase as any).rpc('increment_cards', {
        user_id: profile.id
      });

      if (error) {
        alert(`Erro ao completar o card: ${error.message}`);
      } else {
        alert(`Card completado!`);
        await refreshProfile();
      }
    } catch (error) {
      console.error('Error calling increment_cards:', error);
      alert('Erro ao completar card');
    }
  };

  if (!profile) {
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard de Testes</h1>
      
      <div className="p-4 border rounded-lg">
        <h2 className="font-semibold">Estatísticas Atuais</h2>
        <p>KMs Totais: {profile.km_percorridos || 0}</p>
        <p>Cards Completados: {profile.cards_completados || 0}</p>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Adicionar Corrida</h3>
        <Input 
          type="number"
          value={kms}
          onChange={(e) => setKms(Number(e.target.value))}
          placeholder="Digite os KMs"
        />
        <Button onClick={handleAddRun}>Adicionar Corrida</Button>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Completar um Card</h3>
        <Button onClick={handleCompleteCard}>Completar Card</Button>
      </div>
    </div>
  );
}
