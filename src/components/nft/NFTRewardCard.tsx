import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NFTReward } from "@/hooks/useNFTRewards";

interface NFTRewardCardProps {
  nft: NFTReward;
  conquistadoEm?: string;
  showDate?: boolean;
}

const classificationColors = {
  bronze: "bg-amber-700 text-amber-100",
  prata: "bg-gray-500 text-gray-100", 
  ouro: "bg-yellow-500 text-yellow-900",
  diamante: "bg-blue-600 text-blue-100"
};

const classificationEmoji = {
  bronze: "🥉",
  prata: "🥈",
  ouro: "🥇", 
  diamante: "💎"
};

export const NFTRewardCard = ({ nft, conquistadoEm, showDate = false }: NFTRewardCardProps) => {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-3xl">
            {classificationEmoji[nft.classificacao]}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-sm mb-1">{nft.nome}</h3>
            {nft.descricao && (
              <p className="text-xs text-muted-foreground mb-2">{nft.descricao}</p>
            )}
            
            <Badge 
              className={`text-xs ${classificationColors[nft.classificacao]}`}
              variant="secondary"
            >
              {nft.classificacao.toUpperCase()}
            </Badge>
            
            {showDate && conquistadoEm && (
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(conquistadoEm).toLocaleDateString('pt-BR')}
              </p>
            )}
          </div>
          
          <div className="text-xs text-center">
            <span className="text-muted-foreground">
              Raridade: {(nft.raridade * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};