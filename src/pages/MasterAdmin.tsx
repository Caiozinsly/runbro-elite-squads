import { MasterAdminPanel } from "@/components/admin/MasterAdminPanel";
import SEO from "@/components/common/SEO";

export const MasterAdmin = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Administração Master - Desafios"
        description="Painel de administração para gerenciar desafios de corrida"
      />
      <div className="container mx-auto px-4 py-8">
        <MasterAdminPanel />
      </div>
    </div>
  );
};