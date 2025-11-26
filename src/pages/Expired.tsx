import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Expired() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card border-border text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Acesso Expirado
          </h1>
          <p className="text-muted-foreground">
            Seu acesso expirou. Renove sua assinatura para continuar acessando o conteúdo exclusivo.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-primary text-primary-foreground font-semibold py-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Renovar Assinatura
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            Sair
          </Button>
        </div>
      </Card>
    </div>
  );
}
