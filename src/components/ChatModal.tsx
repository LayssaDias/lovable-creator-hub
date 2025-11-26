import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chatSettings: any;
}

export const ChatModal = ({ open, onOpenChange, chatSettings }: ChatModalProps) => {
  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [formData, setFormData] = useState({
    country: '',
    cpf: '',
    email: '',
    nickname: '',
    full_name: '',
    birth_date: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('chat_users')
      .insert({
        user_id: user?.id,
        ...formData
      });

    if (error) {
      toast.error("Erro ao salvar cadastro");
      return;
    }

    toast.success("Cadastro realizado! Finalize o pagamento");
    setStep('payment');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        {step === 'form' ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Chat Exclusivo</DialogTitle>
            </DialogHeader>

            {/* Benefits */}
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <p className="text-sm whitespace-pre-line">{chatSettings?.benefits}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="country">País</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="nickname">Apelido</Label>
                <Input
                  id="nickname"
                  value={formData.nickname}
                  onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_name">Nome Completo</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="birth_date">Data de Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-gradient-primary">
                Finalizar Cadastro
              </Button>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Pagar R$ {chatSettings?.price?.toFixed(2)} para Ativar Chat
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {chatSettings?.qr_code_image_url && (
                <div className="flex justify-center">
                  <img 
                    src={chatSettings.qr_code_image_url} 
                    alt="QR Code" 
                    className="w-64 h-64 rounded-lg"
                  />
                </div>
              )}

              {chatSettings?.pix_key && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Chave Pix:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm bg-background p-2 rounded">
                      {chatSettings.pix_key}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(chatSettings.pix_key)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {chatSettings?.beneficiary_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Beneficiário:</p>
                  <p className="font-medium">{chatSettings.beneficiary_name}</p>
                </div>
              )}

              {chatSettings?.payment_instructions && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-line">{chatSettings.payment_instructions}</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
