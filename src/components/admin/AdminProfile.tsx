import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const AdminProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    creator_name: "",
    handle: "",
    bio: "",
    cover_image_url: "",
    profile_image_url: "",
    media_count: 0,
    likes_count: 0,
    comments_count: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Usuário não encontrado");
      setLoading(false);
      return;
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      // Update
      const { error } = await supabase
        .from('profiles')
        .update(profile)
        .eq('id', user.id);

      if (error) {
        toast.error("Erro ao atualizar perfil");
      } else {
        toast.success("Perfil atualizado com sucesso!");
      }
    } else {
      // Insert
      const { error } = await supabase
        .from('profiles')
        .insert({ ...profile, id: user.id });

      if (error) {
        toast.error("Erro ao criar perfil");
      } else {
        toast.success("Perfil criado com sucesso!");
      }
    }

    setLoading(false);
  };

  return (
    <Card className="p-6 bg-card border-border">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Configurações de Perfil
      </h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="creator_name">Nome do Criador</Label>
          <Input
            id="creator_name"
            value={profile.creator_name}
            onChange={(e) => setProfile({ ...profile, creator_name: e.target.value })}
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="handle">@Handle</Label>
          <Input
            id="handle"
            value={profile.handle}
            onChange={(e) => setProfile({ ...profile, handle: e.target.value })}
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio/Descrição</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="bg-secondary border-border min-h-24"
          />
        </div>

        <div>
          <Label htmlFor="cover_image_url">URL da Foto de Capa</Label>
          <Input
            id="cover_image_url"
            value={profile.cover_image_url}
            onChange={(e) => setProfile({ ...profile, cover_image_url: e.target.value })}
            placeholder="https://..."
            className="bg-secondary border-border"
          />
        </div>

        <div>
          <Label htmlFor="profile_image_url">URL da Foto de Perfil</Label>
          <Input
            id="profile_image_url"
            value={profile.profile_image_url}
            onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
            placeholder="https://..."
            className="bg-secondary border-border"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="media_count">Mídias</Label>
            <Input
              id="media_count"
              type="number"
              value={profile.media_count}
              onChange={(e) => setProfile({ ...profile, media_count: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <Label htmlFor="likes_count">Curtidas</Label>
            <Input
              id="likes_count"
              type="number"
              value={profile.likes_count}
              onChange={(e) => setProfile({ ...profile, likes_count: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <Label htmlFor="comments_count">Comentários</Label>
            <Input
              id="comments_count"
              type="number"
              value={profile.comments_count}
              onChange={(e) => setProfile({ ...profile, comments_count: parseInt(e.target.value) || 0 })}
              className="bg-secondary border-border"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-primary text-primary-foreground"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </Card>
  );
};
