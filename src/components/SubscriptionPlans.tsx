import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SubscriptionPlansProps {
  onSubscribe: () => void;
}

export const SubscriptionPlans = ({ onSubscribe }: SubscriptionPlansProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Assinaturas</h2>
      
      <div className="space-y-3">
        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Mensal</p>
              <p className="text-sm text-muted-foreground">Acesso por 1 mês</p>
            </div>
            <p className="text-lg font-bold text-foreground">R$ 19,90</p>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">3 meses (15% off)</p>
              <p className="text-sm text-muted-foreground">Acesso por 3 meses</p>
            </div>
            <p className="text-lg font-bold text-foreground">R$ 50,74</p>
          </div>
        </Card>

        <Card className="bg-card border-border p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">6 meses (20% off)</p>
              <p className="text-sm text-muted-foreground">Acesso por 6 meses</p>
            </div>
            <p className="text-lg font-bold text-foreground">R$ 95,52</p>
          </div>
        </Card>
      </div>

      <Button
        onClick={onSubscribe}
        className="w-full mt-6 bg-gradient-primary text-primary-foreground font-semibold py-6 rounded-xl hover:opacity-90 transition-opacity shadow-glow"
      >
        ASSINAR AGORA
      </Button>
    </div>
  );
};
