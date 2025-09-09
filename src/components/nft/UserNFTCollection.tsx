import { useUserNFTCollection } from "@/hooks/useNFTRewards";
import { NFTRewardCard } from "./NFTRewardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserNFTCollectionProps {
  userId?: string;
  title?: string;
}

export const UserNFTCollection = ({ userId, title = "Minha Coleção NFT" }: UserNFTCollectionProps) => {
  const { data: collection, isLoading } = useUserNFTCollection(userId);

  if (isLoading) return <div>Carregando coleção NFT...</div>;

  const nftsByClassification = {
    diamante: collection?.filter(item => item.nft_reward?.classificacao === 'diamante') || [],
    ouro: collection?.filter(item => item.nft_reward?.classificacao === 'ouro') || [],
    prata: collection?.filter(item => item.nft_reward?.classificacao === 'prata') || [],
    bronze: collection?.filter(item => item.nft_reward?.classificacao === 'bronze') || []
  };

  const totalNFTs = collection?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            {totalNFTs} NFT{totalNFTs !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalNFTs === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>Nenhum NFT conquistado ainda.</p>
            <p className="text-sm">Complete desafios para ganhar recompensas!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(nftsByClassification).map(([classification, nfts]) => {
              if (nfts.length === 0) return null;
              
              return (
                <div key={classification}>
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                    {classification} ({nfts.length})
                  </h4>
                  <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {nfts.map((item) => (
                      item.nft_reward && (
                        <NFTRewardCard
                          key={item.id}
                          nft={item.nft_reward}
                          conquistadoEm={item.conquistado_em}
                          showDate
                        />
                      )
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};