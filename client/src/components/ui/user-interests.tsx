import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X, PlusCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/contexts/consolidated-language-context";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Common interest categories users can choose from
const SUGGESTED_INTERESTS = [
  "JavaScript", "Python", "Data Science", "Machine Learning", 
  "Web Development", "Mobile Development", "DevOps", "Cloud Computing",
  "Cybersecurity", "Blockchain", "UI/UX Design", "Game Development",
  "Digital Marketing", "Business", "Photography", "Writing",
  "Music", "Art", "Languages", "Personal Development"
];

export function UserInterests() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newInterest, setNewInterest] = useState("");
  
  // Initialize with user's existing interests or empty array
  const [interests, setInterests] = useState<string[]>(
    user?.interests || []
  );

  const updateInterests = useMutation({
    mutationFn: async (interests: string[]) => {
      const res = await apiRequest("PATCH", "/api/user/interests", { interests });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], (oldData: any) => ({
        ...oldData,
        interests: data.interests,
      }));
      toast({
        title: "Interests updated",
        description: "Your interests have been updated successfully",
      });
      
      // Invalidate recommendations to get new ones based on updated interests
      queryClient.invalidateQueries({ queryKey: ["/api/ai/course-recommendations"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update interests",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    // Don't add duplicates
    if (interests.includes(newInterest.trim())) {
      toast({
        title: "Interest already added",
        description: `"${newInterest}" is already in your interests`,
        variant: "destructive",
      });
      return;
    }
    
    const updatedInterests = [...interests, newInterest.trim()];
    setInterests(updatedInterests);
    setNewInterest("");
    
    // Save changes
    updateInterests.mutate(updatedInterests);
  };

  const handleRemoveInterest = (interest: string) => {
    const updatedInterests = interests.filter((i) => i !== interest);
    setInterests(updatedInterests);
    
    // Save changes
    updateInterests.mutate(updatedInterests);
  };

  const handleSuggestedInterest = (interest: string) => {
    if (interests.includes(interest)) return;
    
    const updatedInterests = [...interests, interest];
    setInterests(updatedInterests);
    
    // Save changes
    updateInterests.mutate(updatedInterests);
  };

  // Filter suggested interests that aren't already selected
  const filteredSuggestions = SUGGESTED_INTERESTS.filter(
    (interest) => !interests.includes(interest)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('learningInterests')}</CardTitle>
        <CardDescription>
          {t('addInterestsHelpText')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Add a new interest..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddInterest();
              }
            }}
          />
          <Button 
            onClick={handleAddInterest}
            disabled={!newInterest.trim() || updateInterests.isPending}
          >
            {updateInterests.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlusCircle className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Your Interests</h3>
          {interests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No interests added yet. Add some to get personalized recommendations.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="pl-3 pr-2 py-1">
                  {interest}
                  <button
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    onClick={() => handleRemoveInterest(interest)}
                    disabled={updateInterests.isPending}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {filteredSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Suggested Interests</h3>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.slice(0, 10).map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="cursor-pointer hover:bg-secondary"
                  onClick={() => handleSuggestedInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Adding your interests helps us recommend relevant courses for you
      </CardFooter>
    </Card>
  );
}