import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase, checkUserRole } from "@/lib/supabase";
import { toast } from "sonner";
import { AdminProfile } from "@/components/admin/AdminProfile";
import { AdminPayment } from "@/components/admin/AdminPayment";
import { AdminSubscribers } from "@/components/admin/AdminSubscribers";
import { AdminPlans } from "@/components/admin/AdminPlans";
import { AdminPosts } from "@/components/admin/AdminPosts";
import { AdminChat } from "@/components/admin/AdminChat";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/auth');
      return;
    }

    const role = await checkUserRole(session.user.id);
    
    if (role !== 'admin') {
      toast.error("Acesso negado");
      navigate('/');
      return;
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-card">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="plans">Planos</TabsTrigger>
            <TabsTrigger value="posts">Postagens</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="payment">Pagamento</TabsTrigger>
            <TabsTrigger value="subscribers">Assinantes</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <AdminProfile />
          </TabsContent>

          <TabsContent value="plans">
            <AdminPlans />
          </TabsContent>

          <TabsContent value="posts">
            <AdminPosts />
          </TabsContent>

          <TabsContent value="chat">
            <AdminChat />
          </TabsContent>

          <TabsContent value="payment">
            <AdminPayment />
          </TabsContent>

          <TabsContent value="subscribers">
            <AdminSubscribers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
