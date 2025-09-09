import { useState, useRef } from "react";
import { useAllNFTRewards, useCreateNFTReward, useUpdateNFTReward, useDeleteNFTReward, NFTReward } from "@/hooks/useNFTRewards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Upload, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NFTRewardCard } from "./NFTRewardCard";

export const NFTAdminPanel = () => {
  const { data: nftRewards, isLoading } = useAllNFTRewards();
  const createNFT = useCreateNFTReward();
  const updateNFT = useUpdateNFTReward();
  const deleteNFT = useDeleteNFTReward();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNFT, setEditingNFT] = useState<NFTReward | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    imagem_url: '',
    classificacao: 'bronze' as 'bronze' | 'prata' | 'ouro' | 'diamante',
    raridade: '0.8',
    ativo: true
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      imagem_url: '',
      classificacao: 'bronze',
      raridade: '0.8',
      ativo: true
    });
    setEditingNFT(null);
  };

  const handleEdit = (nft: NFTReward) => {
    setEditingNFT(nft);
    setFormData({
      nome: nft.nome,
      descricao: nft.descricao || '',
      imagem_url: nft.imagem_url,
      classificacao: nft.classificacao,
      raridade: nft.raridade.toString(),
      ativo: nft.ativo
    });
    setDialogOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `nft_${Date.now()}.${fileExt}`;
      const filePath = `nft-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('squad-covers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('squad-covers')
        .getPublicUrl(filePath);

      setFormData({ ...formData, imagem_url: data.publicUrl });
      toast({ title: "Imagem carregada com sucesso!" });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro ao fazer upload da imagem",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nftData = {
      nome: formData.nome,
      descricao: formData.descricao,
      imagem_url: formData.imagem_url,
      classificacao: formData.classificacao,
      raridade: parseFloat(formData.raridade),
      ativo: formData.ativo
    };

    try {
      if (editingNFT) {
        await updateNFT.mutateAsync({ id: editingNFT.id, ...nftData });
      } else {
        await createNFT.mutateAsync(nftData);
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar NFT:', error);
    }
  };

  const handleDelete = async (nftId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este NFT?')) {
      await deleteNFT.mutateAsync(nftId);
    }
  };

  if (isLoading) return <div>Carregando NFTs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Gerenciar Recompensas NFT</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo NFT
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingNFT ? 'Editar NFT' : 'Criar Novo NFT'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do NFT</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Corredor Bronze"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do NFT"
                />
              </div>

              <div>
                <Label>Imagem do NFT</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.imagem_url}
                    onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                    placeholder="URL da imagem ou faça upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? <Upload className="h-4 w-4 animate-spin" /> : <Image className="h-4 w-4" />}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div>
                <Label htmlFor="classificacao">Classificação</Label>
                <Select value={formData.classificacao} onValueChange={(value: 'bronze' | 'prata' | 'ouro' | 'diamante') => setFormData({ ...formData, classificacao: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronze">🥉 Bronze</SelectItem>
                    <SelectItem value="prata">🥈 Prata</SelectItem>
                    <SelectItem value="ouro">🥇 Ouro</SelectItem>
                    <SelectItem value="diamante">💎 Diamante</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="raridade">Raridade (0-1)</Label>
                <Input
                  id="raridade"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={formData.raridade}
                  onChange={(e) => setFormData({ ...formData, raridade: e.target.value })}
                  placeholder="0.8"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label htmlFor="ativo">NFT Ativo</Label>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={createNFT.isPending || updateNFT.isPending}
                  className="flex-1"
                >
                  {editingNFT ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nftRewards?.map((nft) => (
          <div key={nft.id} className="relative">
            <NFTRewardCard nft={nft} />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(nft)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(nft.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};