// hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// O T é um tipo genérico, o que torna este hook reutilizável para qualquer tipo de valor (string, number, etc.)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um temporizador que só vai atualizar o valor "debounced" após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o temporizador se o valor mudar antes do delay terminar
    // Isso é o que faz a "mágica" de esperar o utilizador parar de digitar
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Só re-executa se o valor ou o delay mudarem

  return debouncedValue;
}
