import { useState } from "react";
import { useAllChallenges, useCreateChallenge, useUpdateChallenge, useDeleteChallenge, Challenge } from "@/hooks/useChallenges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2 } from "lucide-react";
import { NFTAdminPanel } from "@/components/nft/NFTAdminPanel";

export const MasterAdminPanel = () => {
  const { data: challenges, isLoading } = useAllChallenges();
  const createChallenge = useCreateChallenge();
  const updateChallenge = useUpdateChallenge();
  const deleteChallenge = useDeleteChallenge();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    distancia_km: '',
    tempo_limite_minutos: '',
    pontos_recompensa: '',
    ativo: true
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      distancia_km: '',
      tempo_limite_minutos: '',
      pontos_recompensa: '',
      ativo: true
    });
    setEditingChallenge(null);
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      nome: challenge.nome,
      descricao: challenge.descricao || '',
      distancia_km: challenge.distancia_km.toString(),
      tempo_limite_minutos: challenge.tempo_limite_minutos.toString(),
      pontos_recompensa: challenge.pontos_recompensa.toString(),
      ativo: challenge.ativo
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const challengeData = {
      nome: formData.nome,
      descricao: formData.descricao,
      distancia_km: parseFloat(formData.distancia_km),
      tempo_limite_minutos: parseInt(formData.tempo_limite_minutos),
      pontos_recompensa: parseInt(formData.pontos_recompensa),
      ativo: formData.ativo
    };

    try {
      if (editingChallenge) {
        await updateChallenge.mutateAsync({ id: editingChallenge.id, ...challengeData });
      } else {
        await createChallenge.mutateAsync(challengeData);
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar desafio:', error);
    }
  };

  const handleDelete = async (challengeId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este desafio?')) {
      await deleteChallenge.mutateAsync(challengeId);
    }
  };

  if (isLoading) return <div>Carregando painel de administração...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Painel Admin Master</h2>
      </div>

      <Tabs defaultValue="desafios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="desafios">Desafios</TabsTrigger>
          <TabsTrigger value="nfts">Recompensas NFT</TabsTrigger>
        </TabsList>
        
        <TabsContent value="desafios" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Gerenciar Desafios</h3>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Desafio
                </Button>
              </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingChallenge ? 'Editar Desafio' : 'Criar Novo Desafio'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Desafio</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Desafio 10K"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do desafio"
                />
              </div>

              <div>
                <Label htmlFor="distancia">Distância (km)</Label>
                <Input
                  id="distancia"
                  type="number"
                  step="0.1"
                  value={formData.distancia_km}
                  onChange={(e) => setFormData({ ...formData, distancia_km: e.target.value })}
                  placeholder="5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tempo">Tempo Limite (minutos)</Label>
                <Input
                  id="tempo"
                  type="number"
                  value={formData.tempo_limite_minutos}
                  onChange={(e) => setFormData({ ...formData, tempo_limite_minutos: e.target.value })}
                  placeholder="40"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pontos">Pontos Recompensa</Label>
                <Input
                  id="pontos"
                  type="number"
                  value={formData.pontos_recompensa}
                  onChange={(e) => setFormData({ ...formData, pontos_recompensa: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">Desafio Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createChallenge.isPending || updateChallenge.isPending}
                  className="flex-1"
                >
                  {editingChallenge ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>

          <div className="grid gap-4">
            {challenges?.map((challenge) => (
          <Card key={challenge.id} className={!challenge.ativo ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{challenge.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {challenge.distancia_km}km • {challenge.tempo_limite_minutos} min • {challenge.pontos_recompensa} pontos
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(challenge)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(challenge.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {challenge.descricao && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{challenge.descricao}</p>
                </CardContent>
              )}
            </Card>
          ))}
          </div>
        </TabsContent>
        
        <TabsContent value="nfts" className="space-y-6">
          <NFTAdminPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};