import { Heart, MessageCircle, DollarSign, Bookmark, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PostCardProps {
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  likesCount: number;
  commentsCount: number;
  isLocked: boolean;
}

export const PostCard = ({ 
  mediaUrl, 
  mediaType, 
  caption, 
  likesCount, 
  commentsCount,
  isLocked 
}: PostCardProps) => {
  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Media Section */}
      <div className="relative aspect-square bg-muted">
        {isLocked ? (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md bg-background/50">
            <Lock className="w-20 h-20 text-muted-foreground" />
          </div>
        ) : (
          <>
            {mediaType === 'image' ? (
              <img 
                src={mediaUrl} 
                alt="Post" 
                className="w-full h-full object-cover"
              />
            ) : (
              <video 
                src={mediaUrl} 
                className="w-full h-full object-cover"
                controls
              />
            )}
          </>
        )}
      </div>

      {/* Actions Bar */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Heart className="w-5 h-5" />
              <span className="text-sm">{likesCount}</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">{commentsCount}</span>
            </button>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              <DollarSign className="w-5 h-5" />
            </button>
          </div>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Caption */}
        {caption && !isLocked && (
          <p className="text-sm text-foreground">{caption}</p>
        )}
      </div>
    </Card>
  );
};
