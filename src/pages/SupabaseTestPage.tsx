// src/pages/SupabaseTestPage.tsx

import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const SupabaseTestPage = () => {
  const [status, setStatus] = useState('A iniciar teste...');
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vamos tentar usar o cliente supabase importado
    try {
      if (!supabase) {
        throw new Error("O objeto 'supabase' importado é nulo ou indefinido!");
      }
      setStatus('Objeto Supabase importado com sucesso. A tentar chamar supabase.auth.getSession()...');
      
      supabase.auth.getSession()
        .then(({ data }) => {
          setStatus('Chamada getSession concluída com SUCESSO.');
          setSession(data.session);
        })
        .catch(err => {
          setStatus('Chamada getSession FALHOU.');
          setError(err.message);
        });
    } catch (e: any) {
      setStatus('FALHA CRÍTICA ao tentar usar o objeto supabase.');
      setError(e.message);
    }
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', fontSize: '16px', color: 'black' }}>
      <h1>Teste de Conexão Supabase</h1>
      <p style={{ marginTop: '1rem' }}><b>Status:</b> {status}</p>
      {session ? (
        <p style={{ color: 'green' }}><b>Sessão encontrada para o utilizador:</b> {session.user.email}</p>
      ) : (
        <p style={{ color: 'orange' }}><b>Sessão:</b> Nenhuma sessão ativa.</p>
      )}
      {error && (
        <div style={{ marginTop: '1rem', color: 'red', border: '1px solid red', padding: '1rem' }}>
          <h2>ERRO CAPTURADO:</h2>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseTestPage;