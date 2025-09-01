// src/pages/squads/CreateSquad.tsx
'use client';

import CreateSquadForm from '@/components/squads/CreateSquadForm';

export default function CreateSquadPage() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <h1 className="text-center text-3xl font-extrabold mb-2">Lançar um Novo Squad</h1>
      <p className="text-center text-muted-foreground mb-8">
        Defina a identidade da sua equipe, estabeleça o ritmo e convide outros corredores para se juntarem à sua jornada.
      </p>
      <CreateSquadForm />
    </div>
  );
}
