import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { PaymentModal } from "./PaymentModal";

const DESIRED_PLANS = [
  { name: 'Semanal', duration_days: 7, price: 29.90, discount_percentage: 0, description: 'Acesso por 1 semana' },
  { name: 'Quinzenal', duration_days: 15, price: 59.90, discount_percentage: 0, description: 'Acesso por 15 dias' },
  { name: 'Mensal', duration_days: 30, price: 109.90, discount_percentage: 0, description: 'Acesso por 1 mês' },
];

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('duration_days', { ascending: true });

      if (error) {
        // fallback to desired plans if DB read fails
        console.error("Error loading subscription_plans:", error);
        setPlans(DESIRED_PLANS);
        return;
      }

      if (data && data.length > 0) {
        // Merge DB rows with desired plans: prefer DESIRED_PLANS values for name/duration/price/description/discount,
        // but preserve extra DB fields (id, pix keys, qr code, etc.) when present.
        const merged = DESIRED_PLANS.map(dp => {
          const found = data.find(d => d.name && d.name.toLowerCase() === dp.name.toLowerCase());
          return { ...(found || {}), ...dp };
        });
        setPlans(merged);
      } else {
        setPlans(DESIRED_PLANS);
      }
    } catch (err) {
      console.error("Unexpected error loading plans:", err);
      setPlans(DESIRED_PLANS);
    }
  };

  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  return <>
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Assinaturas</h2>
        
        <div className="space-y-3">
          {plans.map(plan => <Card key={plan.id || plan.name} onClick={() => handlePlanClick(plan)} className="border-border p-4 cursor-pointer hover:border-primary transition-colors bg-[#f6954a] rounded-3xl shadow-md text-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">
                    {plan.name}
                    {plan.discount_percentage > 0 && ` (${plan.discount_percentage}% off)`}
                  </p>
                  <p className="text-sm text-[#171917]">{plan.description}</p>
                </div>
                <p className="text-lg font-bold text-foreground">
                  R$ {parseFloat(String(plan.price)).toFixed(2)}
                </p>
              </div>
            </Card>)}
        </div>
      </div>

      {selectedPlan && <PaymentModal open={showModal} onOpenChange={setShowModal} qrCodeUrl={selectedPlan.qr_code_image_url} pixKey={selectedPlan.pix_key} beneficiaryName={selectedPlan.beneficiary_name} instructions={selectedPlan.payment_instructions} planName={selectedPlan.name} />}
    </>;
};