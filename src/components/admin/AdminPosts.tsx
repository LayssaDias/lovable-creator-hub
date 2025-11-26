import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const AdminPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({
    media_url: '',
    media_type: 'image',
    caption: '',
    status: 'published'
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setPosts(data);
  };

  const handleCreate = async () => {
    if (!newPost.media_url) {
      toast.error("Adicione a URL da mídia");
      return;
    }

    const { error } = await supabase
      .from('posts')
      .insert(newPost);

    if (error) {
      toast.error("Erro ao criar postagem");
    } else {
      toast.success("Postagem criada!");
      setNewPost({ media_url: '', media_type: 'image', caption: '', status: 'published' });
      loadPosts();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Erro ao deletar");
    } else {
      toast.success("Postagem deletada");
      loadPosts();
    }
  };

  const handleUpdate = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from('posts')
      .update({ [field]: value })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar");
    } else {
      toast.success("Atualizado!");
      loadPosts();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Gerenciar Postagens</h2>

      {/* Create New Post */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Nova Postagem</h3>
        
        <div className="grid gap-4">
          <div>
            <Label>URL da Mídia</Label>
            <Input
              value={newPost.media_url}
              onChange={(e) => setNewPost({...newPost, media_url: e.target.value})}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Tipo de Mídia</Label>
            <Select 
              value={newPost.media_type}
              onValueChange={(value) => setNewPost({...newPost, media_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Imagem</SelectItem>
                <SelectItem value="video">Vídeo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Legenda</Label>
            <Textarea
              value={newPost.caption}
              onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select 
              value={newPost.status}
              onValueChange={(value) => setNewPost({...newPost, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleCreate} className="bg-gradient-primary">
            Criar Postagem
          </Button>
        </div>
      </Card>

      {/* Existing Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="bg-card border-border p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Postagem - {new Date(post.created_at).toLocaleDateString()}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            <div className="grid gap-4">
              <div>
                <Label>URL da Mídia</Label>
                <Input
                  defaultValue={post.media_url}
                  onBlur={(e) => handleUpdate(post.id, 'media_url', e.target.value)}
                />
              </div>

              <div>
                <Label>Legenda</Label>
                <Textarea
                  defaultValue={post.caption || ''}
                  onBlur={(e) => handleUpdate(post.id, 'caption', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Curtidas</Label>
                  <Input
                    type="number"
                    defaultValue={post.likes_count}
                    onBlur={(e) => handleUpdate(post.id, 'likes_count', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Comentários</Label>
                  <Input
                    type="number"
                    defaultValue={post.comments_count}
                    onBlur={(e) => handleUpdate(post.id, 'comments_count', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select 
                    defaultValue={post.status}
                    onValueChange={(value) => handleUpdate(post.id, 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="draft">Rascunho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
