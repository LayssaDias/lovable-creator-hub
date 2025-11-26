import * as React from "react";
// Assumindo que estas importações de UI são válidas no seu projeto
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, QrCode, Send } from "lucide-react"; // Importei 'Send' para o Telegram
import { toast } from "sonner";

// --- DADOS PIX FIXOS ---
const FIXED_PIX_KEY = "00020126580014BR.GOV.BCB.PIX0136ff766d42-7ef9-4c4f-ac0c-6fab49945c75520400005303986540519.905802BR5925Layssa Fernanda de Olivei6009SAO PAULO62140510YVIwYXwjV96304090E";

// Link para o Telegram (SUBSTITUA ESTE LINK PELO SEU)
const TELEGRAM_LINK = "https://t.me/SEU_LINK_DO_TELEGRAM_AQUI"; 
// O valor (R$ 19.90) foi extraído da chave Pix acima
const PIX_VALUE = 19.90;

// --- PLACEHOLDER DE QR CODE (MANUTENÇÃO) ---
interface QrCodeGeneratorProps {
  value: string;
  size: number;
  fgColor: string;
}

// Este componente é um placeholder para a visualização correta do QR Code.
const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = () => {
    // ATENÇÃO: Esta imagem ESTÁ correta para o valor de R$ 19,90 da chave.
    const finalQrCodeUrl = "uploaded:Imagem do WhatsApp de 2025-11-26 à(s) 12.03.58_a0a0b748.jpg-6a93e059-1e23-49b1-a702-f6a988a4d8b2";

    return (
        <img 
            src={finalQrCodeUrl} 
            alt="QR Code Pix" 
            className="w-40 h-40 object-contain" 
        />
    );
};
// FIM PLACEHOLDER

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // A prop qrCodeUrl foi removida pois o QR Code é gerado
  pixKey?: string; 
  beneficiaryName?: string;
  instructions?: string;
  planName?: string;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  // Ignoramos props de PIX/QR Code e removemos as props não utilizadas para limpeza
  planName,
}: PaymentModalProps) => {
  const [copied, setCopied] = React.useState(false);

  // Usamos a chave Pix fixa
  const finalPixKey = FIXED_PIX_KEY;
  
  const copyPixKey = () => {
    if (finalPixKey) {
      // Usando document.execCommand('copy') como fallback seguro em iFrames
      try {
        const el = document.createElement('textarea');
        el.value = finalPixKey;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        toast.success("Chave Pix copiada!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2s
      } catch (e) {
        toast.error("Erro ao copiar. Tente novamente.");
      }
    }
  };

  const redirectToTelegram = () => {
    window.open(TELEGRAM_LINK, '_blank');
    onOpenChange(false); // Fecha o modal após o redirecionamento
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-border max-w-md w-[90%] rounded-xl p-6 shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {planName ? `Pagar ${planName}` : 'Pagamento Pix'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Escaneie o QR Code ou use o Copia e Cola.</p>
        </DialogHeader>

        <div className="space-y-6">
          
          {/* Valor de Pagamento - Em destaque */}
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm font-medium text-muted-foreground">Valor a ser pago:</p>
            <p className="text-3xl font-extrabold text-foreground text-orange-600">
              R$ {PIX_VALUE.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            {/* Borda laranja/pêssego (cor principal) */}
            <div className="p-4 border-4 border-orange-500 rounded-xl bg-white shadow-lg">
              <QrCodeGenerator 
                value={finalPixKey}
                size={160}
                fgColor="#000000"
              />
            </div>
            <p className="text-sm font-semibold text-orange-500 flex items-center gap-1">
              <QrCode className="h-4 w-4" /> Pronta para escanear
            </p>
          </div>


          {/* Pix Key (Copia e Cola) */}
          {finalPixKey && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground font-medium text-center">Chave Pix (Copia e Cola):</p>
              <div className="flex flex-col gap-2">
                {/* Visualização da Chave - CORRIGIDO: Fundo claro (bg-white) e texto escuro (text-foreground) */}
                <div className="text-foreground text-xs break-all text-center p-3 **bg-white** rounded-lg border border-gray-300 overflow-x-auto text-wrap max-h-24 shadow-inner">
                  <span className="font-mono text-[10px] sm:text-xs leading-relaxed inline-block">
                    {finalPixKey}
                  </span>
                </div>
                
                {/* BOTÃO COPIAR: Laranja principal */}
                <Button
                  onClick={copyPixKey}
                  variant="default" 
                  size="lg"
                  className="w-full shadow-md hover:shadow-lg transition-all"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Copiado com Sucesso!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copiar Chave Pix
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* BOTÃO: JÁ FIZ O PAGAMENTO (Telegram) */}
          <Button
            onClick={redirectToTelegram}
            variant="outline"
            size="lg"
            className="w-full mt-4 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
          >
            <Send className="h-5 w-5 mr-2" />
            Já fiz o pagamento (Enviar Comprovante)
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};