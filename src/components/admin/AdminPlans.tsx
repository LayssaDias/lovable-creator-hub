import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const AdminPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const { data } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('duration_days', { ascending: true });
    
    if (data) {
      setPlans(data);
    }
    setLoading(false);
  };

  const handleUpdate = async (planId: string, field: string, value: any) => {
    const { error } = await supabase
      .from('subscription_plans')
      .update({ [field]: value })
      .eq('id', planId);

    if (error) {
      toast.error("Erro ao atualizar");
    } else {
      toast.success("Atualizado com sucesso");
      loadPlans();
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Gerenciar Planos</h2>
      
      {plans.map((plan) => (
        <Card key={plan.id} className="bg-card border-border p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">{plan.name}</h3>
          
          <div className="grid gap-4">
            <div>
              <Label>Preço (R$)</Label>
              <Input
                type="number"
                step="0.01"
                defaultValue={plan.price}
                onBlur={(e) => handleUpdate(plan.id, 'price', parseFloat(e.target.value))}
              />
            </div>

            <div>
              <Label>Desconto (%)</Label>
              <Input
                type="number"
                defaultValue={plan.discount_percentage}
                onBlur={(e) => handleUpdate(plan.id, 'discount_percentage', parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Input
                defaultValue={plan.description || ''}
                onBlur={(e) => handleUpdate(plan.id, 'description', e.target.value)}
              />
            </div>

            <div>
              <Label>URL do QR Code</Label>
              <Input
                defaultValue={plan.qr_code_image_url || ''}
                onBlur={(e) => handleUpdate(plan.id, 'qr_code_image_url', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label>Chave Pix</Label>
              <Input
                defaultValue={plan.pix_key || ''}
                onBlur={(e) => handleUpdate(plan.id, 'pix_key', e.target.value)}
              />
            </div>

            <div>
              <Label>Nome do Beneficiário</Label>
              <Input
                defaultValue={plan.beneficiary_name || ''}
                onBlur={(e) => handleUpdate(plan.id, 'beneficiary_name', e.target.value)}
              />
            </div>

            <div>
              <Label>Instruções de Pagamento</Label>
              <Textarea
                defaultValue={plan.payment_instructions || ''}
                onBlur={(e) => handleUpdate(plan.id, 'payment_instructions', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
