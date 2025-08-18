// Arquivo: src/components/ProfileAvatar.tsx

import React from 'react';

// Definimos os tipos de "props" que o componente vai receber
interface ProfileAvatarProps {
  avatarUrl: string | null;
  userName: string | null;
  rank: string | null;
}

// Mapeamento dos ranks para classes de CSS
const rankStyles: { [key: string]: string } = {
  'iniciante': 'border-gray-400',
  'elite': 'border-blue-500', // Ex: Membro Elite teria borda azul
  'lenda': 'border-amber-400',   // Ex: Um rank "Lenda" teria borda dourada
  // Adicione outros ranks e cores aqui
};

export function ProfileAvatar({ avatarUrl, userName, rank }: ProfileAvatarProps) {
  // Se o rank existir no nosso mapeamento, usamos a classe correspondente. Senão, sem borda.
  const rankClass = rank ? rankStyles[rank.toLowerCase()] : '';
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  return (
    <div className={`w-16 h-16 rounded-full border-4 ${rankClass} flex items-center justify-center bg-gray-600`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={`Avatar de ${userName}`}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        // Se não houver foto, mostra a inicial do nome
        <span className="text-2xl font-bold text-white">{initial}</span>
      )}
    </div>
  );
}
