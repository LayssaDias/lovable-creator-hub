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
          creatorName={profileData?.creator_name || "Creator Name"}
          handle={profileData?.handle || "@handle"}
          bio={profileData?.bio || "Bio do criador..."}
          mediaCount={profileData?.media_count || 0}
          likesCount={profileData?.likes_count || 0}
          commentsCount={profileData?.comments_count || 0}
        />

        <div className="mt-8">
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
}
