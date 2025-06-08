import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Copy, 
  MessageCircle,
  ExternalLink 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  type?: "course" | "achievement" | "progress" | "general";
  achievement?: {
    name: string;
    rarity: string;
    points: number;
  };
  progress?: {
    courseName: string;
    completionRate: number;
    xpEarned: number;
  };
}

export function SocialShare({ 
  title, 
  description, 
  url = window.location.href,
  type = "general",
  achievement,
  progress 
}: SocialShareProps) {
  const { toast } = useToast();

  const generateShareText = () => {
    switch (type) {
      case "achievement":
        if (achievement) {
          return `🏆 Just unlocked "${achievement.name}" achievement! ${achievement.rarity} rarity, +${achievement.points} points! 🎉 #Learning #Achievement`;
        }
        return `🏆 Just unlocked a new achievement! 🎉 #Learning #Achievement`;
      
      case "progress":
        if (progress) {
          return `📚 Making great progress! ${progress.completionRate}% complete in "${progress.courseName}" and earned ${progress.xpEarned} XP! 💪 #Learning #Progress`;
        }
        return `📚 Making great progress in my learning journey! 💪 #Learning #Progress`;
      
      case "course":
        return `📖 Excited to share this amazing course: "${title}"! ${description || ''} #Education #Learning`;
      
      default:
        return `${title} ${description ? '- ' + description : ''} #Learning #Education`;
    }
  };

  const shareText = generateShareText();
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`
  };

  const handleShare = (platform: string) => {
    const shareUrl = shareUrls[platform as keyof typeof shareUrls];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${url}`);
      toast({
        title: "Link copied!",
        description: "Share text and link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: url,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <CardTitle>Share Your Success</CardTitle>
          {type === "achievement" && achievement && (
            <Badge variant={achievement.rarity === "legendary" ? "default" : "secondary"}>
              {achievement.rarity}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Preview Text */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{shareText}</p>
        </div>

        {/* Achievement Details */}
        {type === "achievement" && achievement && (
          <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold">{achievement.name}</h4>
              <p className="text-sm text-muted-foreground">+{achievement.points} points earned</p>
            </div>
            <Badge variant="outline" className="capitalize">
              {achievement.rarity}
            </Badge>
          </div>
        )}

        {/* Progress Details */}
        {type === "progress" && progress && (
          <div className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <div className="flex-1">
              <h4 className="font-semibold">{progress.courseName}</h4>
              <p className="text-sm text-muted-foreground">
                {progress.completionRate}% complete • {progress.xpEarned} XP earned
              </p>
            </div>
          </div>
        )}

        {/* Share Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2"
          >
            <Twitter className="h-4 w-4 text-sky-500" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2"
          >
            <Linkedin className="h-4 w-4 text-blue-700" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('whatsapp')}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4 text-green-600" />
            WhatsApp
          </Button>
        </div>

        {/* Additional Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex-1"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNativeShare}
            className="flex-1"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            More Options
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}