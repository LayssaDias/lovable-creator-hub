import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, checkUserRole, checkSubscriptionStatus } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileHeader } from "@/components/ProfileHeader";
import { PostCard } from "@/components/PostCard";
import { ChatModal } from "@/components/ChatModal";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [chatSettings, setChatSettings] = useState<any>(null);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    checkAccess();
    loadData();
  }, []);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      navigate('/auth');
      return;
    }

    const role = await checkUserRole(session.user.id);
    
    if (role === 'admin') {
      setIsSubscribed(true);
      setLoading(false);
      return;
    }

    const hasActiveSubscription = await checkSubscriptionStatus(session.user.id);
    
    if (!hasActiveSubscription) {
      navigate('/expired');
      return;
    }

    setIsSubscribed(true);
    setLoading(false);
  };

  const loadData = async () => {
    // Load profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (profile) setProfileData(profile);

    // Load posts
    const { data: postsData } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (postsData) setPosts(postsData);

    // Load chat settings
    const { data: chat } = await supabase
      .from('chat_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (chat) setChatSettings(chat);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado");
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logout and Chat */}
      <div className="flex justify-between items-center p-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowChatModal(true)}
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <Button onClick={handleLogout} variant="outline">
          Sair
        </Button>
      </div>

      {/* Profile Header */}
      <ProfileHeader
        coverImage={profileData?.cover_image_url}
        profileImage={profileData?.profile_image_url}
        creatorName={profileData?.creator_name || "Creator Name"}
        handle={profileData?.handle || "@handle"}
        bio={profileData?.bio || "CONVERSAS EXCLUSIVAS: Respondo TODOS os meus assinantes.FOTOS e VÍDEOS: Envio conteúdo PESADO e exclusivo que vai te deixar viciado...."}
        mediaCount={profileData?.media_count || 0}
        likesCount={profileData?.likes_count || 0}
        commentsCount={profileData?.comments_count || 0}
      />

      {/* Tabs Navigation */}
      <div className="mt-6">
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-background border-b border-border rounded-none h-12">
            <TabsTrigger 
              value="posts" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Postagens
            </TabsTrigger>
            <TabsTrigger 
              value="media"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
            >
              Mídias
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  mediaUrl={post.media_url}
                  mediaType={post.media_type}
                  caption={post.caption}
                  likesCount={post.likes_count}
                  commentsCount={post.comments_count}
                  isLocked={!isSubscribed}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="media" className="mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-4">
              {posts.map((post) => (
                <div key={post.id} className="relative aspect-square">
                  {!isSubscribed ? (
                    <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-background/50">
                      <MessageCircle className="w-12 h-12 text-muted-foreground" />
                    </div>
                  ) : (
                    <img 
                      src={post.media_url} 
                      alt="Media" 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Modal */}
      <ChatModal
        open={showChatModal}
        onOpenChange={setShowChatModal}
        chatSettings={chatSettings}
      />
    </div>
  );
}
