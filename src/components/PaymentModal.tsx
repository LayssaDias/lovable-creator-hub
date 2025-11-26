import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCodeUrl?: string;
  pixKey?: string;
  beneficiaryName?: string;
  instructions?: string;
  planName?: string;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  qrCodeUrl,
  pixKey,
  beneficiaryName,
  instructions,
  planName,
}: PaymentModalProps) => {
  const copyPixKey = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey);
      toast.success("Chave Pix copiada!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {planName ? `Pagar Plano ${planName} e Receber Acesso` : 'Pagamento via Pix'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* QR Code */}
          {qrCodeUrl && (
            <div className="flex justify-center p-4 bg-white rounded-xl">
              <img src={qrCodeUrl} alt="QR Code Pix" className="w-48 h-48" />
            </div>
          )}

          {/* Pix Key */}
          {pixKey && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Chave Pix:</p>
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-secondary rounded-lg text-foreground text-sm break-all">
                  {pixKey}
                </code>
                <Button
                  onClick={copyPixKey}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Beneficiary */}
          {beneficiaryName && (
            <div>
              <p className="text-sm text-muted-foreground">Beneficiário:</p>
              <p className="text-foreground font-medium">{beneficiaryName}</p>
            </div>
          )}

          {/* Instructions */}
          {instructions && (
            <div className="p-4 bg-secondary rounded-xl">
              <p className="text-sm text-foreground whitespace-pre-line">
                {instructions}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
