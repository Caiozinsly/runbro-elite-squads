import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ExternalLink, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const StravaConnectionGuide = () => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  
  const isStravaConnected = profile?.strava_access_token && profile?.strava_athlete_id;

  const handleConnectStrava = () => {
    const stravaClientId = "136154"; // Substitua pelo seu client ID real
    const redirectUri = `https://juzqqvlvksvgavmmcweg.supabase.co/functions/v1/strava-callback`;
    const scope = "read,activity:read_all";
    
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${stravaClientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&approval_prompt=force&scope=${scope}`;
    
    window.location.href = stravaAuthUrl;
  };

  const steps = [
    {
      title: "1. Configuração Inicial",
      description: "Certifique-se de que tem uma conta Strava ativa",
      completed: true,
      action: (
        <Button variant="outline" size="sm" asChild>
          <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visitar Strava
          </a>
        </Button>
      )
    },
    {
      title: "2. Autorizar Conexão",
      description: "Conecte sua conta Strava ao RunBro para sincronizar suas atividades",
      completed: isStravaConnected,
      action: isStravaConnected ? (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-4 w-4 mr-2" />
          Conectado
        </Badge>
      ) : (
        <Button onClick={handleConnectStrava} size="sm">
          <Play className="h-4 w-4 mr-2" />
          Conectar Strava
        </Button>
      )
    },
    {
      title: "3. Sincronização Automática",
      description: "Suas corridas serão automaticamente importadas para o RunBro",
      completed: isStravaConnected,
      action: isStravaConnected ? (
        <Badge variant="secondary">Ativo</Badge>
      ) : (
        <Badge variant="outline">Pendente</Badge>
      )
    }
  ];

  if (isStravaConnected) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Strava Conectado com Sucesso!
          </CardTitle>
          <CardDescription>
            Sua conta Strava está conectada. Suas atividades serão sincronizadas automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>ID do Atleta:</strong> {profile?.strava_athlete_id}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Status:</strong> Token válido até {profile?.strava_token_expires_at ? new Date(profile.strava_token_expires_at).toLocaleDateString('pt-PT') : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Conectar com Strava</CardTitle>
        <CardDescription>
          Siga os passos abaixo para conectar sua conta Strava e sincronizar suas atividades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : currentStep === index + 1 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                <div className="mt-3">
                  {step.action}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Como funciona:</h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Clique em "Conectar Strava" para ser redirecionado para o site do Strava</li>
            <li>Faça login na sua conta Strava e autorize o RunBro</li>
            <li>Será redirecionado de volta para o RunBro com a conexão ativa</li>
            <li>Suas atividades serão sincronizadas automaticamente</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};