import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase, checkUserRole, checkSubscriptionStatus } from "@/lib/supabase";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [expirationDate, setExpirationDate] = useState<string>("");

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/auth');
      return;
    }

    const role = await checkUserRole(session.user.id);
    
    if (role === 'admin') {
      navigate('/admin');
      return;
    }

    if (role === 'subscriber') {
      const isActive = await checkSubscriptionStatus(session.user.id);
      
      if (!isActive) {
        navigate('/expired');
        return;
      }

      // Load expiration date
      const { data } = await supabase
        .from('subscribers')
        .select('expiration_date')
        .eq('user_id', session.user.id)
        .single();

      if (data) {
        setExpirationDate(new Date(data.expiration_date).toLocaleDateString('pt-BR'));
      }
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        <div className="bg-card border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Bem-vindo ao Conteúdo Exclusivo!
          </h2>
          <p className="text-muted-foreground mb-4">
            Sua assinatura está ativa até: <span className="font-semibold text-foreground">{expirationDate}</span>
          </p>
          <div className="mt-6 p-6 bg-secondary rounded-lg">
            <p className="text-foreground">
              🎉 Aqui você terá acesso a todo o conteúdo exclusivo!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
