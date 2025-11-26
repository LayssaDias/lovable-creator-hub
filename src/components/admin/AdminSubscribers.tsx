import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [newSub, setNewSub] = useState({
    email: "",
    password: "",
    expiration_date: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    const { data } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setSubscribers(data);
    }
  };

  const handleCreateSubscriber = async () => {
    if (!newSub.email || !newSub.password || !newSub.expiration_date) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: newSub.email,
      password: newSub.password,
    });

    if (authError || !authData.user) {
      toast.error("Erro ao criar usuário: " + authError?.message);
      setLoading(false);
      return;
    }

    // Add role
    await supabase.from('user_roles').insert({
      user_id: authData.user.id,
      role: 'subscriber',
    });

    // Add subscriber
    const { error: subError } = await supabase.from('subscribers').insert({
      user_id: authData.user.id,
      email: newSub.email,
      expiration_date: newSub.expiration_date,
      is_active: true,
    });

    if (subError) {
      toast.error("Erro ao criar assinante: " + subError.message);
    } else {
      toast.success("Assinante criado com sucesso!");
      setNewSub({ email: "", password: "", expiration_date: "" });
      loadSubscribers();
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Criar Novo Assinante
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newSub.email}
              onChange={(e) => setNewSub({ ...newSub, email: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={newSub.password}
              onChange={(e) => setNewSub({ ...newSub, password: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <Label htmlFor="expiration">Data de Expiração</Label>
            <Input
              id="expiration"
              type="datetime-local"
              value={newSub.expiration_date}
              onChange={(e) => setNewSub({ ...newSub, expiration_date: e.target.value })}
              className="bg-secondary border-border"
            />
          </div>

          <Button
            onClick={handleCreateSubscriber}
            disabled={loading}
            className="w-full bg-gradient-primary text-primary-foreground"
          >
            {loading ? "Criando..." : "Criar Assinante"}
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Lista de Assinantes
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Expira em</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell>{sub.email}</TableCell>
                <TableCell>
                  {new Date(sub.expiration_date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {sub.is_active && new Date(sub.expiration_date) > new Date() ? (
                    <span className="text-green-500">Ativo</span>
                  ) : (
                    <span className="text-red-500">Expirado</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
