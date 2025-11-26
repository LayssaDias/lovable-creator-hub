import * as React from "react";
// Assumindo que estas importações de UI são válidas no seu projeto
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, QrCode, Send } from "lucide-react"; // Importei 'Send' para o Telegram
import { toast } from "sonner";
import { toDataURL } from "qrcode";

// Mapeamento fallback por plano (pix payloads / valores fornecidos)
const PIX_FALLBACKS: Record<string, { pixKey: string; price: number; qrCodeUrl?: string }> = {
  semanal: {
    pixKey:
      "00020126580014BR.GOV.BCB.PIX0136ff766d42-7ef9-4c4f-ac0c-6fab49945c75520400005303986540529.905802BR5925Layssa Fernanda de Olivei6009SAO PAULO62140510e5MJdhlRbw630427E1",
    price: 29.90,
  },
  quinzenal: {
    pixKey:
      "00020126580014BR.GOV.BCB.PIX0136ff766d42-7ef9-4c4f-ac0c-6fab49945c75520400005303986540559.905802BR5925Layssa Fernanda de Olivei6009SAO PAULO62140510JDPFr3QXcg630460FD",
    price: 59.90,
  },
  mensal: {
    pixKey:
      "00020126580014BR.GOV.BCB.PIX0136ff766d42-7ef9-4c4f-ac0c-6fab49945c755204000053039865406109.905802BR5925Layssa Fernanda de Olivei6009SAO PAULO621405102KviNtOE6K63044641",
    price: 109.90,
  },
};

// Link para o Telegram (SUBSTITUA ESTE LINK PELO SEU)
const TELEGRAM_LINK = "https://t.me/SEU_LINK_DO_TELEGRAM_AQUI";

// QrCodeGenerator simples: usa imagem se qrCodeUrl for URL, senão gera QR a partir do payload
interface QrCodeGeneratorProps {
  qrCodeUrl?: string;
  payload?: string;
  size?: number;
}
const QrCodeGenerator: React.FC<QrCodeGeneratorProps> = ({ qrCodeUrl, payload, size = 160 }) => {
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const mountedRef = React.useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    // se existe url externa, não geramos
    if (qrCodeUrl && /^https?:\/\//i.test(qrCodeUrl)) {
      setDataUrl(qrCodeUrl);
      return;
    }

    // gera dataURL do payload
    const generate = async () => {
      try {
        if (!payload) {
          setDataUrl(null);
          return;
        }
        const url = await toDataURL(payload, { margin: 1, width: size });
        if (mountedRef.current) setDataUrl(url);
      } catch (err) {
        console.error("Erro gerando QR:", err);
        if (mountedRef.current) setDataUrl(null);
      }
    };

    generate();

    return () => {
      mountedRef.current = false;
    };
  }, [qrCodeUrl, payload, size]);

  if (dataUrl) {
    return (
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        <img src={dataUrl} alt="QR Code Pix" width={size} height={size} className="object-contain rounded-sm" />
      </div>
    );
  }

  // fallback visual quando não há QR (mantém o ícone e o payload pequeno)
  return (
    <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-md p-2 text-xs text-center overflow-auto">
      <div>
        <QrCode className="mx-auto mb-2" />
        <div className="font-mono text-[10px] break-all">{payload || "QR code não disponível"}</div>
      </div>
    </div>
  );
};

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeUrl?: string | null;
  pixKey?: string | null;
  beneficiaryName?: string | null;
  instructions?: string | null;
  planName?: string | null;
  price?: number | null;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  qrCodeUrl,
  pixKey,
  beneficiaryName,
  instructions,
  planName,
  price,
}: PaymentModalProps) => {
  const [copied, setCopied] = React.useState(false);

  // Resolve final pix payload/key e valor:
  const planKey = (planName || "").toLowerCase().trim();
  const fallback = PIX_FALLBACKS[planKey];

  const finalPixKey = String(pixKey ?? fallback?.pixKey ?? "");
  const finalPriceNumber = Number(price ?? fallback?.price ?? 29.9);
  const formattedPrice = `R$ ${finalPriceNumber.toFixed(2).replace(".", ",")}`;

  const copyPixKey = () => {
    if (!finalPixKey) {
      toast.error("Chave Pix indisponível.");
      return;
    }
    try {
      const el = document.createElement("textarea");
      el.value = finalPixKey;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);

      toast.success("Chave Pix copiada!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      toast.error("Erro ao copiar. Tente novamente.");
    }
  };

  const redirectToTelegram = () => {
    window.open(TELEGRAM_LINK, "_blank");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-border max-w-md w-[90%] rounded-xl p-6 shadow-2xl">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {planName ? `Pagar ${planName}` : "Pagamento Pix"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">Escaneie o QR Code ou use o Copia e Cola.</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Valor de Pagamento - Em destaque */}
          <div className="text-center p-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p className="text-sm font-medium text-muted-foreground">Valor a ser pago:</p>
            <p className="text-3xl font-extrabold text-foreground text-orange-600">{formattedPrice}</p>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center gap-2">
            <div className="p-4 border-4 border-orange-500 rounded-xl bg-white shadow-lg">
              <QrCodeGenerator qrCodeUrl={qrCodeUrl ?? undefined} payload={finalPixKey} size={160} />
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
                <div className="text-foreground text-xs break-all text-center p-3 bg-white rounded-lg border border-gray-300 overflow-x-auto text-wrap max-h-24 shadow-inner">
                  <span className="font-mono text-[10px] sm:text-xs leading-relaxed inline-block">{finalPixKey}</span>
                </div>

                <Button onClick={copyPixKey} variant="default" size="lg" className="w-full shadow-md hover:shadow-lg transition-all">
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

          {/* Beneficiário / Instruções (se houver) */}
          {beneficiaryName && (
            <div className="text-sm text-muted-foreground">
              <strong>Beneficiário:</strong> {beneficiaryName}
            </div>
          )}
          {instructions && (
            <div className="text-sm text-muted-foreground">
              <strong>Instruções:</strong> {instructions}
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