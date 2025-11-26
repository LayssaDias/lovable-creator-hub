import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Profile() {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (data) setProfileData(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Login Button */}
      <div className="flex justify-end p-4">
        <Link to="/auth">
          <Button variant="outline" className="border-border">
            Login
          </Button>
        </Link>
      </div>

      {/* Profile Content */}
      <div className="pb-12">
        <ProfileHeader
          coverImage={profileData?.cover_image_url}
          profileImage={profileData?.profile_image_url}
          creatorName={profileData?.creator_name || "Laryssa Medeiros"}
          handle={profileData?.handle || "@a_larry_medeiross"}
          bio={profileData?.bio || `🔥😈 CONTEÚDO QUENTE E EXPLOSIVO! Sem Censura! 😈🔥
           Prepare-se para uma conversa DELICIOSA e SEM FRESCURA! Aqui, a química rola solta!!
           Sou tão safada quanto você espera e muito mais. Mande aquele "oi" mais safado que você tem e me diga na lata o que você quer!
           CONVERSAS EXCLUSIVAS: Respondo TODOS os meus assinantes.
           FOTOS e VÍDEOS: Envio conteúdo PESADO e exclusivo que vai te deixar viciado.
           Quem entra aqui fica VICIADO. Você nunca mais vai querer sair!`}
          mediaCount={profileData?.media_count || "50k"}
          likesCount={profileData?.likes_count || "100k"}
          commentsCount={profileData?.comments_count || "200K"}
        />

        <div className="mt-8">
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
}
