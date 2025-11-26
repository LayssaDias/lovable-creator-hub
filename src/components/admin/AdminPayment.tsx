import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const AdminPayment = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    qr_code_image_url: "",
    pix_key: "",
    beneficiary_name: "",
    payment_instructions: "",
    whatsapp_number: "",
    telegram_username: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const { data } = await supabase
      .from('payment_settings')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setSettings(data);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const { data: existingSettings } = await supabase
      .from('payment_settings')
      .select('id')
      .limit(1)
      .single();

    if (existingSettings) {
      const { error } = await supabase
        .from('payment_settings')
        .update(settings)
        .eq('id', existingSettings.id);

      if (error) {
        toast.error("Erro ao atualizar configurações");
      } else {
        toast.success("Configurações atualizadas com sucesso!");
      }
    }

    setLoading(false);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Configurações de Pagamento
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="qr_code">URL do QR Code Pix</Label>
          <Input
            id="qr_code"
            value={settings.qr_code_image_url}
            onChange={(e) => setSettings({ ...settings, qr_code_image_url: e.target.value })}
            placeholder="https://..."
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="pix_key">Chave Pix</Label>
          <Input
            id="pix_key"
            value={settings.pix_key}
            onChange={(e) => setSettings({ ...settings, pix_key: e.target.value })}
            placeholder="email@exemplo.com"
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="beneficiary">Nome do Beneficiário</Label>
          <Input
            id="beneficiary"
            value={settings.beneficiary_name}
            onChange={(e) => setSettings({ ...settings, beneficiary_name: e.target.value })}
            placeholder="Nome completo"
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+55 11 99999-9999"
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="telegram">Telegram</Label>
          <Input
            id="telegram"
            value={settings.telegram_username}
            onChange={(e) => setSettings({ ...settings, telegram_username: e.target.value })}
            placeholder="@username"
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="instructions">Instruções de Pagamento</Label>
          <Textarea
            id="instructions"
            value={settings.payment_instructions}
            onChange={(e) => setSettings({ ...settings, payment_instructions: e.target.value })}
            className="bg-secondary border-border min-h-24"
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </Card>
  );
};
