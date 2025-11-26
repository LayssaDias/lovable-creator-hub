import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const AdminChat = () => {
  const [chatSettings, setChatSettings] = useState<any>(null);
  const [chatUsers, setChatUsers] = useState<any[]>([]);

  useEffect(() => {
    loadChatSettings();
    loadChatUsers();
  }, []);

  const loadChatSettings = async () => {
    const { data } = await supabase
      .from('chat_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (data) setChatSettings(data);
  };

  const loadChatUsers = async () => {
    const { data } = await supabase
      .from('chat_users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setChatUsers(data);
  };

  const handleUpdateSettings = async (field: string, value: any) => {
    if (!chatSettings?.id) return;

    const { error } = await supabase
      .from('chat_settings')
      .update({ [field]: value })
      .eq('id', chatSettings.id);

    if (error) {
      toast.error("Erro ao atualizar");
    } else {
      toast.success("Atualizado!");
      loadChatSettings();
    }
  };

  const handleToggleChatAccess = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('chat_users')
      .update({ chat_enabled: !currentStatus })
      .eq('id', userId);

    if (error) {
      toast.error("Erro ao atualizar");
    } else {
      toast.success("Status atualizado!");
      loadChatUsers();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Gerenciar Chat Exclusivo</h2>

      {/* Chat Settings */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Configurações do Chat</h3>
        
        <div className="grid gap-4">
          <div>
            <Label>Benefícios (um por linha)</Label>
            <Textarea
              defaultValue={chatSettings?.benefits || ''}
              onBlur={(e) => handleUpdateSettings('benefits', e.target.value)}
              rows={5}
            />
          </div>

          <div>
            <Label>Preço (R$)</Label>
            <Input
              type="number"
              step="0.01"
              defaultValue={chatSettings?.price || 29.90}
              onBlur={(e) => handleUpdateSettings('price', parseFloat(e.target.value))}
            />
          </div>

          <div>
            <Label>URL do QR Code</Label>
            <Input
              defaultValue={chatSettings?.qr_code_image_url || ''}
              onBlur={(e) => handleUpdateSettings('qr_code_image_url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Chave Pix</Label>
            <Input
              defaultValue={chatSettings?.pix_key || ''}
              onBlur={(e) => handleUpdateSettings('pix_key', e.target.value)}
            />
          </div>

          <div>
            <Label>Nome do Beneficiário</Label>
            <Input
              defaultValue={chatSettings?.beneficiary_name || ''}
              onBlur={(e) => handleUpdateSettings('beneficiary_name', e.target.value)}
            />
          </div>

          <div>
            <Label>Instruções de Pagamento</Label>
            <Textarea
              defaultValue={chatSettings?.payment_instructions || ''}
              onBlur={(e) => handleUpdateSettings('payment_instructions', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </Card>

      {/* Chat Users Management */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Usuários Cadastrados no Chat</h3>
        
        <div className="space-y-4">
          {chatUsers.length === 0 ? (
            <p className="text-muted-foreground">Nenhum usuário cadastrado ainda</p>
          ) : (
            chatUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{user.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground">@{user.nickname}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">
                    {user.chat_enabled ? 'Chat Ativo' : 'Chat Inativo'}
                  </Label>
                  <Switch
                    checked={user.chat_enabled}
                    onCheckedChange={() => handleToggleChatAccess(user.id, user.chat_enabled)}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
