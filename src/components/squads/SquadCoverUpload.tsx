import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SquadCoverUploadProps {
  squadId: string;
  currentCoverUrl?: string | null;
  onCoverUploaded: (url: string) => void;
}

export const SquadCoverUpload = ({ squadId, currentCoverUrl, onCoverUploaded }: SquadCoverUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${squadId}_${Math.random()}.${fileExt}`;
      const filePath = `${squadId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('squad-covers')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('squad-covers')
        .getPublicUrl(filePath);

      // Atualizar a URL da capa no banco de dados
      const { error: updateError } = await supabase
        .from('squads')
        .update({ capa_url: data.publicUrl })
        .eq('id', squadId);

      if (updateError) {
        throw updateError;
      }

      onCoverUploaded(data.publicUrl);
      toast({
        title: "Capa do squad atualizada",
        description: "A imagem de capa foi carregada com sucesso!"
      });

    } catch (error: any) {
      console.error('Error uploading cover:', error);
      toast({
        title: "Erro ao fazer upload",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Capa do Squad</Label>
      {currentCoverUrl && (
        <div className="w-full h-40 rounded-lg overflow-hidden bg-muted">
          <img 
            src={currentCoverUrl} 
            alt="Capa do squad" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Fazendo upload...
          </>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            {currentCoverUrl ? 'Alterar capa' : 'Adicionar capa'}
          </>
        )}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
};