import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { PaymentModal } from "./PaymentModal";
export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    loadPlans();
  }, []);
  const loadPlans = async () => {
    const {
      data
    } = await supabase.from('subscription_plans').select('*').order('duration_days', {
      ascending: true
    });
    if (data) setPlans(data);
  };
  const handlePlanClick = (plan: any) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };
  return <>
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Assinaturas</h2>
        
        <div className="space-y-3">
          {plans.map(plan => <Card key={plan.id} onClick={() => handlePlanClick(plan)} className="border-border p-4 cursor-pointer hover:border-primary transition-colors bg-[#f6954a] rounded-3xl shadow-md text-black">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-foreground font-medium">
                    {plan.name}
                    {plan.discount_percentage > 0 && ` (${plan.discount_percentage}% off)`}
                  </p>
                  <p className="text-sm text-[#171917]">{plan.description}</p>
                </div>
                <p className="text-lg font-bold text-foreground">
                  R$ {plan.price.toFixed(2)}
                </p>
              </div>
            </Card>)}
        </div>
      </div>

      {selectedPlan && <PaymentModal open={showModal} onOpenChange={setShowModal} qrCodeUrl={selectedPlan.qr_code_image_url} pixKey={selectedPlan.pix_key} beneficiaryName={selectedPlan.beneficiary_name} instructions={selectedPlan.payment_instructions} planName={selectedPlan.name} />}
    </>;
};