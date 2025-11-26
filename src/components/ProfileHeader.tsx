import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  coverImage?: string;
  profileImage?: string;
  creatorName: string;
  handle: string;
  bio: string;
  mediaCount: number;
  likesCount: number;
  commentsCount: number;
}

export const ProfileHeader = ({
  coverImage,
  profileImage,
  creatorName,
  handle,
  bio,
  mediaCount,
  likesCount,
  commentsCount,
}: ProfileHeaderProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Cover Image */}
      <div className="relative w-full h-48 md:h-64 bg-secondary rounded-2xl overflow-hidden">
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="relative px-6 -mt-16">
        <Avatar className="w-32 h-32 border-4 border-background">
          <AvatarImage src={profileImage} alt={creatorName} />
          <AvatarFallback className="text-3xl bg-secondary">
            {creatorName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {creatorName}
          </h1>
          <p className="text-muted-foreground">{handle}</p>
        </div>

        <p className="mt-4 text-foreground leading-relaxed max-w-2xl">
          {bio}
        </p>

        {/* Stats */}
        <div className="flex gap-6 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">📸</span>
            <span className="font-semibold text-foreground">{mediaCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">❤️</span>
            <span className="font-semibold text-foreground">{likesCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">💬</span>
            <span className="font-semibold text-foreground">{commentsCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
